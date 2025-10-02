import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';

// Pages
import { Home } from './pages/Home';
import { Trends } from './pages/Trends';
import { History } from './pages/History';
import { Settings } from './pages/Settings';
import { HabitSettings } from './pages/HabitSettings';
import { MedicationSettings } from './pages/MedicationSettings';
import { RatingSettings } from './pages/RatingSettings';
import { Quotes } from './pages/Quotes';

// Components
import { Navbar } from './components/Navbar';

function App() {
  return (
    <HashRouter>
      <div className="app">
        <Navbar />
        <main className="main-content">
          <Routes>
            {/* root */}
            <Route path="/" element={<Home />} />
            {/* demo landing route for https://shyguyrymakesai.github.io/demo/#/demo */}
            <Route path="/demo" element={<Home />} />
            {/* app routes */}
            <Route path="/habits" element={<HabitSettings />} />
            <Route path="/medications" element={<MedicationSettings />} />
            <Route path="/ratings" element={<RatingSettings />} />
            <Route path="/quotes" element={<Quotes />} />
            <Route path="/trends" element={<Trends />} />
            <Route path="/history" element={<History />} />
            <Route path="/settings" element={<Settings />} />
            {/* catch-all → home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </HashRouter>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
