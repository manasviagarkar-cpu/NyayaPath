import { QuestionnaireAnswers, LegalSource, RoadmapResponse, UrgencyLevel } from './types.js';
import { RoadmapResponseSchema } from './schema.js';
import { CURATED_LEGAL_SOURCES, getSourcesForWorkflow } from './sources.js';

const SYSTEM_INSTRUCTION = `You are a legal-information and preparation assistant for India. You are not a lawyer. Provide general information and practical preparation steps only. Do not guarantee outcomes. Do not invent laws, cases, citations, offices, forms, deadlines, fees, addresses, or contact details. Use only the supplied approved sources and uploaded document content. If the sources do not support a claim, say that the information is unavailable or requires verification. Ask for jurisdiction when it is missing. Use cautious language such as 'may involve' and 'a qualified professional should verify'. Separate facts from possibilities. Prioritize the next three practical steps. Identify missing information. If the user mentions immediate danger, domestic violence, arrest, criminal allegations, custody, immigration consequences, child safety, a court deadline, or an urgent eviction, set urgency_level to urgent and recommend contacting an appropriate emergency, official, legal-aid, or qualified professional channel. Do not treat the generated output as ready-to-file legal work.

You must respond ONLY with a valid JSON object strictly matching this schema:
{
  "situation_summary": "string (plain language summary)",
  "missing_information": ["string"],
  "possible_issue_categories": ["string"],
  "immediate_steps": ["string (max 3 items)"],
  "document_checklist": [
    {
      "name": "string",
      "why_needed": "string",
      "copy_or_original_note": "string"
    }
  ],
  "where_to_go": [
    {
      "name": "string",
      "reason": "string",
      "url": "string (must use verified approved source URL)",
      "jurisdiction": "string",
      "access_mode": "Online" | "Offline" | "Online & In-person"
    }
  ],
  "questions_to_ask": ["string"],
  "urgency_level": "normal" | "caution" | "urgent",
  "escalation_message": "string",
  "sources": [
    {
      "title": "string",
      "url": "string",
      "authority": "string",
      "relevance": "string"
    }
  ],
  "limitations": ["string"]
}`;

/**
 * Deterministic Mock Generator tailored to Indian Law & Jurisdiction
 */
