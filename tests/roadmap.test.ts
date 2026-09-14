import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { QuestionnaireAnswersSchema, RoadmapResponseSchema } from '../server/schema.js';
import { CURATED_LEGAL_SOURCES, getSourcesForWorkflow } from '../server/sources.js';
import { generateMockRoadmap } from '../server/aiProvider.js';
import { deleteDocument } from '../server/documentService.js';
import { QuestionnaireAnswers } from '../server/types.js';

describe('NyayaPath Automated Test Suite', () => {

  // 1. Questionnaire input validation
  describe('Questionnaire Answers Validation', () => {
    test('accepts valid questionnaire answers', () => {
      const validAnswers: QuestionnaireAnswers = {
        workflow: 'rental',
        state: 'Karnataka',
        district: 'Bengaluru Urban',
        description: 'Landlord is refusing to return my security deposit of 80,000 INR.',
        hasWrittenDocument: 'yes',
        hasReceivedDeadline: 'no',
        hasUrgentRisk: false
      };

      const result = QuestionnaireAnswersSchema.safeParse(validAnswers);
      assert.equal(result.success, true);
    });

    test('rejects description that is too short (<10 chars)', () => {
      const invalidAnswers = {
        workflow: 'rental',
        state: 'Delhi (NCT)',
        description: 'Help me',
        hasUrgentRisk: false
      };

      const result = QuestionnaireAnswersSchema.safeParse(invalidAnswers);
      assert.equal(result.success, false);
    });

    test('rejects missing state', () => {
      const invalidAnswers = {
        workflow: 'employment',
        state: '',
        description: 'Notice period dispute with company.',
        hasUrgentRisk: false
      };

      const result = QuestionnaireAnswersSchema.safeParse(invalidAnswers);
      assert.equal(result.success, false);
    });
  });

  // 2. Roadmap response schema validation
  describe('Roadmap Output Schema Validation', () => {
    test('accepts valid structured roadmap matching all 10 required fields', () => {
      const validRoadmap = {
        situation_summary: 'You appear to be dealing with a security deposit dispute under tenancy norms.',
        missing_information: ['Copy of move-in inspection report'],
        possible_issue_categories: ['Residential Tenancy', 'Contractual Dispute'],
        immediate_steps: [
          'Collect rent receipts',
          'Document messages with landlord',
          'Avoid handing keys without written acknowledgment'
        ],
        document_checklist: [
          {
            name: 'Lease Agreement',
            why_needed: 'Specifies deduction and deposit return clauses',
            copy_or_original_note: 'Photocopy is sufficient'
          }
        ],
        where_to_go: [
          {
            name: 'District Legal Services Authority (DLSA)',
            reason: 'Free legal counseling and mediation',
            url: 'https://nalsa.gov.in/legal-aid/',
            jurisdiction: 'Karnataka',
            access_mode: 'Online & In-person'
          }
        ],
        questions_to_ask: [
          'What are the permissible statutory deductions from deposit?'
        ],
        urgency_level: 'normal',
        escalation_message: 'General legal information roadmap.',
        sources: [
          {
            title: 'NALSA Legal Aid Schemes',
            url: 'https://nalsa.gov.in/legal-aid/',
            authority: 'National Legal Services Authority',
            relevance: 'Information on free legal representation'
          }
        ],
        limitations: [
          'General information only; not legal advice.'
        ]
      };

      const result = RoadmapResponseSchema.safeParse(validRoadmap);
      assert.equal(result.success, true);
    });

    test('rejects roadmap with more than 3 immediate steps (prompt safety rule)', () => {
      const invalidRoadmap = {
        situation_summary: 'Test summary here with enough length.',
        missing_information: [],
        possible_issue_categories: ['Tenancy'],
        immediate_steps: ['Step 1', 'Step 2', 'Step 3', 'Step 4'], // 4 items -> MUST FAIL
        document_checklist: [{ name: 'Doc', why_needed: 'Need', copy_or_original_note: 'Copy' }],
        where_to_go: [{ name: 'Place', reason: 'Why', url: 'https://example.com', jurisdiction: 'India' }],
        questions_to_ask: ['Question 1'],
        urgency_level: 'normal',
        escalation_message: 'Note',
        sources: [{ title: 'Src', url: 'https://example.com', authority: 'Auth', relevance: 'Rel' }],
        limitations: ['Limit']
      };

      const result = RoadmapResponseSchema.safeParse(invalidRoadmap);
      assert.equal(result.success, false);
    });
  });

  // 3. Urgent Risk Detection & Mock Generation
  describe('Urgent Risk Detection & Handling', () => {
    test('sets urgency_level to urgent when physical danger or arrest is flagged', () => {
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

    test('sets caution urgency when a deadline notice is received without immediate danger', () => {
      const deadlineInput: QuestionnaireAnswers = {
        workflow: 'employment',
        state: 'Maharashtra',
        description: 'Received a 7-day notice to reply to a non-compete allegation.',
        hasReceivedDeadline: 'yes',
        deadlineDate: 'Within 7 days',
        hasUrgentRisk: false
      };

      const sources = getSourcesForWorkflow('employment', 'Maharashtra');
      const roadmap = generateMockRoadmap(deadlineInput, sources);

      assert.equal(roadmap.urgency_level, 'caution');
    });
  });

  // 4. Curated Source Verification
  describe('Official Curated Sources Integrity', () => {
    test('all curated sources have official HTTPS URLs and authorities', () => {
      assert.ok(CURATED_LEGAL_SOURCES.length >= 5);
      for (const src of CURATED_LEGAL_SOURCES) {
        assert.ok(src.url.startsWith('https://'), `Source ${src.id} must be HTTPS`);
        assert.ok(src.authority.length > 2, `Source ${src.id} must have valid authority`);
        assert.ok(src.title.length > 3, `Source ${src.id} must have valid title`);
        assert.equal(src.isOfficial, true);
      }
    });

    test('filters sources by workflow topic and jurisdiction', () => {
      const rentalSources = getSourcesForWorkflow('rental', 'Delhi');
      assert.ok(rentalSources.length > 0);
      assert.ok(rentalSources.some(s => s.topic === 'rental' || s.topic === 'general'));
    });
  });

  // 5. Deterministic Mock Generation for All 3 Workflows
  describe('Deterministic Mock Mode for Core Workflows', () => {
    const workflows: ('rental' | 'employment' | 'legal_aid')[] = ['rental', 'employment', 'legal_aid'];

    for (const wf of workflows) {
      test(`generates valid, schema-compliant roadmap for workflow: ${wf}`, () => {
        const input: QuestionnaireAnswers = {
          workflow: wf,
          state: 'Karnataka',
          district: 'Bengaluru',
          description: `Detailed testing of workflow ${wf} for Indian citizen context with verified steps.`,
          hasWrittenDocument: 'yes',
          hasUrgentRisk: false
        };

        const sources = getSourcesForWorkflow(wf, 'Karnataka');
        const roadmap = generateMockRoadmap(input, sources);

        const validation = RoadmapResponseSchema.safeParse(roadmap);
        assert.equal(validation.success, true, `Workflow ${wf} must produce valid schema output`);
        assert.ok(roadmap.immediate_steps.length <= 3, 'Must have at most 3 immediate steps');
        assert.ok(roadmap.document_checklist.length >= 1, 'Must have document checklist');
        assert.ok(roadmap.where_to_go.length >= 1, 'Must have official authority suggestions');
        assert.ok(roadmap.sources.length >= 1, 'Must cite approved sources');
      });
    }
  });

  // 6. Document Deletion
  describe('Document Storage and Deletion', () => {
    test('deleteDocument returns false for non-existent document ID', () => {
      const result = deleteDocument('non-existent-uuid-1234');
      assert.equal(result, false);
    });
  });
});
