import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  CheckCircle, XCircle, AlertTriangle, ArrowRight,
  Download, Share2, RefreshCw, Loader2, ChevronRight
} from 'lucide-react';
import { getVoterReadinessReport } from '../lib/gemini';
import { cn } from '../lib/utils';
import html2canvas from 'html2canvas';

const QUESTIONS = [
  { id: 'age',    label: 'Are you 18 years or older?',                      hint: 'Minimum age to vote in India' },
  { id: 'aadhaar',label: 'Do you have an Aadhaar Card?',                     hint: 'Accepted as voter identity proof' },
  { id: 'epic',   label: 'Do you have a Voter ID (EPIC card)?',              hint: 'Electoral Photo Identity Card' },
  { id: 'roll',   label: 'Is your name on the Electoral Roll?',              hint: 'Check on voters.eci.gov.in' },
  { id: 'booth',  label: 'Do you know your polling booth location?',         hint: 'Find it on the Voter Helpline app' },
];

const STATES = [
  'Andhra Pradesh','Assam','Bihar','Chhattisgarh','Delhi','Gujarat','Haryana',
  'Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh','Maharashtra',
  'Odisha','Punjab','Rajasthan','Tamil Nadu','Telangana','Uttar Pradesh','Uttarakhand',
  'West Bengal','Other'
];

type Report = Awaited<ReturnType<typeof getVoterReadinessReport>>;

const statusConfig = {
  ready:    { bg: 'bg-emerald-500', border: 'border-emerald-400', text: 'text-emerald-600', light: 'bg-emerald-50', icon: CheckCircle },
  almost:   { bg: 'bg-orange-500',  border: 'border-orange-400',  text: 'text-orange-600',  light: 'bg-orange-50',  icon: AlertTriangle },
  notready: { bg: 'bg-red-500',     border: 'border-red-400',     text: 'text-red-600',     light: 'bg-red-50',     icon: XCircle },
};

