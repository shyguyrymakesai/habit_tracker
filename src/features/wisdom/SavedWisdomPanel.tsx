import React, { useState, useEffect } from 'react';
import { getSavedWisdom, unsaveWisdomItem } from './savedWisdom';
import type { SavedWisdomItem } from './types';
import './SavedWisdomPanel.css';

export const SavedWisdomPanel: React.FC = () => {
  const [savedItems, setSavedItems] = useState<SavedWisdomItem[]>([]);

  useEffect(() => {
    loadSavedItems();
  }, []);

  const loadSavedItems = () => {
    setSavedItems(getSavedWisdom());
  };

  const handleUnsave = (id: string) => {
    unsaveWisdomItem(id);
    loadSavedItems();
  };

  const sourceEmojis: Record<string, string> = {
    koan: '🧘',
    stoic: '🏛️',
    poetry: '📜',
    bible: '✝️'
  };

  if (savedItems.length === 0) {
    return (
      <div className="saved-wisdom-panel">
        <h3 className="saved-wisdom-title">💫 Saved Wisdom</h3>
        <p className="saved-wisdom-empty">
          No saved quotes yet. Click the ☆ button on any wisdom card to save it here.
        </p>
      </div>
    );
  }

  return (
    <div className="saved-wisdom-panel">
      <h3 className="saved-wisdom-title">💫 Saved Wisdom ({savedItems.length})</h3>
      
      <div className="saved-wisdom-list">
        {savedItems.map((item) => (
          <div key={item.id} className="saved-wisdom-item">
            <div className="saved-wisdom-header">
              <span className="saved-wisdom-source">
                {sourceEmojis[item.source]} {item.source.toUpperCase()}
              </span>
              <button
                className="saved-wisdom-remove"
                onClick={() => handleUnsave(item.id)}
                title="Remove from saved"
                aria-label="Remove from saved"
              >
                ✕
              </button>
            </div>
            
            {item.title && <h4 className="saved-wisdom-item-title">{item.title}</h4>}
            
            <p className="saved-wisdom-text">{item.text}</p>
            
            {(item.ref || item.attribution) && (
              <div className="saved-wisdom-meta">
                {item.ref && <span>{item.ref}</span>}
                {item.ref && item.attribution && <span> • </span>}
                {item.attribution && <span>{item.attribution}</span>}
              </div>
            )}
            
            <div className="saved-wisdom-date">
              Saved {new Date(item.savedAt).toLocaleDateString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
