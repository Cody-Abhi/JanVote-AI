import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Vote } from 'lucide-react';
import './lib/i18n';
import Sidebar from './components/Sidebar';
import AppHeader from './components/AppHeader';
import Home from './pages/Home';
import ChatAssistant from './pages/ChatAssistant';
import Timeline from './pages/Timeline';
import Parties from './pages/Parties';
import Quiz from './pages/Quiz';
import VoterJourney from './pages/VoterJourney';
import BoothLocator from './pages/BoothLocator';
import VoterReadiness from './pages/VoterReadiness';

import StatsDashboard from './pages/StatsDashboard';
import Leaderboard from './pages/Leaderboard';
import Simulation from './pages/Simulation';
import ElectoralLaws from './pages/ElectoralLaws';
import RealTimeIntel from './pages/RealTimeIntel';
import Profile from './pages/Profile';
import { AuthProvider, useAuth } from './context/AuthContext';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading, signIn } = useAuth();
  
  if (loading) {
    return <div className="flex-1 flex items-center justify-center p-8 text-slate-500 font-medium">Loading...</div>;
  }
  
  if (!user) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center max-w-md mx-auto">
        <div className="w-16 h-16 bg-[#FFF8F0] text-[#FF6500] flex items-center justify-center rounded-2xl mb-6 border border-[#FF6500]/20">
          <Vote className="h-8 w-8" />
        </div>
        <h2 className="text-2xl font-bold text-[#0B0F2E] mb-3 font-heading">Sign in Required</h2>
        <p className="text-slate-600 mb-8 leading-relaxed font-sans">
          You need to sign in to access the AI Assistant, Booth Finder, and Live Context features. Join us to unlock all personalized tools.
        </p>
        <button 
          onClick={signIn}
          className="bg-[#FF6500] text-white px-8 py-3 rounded-2xl font-heading font-semibold shadow-md shadow-[#FF6500]/20 hover:shadow-lg hover:bg-[#FF8C38] transition-all active:scale-95"
        >
          Sign in with Google
        </button>
      </div>
    );
  }

  return <>{children}</>;
}

function AppFooter() {
  const location = useLocation();
  if (location.pathname === '/chat') return null;

  return (
    <footer className="w-full bg-[#0B0F2E] text-white mt-auto shrink-0 relative">
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-[#FF6500]"></div>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#0B0F2E] px-2 rounded-full">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FF6500" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
      </div>
      <div className="max-w-6xl mx-auto px-4 md:px-6 pt-12 pb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div className="flex flex-col items-center md:items-start gap-3">
            <div className="flex items-center gap-2">
              <span className="font-display font-black tracking-tight text-2xl text-white">JanVote <span className="text-[#FF6500]">AI</span></span>
            </div>
            <p className="text-sm text-white/60 font-sans text-center md:text-left">Empowering India's Voters</p>
            <div className="flex w-10 h-1 mt-2">
              <div className="flex-1 bg-[#FF6500]"></div>
              <div className="flex-1 bg-white"></div>
              <div className="flex-1 bg-[#00796B]"></div>
            </div>
          </div>
          <div className="flex justify-center items-center gap-6 text-sm font-sans text-white/60">
            <a href="#" className="hover:text-[#FF6500] transition-colors">Privacy</a>
            <a href="#" className="hover:text-[#FF6500] transition-colors">Terms</a>
            <a href="#" className="hover:text-[#FF6500] transition-colors">Contact</a>
          </div>
          <div className="flex items-center justify-center md:justify-end text-sm text-white/80 font-sans">
            Made with ❤️ for India
          </div>
        </div>
        <div className="text-xs text-white/30 font-sans text-center border-t border-white/10 pt-6">
          &copy; {new Date().getFullYear()} JanVote AI. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

function MainContent({ isSidebarOpen, setIsSidebarOpen }: { isSidebarOpen: boolean, setIsSidebarOpen: (v: boolean) => void }) {
  const location = useLocation();
  const isChat = location.pathname === '/chat';

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-900 overflow-hidden">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      <div className="flex-1 lg:ml-64 flex flex-col h-screen overflow-hidden">
        <AppHeader onMenuClick={() => setIsSidebarOpen(true)} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto flex flex-col min-h-0">
          <div className={`mx-auto w-full grow flex flex-col ${isChat ? '' : 'p-4 md:p-6 max-w-6xl'}`}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/chat" element={
                <ProtectedRoute>
                  <ChatAssistant />
                </ProtectedRoute>
              } />
              <Route path="/timeline" element={<Timeline />} />
              <Route path="/parties" element={<Parties />} />
              <Route path="/quiz" element={<Quiz />} />
              <Route path="/journey" element={<VoterJourney />} />
              <Route path="/readiness" element={<VoterReadiness />} />
              <Route path="/maps" element={

                <ProtectedRoute>
                  <BoothLocator />
                </ProtectedRoute>
              } />
              <Route path="/stats" element={<StatsDashboard />} />
              <Route path="/leaderboard" element={<Leaderboard />} />
              <Route path="/simulation" element={<Simulation />} />
              <Route path="/laws" element={<ElectoralLaws />} />
              <Route path="/news" element={
                <ProtectedRoute>
                  <RealTimeIntel />
                </ProtectedRoute>
              } />
              <Route path="/profile" element={<Profile />} />
            </Routes>
          </div>
          <AppFooter />
        </main>
      </div>
    </div>
  );
}



export default function App() {
  const { t } = useTranslation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <AuthProvider>
      <Router>
        <MainContent isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
      </Router>
    </AuthProvider>
  );
}
