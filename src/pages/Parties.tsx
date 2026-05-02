import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ExternalLink, Users, Award, Shield, Zap, BarChart3, Sparkles,
  Swords, X, Loader2, Info
} from 'lucide-react';
import { cn } from '../lib/utils';
import { getGeminiResponse, getPartyComparison } from '../lib/gemini';

// ... (keep the same Party interface and PARTIES array from your existing code)
interface Party {
  id: string;
  name: string;
  fullName: string;
  symbol: string;
  symbolEmoji: string;
  symbolImage?: string;
  color: string;
  founded: string;
  leader: string;
  ideology: string[];
  description: string;
  manifesto: string[];
  keyAchievements: string[];
  performance: {
    election: string;
    seats: number;
    voteShare: string;
  };
  website: string;
}

const PARTIES: Party[] = [
  {
    id: 'bjp',
    name: 'BJP',
    fullName: 'Bharatiya Janata Party',
    symbol: 'Lotus',
    symbolEmoji: '🪷',
    symbolImage: '/logos/Bharatiya_Janata_Party_(icon).svg.png',
    color: 'bg-orange-500',
    founded: '1980',
    leader: 'Nitin Nabin',
    ideology: ['Right-wing', 'Hindutva', 'Integral Humanism'],
    description: 'The BJP is the world\'s largest political party. It is a major political party in India and currently heads the National Democratic Alliance (NDA).',
    manifesto: ['Viksit Bharat by 2047', 'Digital India Expansion', 'Infrastructure Modernization'],
    keyAchievements: ['Article 370 Abrogation', 'Ram Mandir Construction', 'GST Implementation'],
    performance: { election: '2024 Lok Sabha', seats: 240, voteShare: '36.56%' },
    website: 'https://www.bjp.org'
  },
  {
    id: 'inc',
    name: 'INC',
    fullName: 'Indian National Congress',
    symbol: 'Hand',
    symbolEmoji: '✋',
    symbolImage: '/logos/Indian_National_Congress_hand_logo.png',
    color: 'bg-blue-600',
    founded: '1885',
    leader: 'Mallikarjun Kharge',
    ideology: ['Centrist', 'Social Democracy', 'Secularism'],
    description: 'The INC is one of the oldest political parties in the world. It was a key player in the Indian Independence movement.',
    manifesto: ['Nyay Scheme', 'Employment Guarantee', 'Social Justice Empowerment'],
    keyAchievements: ['Right to Education', 'MNREGA Implementation', 'India\'s Independence Movement'],
    performance: { election: '2024 Lok Sabha', seats: 99, voteShare: '21.19%' },
    website: 'https://www.inc.in'
  },
  {
    id: 'aap',
    name: 'AAP',
    fullName: 'Aam Aadmi Party',
    symbol: 'Broom',
    symbolEmoji: '🧹',
    symbolImage: '/logos/aap-logo-650_650x400_41428497829.webp',
    color: 'bg-sky-500',
    founded: '2012',
    leader: 'Arvind Kejriwal',
    ideology: ['Populism', 'Anti-corruption', 'Social Democracy'],
    description: 'AAP emerged from the non-political anti-corruption movement in 2011. Focuses heavily on education and healthcare.',
    manifesto: ['Quality Education', 'Free Healthcare Access', 'Transparent Governance'],
    keyAchievements: ['Mohalla Clinics', 'Educational Infrastructure Reform', 'Anti-Corruption Helpline'],
    performance: { election: '2024 Lok Sabha', seats: 3, voteShare: '1.11%' },
    website: 'https://aamaadmiparty.org'
  },
  {
    id: 'cpim',
    name: 'CPI(M)',
    fullName: 'Communist Party of India (Marxist)',
    symbol: 'Hammer and Sickle',
    symbolEmoji: '☭',
    symbolImage: '/logos/hammer-sickle-high-quality-vector-600nw-1899842053.webp',
    color: 'bg-red-600',
    founded: '1964',
    leader: 'M. A. Baby',
    ideology: ['Left-wing', 'Marxism-Leninism'],
    description: 'CPI(M) is a major communist party in India, traditionally holding power in states like Kerala and Tripura.',
    manifesto: ['Labor Rights Protection', 'Agrarian Reforms', 'Public Sector Strengthening'],
    keyAchievements: ['Land Reforms', 'Panchayati Raj Empowerment', 'Literacy Drives'],
    performance: { election: '2024 Lok Sabha', seats: 4, voteShare: '1.76%' },
    website: 'https://cpim.org'
  },
  {
    id: 'tmc',
    name: 'AITC',
    fullName: 'All India Trinamool Congress',
    symbol: 'Flowers and Grass',
    symbolEmoji: '🌱',
    symbolImage: '/logos/AITC_New_Logo.png',
    color: 'bg-emerald-600',
    founded: '1998',
    leader: 'Mamata Banerjee',
    ideology: ['Regionalism', 'Anti-communism', 'Populism'],
    description: 'AITC is a major regional party in West Bengal, founded after splitting from the INC.',
    manifesto: ['Women Empowerment', 'Rural Infrastructure', 'Cultural Preservation'],
    keyAchievements: ['Kanyashree Scheme', 'Rural Electrification', 'End of Left Front Rule in WB'],
    performance: { election: '2024 Lok Sabha', seats: 29, voteShare: '4.37%' },
    website: 'https://aitcofficial.org'
  }
];

