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
import { Quotes } from './pages/Quotes';
import { Navbar } from './components/Navbar';

// Hash-based routing for GitHub Pages compatibility
function App() {
  // Use hash instead of pathname
  const getHashPath = () => {
    const hash = window.location.hash.slice(1); // Remove the '#'
    return hash || '/';
  };

  const [currentPage, setCurrentPage] = React.useState(getHashPath());

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
      case '/quotes':
        return <Quotes />;
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

  // Hash-based navigation handler
  React.useEffect(() => {
    const handleNavigation = (e: MouseEvent) => {
      const target = e.target as HTMLAnchorElement;
      if (target.tagName === 'A' && target.href.startsWith(window.location.origin)) {
        e.preventDefault();
        const path = target.getAttribute('href') || '/';
        setCurrentPage(path);
        window.location.hash = path;
      }
    };

    const handleHashChange = () => {
      setCurrentPage(getHashPath());
    };

    document.addEventListener('click', handleNavigation);
    window.addEventListener('hashchange', handleHashChange);
    
    return () => {
      document.removeEventListener('click', handleNavigation);
      window.removeEventListener('hashchange', handleHashChange);
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
