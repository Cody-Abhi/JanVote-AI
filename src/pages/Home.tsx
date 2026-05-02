import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { 
  Vote, 
  ArrowRight,
  MessageSquare, 
  Calendar, 
  Trophy, 
  MapPin, 
  StepForward as Stepper,
  Users,
  ChevronDown,
  Rss,
  Activity
} from 'lucide-react';
import { getRealTimeElectionNews } from '../lib/gemini';
import { cn } from '../lib/utils';
export default function Home() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-24 pb-24">
      {/* Hero Section */}
      <section className="relative w-full z-10 min-h-[90vh] flex items-center justify-center bg-[#FFF8F0] overflow-hidden px-4 sm:px-6 md:px-8 py-20">
        {/* Background Texture & Decor */}
        <div className="absolute inset-0 opacity-8 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
        <div className="absolute top-0 left-0 right-0 bottom-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-1/4 -left-1/4 w-[150%] h-[50%] bg-[#FF6500]/4 -rotate-12 transform origin-top-left"></div>
        </div>

        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center relative z-10">
          
          {/* Left Text Stack (55%) */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="mb-8 inline-flex items-center gap-2 rounded-full border border-[#FF6500] px-5 py-2 text-xs font-black uppercase tracking-[0.1em] text-[#FF6500]"
            >
               <span className="h-2 w-2 rounded-full bg-[#FF6500] animate-pulse"></span>
               🗳️ {t('ai_powered_badge', 'AI-POWERED VOTER EDUCATION')}
            </motion.div>
            
            <h1 className="mb-6 font-display font-bold leading-[1.1] text-[#0B0F2E] flex flex-col gap-2">
              <motion.span 
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="text-5xl sm:text-6xl md:text-[80px]"
              >
                {t('hero_main_1')}
              </motion.span>
              <motion.span 
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.32, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="text-5xl sm:text-6xl md:text-[80px]"
              >
                {t('hero_main_2')}
              </motion.span>
            </h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mb-10 text-lg sm:text-[18px] text-slate-600 font-sans max-w-[480px] leading-relaxed"
            >
              {t('hero_desc')}
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
            >
              <Link
                to="/chat"
                className="flex items-center justify-center gap-3 rounded-full bg-[#FF6500] h-[56px] px-8 font-heading font-bold text-white shadow-xl shadow-[#FF6500]/20 transition-all hover:scale-[1.03] hover:bg-[#FF8C38] active:scale-[0.98]"
              >
                🤖 {t('consult_ai')}
              </Link>
              <Link
                to="/maps"
                className="flex items-center justify-center gap-3 rounded-full bg-transparent border-2 border-[#0B0F2E] h-[56px] px-8 font-heading font-bold text-[#0B0F2E] transition-all hover:bg-[#0B0F2E]/5 hover:scale-[1.03] active:scale-[0.98]"
              >
                🗺️ {t('find_booth')}
              </Link>
            </motion.div>
          </div>

          {/* Right SVG Illustration (45%) */}
          <motion.div 
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="lg:col-span-5 relative flex justify-center items-center h-[400px] lg:h-[500px]"
          >
             {/* Ashoka Chakra watermark */}
             <div className="absolute inset-0 flex items-center justify-center opacity-10">
               <svg className="animate-[spin_12s_linear_infinite]" width="300" height="300" viewBox="0 0 24 24" fill="none" stroke="#0B0F2E" strokeWidth="0.5"><circle cx="12" cy="12" r="10"/><path d="M12 2v20M2 12h20M4.9 4.9l14.2 14.2M4.9 19.1L19.1 4.9"/></svg>
             </div>
             
             {/* Abstract EVM Illustration */}
             <div className="relative z-10 w-[280px] h-[360px] bg-[#1C1C1C] rounded-[24px] border-[3px] border-slate-700 shadow-2xl p-6 flex flex-col justify-between">
               <div className="w-full text-center border-b border-slate-700 pb-2">
                 <div className="text-[10px] text-white/50 font-mono tracking-widest uppercase">ELECTION COMMISSION</div>
               </div>
                <div className="space-y-4 my-auto">
                  {[
                    { id: 'bjp', logo: '/logos/Bharatiya_Janata_Party_(icon).svg.png' },
                    { id: 'inc', logo: '/logos/Indian_National_Congress_hand_logo.png' },
                    { id: 'aap', logo: '/logos/aap-logo-650_650x400_41428497829.webp' }
                  ].map((party, i) => (
                    <div key={party.id} className="flex items-center justify-between bg-[#2A2A2A] rounded-lg p-3">
                      <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center overflow-hidden">
                        <img src={party.logo} alt={party.id} className="w-6 h-6 object-contain" />
                      </div>
                      <div className="flex-1 mx-4 h-4 bg-slate-600/30 rounded"></div>
                      <div className={cn("w-10 h-6 rounded border", i === 0 ? "bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.5)] border-red-400" : "bg-black border-slate-600")}></div>
                    </div>
                  ))}
                </div>
               <div className="w-full h-12 bg-[#00796B] rounded-lg flex items-center justify-center">
                  <div className="w-3/4 h-2 bg-green-300/50 rounded-full"></div>
               </div>
               
               {/* Animated Hand Approaching */}
               <motion.div 
                 animate={{ y: [20, 0, 20], x: [10, -5, 10] }}
                 transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                 className="absolute -right-16 top-1/2 text-[80px]"
               >
                 👆
               </motion.div>
             </div>
          </motion.div>
        </div>
        
        {/* Scroll Indicator */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
           <svg className="animate-[spin_10s_linear_infinite]" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#0B0F2E" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><path d="M12 2v20M2 12h20M4.9 4.9l14.2 14.2M4.9 19.1L19.1 4.9"/></svg>
           <span className="text-[10px] font-black uppercase tracking-widest text-[#0B0F2E]/60">{t('scroll_explore')}</span>
        </div>
      </section>

      {/* Stats Strip */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        className="w-full -mt-10 sm:-mt-12 relative z-20 overflow-hidden"
      >
        <div className="w-[105%] -ml-[2.5%] h-auto bg-gradient-to-r from-[#FF6500] via-[#D4A017] to-[#00796B] rotate-[-2deg] transform origin-center flex items-center justify-center py-10 shadow-2xl">
           <div className="w-full max-w-7xl mx-auto px-8 rotate-[2deg]">
             <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4 divide-x-0 md:divide-x divide-white/30 text-center">
               <div className="flex flex-col items-center justify-center">
                 <div className="text-4xl md:text-5xl font-mono text-white font-bold mb-1">969M+</div>
                 <div className="text-xs font-sans text-white/70 uppercase tracking-wider">{t('eligible_voters')}</div>
               </div>
               <div className="flex flex-col items-center justify-center">
                 <div className="text-4xl md:text-5xl font-mono text-white font-bold mb-1">543</div>
                 <div className="text-xs font-sans text-white/70 uppercase tracking-wider">{t('lok_sabha_seats')}</div>
               </div>
               <div className="flex flex-col items-center justify-center">
                 <div className="text-4xl md:text-5xl font-mono text-white font-bold mb-1">7</div>
                 <div className="text-xs font-sans text-white/70 uppercase tracking-wider">{t('phases')}</div>
               </div>
               <div className="flex flex-col items-center justify-center">
                 <div className="text-4xl md:text-5xl font-mono text-white font-bold mb-1">100%</div>
                 <div className="text-xs font-sans text-white/70 uppercase tracking-wider">{t('your_vote_counts')}</div>
               </div>
             </div>
           </div>
        </div>
      </motion.section>

      {/* Maps Section Removed previously */}

      {/* Modules Grid */}

      <div className="text-center relative max-w-7xl mx-auto px-4 sm:px-6 md:px-8 w-full mt-12">
        <h2 className="text-xs font-black uppercase tracking-[0.2em] text-[#FF6500] mb-4">{t('core_cap')}</h2>
        <h3 className="text-4xl md:text-5xl font-black tracking-tight mb-16 font-display text-[#0B0F2E]">{t('empower_vote')}</h3>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
           <ModuleCard title={t('elector_ai_title')} path="/chat" icon={MessageSquare} desc={t('elector_ai_desc')} delay={0.1} color="#FF6500" />
           <ModuleCard title={t('timeline_title')} path="/timeline" icon={Calendar} desc={t('timeline_desc')} delay={0.2} color="#1565C0" />
           <ModuleCard title={t('sim_title')} path="/simulation" icon={Trophy} desc={t('sim_desc')} delay={0.3} color="#00796B" />
           <ModuleCard title={t('parties_title')} path="/parties" icon={Users} desc={t('parties_desc')} delay={0.4} color="#D4A017" />
           <ModuleCard title={t('booth_title')} path="/maps" icon={MapPin} desc={t('booth_desc')} delay={0.5} color="#0B0F2E" />
           <ModuleCard title={t('journey_title')} path="/journey" icon={Stepper} desc={t('journey_desc')} delay={0.6} color="#FF6500" />
        </div>
      </div>

      {/* Election Facts Section */}
      <div className="relative w-full z-10 px-4 sm:px-6 md:px-8 mt-24 py-24 bg-[#0B0F2E]">
        {/* Watermark */}
        <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none overflow-hidden">
           <svg className="w-[800px] h-[800px]" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="0.5"><circle cx="12" cy="12" r="10"/><path d="M12 2v20M2 12h20M4.9 4.9l14.2 14.2M4.9 19.1L19.1 4.9"/></svg>
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-xs font-black uppercase tracking-[0.2em] text-[#42A5F5] mb-4">{t('did_you_know')}</h2>
            <h3 className="text-4xl sm:text-[40px] font-black tracking-tight font-display text-white">{t('wonders')}</h3>
          </div>
          <div className="flex overflow-x-auto pb-8 -mx-4 px-4 sm:grid sm:overflow-visible sm:pb-0 sm:mx-0 sm:px-0 gap-6 sm:grid-cols-2 lg:grid-cols-4 snap-x hide-scrollbar">
            <FactCard 
              icon="🌍"
              title="World's Largest" 
              fact="India's elections involve nearly 1 billion {t('eligible_voters')}, making it the largest democratic exercise in human history." 
              delay={0.1}
            />
             <FactCard 
              icon="⛰️"
              title="Highest Booth" 
              fact="Tashigang in Himachal Pradesh is the world's highest polling station at an altitude of exactly 15,256 feet." 
              delay={0.2}
            />
             <FactCard 
              icon="📜"
              title="First Election" 
              fact="India's first general election took place over five months, from October 1951 to February 1952." 
              delay={0.3}
            />
             <FactCard 
              icon="🦁"
              title="The Lone Voter" 
              fact="A polling booth is set up deep within the Gir forest in Gujarat for just one resident, a temple priest." 
              delay={0.4}
            />
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="relative w-full z-10 px-4 sm:px-6 md:px-8 pt-24 pb-12 bg-[#F7F3EE] -mt-24">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-4xl sm:text-[40px] font-black tracking-tight font-display text-[#0B0F2E]">{t('faq_title')}</h3>
          </div>
          <div className="flex flex-col gap-4">
            <FAQItem 
              question="Who is eligible to vote in India?" 
              answer="Any Indian citizen who is 18 years of age or older on the qualifying date (usually January 1st of the year of revision of electoral roll) and ordinarily resident of the polling area is eligible to vote." 
            />
            <FAQItem 
              question="How can I register to vote?" 
              answer="You can register to vote online through the National Voters' Services Portal (NVSP) or the Voter Helpline App. Alternatively, you can submit Form 6 offline to the Electoral Registration Officer (ERO) of your constituency." 
            />
            <FAQItem 
              question="What documents are required to vote?" 
              answer="You need your Voter ID card (EPIC). If you don't have it, the Election Commission allows alternative photo identity documents like Aadhaar Card, PAN Card, Passport, Driving License, etc., provided your name is on the electoral roll." 
            />
            <FAQItem 
              question="How does the EVM work?" 
              answer="The Electronic Voting Machine (EVM) consists of a Control Unit and a Ballot Unit. The voter presses the button next to their chosen candidate on the Ballot Unit. The Control Unit records the vote securely without any network connection." 
            />
            <FAQItem 
              question="What is VVPAT?" 
              answer="VVPAT stands for Voter Verifiable Paper Audit Trail. It is an independent system attached to the EVM that prints a paper slip with the candidate's name and symbol chosen by the voter, allowing them to verify their vote before it drops into a sealed box." 
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function FactCard({ title, fact, delay, icon }: { title: string, fact: string, delay: number, icon: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className="bg-white/5 border border-white/10 rounded-[24px] p-7 group hover:bg-white/10 hover:border-[#FF6500]/40 transition-all flex flex-col items-start text-left min-w-[280px] snap-center"
    >
      <div className="text-[40px] mb-4">{icon}</div>
      <h4 className="font-heading font-bold text-[18px] text-[#FF6500] mb-3">{title}</h4>
      <p className="text-[14px] font-sans text-white/70 leading-relaxed mb-6 flex-1">{fact}</p>
      
      <button 
        className="mt-auto flex items-center gap-2 text-xs font-bold text-white bg-white/10 px-4 py-2 rounded-full hover:bg-[#FF6500] transition-colors"
        onClick={() => {
           if (navigator.share) {
             navigator.share({ title: 'JanVote AI - Election Fact', text: `{t('did_you_know')} ${title} - ${fact}` })
           } else {
             navigator.clipboard.writeText(`{t('did_you_know')} ${title} - ${fact}`);
             alert('Fact copied to clipboard!');
           }
        }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" x2="15.42" y1="13.51" y2="17.49"/><line x1="15.41" x2="8.59" y1="6.51" y2="10.49"/></svg>
        Share
      </button>
    </motion.div>
  );
}

function ModuleCard({ title, path, icon: Icon, desc, delay, color }: any) {
  const { t } = useTranslation();
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay }}
    >
      <Link 
        to={path} 
        className="group bg-white rounded-[28px] border-2 border-transparent p-8 text-left hover:-translate-y-2 flex flex-col h-full relative overflow-hidden transition-all hover:shadow-[0_20px_60px_rgba(255,101,0,0.15)]"
        style={{ '--hover-border': color } as React.CSSProperties}
      >
        <style>{`
          .group:hover { border-color: var(--hover-border); }
          .group:hover .icon-bg { background-color: var(--hover-border) !important; color: white !important; }
        `}</style>
        
        {/* Lotus Watermark */}
        <div className="absolute top-4 right-4 opacity-5 pointer-events-none">
           <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2c-4 4-4 10-4 10s-3-2-5-5c0 0 4-4 9-5Z"/><path d="M12 2c4 4 4 10 4 10s3-2 5-5c0 0-4-4-9-5Z"/><path d="M12 22s-2-6-2-10"/><path d="M12 22s2-6 2-10"/><path d="M8 12c-3 2-5 5-5 5s4 4 9 5c5-1 9-5 9-5s-2-3-5-5"/></svg>
        </div>

        <div className="relative z-10 mb-6 inline-flex h-14 w-14 rounded-full items-center justify-center bg-[#FF6500]/10 text-[#FF6500] transition-colors icon-bg">
          <Icon className="h-7 w-7" />
        </div>
        <h3 className="mb-3 font-heading font-extrabold text-[22px] text-[#0B0F2E]">{title}</h3>
        <p className="text-[15px] font-sans text-slate-500 leading-[1.7] mb-8 flex-1">{desc}</p>
        <div className="mt-auto flex items-center gap-2 text-sm font-bold text-[#FF6500] transition-all group-hover:translate-x-1">
          {t('launch_exp')} <ArrowRight className="h-4 w-4" />
        </div>
      </Link>
    </motion.div>
  )
}

function FAQItem({ question, answer }: { question: string, answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={cn(
      "border-2 rounded-[20px] transition-colors overflow-hidden",
      isOpen ? "border-[#FF6500] bg-[#FFF8F0]" : "border-transparent bg-white"
    )}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full py-6 px-7 text-left"
      >
        <h4 className="font-heading font-bold text-[17px] text-[#0B0F2E] pr-4">{question}</h4>
        <div className={cn("flex-shrink-0 transition-transform duration-300 text-[#FF6500]", isOpen ? "rotate-180" : "")}>
          <ChevronDown className="w-5 h-5" />
        </div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="px-7 pb-6 pt-0 text-[15px] text-slate-600 leading-[1.8] font-sans">
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}



