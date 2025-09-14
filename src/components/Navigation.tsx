import React from 'react';
import './common.css';

interface NavigationProps {
  currentView: string;
  onViewChange: (view: string) => void;
}

const Navigation: React.FC<NavigationProps> = ({ currentView, onViewChange }) => {
  const navItems = [
    { key: 'teams', label: 'Teams' },
    { key: 'members', label: 'Team Members' },
    { key: 'leaves', label: 'Leave Management' },
  ];

  return (
    <nav style={{
      backgroundColor: '#f8f9fa',
      padding: '10px 0',
      marginBottom: '20px',
      borderBottom: '1px solid #dee2e6'
    }}>
      <div className="container">
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <h2 style={{ margin: 0, color: '#2c3e50' }}>Agile Tools</h2>
          <div style={{ display: 'flex', gap: '10px' }}>
            {navItems.map((item) => (
              <button
                key={item.key}
                className={`btn ${currentView === item.key ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => onViewChange(item.key)}
                style={{ minWidth: '120px' }}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;