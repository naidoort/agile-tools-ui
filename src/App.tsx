import React, { useState } from 'react';
import Navigation from './components/Navigation';
import TeamManagement from './components/TeamManagement';
import TeamMemberManagement from './components/TeamMemberManagement';
import LeaveManagement from './components/LeaveManagement';
import './App.css';

function App() {
  const [currentView, setCurrentView] = useState('teams');

  const renderCurrentView = () => {
    switch (currentView) {
      case 'teams':
        return <TeamManagement />;
      case 'members':
        return <TeamMemberManagement />;
      case 'leaves':
        return <LeaveManagement />;
      default:
        return <TeamManagement />;
    }
  };

  return (
    <div className="App">
      <Navigation currentView={currentView} onViewChange={setCurrentView} />
      {renderCurrentView()}
    </div>
  );
}

export default App;
