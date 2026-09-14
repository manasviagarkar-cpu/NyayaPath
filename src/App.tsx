import React, { useState, useEffect } from 'react';
import { Header } from './components/Header.js';
import { Footer } from './components/Footer.js';
import { LandingHero } from './components/LandingHero.js';
import { QuestionnaireForm } from './components/QuestionnaireForm.js';
import { DocumentUploader } from './components/DocumentUploader.js';
import { RoadmapView } from './components/RoadmapView.js';
import { SourcesModal } from './components/SourcesModal.js';
import { AppStage, WorkflowCategory, QuestionnaireAnswers, RoadmapResponse } from './types.js';

export const App: React.FC = () => {
  const [currentStage, setCurrentStage] = useState<AppStage>('landing');
  const [selectedWorkflow, setSelectedWorkflow] = useState<WorkflowCategory>('rental');
  const [answers, setAnswers] = useState<QuestionnaireAnswers | null>(null);
  const [prefilledAnswers, setPrefilledAnswers] = useState<Partial<QuestionnaireAnswers> | null>(null);
  const [documentId, setDocumentId] = useState<string | undefined>(undefined);
  const [roadmap, setRoadmap] = useState<RoadmapResponse | null>(null);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSourcesModalOpen, setIsSourcesModalOpen] = useState<boolean>(false);
  const [isMockMode, setIsMockMode] = useState<boolean>(true);

  // Check health endpoint and detect mock mode
  useEffect(() => {
    fetch('/api/health')
      .then(res => res.json())
      .then(data => {
        setIsMockMode(data.mode === 'mock');
      })
      .catch(() => {
        setIsMockMode(true);
      });
  }, []);

  const handleSelectWorkflow = (workflow: WorkflowCategory) => {
    setSelectedWorkflow(workflow);
    setPrefilledAnswers(null);
    setCurrentStage('questionnaire');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectExample = () => {
    setSelectedWorkflow('rental');
    setPrefilledAnswers({
      workflow: 'rental',
      state: 'Karnataka',
      district: 'Bengaluru Urban',
      description: 'My landlord is withholding my security deposit after I moved out.',
      dateOrRange: 'Vacated premises on 31st August; 11-month lease',
      hasWrittenDocument: 'yes',
      documentTypeDescription: 'Registered 11-Month Rental Agreement',
      hasReceivedDeadline: 'no',
      hasUrgentRisk: false
    });
    setCurrentStage('questionnaire');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleQuestionnaireSubmit = (submittedAnswers: QuestionnaireAnswers) => {
    setAnswers(submittedAnswers);
    setCurrentStage('upload');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGenerateRoadmap = async (docId?: string) => {
    if (!answers) return;

    setDocumentId(docId);
    setIsLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/roadmap/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          answers,
          documentId: docId
        })
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to generate legal roadmap.');
      }

      const data = await res.json();
      if (!data.roadmap) {
        throw new Error('Server returned an empty roadmap response.');
      }
      setRoadmap(data.roadmap);
      setCurrentStage('roadmap');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      console.error('Roadmap generation error:', err);
      setErrorMsg(err.message || 'An error occurred while generating your roadmap. Please retry.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteDocument = async () => {
    if (documentId) {
      try {
        await fetch(`/api/document/${documentId}`, { method: 'DELETE' });
        setDocumentId(undefined);
      } catch (err) {
        console.error('Failed to delete document:', err);
      }
    }
  };

  const handleReset = () => {
    if (documentId) {
      handleDeleteDocument();
    }
    setAnswers(null);
    setPrefilledAnswers(null);
    setDocumentId(undefined);
    setRoadmap(null);
    setErrorMsg(null);
    setCurrentStage('landing');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="app-container">
      <Header
        currentStage={currentStage}
        onNavigate={(stage) => {
          if (stage === 'landing') handleReset();
          else setCurrentStage(stage);
        }}
        onOpenSources={() => setIsSourcesModalOpen(true)}
        isMockMode={isMockMode}
      />

      <main className="main-content">
        {errorMsg && (
          <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#b91c1c', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>{errorMsg}</span>
            <button 
              type="button" 
              className="btn btn-secondary btn-sm"
              onClick={() => setErrorMsg(null)}
            >
              Dismiss
            </button>
          </div>
        )}

        {/* View 1: Landing Page */}
        {currentStage === 'landing' && (
          <LandingHero
            onSelectWorkflow={handleSelectWorkflow}
            onOpenSources={() => setIsSourcesModalOpen(true)}
            onSelectExample={handleSelectExample}
          />
        )}

        {/* View 2: Guided Questionnaire */}
        {currentStage === 'questionnaire' && (
          <QuestionnaireForm
            initialWorkflow={selectedWorkflow}
            initialAnswers={prefilledAnswers}
            onSubmit={handleQuestionnaireSubmit}
            onBack={() => setCurrentStage('landing')}
          />
        )}

        {/* View 3: Document Upload (Optional) */}
        {currentStage === 'upload' && (
          <DocumentUploader
            onGenerate={handleGenerateRoadmap}
            onBack={() => setCurrentStage('questionnaire')}
            isLoading={isLoading}
          />
        )}

        {/* View 4: Roadmap Result */}
        {currentStage === 'roadmap' && roadmap && answers && (
          <RoadmapView
            roadmap={roadmap}
            answers={answers}
            documentId={documentId}
            isMockMode={isMockMode}
            onReset={handleReset}
            onDeleteDocument={handleDeleteDocument}
            onOpenSources={() => setIsSourcesModalOpen(true)}
          />
        )}
      </main>

      <Footer onOpenSources={() => setIsSourcesModalOpen(true)} />

      <SourcesModal
        isOpen={isSourcesModalOpen}
        onClose={() => setIsSourcesModalOpen(false)}
      />
    </div>
  );
};
