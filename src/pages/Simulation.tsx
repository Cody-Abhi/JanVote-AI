import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { CheckCircle2, Hand } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '../lib/utils';
const CANDIDATES = [
  { id: '1', name: 'Dr. Aarav Patel', symbol: '🌞', party: 'Progressive Alliance' },
  { id: '2', name: 'Priya Sharma', symbol: '🌻', party: 'Visionary League' },
  { id: '3', name: 'Rajesh Kumar', symbol: '🚲', party: 'Democratic Front' },
  { id: 'NOTA', name: 'NOTA', symbol: '❌', party: 'None of the Above' },
];

export default function Simulation() {
  const [step, setStep] = useState(1);
  const [selectedCandidate, setSelectedCandidate] = useState<string | null>(null);

  const handleVote = (id: string) => {
    setSelectedCandidate(id);
  };

  const confirmVote = () => {
    setStep(2);
    // Play sound or vibration (simulated)
    try {
      if (typeof window.navigator.vibrate === 'function') {
        window.navigator.vibrate(200);
      }
    } catch(e) {}
    
    // Trigger confetti
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#f97316', '#ffffff', '#10b981', '#2563eb']
    });

    setTimeout(() => {
      setStep(3);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-[#0B0F2E] relative overflow-hidden flex flex-col items-center py-12 px-4">
      {/* Radial Gradient Background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#FF6500]/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="text-center mb-8 relative z-10">
         <h2 className="text-[11px] font-black text-[#FF6500] uppercase tracking-[0.3em] mb-3">Interactive EVM</h2>
         <h3 className="text-3xl sm:text-4xl font-display font-bold text-white tracking-tight">Gamified Voting Simulation</h3>
      </div>

      <div className="relative z-10 w-full max-w-[400px] bg-[#1E1E1E] border-[4px] border-[#333] rounded-[24px] p-4 shadow-2xl shadow-black/50">
        
        {/* EVM Top Section */}
        <div className="bg-[#2A2A2A] rounded-xl p-4 mb-6 border border-white/5 flex flex-col items-center">
          <div className="text-[9px] font-black text-white/40 uppercase tracking-widest mb-3">Ballot Unit</div>
          <div className="w-full bg-[#0A1A10] border-2 border-[#1A2F20] rounded-lg p-3 text-center min-h-[50px] flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className={cn(
                  "font-mono text-xl tracking-widest text-shadow-neon font-bold",
                  step === 1 ? "text-[#00FF41]" : 
                  step === 2 ? "text-[#FF0000]" : 
                  "text-[#00FF41]"
                )}
                style={{ textShadow: step === 2 ? '0 0 10px #FF0000' : '0 0 10px #00FF41' }}
              >
                {step === 1 ? "READY" : step === 2 ? "RECORDING" : "VOTE RECORDED"}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* EVM Main Body */}
        <div className="bg-white rounded-xl p-3 border-2 border-slate-300">
          <div className="flex flex-col gap-2">
            {CANDIDATES.map((c, index) => (
              <div key={c.id} className="flex items-stretch bg-white border border-slate-300 rounded-md overflow-hidden h-[60px]">
                {/* Serial Number */}
                <div className="bg-[#1565C0] w-10 flex items-center justify-center text-white font-bold font-mono text-sm border-r border-slate-300">
                  {index + 1}
                </div>
                
                {/* Candidate Info */}
                <div className="flex-1 px-3 flex items-center justify-between border-r border-slate-300">
                  <div>
                    <h4 className="font-bold text-[#0B0F2E] text-sm leading-none mb-1">{c.name}</h4>
                    <p className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">{c.party}</p>
                  </div>
                  <div className="text-2xl">{c.symbol}</div>
                </div>
                
                {/* Button Area */}
                <div className="w-[70px] bg-slate-100 flex items-center justify-center gap-2 relative">
                  {/* LED Indicator */}
                  <div className={cn(
                    "w-2.5 h-2.5 rounded-full transition-all duration-300",
                    selectedCandidate === c.id 
                      ? "bg-[#FF0000] shadow-[0_0_10px_#FF0000]" 
                      : "bg-[#4A0000] shadow-inner"
                  )} />
                  
                  {/* The Blue Button */}
                  <button
                    onClick={() => step === 1 && handleVote(c.id)}
                    disabled={step !== 1}
                    className="w-8 h-8 rounded-full bg-[#1565C0] hover:bg-[#0D47A1] active:scale-90 transition-all shadow-[inset_0_-2px_4px_rgba(0,0,0,0.3),0_2px_4px_rgba(0,0,0,0.2)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    aria-label={`Vote for ${c.name}`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Confirmation Button (Only visible after selection in Step 1) */}
        {step === 1 && selectedCandidate && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6"
          >
            <button
              onClick={confirmVote}
              className="w-full bg-[#FF6500] text-white font-bold py-3 rounded-xl hover:bg-[#FF8C38] transition-colors shadow-[0_4px_14px_rgba(255,101,0,0.4)] flex justify-center items-center gap-2"
            >
              CONFIRM VOTE <Hand className="h-5 w-5" />
            </button>
          </motion.div>
        )}
      </div>

      {/* Success Modal Overlay */}
      <AnimatePresence>
        {step === 3 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0B0F2E]/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-white p-8 rounded-[24px] max-w-sm w-full text-center shadow-2xl border-2 border-[#00796B]/20"
            >
              <div className="h-20 w-20 bg-[#00796B]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="h-10 w-10 text-[#00796B]" />
              </div>
              <h2 className="text-2xl font-display font-bold text-[#0B0F2E] mb-3">
                Congratulations!
              </h2>
              <p className="text-[15px] font-sans text-slate-600 leading-relaxed mb-8">
                You have experienced democratic power. Your simulated vote has been securely recorded.
              </p>
              
              <div className="flex flex-col gap-3">
                <button
                  onClick={() => {
                    setStep(1);
                    setSelectedCandidate(null);
                  }}
                  className="w-full py-3 px-4 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition-colors"
                >
                  Vote Again
                </button>
                <Link 
                  to="/timeline" 
                  className="w-full py-3 px-4 bg-[#1565C0] text-white font-bold rounded-xl hover:bg-[#0D47A1] transition-colors flex items-center justify-center gap-2"
                >
                  Explore Timeline
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
