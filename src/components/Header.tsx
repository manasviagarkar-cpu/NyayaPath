import React from 'react';
import { Compass, BookOpen } from 'lucide-react';
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
        <button 
          type="button"
          className="logo-brand" 
          onClick={() => onNavigate('landing')} 
          aria-label="NyayaPath Home - Go to start page"
        >
          <div className="logo-icon-wrap" aria-hidden="true">
            <Compass size={22} />
          </div>
          <span>NyayaPath</span>
        </button>

        <nav className="nav-actions" aria-label="Main Navigation">
          {isMockMode && (
            <span 
              className="badge-demo" 
              title="Interactive prototype with simulated roadmap generation."
            >
              Interactive Prototype (Simulated)
            </span>
          )}

          <button 
            type="button" 
            className="btn btn-secondary btn-sm"
            onClick={onOpenSources}
            title="View verified Indian legal sources"
          >
            <BookOpen size={16} aria-hidden="true" />
            <span>Verified Sources</span>
          </button>

          {currentStage !== 'landing' && (
            <button
              type="button"
              className="btn btn-outline-primary btn-sm"
              onClick={() => onNavigate('landing')}
              aria-label="Start over and reset current questionnaire"
            >
              Start Over
            </button>
          )}
        </nav>
      </div>
    </header>
  );
};
