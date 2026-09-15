import React from 'react';
import { Home, Briefcase, Scale, HelpCircle, ArrowRight, ShieldCheck, CheckCircle2, FileText, Compass } from 'lucide-react';
import { WorkflowCategory } from '../types.js';
import { DemoExampleButton } from './DemoExampleButton.js';

interface LandingHeroProps {
  onSelectWorkflow: (category: WorkflowCategory) => void;
  onOpenSources: () => void;
  onSelectExample: () => void;
}

export const LandingHero: React.FC<LandingHeroProps> = ({
  onSelectWorkflow,
  onOpenSources,
  onSelectExample
}) => {
  return (
    <div>
      {/* Hero Header */}
      <section className="hero-section" aria-labelledby="hero-main-title">
        <div className="hero-tag">
          <ShieldCheck size={16} aria-hidden="true" />
          <span>Jurisdiction-Aware Legal Navigation for India</span>
        </div>
        <h1 id="hero-main-title" className="hero-title">From legal confusion to your next verified step.</h1>
        <p className="hero-subtitle">
          Understand a common legal problem, prepare the right information, and find the relevant official or legal-help channel without getting overwhelmed.
        </p>

        <div className="hero-ctas">
          <button 
            type="button" 
            className="btn btn-primary"
            onClick={() => onSelectWorkflow('rental')}
            aria-label="Create my legal roadmap starting with rental workflow"
          >
            <span>Create My Roadmap</span>
            <ArrowRight size={18} aria-hidden="true" />
          </button>
          <DemoExampleButton onSelectExample={onSelectExample} />
          <button 
            type="button" 
            className="btn btn-secondary"
            onClick={onOpenSources}
            aria-label="View verified and approved official Indian legal sources"
          >
            <span>View Verified Sources</span>
          </button>
        </div>

        <div style={{ marginTop: '-0.3rem', marginBottom: '1.25rem', fontSize: '0.88rem', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap', gap: '0.35rem' }}>
          <span>Demo scenario:</span>
          <button 
            type="button" 
            onClick={onSelectExample}
            style={{ background: 'none', border: 'none', color: 'var(--color-primary-light)', textDecoration: 'underline', cursor: 'pointer', fontWeight: 600, fontSize: 'inherit', padding: 0 }}
            aria-label="Load demo scenario: My landlord is withholding my security deposit after I moved out."
          >
            “My landlord is withholding my security deposit after I moved out.”
          </button>
        </div>

        <aside style={{ maxWidth: '640px', margin: '0 auto', fontSize: '0.86rem', color: 'var(--color-text-muted)', background: '#ffffff', padding: '0.75rem 1.25rem', borderRadius: 'var(--radius-md)', border: '1.5px solid var(--color-border)' }} aria-label="Legal navigation notice">
          <strong>Notice:</strong> This tool provides general legal information and preparation support. It is not a substitute for a qualified lawyer or official authority.
        </aside>
      </section>

      {/* Workflow Category Cards */}
      <section style={{ margin: '2rem 0' }} aria-labelledby="categories-heading">
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <h2 id="categories-heading">Choose a Problem Category to Begin</h2>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem' }}>
            Select the situation you need assistance navigating
          </p>
        </div>

        <div className="workflow-grid">
          {/* Card 1: Rental */}
          <article 
            className="workflow-card" 
            onClick={() => onSelectWorkflow('rental')}
          >
            <div className="workflow-icon icon-rental" aria-hidden="true">
              <Home size={24} />
            </div>
            <h3>Tenant or Rental Issue</h3>
            <p>Understand lease disputes, notice requirements, and deposit recovery mechanisms.</p>
            <ul className="workflow-bullets" aria-label="Rental issue topics covered">
              <li>Security deposit non-refund or arbitrary deductions</li>
              <li>Sudden eviction notices or lockout threats</li>
              <li>Essential maintenance and repair responsibilities</li>
              <li>Rent agreement clause explanation</li>
            </ul>
            <div style={{ marginTop: '1.25rem' }}>
              <button 
                type="button"
                className="btn btn-outline-primary btn-sm" 
                style={{ width: '100%' }}
                onClick={(e) => { e.stopPropagation(); onSelectWorkflow('rental'); }}
                aria-label="Start Rental Roadmap - Tenant or rental issue"
              >
                Start Rental Roadmap &rarr;
              </button>
            </div>
          </article>

          {/* Card 2: Employment */}
          <article 
            className="workflow-card" 
            onClick={() => onSelectWorkflow('employment')}
          >
            <div className="workflow-icon icon-employment" aria-hidden="true">
              <Briefcase size={24} />
            </div>
            <h3>Employment Document Issue</h3>
            <p>Clarify service conditions, post-employment restrictions, and pending dues.</p>
            <ul className="workflow-bullets" aria-label="Employment issue topics covered">
              <li>Offer letter and employment contract terms</li>
              <li>Notice period clauses and buyout calculations</li>
              <li>Non-compete and confidentiality clauses under Sec 27</li>
              <li>Withheld salary, relieving letter, or FnF settlement</li>
            </ul>
            <div style={{ marginTop: '1.25rem' }}>
              <button 
                type="button"
                className="btn btn-outline-primary btn-sm" 
                style={{ width: '100%' }}
                onClick={(e) => { e.stopPropagation(); onSelectWorkflow('employment'); }}
                aria-label="Start Employment Roadmap - Employment document issue"
              >
                Start Employment Roadmap &rarr;
              </button>
            </div>
          </article>

          {/* Card 3: Free Legal Aid */}
          <article 
            className="workflow-card" 
            onClick={() => onSelectWorkflow('legal_aid')}
          >
            <div className="workflow-icon icon-legalaid" aria-hidden="true">
              <Scale size={24} />
            </div>
            <h3>Free Legal-Aid Guidance</h3>
            <p>Check eligibility for government-provided free legal representation under NALSA.</p>
            <ul className="workflow-bullets" aria-label="Legal-aid eligibility topics covered">
              <li>Eligibility check under Section 12 criteria</li>
              <li>Free legal counsel for women, children, SC/ST, low-income</li>
              <li>Locating DLSA / SLSA court front offices</li>
              <li>Documents required before applying</li>
            </ul>
            <div style={{ marginTop: '1.25rem' }}>
              <button 
                type="button"
                className="btn btn-outline-primary btn-sm" 
                style={{ width: '100%' }}
                onClick={(e) => { e.stopPropagation(); onSelectWorkflow('legal_aid'); }}
                aria-label="Start Free Legal Aid Roadmap - Guidance under NALSA"
              >
                Start Legal Aid Roadmap &rarr;
              </button>
            </div>
          </article>

          {/* Card 4: Other Civil */}
          <article 
            className="workflow-card" 
            onClick={() => onSelectWorkflow('other')}
          >
            <div className="workflow-icon icon-other" aria-hidden="true">
              <HelpCircle size={24} />
            </div>
            <h3>Other Civil or Administrative Issue</h3>
            <p>General civil navigation, document checklist, and procedural pointers.</p>
            <ul className="workflow-bullets" aria-label="General civil topics covered">
              <li>Consumer service deficiency or dispute</li>
              <li>Administrative inquiry or grievance guidance</li>
              <li>Basic procedural documentation checklist</li>
              <li><em>*Note: provides limited general guidance</em></li>
            </ul>
            <div style={{ marginTop: '1.25rem' }}>
              <button 
                type="button"
                className="btn btn-secondary btn-sm" 
                style={{ width: '100%' }}
                onClick={(e) => { e.stopPropagation(); onSelectWorkflow('other'); }}
                aria-label="Start General Inquiry - Other civil or administrative issue"
              >
                Start General Inquiry &rarr;
              </button>
            </div>
          </article>
        </div>
      </section>

      {/* 3-Step Process Explanation */}
      <section className="steps-section" aria-labelledby="process-heading">
        <div style={{ textAlign: 'center' }}>
          <h2 id="process-heading">How NyayaPath Works</h2>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem' }}>
            A structured, 3-step navigation assistant designed to bring clarity to legal problems
          </p>
        </div>

        <div className="steps-grid">
          <div className="step-item">
            <div className="step-number" aria-hidden="true">1</div>
            <div>
              <h3 style={{ fontSize: '1.05rem', marginBottom: '0.3rem' }}>Tell us what happened</h3>
              <p>Answer a short set of guided questions in plain language and select your Indian state and city.</p>
            </div>
          </div>

          <div className="step-item">
            <div className="step-number" aria-hidden="true">2</div>
            <div>
              <h3 style={{ fontSize: '1.05rem', marginBottom: '0.3rem' }}>Prepare the right information</h3>
              <p>Optionally attach your agreement or notice for server-side extraction and receive a customized document checklist.</p>
            </div>
          </div>

          <div className="step-item">
            <div className="step-number" aria-hidden="true">3</div>
            <div>
              <h3 style={{ fontSize: '1.05rem', marginBottom: '0.3rem' }}>Follow a verified roadmap</h3>
              <p>Get the next 3 priority steps, relevant official government authorities, questions to ask, and cited sources.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
