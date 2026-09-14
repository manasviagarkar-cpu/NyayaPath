import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Copy, 
  Printer, 
  RotateCcw, 
  Trash2, 
  ExternalLink, 
  ShieldAlert, 
  Compass, 
  ListChecks, 
  Building2, 
  HelpCircle, 
  FileText, 
  AlertCircle,
  Check
} from 'lucide-react';
import { RoadmapResponse, QuestionnaireAnswers } from '../types.js';
import { UrgentAlertBanner } from './UrgentAlertBanner.js';

interface RoadmapViewProps {
  roadmap: RoadmapResponse;
  answers: QuestionnaireAnswers;
  documentId?: string;
  onReset: () => void;
  onDeleteDocument: () => Promise<void>;
  onOpenSources: () => void;
}

export const RoadmapView: React.FC<RoadmapViewProps> = ({
  roadmap,
  answers,
  documentId,
  onReset,
  onDeleteDocument,
  onOpenSources
}) => {
  const [copied, setCopied] = useState<boolean>(false);
  const [docDeleted, setDocDeleted] = useState<boolean>(false);

  const handleCopy = () => {
    const text = `
NYAYAPATH LEGAL ROADMAP
Problem Category: ${answers.workflow.toUpperCase()}
Jurisdiction: ${answers.state}${answers.district ? ` (${answers.district})` : ''}
Urgency Level: ${roadmap.urgency_level.toUpperCase()}

1. SITUATION SUMMARY:
${roadmap.situation_summary}

2. DO THIS FIRST (IMMEDIATE ACTIONS):
${roadmap.immediate_steps.map((step, i) => `${i + 1}. ${step}`).join('\n')}

3. IMPORTANT MISSING INFORMATION:
${roadmap.missing_information.map(info => `• ${info}`).join('\n')}

4. POSSIBLE ISSUE CATEGORIES:
${roadmap.possible_issue_categories.map(cat => `• ${cat}`).join('\n')}

5. DOCUMENT CHECKLIST:
${roadmap.document_checklist.map(doc => `• ${doc.name}: ${doc.why_needed} (${doc.copy_or_original_note})`).join('\n')}

6. WHERE TO GO (OFFICIAL AUTHORITIES & SERVICES):
${roadmap.where_to_go.map(dest => `• ${dest.name} (${dest.jurisdiction}): ${dest.reason} [${dest.url}]`).join('\n')}

7. QUESTIONS TO ASK:
${roadmap.questions_to_ask.map(q => `• ${q}`).join('\n')}

8. VERIFIED OFFICIAL SOURCES:
${roadmap.sources.map(s => `• ${s.title} (${s.authority}): ${s.url}`).join('\n')}

LEGAL DISCLAIMER:
${roadmap.limitations.join('\n')}
    `.trim();

    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDelete = async () => {
    if (confirm('Are you sure you want to permanently delete your uploaded document from the server?')) {
      await onDeleteDocument();
      setDocDeleted(true);
    }
  };

  return (
    <div style={{ maxWidth: '920px', margin: '0 auto' }}>
      {/* Print-only Header */}
      <div className="print-only-header">
        <h1>NyayaPath Legal Roadmap</h1>
        <p>Jurisdiction: {answers.state} {answers.district ? `(${answers.district})` : ''} | Generated: {new Date().toLocaleDateString('en-IN')}</p>
        <p style={{ fontSize: '0.8rem', color: '#555' }}>General legal information only. Not a formal legal opinion or substitute for a certified advocate.</p>
      </div>

      {/* Action Bar (Top) */}
      <div className="no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1.5rem', background: '#ffffff', padding: '1rem 1.25rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)', boxShadow: var_shadow_sm }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <span style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>Jurisdiction:</span>
          <strong>{answers.state}</strong>
          {answers.district && <span style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>({answers.district})</span>}
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button type="button" className="btn btn-secondary btn-sm" onClick={handleCopy}>
            {copied ? <Check size={15} color="var(--color-emerald)" /> : <Copy size={15} />}
            <span>{copied ? 'Copied to Clipboard' : 'Copy Roadmap'}</span>
          </button>
          <button type="button" className="btn btn-secondary btn-sm" onClick={handlePrint}>
            <Printer size={15} />
            <span>Print / Save as PDF</span>
          </button>
          {documentId && !docDeleted && (
            <button type="button" className="btn btn-secondary btn-sm" style={{ color: '#dc2626' }} onClick={handleDelete}>
              <Trash2 size={15} />
              <span>Delete Uploaded Document</span>
            </button>
          )}
          <button type="button" className="btn btn-outline-primary btn-sm" onClick={onReset}>
            <RotateCcw size={15} />
            <span>Start Over</span>
          </button>
        </div>
      </div>

      {/* Urgent Warning Banner if urgent */}
      {roadmap.urgency_level === 'urgent' && (
        <UrgentAlertBanner customMessage={roadmap.escalation_message} />
      )}

      {/* Roadmap Content Cards */}
      <div className="roadmap-grid">
        {/* Card 1: Situation Summary & Urgency */}
        <div className="card">
          <div className="roadmap-card-header">
            <h3 className="roadmap-card-title">
              <Compass size={22} color="var(--color-primary-light)" />
              <span>Situation Summary</span>
            </h3>
            <span className={`badge-urgency badge-${roadmap.urgency_level}`}>
              {roadmap.urgency_level} urgency
            </span>
          </div>

          <p style={{ fontSize: '1.02rem', lineHeight: 1.65, color: 'var(--color-text-main)', marginBottom: '1.25rem' }}>
            {roadmap.situation_summary}
          </p>

          {roadmap.possible_issue_categories.length > 0 && (
            <div style={{ background: 'var(--color-bg-subtle)', padding: '0.9rem 1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
              <div style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Possible Issue Categories (Requires Professional Verification)
              </div>
              <ul style={{ listStyle: 'none', display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {roadmap.possible_issue_categories.map((cat, idx) => (
                  <li key={idx} style={{ background: '#ffffff', padding: '0.25rem 0.65rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', fontSize: '0.85rem', color: 'var(--color-secondary)' }}>
                    • {cat}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Card 2: Do This First (Max 3 immediate actions) */}
        <div className="card" style={{ borderLeft: '4px solid var(--color-primary-light)' }}>
          <div className="roadmap-card-header">
            <h3 className="roadmap-card-title">
              <CheckCircle2 size={22} color="var(--color-primary-light)" />
              <span>Do This First (Priority Actions)</span>
            </h3>
            <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>Top 3 Immediate Steps</span>
          </div>

          <ol className="immediate-steps-list">
            {roadmap.immediate_steps.map((step, idx) => (
              <li key={idx} className="immediate-step-item">
                {step}
              </li>
            ))}
          </ol>
        </div>

        {/* Card 3: Important Missing Information */}
        <div className="card">
          <div className="roadmap-card-header">
            <h3 className="roadmap-card-title">
              <AlertCircle size={22} color="var(--color-amber)" />
              <span>Important Missing Information</span>
            </h3>
          </div>
          <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', marginBottom: '0.75rem' }}>
            The following facts could alter the procedural steps or legal outcomes:
          </p>
          <ul style={{ listStyle: 'none', paddingLeft: '0.2rem' }}>
            {roadmap.missing_information.map((item, idx) => (
              <li key={idx} style={{ position: 'relative', paddingLeft: '1.4rem', marginBottom: '0.5rem', fontSize: '0.92rem' }}>
                <span style={{ position: 'absolute', left: '0.2rem', color: 'var(--color-amber)', fontWeight: 'bold' }}>?</span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Card 4: Document Checklist */}
        <div className="card">
          <div className="roadmap-card-header">
            <h3 className="roadmap-card-title">
              <ListChecks size={22} color="var(--color-emerald)" />
              <span>Recommended Document Checklist</span>
            </h3>
          </div>
          <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', marginBottom: '0.75rem' }}>
            Collect and organize these records before visiting an authority or legal aid clinic:
          </p>

          <div style={{ overflowX: 'auto' }}>
            <table className="checklist-table">
              <thead>
                <tr>
                  <th style={{ width: '32%' }}>Document Name</th>
                  <th style={{ width: '48%' }}>Why It Is Needed</th>
                  <th style={{ width: '20%' }}>Requirement Note</th>
                </tr>
              </thead>
              <tbody>
                {roadmap.document_checklist.map((doc, idx) => (
                  <tr key={idx}>
                    <td>
                      <div className="doc-name">{doc.name}</div>
                    </td>
                    <td>{doc.why_needed}</td>
                    <td>
                      <span className="doc-note">{doc.copy_or_original_note}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Card 5: Where to Go (Official Authorities & Services) */}
        <div className="card">
          <div className="roadmap-card-header">
            <h3 className="roadmap-card-title">
              <Building2 size={22} color="var(--color-primary-light)" />
              <span>Where to Go or Official Service to Use</span>
            </h3>
          </div>
          <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', marginBottom: '1rem' }}>
            Official government bodies, statutory portals, and legal services institutions relevant to your matter:
          </p>

          <div>
            {roadmap.where_to_go.map((auth, idx) => (
              <div key={idx} className="authority-card">
                <div>
                  <div className="authority-title">{auth.name}</div>
                  <div className="authority-reason">{auth.reason}</div>
                  <div className="authority-meta">
                    <span className="tag-jurisdiction">Jurisdiction: {auth.jurisdiction}</span>
                    {auth.access_mode && (
                      <span className="tag-jurisdiction" style={{ background: '#e0e7ff', color: '#3730a3' }}>
                        Mode: {auth.access_mode}
                      </span>
                    )}
                  </div>
                </div>

                <a 
                  href={auth.url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="btn btn-outline-primary btn-sm"
                  style={{ flexShrink: 0 }}
                >
                  <span>Official Portal</span>
                  <ExternalLink size={14} />
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* Card 6: What to Ask */}
        <div className="card">
          <div className="roadmap-card-header">
            <h3 className="roadmap-card-title">
              <HelpCircle size={22} color="var(--color-primary-light)" />
              <span>Questions to Ask a Professional or Authority</span>
            </h3>
          </div>
          <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', marginBottom: '0.75rem' }}>
            Bring these specific questions to your consultation with an advocate, DLSA legal-aid officer, or landlord/employer:
          </p>
          <ul style={{ listStyle: 'none' }}>
            {roadmap.questions_to_ask.map((q, idx) => (
              <li key={idx} style={{ position: 'relative', paddingLeft: '1.4rem', marginBottom: '0.65rem', fontSize: '0.94rem' }}>
                <span style={{ position: 'absolute', left: '0.2rem', color: 'var(--color-primary-light)', fontWeight: 'bold' }}>•</span>
                {q}
              </li>
            ))}
          </ul>
        </div>

        {/* Card 7: Verified Sources & Limitations */}
        <div className="card" style={{ background: '#fafbff' }}>
          <div className="roadmap-card-header">
            <h3 className="roadmap-card-title">
              <FileText size={20} color="var(--color-secondary)" />
              <span>Verified Official Sources & Limitations</span>
            </h3>
            <button 
              type="button" 
              className="btn btn-secondary btn-sm"
              onClick={onOpenSources}
            >
              View Full Directory
            </button>
          </div>

          <div style={{ marginBottom: '1.25rem' }}>
            <div style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
              Statutory & Procedural Sources Cited:
            </div>
            {roadmap.sources.map((src, idx) => (
              <div key={idx} style={{ marginBottom: '0.6rem', fontSize: '0.9rem' }}>
                <a href={src.url} target="_blank" rel="noopener noreferrer" style={{ fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                  {src.title} <ExternalLink size={13} />
                </a>
                <span style={{ color: 'var(--color-text-muted)', marginLeft: '0.4rem' }}>— {src.authority}</span>
                <div style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', marginTop: '0.1rem' }}>{src.relevance}</div>
              </div>
            ))}
          </div>

          <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '1rem', fontSize: '0.84rem', color: 'var(--color-text-muted)' }}>
            <strong>Safety & Accuracy Limitations:</strong>
            <ul style={{ listStyle: 'disc', paddingLeft: '1.2rem', marginTop: '0.4rem' }}>
              {roadmap.limitations.map((lim, idx) => (
                <li key={idx} style={{ marginBottom: '0.25rem' }}>{lim}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

const var_shadow_sm = 'var(--shadow-sm)';
