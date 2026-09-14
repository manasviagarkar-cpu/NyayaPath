import React from 'react';
import { ShieldAlert, BookOpen, ExternalLink } from 'lucide-react';

interface FooterProps {
  onOpenSources: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenSources }) => {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-disclaimer">
          <p>
            <strong>Legal Information Disclaimer:</strong> NyayaPath provides general legal information, preparation assistance, and navigational direction for Indian citizens. It is <strong>not a law firm, does not act as an AI lawyer, and does not provide formal legal advice or representation</strong>. For definitive legal decisions or court representation, consult a licensed advocate or contact the District Legal Services Authority (DLSA).
          </p>
        </div>

        <div className="footer-bottom">
          <div>
            <p><strong>Emergency Helplines:</strong> 112 (National Emergency) • 15100 (NALSA Free Legal Aid) • 1091 (Women Helpline)</p>
            <p style={{ marginTop: '0.25rem', fontSize: '0.8rem' }}>
              Privacy Commitment: Uploaded documents are processed server-side in temporary memory and can be permanently deleted at any time.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
            <button 
              type="button" 
              onClick={onOpenSources} 
              style={{ background: 'none', border: 'none', color: 'var(--color-primary-light)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.88rem' }}
            >
              <BookOpen size={15} />
              Approved Sources
            </button>
            <span>&copy; {new Date().getFullYear()} NyayaPath India</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
