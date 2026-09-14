import React from 'react';
import { Home, Briefcase, Scale, HelpCircle, ArrowRight, ShieldCheck, CheckCircle2, FileText, Compass } from 'lucide-react';
import { WorkflowCategory } from '../types.js';

interface LandingHeroProps {
  onSelectWorkflow: (category: WorkflowCategory) => void;
  onOpenSources: () => void;
}

export const LandingHero: React.FC<LandingHeroProps> = ({
  onSelectWorkflow,
  onOpenSources
}) => {
  return (
    <div>
      {/* Hero Header */}
      <section className="hero-section">
        <div className="hero-tag">
          <ShieldCheck size={16} />
          <span>Jurisdiction-Aware Legal Navigation for India</span>
        </div>
        <h1 className="hero-title">From legal confusion to your next verified step.</h1>
        <p className="hero-subtitle">
          Understand a common legal problem, prepare the right information, and find the relevant official or legal-help channel without getting overwhelmed.
        </p>

        <div className="hero-ctas">
          <button 
            type="button" 
            className="btn btn-primary"
            onClick={() => onSelectWorkflow('rental')}
          >
            <span>Create My Roadmap</span>
            <ArrowRight size={18} />
          </button>
          <button 
            type="button" 
            className="btn btn-secondary"
            onClick={onOpenSources}
          >
            <span>View Verified Sources</span>
          </button>
        </div>

        <div style={{ maxWidth: '640px', margin: '0 auto', fontSize: '0.86rem', color: 'var(--color-text-muted)', background: '#ffffff', padding: '0.75rem 1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
          <strong>Notice:</strong> This tool provides general legal information and preparation support. It is not a substitute for a qualified lawyer or official authority.
        </div>
      </section>

      {/* Workflow Category Cards */}
      <section style={{ margin: '2rem 0' }}>
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <h2>Choose a Problem Category to Begin</h2>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem' }}>
            Select the situation you need assistance navigating
          </p>
        </div>

        <div className="workflow-grid">
          {/* Card 1: Rental */}
          <div 
            className="workflow-card" 
            onClick={() => onSelectWorkflow('rental')}
            role="button"
            tabIndex={0}
          >
            <div className="workflow-icon icon-rental">
              <Home size={24} />
            </div>
            <h3>Tenant or Rental Issue</h3>
            <p>Understand lease disputes, notice requirements, and deposit recovery mechanisms.</p>
            <ul className="workflow-bullets">
              <li>Security deposit non-refund or arbitrary deductions</li>
              <li>Sudden eviction notices or lockout threats</li>
              <li>Essential maintenance and repair responsibilities</li>
              <li>Rent agreement clause explanation</li>
            </ul>
            <div style={{ marginTop: '1.25rem' }}>
              <span className="btn btn-outline-primary btn-sm" style={{ width: '100%' }}>
                Start Rental Roadmap &rarr;
              </span>
            </div>
          </div>

          {/* Card 2: Employment */}
          <div 
            className="workflow-card" 
            onClick={() => onSelectWorkflow('employment')}
            role="button"
            tabIndex={0}
          >
            <div className="workflow-icon icon-employment">
              <Briefcase size={24} />
            </div>
            <h3>Employment Document Issue</h3>
            <p>Clarify service conditions, post-employment restrictions, and pending dues.</p>
            <ul className="workflow-bullets">
              <li>Offer letter and employment contract terms</li>
              <li>Notice period clauses and buyout calculations</li>
              <li>Non-compete and confidentiality clauses under Sec 27</li>
              <li>Withheld salary, relieving letter, or FnF settlement</li>
            </ul>
            <div style={{ marginTop: '1.25rem' }}>
              <span className="btn btn-outline-primary btn-sm" style={{ width: '100%' }}>
                Start Employment Roadmap &rarr;
              </span>
            </div>
          </div>

          {/* Card 3: Free Legal Aid */}
          <div 
            className="workflow-card" 
            onClick={() => onSelectWorkflow('legal_aid')}
            role="button"
            tabIndex={0}
          >
            <div className="workflow-icon icon-legalaid">
              <Scale size={24} />
            </div>
            <h3>Free Legal-Aid Guidance</h3>
            <p>Check eligibility for government-provided free legal representation under NALSA.</p>
            <ul className="workflow-bullets">
              <li>Eligibility check under Section 12 criteria</li>
              <li>Free legal counsel for women, children, SC/ST, low-income</li>
              <li>Locating DLSA / SLSA court front offices</li>
              <li>Documents required before applying</li>
            </ul>
            <div style={{ marginTop: '1.25rem' }}>
              <span className="btn btn-outline-primary btn-sm" style={{ width: '100%' }}>
                Start Legal Aid Roadmap &rarr;
              </span>
            </div>
          </div>

          {/* Card 4: Other Civil */}
          <div 
            className="workflow-card" 
            onClick={() => onSelectWorkflow('other')}
            role="button"
            tabIndex={0}
          >
            <div className="workflow-icon icon-other">
              <HelpCircle size={24} />
            </div>
            <h3>Other Civil or Administrative Issue</h3>
            <p>General civil navigation, document checklist, and procedural pointers.</p>
            <ul className="workflow-bullets">
              <li>Consumer service deficiency or dispute</li>
              <li>Administrative inquiry or grievance guidance</li>
              <li>Basic procedural documentation checklist</li>
              <li><em>*Note: provides limited general guidance</em></li>
            </ul>
            <div style={{ marginTop: '1.25rem' }}>
              <span className="btn btn-secondary btn-sm" style={{ width: '100%' }}>
                Start General Inquiry &rarr;
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 3-Step Process Explanation */}
      <section className="steps-section">
        <div style={{ textAlign: 'center' }}>
          <h2>How NyayaPath Works</h2>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem' }}>
            A structured, 3-step navigation assistant designed to bring clarity to legal problems
          </p>
        </div>

        <div className="steps-grid">
          <div className="step-item">
            <div className="step-number">1</div>
            <div>
              <h4>Tell us what happened</h4>
              <p>Answer a short set of guided questions in plain language and select your Indian state and city.</p>
            </div>
          </div>

          <div className="step-item">
            <div className="step-number">2</div>
            <div>
              <h4>Prepare the right information</h4>
              <p>Optionally attach your agreement or notice for server-side extraction and receive a customized document checklist.</p>
            </div>
          </div>

          <div className="step-item">
            <div className="step-number">3</div>
            <div>
              <h4>Follow a verified roadmap</h4>
              <p>Get the next 3 priority steps, relevant official government authorities, questions to ask, and cited sources.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
