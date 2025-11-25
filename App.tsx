
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import BottomNav from './components/Layout/BottomNav';
import Header from './components/Layout/Header';
import Home from './pages/Home';
import Planner from './pages/Planner';
import Focus from './pages/Focus';
import Reviews from './pages/Reviews';
import Shop from './pages/Shop';
import Profile from './pages/Profile';
import Onboarding from './components/Onboarding/Onboarding';
import { UserProfile } from './types';
import FloatingMascot from './components/UI/FloatingMascot';
import { DataProvider } from './contexts/dataContext';

// Separate component to handle animated route transitions
const AnimatedRoutes: React.FC<any> = ({ userProfile, isDarkMode, toggleTheme, refreshApp }) => {
  const location = useLocation();
  return (
    <div className="max-w-md mx-auto px-6 pt-4 pb-32 animate-fade-in" key={location.pathname}>
      <Routes>
        <Route path="/" element={<Home userProfile={userProfile} />} />
        <Route path="/planner" element={<Planner />} />
        <Route path="/focus" element={<Focus userProfile={userProfile} />} />
        <Route path="/reviews" element={<Reviews />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/profile" element={
            <Profile 
                userProfile={userProfile}
                isDarkMode={isDarkMode} 
                toggleTheme={toggleTheme} 
                refreshApp={refreshApp}
            />
        } />
      </Routes>
    </div>
  )
}

const AppContent: React.FC = () => {
  const [appKey, setAppKey] = useState(0);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('soraki-settings');
    return saved ? JSON.parse(saved).darkMode : false;
  });
  const [userProfile, setUserProfile] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('soraki-profile');
    return saved ? JSON.parse(saved) : null;
  });

  const refreshApp = () => setAppKey(prev => prev + 1);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('soraki-settings', JSON.stringify({ darkMode: isDarkMode }));
  }, [isDarkMode]);

  useEffect(() => {
    if (userProfile) {
      localStorage.setItem('soraki-profile', JSON.stringify(userProfile));
    }
  }, [userProfile]);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  if (!userProfile) {
    return <Onboarding onComplete={(profile) => setUserProfile(profile)} />;
  }

  return (
    <HashRouter>
      <div key={appKey} className="min-h-screen bg-gradient-to-br from-soraki-bg to-soraki-bg-light text-soraki-text transition-colors duration-300 selection:bg-soraki-primary selection:text-white animate-gradient">
        <FloatingMascot />
        <Header userProfile={userProfile} />
        
        <AnimatedRoutes 
           userProfile={userProfile}
           isDarkMode={isDarkMode}
           toggleTheme={toggleTheme}
           refreshApp={refreshApp}
        />

        <BottomNav />
      </div>
    </HashRouter>
  );
}

const App: React.FC = () => (
  <DataProvider>
    <AppContent />
  </DataProvider>
);

export default App;
