import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'motion/react';
import { Vote, MessageSquare, Calendar, Trophy, MapPin, BarChart3, Navigation, Globe, Users, Scale, X, User, Lock, CheckCircle } from 'lucide-react';
import { cn } from '../lib/utils';
import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

export default function Sidebar({ isOpen, setIsOpen }: { isOpen?: boolean, setIsOpen?: (v: boolean) => void }) {
  const { t } = useTranslation();
  const location = useLocation();
  const { user } = useAuth();

  const navItems = [
    { name: t('nav_home'), path: '/', icon: Vote },
    { name: t('nav_parties'), path: '/parties', icon: Users },
    { name: t('nav_chat'), path: '/chat', icon: MessageSquare, isProtected: true },
    { name: t('nav_timeline'), path: '/timeline', icon: Calendar },
    { name: t('nav_simulation', 'Simulation'), path: '/simulation', icon: Trophy },
    { name: t('nav_journey'), path: '/journey', icon: Navigation },
    { name: t('nav_readiness', 'Am I Ready?'), path: '/readiness', icon: CheckCircle },
    { name: t('nav_maps'), path: '/maps', icon: MapPin, isProtected: true },
    { name: t('nav_news', 'Live Context'), path: '/news', icon: Globe, isProtected: true },
    { name: t('nav_laws', 'Laws & Rules'), path: '/laws', icon: Scale },
    { name: t('nav_profile', 'My Profile'), path: '/profile', icon: User },
  ];

  // Close sidebar on route change on mobile
  useEffect(() => {
    if (setIsOpen) setIsOpen(false);
  }, [location.pathname, setIsOpen]);

  const sidebarContent = (
    <>
      <div className="flex flex-col pt-6 pb-4 px-6 justify-center shrink-0">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-[#0B0F2E]">
            <span className="text-2xl">🗳️</span>
            <span className="font-display text-[22px] tracking-wide mt-1">JanVote <span className="text-[#FF6500]">AI</span></span>
          </Link>
          {isOpen !== undefined && setIsOpen && (
            <button onClick={() => setIsOpen(false)} className="lg:hidden p-1 text-slate-400 hover:text-slate-600">
              <X className="h-5 w-5" />
            </button>
          )}
        </div>
        <div className="h-[1px] w-[60%] bg-[#FF6500] mt-4"></div>
      </div>

      <div className="flex-1 overflow-y-auto py-6 px-4">
        <div className="space-y-1">
          <h3 className="px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">
            {t('navigation', 'Navigation')}
          </h3>
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 rounded-xl px-4 h-[44px] text-sm transition-all group border-l-[3px]",
                location.pathname === item.path
                  ? "bg-[#FF6500]/12 text-[#0B0F2E] font-bold border-[#FF6500]"
                  : "bg-transparent text-slate-600 font-medium border-transparent hover:bg-[#FF6500]/5 hover:text-[#0B0F2E]"
              )}
            >
              <item.icon className={cn(
                "h-5 w-5 transition-colors",
                location.pathname === item.path ? "text-[#FF6500]" : "text-slate-400 group-hover:text-[#FF6500]/70"
              )} />
              <span className="flex-1 font-sans">{item.name}</span>
              {item.isProtected && !user && (
                <Lock className="h-4 w-4 text-slate-300" />
              )}
            </Link>
          ))}
        </div>
      </div>
      
      <div className="p-4 shrink-0 mb-2">
        <div className="bg-[#FF6500]/10 rounded-2xl p-4">
          <p className="text-xs font-sans font-semibold text-[#FF6500] text-center">
            {t('empower_nation', 'Empower Your Nation')} 🇮🇳
          </p>
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="fixed left-0 top-0 z-40 hidden h-screen w-64 border-r border-[#FF6500]/15 bg-white lg:flex flex-col">
        {sidebarContent}
      </aside>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen && setIsOpen(false)}
              className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', bounce: 0, duration: 0.3 }}
              className="fixed left-0 top-0 z-50 h-screen w-[280px] border-r border-[#FF6500]/15 bg-white flex flex-col lg:hidden shadow-2xl"
            >
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
