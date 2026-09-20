import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  QuestionnaireAnswersSchema,
  RoadmapResponseSchema,
  GenerateRoadmapRequestSchema,
  DocumentIdParamSchema
} from '../server/schema.js';
import { CURATED_LEGAL_SOURCES, getSourcesForWorkflow } from '../server/sources.js';
import {
  generateMockRoadmap,
  isLiveAiConfigured,
  isApprovedOfficialUrl,
  cleanJsonResponse
} from '../server/aiProvider.js';
import {
  validateDocumentFile,
  deleteDocument,
  getDocumentText,
  processUploadedFile
} from '../server/documentService.js';
import { QuestionnaireAnswers } from '../server/types.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe('NyayaPath Automated Test Suite (23 Core Checks)', () => {

  // 1. Valid rental questionnaire
  test('1. accepts valid rental questionnaire', () => {
    const input: QuestionnaireAnswers = {
      workflow: 'rental',
      state: 'Karnataka',
      district: 'Bengaluru Urban',
      description: 'Landlord refusing to return security deposit of Rs 80,000 after 11-month lease ended.',
      hasWrittenDocument: 'yes',
      documentTypeDescription: 'Registered Lease Agreement',
      hasReceivedDeadline: 'no',
      hasUrgentRisk: false
    };
    const result = QuestionnaireAnswersSchema.safeParse(input);
    assert.equal(result.success, true);
  });

  // 2. Valid employment questionnaire
  test('2. accepts valid employment questionnaire', () => {
    const input: QuestionnaireAnswers = {
      workflow: 'employment',
      state: 'Maharashtra',
      district: 'Pune',
      description: 'Employer is withholding my relieving letter and full-and-final settlement dues of 2 months.',
      hasWrittenDocument: 'yes',
      documentTypeDescription: 'Appointment Letter',
      hasReceivedDeadline: 'no',
      hasUrgentRisk: false
    };
    const result = QuestionnaireAnswersSchema.safeParse(input);
    assert.equal(result.success, true);
  });

  // 3. Valid legal-aid questionnaire
  test('3. accepts valid legal-aid questionnaire', () => {
    const input: QuestionnaireAnswers = {
      workflow: 'legal_aid',
      state: 'Delhi (NCT)',
      district: 'South Delhi',
      description: 'Need free legal aid for maintenance dispute; family income is below state legal aid threshold.',
      hasWrittenDocument: 'no',
      hasReceivedDeadline: 'no',
      hasUrgentRisk: false
    };
    const result = QuestionnaireAnswersSchema.safeParse(input);
    assert.equal(result.success, true);
  });

  // 4. Invalid workflow rejected
  test('4. rejects invalid workflow category', () => {
    const invalidInput = {
      workflow: 'cryptocurrency_arbitration',
      state: 'Karnataka',
      description: 'Valid description with sufficient length for testing.',
      hasUrgentRisk: false
    };
    const result = QuestionnaireAnswersSchema.safeParse(invalidInput);
    assert.equal(result.success, false);
  });

  // 5. Missing state rejected
  test('5. rejects missing state', () => {
    const invalidInput = {
      workflow: 'rental',
      state: '',
      description: 'Valid description with sufficient length for testing.',
      hasUrgentRisk: false
    };
    const result = QuestionnaireAnswersSchema.safeParse(invalidInput);
    assert.equal(result.success, false);
  });

  // 6. Empty or too-short description rejected (<10 chars)
  test('6. rejects description that is too short (<10 chars)', () => {
    const invalidInput = {
      workflow: 'rental',
      state: 'Delhi (NCT)',
      description: 'Help me',
      hasUrgentRisk: false
    };
    const result = QuestionnaireAnswersSchema.safeParse(invalidInput);
    assert.equal(result.success, false);
  });

  // 7. Excessively long input rejected
  test('7. rejects excessively long description (>3000 chars)', () => {
    const invalidInput = {
      workflow: 'rental',
      state: 'Delhi (NCT)',
      description: 'A'.repeat(3001),
      hasUrgentRisk: false
    };
    const result = QuestionnaireAnswersSchema.safeParse(invalidInput);
    assert.equal(result.success, false);
  });

  // 8. Valid roadmap schema accepted
  test('8. accepts valid structured roadmap matching all required fields', () => {
    const validRoadmap = {
      situation_summary: 'You are navigating a tenancy security deposit dispute in Bengaluru under Karnataka norms.',
      missing_information: ['Copy of move-in inspection report'],
      possible_issue_categories: ['Residential Tenancy', 'Contractual Dispute'],
      immediate_steps: [
        'Collect rent receipts and lease agreement.',
        'Document all communications with the landlord.',
        'Obtain signed handover acknowledgment before moving.'
      ],
      document_checklist: [
        {
          name: 'Registered Lease Agreement',
          why_needed: 'Defines deduction clauses and refund terms.',
          copy_or_original_note: 'Scanned PDF or physical photocopy is sufficient.'
        }
      ],
      where_to_go: [
        {
          name: 'District Legal Services Authority (DLSA)',
          reason: 'Free legal counseling and mediation desk.',
          url: 'https://nalsa.gov.in/legal-aid/',
          jurisdiction: 'Karnataka',
          access_mode: 'Online & In-person'
        }
      ],
      questions_to_ask: [
        'What are the permissible statutory deductions from deposit under local tenancy norms?'
      ],
      urgency_level: 'normal',
      escalation_message: 'This roadmap provides general legal information and preparation assistance.',
      sources: [
        {
          title: 'NALSA Legal Aid Schemes',
          url: 'https://nalsa.gov.in/legal-aid/',
          authority: 'National Legal Services Authority',
          relevance: 'Official statutory legal aid criteria.'
        }
      ],
      limitations: [
        'General information only; not a substitute for an advocate.'
      ]
    };
    const result = RoadmapResponseSchema.safeParse(validRoadmap);
    assert.equal(result.success, true);
  });

  // 9. Roadmap with more than three immediate actions rejected
  test('9. rejects roadmap with more than 3 immediate steps (prompt safety rule)', () => {
    const invalidRoadmap = {
      situation_summary: 'Test summary here with sufficient length.',
      missing_information: ['Inspection record'],
      possible_issue_categories: ['Tenancy'],
      immediate_steps: ['Step 1', 'Step 2', 'Step 3', 'Step 4'], // 4 items -> MUST FAIL
      document_checklist: [{ name: 'Doc', why_needed: 'Need', copy_or_original_note: 'Copy' }],
      where_to_go: [{ name: 'DLSA', reason: 'Help', url: 'https://nalsa.gov.in/', jurisdiction: 'India' }],
      questions_to_ask: ['Question 1'],
      urgency_level: 'normal',
      escalation_message: 'Information roadmap.',
      sources: [{ title: 'NALSA', url: 'https://nalsa.gov.in/', authority: 'Gov', relevance: 'Rel' }],
      limitations: ['Limitation']
    };
    const result = RoadmapResponseSchema.safeParse(invalidRoadmap);
    assert.equal(result.success, false);
  });

  // 10. Urgent physical-danger scenario
  test('10. handles urgent physical-danger scenario with urgent level and emergency helplines', () => {
    const urgentInput: QuestionnaireAnswers = {
      workflow: 'rental',
      state: 'Delhi (NCT)',
      description: 'Landlord brought goons and threatened immediate physical eviction today.',
      hasWrittenDocument: 'yes',
      hasUrgentRisk: true,
      urgentRiskFactors: {
        immediatePhysicalDanger: true,
        immediateEviction: true
      }
    };
    const sources = getSourcesForWorkflow('rental', 'Delhi (NCT)');
    const roadmap = generateMockRoadmap(urgentInput, sources);

    assert.equal(roadmap.urgency_level, 'urgent');
    assert.match(roadmap.escalation_message, /URGENT ATTENTION REQUIRED/);
    assert.match(roadmap.escalation_message, /112/);
  });

  // 11. Court-deadline scenario
  test('11. handles court-deadline scenario with caution level and time-sensitive escalation', () => {
    const deadlineInput: QuestionnaireAnswers = {
      workflow: 'employment',
      state: 'Maharashtra',
      description: 'Received a 7-day statutory legal notice to reply to a non-compete allegation.',
      hasReceivedDeadline: 'yes',
      deadlineDate: 'Within 7 days',
      hasUrgentRisk: false
    };
    const sources = getSourcesForWorkflow('employment', 'Maharashtra');
    const roadmap = generateMockRoadmap(deadlineInput, sources);

    assert.equal(roadmap.urgency_level, 'caution');
    assert.match(roadmap.escalation_message, /TIME-SENSITIVE/);
  });

  // 12. Normal non-urgent scenario
  test('12. handles normal non-urgent inquiry with normal level', () => {
    const normalInput: QuestionnaireAnswers = {
      workflow: 'rental',
      state: 'Karnataka',
      description: 'Looking to understand customary notice period rules before giving notice to landlord.',
      hasWrittenDocument: 'yes',
      hasReceivedDeadline: 'no',
      hasUrgentRisk: false
    };
    const sources = getSourcesForWorkflow('rental', 'Karnataka');
    const roadmap = generateMockRoadmap(normalInput, sources);

    assert.equal(roadmap.urgency_level, 'normal');
  });

  // 13. All supported workflows produce a valid roadmap
  test('13. all supported workflows produce valid schema-compliant roadmaps', () => {
    const workflows: ('rental' | 'employment' | 'legal_aid' | 'other')[] = [
      'rental',
      'employment',
      'legal_aid',
      'other'
    ];

    for (const wf of workflows) {
      const input: QuestionnaireAnswers = {
        workflow: wf,
        state: 'Tamil Nadu',
        district: 'Chennai',
        description: `Detailed inquiry regarding ${wf} under Indian jurisdiction rules and applicable procedures.`,
        hasWrittenDocument: 'yes',
        hasUrgentRisk: false
      };
      const sources = getSourcesForWorkflow(wf, 'Tamil Nadu');
      const roadmap = generateMockRoadmap(input, sources);
      const validation = RoadmapResponseSchema.safeParse(roadmap);

      assert.equal(validation.success, true, `Workflow ${wf} must produce valid schema output`);
      assert.ok(roadmap.immediate_steps.length <= 3, 'Must have at most 3 immediate steps');
      assert.ok(roadmap.document_checklist.length >= 1, 'Must have document checklist');
      assert.ok(roadmap.where_to_go.length >= 1, 'Must have official authorities');
      assert.ok(roadmap.sources.length >= 1, 'Must cite approved sources');
    }
  });

  // 14. Official sources use HTTPS
  test('14. all official sources use HTTPS protocol', () => {
    assert.ok(CURATED_LEGAL_SOURCES.length >= 5);
    for (const src of CURATED_LEGAL_SOURCES) {
      assert.ok(src.url.startsWith('https://'), `Source ${src.id} URL must use HTTPS: ${src.url}`);
    }
  });

  // 15. Official source URLs belong to approved sources
  test('15. official source URLs belong to approved domains', () => {
    for (const src of CURATED_LEGAL_SOURCES) {
      assert.equal(src.isOfficial, true, `Source ${src.id} must be flagged as official`);
      assert.equal(isApprovedOfficialUrl(src.url), true, `Source URL ${src.url} must belong to approved domains`);
    }
  });

  // 16. Invalid document type rejected
  test('16. rejects document with invalid extension or MIME type', () => {
    const invalidExtFile = {
      buffer: Buffer.from('console.log("malicious")'),
      originalname: 'script.exe',
      mimetype: 'application/x-msdownload',
      size: 24
    };
    const result = validateDocumentFile(invalidExtFile);
    assert.equal(result.valid, false);
    assert.match(result.error || '', /Invalid file extension/);
  });

  // 17. Oversized document rejected
  test('17. rejects oversized document (>5MB)', () => {
    const oversizedFile = {
      buffer: Buffer.alloc(100),
      originalname: 'large.pdf',
      mimetype: 'application/pdf',
      size: 6 * 1024 * 1024 // 6 MB
    };
    const result = validateDocumentFile(oversizedFile);
    assert.equal(result.valid, false);
    assert.match(result.error || '', /exceeds maximum/);
  });

  // 18. Empty document rejected
  test('18. rejects empty document (0 bytes)', () => {
    const emptyFile = {
      buffer: Buffer.alloc(0),
      originalname: 'empty.pdf',
      mimetype: 'application/pdf',
      size: 0
    };
    const result = validateDocumentFile(emptyFile);
    assert.equal(result.valid, false);
    assert.match(result.error || '', /Empty file detected/);
  });

  // 19. Missing document ID handled safely
  test('19. handles missing or invalid document ID safely', () => {
    // 19a. Missing documentId in generate request should succeed
    const validRequestNoDoc = {
      answers: {
        workflow: 'rental',
        state: 'Karnataka',
        description: 'Notice period dispute with landlord regarding vacating premises.',
        hasUrgentRisk: false
      }
    };
    const reqResult = GenerateRoadmapRequestSchema.safeParse(validRequestNoDoc);
    assert.equal(reqResult.success, true);

    // 19b. Invalid non-UUID documentId rejected by schema
    const invalidDocReq = {
      answers: validRequestNoDoc.answers,
      documentId: 'not-a-valid-uuid-../../etc'
    };
    const invalidResult = GenerateRoadmapRequestSchema.safeParse(invalidDocReq);
    assert.equal(invalidResult.success, false);

    // 19c. Invalid UUID in delete parameter rejected
    const invalidParam = DocumentIdParamSchema.safeParse({ id: 'bad-id' });
    assert.equal(invalidParam.success, false);

    // 19d. Querying non-existent document returns null safely without throwing
    const fetched = getDocumentText('00000000-0000-0000-0000-000000000000');
    assert.equal(fetched, null);
  });

  // 20. Document deletion behavior
  test('20. verifies document upload processing and subsequent deletion behavior', async () => {
    // Simulate valid PDF with %PDF magic header
    const dummyPdf = Buffer.from('%PDF-1.4\nTest rental agreement clauses for mock testing.');
    const mockFile: any = {
      buffer: dummyPdf,
      originalname: 'test_agreement.pdf',
      mimetype: 'application/pdf',
      size: dummyPdf.length
    };

    const meta = await processUploadedFile(mockFile);
    assert.ok(meta.id, 'Uploaded document should be assigned a UUID');
    assert.equal(meta.originalName, 'test_agreement.pdf');

    // Text exists in store
    const storedText = getDocumentText(meta.id);
    assert.ok(storedText !== null);

    // First deletion should return true
    const deleted = deleteDocument(meta.id);
    assert.equal(deleted, true);

    // Second deletion should return false (already purged)
    const deletedAgain = deleteDocument(meta.id);
    assert.equal(deletedAgain, false);

    // Text should now be null
    assert.equal(getDocumentText(meta.id), null);
  });

  // 21. Missing Gemini key falls back to mock mode
  test('21. falls back to mock mode when Gemini key is absent or provider is mock', () => {
    const originalKey = process.env.GEMINI_API_KEY;
    const originalProvider = process.env.AI_PROVIDER;

    try {
      delete process.env.GEMINI_API_KEY;
      process.env.AI_PROVIDER = 'mock';
      assert.equal(isLiveAiConfigured(), false, 'Should be in mock mode when key is absent');

      process.env.GEMINI_API_KEY = 'short';
      assert.equal(isLiveAiConfigured(), false, 'Should be in mock mode when key is invalid/short');
    } finally {
      if (originalKey) process.env.GEMINI_API_KEY = originalKey;
      else delete process.env.GEMINI_API_KEY;
      if (originalProvider) process.env.AI_PROVIDER = originalProvider;
      else delete process.env.AI_PROVIDER;
    }
  });

  // 22. Malformed AI output is rejected or safely falls back
  test('22. cleans, sanitizes, and validates malformed or candidate AI output', () => {
    // 22a. Extra steps clamped to 3
    const rawAiOutputWithExtraSteps = JSON.stringify({
      situation_summary: 'Test summary with enough characters for validation.',
      missing_information: [],
      possible_issue_categories: ['Category 1'],
      immediate_steps: ['Step 1', 'Step 2', 'Step 3', 'Step 4', 'Step 5'],
      document_checklist: [{ name: 'Doc', why_needed: 'Why', copy_or_original_note: 'Note' }],
      where_to_go: [{ name: 'Portal', reason: 'Reason', url: 'http://malicious-external-site.com', jurisdiction: 'India' }],
      questions_to_ask: ['Q1'],
      urgency_level: 'normal',
      escalation_message: 'Notice',
      sources: [{ title: 'Source', url: 'http://arbitrary-unapproved-site.com', authority: 'Auth', relevance: 'Rel' }],
      limitations: ['Limitation 1']
    });

    const cleaned = cleanJsonResponse(rawAiOutputWithExtraSteps);
    assert.equal(cleaned.immediate_steps.length, 3, 'Steps must be clamped to 3');
    // Unapproved URLs must be replaced with approved official domains
    assert.equal(cleaned.where_to_go[0].url, 'https://ecourts.gov.in/');
    assert.equal(cleaned.sources[0].url, 'https://nalsa.gov.in/legal-aid/');

    // 22b. Schema validation on cleaned object succeeds
    const validated = RoadmapResponseSchema.safeParse(cleaned);
    assert.equal(validated.success, true);
  });

  // 23. No secret-like values exist in tracked source files
  test('23. no secret keys or credentials exist in tracked source files', () => {
    const rootDir = path.resolve(__dirname, '..');
    const filesToCheck = [
      path.join(rootDir, 'README.md'),
      path.join(rootDir, '.env.example'),
      path.join(rootDir, 'server', 'index.ts'),
      path.join(rootDir, 'server', 'routes.ts'),
      path.join(rootDir, 'server', 'aiProvider.ts'),
      path.join(rootDir, 'server', 'schema.ts'),
      path.join(rootDir, 'server', 'documentService.ts'),
      path.join(rootDir, 'server', 'sources.ts'),
      path.join(rootDir, 'src', 'App.tsx')
    ];

    // Standard pattern for Google API keys: AIzaSy... (39 chars)
    const geminiKeyRegex = /AIza[0-9A-Za-z-_]{35}/;
    // Generic private key regex
    const privateKeyRegex = /-----BEGIN [A-Z ]*PRIVATE KEY-----/;

    for (const filePath of filesToCheck) {
      if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, 'utf8');
        assert.equal(
          geminiKeyRegex.test(content),
          false,
          `Real API key pattern found in ${path.basename(filePath)}`
        );
        assert.equal(
          privateKeyRegex.test(content),
          false,
          `Private key pattern found in ${path.basename(filePath)}`
        );
      }
    }
  });

});
