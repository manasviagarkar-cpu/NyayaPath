import React from 'react';
import { ShieldAlert, BookOpen, ExternalLink } from 'lucide-react';

interface FooterProps {
  onOpenSources: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenSources }) => {
  return (
    <footer className="site-footer" role="contentinfo">
      <div className="footer-inner">
        <aside className="footer-disclaimer" aria-label="Legal Disclaimer">
          <p style={{ color: 'var(--color-text-main)', fontSize: '0.88rem' }}>
            <strong>Legal Information Disclaimer:</strong> NyayaPath provides general legal information, preparation assistance, and navigational direction for Indian citizens. It is <strong>not a law firm, does not act as an AI lawyer, and does not provide formal legal advice or representation</strong>. For definitive legal decisions or court representation, consult a licensed advocate or contact the District Legal Services Authority (DLSA).
          </p>
        </aside>

        <div className="footer-bottom">
          <section aria-label="Emergency Helplines and Privacy Information">
            <p style={{ color: 'var(--color-text-main)', fontSize: '0.9rem' }}>
              <strong>Emergency Helplines:</strong> 112 (National Emergency) • 15100 (NALSA Free Legal Aid) • 1091 (Women Helpline)
            </p>
            <p style={{ marginTop: '0.35rem', fontSize: '0.84rem', color: 'var(--color-text-muted)' }}>
              Privacy Commitment: Uploaded documents are processed server-side in temporary memory and can be permanently deleted at any time.
            </p>
          </section>

          <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <button 
              type="button" 
              onClick={onOpenSources} 
              style={{ 
                background: 'none', 
                border: 'none', 
                color: 'var(--color-primary-light)', 
                cursor: 'pointer', 
                display: 'inline-flex', 
                alignItems: 'center', 
                gap: '0.35rem', 
                fontSize: '0.9rem',
                fontWeight: 600,
                padding: '0.3rem 0.5rem',
                borderRadius: 'var(--radius-sm)'
              }}
              aria-label="View verified and approved official legal sources"
            >
              <BookOpen size={16} aria-hidden="true" />
              <span>Approved Sources</span>
            </button>
            <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
              &copy; {new Date().getFullYear()} NyayaPath India
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
