import React, { useState, useEffect } from 'react';
import { loadSettings, saveSettings } from './wisdom';
import type { WisdomSettings as WisdomSettingsType, WisdomSource } from './types';
import './WisdomSettings.css';

export const WisdomSettingsPanel: React.FC = () => {
  const [settings, setSettings] = useState<WisdomSettingsType>(loadSettings());

  useEffect(() => {
    saveSettings(settings);
  }, [settings]);

  const toggleSource = (source: WisdomSource) => {
    setSettings({
      ...settings,
      enabledSources: {
        ...settings.enabledSources,
        [source]: !settings.enabledSources[source]
      }
    });
  };

  const sources: Array<{ key: WisdomSource; label: string; emoji: string }> = [
    { key: 'bible', label: 'Bible Verses', emoji: '✝️' },
    { key: 'koan', label: 'Zen Koans', emoji: '🧘' },
    { key: 'stoic', label: 'Stoic Quotes', emoji: '🏛️' },
    { key: 'poetry', label: 'Poetry', emoji: '📜' }
  ];

  return (
    <div className="wisdom-settings">
      <h3 className="wisdom-settings-title">Daily Wisdom Sources</h3>
      <p className="wisdom-settings-description">
        Choose which sources to include in your daily wisdom rotation.
      </p>
      
      <div className="wisdom-sources-grid">
        {sources.map(({ key, label, emoji }) => (
          <label key={key} className="wisdom-source-toggle">
            <input
              type="checkbox"
              checked={settings.enabledSources[key]}
              onChange={() => toggleSource(key)}
              className="wisdom-checkbox"
            />
            <span className="wisdom-source-icon">{emoji}</span>
            <span className="wisdom-source-name">{label}</span>
          </label>
        ))}
      </div>
    </div>
  );
};
