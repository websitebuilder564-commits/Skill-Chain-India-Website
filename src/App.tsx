import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Hero } from './components/Hero';
import { Marketplace } from './components/Marketplace';
import { InnovationHub } from './components/InnovationHub';
import { SkillPass } from './components/SkillPass';
import { StudentDashboard } from './components/StudentDashboard';
import { CompanyDashboard } from './components/CompanyDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { GmailCenter } from './components/GmailCenter';
import { 
  Shield, 
  Menu, 
  X, 
  Bell, 
  User, 
  Compass, 
  Lightbulb, 
  LayoutDashboard, 
  Home, 
  ChevronDown,
  Sparkles,
  Award,
  LogIn,
  LogOut,
  Mail
} from 'lucide-react';

type ViewState = 'home' | 'marketplace' | 'innovation-hub' | 'dashboard' | 'skillpass' | 'gmail';

const AppContent: React.FC = () => {
  const { 
    currentRole, 
    setCurrentRole, 
    currentStudent, 
    notifications, 
    walletConnected, 
    walletAddress,
    connectWallet,
    currentUser,
    signInWithGoogle,
    signOutUser,
    loadingAuth
  } = useApp();

  const [currentView, setCurrentView] = useState<ViewState>('home');
  const [selectedStudentId, setSelectedStudentId] = useState<string | undefined>(undefined);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);

  // Active unread notifications
  const unreadCount = notifications.filter(n => {
    if (currentRole === 'student') return n.userId === (currentUser?.uid || 'student-current') && !n.read;
    if (currentRole === 'company') return n.userId === (currentUser?.uid || 'company-1') && !n.read;
    return n.userId === 'admin' && !n.read;
  }).length;

  const handleSelectStudentProfile = (id: string) => {
    setSelectedStudentId(id);
    setCurrentView('skillpass');
  };

  const handleSwitchRole = (role: 'student' | 'company' | 'admin') => {
    setCurrentRole(role);
    setRoleDropdownOpen(false);
    // Auto-navigate to that dashboard when switching roles to make validation seamless!
    setCurrentView('dashboard');
  };

  return (
    <div className="bg-[#050507] min-h-screen text-slate-300 font-sans flex flex-col justify-between relative overflow-hidden">
      
      {/* Background Atmosphere */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-indigo-900/15 rounded-full blur-[120px] pointer-events-none z-0"></div>
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-cyan-900/10 rounded-full blur-[100px] pointer-events-none z-0"></div>

      {/* GLOBAL SAAS NAVIGATION BAR */}
      <header className="sticky top-0 z-40 bg-black/40 backdrop-blur-md border-b border-white/5 px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
        
        {/* Brand Logo */}
        <div 
          onClick={() => setCurrentView('home')} 
          className="flex items-center gap-2.5 cursor-pointer group select-none z-10"
        >
          <div className="w-9 h-9 bg-gradient-to-tr from-cyan-500 to-indigo-600 rounded-xl flex items-center justify-center font-bold text-lg text-white shadow-[0_0_15px_rgba(6,182,212,0.4)] group-hover:scale-105 transition-transform">
            F
          </div>
          <span className="font-display font-extrabold tracking-wider text-white text-base sm:text-lg">
            FUNNGRO <span className="text-cyan-400 font-mono text-xs sm:text-sm font-semibold">WEB3</span>
          </span>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium z-10">
          <button 
            onClick={() => { setCurrentView('home'); setSelectedStudentId(undefined); }}
            className={`transition cursor-pointer ${currentView === 'home' ? 'text-cyan-400 font-bold' : 'text-slate-400 hover:text-white'}`}
          >
            Home
          </button>
          <button 
            onClick={() => { setCurrentView('marketplace'); setSelectedStudentId(undefined); }}
            className={`transition cursor-pointer ${currentView === 'marketplace' ? 'text-cyan-400 font-bold' : 'text-slate-400 hover:text-white'}`}
          >
            Marketplace
          </button>
          <button 
            onClick={() => { setCurrentView('innovation-hub'); setSelectedStudentId(undefined); }}
            className={`transition cursor-pointer ${currentView === 'innovation-hub' ? 'text-cyan-400 font-bold' : 'text-slate-400 hover:text-white'}`}
          >
            Innovation Hub
          </button>
          <button 
            onClick={() => { setCurrentView('dashboard'); setSelectedStudentId(undefined); }}
            className={`transition cursor-pointer ${currentView === 'dashboard' ? 'text-cyan-400 font-bold' : 'text-slate-400 hover:text-white'}`}
          >
            Dashboard
          </button>
          <button 
            onClick={() => { setCurrentView('gmail'); setSelectedStudentId(undefined); }}
            className={`transition cursor-pointer ${currentView === 'gmail' ? 'text-cyan-400 font-bold' : 'text-slate-400 hover:text-white'}`}
          >
            Gig Mail
          </button>
        </nav>

        {/* Action Controls & Role Selectors */}
        <div className="flex items-center gap-4 z-10">
          
          {/* Notifications Icon with Badge */}
          <button 
            onClick={() => setCurrentView('dashboard')}
            className="p-2 bg-white/5 border border-white/10 rounded-xl text-slate-400 hover:text-white transition relative cursor-pointer"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-cyan-500 text-white w-4 h-4 rounded-full text-[9px] font-bold font-mono flex items-center justify-center animate-pulse shadow-[0_0_8px_rgba(6,182,212,0.8)]">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Role switcher widget */}
          <div className="relative">
            <button 
              onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
              className="bg-white/5 hover:bg-white/10 border border-white/10 px-3.5 py-1.5 rounded-xl text-xs font-semibold text-slate-300 flex items-center gap-1.5 transition cursor-pointer select-none"
            >
              <User className="w-3.5 h-3.5 text-cyan-400" />
              <span className="capitalize">{currentRole} Portal</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
            </button>

            {roleDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-black border border-white/10 rounded-2xl shadow-2xl p-2.5 space-y-1 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <p className="text-[9px] font-mono font-bold text-slate-500 uppercase tracking-widest px-2 pb-1.5 border-b border-white/5">
                  Switch Portal View
                </p>
                <button 
                  onClick={() => handleSwitchRole('student')}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition ${currentRole === 'student' ? 'bg-cyan-500/10 text-cyan-400' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
                >
                  Student Builder Portal
                </button>
                <button 
                  onClick={() => handleSwitchRole('company')}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition ${currentRole === 'company' ? 'bg-cyan-500/10 text-cyan-400' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
                >
                  Partner Company Portal
                </button>
                <button 
                  onClick={() => handleSwitchRole('admin')}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition ${currentRole === 'admin' ? 'bg-cyan-500/10 text-cyan-400' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
                >
                  System Admin Console
                </button>
              </div>
            )}
          </div>

          {/* Google Auth Integration Widget */}
          {loadingAuth ? (
            <div className="w-8 h-8 rounded-xl border border-white/5 bg-white/5 animate-pulse"></div>
          ) : currentUser && !currentUser.isAnonymous ? (
            <div className="flex items-center gap-2">
              <img 
                src={currentUser.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'} 
                alt="Profile" 
                className="w-7 h-7 rounded-full border border-cyan-500/50 shadow-[0_0_10px_rgba(6,182,212,0.3)]"
                referrerPolicy="no-referrer"
              />
              <button 
                onClick={signOutUser}
                title="Sign Out"
                className="p-1.5 bg-white/5 hover:bg-red-500/20 hover:text-red-400 border border-white/10 rounded-xl text-slate-400 transition cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button 
              onClick={signInWithGoogle}
              className="bg-gradient-to-r from-cyan-500/10 to-indigo-500/10 hover:from-cyan-500/25 hover:to-indigo-500/25 border border-cyan-500/30 px-3.5 py-1.5 rounded-xl text-xs font-semibold text-cyan-300 flex items-center gap-1.5 transition cursor-pointer select-none"
            >
              <LogIn className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden sm:inline">Google Auth</span>
            </button>
          )}

          {/* Mobile hamburger menu toggle */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 bg-white/5 border border-white/10 rounded-xl text-slate-400 cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>

        </div>
      </header>

      {/* MOBILE EXPANDED MENU DRAWER */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed top-[69px] inset-x-0 bg-black/95 backdrop-blur-2xl border-b border-white/5 p-6 z-30 space-y-4 animate-in slide-in-from-top duration-200">
          <nav className="flex flex-col gap-4 text-sm font-medium">
            <button 
              onClick={() => { setCurrentView('home'); setMobileMenuOpen(false); }}
              className={`text-left transition cursor-pointer ${currentView === 'home' ? 'text-cyan-400' : 'text-slate-400'}`}
            >
              Home Landing
            </button>
            <button 
              onClick={() => { setCurrentView('marketplace'); setMobileMenuOpen(false); }}
              className={`text-left transition cursor-pointer ${currentView === 'marketplace' ? 'text-cyan-400' : 'text-slate-400'}`}
            >
              Opportunity Marketplace
            </button>
            <button 
              onClick={() => { setCurrentView('innovation-hub'); setMobileMenuOpen(false); }}
              className={`text-left transition cursor-pointer ${currentView === 'innovation-hub' ? 'text-cyan-400' : 'text-slate-400'}`}
            >
              Open Innovation Hub
            </button>
            <button 
              onClick={() => { setCurrentView('dashboard'); setMobileMenuOpen(false); }}
              className={`text-left transition cursor-pointer ${currentView === 'dashboard' ? 'text-cyan-400' : 'text-slate-400'}`}
            >
              My Dashboard
            </button>
            <button 
              onClick={() => { setCurrentView('gmail'); setMobileMenuOpen(false); }}
              className={`text-left transition cursor-pointer ${currentView === 'gmail' ? 'text-cyan-400' : 'text-slate-400'}`}
            >
              Gig Mail (Gmail)
            </button>
          </nav>
        </div>
      )}

      {/* CORE ROUTING SECTION */}
      <main className="flex-1 z-10" id="main-frame-router">
        {currentView === 'home' && (
          <Hero 
            onNavigate={(view) => {
              if (view === 'marketplace') setCurrentView('marketplace');
              else if (view === 'student-dashboard' || view === 'company-dashboard') setCurrentView('dashboard');
              else if (view === 'innovation-hub') setCurrentView('innovation-hub');
            }}
            onSelectStudent={handleSelectStudentProfile}
          />
        )}

        {currentView === 'marketplace' && (
          <Marketplace 
            onBackToHome={() => setCurrentView('home')}
            onNavigateToDashboard={() => setCurrentView('dashboard')}
          />
        )}

        {currentView === 'innovation-hub' && (
          <InnovationHub 
            onBackToHome={() => setCurrentView('home')}
            onNavigateToStudent={handleSelectStudentProfile}
          />
        )}

        {currentView === 'skillpass' && (
          <SkillPass 
            studentId={selectedStudentId}
            onBack={() => {
              // Return to the previous screen intelligently
              setCurrentView('home');
              setSelectedStudentId(undefined);
            }}
            isOwnProfile={selectedStudentId === undefined || selectedStudentId === 'student-current'}
          />
        )}

        {currentView === 'dashboard' && (
          <>
            {currentRole === 'student' && (
              <StudentDashboard 
                onNavigateToMarketplace={() => setCurrentView('marketplace')}
                onNavigateToSkillPass={() => { setSelectedStudentId(undefined); setCurrentView('skillpass'); }}
                onNavigateToInnovation={() => setCurrentView('innovation-hub')}
                onSelectStudent={handleSelectStudentProfile}
              />
            )}
            {currentRole === 'company' && (
              <CompanyDashboard />
            )}
            {currentRole === 'admin' && (
              <AdminDashboard />
            )}
          </>
        )}

        {currentView === 'gmail' && (
          <GmailCenter />
        )}
      </main>

      {/* MOBILE VIEW BOTTOM NAVIGATION DOCK (Touch targets prioritized 44px) */}
      <footer className="md:hidden sticky bottom-0 left-0 right-0 z-40 bg-black/90 backdrop-blur-xl border-t border-white/5 py-2.5 px-6 flex items-center justify-between" id="mobile-bottom-dock">
        <button 
          onClick={() => setCurrentView('home')}
          className={`flex flex-col items-center gap-1 cursor-pointer min-w-[44px] min-h-[44px] justify-center ${currentView === 'home' ? 'text-cyan-400' : 'text-slate-500'}`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] font-medium">Home</span>
        </button>
        <button 
          onClick={() => setCurrentView('marketplace')}
          className={`flex flex-col items-center gap-1 cursor-pointer min-w-[44px] min-h-[44px] justify-center ${currentView === 'marketplace' ? 'text-cyan-400' : 'text-slate-500'}`}
        >
          <Compass className="w-5 h-5" />
          <span className="text-[10px] font-medium">Market</span>
        </button>
        <button 
          onClick={() => setCurrentView('innovation-hub')}
          className={`flex flex-col items-center gap-1 cursor-pointer min-w-[44px] min-h-[44px] justify-center ${currentView === 'innovation-hub' ? 'text-cyan-400' : 'text-slate-500'}`}
        >
          <Lightbulb className="w-5 h-5" />
          <span className="text-[10px] font-medium">Hub</span>
        </button>
        <button 
          onClick={() => setCurrentView('gmail')}
          className={`flex flex-col items-center gap-1 cursor-pointer min-w-[44px] min-h-[44px] justify-center ${currentView === 'gmail' ? 'text-cyan-400' : 'text-slate-500'}`}
        >
          <Mail className="w-5 h-5" />
          <span className="text-[10px] font-medium">Mail</span>
        </button>
        <button 
          onClick={() => setCurrentView('dashboard')}
          className={`flex flex-col items-center gap-1 cursor-pointer min-w-[44px] min-h-[44px] justify-center ${currentView === 'dashboard' ? 'text-cyan-400' : 'text-slate-500'}`}
        >
          <LayoutDashboard className="w-5 h-5" />
          <span className="text-[10px] font-medium">Dashboard</span>
        </button>
      </footer>

    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
