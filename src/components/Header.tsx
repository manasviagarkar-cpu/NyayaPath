import React from 'react';
import { Compass, BookOpen, ShieldCheck } from 'lucide-react';
import { AppStage } from '../types.js';

interface HeaderProps {
  currentStage: AppStage;
  onNavigate: (stage: AppStage) => void;
  onOpenSources: () => void;
  isMockMode?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentStage,
  onNavigate,
  onOpenSources,
  isMockMode = true
}) => {
  return (
    <header className="site-header">
      <div className="header-inner">
        <div 
          className="logo-brand" 
          onClick={() => onNavigate('landing')} 
          role="button" 
          tabIndex={0}
          title="NyayaPath Home"
        >
          <div className="logo-icon-wrap">
            <Compass size={22} />
          </div>
          <span>NyayaPath</span>
        </div>

        <div className="nav-actions">
          {isMockMode && (
            <span className="badge-demo" title="Deterministic mock mode active for reliable preview without live API key">
              Demo Mode
            </span>
          )}

          <button 
            type="button" 
            className="btn btn-secondary btn-sm"
            onClick={onOpenSources}
            title="View verified Indian legal sources"
          >
            <BookOpen size={16} />
            <span>Verified Sources</span>
          </button>

          {currentStage !== 'landing' && (
            <button
              type="button"
              className="btn btn-outline-primary btn-sm"
              onClick={() => onNavigate('landing')}
            >
              Start Over
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
