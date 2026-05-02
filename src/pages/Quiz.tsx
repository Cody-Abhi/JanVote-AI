import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, CheckCircle2, XCircle, Timer, Award, ChevronRight, Zap } from 'lucide-react';
import { db } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import { cn } from '../lib/utils';
import { Link } from 'react-router-dom';

interface Question {
  text: string;
  options: string[];
  correct: number;
}

const QUIZ_DATA: Record<string, Question[]> = {
  easy: [
    { text: "What is the minimum age to vote in India?", options: ["18", "21", "25", "16"], correct: 0 },
    { text: "Which organization conducts elections in India?", options: ["Supreme Court", "Election Commission of India", "NITI Aayog", "Home Ministry"], correct: 1 },
    { text: "Who is the Constitutional Head of the Indian Union?", options: ["Prime Minister", "President", "Chief Justice", "Speaker"], correct: 1 },
  ],
  medium: [
    { text: "What is the tenure of a Lok Sabha member?", options: ["4 years", "5 years", "6 years", "Independent"], correct: 1 },
    { text: "Which article of the Constitution provides for Universal Adult Suffrage?", options: ["Article 324", "Article 326", "Article 328", "Article 330"], correct: 1 },
    { text: "What was the first state to use EVMs in India?", options: ["Kerala", "Goa", "Gujarat", "Tamil Nadu"], correct: 0 },
  ],
  hard: [
    { text: "In which year did the lowering of voting age from 21 to 18 happen?", options: ["1985", "1988", "1991", "1982"], correct: 1 },
    { text: "How long can a person be an MP without being elected by the citizens?", options: ["1 month", "3 months", "6 months", "Not allowed"], correct: 2 },
    { text: "What is the security deposit for a Lok Sabha candidate (General Category)?", options: ["₹10,000", "₹15,000", "₹25,000", "₹50,000"], correct: 2 },
  ]
};

