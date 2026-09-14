import React, { useState, useRef } from 'react';
import { UploadCloud, File, Trash2, ShieldAlert, ArrowLeft, ArrowRight, CheckCircle, Loader2 } from 'lucide-react';
import { UploadedDocumentMeta } from '../types.js';

interface DocumentUploaderProps {
  onGenerate: (documentId?: string) => void;
  onBack: () => void;
  isLoading: boolean;
}

export const DocumentUploader: React.FC<DocumentUploaderProps> = ({
  onGenerate,
  onBack,
  isLoading
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [uploadMeta, setUploadMeta] = useState<UploadedDocumentMeta | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB
  const ALLOWED_TYPES = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];

  const validateAndUpload = async (selectedFile: File) => {
    setErrorMsg(null);

    // Validate size
    if (selectedFile.size > MAX_SIZE_BYTES) {
      setErrorMsg(`File exceeds the 5 MB limit (${(selectedFile.size / (1024 * 1024)).toFixed(1)} MB). Please select a smaller file.`);
      return;
    }

    // Validate type
    const ext = selectedFile.name.toLowerCase().slice(selectedFile.name.lastIndexOf('.'));
    const validExts = ['.pdf', '.jpg', '.jpeg', '.png'];
    if (!ALLOWED_TYPES.includes(selectedFile.type) && !validExts.includes(ext)) {
      setErrorMsg('Invalid file format. Only PDF, JPG, JPEG, and PNG files are accepted.');
      return;
    }

    setFile(selectedFile);
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('document', selectedFile);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || 'Server rejected the file.');
      }

      const data = await res.json();
      setUploadMeta(data.document);
    } catch (err: any) {
      setErrorMsg(err.message || 'File upload failed. You may proceed without uploading.');
      setFile(null);
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndUpload(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndUpload(e.dataTransfer.files[0]);
    }
  };

  const handleRemoveFile = async () => {
    if (uploadMeta?.id) {
      try {
        await fetch(`/api/document/${uploadMeta.id}`, { method: 'DELETE' });
      } catch (_) {}
    }
    setFile(null);
    setUploadMeta(null);
    setErrorMsg(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="card" style={{ maxWidth: '820px', margin: '0 auto' }}>
      {/* Progress Header */}
      <div className="progress-bar-container" style={{ margin: '-0.5rem 0 1.5rem 0', padding: '1rem' }}>
        <div className="progress-header">
          <span>Step 3 of 4: Document Reference (Optional)</span>
          <span>75% Completed</span>
        </div>
        <div className="progress-track">
          <div className="progress-fill" style={{ width: '75%' }}></div>
        </div>
      </div>

      <div style={{ marginBottom: '1.5rem' }}>
        <h2>Attach a Document for Context (Optional)</h2>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.92rem' }}>
          Upload a copy of your rent agreement, offer letter, notice, or salary slip. We will extract relevant clauses server-side to tailor your roadmap.
        </p>
      </div>

      {/* Privacy Notice Banner */}
      <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 'var(--radius-md)', padding: '1rem 1.25rem', marginBottom: '1.75rem', display: 'flex', gap: '0.75rem' }}>
        <ShieldAlert size={20} color="#1d4ed8" style={{ flexShrink: 0, marginTop: '0.1rem' }} />
        <div style={{ fontSize: '0.86rem', color: '#1e40af', lineHeight: 1.5 }}>
          <strong>Privacy Safeguard:</strong> Please do <strong>not</strong> upload unnecessary Aadhaar numbers, bank account passwords, or private biometric records. All uploaded files are stored temporarily in volatile server memory and can be permanently deleted with one click.
        </div>
      </div>

      {errorMsg && (
        <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#b91c1c', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', fontSize: '0.88rem' }}>
          {errorMsg}
        </div>
      )}

      {/* Dropzone */}
      {!file && (
        <div
          className={`upload-dropzone ${isDragOver ? 'dragover' : ''}`}
          onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: 'none' }}
            accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/*"
            onChange={handleFileChange}
          />
          <UploadCloud size={44} color="var(--color-primary-accent)" style={{ margin: '0 auto 0.75rem auto' }} />
          <h4 style={{ fontSize: '1.1rem', marginBottom: '0.35rem' }}>Click or drag a file to upload</h4>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.88rem' }}>
            Supported formats: PDF, JPG, JPEG, PNG (Max 5 MB)
          </p>
          <span className="btn btn-outline-primary btn-sm" style={{ marginTop: '1rem' }}>
            Browse Files
          </span>
        </div>
      )}

      {/* Loading State during upload */}
      {isUploading && (
        <div style={{ padding: '2rem', textAlign: 'center' }}>
          <Loader2 size={32} className="spin" style={{ margin: '0 auto 0.5rem auto', color: 'var(--color-primary-light)' }} />
          <p style={{ fontSize: '0.92rem', color: 'var(--color-text-muted)' }}>
            Safely processing file and extracting relevant text...
          </p>
        </div>
      )}

      {/* Uploaded File Card */}
      {uploadMeta && !isUploading && (
        <div className="uploaded-file-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <File size={28} color="var(--color-primary-light)" />
            <div>
              <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{uploadMeta.originalName}</div>
              <div style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>
                {(uploadMeta.sizeBytes / 1024).toFixed(1)} KB • {uploadMeta.mimeType}
              </div>
              {uploadMeta.hasExtractedText ? (
                <div style={{ fontSize: '0.78rem', color: 'var(--color-emerald)', marginTop: '0.2rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <CheckCircle size={12} /> Text extracted successfully for roadmap context
                </div>
              ) : (
                <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', marginTop: '0.2rem' }}>
                  Metadata stored; text not directly extractable (e.g. image/scanned)
                </div>
              )}
            </div>
          </div>

          <button
            type="button"
            className="btn btn-secondary btn-sm"
            style={{ color: '#b91c1c', borderColor: '#fca5a5' }}
            onClick={handleRemoveFile}
            title="Delete document permanently from server memory"
          >
            <Trash2 size={15} />
            Remove
          </button>
        </div>
      )}

      {/* Actions */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '2.5rem' }}>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={onBack}
          disabled={isLoading}
        >
          <ArrowLeft size={16} />
          Back
        </button>

        <button
          type="button"
          className="btn btn-primary"
          onClick={() => onGenerate(uploadMeta?.id)}
          disabled={isLoading || isUploading}
        >
          {isLoading ? (
            <>
              <Loader2 size={16} className="spin" />
              <span>Generating Your Roadmap...</span>
            </>
          ) : (
            <>
              <span>{uploadMeta ? 'Generate Roadmap with Document' : 'Generate Roadmap (Without Document)'}</span>
              <ArrowRight size={16} />
            </>
          )}
        </button>
      </div>
    </div>
  );
};
