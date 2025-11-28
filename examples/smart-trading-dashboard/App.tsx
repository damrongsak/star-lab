import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import JournalView from './components/Journal/JournalView';
import AIAssistant from './components/AIAssistant';

const App: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentView, setCurrentView] = useState('dashboard');

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard />;
      case 'journal':
        return <JournalView />;
      default:
        return <Dashboard />; // Default to dashboard for now for other unimplemented views
    }
  };

  return (
    <div className="flex min-h-screen bg-background text-slate-300 font-sans selection:bg-primary selection:text-black">
      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
      
      {/* Sidebar Wrapper for Mobile */}
      <div className={`fixed inset-y-0 left-0 transform ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 transition duration-200 ease-in-out z-50 md:z-auto h-full`}>
        <Sidebar 
            currentView={currentView} 
            onNavigate={(view) => {
                setCurrentView(view);
                setMobileMenuOpen(false);
            }} 
        />
      </div>

      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <Header toggleMobileMenu={() => setMobileMenuOpen(!mobileMenuOpen)} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-background">
          {renderContent()}
        </main>
      </div>

      <AIAssistant />
    </div>
  );
};

export default App;