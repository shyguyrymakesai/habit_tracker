import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';

export const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/habits', label: 'Habits' },
    { path: '/medications', label: 'Medications' },
    { path: '/ratings', label: 'Ratings' },
    { path: '/quotes', label: 'Quotes' },
    { path: '/trends', label: 'Trends' },
    { path: '/history', label: 'History' },
    { path: '/settings', label: 'Settings' },
  ];

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <h1>Habit Tracker</h1>
      </div>
      
      <button 
        className="navbar-hamburger" 
        onClick={toggleMenu}
        aria-label="Toggle menu"
        aria-expanded={isMenuOpen}
      >
        <span className={`hamburger-line ${isMenuOpen ? 'open' : ''}`}></span>
        <span className={`hamburger-line ${isMenuOpen ? 'open' : ''}`}></span>
        <span className={`hamburger-line ${isMenuOpen ? 'open' : ''}`}></span>
      </button>

      <ul className={`navbar-menu ${isMenuOpen ? 'open' : ''}`}>
        {navItems.map((item) => (
          <li key={item.path}>
            <NavLink 
              to={item.path}
              className={({ isActive }) => isActive ? 'active' : ''}
              onClick={closeMenu}
            >
              {item.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
};
