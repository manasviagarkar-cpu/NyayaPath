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
  isMockMode?: boolean;
  onReset: () => void;
  onDeleteDocument: () => Promise<void>;
  onOpenSources: () => void;
}

export const RoadmapView: React.FC<RoadmapViewProps> = ({
  roadmap,
  answers,
  documentId,
  isMockMode,
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
Grounding: This roadmap is based on the user's answers, uploaded document, and approved official sources.

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
        <p style={{ fontSize: '0.82rem', color: '#1e3a8a', fontWeight: 600 }}>This roadmap is based on the user’s answers{documentId ? ', uploaded document,' : ''} and approved official sources.</p>
        <p style={{ fontSize: '0.8rem', color: '#555' }}>General legal information only. Not a formal legal opinion or substitute for a certified advocate.</p>
      </div>

      {/* Main Page Title (WCAG 1.3.1 & 2.4.6) */}
      <div className="no-print" style={{ marginBottom: '1.25rem' }}>
        <h1 style={{ fontSize: '1.85rem', marginBottom: '0.35rem' }}>Your Tailored Legal Roadmap</h1>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem' }}>
          Procedural next steps, document preparation guidance, and official assistance channels for {answers.state}.
        </p>
      </div>

      {/* Action Bar (Top) */}
      <nav 
        className="no-print" 
        aria-label="Roadmap actions and tools"
        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1.25rem', background: '#ffffff', padding: '1rem 1.25rem', borderRadius: 'var(--radius-lg)', border: '1.5px solid var(--color-border)', boxShadow: var_shadow_sm }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <span style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>Jurisdiction:</span>
          <strong>{answers.state}</strong>
          {answers.district && <span style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>({answers.district})</span>}
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <button 
            type="button" 
            className="btn btn-secondary btn-sm" 
            onClick={handleCopy}
            aria-label={copied ? "Roadmap copied to clipboard" : "Copy complete legal roadmap to clipboard"}
          >
            {copied ? <Check size={15} color="var(--color-emerald)" aria-hidden="true" /> : <Copy size={15} aria-hidden="true" />}
            <span>{copied ? 'Copied to Clipboard' : 'Copy Roadmap'}</span>
          </button>
          {copied && (
            <span className="sr-only" role="status" aria-live="polite">
              Roadmap copied to clipboard successfully.
            </span>
          )}

          <button 
            type="button" 
            className="btn btn-secondary btn-sm" 
            onClick={handlePrint}
            aria-label="Print roadmap or save as PDF document"
          >
            <Printer size={15} aria-hidden="true" />
            <span>Print / Save as PDF</span>
          </button>

          {documentId && !docDeleted && (
            <button 
              type="button" 
              className="btn btn-secondary btn-sm" 
              style={{ color: '#991b1b', borderColor: '#fca5a5' }} 
              onClick={handleDelete}
              aria-label="Permanently delete uploaded document from server memory"
            >
              <Trash2 size={15} aria-hidden="true" />
              <span>Delete Uploaded Document</span>
            </button>
          )}
          {docDeleted && (
            <span className="sr-only" role="status" aria-live="polite">
              Uploaded document has been permanently deleted from server.
            </span>
          )}

          <button 
            type="button" 
            className="btn btn-outline-primary btn-sm" 
            onClick={onReset}
            aria-label="Start over and reset current legal roadmap"
          >
            <RotateCcw size={15} aria-hidden="true" />
            <span>Start Over</span>
          </button>
        </div>
      </nav>

      {/* Verified Grounding / Source Attribution Banner */}
      <section 
        className="source-grounding-banner no-print" 
        aria-label="Verified Source Grounding"
        style={{ background: '#f0f4ff', border: '1.5px solid #c7d2fe', borderRadius: 'var(--radius-md)', padding: '1rem 1.25rem', marginBottom: '1.5rem' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <ShieldCheck size={24} color="var(--color-primary-light)" aria-hidden="true" style={{ flexShrink: 0 }} />
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.98rem', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
              <span>Verified Source Grounding</span>
              {roadmap.sources && roadmap.sources.length > 0 && (
                <span style={{ background: '#e0e7ff', color: '#312e81', fontSize: '0.78rem', padding: '0.15rem 0.55rem', borderRadius: 'var(--radius-full)', fontWeight: 700 }}>
                  {roadmap.sources.length} Official Authorities Linked
                </span>
              )}
            </div>
            <p style={{ fontSize: '0.92rem', color: 'var(--color-text-main)', margin: '0.2rem 0 0 0', lineHeight: 1.5 }}>
              This roadmap is based on the user’s answers{documentId ? ', uploaded document,' : ''} and approved official sources.
            </p>
          </div>
        </div>
      </section>

      {/* Urgent Warning Banner if urgent */}
      {roadmap.urgency_level === 'urgent' && (
        <UrgentAlertBanner customMessage={roadmap.escalation_message} />
      )}

      {/* Roadmap Content Cards */}
      <div className="roadmap-grid">
        {/* Card 1: Situation Summary & Urgency */}
        <article className="card" aria-labelledby="heading-summary">
          <div className="roadmap-card-header">
            <h2 id="heading-summary" className="roadmap-card-title">
              <Compass size={22} color="var(--color-primary-light)" aria-hidden="true" />
              <span>1. Situation Summary & Urgency Assessment</span>
            </h2>
            <span className={`badge-urgency badge-${roadmap.urgency_level}`}>
              {roadmap.urgency_level === 'urgent' && <ShieldAlert size={14} aria-hidden="true" />}
              {roadmap.urgency_level === 'caution' && <AlertCircle size={14} aria-hidden="true" />}
              {roadmap.urgency_level === 'normal' && <CheckCircle2 size={14} aria-hidden="true" />}
              <span>{roadmap.urgency_level.toUpperCase()} URGENCY</span>
            </span>
          </div>

          <p style={{ fontSize: '1.02rem', lineHeight: 1.65, color: 'var(--color-text-main)', marginBottom: '1.25rem' }}>
            {roadmap.situation_summary}
          </p>

          {roadmap.possible_issue_categories.length > 0 && (
            <div style={{ background: 'var(--color-bg-subtle)', padding: '0.9rem 1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
              <h3 style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Possible Issue Categories (Requires Professional Verification)
              </h3>
              <ul style={{ listStyle: 'none', display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {roadmap.possible_issue_categories.map((cat, idx) => (
                  <li key={idx} style={{ background: '#ffffff', padding: '0.25rem 0.65rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', fontSize: '0.85rem', color: 'var(--color-secondary)' }}>
                    • {cat}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </article>

        {/* Card 2: Do This First (Max 3 immediate actions) */}
        <article className="card" style={{ borderLeft: '4px solid var(--color-primary-light)' }} aria-labelledby="heading-immediate-steps">
          <div className="roadmap-card-header">
            <h2 id="heading-immediate-steps" className="roadmap-card-title">
              <CheckCircle2 size={22} color="var(--color-primary-light)" aria-hidden="true" />
              <span>2. Priority Immediate Actions (Do This First)</span>
            </h2>
            <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>Top 3 Immediate Steps</span>
          </div>

          <ol className="immediate-steps-list">
            {roadmap.immediate_steps.map((step, idx) => (
              <li key={idx} className="immediate-step-item">
                {step}
              </li>
            ))}
          </ol>
        </article>

        {/* Card 3: Important Missing Information */}
        <article className="card" aria-labelledby="heading-missing-info">
          <div className="roadmap-card-header">
            <h2 id="heading-missing-info" className="roadmap-card-title">
              <AlertCircle size={22} color="var(--color-amber)" aria-hidden="true" />
              <span>3. Important Missing Information</span>
            </h2>
          </div>
          <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', marginBottom: '0.75rem' }}>
            The following facts could alter the procedural steps or legal outcomes:
          </p>
          <ul style={{ listStyle: 'none', paddingLeft: '0.2rem' }}>
            {roadmap.missing_information.map((item, idx) => (
              <li key={idx} style={{ position: 'relative', paddingLeft: '1.4rem', marginBottom: '0.5rem', fontSize: '0.92rem' }}>
                <span style={{ position: 'absolute', left: '0.2rem', color: 'var(--color-amber)', fontWeight: 'bold' }} aria-hidden="true">?</span>
                {item}
              </li>
            ))}
          </ul>
        </article>

        {/* Card 4: Document Checklist */}
        <article className="card" aria-labelledby="heading-doc-checklist">
          <div className="roadmap-card-header">
            <h2 id="heading-doc-checklist" className="roadmap-card-title">
              <ListChecks size={22} color="var(--color-emerald)" aria-hidden="true" />
              <span>4. Recommended Document Checklist</span>
            </h2>
          </div>
          <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', marginBottom: '0.75rem' }}>
            Collect and organize these records before visiting an authority or legal aid clinic:
          </p>

          <div style={{ overflowX: 'auto' }}>
            <table className="checklist-table" aria-label="Recommended document checklist for your situation">
              <caption className="sr-only">List of recommended documents, reasons needed, and notes</caption>
              <thead>
                <tr>
                  <th scope="col" style={{ width: '32%' }}>Document Name</th>
                  <th scope="col" style={{ width: '48%' }}>Why It Is Needed</th>
                  <th scope="col" style={{ width: '20%' }}>Requirement Note</th>
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
        </article>

        {/* Card 5: Where to Go (Official Authorities & Services) */}
        <article className="card" aria-labelledby="heading-where-to-go">
          <div className="roadmap-card-header">
            <h2 id="heading-where-to-go" className="roadmap-card-title">
              <Building2 size={22} color="var(--color-primary-light)" aria-hidden="true" />
              <span>5. Official Authorities & Services (Where to Go)</span>
            </h2>
          </div>
          <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', marginBottom: '1rem' }}>
            Official government bodies, statutory portals, and legal services institutions relevant to your matter:
          </p>

          <div>
            {roadmap.where_to_go.map((auth, idx) => (
              <div key={idx} className="authority-card">
                <div>
                  <h3 className="authority-title">{auth.name}</h3>
                  <div className="authority-reason">{auth.reason}</div>
                  <div className="authority-meta">
                    <span className="tag-jurisdiction">Jurisdiction: {auth.jurisdiction}</span>
                    {auth.access_mode && (
                      <span className="tag-jurisdiction" style={{ background: '#e0e7ff', color: '#312e81' }}>
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
                  aria-label={`Visit official portal for ${auth.name} (opens in a new tab)`}
                >
                  <span>Official Portal</span>
                  <ExternalLink size={14} aria-hidden="true" />
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              </div>
            ))}
          </div>
        </article>

        {/* Card 6: What to Ask */}
        <article className="card" aria-labelledby="heading-what-to-ask">
          <div className="roadmap-card-header">
            <h2 id="heading-what-to-ask" className="roadmap-card-title">
              <HelpCircle size={22} color="var(--color-primary-light)" aria-hidden="true" />
              <span>6. Questions to Ask a Professional or Authority</span>
            </h2>
          </div>
          <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', marginBottom: '0.75rem' }}>
            Bring these specific questions to your consultation with an advocate, DLSA legal-aid officer, or landlord/employer:
          </p>
          <ul style={{ listStyle: 'none' }}>
            {roadmap.questions_to_ask.map((q, idx) => (
              <li key={idx} style={{ position: 'relative', paddingLeft: '1.4rem', marginBottom: '0.65rem', fontSize: '0.94rem' }}>
                <span style={{ position: 'absolute', left: '0.2rem', color: 'var(--color-primary-light)', fontWeight: 'bold' }} aria-hidden="true">•</span>
                {q}
              </li>
            ))}
          </ul>
        </article>

        {/* Card 7: Verified Sources & Limitations */}
        <article className="card" style={{ background: '#fafbff' }} aria-labelledby="heading-sources">
          <div className="roadmap-card-header">
            <h2 id="heading-sources" className="roadmap-card-title">
              <FileText size={20} color="var(--color-secondary)" aria-hidden="true" />
              <span>7. Verified Official Sources & Limitations</span>
            </h2>
            <button 
              type="button" 
              className="btn btn-secondary btn-sm"
              onClick={onOpenSources}
              aria-label="View full directory of approved official Indian legal sources"
            >
              View Full Directory
            </button>
          </div>

          <div style={{ marginBottom: '1.25rem' }}>
            <h3 style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
              Statutory & Procedural Sources Cited:
            </h3>
            {roadmap.sources.map((src, idx) => (
              <div key={idx} style={{ marginBottom: '0.6rem', fontSize: '0.9rem' }}>
                <a 
                  href={src.url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  style={{ fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}
                  aria-label={`${src.title} from ${src.authority} (opens in a new tab)`}
                >
                  <span>{src.title}</span>
                  <ExternalLink size={13} aria-hidden="true" />
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
                <span style={{ color: 'var(--color-text-muted)', marginLeft: '0.4rem' }}>— {src.authority}</span>
                <div style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', marginTop: '0.1rem' }}>{src.relevance}</div>
              </div>
            ))}
          </div>

          <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '1rem', fontSize: '0.84rem', color: 'var(--color-text-muted)' }}>
            <h3 style={{ fontSize: '0.88rem', color: 'var(--color-text-main)', marginBottom: '0.35rem' }}>Safety & Accuracy Limitations:</h3>
            <ul style={{ listStyle: 'disc', paddingLeft: '1.2rem', marginTop: '0.4rem' }}>
              {roadmap.limitations.map((lim, idx) => (
                <li key={idx} style={{ marginBottom: '0.25rem' }}>{lim}</li>
              ))}
            </ul>
          </div>
        </article>
      </div>
    </div>
  );
};

const var_shadow_sm = 'var(--shadow-sm)';
