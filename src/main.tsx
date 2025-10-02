import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

// Import pages
import { Home } from './pages/Home';
import { Trends } from './pages/Trends';
import { History } from './pages/History';
import { Settings } from './pages/Settings';
import { HabitSettings } from './pages/HabitSettings';
import { MedicationSettings } from './pages/MedicationSettings';
import { RatingSettings } from './pages/RatingSettings';
import { Navbar } from './components/Navbar';

// Simple routing (you can replace with react-router later)
function App() {
  const [currentPage, setCurrentPage] = React.useState(window.location.pathname);

  const renderPage = () => {
    switch (currentPage) {
      case '/':
        return <Home />;
      case '/habits':
        return <HabitSettings />;
      case '/medications':
        return <MedicationSettings />;
      case '/ratings':
        return <RatingSettings />;
      case '/trends':
        return <Trends />;
      case '/history':
        return <History />;
      case '/settings':
        return <Settings />;
      default:
        return <Home />;
    }
  };

  // Simple navigation handler
  React.useEffect(() => {
    const handleNavigation = (e: MouseEvent) => {
      const target = e.target as HTMLAnchorElement;
      if (target.tagName === 'A' && target.href.startsWith(window.location.origin)) {
        e.preventDefault();
        const path = target.getAttribute('href') || '/';
        setCurrentPage(path);
        window.history.pushState({}, '', path);
      }
    };

    const handlePopState = () => {
      setCurrentPage(window.location.pathname);
    };

    document.addEventListener('click', handleNavigation);
    window.addEventListener('popstate', handlePopState);
    
    return () => {
      document.removeEventListener('click', handleNavigation);
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  return (
    <div className="app">
      <Navbar currentPage={currentPage} />
      <main className="main-content">
        {renderPage()}
      </main>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
