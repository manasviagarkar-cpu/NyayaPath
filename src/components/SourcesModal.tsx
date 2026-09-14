import React, { useEffect, useState } from 'react';
import { X, ExternalLink, ShieldCheck, CheckCircle, Info } from 'lucide-react';
import { LegalSource } from '../types.js';

interface SourcesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SourcesModal: React.FC<SourcesModalProps> = ({ isOpen, onClose }) => {
  const [sources, setSources] = useState<LegalSource[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!isOpen) return;

    fetch('/api/sources')
      .then(res => res.json())
      .then(data => {
        setSources(data.sources || []);
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
      });
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} title="Close">
          <X size={20} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.75rem' }}>
          <ShieldCheck size={26} color="var(--color-primary-light)" />
          <h2 style={{ fontSize: '1.4rem' }}>Approved Official Indian Sources</h2>
        </div>

        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
          NyayaPath only cites and directs users to verified Indian statutory portals, Supreme Court e-Committee tools, and Legal Services Authorities.
        </p>

        {/* Coverage Note */}
        <div style={{ background: '#f8fafc', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: '0.9rem 1.1rem', marginBottom: '1.5rem', display: 'flex', gap: '0.6rem' }}>
          <Info size={18} color="var(--color-primary-light)" style={{ flexShrink: 0, marginTop: '0.1rem' }} />
          <div style={{ fontSize: '0.84rem', color: 'var(--color-text-muted)', lineHeight: 1.45 }}>
            <strong>Supported Jurisdiction Coverage:</strong> National statutory portals (NALSA, eCourts, e-Daakhil, Ministry of Labour) apply nationwide. Specific State Legal Services Authorities currently verified include Delhi (DSLSA), Maharashtra (MSLSA), and Karnataka (KSLSA). Additional state authorities will be added systematically.
          </div>
        </div>

        {isLoading ? (
          <p style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-text-muted)' }}>Loading verified sources...</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
            {sources.map((src) => (
              <div 
                key={src.id} 
                style={{
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-md)',
                  padding: '1rem',
                  background: '#ffffff'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.75rem' }}>
                  <div>
                    <h4 style={{ fontSize: '1rem', marginBottom: '0.2rem' }}>{src.title}</h4>
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
                  >
                    <span>Visit</span>
                    <ExternalLink size={12} />
                  </a>
                </div>

                <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginTop: '0.4rem', lineHeight: 1.45 }}>
                  {src.relevance}
                </p>

                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.6rem', fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
                  <span style={{ background: '#f1f5f9', padding: '0.1rem 0.45rem', borderRadius: '4px' }}>
                    Jurisdiction: {src.jurisdiction}
                  </span>
                  <span style={{ background: '#ecfdf5', color: '#047857', padding: '0.1rem 0.45rem', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                    <CheckCircle size={10} /> Official Government Source
                  </span>
                  <span>Verified: {src.lastChecked}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        <div style={{ marginTop: '1.75rem', textAlign: 'right' }}>
          <button type="button" className="btn btn-primary btn-sm" onClick={onClose}>
            Close Directory
          </button>
        </div>
      </div>
    </div>
  );
};
