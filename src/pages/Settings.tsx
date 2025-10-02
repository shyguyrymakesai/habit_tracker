import React, { useState } from 'react';
import { WisdomSettingsPanel } from '../features/wisdom/WisdomSettings';
import { SavedWisdomPanel } from '../features/wisdom/SavedWisdomPanel';

export const Settings: React.FC = () => {
  const [settings, setSettings] = useState({
    theme: 'light',
    notifications: true,
    weekStart: 'monday',
  });

  const handleExport = () => {
    // Export data
    console.log('Exporting data...');
  };

  const handleImport = () => {
    // Import data
    console.log('Importing data...');
  };

  const handleClearData = () => {
    if (confirm('Are you sure you want to clear all data?')) {
      // Clear all data
      console.log('Clearing data...');
    }
  };

  return (
    <div className="settings-page">
      <h1>Settings</h1>

      <section className="settings-section">
        <h2>Appearance</h2>
        <div className="setting-item">
          <label>Theme</label>
          <select 
            value={settings.theme} 
            onChange={(e) => setSettings({ ...settings, theme: e.target.value })}
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
            <option value="auto">Auto</option>
          </select>
        </div>
      </section>

      <section className="settings-section">
        <h2>Preferences</h2>
        <div className="setting-item">
          <label>
            <input 
              type="checkbox" 
              checked={settings.notifications}
              onChange={(e) => setSettings({ ...settings, notifications: e.target.checked })}
            />
            Enable notifications
          </label>
        </div>
        <div className="setting-item">
          <label>Week starts on</label>
          <select 
            value={settings.weekStart}
            onChange={(e) => setSettings({ ...settings, weekStart: e.target.value })}
          >
            <option value="sunday">Sunday</option>
            <option value="monday">Monday</option>
          </select>
        </div>
      </section>

      <section className="settings-section">
        <WisdomSettingsPanel />
      </section>

      <section className="settings-section">
        <SavedWisdomPanel />
      </section>

      <section className="settings-section">
        <h2>Data Management</h2>
        <div className="setting-actions">
          <button onClick={handleExport}>Export Data</button>
          <button onClick={handleImport}>Import Data</button>
          <button onClick={handleClearData} className="danger">Clear All Data</button>
        </div>
      </section>
    </div>
  );
};
