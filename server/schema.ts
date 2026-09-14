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
  state: z.string().min(1, 'State is required'),
  district: z.string().optional(),
  city: z.string().optional(),
  description: z.string().min(10, 'Please describe your situation in at least 10 characters'),
  dateOrRange: z.string().optional(),
  hasWrittenDocument: z.enum(['yes', 'no', 'unsure']).optional(),
  documentTypeDescription: z.string().optional(),
  hasReceivedDeadline: z.enum(['yes', 'no', 'unsure']).optional(),
  deadlineDate: z.string().optional(),
  hasUrgentRisk: z.boolean(),
  urgentRiskFactors: UrgentRiskFactorsSchema.optional(),
  specificDetails: z.record(z.string()).optional()
});

export const DocumentChecklistItemSchema = z.object({
  name: z.string().min(1),
  why_needed: z.string().min(1),
  copy_or_original_note: z.string().min(1)
});

export const WhereToGoItemSchema = z.object({
  name: z.string().min(1),
  reason: z.string().min(1),
  url: z.string().url(),
  jurisdiction: z.string().min(1),
  access_mode: z.enum(['Online', 'Offline', 'Online & In-person']).optional()
});

export const RoadmapSourceItemSchema = z.object({
  title: z.string().min(1),
  url: z.string().url(),
  authority: z.string().min(1),
  relevance: z.string().min(1)
});

export const RoadmapResponseSchema = z.object({
  situation_summary: z.string().min(10),
  missing_information: z.array(z.string()),
  possible_issue_categories: z.array(z.string()),
  immediate_steps: z.array(z.string()).min(1).max(3),
  document_checklist: z.array(DocumentChecklistItemSchema).min(1),
  where_to_go: z.array(WhereToGoItemSchema).min(1),
  questions_to_ask: z.array(z.string()).min(1),
  urgency_level: z.enum(['normal', 'caution', 'urgent']),
  escalation_message: z.string(),
  sources: z.array(RoadmapSourceItemSchema).min(1),
  limitations: z.array(z.string()).min(1)
});

export type ValidatedRoadmapResponse = z.infer<typeof RoadmapResponseSchema>;
export type ValidatedQuestionnaireAnswers = z.infer<typeof QuestionnaireAnswersSchema>;
