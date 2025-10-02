import React from 'react';

interface NavbarProps {
  currentPage?: string;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPage }) => {
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

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <h1>Habit Tracker</h1>
      </div>
      <ul className="navbar-menu">
        {navItems.map((item) => (
          <li key={item.path} className={currentPage === item.path ? 'active' : ''}>
            <a href={item.path}>{item.label}</a>
          </li>
        ))}
      </ul>
    </nav>
  );
};
