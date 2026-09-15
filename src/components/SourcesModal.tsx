import React, { useEffect, useState, useRef } from 'react';
import { X, ExternalLink, ShieldCheck, CheckCircle, Info } from 'lucide-react';
import { LegalSource } from '../types.js';

interface SourcesModalProps {
  isOpen: boolean;
  onClose: () => void;
  triggerElement?: HTMLElement | null;
}

export const SourcesModal: React.FC<SourcesModalProps> = ({ isOpen, onClose, triggerElement }) => {
  const [sources, setSources] = useState<LegalSource[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const modalRef = useRef<HTMLDivElement | null>(null);
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);
  const prevFocusRef = useRef<HTMLElement | null>(null);

  // Store active element when opening and restore on close
  useEffect(() => {
    if (isOpen) {
      prevFocusRef.current = triggerElement || (document.activeElement as HTMLElement | null);
      
      fetch('/api/sources')
        .then(res => res.json())
        .then(data => {
          setSources(data.sources || []);
          setIsLoading(false);
        })
        .catch(() => {
          setIsLoading(false);
        });

      // Move focus into modal
      setTimeout(() => {
        if (closeBtnRef.current) {
          closeBtnRef.current.focus();
        } else if (modalRef.current) {
          modalRef.current.focus();
        }
      }, 50);
    } else {
      // Return focus to trigger element when closed
      if (prevFocusRef.current && typeof prevFocusRef.current.focus === 'function') {
        prevFocusRef.current.focus();
      }
    }
  }, [isOpen, triggerElement]);

  // Handle keyboard events: Escape to close, Tab to trap focus
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.stopPropagation();
      onClose();
      return;
    }

    if (e.key === 'Tab' && modalRef.current) {
      const focusableEls = modalRef.current.querySelectorAll<HTMLElement>(
        'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
      if (focusableEls.length === 0) return;

      const firstEl = focusableEls[0];
      const lastEl = focusableEls[focusableEls.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === firstEl) {
          e.preventDefault();
          lastEl.focus();
        }
      } else {
        if (document.activeElement === lastEl) {
          e.preventDefault();
          firstEl.focus();
        }
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="modal-overlay" 
      onClick={onClose}
      role="presentation"
    >
      <div 
        className="modal-container" 
        role="dialog"
        aria-modal="true"
        aria-labelledby="sources-modal-title"
        aria-describedby="sources-modal-desc"
        tabIndex={-1}
        ref={modalRef}
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        <button 
          ref={closeBtnRef}
          type="button"
          className="modal-close" 
          onClick={onClose} 
          aria-label="Close verified sources dialog"
        >
          <X size={20} aria-hidden="true" />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.75rem' }}>
          <ShieldCheck size={26} color="var(--color-primary-light)" aria-hidden="true" />
          <h2 id="sources-modal-title" style={{ fontSize: '1.4rem' }}>
            Approved Official Indian Sources
          </h2>
        </div>

        <p id="sources-modal-desc" style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
          NyayaPath only cites and directs users to verified Indian statutory portals, Supreme Court e-Committee tools, and Legal Services Authorities.
        </p>

        {/* Coverage Note */}
        <aside 
          style={{ background: '#f8fafc', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: '0.9rem 1.1rem', marginBottom: '1.5rem', display: 'flex', gap: '0.6rem' }}
          aria-label="Jurisdiction coverage information"
        >
          <Info size={18} color="var(--color-primary-light)" aria-hidden="true" style={{ flexShrink: 0, marginTop: '0.1rem' }} />
          <div style={{ fontSize: '0.84rem', color: 'var(--color-text-muted)', lineHeight: 1.45 }}>
            <strong>Supported Jurisdiction Coverage:</strong> National statutory portals (NALSA, eCourts, e-Daakhil, Ministry of Labour) apply nationwide. Specific State Legal Services Authorities currently verified include Delhi (DSLSA), Maharashtra (MSLSA), and Karnataka (KSLSA). Additional state authorities will be added systematically.
          </div>
        </aside>

        {isLoading ? (
          <div role="status" aria-live="polite" style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-text-muted)' }}>
            Loading verified sources...
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
            {sources.map((src) => (
              <article 
                key={src.id} 
                style={{
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-md)',
                  padding: '1rem',
                  background: '#ffffff'
                }}
                aria-label={src.title}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.75rem' }}>
                  <div>
                    <h3 style={{ fontSize: '1rem', marginBottom: '0.2rem', color: 'var(--color-secondary)' }}>{src.title}</h3>
                    <div style={{ fontSize: '0.82rem', color: 'var(--color-primary-light)', fontWeight: 600 }}>
                      {src.authority}
                    </div>
                  </div>
                  <a
                    href={src.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-outline-primary btn-sm"
                    style={{ padding: '0.3rem 0.6rem', fontSize: '0.8rem' }}
                    aria-label={`Visit official portal for ${src.title} (opens in a new tab)`}
                  >
                    <span>Visit</span>
                    <ExternalLink size={12} aria-hidden="true" />
                    <span className="sr-only"> (opens in a new tab)</span>
                  </a>
                </div>

                <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginTop: '0.4rem', lineHeight: 1.45 }}>
                  {src.relevance}
                </p>

                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.6rem', fontSize: '0.78rem', color: 'var(--color-text-muted)', flexWrap: 'wrap' }}>
                  <span style={{ background: '#f1f5f9', padding: '0.1rem 0.45rem', borderRadius: '4px' }}>
                    Jurisdiction: {src.jurisdiction}
                  </span>
                  <span style={{ background: '#ecfdf5', color: '#047857', padding: '0.1rem 0.45rem', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '0.2rem', fontWeight: 600 }}>
                    <CheckCircle size={10} aria-hidden="true" /> Official Government Source
                  </span>
                  <span>Verified: {src.lastChecked}</span>
                </div>
              </article>
            ))}
          </div>
        )}

        <div style={{ marginTop: '1.75rem', textAlign: 'right' }}>
          <button 
            type="button" 
            className="btn btn-primary btn-sm" 
            onClick={onClose}
            aria-label="Close verified sources directory modal"
          >
            Close Directory
          </button>
        </div>
      </div>
    </div>
  );
};
