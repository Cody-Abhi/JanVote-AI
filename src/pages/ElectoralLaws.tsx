import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { BookOpen, Scale, ScrollText, CheckCircle2, AlertTriangle, ShieldCheck, FileText, Landmark, Link as LinkIcon, ExternalLink } from 'lucide-react';
import { cn } from '../lib/utils';

export default function ElectoralLaws() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'constitution' | 'legislation' | 'mcc' | 'links'>('constitution');

  const tabs = [
    { id: 'constitution', label: 'Constitutional Provisions', icon: Landmark },
    { id: 'legislation', label: 'Key Legislations', icon: Scale },
    { id: 'mcc', label: 'Model Code of Conduct', icon: ShieldCheck },
    { id: 'links', label: 'Important Links', icon: LinkIcon },
  ] as const;

  const constitutionalProvisions = [
    {
      article: 'Article 324',
      title: 'Superintendence of Elections',
      description: 'Superintendence, direction, and control of the preparation of the electoral rolls and conduct of all elections to Parliament and State Legislatures, and the offices of President and Vice-President, are vested in the Election Commission of India.',
      icon: BookOpen
    },
    {
      article: 'Article 325',
      title: 'No Discrimination',
      description: 'No person shall be ineligible for inclusion in, or claim to be included in a special electoral roll on grounds of religion, race, caste, or sex. There shall be one general electoral roll for every territorial constituency.',
      icon: ScrollText
    },
    {
      article: 'Article 326',
      title: 'Universal Adult Suffrage',
      description: 'Elections to the Lok Sabha and State Legislative Assemblies shall be held on the basis of universal adult suffrage. Every citizen who is not less than 18 years of age is entitled to be registered as a voter.',
      icon: CheckCircle2
    },
    {
      article: 'Article 329',
      title: 'Bar to Interference by Courts',
      description: 'Courts are barred from interfering in electoral matters. No election shall be called in question except by an election petition presented to such authority in such manner as may be provided for by or under any law.',
      icon: AlertTriangle
    }
  ];

  const legislations = [
    {
      title: 'Representation of the People Act, 1950',
      description: 'Deals with the preparation and revision of electoral rolls, delimitation of constituencies, allocation of seats in Parliament and State Legislatures, and qualifications for voters.',
      highlights: ['Voter Registration', 'Allocation of Seats', 'Delimitation']
    },
    {
      title: 'Representation of the People Act, 1951',
      description: 'Governs the actual conduct of elections, qualifications and disqualifications of candidates, resolution of election disputes, and defines corrupt electoral practices.',
      highlights: ['Conduct of Elections', 'Corrupt Practices', 'Disqualifications']
    },
    {
      title: 'Conduct of Elections Rules, 1961',
      description: 'Detailed rules providing for the entire process of conducting elections, including voting, counting of votes, polling stations, use of EVMs and VVPATs, and postal ballots.',
      highlights: ['EVM/VVPAT operation', 'Voting procedure', 'Counting']
    },
    {
      title: 'Election Symbols (Reservation and Allotment) Order, 1968',
      description: 'Provides for the registration of political parties, their recognition as National or State parties, and the reservation and allotment of electoral symbols.',
      highlights: ['Party Registration', 'Symbol Allotment', 'National/State Status']
    }
  ];

  const mccHighlights = [
    {
      title: 'General Conduct',
      description: 'No party or candidate shall engage in any activity which may aggravate existing differences, create mutual hatred, or cause tension between different castes, communities, or religious/linguistic groups.',
    },
    {
      title: 'Meetings and Processions',
      description: 'Parties and candidates must inform the local police authorities of the venue and time of any proposed meeting/procession well in time so that necessary arrangements can be made.',
    },
    {
      title: 'Polling Day Activities',
      description: 'All parties and candidates must cooperate with election officers to ensure peaceful voting. No campaigning within 100 meters of the polling station. No serving of liquor on polling day.',
    },
    {
      title: 'Party in Power',
      description: 'The ruling party must not use its official position for election campaigns. Ministers shall not combine official visits with electioneering or use official machinery for political work.',
    }
  ];

  const officialLinks = [
    {
      title: 'Election Commission of India (ECI)',
      url: 'https://eci.gov.in/',
      description: 'Official website of the Election Commission of India providing comprehensive information on elections, voter registration, and results.'
    },
    {
      title: 'National Voters\' Services Portal (NVSP)',
      url: 'https://voters.eci.gov.in/',
      description: 'Portal for voter registration, checking name in Electoral Roll, and other citizen services.'
    },
    {
      title: 'State Election Commissions',
      url: 'https://eci.gov.in/links/state-election-commissions/',
      description: 'Directory of official websites for State Election Commissions across India.'
    },
    {
      title: 'Candidate Affidavit Portal',
      url: 'https://affidavit.eci.gov.in/',
      description: 'Access sworn affidavits details of candidates contesting in elections.'
    }
  ];

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-10 text-center">
        <div className="inline-flex items-center justify-center p-3 bg-orange-100 rounded-[24px] mb-4 text-[#FF6500]">
          <Scale className="h-8 w-8" />
        </div>
        <h1 className="text-3xl md:text-4xl font-display font-bold text-[#0B0F2E] tracking-tight mb-4">
          Electoral Laws & Guidelines
        </h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Explore the constitutional provisions, acts, and rules that govern the democratic voting system and ensure free and fair elections in India.
        </p>
      </div>

      <div className="flex justify-center mb-8 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-hide">
        <div className="bg-white p-1.5 rounded-full border border-slate-200 shadow-sm flex whitespace-nowrap gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                "flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold transition-all shrink-0",
                activeTab === tab.id
                  ? "bg-[#0B0F2E] text-white shadow-[0_4px_14px_rgba(11,15,46,0.3)]"
                  : "text-slate-600 hover:bg-slate-200 hover:text-slate-900"
              )}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'constitution' && (
          <motion.div
            key="constitution"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {constitutionalProvisions.map((item, idx) => (
              <div key={idx} className="bg-white rounded-[32px] p-6 border border-slate-200 shadow-sm hover:border-[#FF6500] hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-all duration-300 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 group-hover:text-[#FF6500] transition-all">
                  <item.icon className="w-32 h-32" />
                </div>
                <div className="relative z-10">
                  <span className="inline-block px-3 py-1 bg-orange-50 text-[#0B0F2E] text-xs font-bold uppercase tracking-widest rounded-lg mb-3">
                    {item.article}
                  </span>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">{item.title}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {activeTab === 'legislation' && (
          <motion.div
            key="legislation"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-6"
          >
            {legislations.map((item, idx) => (
              <div key={idx} className="bg-white rounded-[32px] p-6 md:p-8 border border-slate-200 shadow-sm hover:border-[#FF6500] hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-all duration-300 flex flex-col md:flex-row gap-6 items-start">
                <div className="shrink-0 flex items-center justify-center w-12 h-12 bg-orange-50 text-[#FF6500] rounded-2xl">
                  <FileText className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{item.title}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed mb-4">{item.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {item.highlights.map((highlight, hIdx) => (
                      <span key={hIdx} className="px-2.5 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded-lg border border-slate-200">
                        {highlight}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {activeTab === 'mcc' && (
          <motion.div
            key="mcc"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
             <div className="bg-emerald-50 rounded-3xl p-6 md:p-8 border border-emerald-100 mb-8">
               <h3 className="text-xl font-bold text-emerald-900 mb-2 text-center">What is the Model Code of Conduct?</h3>
               <p className="text-emerald-800 text-sm leading-relaxed text-center max-w-3xl mx-auto">
                 The Model Code of Conduct (MCC) is a set of guidelines issued by the Election Commission of India to regulate political parties and candidates prior to elections, to ensure free and fair elections. It comes into force immediately after elections are announced.
               </p>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {mccHighlights.map((item, idx) => (
                  <div key={idx} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="bg-orange-100 text-orange-600 p-2 rounded-xl">
                        <AlertTriangle className="h-5 w-5" />
                      </div>
                      <h4 className="font-bold text-slate-900">{item.title}</h4>
                    </div>
                    <p className="text-slate-600 text-sm leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                ))}
             </div>
          </motion.div>
        )}

        {activeTab === 'links' && (
          <motion.div
            key="links"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {officialLinks.map((link, idx) => (
              <a
                key={idx}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow group flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-[#FF6500] transition-colors">
                      {link.title}
                    </h3>
                    <ExternalLink className="h-5 w-5 text-slate-400 group-hover:text-[#FF6500] transition-colors shrink-0 ml-4" />
                  </div>
                  <p className="text-slate-600 text-sm leading-relaxed mb-4">
                    {link.description}
                  </p>
                </div>
                <div className="text-xs font-medium text-[#0B0F2E] truncate mt-auto">
                  {link.url}
                </div>
              </a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