export function generateMockRoadmap(
  input: QuestionnaireAnswers,
  sources: LegalSource[],
  documentText?: string | null
): RoadmapResponse {
  const isUrgent = input.hasUrgentRisk || (
    input.urgentRiskFactors &&
    Object.values(input.urgentRiskFactors).some(Boolean)
  );

  const urgency_level: UrgencyLevel = isUrgent ? 'urgent' : (input.hasReceivedDeadline === 'yes' ? 'caution' : 'normal');

  const stateStr = input.state ? input.state : 'Unknown Jurisdiction';
  const locationStr = input.district ? `${input.district}, ${stateStr}` : stateStr;

  let situation_summary = '';
  let possible_issue_categories: string[] = [];
  let immediate_steps: string[] = [];
  let document_checklist: { name: string; why_needed: string; copy_or_original_note: string }[] = [];
  let where_to_go: { name: string; reason: string; url: string; jurisdiction: string; access_mode?: 'Online' | 'Offline' | 'Online & In-person' }[] = [];
  let questions_to_ask: string[] = [];
  let missing_information: string[] = [];

  // Common missing information checks
  if (!input.state || input.state === 'Other / Not Listed') {
    missing_information.push('Precise State and District jurisdiction in India');
  }
  if (!input.dateOrRange) {
    missing_information.push('Exact dates when the agreement was executed or when the dispute arose');
  }
  if (!input.hasWrittenDocument || input.hasWrittenDocument === 'unsure') {
    missing_information.push('Whether a formal written contract, lease, or appointment letter exists');
  }
  if (input.hasReceivedDeadline === 'yes' && !input.deadlineDate) {
    missing_information.push('The exact expiry date of the notice or response deadline');
  }

  // Workflow-specific generation
  if (input.workflow === 'rental') {
    situation_summary = `You appear to be navigating a residential tenancy issue in ${locationStr} involving: "${input.description.slice(0, 160)}...". The available facts require verification against local tenancy norms and the written lease terms.`;
    possible_issue_categories = [
      'Residential tenancy terms and security deposit refund',
      'Notice period validity and lawful handover of leased premises',
      'Deficiency in service / unfair retention of refundable funds'
    ];
    immediate_steps = [
      'Collate the signed rent agreement, security deposit payment receipts, and bank transaction proofs.',
      'Document all written correspondence (WhatsApp messages, emails, registered notices) with dates and timestamps.',
      'Avoid vacating or handing over possession without a signed handover acknowledgment listing key returns and meter readings.'
    ];
    document_checklist = [
      {
        name: 'Registered or Signed Rental Agreement',
        why_needed: 'Defines the agreed lock-in period, deposit amount, deduction clauses, and notice terms.',
        copy_or_original_note: 'Keep original safe; keep scanned digital copy and photocopy for review.'
      },
      {
        name: 'Bank Statements & Deposit Transfer Receipts',
        why_needed: 'Serves as conclusive financial proof of initial deposit payment and timely monthly rent payments.',
        copy_or_original_note: 'Digital bank-stamped account statement or UPI transaction receipt is sufficient.'
      },
      {
        name: 'Move-in & Move-out Photos / Inventory Checklist',
        why_needed: 'Counters unilateral claims of damage to premises or arbitrary repair deductions.',
        copy_or_original_note: 'Time-stamped photos or video walkthrough recordings.'
      }
    ];
    where_to_go = [
      {
        name: 'e-Daakhil National Consumer Grievance Portal',
        reason: 'If the dispute involves unfair trade practices or deficiency of rental management service by a broker or property management entity.',
        url: 'https://edaakhil.nic.in/',
        jurisdiction: 'National (India)',
        access_mode: 'Online'
      },
      {
        name: 'Local Rent Authority / District Legal Services Authority (DLSA)',
        reason: 'For pre-litigation mediation or dispute resolution under state tenancy legislation or free legal aid.',
        url: 'https://nalsa.gov.in/legal-aid/',
        jurisdiction: stateStr,
        access_mode: 'Online & In-person'
      },
      {
        name: 'eCourts Services Portal',
        reason: 'For verifying civil court filings or notices if formal proceedings have been initiated.',
        url: 'https://ecourts.gov.in/',
        jurisdiction: 'National (India)',
        access_mode: 'Online'
      }
    ];
    questions_to_ask = [
      'What are the mandatory grounds and itemized receipts required for landlord deductions from security deposits under our state laws?',
      'Does the rent agreement clause regarding forfeiture of deposit violate general contract principles under the Indian Contract Act?',
      'Can I issue a formal legal notice for refund of deposit before initiating civil or consumer proceedings?'
    ];
  } else if (input.workflow === 'employment') {
    situation_summary = `You appear to be evaluating an employment document or service clause dispute in ${locationStr} regarding: "${input.description.slice(0, 160)}...". Indian courts have specific precedents regarding post-employment restrictions and notice terms.`;
    possible_issue_categories = [
      'Employment contract review and notice period enforceability',
      'Post-termination non-compete restraint under Section 27 of the Indian Contract Act',
      'Full and Final (FnF) settlement, salary dues, or experience letter withholding'
    ];
    immediate_steps = [
      'Secure copies of your signed appointment letter, company policies, and official email communication records.',
      'Check whether the notice period clause permits payment in lieu of notice or requires mandatory garden leave.',
      'Do not sign any unconditional waiver or release of claims until outstanding salary dues and experience certificates are confirmed.'
    ];
    document_checklist = [
      {
        name: 'Appointment Letter / Employment Agreement',
        why_needed: 'Outlines clauses regarding notice period, resignation protocol, confidentiality, and termination terms.',
        copy_or_original_note: 'Signed PDF copy or countersigned physical letter.'
      },
      {
        name: 'Salary Slips & Form 16 / Bank Credit Statements',
        why_needed: 'Proves continuous employment tenure, last drawn salary, and pending compensation.',
        copy_or_original_note: 'Last 3-6 months official pay slips and bank account statement.'
      },
      {
        name: 'Resignation & Communication Trail',
        why_needed: 'Demonstrates notice served, handover completed, and management acknowledgment.',
        copy_or_original_note: 'Official company email exchanges saved in PDF with headers intact.'
      }
    ];
    where_to_go = [
      {
        name: 'SAMADHAN Portal (Ministry of Labour & Employment)',
        reason: 'Official industrial dispute conciliation mechanism for salary claims and unlawful termination where covered under labour laws.',
        url: 'https://samadhan.labour.gov.in/',
        jurisdiction: 'National (India)',
        access_mode: 'Online'
      },
      {
        name: 'District Legal Services Authority (DLSA) Labour Desk',
        reason: 'Free legal counseling for workers and employees meeting state income thresholds.',
        url: 'https://nalsa.gov.in/legal-aid/',
        jurisdiction: stateStr,
        access_mode: 'Online & In-person'
      }
    ];
    questions_to_ask = [
      'Is the non-compete clause legally enforceable post-resignation under Section 27 of the Indian Contract Act, 1872?',
      'Can the employer legally withhold my relieving letter or experience certificate over a notice period dispute?',
      'What are the appropriate conciliation or labour commissioner remedies for pending full and final dues?'
    ];
  } else if (input.workflow === 'legal_aid') {
    situation_summary = `You are seeking guidance on eligibility and procedure for free legal aid in ${locationStr}. Under Section 12 of the Legal Services Authorities Act, 1987, qualified categories of citizens are entitled to free legal assistance.`;
    possible_issue_categories = [
      'Eligibility for free legal aid under Section 12 of the Legal Services Authorities Act, 1987',
      'Appointment of panel advocate and legal counseling',
      'Lok Adalat and pre-litigation settlement mechanisms'
    ];
    immediate_steps = [
      'Check if you belong to an eligible category (woman, child, SC/ST, person with disability, industrial worker, or annual income below state threshold).',
      'Gather government identity proof (Aadhaar/Voter ID) and income certificate or affidavit of earnings.',
      'Visit or contact the nearest District Legal Services Authority (DLSA) front office or call national helpline 15100.'
    ];
    document_checklist = [
      {
        name: 'Government Identity Proof',
        why_needed: 'To establish identity and citizenship for legal aid registration.',
        copy_or_original_note: 'Aadhaar Card, Voter ID, or Ration Card copy is sufficient.'
      },
      {
        name: 'Income Proof / Self-Declaration Affidavit',
        why_needed: 'To verify whether family income is within the state legal services limit (women and SC/ST candidates are exempt from income cap).',
        copy_or_original_note: 'Salary certificate, BPL card, or notarized income declaration.'
      },
      {
        name: 'Case / Dispute Documents & Court Notices (if any)',
        why_needed: 'Allows the legal aid panel advocate to assess the merits and urgency of the matter.',
        copy_or_original_note: 'Copies of all case papers, summons, or disputed notices.'
      }
    ];
    where_to_go = [
      {
        name: 'National Legal Services Authority (NALSA) Online Legal Aid Portal',
        reason: 'Submit an online application for appointment of a legal aid lawyer and track application status.',
        url: 'https://nalsa.gov.in/legal-aid/',
        jurisdiction: 'National (India)',
        access_mode: 'Online'
      },
      {
        name: `${stateStr} State Legal Services Authority (SLSA) / DLSA Front Office`,
        reason: 'Physical front office situated at the District Court complex for immediate walk-in legal aid assistance.',
        url: 'https://nalsa.gov.in/',
        jurisdiction: stateStr,
        access_mode: 'Online & In-person'
      },
      {
        name: 'eCourts e-Filing Portal',
        reason: 'Official e-Filing platform used by panel advocates to file petitions and applications.',
        url: 'https://filing.ecourts.gov.in/',
        jurisdiction: 'National (India)',
        access_mode: 'Online'
      }
    ];
    questions_to_ask = [
      'Am I entitled to full fee exemption including court fees, drafting charges, and process expenses?',
      'How will a panel advocate be assigned to my matter and what is the typical turnaround time?',
      'Can my matter be referred to the National or State Lok Adalat for an amicable pre-litigation settlement?'
    ];
  } else {
    situation_summary = `You have presented a civil or administrative matter in ${locationStr}: "${input.description.slice(0, 160)}...". General legal navigation principles apply.`;
    possible_issue_categories = [
      'General administrative or civil dispute navigation',
      'Documentation assessment and formal dispute preparation'
    ];
    immediate_steps = [
      'Preserve all chronological documentation, communications, and financial proofs related to this issue.',
      'Check whether any formal notice has a strict limitation period or response deadline.',
      'Consult a certified legal practitioner or your nearest District Legal Services Authority.'
    ];
    document_checklist = [
      {
        name: 'Disputed Documents / Written Notices',
        why_needed: 'To establish rights, obligations, and any claims made by the opposing party.',
        copy_or_original_note: 'Photocopy or scanned PDF; retain original in safe custody.'
      },
      {
        name: 'Identity & Address Proof',
        why_needed: 'Required for any formal application, notice, or filing before authorities.',
        copy_or_original_note: 'Standard government ID copy.'
      }
    ];
    where_to_go = [
      {
        name: 'NALSA Legal Aid Directory',
        reason: 'To locate state and district level legal assistance providers.',
        url: 'https://nalsa.gov.in/legal-aid/',
        jurisdiction: 'National (India)',
        access_mode: 'Online & In-person'
      },
      {
        name: 'eCourts Portal',
        reason: 'To locate jurisdictional courts and track civil/criminal court services.',
        url: 'https://ecourts.gov.in/',
        jurisdiction: 'National (India)',
        access_mode: 'Online'
      }
    ];
    questions_to_ask = [
      'What specific statute or statutory remedy governs this problem in our jurisdiction?',
      'What is the applicable limitation period under the Limitation Act for initiating action?'
    ];
  }

  // Escalation message based on urgency
  let escalation_message = 'This roadmap provides general legal information and preparation assistance for informational purposes.';
  if (isUrgent) {
    escalation_message = 'URGENT ATTENTION REQUIRED: Your issue indicates imminent risk, criminal allegation, physical danger, impending eviction, or urgent court deadlines. Autonomous AI guidance is strictly insufficient. Please contact emergency services (112), NALSA helpline (15100), or a certified advocate immediately.';
  } else if (input.hasReceivedDeadline === 'yes') {
    escalation_message = 'TIME-SENSITIVE: You have indicated an existing deadline or notice. Verify the expiration date promptly with legal counsel to avoid forfeiture of remedies.';
  }

  // Add document text note if document was provided
  if (documentText) {
    situation_summary += ' (An uploaded document was processed and referenced for context).';
  }

  // Map approved sources
  const relevantSources = sources.length > 0 ? sources.slice(0, 3) : CURATED_LEGAL_SOURCES.slice(0, 2);
  const roadmapSources = relevantSources.map(s => ({
    title: s.title,
    url: s.url,
    authority: s.authority,
    relevance: s.relevance
  }));

  const limitations = [
    'NyayaPath provides general legal information and preparation guidance only. It is not an AI lawyer and does not offer legal advice.',
    'No legal representation, attorney-client relationship, or guaranteed outcome is created by this roadmap.',
    'Indian state and local tenancy, labour, and procedural rules vary. Always verify specifics with a qualified advocate or the relevant official authority.',
    'Do not use AI-generated summaries as ready-to-file legal pleadings or court submissions without advocate review.'
  ];

  return {
    situation_summary,
    missing_information: missing_information.length > 0 ? missing_information : ['No critical jurisdictional facts appear missing at this stage.'],
    possible_issue_categories,
    immediate_steps: immediate_steps.slice(0, 3),
    document_checklist,
    where_to_go,
    questions_to_ask,
    urgency_level,
    escalation_message,
    sources: roadmapSources,
    limitations
  };
}

