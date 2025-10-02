import React, { useState, useEffect } from 'react';
import type { WisdomItem } from './types';
import { saveWisdomItem, unsaveWisdomItem, isWisdomItemSaved } from './savedWisdom';
import './WisdomCard.css';

interface WisdomCardProps {
  item: WisdomItem;
  onRefresh?: () => void;
}

export const WisdomCard: React.FC<WisdomCardProps> = ({ item, onRefresh }) => {
  const [isSaved, setIsSaved] = useState(false);
  const [showSavedMessage, setShowSavedMessage] = useState(false);

  useEffect(() => {
    setIsSaved(isWisdomItemSaved(item.id));
  }, [item.id]);

  const sourceEmojis: Record<string, string> = {
    koan: '🧘',
    stoic: '🏛️',
    poetry: '📜',
    bible: '✝️'
  };

  const handleSaveToggle = () => {
    if (isSaved) {
      unsaveWisdomItem(item.id);
      setIsSaved(false);
    } else {
      saveWisdomItem(item);
      setIsSaved(true);
      setShowSavedMessage(true);
      setTimeout(() => setShowSavedMessage(false), 2000);
    }
  };

  return (
    <div className="wisdom-card">
      <div className="wisdom-header">
        <div className="wisdom-source-badge">
          <span className="wisdom-emoji">{sourceEmojis[item.source]}</span>
          <span className="wisdom-source-label">{item.source.toUpperCase()}</span>
        </div>
        
        <div className="wisdom-actions">
          {onRefresh && (
            <button 
              className="wisdom-action-btn" 
              onClick={onRefresh}
              title="Get new quote"
              aria-label="Refresh quote"
            >
              🔄
            </button>
          )}
          <button 
            className={`wisdom-action-btn ${isSaved ? 'saved' : ''}`}
            onClick={handleSaveToggle}
            title={isSaved ? 'Unsave quote' : 'Save quote'}
            aria-label={isSaved ? 'Unsave quote' : 'Save quote'}
          >
            {isSaved ? '⭐' : '☆'}
          </button>
        </div>
      </div>

      {showSavedMessage && (
        <div className="wisdom-saved-message">
          ✓ Saved to your collection
        </div>
      )}
      
      {item.title && <h3 className="wisdom-title">{item.title}</h3>}
      
      <p className="wisdom-text">{item.text}</p>
      
      {(item.ref || item.attribution) && (
        <div className="wisdom-meta">
          {item.ref && <span className="wisdom-ref">{item.ref}</span>}
          {item.ref && item.attribution && <span className="wisdom-separator"> • </span>}
          {item.attribution && <span className="wisdom-attribution">{item.attribution}</span>}
        </div>
      )}
    </div>
  );
};

interface WeeklyKoansListProps {
  items: WisdomItem[];
}

export const WeeklyKoansList: React.FC<WeeklyKoansListProps> = ({ items }) => {
  if (!items.length) return null;

  return (
    <div className="weekly-koans-card">
      <h4 className="weekly-koans-title">🧘 This Week's Koans</h4>
      <ul className="weekly-koans-list">
        {items.map((koan) => (
          <li key={koan.id} className="weekly-koan-item">
            <span className="weekly-koan-name">{koan.title || koan.id}</span>
            {koan.ref && <span className="weekly-koan-ref"> — {koan.ref}</span>}
          </li>
        ))}
      </ul>
    </div>
  );
};