const priorityConfig = {
  urgent: { color: 'text-red-600',     bg: 'bg-red-50',     border: 'border-red-200',     label: 'Urgent',  dot: 'bg-red-500'     },
  soon:   { color: 'text-orange-600',  bg: 'bg-orange-50',  border: 'border-orange-200',  label: 'Soon',    dot: 'bg-orange-500'  },
  done:   { color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200', label: 'Done ✓',  dot: 'bg-emerald-500' },
};

export default function VoterReadiness() {
  const [step, setStep] = useState<'quiz' | 'loading' | 'result'>('quiz');
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [state, setState] = useState('');
  const [report, setReport] = useState<Report | null>(null);
  const [error, setError] = useState('');
  const shareCardRef = useRef<HTMLDivElement>(null);

  const allAnswered = QUESTIONS.every(q => answers[q.id]) && state;

  const handleAnswer = (id: string, val: string) => {
    setAnswers(prev => ({ ...prev, [id]: val }));
  };

  const handleSubmit = async () => {
    setStep('loading');
    setError('');
    try {
      const result = await getVoterReadinessReport({ ...answers, state });
      setReport(result);
      setStep('result');
    } catch (e) {
      setError('Could not generate your report. Please try again.');
      setStep('quiz');
    }
  };

  const handleDownload = async () => {
    if (!shareCardRef.current) return;
    const canvas = await html2canvas(shareCardRef.current, { scale: 2, backgroundColor: '#fff' });
    const link = document.createElement('a');
    link.download = 'JanVote-Voter-Ready-Card.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const handleShare = async () => {
    if (!report) return;
    const text = `[India] ${report.statusLabel}\n\n${report.headline}\n\nCheck your voter readiness at JanVote AI!`;
    if (navigator.share) {
      navigator.share({ title: 'JanVote AI - Voter Readiness', text });
    } else {
      await navigator.clipboard.writeText(text);
      alert('Status copied to clipboard!');
    }
  };

  const cfg = report ? statusConfig[report.status] : null;
  const StatusIcon = cfg?.icon || CheckCircle;

  return (
    <div className="max-w-2xl mx-auto space-y-8 py-10 px-4">

      {/* Page Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
        <div className="inline-flex items-center gap-2 bg-orange-50 border border-orange-200 text-orange-600 text-xs font-black uppercase tracking-widest px-4 py-2 rounded-full mb-5">
          🗳️ Voter Readiness Check
        </div>
        <h1 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 mb-4">
          Am I Ready to Vote?
        </h1>
        <p className="text-slate-500 text-lg font-medium max-w-lg mx-auto">
          Answer 5 quick questions. Get your personalised voter readiness report powered by AI.
        </p>

        {/* Step progress pills */}
        <div className="flex items-center justify-center gap-3 mt-6">
          {['Your Details', 'AI Analysis', 'Your Report'].map((label, i) => {
            const done = step === 'result' ? i < 3 : step === 'loading' ? i < 2 : i < 1;
            const active = step === 'quiz' && i === 0 || step === 'loading' && i === 1 || step === 'result' && i === 2;
            return (
              <div key={i} className="flex items-center gap-2">
                <div className={cn(
                  'w-7 h-7 rounded-full flex items-center justify-center text-xs font-black border-2 transition-all',
                  done || active ? 'bg-orange-500 border-orange-500 text-white' : 'bg-white border-slate-200 text-slate-400'
                )}>
                  {done && !active ? '✓' : i + 1}
                </div>
                <span className={cn('text-xs font-bold', active ? 'text-orange-600' : 'text-slate-400')}>{label}</span>
                {i < 2 && <ChevronRight className="h-4 w-4 text-slate-300" />}
              </div>
            );
          })}
        </div>
      </motion.div>

      <AnimatePresence mode="wait">

        {/* ── STEP 1: QUIZ ── */}
        {step === 'quiz' && (
          <motion.div
            key="quiz"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            className="space-y-4"
          >
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-sm text-red-600 font-medium">{error}</div>
            )}

            {/* State selector */}
            <div className="bg-white border-2 border-slate-100 rounded-2xl p-5 hover:border-orange-200 transition-all">
              <p className="text-sm font-black text-slate-700 mb-3">Which state are you voting in?</p>
              <select
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="w-full text-sm font-medium text-slate-700 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-orange-400 transition-all"
              >
                <option value="">Select your state...</option>
                {STATES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            {/* Questions */}
            {QUESTIONS.map((q, idx) => (
              <motion.div
                key={q.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.06 }}
                className={cn(
                  'bg-white border-2 rounded-2xl p-5 transition-all',
                  answers[q.id] ? 'border-orange-300 bg-orange-50/30' : 'border-slate-100 hover:border-orange-200'
                )}
              >
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div>
                    <p className="text-sm font-black text-slate-800">{q.label}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{q.hint}</p>
                  </div>
                  {answers[q.id] && (
                    <div className={cn(
                      'w-6 h-6 rounded-full flex items-center justify-center shrink-0',
                      answers[q.id] === 'yes' ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-500'
                    )}>
                      {answers[q.id] === 'yes' ? '✓' : '✗'}
                    </div>
                  )}
                </div>
                <div className="flex gap-3">
                  {['yes', 'no'].map(val => (
                    <button
                      key={val}
                      onClick={() => handleAnswer(q.id, val)}
                      className={cn(
                        'flex-1 py-2.5 rounded-xl text-sm font-black uppercase tracking-wider border-2 transition-all',
                        answers[q.id] === val
                          ? val === 'yes'
                            ? 'bg-emerald-500 text-white border-emerald-500 shadow-md shadow-emerald-500/20'
                            : 'bg-red-500 text-white border-red-500 shadow-md shadow-red-500/20'
                          : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'
                      )}
                    >
                      {val === 'yes' ? '✓  Yes' : '✗  No'}
                    </button>
                  ))}
                </div>
              </motion.div>
            ))}

            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={handleSubmit}
              disabled={!allAnswered}
              className="w-full py-5 rounded-2xl bg-orange-500 text-white font-black text-base shadow-xl shadow-orange-500/25 hover:bg-orange-600 transition-all disabled:opacity-40 disabled:shadow-none flex items-center justify-center gap-3"
            >
              Check My Readiness
              <ArrowRight className="h-5 w-5" />
            </motion.button>
          </motion.div>
        )}

        {/* ── STEP 2: LOADING ── */}
        {step === 'loading' && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-24 gap-6"
          >
            <div className="relative w-24 h-24">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-0 border-4 border-dashed border-orange-300 rounded-full"
              />
              <div className="absolute inset-3 bg-orange-50 rounded-full flex items-center justify-center">
                <span className="text-3xl">🗳️</span>
              </div>
            </div>
            <div className="text-center">
              <p className="text-xl font-black text-slate-800 mb-2">Analysing your readiness...</p>
              <p className="text-sm text-slate-400 font-medium">Gemini AI is reviewing your answers</p>
            </div>
            <div className="flex gap-1.5">
              {[0, 1, 2].map(i => (
                <motion.div key={i} animate={{ scale: [1, 1.5, 1], opacity: [0.4, 1, 0.4] }}
                  transition={{ repeat: Infinity, duration: 1.2, delay: i * 0.2 }}
                  className="w-2 h-2 bg-orange-400 rounded-full"
                />
              ))}
            </div>
          </motion.div>
        )}

        {/* ── STEP 3: RESULT ── */}
        {step === 'result' && report && cfg && (
          <motion.div
            key="result"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-6"
          >
            {/* ── SHAREABLE CARD (html2canvas target) ── */}
            <div
              ref={shareCardRef}
              className="relative bg-white border-2 border-slate-100 rounded-3xl overflow-hidden p-8"
            >
              {/* Card header color bar */}
              <div className={cn('absolute top-0 left-0 w-full h-2', cfg.bg)} />

              {/* Flag stripe watermark */}
              <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 via-white to-emerald-600 opacity-60" />

              <div className="flex items-start gap-5 mb-6">
                <div className={cn('w-16 h-16 rounded-2xl flex items-center justify-center shrink-0', cfg.light)}>
                  <StatusIcon className={cn('h-8 w-8', cfg.text)} />
                </div>
                <div>
                  <div className={cn('inline-block text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full mb-2', cfg.light, cfg.text)}>
                    {report.statusLabel}
                  </div>
                  <h2 className="text-xl font-black text-slate-900 leading-tight">{report.headline}</h2>
                </div>
              </div>

              <p className="text-sm text-slate-600 font-medium leading-relaxed mb-6 border-l-4 border-orange-200 pl-4">
                {report.summary}
              </p>

              {/* Action Items */}
              <div className="space-y-2.5 mb-6">
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Your Action Plan</p>
                {report.actions.map((action, i) => {
                  const pc = priorityConfig[action.priority];
                  return (
                    <div key={i} className={cn('flex items-start gap-3 p-3.5 rounded-xl border', pc.bg, pc.border)}>
                      <div className={cn('w-2 h-2 rounded-full mt-1.5 shrink-0', pc.dot)} />
                      <div className="flex-1 min-w-0">
                        <span className={cn('text-sm font-semibold', pc.color)}>{action.task}</span>
                        {action.link && (
                          <a href={action.link} target="_blank" rel="noopener noreferrer"
                            className="block text-xs text-blue-500 mt-0.5 truncate hover:underline">
                            {action.link}
                          </a>
                        )}
                      </div>
                      <span className={cn('text-[10px] font-black uppercase tracking-wider shrink-0', pc.color)}>{pc.label}</span>
                    </div>
                  );
                })}
              </div>

              {/* Motivational quote */}
              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4">
                <p className="text-sm text-slate-600 italic font-medium text-center leading-relaxed">
                  "{report.motivationalQuote}"
                </p>
              </div>

              {/* Branding */}
              <div className="flex items-center justify-between mt-5 pt-4 border-t border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="text-lg">🗳️</span>
                  <span className="font-black text-slate-800 text-sm">JanVote <span className="text-orange-500">AI</span></span>
                </div>
                <span className="text-xs text-slate-400 font-medium">Powered by Gemini</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleDownload}
                className="flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl bg-orange-500 text-white font-black shadow-lg shadow-orange-500/20 hover:bg-orange-600 transition-all"
              >
                <Download className="h-5 w-5" />
                Save Card
              </button>
              <button
                onClick={handleShare}
                className="flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl bg-white border-2 border-slate-200 text-slate-700 font-black hover:border-orange-300 hover:bg-orange-50 transition-all"
              >
                <Share2 className="h-5 w-5" />
                Share
              </button>
              <button
                onClick={() => { setStep('quiz'); setAnswers({}); setState(''); setReport(null); }}
                className="py-4 px-5 rounded-2xl bg-white border-2 border-slate-200 text-slate-500 hover:bg-slate-50 transition-all"
                title="Retake"
              >
                <RefreshCw className="h-5 w-5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
