import { useState, useEffect } from 'react';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { Trophy, Medal, Crown, Star } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

interface Score {
  id: string;
  userName: string;
  score: number;
  difficulty: string;
  timestamp: any;
}

export default function Leaderboard() {
  const [scores, setScores] = useState<Score[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'quizScores'), orderBy('score', 'desc'), limit(10));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Score));
      setScores(data);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'quizScores');
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="text-center">
        <Trophy className="h-12 w-12 mx-auto text-[#FF6500] mb-2" />
        <h2 className="text-3xl font-display font-bold text-[#0B0F2E]">Election Masters</h2>
        <p className="text-slate-500">Top contributors to voting awareness</p>
      </div>

      <div className="bg-white rounded-[32px] border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.08)] overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400">Loading rankings...</div>
        ) : scores.length === 0 ? (
          <div className="p-12 text-center text-slate-400">No champions yet. Be the first!</div>
        ) : (
          <div className="divide-y divide-slate-100">
            {scores.map((score, index) => (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                key={score.id}
                className={cn(
                  "flex items-center gap-4 p-5 transition-colors hover:bg-slate-50",
                  index === 0 && "bg-orange-50/80"
                )}
              >
                <div className="flex h-10 w-10 items-center justify-center font-bold text-lg">
                  {index === 0 ? <Crown className="text-[#FF6500] h-6 w-6" /> : 
                   index === 1 ? <Medal className="text-slate-400 h-6 w-6" /> :
                   index === 2 ? <Medal className="text-orange-400 h-6 w-6" /> : index + 1}
                </div>
                <div className="flex-1">
                   <div className="font-bold flex items-center gap-2">
                     {score.userName}
                     {index === 0 && <Star className="h-3 w-3 fill-[#FF6500] text-[#FF6500]" />}
                   </div>
                   <div className="text-xs font-bold uppercase text-slate-400 tracking-wider">
                     Level: {score.difficulty}
                   </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-[#FF6500]">{score.score}</div>
                  <div className="text-[10px] text-slate-400 font-bold uppercase">Points</div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