/**
 * Check if Live AI is configured and enabled
 */
export function isLiveAiConfigured(): boolean {
  const apiKey = process.env.GEMINI_API_KEY;
  const provider = process.env.AI_PROVIDER || 'mock';
  const forceMock = process.env.MOCK_MODE === 'true' || provider === 'mock' || !apiKey || apiKey.trim().length < 10;
  return !forceMock;
}

/**
 * Strips markdown code blocks and normalizes JSON candidate output
 */
function cleanJsonResponse(rawText: string): any {
  let cleaned = rawText.trim();
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.replace(/^```json\s*/, '').replace(/\s*```$/, '');
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```\s*/, '').replace(/\s*```$/, '');
  }

  const parsed = JSON.parse(cleaned);

  // Guarantee schema compliance on immediate steps
  if (Array.isArray(parsed.immediate_steps) && parsed.immediate_steps.length > 3) {
    parsed.immediate_steps = parsed.immediate_steps.slice(0, 3);
  }

  // Ensure URLs are well-formed
  if (Array.isArray(parsed.where_to_go)) {
    parsed.where_to_go = parsed.where_to_go.map((item: any) => ({
      ...item,
      url: (item.url || '').trim().startsWith('http') ? item.url.trim() : `https://${(item.url || 'ecourts.gov.in').trim()}`
    }));
  }

  if (Array.isArray(parsed.sources)) {
    parsed.sources = parsed.sources.map((item: any) => ({
      ...item,
      url: (item.url || '').trim().startsWith('http') ? item.url.trim() : `https://${(item.url || 'nalsa.gov.in').trim()}`
    }));
  }

  return parsed;
}

