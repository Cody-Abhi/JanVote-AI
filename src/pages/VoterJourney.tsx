import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { UserPlus, Search, Fingerprint, MapPin, CheckCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '../lib/utils';
import { Link } from 'react-router-dom';

const STEPS = [
  { id: 1, title: "Registration", icon: UserPlus, desc: "Apply via Form 6 on Voters' Service Portal or via Voter Helpline App.", details: ["Age 18+", "Identity Proof", "Address Proof"] },
  { id: 2, title: "Verification", icon: Search, desc: "Booth Level Officer (BLO) visits for field verification.", details: ["Documentation check", "Presence check"] },
  { id: 3, title: "EPIC Download", icon: Fingerprint, desc: "Get your digital Voter ID (e-EPIC) from the NVSP portal.", details: ["Unique ID generation", "PDF download available"] },
  { id: 4, title: "Polling Station", icon: MapPin, desc: "Check your assigned booth using the Voter Serial Number.", details: ["Voter Slip check", "Identity document ready"] },
  { id: 5, title: "Voting Day", icon: CheckCircle, desc: "Get inked and cast your secret ballot via EVM-VVPAT.", details: ["Secret voting", "Inked finger as proof"] },
];

export default function VoterJourney() {
  const [expanded, setExpanded] = useState<number | null>(0);

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 pb-24 bg-[#F7F3EE] min-h-screen">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16"
      >
        <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-[#1565C0]/10 px-5 py-2 text-[11px] font-black uppercase tracking-widest text-[#1565C0]">
           Step-by-Step Guide
        </div>
        <h2 className="text-4xl md:text-[56px] font-display font-bold mb-6 tracking-tight text-[#0B0F2E] leading-none">Your Journey to the Ballot</h2>
        <p className="text-slate-600 text-lg font-sans max-w-xl mx-auto">A transparent guide from initial registration to Election Day, ensuring you're empowered every step of the way.</p>
      </motion.div>

      <div className="relative max-w-4xl mx-auto space-y-8 before:absolute before:inset-0 before:left-8 md:before:left-1/2 md:before:-translate-x-px before:h-full before:w-[2px] before:border-l-2 before:border-dashed before:border-slate-300">
        {STEPS.map((step, idx) => (
          <motion.div 
            key={step.id} 
            initial={{ opacity: 0, x: idx % 2 === 0 ? -50 : 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, type: 'spring', damping: 20 }}
            className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group"
          >
            {/* Timeline dot */}
            <div className="flex items-center justify-center w-16 h-16 rounded-full border-[4px] border-white bg-white text-slate-400 shadow-md shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 transition-all duration-300 group-hover:scale-110 group-hover:bg-[#FF6500] group-hover:text-white group-hover:border-[#FF6500]/20 absolute left-8 md:left-1/2 -translate-x-1/2">
               <step.icon className="w-6 h-6" />
            </div>

            {/* Content Card */}
            <div className="w-[calc(100%-5rem)] ml-[5rem] md:ml-0 md:w-[calc(50%-3rem)] overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
              <button
                onClick={() => setExpanded(expanded === idx ? null : idx)}
                className={cn(
                  "flex w-full items-center justify-between p-6 text-left transition-colors",
                  expanded === idx ? "bg-[#F7F3EE]/50 border-b border-slate-100" : "bg-white hover:bg-slate-50"
                )}
              >
                <div>
                   <span className="text-[10px] font-black uppercase tracking-widest text-[#FF6500] mb-1.5 block">Phase 0{step.id}</span>
                   <h3 className="text-2xl font-sans font-bold text-[#0B0F2E]">{step.title}</h3>
                </div>
                <div className={cn("transition-transform duration-300 w-10 h-10 rounded-full flex items-center justify-center bg-slate-50", expanded === idx ? "rotate-180 bg-[#FF6500]/10" : "rotate-0")}>
                   <ChevronDown className={cn("h-5 w-5", expanded === idx ? "text-[#FF6500]" : "text-slate-400")} />
                </div>
              </button>

              <AnimatePresence>
                {expanded === idx && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="px-6 pb-6 pt-5 bg-white"
                  >
                    <p className="text-slate-600 mb-6 font-sans leading-[1.6] text-[15px]">{step.desc}</p>
                    <div className="flex flex-wrap gap-2.5">
                      {step.details.map((detail, i) => (
                        <span key={i} className="flex items-center gap-1.5 rounded-full bg-[#00796B]/5 px-3.5 py-1.5 text-[11px] font-bold text-slate-700">
                          <CheckCircle className="h-3.5 w-3.5 text-[#00796B]" />
                          {detail}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        ))}
      </div>
      
      <motion.div 
         initial={{ opacity: 0, y: 20 }}
         whileInView={{ opacity: 1, y: 0 }}
         viewport={{ once: true }}
         className="mt-20 max-w-4xl mx-auto rounded-[32px] bg-[#0B0F2E] p-10 md:p-12 shadow-2xl relative overflow-hidden text-center"
      >
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#FF6500]/20 rounded-full blur-[60px] pointer-events-none translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#1565C0]/20 rounded-full blur-[60px] pointer-events-none -translate-x-1/2 translate-y-1/2" />
        
        <div className="relative z-10 flex flex-col items-center">
          <h4 className="font-display font-bold text-white text-3xl md:text-4xl mb-4">Ready to test it out?</h4>
          <p className="text-slate-300 leading-relaxed font-sans text-lg mb-8 max-w-lg">
            Practice casting your vote using our Gamified Simulation Mode so you're ready for the real thing.
          </p>
          <Link 
            to="/simulation" 
            className="inline-flex items-center justify-center px-8 py-4 bg-[#FF6500] text-white font-bold rounded-2xl shadow-[0_4px_14px_rgba(255,101,0,0.4)] hover:bg-[#FF8C38] transition-all hover:-translate-y-0.5"
          >
            Launch EVM Simulator
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
