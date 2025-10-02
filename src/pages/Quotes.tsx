import React from 'react';
import { SavedWisdomPanel } from '../features/wisdom/SavedWisdomPanel';

export const Quotes: React.FC = () => {
  return (
    <div className="quotes-page">
      <h1>💫 My Saved Quotes</h1>
      <p className="page-description">
        Your personal collection of wisdom, saved for reflection and inspiration.
      </p>
      <SavedWisdomPanel />
    </div>
  );
};
