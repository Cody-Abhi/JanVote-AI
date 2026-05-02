import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Calendar, 
  MapPin, 
  Users, 
  Vote, 
  ChevronRight, 
  ChevronLeft,
  CalendarDays,
  Target,
  Trophy,
  History,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { cn } from '../lib/utils';

interface Phase {
  id: number;
  date: string;
  states: string[];
  seats: number;
  description: string;
  status: 'completed' | 'live' | 'upcoming' | 'results';
  voterTurnout?: string;
  keyIssues: string[];
}

const PHASES: Phase[] = [
  { 
    id: 1, 
    date: "April 19", 
    seats: 102, 
    states: ["Tamil Nadu", "Rajasthan", "Uttar Pradesh", "Madhya Pradesh", "Assam", "Uttarakhand"], 
    description: "The largest phase of the 2024 elections, covering the North-East, Southern regions, and crucial Northern districts.",
    status: 'completed',
    voterTurnout: '66.14%',
    keyIssues: ['Employment', 'Social Security', 'Regional Autonomy']
  },
  { 
    id: 2, 
    date: "April 26", 
    seats: 89, 
    states: ["Kerala", "Karnataka", "Rajasthan", "Maharashtra", "Uttar Pradesh", "West Bengal"], 
    description: "Focus shifted towards the heartland states and coastal Karnataka, marking a shift in the electoral momentum.",
    status: 'completed',
    voterTurnout: '66.71%',
    keyIssues: ['Agriculture', 'Price Rise', 'Infrastructure']
  },
  { 
    id: 3, 
    date: "May 7", 
    seats: 94, 
    states: ["Gujarat", "Karnataka", "Maharashtra", "Uttar Pradesh", "Madhya Pradesh", "Bihar"], 
    description: "Crucial Western India districts and remaining Southern major seats go to polls in this high-intensity phase.",
    status: 'completed',
    voterTurnout: '65.68%',
    keyIssues: ['Governance', 'Internal Security', 'Digital India']
  },
  { 
    id: 4, 
    date: "May 13", 
    seats: 96, 
    states: ["Telangana", "Andhra Pradesh", "Odisha", "Uttar Pradesh", "West Bengal"], 
    description: "The spotlight moves to the Deccan Plateau and Eastern coastal belts, featuring simultaneous Assembly polls.",
    status: 'completed',
    voterTurnout: '69.16%',
    keyIssues: ['Special Category Status', 'Farm Laws', 'Coastal Development']
  },
  { 
    id: 5, 
    date: "May 20", 
    seats: 49, 
    states: ["Maharashtra", "Uttar Pradesh", "West Bengal", "Bihar", "Odisha", "Jharkhand"], 
    description: "Mumbai Metropolitan Region and urban Uttar Pradesh become the focal point of the fifth phase.",
    status: 'completed',
    voterTurnout: '62.20%',
    keyIssues: ['Urban Planning', 'Housing', 'Transportation']
  },
  { 
    id: 6, 
    date: "May 25", 
    seats: 58, 
    states: ["Delhi", "Haryana", "Uttar Pradesh", "West Bengal", "Bihar", "Odisha"], 
    description: "The National Capital Region and grain-bowl states of Haryana go to the polls in the penultimate phase.",
    status: 'completed',
    voterTurnout: '63.37%',
    keyIssues: ['Pollution', 'Education', 'Wrestling Controversy']
  },
  { 
    id: 7, 
    date: "June 1", 
    seats: 57, 
    states: ["Punjab", "Uttar Pradesh", "West Bengal", "Himachal Pradesh", "Chandigarh"], 
    description: "The final push! North-western borders and the remaining seats of UP and West Bengal conclude the voting.",
    status: 'completed',
    voterTurnout: '63.88%',
    keyIssues: ['Drug Menace', 'Border Security', 'Tourism']
  },
  { 
    id: 8, 
    date: "June 4", 
    seats: 543, 
    states: ["All India"], 
    description: "The moment of truth. Counting starts at 8 AM across the country to determine the mandate of 1.4 billion people.",
    status: 'results',
    keyIssues: ['Democratic Mandate', 'Stability', ' coalition Dynamics']
  },
];

