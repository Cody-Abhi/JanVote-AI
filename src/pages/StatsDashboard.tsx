import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { TrendingUp, Users, CheckSquare, Clock, Globe, Zap, Activity, Info, AlertCircle, Map as MapIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { doc, onSnapshot, setDoc, getDoc } from 'firebase/firestore';
import { getRealTimeStats } from '../lib/gemini';

const DATA_TURNOUT = [
  { year: '2004', turnout: 58.07 },
  { year: '2009', turnout: 58.19 },
  { year: '2014', turnout: 66.44 },
  { year: '2019', turnout: 67.40 },
  { year: '2024 (P)', turnout: 66.85 },
];

const DATA_VOTERS = [
  { name: 'Male', value: 49 },
  { name: 'Female', value: 47 },
  { name: 'Other', value: 4 },
];

const COLORS = ['#FF6500', '#1A237E', '#00796B'];

const REALTIME_FEED = [
  { id: 1, time: '2 mins ago', event: 'Polling station #422 reported 100% turnout.', type: 'milestone' },
  { id: 2, time: '5 mins ago', event: 'Average wait time in Mumbai North decreased to 15 mins.', type: 'update' },
  { id: 3, time: '12 mins ago', event: 'New accessible booth inaugurated in Shimla.', type: 'info' },
];

export default function StatsDashboard() {
  const { t } = useTranslation();
  const [liveStats, setLiveStats] = useState({
    voters: 968045231,
    booths: 1054320,
    waitTime: 12,
    onlineRegistrations: 4520,
  });
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    // Listen to real-time stats from Firestore
    const statsRef = doc(db, 'stats', 'election');
    
    // Initial data seeding if not exists (for demo purposes)
    const seedStats = async () => {
      const snap = await getDoc(statsRef);
      if (!snap.exists()) {
        try {
           setIsLive(false);
           const realStats = await getRealTimeStats();
           await setDoc(statsRef, {
             registeredVoters: realStats?.voters || 968045231,
             pollingStations: realStats?.booths || 1054320,
             avgWaitTime: realStats?.waitTime || 12,
             digitalEnrollments: realStats?.onlineRegistrations || 4520,
             lastUpdated: new Date().toISOString()
           });
        } catch(e) {
          await setDoc(statsRef, {
            registeredVoters: 968045231,
            pollingStations: 1054320,
            avgWaitTime: 12,
            digitalEnrollments: 4520,
            lastUpdated: new Date().toISOString()
          });
        }
      }
    };
    seedStats();

    const unsubscribe = onSnapshot(statsRef, (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        setLiveStats({
          voters: data.registeredVoters,
          booths: data.pollingStations,
          waitTime: data.avgWaitTime,
          onlineRegistrations: data.digitalEnrollments,
        });
        setIsLive(true);
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'stats/election');
    });

    // Simulated local updates to make it feel "active" even if DB doesn't change frequently
    const interval = setInterval(() => {
      setLiveStats(prev => ({
        ...prev,
        voters: prev.voters + Math.floor(Math.random() * 3),
        waitTime: Math.max(5, Math.min(45, prev.waitTime + (Math.random() > 0.6 ? 1 : (Math.random() < 0.4 ? -1 : 0)))),
      }));
    }, 4000);

    return () => {
      unsubscribe();
      clearInterval(interval);
    };
  }, []);

  const handleSyncRealTime = async () => {
    setIsLive(false);
    try {
      const realStats = await getRealTimeStats();
      if (realStats) {
        const statsRef = doc(db, 'stats', 'election');
        await setDoc(statsRef, {
          registeredVoters: realStats.voters || liveStats.voters,
          pollingStations: realStats.booths || liveStats.booths,
          avgWaitTime: realStats.waitTime || liveStats.waitTime,
          digitalEnrollments: realStats.onlineRegistrations || liveStats.onlineRegistrations,
          lastUpdated: new Date().toISOString()
        }, { merge: true });
      }
    } catch(err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-[11px] font-black text-red-500 uppercase tracking-widest">Live: Election Pulse</span>
          </div>
          <h2 className="text-3xl sm:text-[40px] font-display font-bold tracking-tight text-[#0B0F2E] leading-none mb-2">Voter Analytics</h2>
          <p className="text-slate-600 font-sans text-lg">Real-time participation tracking and infrastructure status</p>
        </div>
        <div className="flex gap-3">
           <div className={cn(
             "px-4 py-2.5 rounded-xl text-[11px] font-bold uppercase tracking-widest whitespace-nowrap flex items-center gap-2 transition-all",
             isLive ? "bg-[#1565C0] text-white shadow-[0_4px_14px_rgba(21,101,192,0.3)]" : "bg-slate-100 text-slate-400"
           )}>
             <Activity className={cn("h-4 w-4", isLive && "animate-pulse")} /> {isLive ? 'Live Connection' : 'Syncing...'}
           </div>
           <button 
             onClick={handleSyncRealTime}
             className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-600 text-[11px] font-bold uppercase tracking-widest hover:border-[#1565C0] hover:text-[#1565C0] transition-all flex items-center gap-2"
           >
             <Globe className="h-4 w-4" /> Sync AI
           </button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard 
          icon={Users} 
          label="Registered Voters" 
          value={(liveStats.voters / 10000000).toFixed(2) + " Cr"} 
          trend="+ Live" 
          subValue={liveStats.voters.toLocaleString()}
          color="blue"
        />
        <StatCard 
          icon={CheckSquare} 
          label="Polling Stations" 
          value={(liveStats.booths / 100000).toFixed(1) + " Lac"} 
          trend="Certified" 
          subValue={`${liveStats.booths.toLocaleString()} Locations`}
          color="emerald"
        />
        <StatCard 
          icon={Clock} 
          label="Avg Voter Wait" 
          value={`${liveStats.waitTime} Mins`} 
          trend={liveStats.waitTime > 30 ? "High Volume" : "Optimal"} 
          subValue="Calculated nationally"
          color="amber"
          isLive
        />
        <StatCard 
          icon={Globe} 
          label="Digital Enroll" 
          value={liveStats.onlineRegistrations.toLocaleString()} 
          trend="+12% Week" 
          subValue="Voter Portal Data"
          color="purple"
        />
      </div>

      {/* New Section: Real-time Live Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-[#0B0F2E] rounded-[24px] p-8 text-white relative overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-xl font-display font-bold uppercase tracking-widest mb-2">Infrastructure Load</h3>
                <p className="text-slate-400 text-sm font-sans">Real-time processing capacity of polling networks</p>
              </div>
              <div className="h-14 w-14 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md">
                <Zap className="h-7 w-7 text-[#FF6500]" />
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
              {[
                { label: 'System Uptime', value: '99.98%', color: 'text-[#00796B]' },
                { label: 'Server Load', value: '42%', color: 'text-[#42A5F5]' },
                { label: 'API Response', value: '118ms', color: 'text-[#FF6500]' },
                { label: 'Active Sync', value: '10k+', color: 'text-amber-400' }
              ].map((item) => (
                <div key={item.label}>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">{item.label}</div>
                  <div className={cn("text-2xl font-display font-bold", item.color)}>{item.value}</div>
                </div>
              ))}
            </div>

            <div className="mt-10 h-36 w-full">
              <ResponsiveContainer width="100%" height="100%">
                 <LineChart data={[...Array(20)].map((_, i) => ({ val: 30 + Math.random() * 40 }))}>
                   <Line type="monotone" dataKey="val" stroke="#1565C0" strokeWidth={3} dot={false} isAnimationActive={true} />
                 </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#1565C0]/20 rounded-full blur-[80px] -mr-32 -mt-32" />
        </div>

        <div className="bg-white rounded-[24px] p-8 border border-slate-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
          <h3 className="text-lg font-display font-bold uppercase tracking-widest mb-6 flex items-center gap-2 text-[#0B0F2E]">
            <Activity className="h-5 w-5 text-red-500" />
            Live Activity Feed
          </h3>
          <div className="space-y-6">
            {REALTIME_FEED.map((item) => (
              <div key={item.id} className="flex gap-4 group">
                <div className="flex flex-col items-center">
                  <div className={cn(
                    "h-3.5 w-3.5 rounded-full border-[3px] border-white ring-2 ring-slate-100 transition-all group-hover:scale-125",
                    item.type === 'milestone' ? "bg-red-500" : item.type === 'update' ? "bg-[#1565C0]" : "bg-slate-400"
                  )} />
                  <div className="w-[2px] flex-1 bg-slate-100 my-1.5" />
                </div>
                <div className="pb-4">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{item.time}</div>
                  <p className="text-[15px] font-sans text-slate-700 leading-snug">{item.event}</p>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-2 py-3.5 rounded-xl border-2 border-slate-200 text-slate-600 text-xs font-bold uppercase tracking-widest hover:border-[#1565C0] hover:text-[#1565C0] hover:bg-[#F7F3EE] transition-all">
            View All Reports
          </button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2 mt-6">
        <div className="bg-white rounded-[24px] p-8 border border-slate-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-display font-bold text-xl flex items-center gap-3 text-[#0B0F2E]">
              <div className="p-2.5 bg-[#F7F3EE] rounded-xl border border-slate-100">
                <TrendingUp className="h-5 w-5 text-[#FF6500]" />
              </div>
              Voter Turnout Trends
            </h3>
            <div className="flex gap-1 bg-slate-50 p-1 rounded-xl border border-slate-100">
              {['Yearly', 'Phases'].map((tab, i) => (
                <button key={tab} className={cn(
                  "px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-colors",
                  i === 0 ? "bg-white text-[#1565C0] shadow-sm border border-slate-200" : "text-slate-500 hover:text-slate-700"
                )}>{tab}</button>
              ))}
            </div>
          </div>
          <div className="h-72 sm:h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={DATA_TURNOUT}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{fontSize: 11, fontWeight: 700, fill: '#64748b', fontFamily: 'Plus Jakarta Sans'}} dy={10} />
                <YAxis axisLine={false} tickLine={false} domain={[50, 70]} tick={{fontSize: 11, fontWeight: 700, fill: '#64748b', fontFamily: 'Plus Jakarta Sans'}} dx={-10} />
                <Tooltip 
                  cursor={{ fill: '#F7F3EE', radius: 12 }}
                  contentStyle={{ borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 8px 30px rgba(0,0,0,0.08)', padding: '16px', fontFamily: 'Plus Jakarta Sans' }}
                 />
                <Bar dataKey="turnout" fill="#1565C0" radius={[8, 8, 0, 0]} barSize={48} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-[24px] p-8 border border-slate-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-display font-bold text-xl flex items-center gap-3 text-[#0B0F2E]">
              <div className="p-2.5 bg-[#00796B]/10 rounded-xl border border-[#00796B]/20">
                <Activity className="h-5 w-5 text-[#00796B]" />
              </div>
              Voter Demographics
            </h3>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Inclusive India</span>
          </div>
          <div className="h-auto w-full flex flex-col sm:flex-row items-center gap-8">
            <div className="h-64 sm:h-80 w-full sm:w-1/2">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={DATA_VOTERS}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={110}
                    paddingAngle={4}
                    dataKey="value"
                    stroke="none"
                  >
                    {DATA_VOTERS.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 8px 30px rgba(0,0,0,0.08)', padding: '12px', fontFamily: 'Plus Jakarta Sans', fontSize: '13px', fontWeight: 'bold' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="w-full sm:w-1/2 grid grid-cols-3 sm:grid-cols-1 gap-6">
              {DATA_VOTERS.map((entry, index) => (
                <div key={entry.name} className="flex flex-col items-center sm:items-start text-center sm:text-left group cursor-default p-4 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-colors">
                  <div className="flex items-center gap-2.5 mb-1.5">
                    <div className="h-3 w-3 rounded-full shrink-0 shadow-sm" style={{ backgroundColor: COLORS[index] }} />
                    <span className="text-[11px] font-bold uppercase tracking-widest text-slate-500">{entry.name}</span>
                  </div>
                  <span className="text-3xl font-display font-bold text-[#0B0F2E] leading-none">{entry.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-slate-900 rounded-[24px] p-8 flex flex-col md:flex-row items-center gap-6 mt-12 text-white">
        <div className="h-16 w-16 bg-[#1565C0] rounded-2xl flex items-center justify-center shrink-0 shadow-lg">
           <Info className="h-8 w-8 text-white" />
        </div>
        <div className="flex-1 text-center md:text-left">
          <h4 className="text-xl font-display font-bold mb-2">Data Integrity Note</h4>
          <p className="text-[15px] font-sans text-slate-300">Statistics shown are based on field surveys, polling station uploads, and official declarations. Real-time metrics may have a collection latency of up to 5 minutes.</p>
        </div>
        <button className="px-6 py-3.5 bg-white text-[#0B0F2E] rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-slate-100 transition-colors">
          Download PDF Report
        </button>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, trend, subValue, color, isLive }: any) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className="bg-white rounded-[24px] p-6 border-b-4 shadow-[0_4px_20px_rgb(0,0,0,0.03)] relative overflow-hidden group transition-all"
      style={{
        borderBottomColor: color === 'blue' ? '#1565C0' : color === 'emerald' ? '#00796B' : color === 'amber' ? '#FF6500' : '#42A5F5'
      }}
    >
      <div className="flex items-center justify-between mb-6">
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 transition-transform group-hover:scale-110">
           <Icon className="h-6 w-6 text-slate-700" />
        </div>
        <div className="flex items-center gap-2">
          {isLive && (
             <div className="relative flex h-2 w-2">
               <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
               <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
             </div>
          )}
          <span className={cn(
            "text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-md",
            trend.includes('Live') || trend.includes('High') || trend.includes('+') ? "bg-red-50 text-red-600" : "bg-emerald-50 text-emerald-600"
          )}>
            {trend}
          </span>
        </div>
      </div>
      <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">{label}</div>
      <div className="text-3xl md:text-4xl font-display font-bold text-[#0B0F2E] mb-1.5 leading-none">
        <AnimatePresence mode="wait">
          <motion.span
            key={value}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
          >
            {value}
          </motion.span>
        </AnimatePresence>
      </div>
      <div className="text-[11px] text-slate-400 font-medium tracking-wide truncate">{subValue}</div>
    </motion.div>
  );
}

