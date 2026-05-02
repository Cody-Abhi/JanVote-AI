import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { cn } from '../lib/utils';
import { LogIn, LogOut, Globe, Moon, Sun, Menu, User, ChevronDown, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function AppHeader({ onMenuClick }: { onMenuClick?: () => void }) {
  const { t, i18n } = useTranslation();
  const { user, signIn, logout } = useAuth();
  
  const [isDark, setIsDark] = useState(() => {
    return localStorage.getItem('darkMode') === 'true' || false;
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('darkMode', 'true');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('darkMode', 'false');
    }
  }, [isDark]);

  const toggleDarkMode = () => setIsDark(prev => !prev);

  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const langMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (langMenuRef.current && !langMenuRef.current.contains(event.target as Node)) {
        setIsLangMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Initialize lang from googtrans cookie or fallback to i18n
  const getInitialLang = () => {
    const match = document.cookie.match(/googtrans=\/en\/([a-z]{2})/);
    return match ? match[1] : (i18n.language || 'en');
  };
  const [currentLang, setCurrentLang] = useState(getInitialLang);

  const handleLanguageChange = (lang: string) => {
    setCurrentLang(lang);
    i18n.changeLanguage(lang);
    
    // Manage Google Translate cookie
    if (lang === 'en') {
       // To revert to English, we must delete the googtrans cookies
       document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname}`;
       document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
       document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.${window.location.hostname}`;
    } else {
       document.cookie = `googtrans=/en/${lang}; path=/; domain=${window.location.hostname}`;
       document.cookie = `googtrans=/en/${lang}; path=/;`;
       document.cookie = `googtrans=/en/${lang}; path=/; domain=.${window.location.hostname}`;
    }
    
    setIsLangMenuOpen(false);
    window.location.reload();
  };

  const languages = [
    { code: 'en', label: 'English', short: 'EN' },
    { code: 'hi', label: 'हिंदी', short: 'HI' },
    { code: 'bn', label: 'বাংলা', short: 'BN' },
    { code: 'te', label: 'తెలుగు', short: 'TE' },
    { code: 'ta', label: 'தமிழ்', short: 'TA' },
    { code: 'mr', label: 'मराठी', short: 'MR' }
  ];

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-[#FF6500]/15 h-[64px] flex items-center">
      <div className="flex w-full items-center justify-between px-4 gap-4">
        
        <button 
          onClick={onMenuClick}
          className="lg:hidden p-2 -ml-2 rounded-xl text-slate-500 hover:bg-slate-100 transition-colors"
        >
          <Menu className="h-6 w-6" />
        </button>

        <div className="flex items-center gap-4 ml-auto">
          <button
            onClick={toggleDarkMode}
            className={cn(
              "relative w-[48px] h-[26px] rounded-full transition-colors flex items-center px-1",
              isDark ? "bg-[#0B0F2E]" : "bg-slate-100"
            )}
            title="Toggle Dark Mode"
          >
            <div className={cn(
              "h-5 w-5 rounded-full flex items-center justify-center transition-transform shadow-sm",
              isDark ? "translate-x-[22px] bg-[#42A5F5]" : "translate-x-0 bg-[#FF6500]"
            )}>
              {isDark ? <Moon className="h-3 w-3 text-white" /> : <Sun className="h-3 w-3 text-white" />}
            </div>
          </button>

          <div className="relative" ref={langMenuRef}>
            <button
              onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
              className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 focus:bg-slate-200 transition-colors rounded-full px-3 py-1.5 border border-slate-200 shadow-inner"
            >
              <Globe className="h-4 w-4 text-slate-500" />
              <span className="text-sm font-bold text-slate-700 w-6 text-center">
                {languages.find(l => l.code === currentLang)?.short || 'EN'}
              </span>
              <ChevronDown className={cn("h-3 w-3 text-slate-400 transition-transform", isLangMenuOpen && "rotate-180")} />
            </button>

            <AnimatePresence>
              {isLangMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 py-2 z-50 overflow-hidden"
                >
                  <div className="px-3 pb-2 mb-2 border-b border-slate-100 text-[10px] font-black uppercase tracking-widest text-slate-400">
                    Select Language
                  </div>
                  {languages.map((lng) => (
                    <button
                      key={lng.code}
                      onClick={() => handleLanguageChange(lng.code)}
                      className={cn(
                        "w-full text-left px-4 py-2 text-sm font-semibold flex items-center justify-between transition-colors",
                        currentLang === lng.code 
                          ? "bg-[#FF6500]/10 text-[#FF6500]" 
                          : "text-slate-600 hover:bg-slate-50"
                      )}
                    >
                      <span className="flex items-center gap-3">
                         <span className={cn(
                           "text-[10px] uppercase font-black px-1.5 py-0.5 rounded-md",
                           currentLang === lng.code ? "bg-[#FF6500]/20 text-[#FF6500]" : "bg-slate-100 text-slate-500"
                         )}>
                           {lng.short}
                         </span>
                         {lng.label}
                      </span>
                      {currentLang === lng.code && <Check className="h-4 w-4 text-[#FF6500]" />}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {user ? (
             <div className="flex items-center gap-3">
               <Link 
                to="/profile" 
                className="flex items-center gap-2 group p-1 pr-3 rounded-full hover:bg-slate-100 transition-all border border-transparent hover:border-slate-200"
               >
                 <div className="h-8 w-8 rounded-full overflow-hidden border-2 border-white shadow-sm ring-1 ring-slate-100 group-hover:ring-[#FF6500]/30 transition-all">
                   {user.photoURL ? (
                     <img src={user.photoURL} alt="" className="h-full w-full object-cover" />
                   ) : (
                     <div className="h-full w-full bg-[#FF6500]/10 flex items-center justify-center text-[#FF6500] text-xs font-black">
                       {user.displayName?.[0] || 'U'}
                     </div>
                   )}
                 </div>
                 <div className="hidden sm:block text-left">
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none group-hover:text-[#FF6500] transition-colors">Profile</div>
                    <div className="text-xs font-bold text-slate-700 truncate max-w-[100px]">{user.displayName || 'Voter'}</div>
                 </div>
               </Link>
               <button
                  onClick={logout}
                  className="rounded-full bg-slate-100 p-2 text-slate-600 hover:bg-slate-200 active:scale-95 transition-all"
               >
                  <LogOut className="h-4 w-4" />
               </button>
             </div>
          ) : (
             <button
               onClick={signIn}
               className="flex items-center gap-1.5 rounded-full bg-[#FF6500] px-4 py-2 text-sm font-medium text-white hover:bg-[#FF8C38] transition-colors"
             >
                <LogIn className="h-4 w-4" />
                <span className="hidden sm:inline">{t('sign_in')}</span>
             </button>
          )}
        </div>
      </div>
    </header>
  );
}