export default function Timeline() {
  const { t } = useTranslation();
  const [activePhase, setActivePhase] = useState(0);
  const [direction, setDirection] = useState(0); // 1 for next, -1 for prev
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const activeData = PHASES[activePhase];

  useEffect(() => {
    if (scrollContainerRef.current) {
      const activeElement = scrollContainerRef.current.children[activePhase] as HTMLElement;
      if (activeElement) {
        activeElement.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'center'
        });
      }
    }
  }, [activePhase]);

  const handlePhaseChange = (newIndex: number) => {
    setDirection(newIndex > activePhase ? 1 : -1);
    setActivePhase(newIndex);
  };

  const nextPhase = () => {
    const nextIdx = (activePhase + 1) % PHASES.length;
    handlePhaseChange(nextIdx);
  };

  const prevPhase = () => {
    const prevIdx = (activePhase - 1 + PHASES.length) % PHASES.length;
    handlePhaseChange(prevIdx);
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 100 : -100,
      opacity: 0,
      scale: 0.95,
      filter: "blur(10px)"
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1,
      filter: "blur(0px)"
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 100 : -100,
      opacity: 0,
      scale: 0.95,
      filter: "blur(10px)"
    })
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: "spring" as const, damping: 20 } }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 px-4 md:px-8 py-12 pb-24 bg-[#F7F3EE] min-h-screen">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="h-1.5 w-12 bg-[#FF6500] rounded-full" />
            <span className="text-[11px] font-black text-slate-500 uppercase tracking-[0.3em]">{t('nav_timeline')} ENGINE</span>
          </div>
          <h1 className="text-4xl md:text-[56px] font-display font-bold text-[#0B0F2E] tracking-tight leading-none">2024 Election Journey</h1>
          <p className="text-slate-600 font-sans text-lg mt-4 max-w-xl">
            A comprehensive look at the 8 high-stakes phases that defined the world's largest democratic process.
          </p>
        </div>
        
        <div className="flex items-center gap-4 bg-white border border-[#FF6500]/20 p-3 rounded-full shadow-[0_4px_20px_rgba(255,101,0,0.08)]">
          <div className="px-5 py-1 text-center border-r border-slate-100">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Seats</div>
            <div className="text-xl font-heading font-black text-[#0B0F2E] tracking-tight">543</div>
          </div>
          <div className="px-5 py-1 text-center border-r border-slate-100">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Phases</div>
            <div className="text-xl font-heading font-black text-[#0B0F2E] tracking-tight">07 + 01</div>
          </div>
          <div className="px-5 py-1 text-center">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Voters</div>
            <div className="text-xl font-heading font-black text-[#1565C0] tracking-tight">969M+</div>
          </div>
        </div>
      </div>

      {/* Main Interactive Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left Col: Timeline Track & Selection */}
        <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-28 lg:order-1 order-2">
          <div className="bg-transparent p-2">
            <div className="flex items-center justify-between mb-8">
              <h3 className="font-heading font-black text-[#0B0F2E] uppercase tracking-widest text-xs">Phase Navigator</h3>
            </div>

            <div 
              ref={scrollContainerRef}
              className="flex lg:flex-col gap-4 relative scrollbar-hide overflow-x-auto lg:overflow-visible pb-4 lg:pb-0"
            >
              {/* Vertical Connector Path (Desktop Only) */}
              <div className="absolute hidden lg:block left-[11px] top-6 bottom-6 w-[2px] bg-slate-200" />

              {PHASES.map((phase, idx) => {
                 let nodeColor = "bg-white border-slate-300";
                 let textColor = "text-slate-500";
                 
                 if (phase.status === 'completed') {
                   nodeColor = "bg-[#00796B] border-[#00796B]";
                   textColor = "text-slate-700";
                 }
                 if (activePhase === idx) {
                   nodeColor = "bg-[#FF6500] border-[#FF6500] shadow-[0_0_15px_rgba(255,101,0,0.4)]";
                   textColor = "text-[#0B0F2E]";
                 }
                 if (phase.status === 'results') {
                   nodeColor = activePhase === idx ? "bg-[#1565C0] border-[#1565C0]" : "bg-white border-[#1565C0]";
                 }

                 return (
                  <button
                    key={phase.id}
                    onClick={() => handlePhaseChange(idx)}
                    className={cn(
                      "flex-shrink-0 lg:w-full flex items-center gap-5 p-2 rounded-xl transition-all relative group min-w-[160px] lg:min-w-0",
                      activePhase === idx ? "translate-x-1" : "hover:translate-x-1"
                    )}
                  >
                    <div className={cn(
                      "h-6 w-6 rounded-full border-2 hidden lg:flex items-center justify-center relative z-10 transition-all",
                      nodeColor
                    )}>
                      {phase.status === 'completed' && activePhase !== idx && <Vote className="h-3 w-3 text-white" />}
                    </div>

                    <div className="flex-1 text-left">
                      <div className={cn(
                        "text-[10px] font-black uppercase tracking-widest mb-1 transition-colors",
                        activePhase === idx ? "text-[#FF6500]" : "text-slate-400"
                      )}>
                        {idx === 7 ? "Verdict" : `Phase ${phase.id}`}
                      </div>
                      <div className={cn(
                        "text-base font-sans font-bold transition-colors",
                        textColor,
                        activePhase === idx && "font-black"
                      )}>
                        {phase.date}
                      </div>
                    </div>
                  </button>
                 );
              })}
            </div>
          </div>
        </div>

        {/* Right Col: The Detailed Stage */}
        <div className="lg:col-span-8 lg:order-2 order-1">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={activePhase}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 }
              }}
              className={cn(
                "bg-white rounded-[24px] p-8 md:p-12 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)] relative overflow-hidden min-h-[630px] border-2",
                activeData.status === 'completed' ? "border-[#00796B]/20" :
                activeData.status === 'results' ? "border-[#1565C0]/20" :
                "border-[#FF6500]/20"
              )}
            >
              {/* Decorative Accent */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 0.02, scale: 1 }}
                key={`bg-id-${activePhase}`}
                className="absolute -top-10 -right-10 pointer-events-none select-none text-[#0B0F2E]"
              >
                <span className="text-[20rem] font-display font-black leading-none">{activeData.id}</span>
              </motion.div>

              <motion.div 
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="relative z-10 h-full flex flex-col"
              >
                <motion.div variants={itemVariants} className="flex flex-wrap items-center justify-between gap-4 mb-8">
                  <div className={cn(
                    "px-5 py-2 rounded-full text-xs font-black uppercase tracking-[0.2em] flex items-center gap-2",
                    activeData.status === 'completed' ? "bg-[#00796B]/10 text-[#00796B]" :
                    activeData.status === 'results' ? "bg-[#1565C0]/10 text-[#1565C0]" :
                    "bg-[#FF6500]/10 text-[#FF6500]"
                  )}>
                    {activeData.status === 'completed' ? <History className="h-3.5 w-3.5" /> : 
                     activeData.status === 'results' ? <Trophy className="h-3.5 w-3.5" /> : <CalendarDays className="h-3.5 w-3.5" />}
                    {activeData.status}
                  </div>

                  <div className="flex items-center gap-3 text-slate-500">
                    <Calendar className="h-5 w-5 text-[#FF6500]" />
                    <span className="text-lg font-bold font-sans text-slate-700">{activeData.date}, 2024</span>
                  </div>
                </motion.div>

                <motion.div variants={itemVariants} className="mb-12">
                  <h2 className="text-4xl md:text-[44px] font-display font-bold text-[#0B0F2E] tracking-tight mb-6">
                    {activeData.status === 'results' ? "The Final Mandate" : `Phase 0${activeData.id}: The Pulse`}
                  </h2>
                  <p className="text-[17px] text-slate-600 font-sans leading-[1.8] max-w-2xl">
                    {activeData.description}
                  </p>
                </motion.div>

                <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-12">
                  <div className="bg-[#F7F3EE] p-6 rounded-[20px] border border-transparent hover:border-[#FF6500]/30 transition-colors duration-500">
                    <div className="flex items-center gap-2 mb-3">
                      <Target className="h-4 w-4 text-[#FF6500]" />
                      <span className="text-[11px] font-black text-slate-500 uppercase tracking-widest">Seats Contested</span>
                    </div>
                    <div className="text-4xl font-display font-bold text-[#0B0F2E]">{activeData.seats}</div>
                    <p className="text-[11px] text-slate-500 mt-2 uppercase font-bold">Of total 543</p>
                  </div>

                  <div className="bg-[#F7F3EE] p-6 rounded-[20px] border border-transparent hover:border-[#00796B]/30 transition-colors duration-500">
                    <div className="flex items-center gap-2 mb-3">
                      <TrendingUp className="h-4 w-4 text-[#00796B]" />
                      <span className="text-[11px] font-black text-slate-500 uppercase tracking-widest">Voter Turnout</span>
                    </div>
                    <div className="text-4xl font-display font-bold text-[#0B0F2E]">{activeData.voterTurnout || "TBA"}</div>
                    <p className="text-[11px] text-slate-500 mt-2 uppercase font-bold">Participation rate</p>
                  </div>

                  <div className="bg-[#F7F3EE] p-6 rounded-[20px] border border-transparent hover:border-[#1565C0]/30 transition-colors duration-500">
                    <div className="flex items-center gap-2 mb-3">
                      <Users className="h-4 w-4 text-[#1565C0]" />
                      <span className="text-[11px] font-black text-slate-500 uppercase tracking-widest">Window</span>
                    </div>
                    <div className="text-4xl font-display font-bold text-[#0B0F2E]">{activeData.status === 'results' ? "08 AM+" : "07 AM - 06 PM"}</div>
                    <p className="text-[11px] text-slate-500 mt-2 uppercase font-bold">Standard Timing</p>
                  </div>
                </motion.div>

                <div className="space-y-10 mt-auto">
                  <motion.div variants={itemVariants}>
                    <h3 className="flex items-center gap-2 font-heading font-black text-xs uppercase tracking-[0.2em] text-[#0B0F2E] mb-5">
                      <MapPin className="h-4 w-4 text-[#FF6500]" /> Participating States
                    </h3>
                    <div className="flex flex-wrap gap-2.5">
                      {activeData.states.map((s, i) => (
                        <motion.span 
                          key={s} 
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.4 + (i * 0.05) }}
                          className="px-4 py-2 bg-white border border-slate-200 rounded-full text-sm font-sans font-bold text-slate-700 shadow-sm hover:border-[#FF6500] transition-colors cursor-default"
                        >
                          {s}
                        </motion.span>
                      ))}
                    </div>
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <h3 className="flex items-center gap-2 font-heading font-black text-xs uppercase tracking-[0.2em] text-[#0B0F2E] mb-5">
                      <AlertCircle className="h-4 w-4 text-[#1565C0]" /> Top Narratives
                    </h3>
                    <div className="flex flex-wrap gap-2.5">
                      {activeData.keyIssues.map((issue, i) => (
                        <motion.span 
                          key={issue} 
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.6 + (i * 0.1) }}
                          className="px-4 py-1.5 bg-slate-100 text-slate-600 rounded-md text-[13px] font-bold tracking-wide"
                        >
                          # {issue}
                        </motion.span>
                      ))}
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
      
      {/* Mobile Footer Spacing */}
      <div className="h-10 lg:hidden" />
    </div>
  );
}
