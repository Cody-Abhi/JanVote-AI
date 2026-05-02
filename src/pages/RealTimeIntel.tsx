import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Activity, Rss } from 'lucide-react';
import { getRealTimeElectionNews } from '../lib/gemini';

export default function RealTimeIntel() {
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchNews() {
      try {
        const cachedNews = sessionStorage.getItem('realtime_election_news');
        if (cachedNews) {
          setNews(JSON.parse(cachedNews));
          setLoading(false);
          return;
        }

        const data = await getRealTimeElectionNews();
        if (data && data.length > 0) {
          setNews(data);
          sessionStorage.setItem('realtime_election_news', JSON.stringify(data));
        }
      } catch (err) {
        console.error("Failed to load real-time news", err);
      } finally {
        setLoading(false);
      }
    }
    fetchNews();
  }, []);

  return (
    <div className="max-w-6xl mx-auto w-full px-4 sm:px-6 md:px-8 pt-8 pb-24">
      <div className="mb-12">
        <h2 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-4">Live Context</h2>
        <h3 className="text-4xl font-black tracking-tight font-display text-[#0B0F2E]">Real-Time Intelligence Feed</h3>
        <p className="mt-4 text-lg text-slate-600 max-w-2xl">
          Stay updated with the latest political shifts and election news, sourced in real-time.
        </p>
      </div>

      {loading ? (
        <div className="bg-white rounded-[32px] p-8 border border-slate-100 flex flex-col items-center justify-center min-h-[400px]">
          <div className="relative flex h-10 w-10 mb-4">
             <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-30"></span>
             <span className="relative inline-flex rounded-full h-10 w-10 bg-[#FF6500] items-center justify-center">
               <Activity className="h-5 w-5 text-white animate-pulse" />
             </span>
          </div>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Syncing real-time intelligence...</p>
        </div>
      ) : (!news || news.length === 0) ? (
         <div className="bg-white rounded-[32px] p-8 border border-slate-100 flex flex-col items-center justify-center min-h-[400px]">
          <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">No active news feeds found at the moment.</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {news.map((item, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white border text-left border-slate-200 rounded-[32px] p-6 md:p-8 hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] hover:border-[#FF6500] transition-all duration-300 shadow-sm"
            >
              <div className="flex items-start justify-between gap-4 mb-3">
                <h4 className="text-xl text-[#0B0F2E] font-bold leading-tight flex-1">{item.headline}</h4>
                <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest whitespace-nowrap bg-slate-100 px-3 py-1.5 rounded-md">{item.time || 'JUST NOW'}</span>
              </div>
              <p className="text-slate-600 text-base font-medium leading-relaxed mb-4">
                {item.summary}
              </p>
              <div className="flex items-center gap-2">
                 <Rss className="h-4 w-4 text-slate-400" />
                 <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                   Source: {item.source}
                 </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
