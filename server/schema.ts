import { z } from 'zod';

export const UrgentRiskFactorsSchema = z.object({
  arrestOrPolice: z.boolean().optional(),
  criminalAllegations: z.boolean().optional(),
  domesticViolence: z.boolean().optional(),
  immediatePhysicalDanger: z.boolean().optional(),
  childSafety: z.boolean().optional(),
  immigrationOrDeportation: z.boolean().optional(),
  urgentCourtDeadline: z.boolean().optional(),
  immediateEviction: z.boolean().optional(),
  largeFinancialExposure: z.boolean().optional(),
  otherUrgent: z.boolean().optional()
});

export const QuestionnaireAnswersSchema = z.object({
  workflow: z.enum(['rental', 'employment', 'legal_aid', 'other']),
  state: z.string().trim().min(1, 'State is required').max(100, 'State name is too long'),
  district: z.string().trim().max(100, 'District name is too long').optional(),
  city: z.string().trim().max(100, 'City name is too long').optional(),
  description: z.string().trim().min(10, 'Please describe your situation in at least 10 characters').max(3000, 'Description cannot exceed 3000 characters'),
  dateOrRange: z.string().trim().max(200, 'Date string is too long').optional(),
  hasWrittenDocument: z.enum(['yes', 'no', 'unsure']).optional(),
  documentTypeDescription: z.string().trim().max(200, 'Document description is too long').optional(),
  hasReceivedDeadline: z.enum(['yes', 'no', 'unsure']).optional(),
  deadlineDate: z.string().trim().max(200, 'Deadline string is too long').optional(),
  hasUrgentRisk: z.boolean().default(false),
  urgentRiskFactors: UrgentRiskFactorsSchema.optional(),
  specificDetails: z.record(z.string().max(500)).optional()
});

export const GenerateRoadmapRequestSchema = z.object({
  answers: QuestionnaireAnswersSchema,
  documentId: z.string().uuid('Invalid document ID format').optional().nullable()
});

export const DocumentIdParamSchema = z.object({
  id: z.string().uuid('Invalid document ID format')
});

export const DocumentChecklistItemSchema = z.object({
  name: z.string().min(1).max(200),
  why_needed: z.string().min(1).max(500),
  copy_or_original_note: z.string().min(1).max(200)
});

export const WhereToGoItemSchema = z.object({
  name: z.string().min(1).max(200),
  reason: z.string().min(1).max(500),
  url: z.string().url().refine(u => u.startsWith('https://'), 'URL must use HTTPS protocol'),
  jurisdiction: z.string().min(1).max(100),
  access_mode: z.enum(['Online', 'Offline', 'Online & In-person']).optional()
});

export const RoadmapSourceItemSchema = z.object({
  title: z.string().min(1).max(200),
  url: z.string().url().refine(u => u.startsWith('https://'), 'URL must use HTTPS protocol'),
  authority: z.string().min(1).max(200),
  relevance: z.string().min(1).max(500)
});

export const RoadmapResponseSchema = z.object({
  situation_summary: z.string().min(10).max(2000),
  missing_information: z.array(z.string().max(300)),
  possible_issue_categories: z.array(z.string().max(200)),
  immediate_steps: z.array(z.string().max(400)).min(1).max(3),
  document_checklist: z.array(DocumentChecklistItemSchema).min(1),
  where_to_go: z.array(WhereToGoItemSchema).min(1),
  questions_to_ask: z.array(z.string().max(300)).min(1),
  urgency_level: z.enum(['normal', 'caution', 'urgent']),
  escalation_message: z.string().max(1000),
  sources: z.array(RoadmapSourceItemSchema).min(1),
  limitations: z.array(z.string().max(500)).min(1)
});

export type ValidatedRoadmapResponse = z.infer<typeof RoadmapResponseSchema>;
export type ValidatedQuestionnaireAnswers = z.infer<typeof QuestionnaireAnswersSchema>;
export type ValidatedGenerateRoadmapRequest = z.infer<typeof GenerateRoadmapRequestSchema>;