/**
 * AI Provider abstraction using Gemini API with retry and fallback
 */
export async function generateLegalRoadmap(
  input: QuestionnaireAnswers,
  sources: LegalSource[],
  documentText?: string | null
): Promise<RoadmapResponse> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!isLiveAiConfigured()) {
    return generateMockRoadmap(input, sources, documentText);
  }

  // Construct prompt with approved sources and safe context
  const approvedSourcesText = sources
    .map(s => `- [${s.title}](${s.url}) (Authority: ${s.authority}, Jurisdiction: ${s.jurisdiction}): ${s.relevance}`)
    .join('\n');

  const userPrompt = `
User Answers:
- Workflow Category: ${input.workflow}
- State / Jurisdiction: ${input.state || 'Unspecified'}
- District / City: ${input.district || input.city || 'Unspecified'}
- User Problem Description: ${input.description}
- Relevant Dates / Period: ${input.dateOrRange || 'Not provided'}
- Written Document Exists: ${input.hasWrittenDocument || 'Unspecified'} (${input.documentTypeDescription || ''})
- Deadline Received: ${input.hasReceivedDeadline || 'No'} (Date: ${input.deadlineDate || 'N/A'})
- Urgent Risk Flagged: ${input.hasUrgentRisk ? 'YES' : 'NO'}
- Urgent Risk Factors: ${JSON.stringify(input.urgentRiskFactors || {})}

Approved Curated Sources:
${approvedSourcesText}

${documentText ? `Extracted Text from Uploaded Document:\n${documentText.slice(0, 4000)}\n` : 'No document uploaded.'}

Generate the structured JSON roadmap following all safety rules. Remember:
- Maximum 3 immediate_steps.
- Use only approved source URLs for where_to_go and sources.
- If urgent risks are flagged, set urgency_level="urgent".
- Do not invent cases, statutes, fees, addresses, or phone numbers.
`;

  // Helper to call Gemini API with valid models (gemini-2.0-flash / gemini-1.5-flash)
  async function callGemini(retryInstruction?: string, modelName: string = process.env.GEMINI_MODEL || 'gemini-1.5-flash'): Promise<string> {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            role: 'user',
            parts: [
              { text: `${SYSTEM_INSTRUCTION}\n\n${userPrompt}${retryInstruction ? `\n\nCorrection instruction: ${retryInstruction}` : ''}` }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.2,
          responseMimeType: 'application/json'
        }
      })
    });

    if (!response.status || response.status < 200 || response.status >= 300) {
      const errText = await response.text();
      // If 2.0-flash fails with 404, attempt fallback to 1.5-flash
      if (response.status === 404 && modelName !== 'gemini-1.5-flash') {
        console.warn(`Model ${modelName} returned 404, attempting fallback to gemini-1.5-flash`);
        return callGemini(retryInstruction, 'gemini-1.5-flash');
      }
      throw new Error(`AI Provider API responded with status ${response.status}: ${errText.slice(0, 200)}`);
    }

    const jsonResponse: any = await response.json();
    const candidateText = jsonResponse.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!candidateText) {
      throw new Error('Empty response from AI Provider API');
    }
    return candidateText;
  }

  try {
    const textOutput = await callGemini();
    const cleaned = cleanJsonResponse(textOutput);
    const validated = RoadmapResponseSchema.parse(cleaned);
    return validated;
  } catch (firstErr: any) {
    // Retry once with correction instruction
    try {
      const retryText = await callGemini('Your previous response did not match the strict JSON schema. Ensure immediate_steps has at most 3 items and all required fields are present.');
      const cleanedRetry = cleanJsonResponse(retryText);
      const validatedRetry = RoadmapResponseSchema.parse(cleanedRetry);
      return validatedRetry;
    } catch (secondErr: any) {
      // Graceful fallback to verified deterministic mock rather than showing broken UI
      console.warn('AI Provider failed schema validation or network check. Falling back safely to verified roadmap mock:', secondErr.message);
      return generateMockRoadmap(input, sources, documentText);
    }
  }
}
