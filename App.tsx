
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
import { UserStats, UserProfile } from './types';
import FloatingMascot from './components/UI/FloatingMascot';

// Separate component to handle animated route transitions
const AnimatedRoutes: React.FC<any> = ({ userStats, userProfile, updateStats, updateProfile, isDarkMode, toggleTheme, refreshApp, appKey }) => {
  const location = useLocation();
  return (
    <div className="max-w-md mx-auto px-6 pt-4 pb-32 animate-fade-in" key={location.pathname}>
      <Routes>
        <Route path="/" element={<Home stats={userStats} userProfile={userProfile} />} />
        <Route path="/planner" element={<Planner />} />
        <Route path="/focus" element={<Focus stats={userStats} updateStats={updateStats} userProfile={userProfile} />} />
        <Route path="/reviews" element={<Reviews />} />
        <Route path="/shop" element={<Shop stats={userStats} updateStats={updateStats} userProfile={userProfile} />} />
        <Route path="/profile" element={
            <Profile 
                stats={userStats} 
                userProfile={userProfile}
                updateProfile={updateProfile}
                isDarkMode={isDarkMode} 
                toggleTheme={toggleTheme} 
                refreshApp={refreshApp}
            />
        } />
      </Routes>
    </div>
  )
}

const App: React.FC = () => {
  // --- STATE MANAGEMENT ---
  
  const [appKey, setAppKey] = useState(0);

  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('soraki-settings');
    return saved ? JSON.parse(saved).darkMode : false;
  });

  const [userProfile, setUserProfile] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('soraki-profile');
    return saved ? JSON.parse(saved) : null;
  });

  const [userStats, setUserStats] = useState<UserStats>(() => {
    const saved = localStorage.getItem('soraki-stats');
    if (saved) {
       const parsed = JSON.parse(saved);
       delete parsed.stars;
       delete parsed.inventory;
       return parsed;
    }
    return {
      streak: 0,
      totalHours: 0.0,
      sessions: 0,
      lastStudyDate: ''
    };
  });

  // --- REFRESH LOGIC (SOFT RELOAD) ---
  const refreshApp = () => {
    const savedStats = localStorage.getItem('soraki-stats');
    if (savedStats) setUserStats(JSON.parse(savedStats));

    const savedSettings = localStorage.getItem('soraki-settings');
    if (savedSettings) setIsDarkMode(JSON.parse(savedSettings).darkMode);
    
    const savedProfile = localStorage.getItem('soraki-profile');
    if (savedProfile) setUserProfile(JSON.parse(savedProfile));

    setAppKey(prev => prev + 1);
  };

  // --- EFFECTS ---

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  useEffect(() => {
    localStorage.setItem('soraki-settings', JSON.stringify({ darkMode: isDarkMode }));
  }, [isDarkMode]);

  useEffect(() => {
    localStorage.setItem('soraki-stats', JSON.stringify(userStats));
  }, [userStats]);
  
  useEffect(() => {
    if (userProfile) {
      localStorage.setItem('soraki-profile', JSON.stringify(userProfile));
    }
  }, [userProfile]);

  useEffect(() => {
    const date = new Date();
    const today = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

    if (userStats.lastStudyDate && userStats.lastStudyDate !== today) {
      const lastDate = new Date(userStats.lastStudyDate);
      const lastDateStrParts = userStats.lastStudyDate.split('-');
      const todayParts = today.split('-');
      
      const d1 = new Date(Number(lastDateStrParts[0]), Number(lastDateStrParts[1]) - 1, Number(lastDateStrParts[2]));
      const d2 = new Date(Number(todayParts[0]), Number(todayParts[1]) - 1, Number(todayParts[2]));

      const diffTime = Math.abs(d2.getTime() - d1.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
      
      if (diffDays > 1) {
         setUserStats(prev => ({ ...prev, streak: 0 }));
      }
    }
  }, []);

  // --- ACTIONS ---

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  const updateStats = (newStats: Partial<UserStats>) => {
    setUserStats(prev => {
        const updated = { ...prev, ...newStats };
        if (newStats.lastStudyDate) {
             if (prev.lastStudyDate !== newStats.lastStudyDate) {
                 if (prev.lastStudyDate) {
                     const date = new Date();
                     const today = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
                     if (newStats.lastStudyDate === today && prev.lastStudyDate !== today) {
                        updated.streak = (prev.streak || 0) + 1;
                     }
                 } else {
                     updated.streak = 1; 
                 }
            }
        }
        return updated;
    });
  };
  
  const updateProfile = (newProfile: Partial<UserProfile>) => {
    setUserProfile(prev => prev ? ({ ...prev, ...newProfile }) : null);
  };

  if (!userProfile) {
    return <Onboarding onComplete={(profile) => setUserProfile(profile)} />;
  }

  return (
    <HashRouter>
        <style>
        {`
          @keyframes float {
            0% { transform: translateY(0px); }
            50% { transform: translateY(-15px); }
            100% { transform: translateY(0px); }
          }
          .animate-float {
            animation-name: float;
          }

          @keyframes animated-gradient {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          .animate-gradient {
            background-size: 200% 200%;
            animation: animated-gradient 20s ease infinite;
          }

          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(8px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fade-in {
            animation: fadeIn 0.4s ease-out;
          }
        `}
      </style>
      <div key={appKey} className="min-h-screen bg-gradient-to-br from-soraki-bg to-soraki-bg-light text-soraki-text transition-colors duration-300 selection:bg-soraki-primary selection:text-white animate-gradient">
        <FloatingMascot />
        <Header userProfile={userProfile} />
        
        <AnimatedRoutes 
           userStats={userStats}
           userProfile={userProfile}
           updateStats={updateStats}
           updateProfile={updateProfile}
           isDarkMode={isDarkMode}
           toggleTheme={toggleTheme}
           refreshApp={refreshApp}
        />

        <BottomNav />
      </div>
    </HashRouter>
  );
};

export default App;