type ComparisonResult = Awaited<ReturnType<typeof getPartyComparison>>;

export default function Parties() {
  const [versusMode, setVersusMode] = useState(false);
  const [partyA, setPartyA] = useState<string>('bjp');
  const [partyB, setPartyB] = useState<string>('inc');
  const [isComparing, setIsComparing] = useState(false);
  const [comparison, setComparison] = useState<ComparisonResult | null>(null);

  const handleCompare = async () => {
    if (partyA === partyB) return;
    setIsComparing(true);
    try {
      const pA = PARTIES.find(p => p.id === partyA)?.fullName || partyA;
      const pB = PARTIES.find(p => p.id === partyB)?.fullName || partyB;
      const result = await getPartyComparison(pA, pB);
      setComparison(result);
    } catch (error) {
      console.error(error);
    } finally {
      setIsComparing(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 pb-24 bg-ash-white min-h-screen">
      
      {/* Header */}
      <div className="text-center mb-12 relative z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-blue-100 text-blue-700 font-bold text-xs uppercase tracking-widest mb-6 border border-blue-200">
          <Users className="h-4 w-4" /> Political Landscape
        </motion.div>
        
        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="text-4xl md:text-[56px] font-black text-ink-navy tracking-tight leading-none mb-6">
          Major Political <span className="text-saffron">Parties</span>
        </motion.h1>

        {/* Versus Toggle Button */}
        <motion.button
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          onClick={() => { setVersusMode(!versusMode); setComparison(null); }}
          className={cn(
            'mx-auto flex items-center gap-2 px-6 py-3 rounded-full font-black uppercase tracking-widest text-sm transition-all shadow-xl',
            versusMode 
              ? 'bg-ink-navy text-white hover:bg-ink-blue shadow-ink-navy/20' 
              : 'bg-white text-ink-navy border-2 border-slate-200 hover:border-saffron hover:text-saffron shadow-slate-200/50'
          )}
        >
          {versusMode ? <X className="h-5 w-5" /> : <Swords className="h-5 w-5" />}
          {versusMode ? 'Exit Versus Mode' : 'AI Versus Mode'}
        </motion.button>
      </div>

      <AnimatePresence mode="wait">
        
        {/* ── VERSUS MODE PANEL ── */}
        {versusMode ? (
          <motion.div
            key="versus"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-16 bg-white rounded-3xl border-2 border-slate-100 p-6 md:p-10 shadow-2xl overflow-hidden relative"
          >
            {/* Background glowing VS */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[300px] font-black text-slate-50 opacity-50 pointer-events-none z-0 tracking-tighter">
              VS
            </div>

            <div className="relative z-10">
              <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12 mb-10">
                {/* Party A Select */}
                <select 
                  value={partyA} 
                  onChange={(e) => setPartyA(e.target.value)}
                  className="w-full md:w-64 text-center text-xl font-black text-ink-navy bg-slate-50 border-2 border-slate-200 rounded-2xl py-4 focus:outline-none focus:border-saffron focus:bg-white transition-all appearance-none"
                >
                  {PARTIES.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>

                <div className="w-12 h-12 rounded-full bg-saffron text-white flex items-center justify-center font-black text-xl shadow-lg shadow-saffron-glow shrink-0">
                  VS
                </div>

                {/* Party B Select */}
                <select 
                  value={partyB} 
                  onChange={(e) => setPartyB(e.target.value)}
                  className="w-full md:w-64 text-center text-xl font-black text-ink-navy bg-slate-50 border-2 border-slate-200 rounded-2xl py-4 focus:outline-none focus:border-emerald-green focus:bg-white transition-all appearance-none"
                >
                  {PARTIES.map(p => <option key={p.id} value={p.id} disabled={p.id === partyA}>{p.name}</option>)}
                </select>
              </div>

              <div className="text-center mb-10">
                <button
                  onClick={handleCompare}
                  disabled={isComparing || partyA === partyB}
                  className="px-10 py-4 rounded-2xl bg-ink-navy text-white font-black tracking-widest uppercase hover:bg-saffron transition-all shadow-xl shadow-ink-navy/20 disabled:opacity-50 flex items-center justify-center gap-3 mx-auto"
                >
                  {isComparing ? <Loader2 className="h-5 w-5 animate-spin" /> : <Sparkles className="h-5 w-5" />}
                  {isComparing ? 'AI Analysing Policies...' : 'Compare Policies Grounded in Search'}
                </button>
              </div>

              {/* Comparison Results */}
              {comparison && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                  
                  {/* Verdict Header */}
                  <div className="bg-slate-900 text-white p-6 rounded-2xl border border-slate-700 text-center mb-8">
                    <p className="text-sm font-black uppercase tracking-widest text-slate-400 mb-2">AI Verdict</p>
                    <p className="text-lg md:text-xl font-medium leading-relaxed">{comparison.verdict}</p>
                  </div>

                  {/* Stances Grid */}
                  <div className="grid gap-6">
                    {comparison.stances.map((stance, idx) => (
                      <div key={idx} className="bg-white border-2 border-slate-100 rounded-2xl overflow-hidden flex flex-col md:flex-row">
                        <div className="bg-slate-50 w-full md:w-48 p-4 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-slate-100 shrink-0">
                          <span className="text-4xl mb-2">{stance.emoji}</span>
                          <span className="text-xs font-black uppercase tracking-widest text-slate-600 text-center">{stance.category}</span>
                        </div>
                        
                        <div className="flex-1 grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-100">
                          <div className={cn("p-5", stance.aDifferentiator === 'stronger' ? 'bg-orange-50/30' : '')}>
                            <div className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">{comparison.partyA}</div>
                            <p className="text-sm text-slate-700 leading-relaxed font-medium">{stance.aStance}</p>
                          </div>
                          <div className={cn("p-5", stance.aDifferentiator === 'weaker' ? 'bg-emerald-50/30' : '')}>
                            <div className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">{comparison.partyB}</div>
                            <p className="text-sm text-slate-700 leading-relaxed font-medium">{stance.bStance}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-8 flex items-start gap-3 p-4 bg-blue-50 border border-blue-100 rounded-xl">
                    <Info className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
                    <p className="text-xs text-blue-800 font-medium leading-relaxed">{comparison.disclaimer}</p>
                  </div>

                </motion.div>
              )}
            </div>
          </motion.div>

        ) : (

        /* ── STANDARD PARTY CARDS GRID ── */
        <motion.div
          key="cards"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {PARTIES.map((party, index) => (
            <motion.div
              key={party.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="group relative bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-lg hover:shadow-2xl transition-all duration-500 flex flex-col"
            >
              {/* Color Banner */}
              <div className={cn("h-28 w-full relative", party.color)}>
                <div className="absolute -bottom-10 left-6">
                  <div className="h-20 w-20 bg-white rounded-2xl p-3 shadow-xl flex items-center justify-center text-4xl overflow-hidden border-4 border-white">
                    {party.symbolImage ? (
                      <img src={party.symbolImage} alt={`${party.name} symbol`} className="w-full h-full object-contain" />
                    ) : ( party.symbolEmoji )}
                  </div>
                </div>
              </div>
              
              <div className="p-6 pt-14 flex-grow flex flex-col">
                <div className="mb-6">
                  <h3 className="text-3xl font-black text-ink-navy tracking-tight">{party.name}</h3>
                  <p className="text-xs font-bold text-slate-400 mb-4">{party.fullName}</p>
                  <p className="text-sm text-slate-600 font-medium leading-relaxed">
                    {party.description}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1">Leader</span>
                    <span className="text-sm font-bold text-ink-navy truncate">{party.leader}</span>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1">Founded</span>
                    <span className="text-sm font-bold text-ink-navy">{party.founded}</span>
                  </div>
                </div>

                <div className="mb-6">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-3">Ideology</span>
                  <div className="flex flex-wrap gap-2">
                    {party.ideology.map(item => (
                      <span key={item} className="px-3 py-1.5 rounded-full bg-slate-100 text-slate-600 text-xs font-bold border border-slate-200">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-auto">
                  <a
                    href={party.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-4 rounded-xl border-2 border-slate-200 text-slate-700 font-black text-sm hover:border-ink-navy hover:bg-ink-navy hover:text-white transition-all group-hover:shadow-lg"
                  >
                    Official Website
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        )}
      </AnimatePresence>
    </div>
  );
}
