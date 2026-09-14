import React from 'react';
import { Sparkles } from 'lucide-react';

interface DemoExampleButtonProps {
  onSelectExample: () => void;
}

export const DemoExampleButton: React.FC<DemoExampleButtonProps> = ({ onSelectExample }) => (
  <button
    type="button"
    className="btn btn-outline-primary"
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.45rem',
      borderColor: 'var(--color-primary-light)',
      background: '#ffffff',
    }}
    onClick={onSelectExample}
    title="Automatically load sample landlord dispute for fast evaluation"
  >
    <Sparkles size={16} color="var(--color-primary-light)" />
    <span>Try an example</span>
  </button>
);
