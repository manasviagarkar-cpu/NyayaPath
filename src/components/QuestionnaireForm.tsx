import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, AlertTriangle, ShieldCheck, MapPin, Calendar, FileQuestion, Clock, Sparkles } from 'lucide-react';
import { QuestionnaireAnswers, WorkflowCategory, UrgentRiskFactors } from '../types.js';
import { UrgentAlertBanner } from './UrgentAlertBanner.js';

interface QuestionnaireFormProps {
  initialWorkflow: WorkflowCategory;
  initialAnswers?: Partial<QuestionnaireAnswers> | null;
  onSubmit: (answers: QuestionnaireAnswers) => void;
  onBack: () => void;
}

const INDIAN_STATES_AND_UTS = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa',
  'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala',
  'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland',
  'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
  'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  // Union Territories
  'Andaman and Nicobar Islands', 'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi (NCT)', 'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry'
];

export const QuestionnaireForm: React.FC<QuestionnaireFormProps> = ({
  initialWorkflow,
  initialAnswers,
  onSubmit,
  onBack
}) => {
  const [workflow, setWorkflow] = useState<WorkflowCategory>(initialAnswers?.workflow || initialWorkflow);
  const [state, setState] = useState<string>(initialAnswers?.state || 'Delhi (NCT)');
  const [district, setDistrict] = useState<string>(initialAnswers?.district || '');
  const [description, setDescription] = useState<string>(initialAnswers?.description || '');
  const [dateOrRange, setDateOrRange] = useState<string>(initialAnswers?.dateOrRange || '');
  const [hasWrittenDocument, setHasWrittenDocument] = useState<'yes' | 'no' | 'unsure'>(initialAnswers?.hasWrittenDocument || 'yes');
  const [documentTypeDescription, setDocumentTypeDescription] = useState<string>(initialAnswers?.documentTypeDescription || '');
  const [hasReceivedDeadline, setHasReceivedDeadline] = useState<'yes' | 'no' | 'unsure'>(initialAnswers?.hasReceivedDeadline || 'no');
  const [deadlineDate, setDeadlineDate] = useState<string>(initialAnswers?.deadlineDate || '');
  const [hasUrgentRisk, setHasUrgentRisk] = useState<boolean>(initialAnswers?.hasUrgentRisk || false);
  const [urgentFactors, setUrgentFactors] = useState<UrgentRiskFactors>(initialAnswers?.urgentRiskFactors || {});
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleLoadExample = () => {
    setWorkflow('rental');
    setState('Karnataka');
    setDistrict('Bengaluru Urban');
    setDescription('My landlord is withholding my security deposit after I moved out.');
    setDateOrRange('Vacated 31st August; 11-month lease');
    setHasWrittenDocument('yes');
    setDocumentTypeDescription('Registered 11-Month Rental Agreement');
    setHasReceivedDeadline('no');
    setHasUrgentRisk(false);
    setUrgentFactors({});
    setValidationError(null);
  };

  const handleUrgentFactorToggle = (key: keyof UrgentRiskFactors) => {
    const updated = { ...urgentFactors, [key]: !urgentFactors[key] };
    setUrgentFactors(updated);
    const anyActive = Object.values(updated).some(Boolean);
    setHasUrgentRisk(anyActive);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!state) {
      setValidationError('Please select your Indian State or Union Territory.');
      return;
    }
    if (description.trim().length < 15) {
      setValidationError('Please describe what happened in at least 15 characters so we can understand your situation.');
      return;
    }
    setValidationError(null);

    const answers: QuestionnaireAnswers = {
      workflow,
      state,
      district: district.trim() || undefined,
      description: description.trim(),
      dateOrRange: dateOrRange.trim() || undefined,
      hasWrittenDocument,
      documentTypeDescription: documentTypeDescription.trim() || undefined,
      hasReceivedDeadline,
      deadlineDate: deadlineDate.trim() || undefined,
      hasUrgentRisk,
      urgentRiskFactors: hasUrgentRisk ? urgentFactors : undefined
    };

    onSubmit(answers);
  };

  return (
    <div className="card" style={{ maxWidth: '820px', margin: '0 auto' }}>
      {/* Progress Header */}
      <div className="progress-bar-container" style={{ margin: '-0.5rem 0 1.5rem 0', padding: '1rem' }}>
        <div className="progress-header">
          <span>Step 2 of 4: Guided Questionnaire</span>
          <span>50% Completed</span>
        </div>
        <div className="progress-track">
          <div className="progress-fill" style={{ width: '50%' }}></div>
        </div>
      </div>

      <div style={{ marginBottom: '1.75rem' }}>
        <h2>Tell Us About Your Legal Situation</h2>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.92rem' }}>
          Your answers help determine the specific state legal-aid rules, relevant local authorities, and required evidence checklist.
        </p>
      </div>

      {hasUrgentRisk && (
        <UrgentAlertBanner customMessage="You have indicated urgent risks or strict legal deadlines. Please note that while NyayaPath can prepare a preliminary checklist, automated guidance cannot replace emergency police or advocate representation." />
      )}

      {validationError && (
        <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#b91c1c', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
          <strong>Attention:</strong> {validationError}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Workflow Selection */}
        <div className="form-group">
          <label className="form-label">Problem Category</label>
          <select 
            className="form-select"
            value={workflow}
            onChange={(e) => setWorkflow(e.target.value as WorkflowCategory)}
          >
            <option value="rental">Tenant or Rental Issue (Deposit, Lease, Eviction)</option>
            <option value="employment">Employment Document (Offer Letter, Non-compete, FnF)</option>
            <option value="legal_aid">Free Legal-Aid Guidance (NALSA / SLSA Entitlement)</option>
            <option value="other">Other Civil or Administrative Query</option>
          </select>
        </div>

        {/* Location / Jurisdiction */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', marginBottom: '1.75rem' }}>
          <div>
            <label className="form-label" htmlFor="state-select">
              <MapPin size={16} style={{ display: 'inline', marginRight: '0.3rem', verticalAlign: 'middle' }} />
              Indian State / Union Territory *
            </label>
            <select
              id="state-select"
              className="form-select"
              value={state}
              onChange={(e) => setState(e.target.value)}
              required
            >
              <option value="">Select State or UT</option>
              {INDIAN_STATES_AND_UTS.map((st) => (
                <option key={st} value={st}>{st}</option>
              ))}
            </select>
            <span className="form-hint">Tenancy, labour, and legal-aid rules vary by state jurisdiction.</span>
          </div>

          <div>
            <label className="form-label" htmlFor="district-input">
              District or City (Optional)
            </label>
            <input
              id="district-input"
              type="text"
              className="form-input"
              placeholder="e.g. South Delhi, Bengaluru Urban, Pune"
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
            />
            <span className="form-hint">Helps identify your nearest District Legal Services Authority (DLSA).</span>
          </div>
        </div>

        {/* Problem Description */}
        <div className="form-group">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.45rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <label className="form-label" htmlFor="description-input" style={{ margin: 0 }}>
              What happened? Explain in your own words *
            </label>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={handleLoadExample}
              style={{ fontSize: '0.82rem', padding: '0.2rem 0.65rem', display: 'inline-flex', alignItems: 'center', gap: '0.35rem', borderColor: 'var(--color-primary-light)' }}
              title="Click to automatically load sample deposit dispute"
            >
              <Sparkles size={13} color="var(--color-primary-light)" />
              <span>Try an example</span>
            </button>
          </div>
          <textarea
            id="description-input"
            className="form-textarea"
            placeholder={
              workflow === 'rental' 
                ? "e.g. Landlord is withholding Rs 60,000 security deposit citing repainting and general wear-and-tear after 11-month lease ended on 31st August."
                : workflow === 'employment'
                ? "e.g. Employer is asserting a 1-year post-resignation non-compete clause and withholding my relieving letter."
                : workflow === 'legal_aid'
                ? "e.g. Seeking legal representation for a maintenance dispute; our family income is below Rs 2 Lakhs/year."
                : "Describe the key facts, what was agreed upon, and what the other party is doing."
            }
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
          <span className="form-hint">Minimum 15 characters. Do not include sensitive personal Aadhaar or account numbers.</span>
        </div>

        {/* Dates & Documents */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', marginBottom: '1.75rem' }}>
          <div>
            <label className="form-label">
              <Calendar size={16} style={{ display: 'inline', marginRight: '0.3rem', verticalAlign: 'middle' }} />
              Important Date or Period
            </label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Notice served on Sept 5, 2024"
              value={dateOrRange}
              onChange={(e) => setDateOrRange(e.target.value)}
            />
            <span className="form-hint">Date agreement was signed, vacated, or notice received.</span>
          </div>

          <div>
            <label className="form-label">
              <FileQuestion size={16} style={{ display: 'inline', marginRight: '0.3rem', verticalAlign: 'middle' }} />
              Is there a written agreement or notice?
            </label>
            <div className="radio-group">
              <label className="radio-label">
                <input
                  type="radio"
                  name="hasWrittenDocument"
                  value="yes"
                  checked={hasWrittenDocument === 'yes'}
                  onChange={() => setHasWrittenDocument('yes')}
                />
                Yes
              </label>
              <label className="radio-label">
                <input
                  type="radio"
                  name="hasWrittenDocument"
                  value="no"
                  checked={hasWrittenDocument === 'no'}
                  onChange={() => setHasWrittenDocument('no')}
                />
                No
              </label>
              <label className="radio-label">
                <input
                  type="radio"
                  name="hasWrittenDocument"
                  value="unsure"
                  checked={hasWrittenDocument === 'unsure'}
                  onChange={() => setHasWrittenDocument('unsure')}
                />
                Unsure / Verbal
              </label>
            </div>
          </div>
        </div>

        {/* Deadlines */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', marginBottom: '1.75rem' }}>
          <div>
            <label className="form-label">
              <Clock size={16} style={{ display: 'inline', marginRight: '0.3rem', verticalAlign: 'middle' }} />
              Have you received a deadline or notice to respond?
            </label>
            <div className="radio-group">
              <label className="radio-label">
                <input
                  type="radio"
                  name="hasReceivedDeadline"
                  value="yes"
                  checked={hasReceivedDeadline === 'yes'}
                  onChange={() => setHasReceivedDeadline('yes')}
                />
                Yes
              </label>
              <label className="radio-label">
                <input
                  type="radio"
                  name="hasReceivedDeadline"
                  value="no"
                  checked={hasReceivedDeadline === 'no'}
                  onChange={() => setHasReceivedDeadline('no')}
                />
                No
              </label>
              <label className="radio-label">
                <input
                  type="radio"
                  name="hasReceivedDeadline"
                  value="unsure"
                  checked={hasReceivedDeadline === 'unsure'}
                  onChange={() => setHasReceivedDeadline('unsure')}
                />
                Unsure
              </label>
            </div>
          </div>

          {hasReceivedDeadline === 'yes' && (
            <div>
              <label className="form-label">Deadline Expiry Date</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Within 15 days / by 30th Sept"
                value={deadlineDate}
                onChange={(e) => setDeadlineDate(e.target.value)}
              />
            </div>
          )}
        </div>

        {/* Urgent Risk Factor Checkboxes */}
        <div style={{ background: 'var(--color-bg-subtle)', padding: '1.25rem', borderRadius: 'var(--radius-md)', marginBottom: '2rem', border: '1px solid var(--color-border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <AlertTriangle size={18} color="var(--color-amber)" />
            <h4 style={{ fontSize: '1rem' }}>Safety & Urgent Risk Assessment</h4>
          </div>
          <p style={{ fontSize: '0.86rem', color: 'var(--color-text-muted)', marginBottom: '0.75rem' }}>
            Please select if any of the following immediate or high-risk factors apply to your situation:
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.6rem', fontSize: '0.88rem' }}>
            <label className="radio-label">
              <input
                type="checkbox"
                checked={!!urgentFactors.arrestOrPolice}
                onChange={() => handleUrgentFactorToggle('arrestOrPolice')}
              />
              Arrest or police action
            </label>
            <label className="radio-label">
              <input
                type="checkbox"
                checked={!!urgentFactors.criminalAllegations}
                onChange={() => handleUrgentFactorToggle('criminalAllegations')}
              />
              Criminal allegations / FIR
            </label>
            <label className="radio-label">
              <input
                type="checkbox"
                checked={!!urgentFactors.domesticViolence}
                onChange={() => handleUrgentFactorToggle('domesticViolence')}
              />
              Domestic violence
            </label>
            <label className="radio-label">
              <input
                type="checkbox"
                checked={!!urgentFactors.immediatePhysicalDanger}
                onChange={() => handleUrgentFactorToggle('immediatePhysicalDanger')}
              />
              Immediate physical danger
            </label>
            <label className="radio-label">
              <input
                type="checkbox"
                checked={!!urgentFactors.childSafety}
                onChange={() => handleUrgentFactorToggle('childSafety')}
              />
              Child-safety issue
            </label>
            <label className="radio-label">
              <input
                type="checkbox"
                checked={!!urgentFactors.urgentCourtDeadline}
                onChange={() => handleUrgentFactorToggle('urgentCourtDeadline')}
              />
              Court or hearing deadline
            </label>
            <label className="radio-label">
              <input
                type="checkbox"
                checked={!!urgentFactors.immediateEviction}
                onChange={() => handleUrgentFactorToggle('immediateEviction')}
              />
              Eviction happening immediately
            </label>
            <label className="radio-label">
              <input
                type="checkbox"
                checked={!!urgentFactors.largeFinancialExposure}
                onChange={() => handleUrgentFactorToggle('largeFinancialExposure')}
              />
              Large financial loss / threat
            </label>
          </div>
        </div>

        {/* Buttons */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onBack}
          >
            <ArrowLeft size={16} />
            Back
          </button>
          <button
            type="submit"
            className="btn btn-primary"
          >
            <span>Continue to Document Check</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </form>
    </div>
  );
};
