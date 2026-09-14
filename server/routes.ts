import { Router, Request, Response } from 'express';
import multer from 'multer';
import { QuestionnaireAnswersSchema } from './schema.js';
import { CURATED_LEGAL_SOURCES, getSourcesForWorkflow } from './sources.js';
import { processUploadedFile, getDocumentText, deleteDocument } from './documentService.js';
import { generateLegalRoadmap } from './aiProvider.js';

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

    if (allowedMimeTypes.includes(file.mimetype) && allowedExtensions.includes(fileExt)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF, JPG, JPEG, and PNG documents up to 5MB are accepted.'));
    }
  }
});

// 1. Health check
apiRouter.get('/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'NyayaPath API',
    mode: process.env.MOCK_MODE === 'true' || !process.env.GEMINI_API_KEY ? 'mock' : 'live_ai'
  });
});

// 2. Curated official sources
apiRouter.get('/sources', (req: Request, res: Response) => {
  const topic = req.query.topic as string | undefined;
  const jurisdiction = req.query.jurisdiction as string | undefined;

  if (topic) {
    const filtered = getSourcesForWorkflow(topic, jurisdiction);
    res.json({ sources: filtered, total: filtered.length });
  } else {
    res.json({ sources: CURATED_LEGAL_SOURCES, total: CURATED_LEGAL_SOURCES.length });
  }
});

// 3. Document upload (optional)
apiRouter.post('/upload', upload.single('document'), async (req: Request, res: Response): Promise<void> => {
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
  } catch (err: any) {
    res.status(400).json({ error: err.message || 'File upload failed' });
  }
});

// 4. Document deletion
apiRouter.delete('/document/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const deleted = deleteDocument(id);
  if (deleted) {
    res.json({ success: true, message: 'Document removed permanently from memory and server store.' });
  } else {
    res.status(404).json({ error: 'Document not found or already deleted.' });
  }
});

// 5. Roadmap generation
apiRouter.post('/roadmap/generate', async (req: Request, res: Response): Promise<void> => {
  try {
    const { answers, documentId } = req.body;

    if (!answers) {
      res.status(400).json({ error: 'Missing questionnaire answers in request body' });
      return;
    }

    // Validate questionnaire input
    const validationResult = QuestionnaireAnswersSchema.safeParse(answers);
    if (!validationResult.success) {
      res.status(400).json({
        error: 'Invalid questionnaire input',
        details: validationResult.error.errors.map(e => `${e.path.join('.')}: ${e.message}`)
      });
      return;
    }

    const validatedAnswers = validationResult.data;

    // Fetch relevant sources
    const relevantSources = getSourcesForWorkflow(validatedAnswers.workflow, validatedAnswers.state);

    // Fetch optional document text if documentId is provided
    let documentText: string | null = null;
    if (documentId) {
      documentText = getDocumentText(documentId);
    }

    // Generate structured roadmap
    const roadmap = await generateLegalRoadmap(validatedAnswers, relevantSources, documentText);

    res.json({
      success: true,
      roadmap,
      meta: {
        workflow: validatedAnswers.workflow,
        jurisdiction: validatedAnswers.state,
        hasDocumentContext: !!documentText,
        timestamp: new Date().toISOString()
      }
    });
  } catch (err: any) {
    console.error('Error generating roadmap:', err.message);
    res.status(500).json({
      error: 'Unable to generate legal roadmap at this time. Please try again or consult official legal aid.'
    });
  }
});
