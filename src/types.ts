export type WorkflowCategory = 'rental' | 'employment' | 'legal_aid' | 'other';

export type AppStage = 'landing' | 'category' | 'questionnaire' | 'upload' | 'roadmap';

export type UrgencyLevel = 'normal' | 'caution' | 'urgent';

export interface UrgentRiskFactors {
  arrestOrPolice?: boolean;
  criminalAllegations?: boolean;
  domesticViolence?: boolean;
  immediatePhysicalDanger?: boolean;
  childSafety?: boolean;
  immigrationOrDeportation?: boolean;
  urgentCourtDeadline?: boolean;
  immediateEviction?: boolean;
  largeFinancialExposure?: boolean;
  otherUrgent?: boolean;
}

export interface QuestionnaireAnswers {
  workflow: WorkflowCategory;
  state: string;
  district?: string;
  city?: string;
  description: string;
  dateOrRange?: string;
  hasWrittenDocument?: 'yes' | 'no' | 'unsure';
  documentTypeDescription?: string;
  hasReceivedDeadline?: 'yes' | 'no' | 'unsure';
  deadlineDate?: string;
  hasUrgentRisk: boolean;
  urgentRiskFactors?: UrgentRiskFactors;
  specificDetails?: Record<string, string>;
}

export interface DocumentChecklistItem {
  name: string;
  why_needed: string;
  copy_or_original_note: string;
}

export interface WhereToGoItem {
  name: string;
  reason: string;
  url: string;
  jurisdiction: string;
  access_mode?: 'Online' | 'Offline' | 'Online & In-person';
}

export interface RoadmapSourceItem {
  title: string;
  url: string;
  authority: string;
  relevance: string;
}

export interface RoadmapResponse {
  situation_summary: string;
  missing_information: string[];
  possible_issue_categories: string[];
  immediate_steps: string[];
  document_checklist: DocumentChecklistItem[];
  where_to_go: WhereToGoItem[];
  questions_to_ask: string[];
  urgency_level: UrgencyLevel;
  escalation_message: string;
  sources: RoadmapSourceItem[];
  limitations: string[];
}

export interface LegalSource {
  id: string;
  title: string;
  url: string;
  authority: string;
  topic: 'rental' | 'employment' | 'legal_aid' | 'general';
  jurisdiction: string;
  relevance: string;
  lastChecked: string;
  isOfficial: boolean;
}

export interface UploadedDocumentMeta {
  id: string;
  originalName: string;
  mimeType: string;
  sizeBytes: number;
  extractedTextPreview?: string;
  hasExtractedText: boolean;
  uploadedAt: Date;
}