export default function Quiz() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard' | null>(null);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [timeLeft, setTimeLeft] = useState(15);
  
  // Track unlocked levels
  const [unlockedLevels, setUnlockedLevels] = useState<Record<string, boolean>>({
    easy: true,
    medium: false,
    hard: false
  });

  const questions = difficulty ? QUIZ_DATA[difficulty] : [];

  // Load unlocked levels from local storage on mount (simulating progress)
  useEffect(() => {
    const savedProgress = localStorage.getItem('quizProgress');
    if (savedProgress) {
      setUnlockedLevels(JSON.parse(savedProgress));
    }
  }, []);

  useEffect(() => {
    if (!difficulty || isFinished || feedback) return;

    if (timeLeft === 0) {
      handleOptionClick(-1); // Time out
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(t => t - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, difficulty, isFinished, feedback]);

  const handleOptionClick = (idx: number) => {
    if (feedback) return;
    setSelectedOption(idx);
    const correct = questions[currentIdx].correct === idx;
    if (correct) {
      setScore(s => s + 1);
      setFeedback('correct');
    } else {
      setFeedback('wrong');
    }

    setTimeout(() => {
      if (currentIdx + 1 < questions.length) {
        setCurrentIdx(c => c + 1);
        setSelectedOption(null);
        setFeedback(null);
        setTimeLeft(15);
      } else {
        setIsFinished(true);
        saveScore();
        
        // Unlock next level logic
        setUnlockedLevels(prev => {
          const nextState = { ...prev };
          if (difficulty === 'easy') nextState.medium = true;
          if (difficulty === 'medium') nextState.hard = true;
          localStorage.setItem('quizProgress', JSON.stringify(nextState));
          return nextState;
        });
      }
    }, 1500);
  };

  const saveScore = async () => {
    if (user && difficulty) {
      try {
        await addDoc(collection(db, 'quizScores'), {
          userId: user.uid,
          userName: user.displayName || 'Anonymous Hero',
          score: score + (feedback === 'correct' ? 1 : 0),
          difficulty,
          category: 'general', // Matching the required field in rules
          timestamp: serverTimestamp(),
        });
      } catch (err) {
        console.error("Failed to save score", err);
      }
    }
  };

  if (!difficulty) {
    return (
      <div className="max-w-2xl mx-auto py-12 text-center">
        <div className="w-20 h-20 bg-[#FF6500] rounded-[32px] flex items-center justify-center mx-auto mb-8 shadow-[0_8px_30px_rgba(255,101,0,0.3)] rotate-3">
          <Award className="h-10 w-10 text-white" />
        </div>
        <h2 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-4">Skill Assessment</h2>
        <h3 className="text-4xl font-display font-bold mb-12 tracking-tight text-[#0B0F2E]">Democratic Quest</h3>
        
        <div className="grid gap-6">
          {(['easy', 'medium', 'hard'] as const).map(level => {
            const isUnlocked = unlockedLevels[level];
            return (
            <button
              key={level}
              onClick={() => isUnlocked && setDifficulty(level)}
              disabled={!isUnlocked}
              className={cn(
                "group flex items-center justify-between p-8 rounded-[32px] border transition-all duration-300 text-left",
                isUnlocked 
                  ? "bg-white border-slate-200 hover:border-[#FF6500] hover:shadow-[0_8px_30px_rgba(255,101,0,0.12)]" 
                  : "bg-slate-50 border-slate-100 opacity-70 cursor-not-allowed"
              )}
            >
              <div className="flex items-center gap-6">
                <div className={cn(
                  "p-4 rounded-2xl",
                  !isUnlocked ? "bg-slate-200 text-slate-400" :
                  level === 'easy' ? "bg-orange-50 text-[#FF6500]" :
                  level === 'medium' ? "bg-blue-50 text-[#1565C0]" : "bg-emerald-50 text-[#00796B]"
                )}>
                  {isUnlocked ? <Zap className="h-6 w-6" /> : <div className="h-6 w-6 relative overflow-hidden"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-lock"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg></div>}
                </div>
                <div>
                  <h3 className="font-black text-2xl capitalize tracking-tight flex items-center gap-2">
                    {level}
                    {!isUnlocked && <span className="text-xs font-bold bg-slate-200 text-slate-500 px-2 py-0.5 rounded-full uppercase tracking-widest">Locked</span>}
                  </h3>
                  <p className="text-sm font-medium text-slate-400">
                    {level === 'easy' ? 'Basics of voting' : level === 'medium' ? 'Constitutional powers' : 'Advanced electoral laws'}
                  </p>
                </div>
              </div>
              <ChevronRight className={cn(
                "h-8 w-8 transition-all",
                isUnlocked ? "text-slate-200 group-hover:text-[#FF6500] group-hover:translate-x-1" : "text-transparent"
              )} />
            </button>
          )})}
        </div>
      </div>
    );
  }

  if (isFinished) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="max-w-md mx-auto py-16 text-center">
        <div className="relative mb-8 inline-block">
           <Trophy className="h-24 w-24 text-yellow-500" />
           <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }} className="absolute inset-0 rounded-full border-4 border-yellow-500 border-t-transparent opacity-20" />
        </div>
        <h2 className="text-4xl font-black mb-2">Quiz Complete!</h2>
        <p className="text-slate-500 mb-8">You scored <span className="text-blue-600 font-bold">{score}/{questions.length}</span> in {difficulty} level.</p>
        
        <div className="flex flex-col gap-4">
          <Link to="/leaderboard" className="bg-[#FF6500] text-white font-bold py-4 rounded-xl shadow-[0_4px_14px_rgba(255,101,0,0.3)] hover:bg-[#FF8C38] transition-colors">
            View Leaderboard
          </Link>
          <button onClick={() => { setDifficulty(null); setCurrentIdx(0); setScore(0); setIsFinished(false); }} className="text-slate-600 font-medium hover:underline">
            Try Another Level
          </button>
        </div>
      </motion.div>
    );
  }

  const currentQ = questions[currentIdx];

  return (
    <div className="max-w-2xl mx-auto py-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-2 bg-slate-100 px-3 py-1 rounded-full text-sm font-bold">
          <Timer className={cn("h-4 w-4", timeLeft < 5 && "text-red-500 animate-pulse")} />
          {timeLeft}s 
        </div>
        <div className="flex items-center gap-2 bg-slate-100 px-3 py-1 rounded-full text-sm font-bold">
          Q {currentIdx + 1}/{questions.length}
        </div>
        <div className="text-[#FF6500] font-bold uppercase tracking-widest text-xs">
          Level: {difficulty}
        </div>
      </div>

      <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm relative overflow-hidden">
        {feedback && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={cn(
            "absolute inset-0 z-10 flex items-center justify-center backdrop-blur-sm",
            feedback === 'correct' ? "bg-green-500/20" : "bg-red-500/20"
          )}>
            {feedback === 'correct' ? <CheckCircle2 className="h-16 w-16 text-green-600" /> : <XCircle className="h-16 w-16 text-red-600" />}
          </motion.div>
        )}

        <h3 className="text-2xl font-bold mb-8 leading-tight">{currentQ.text}</h3>

        <div className="space-y-3">
          {currentQ.options.map((option, idx) => (
            <button
              key={idx}
              disabled={!!feedback}
              onClick={() => handleOptionClick(idx)}
              className={cn(
                "w-full p-5 rounded-[24px] border-2 text-left font-medium transition-all duration-300",
                selectedOption === idx 
                  ? feedback === 'correct' ? "border-[#00796B] bg-emerald-50 text-[#00796B]" : "border-red-500 bg-red-50 text-red-700"
                  : feedback && idx === currentQ.correct ? "border-[#00796B] bg-emerald-50" : "border-slate-100 hover:border-[#FF6500] hover:bg-orange-50"
              )}
            >
              <div className="flex items-center justify-between">
                <span>{option}</span>
                {selectedOption === idx && feedback === 'correct' && <CheckCircle2 className="h-5 w-5" />}
                {selectedOption === idx && feedback === 'wrong' && <XCircle className="h-5 w-5" />}
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="mt-8 bg-slate-200 h-2 rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }}
          className="h-full bg-gradient-to-r from-[#FF6500] to-[#FF8C38]"
        />
      </div>
    </div>
  );
}
