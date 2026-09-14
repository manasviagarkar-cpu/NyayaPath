import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import pdfParse from 'pdf-parse';
import { UploadedDocumentMeta } from './types.js';

interface StoredDocument {
  meta: UploadedDocumentMeta;
  extractedText: string;
  buffer?: Buffer;
  tempFilePath?: string;
  createdAt: number;
}

// In-memory / temporary store for active session documents
const documentStore = new Map<string, StoredDocument>();

// Cleanup stale documents after 1 hour
setInterval(() => {
  const oneHourAgo = Date.now() - 60 * 60 * 1000;
  for (const [id, doc] of documentStore.entries()) {
    if (doc.createdAt < oneHourAgo) {
      if (doc.tempFilePath && fs.existsSync(doc.tempFilePath)) {
        try { fs.unlinkSync(doc.tempFilePath); } catch (_) {}
      }
      documentStore.delete(id);
    }
  }
}, 10 * 60 * 1000);

export async function processUploadedFile(file: Express.Multer.File): Promise<UploadedDocumentMeta> {
  const id = crypto.randomUUID();
  let extractedText = '';
  let hasExtractedText = false;

  const isPdf = file.mimetype === 'application/pdf' || file.originalname.toLowerCase().endsWith('.pdf');
  const isImage = file.mimetype.startsWith('image/');

  if (isPdf) {
    try {
      const data = await pdfParse(file.buffer);
      // Clean up extracted text: limit length to 8000 characters for token safety
      extractedText = (data.text || '').replace(/\s+/g, ' ').trim();
      if (extractedText.length > 8000) {
        extractedText = extractedText.substring(0, 8000) + '... [Document text truncated for processing]';
      }
      hasExtractedText = extractedText.length > 20;
    } catch (err) {
      // PDF might be scanned or encrypted
      extractedText = '[Notice: Text could not be extracted directly from this PDF. It may be scanned or password-protected.]';
      hasExtractedText = false;
    }
  } else if (isImage) {
    // Images: As per requirements, do not invent fake OCR. State clearly that image metadata was received.
    extractedText = `[Image document uploaded: ${file.originalname} (${(file.size / 1024).toFixed(1)} KB). Text was not automatically extracted from this image format. Key details should be verified against the visual document.]`;
    hasExtractedText = false;
  }

  const meta: UploadedDocumentMeta = {
    id,
    originalName: file.originalname,
    mimeType: file.mimetype,
    sizeBytes: file.size,
    extractedTextPreview: hasExtractedText ? extractedText.slice(0, 200) + '...' : undefined,
    hasExtractedText,
    uploadedAt: new Date()
  };

  documentStore.set(id, {
    meta,
    extractedText,
    createdAt: Date.now()
  });

  return meta;
}

export function getDocumentText(id: string): string | null {
  const doc = documentStore.get(id);
  return doc ? doc.extractedText : null;
}

export function getDocumentMeta(id: string): UploadedDocumentMeta | null {
  const doc = documentStore.get(id);
  return doc ? doc.meta : null;
}

export function deleteDocument(id: string): boolean {
  const doc = documentStore.get(id);
  if (!doc) return false;

  if (doc.tempFilePath && fs.existsSync(doc.tempFilePath)) {
    try {
      fs.unlinkSync(doc.tempFilePath);
    } catch (_) {}
  }
  documentStore.delete(id);
  return true;
}
