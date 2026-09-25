import { Router, Request, Response } from 'express';
import multer from 'multer';
import { GenerateRoadmapRequestSchema, DocumentIdParamSchema } from './schema.js';
import { CURATED_LEGAL_SOURCES, getSourcesForWorkflow } from './sources.js';
import { processUploadedFile, getDocumentText, deleteDocument } from './documentService.js';
import { generateLegalRoadmap, generateMockRoadmap, isLiveAiConfigured } from './aiProvider.js';

export const apiRouter = Router();

// Configure multer for memory storage and 5MB limit
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024 // 5 MB max
  },
  fileFilter: (_req, file, cb) => {
    const allowedMimeTypes = [
      'application/pdf',
      'image/jpeg',
      'image/jpg',
      'image/png'
    ];
    const allowedExtensions = ['.pdf', '.jpg', '.jpeg', '.png'];
    const fileExt = file.originalname.toLowerCase().slice(file.originalname.lastIndexOf('.'));

    if (allowedMimeTypes.includes(file.mimetype) || allowedExtensions.includes(fileExt)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF, JPG, JPEG, and PNG documents up to 5MB are accepted.'));
    }
  }
});

// 1. Health check
apiRouter.get('/health', (_req: Request, res: Response) => {
  const liveAi = isLiveAiConfigured();
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'NyayaPath API',
    mode: liveAi ? 'live_ai' : 'mock',
    description: liveAi
      ? 'Live AI roadmap generation connected via Groq (Qwen)'
      : 'Interactive prototype with simulated roadmap generation.'
  });
});

// 2. Curated official sources
apiRouter.get('/sources', (req: Request, res: Response) => {
  const topic = typeof req.query.topic === 'string' ? req.query.topic.slice(0, 50) : undefined;
  const jurisdiction = typeof req.query.jurisdiction === 'string' ? req.query.jurisdiction.slice(0, 100) : undefined;

  if (topic) {
    const filtered = getSourcesForWorkflow(topic, jurisdiction);
    res.json({ sources: filtered, total: filtered.length });
  } else {
    res.json({ sources: CURATED_LEGAL_SOURCES, total: CURATED_LEGAL_SOURCES.length });
  }
});

// 3. Document upload (optional) with clean error handling
apiRouter.post('/upload', (req: Request, res: Response): void => {
  upload.single('document')(req, res, async (err: any) => {
    if (err) {
      res.status(400).json({ error: err.message || 'File upload failed. Supported formats: PDF, JPG, JPEG, PNG (Max 5MB).' });
      return;
    }

    try {
      if (!req.file) {
        res.status(400).json({ error: 'No file uploaded' });
        return;
      }

      const meta = await processUploadedFile(req.file);
      res.json({
        success: true,
        document: {
          id: meta.id,
          originalName: meta.originalName,
          sizeBytes: meta.sizeBytes,
          mimeType: meta.mimeType,
          hasExtractedText: meta.hasExtractedText,
          preview: meta.extractedTextPreview
        }
      });
    } catch (procErr: any) {
      res.status(400).json({ error: procErr.message || 'Error processing uploaded document.' });
    }
  });
});

// 4. Document deletion
apiRouter.delete('/document/:id', (req: Request, res: Response) => {
  const paramValidation = DocumentIdParamSchema.safeParse(req.params);
  if (!paramValidation.success) {
    res.status(400).json({ error: 'Invalid document ID format. Must be a valid UUID.' });
    return;
  }

  const { id } = paramValidation.data;
  const deleted = deleteDocument(id);
  if (deleted) {
    res.json({ success: true, message: 'Document removed from server memory.' });
  } else {
    res.status(404).json({ error: 'Document not found or already deleted.' });
  }
});

// 5. Roadmap generation
apiRouter.post('/roadmap/generate', async (req: Request, res: Response): Promise<void> => {
  try {
    const parsedBody = GenerateRoadmapRequestSchema.safeParse(req.body);
    if (!parsedBody.success) {
      res.status(400).json({
        error: 'Invalid request payload',
        details: parsedBody.error.errors.map(e => `${e.path.join('.')}: ${e.message}`)
      });
      return;
    }

    const { answers: validatedAnswers, documentId } = parsedBody.data;

    // Fetch relevant sources
    const relevantSources = getSourcesForWorkflow(validatedAnswers.workflow, validatedAnswers.state);

    // Fetch optional document text if documentId is provided
    let documentText: string | null = null;
    if (documentId) {
      documentText = getDocumentText(documentId);
    }

    // Generate structured roadmap with infallible fallback
    let roadmap;
    try {
      roadmap = await generateLegalRoadmap(validatedAnswers, relevantSources, documentText);
    } catch (genErr: any) {
      console.warn('generateLegalRoadmap error, falling back to mock:', genErr.message);
      roadmap = generateMockRoadmap(validatedAnswers, relevantSources, documentText);
    }

    res.json({
      success: true,
      roadmap,
      meta: {
        workflow: validatedAnswers.workflow,
        jurisdiction: validatedAnswers.state,
        hasDocumentContext: !!documentText,
        isSimulated: !isLiveAiConfigured(),
        timestamp: new Date().toISOString()
      }
    });
  } catch (err: any) {
    console.error('Unexpected error in /roadmap/generate:', err.message);
    // Even in catastrophic catch, return a fallback mock roadmap if answers can be salvaged
    try {
      const fallbackWf = (req.body?.answers?.workflow as any) || 'rental';
      const fallbackState = req.body?.answers?.state || 'Delhi (NCT)';
      const sources = getSourcesForWorkflow(fallbackWf, fallbackState);
      const fallbackAnswers = {
        workflow: fallbackWf,
        state: fallbackState,
        description: req.body?.answers?.description || 'Legal matter inquiry',
        hasUrgentRisk: false
      };
      const fallbackRoadmap = generateMockRoadmap(fallbackAnswers as any, sources);
      res.json({
        success: true,
        roadmap: fallbackRoadmap,
        meta: {
          workflow: fallbackWf,
          jurisdiction: fallbackState,
          hasDocumentContext: false,
          isSimulated: true,
          timestamp: new Date().toISOString()
        }
      });
    } catch {
      res.status(500).json({
        error: 'Unable to generate legal roadmap at this time. Please try again or consult official legal aid.'
      });
    }
  }
});
