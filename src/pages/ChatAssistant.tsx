import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Send, Bot, User, Volume2, Sparkles, RefreshCw,
  History, ArrowRight, Mic, Waves, X, Globe, CheckCircle
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { streamGeminiResponse, detectLanguageAndLocale } from '../lib/gemini';
import { cn } from '../lib/utils';
import { useAuth } from '../context/AuthContext';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, setDoc, doc, getDocs, limit } from 'firebase/firestore';

interface Message {
  role: 'user' | 'model';
  content: string;
  isStreaming?: boolean;
  locale?: string;
}

// Supported Indian languages quick-switch strip
const INDIAN_LANGUAGES = [
  { code: 'en-IN', label: 'EN', name: 'English', flag: '🇬🇧' },
  { code: 'hi-IN', label: 'HI', name: 'Hindi', flag: '🇮🇳' },
  { code: 'ta-IN', label: 'TA', name: 'Tamil', flag: '🌴' },
  { code: 'te-IN', label: 'TE', name: 'Telugu', flag: '⭐' },
  { code: 'mr-IN', label: 'MR', name: 'Marathi', flag: '🦁' },
  { code: 'bn-IN', label: 'BN', name: 'Bengali', flag: '🐯' },
  { code: 'gu-IN', label: 'GU', name: 'Gujarati', flag: '🦚' },
  { code: 'kn-IN', label: 'KN', name: 'Kannada', flag: '🐘' },
];

const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

const TypingIndicator = () => (
  <div className="flex items-center gap-1.5 px-1 py-1">
    {[0, 1, 2].map((i) => (
      <motion.div
        key={i}
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.2, ease: 'easeInOut' }}
        className="h-2 w-2 bg-orange-500 rounded-full"
      />
    ))}
  </div>
);

export default function ChatAssistant() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [followUps, setFollowUps] = useState<string[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [historyMessages, setHistoryMessages] = useState<Message[]>([]);
  const [isFetchingHistory, setIsFetchingHistory] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Language detection state
  const [detectedLang, setDetectedLang] = useState<{ locale: string; langName: string } | null>(null);
  const [activeLang, setActiveLang] = useState(INDIAN_LANGUAGES[0]);
  const [showLangBanner, setShowLangBanner] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize Speech Recognition with language-aware config
  useEffect(() => {
    if (!SpeechRecognition) return;
    const rec = new SpeechRecognition();
    rec.continuous = false;
    rec.interimResults = true;
    rec.lang = activeLang.code;

    rec.onresult = (event: any) => {
      let transcript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        transcript += event.results[i][0].transcript;
      }
      setInput(transcript);
    };
    rec.onerror = () => setIsListening(false);
    rec.onend = () => setIsListening(false);
    setRecognition(rec);
  }, [activeLang]);

  const toggleListening = () => {
    if (!recognition) { alert('Speech recognition not supported in this browser.'); return; }
    if (isListening) { recognition.stop(); setIsListening(false); }
    else { recognition.lang = activeLang.code; recognition.start(); setIsListening(true); }
  };

  // Speak the AI response back in the correct language
  const speakMessage = useCallback((text: string, locale?: string) => {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text.replace(/[*#`]/g, ''));
    utterance.lang = locale || activeLang.code;
    utterance.rate = 0.9;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  }, [activeLang]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    const currentInput = input;
    const userMessage: Message = { role: 'user', content: currentInput };
    setMessages(prev => [...prev.slice(-9), userMessage]);
    setInput('');
    setIsLoading(true);
    setFollowUps([]);

    // Auto-detect language from input
    let responseLocale = activeLang.code;
    try {
      const detected = await detectLanguageAndLocale(currentInput);
      responseLocale = detected.locale;
      if (detected.locale !== activeLang.code) {
        setDetectedLang({ locale: detected.locale, langName: detected.langName });
        setShowLangBanner(true);
        setTimeout(() => setShowLangBanner(false), 4000);
      }
    } catch { /* fallback to activeLang */ }

    try {
      if (user) {
        const sessionRef = doc(db, 'chatSessions', user.uid);
        await setDoc(sessionRef, { userId: user.uid, lastMessage: currentInput, updatedAt: serverTimestamp() }, { merge: true });
        await addDoc(collection(db, 'chatSessions', user.uid, 'messages'), { role: 'user', content: currentInput, timestamp: serverTimestamp() });
      }

      setMessages(prev => [...prev, { role: 'model', content: '', isStreaming: true, locale: responseLocale }]);
      let fullResponse = '';

      // Pass detected language name to Gemini so it responds in that language
      const detectedLangName = INDIAN_LANGUAGES.find(l => l.code === responseLocale)?.name || 'english';
      const stream = streamGeminiResponse(currentInput, messages.slice(-10), detectedLangName.toLowerCase());

      for await (const chunk of stream) {
        fullResponse += chunk;
        setMessages(prev => {
          const next = [...prev];
          next[next.length - 1] = { ...next[next.length - 1], content: fullResponse.split(/FOLLOW_UPS:/)[0].trim() };
          return next;
        });
      }

      let cleanedResponse = fullResponse;
      let extractedFollowUps: string[] = [];
      const followUpMatch = fullResponse.match(/FOLLOW_UPS:\s*(\[.*\])/s);
      if (followUpMatch) {
        try { extractedFollowUps = JSON.parse(followUpMatch[1]); } catch { }
        cleanedResponse = fullResponse.replace(/FOLLOW_UPS:\s*\[.*\]/s, '').trim();
      }

      setMessages(prev => {
        const next = [...prev];
        next[next.length - 1] = { ...next[next.length - 1], content: cleanedResponse, isStreaming: false, locale: responseLocale };
        return next;
      });
      setFollowUps(extractedFollowUps);

      // Auto-speak the response
      speakMessage(cleanedResponse, responseLocale);

      if (user) {
        await addDoc(collection(db, 'chatSessions', user.uid, 'messages'), { role: 'model', content: cleanedResponse, timestamp: serverTimestamp() });
      }
    } catch {
      setMessages(prev => [...prev, { role: 'model', content: 'I encountered an error. Please try again.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, isLoading]);

  const fetchHistory = async () => {
    if (!user) return;
    setIsFetchingHistory(true);
    try {
      const q = query(collection(db, 'chatSessions', user.uid, 'messages'), orderBy('timestamp', 'desc'), limit(20));
      const snapshot = await getDocs(q);
      setHistoryMessages(snapshot.docs.map(d => ({ role: d.data().role, content: d.data().content } as Message)).reverse());
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, `chatSessions/${user.uid}/messages`);
    } finally {
      setIsFetchingHistory(false);
    }
  };

  const suggestions = [
    'मुझे वोट कैसे करना है?',
    'How do I register to vote?',
    'ভোটার আইডি কার্ড কিভাবে পাবো?',
    'EVM என்றால் என்ன?',
  ];

  return (
    <div className="flex flex-1 flex-col bg-white overflow-hidden relative w-full h-full min-h-0 selection:bg-orange-500/20">

      {/* Tricolor top bar */}
      <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-orange-500 via-white to-emerald-600 z-50" />

      {/* Ambient glows */}
      <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] bg-orange-500/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-500/5 blur-[120px] rounded-full pointer-events-none" />

      {/* Language Detected Banner */}
      <AnimatePresence>
        {showLangBanner && detectedLang && (
          <motion.div
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            className="absolute top-2 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 bg-orange-500 text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg shadow-orange-500/30"
          >
            <Globe className="h-3.5 w-3.5" />
            Detected: {detectedLang.langName} · Responding in {detectedLang.langName}
            <CheckCircle className="h-3.5 w-3.5" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <header className="flex items-center justify-between border-b border-slate-100 px-4 md:px-8 py-3 md:py-4 bg-white/80 backdrop-blur-md relative z-20 shrink-0 mt-1.5">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="h-10 w-10 md:h-12 md:w-12 rounded-xl md:rounded-2xl bg-orange-500 flex items-center justify-center shadow-lg shadow-orange-500/20 text-white">
              <Bot className="h-5 w-5 md:h-6 md:w-6" />
            </div>
            <div className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full bg-emerald-500 border-2 border-white" />
          </div>
          <div>
            <h2 className="text-base md:text-lg font-black text-slate-800 tracking-tight">
              JanVote <span className="text-orange-500">AI</span>
            </h2>
            <div className="flex items-center gap-2">
              <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">Online · 22 Languages</span>
            </div>
          </div>
        </div>

        {/* Language Quick Strip */}
        <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide">
          {INDIAN_LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              onClick={() => setActiveLang(lang)}
              title={lang.name}
              className={cn(
                'flex items-center gap-1 px-2.5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider transition-all shrink-0',
                activeLang.code === lang.code
                  ? 'bg-orange-500 text-white shadow-md shadow-orange-500/30'
                  : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
              )}
            >
              <span>{lang.flag}</span>
              <span className="hidden sm:inline">{lang.label}</span>
            </button>
          ))}
        </div>

        <button
          onClick={() => { if (!showHistory) fetchHistory(); setShowHistory(!showHistory); }}
          className={cn(
            'p-2.5 rounded-xl transition-all border',
            showHistory ? 'bg-orange-50 border-orange-200 text-orange-600' : 'bg-white border-slate-100 text-slate-400 hover:bg-slate-50'
          )}
        >
          <History className="h-5 w-5" />
        </button>
      </header>

      {/* Messages */}
      <div className="flex flex-1 overflow-hidden relative w-full">
        <div className="flex-1 overflow-y-auto scrollbar-none relative w-full">
          <div className="max-w-3xl mx-auto px-4 md:px-8 py-8 space-y-8 w-full pb-12">

            {messages.length === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center justify-center text-center max-w-xl mx-auto pt-8"
              >
                {/* Ashoka Chakra spinner as welcome icon */}
                <div className="w-20 h-20 rounded-3xl bg-orange-50 border border-orange-100 flex items-center justify-center mb-6 relative">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
                    className="absolute inset-2 border-2 border-dashed border-orange-300 rounded-full"
                  />
                  <Sparkles className="h-8 w-8 text-orange-500 relative z-10" />
                </div>

                <h3 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tighter mb-3">नमस्ते! · Namaste!</h3>
                <p className="text-base text-slate-500 font-medium mb-3 leading-relaxed">
                  Ask in any of India's 22 languages. I'll auto-detect and respond in yours.
                </p>

                {/* Language support strip */}
                <div className="flex flex-wrap justify-center gap-1.5 mb-8">
                  {['हिंदी', 'தமிழ்', 'తెలుగు', 'বাংলা', 'मराठी', 'ਪੰਜਾਬੀ', 'ಕನ್ನಡ', 'English'].map((lang) => (
                    <span key={lang} className="text-xs px-2.5 py-1 bg-orange-50 border border-orange-100 text-orange-700 rounded-full font-medium">{lang}</span>
                  ))}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
                  {suggestions.map((s, i) => (
                    <motion.button
                      key={i}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setInput(s)}
                      className="p-4 text-left bg-white border border-slate-200 rounded-2xl hover:border-orange-300 hover:bg-orange-50/50 transition-all group"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-sm font-bold text-slate-700 group-hover:text-orange-600 transition-colors">{s}</span>
                        <ArrowRight className="h-4 w-4 text-slate-300 group-hover:text-orange-500 shrink-0 group-hover:translate-x-1 transition-all" />
                      </div>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}

            <AnimatePresence initial={false}>
              {messages.map((m, i) => (
                <React.Fragment key={i}>
                  <motion.div
                    initial={{ opacity: 0, y: 16, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 120 }}
                    className={cn('flex gap-4', m.role === 'user' ? 'flex-row-reverse' : 'flex-row')}
                  >
                    <div className={cn(
                      'flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border',
                      m.role === 'user'
                        ? 'bg-slate-100 border-slate-200 text-slate-500'
                        : 'bg-orange-500 text-white border-orange-400 shadow-md shadow-orange-500/20'
                    )}>
                      {m.role === 'user' ? <User className="h-5 w-5" /> : <Bot className="h-5 w-5" />}
                    </div>

                    <div className={cn(
                      'max-w-[80%] rounded-[1.75rem] px-5 py-4 text-sm font-medium leading-relaxed border shadow-sm',
                      m.role === 'user'
                        ? 'bg-orange-500 text-white border-orange-400 rounded-tr-none'
                        : 'bg-white text-slate-800 border-slate-100 rounded-tl-none'
                    )}>
                      <div className={cn('prose prose-sm max-w-none', m.role === 'user' ? 'prose-invert' : 'prose-slate')}>
                        <ReactMarkdown
                          components={{
                            p: ({ children }) => (
                              <p className="mb-3 last:mb-0">
                                {children}
                                {m.role === 'model' && m.isStreaming && (
                                  <motion.span
                                    animate={{ opacity: [1, 0, 1] }}
                                    transition={{ repeat: Infinity, duration: 0.8 }}
                                    className="inline-block w-1.5 h-4 bg-orange-500 ml-1 rounded-full align-middle translate-y-[-1px]"
                                  />
                                )}
                              </p>
                            )
                          }}
                        >
                          {m.content || (m.isStreaming ? '...' : '')}
                        </ReactMarkdown>
                      </div>

                      {m.role === 'model' && !m.isStreaming && (
                        <div className="mt-3 flex items-center justify-between">
                          {/* Language tag */}
                          <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider">
                            {INDIAN_LANGUAGES.find(l => l.code === m.locale)?.name || 'English'}
                          </span>
                          <button
                            onClick={() => speakMessage(m.content, m.locale)}
                            className={cn(
                              'flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-full transition-all border',
                              isSpeaking
                                ? 'bg-orange-50 text-orange-600 border-orange-200'
                                : 'bg-slate-50 text-slate-400 border-slate-100 hover:text-orange-600 hover:bg-orange-50 hover:border-orange-200'
                            )}
                          >
                            <Volume2 className="h-3.5 w-3.5" />
                            {isSpeaking ? 'Speaking...' : 'Listen'}
                          </button>
                        </div>
                      )}
                    </div>
                  </motion.div>

                  {i === messages.length - 1 && m.role === 'model' && followUps.length > 0 && !isLoading && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex flex-wrap gap-2 ml-14"
                    >
                      {followUps.map((q, idx) => (
                        <button
                          key={idx}
                          onClick={() => {
                            setInput(q);
                            setFollowUps([]);
                            setTimeout(() => { document.getElementById('chat-submit-btn')?.click(); }, 50);
                          }}
                          className="px-4 py-2 text-xs font-bold text-orange-600 border border-orange-100 rounded-full bg-orange-50/50 hover:bg-orange-500 hover:text-white hover:border-orange-500 transition-all"
                        >
                          {q}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </React.Fragment>
              ))}
            </AnimatePresence>

            {isLoading && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-orange-500 text-white shadow-md shadow-orange-500/20">
                  <Bot className="h-5 w-5" />
                </div>
                <div className="flex items-center bg-white border border-slate-100 px-5 py-4 rounded-[1.75rem] rounded-tl-none shadow-sm">
                  <TypingIndicator />
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* History Overlay */}
        <AnimatePresence>
          {showHistory && (
            <motion.div
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 200 }}
              className="absolute inset-y-0 right-0 w-full sm:w-80 bg-white/95 backdrop-blur-xl border-l border-slate-100 z-50 shadow-2xl flex flex-col"
            >
              <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">Chat History</h3>
                <button onClick={() => setShowHistory(false)} className="p-2 hover:bg-slate-100 rounded-full transition-all">
                  <X className="h-5 w-5 text-slate-400" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {isFetchingHistory
                  ? [1, 2, 3].map(i => <div key={i} className="h-20 bg-slate-50 rounded-2xl animate-pulse" />)
                  : historyMessages.length === 0
                    ? <div className="text-center py-16 text-sm text-slate-400">No history found.</div>
                    : historyMessages.map((m, i) => (
                      <div key={i} className="p-4 bg-slate-50 border border-slate-100 rounded-2xl hover:border-orange-200 transition-all group">
                        <span className={cn('text-[9px] font-black uppercase tracking-widest block mb-1.5', m.role === 'user' ? 'text-orange-500' : 'text-emerald-500')}>
                          {m.role === 'user' ? 'You' : 'JanVote AI'}
                        </span>
                        <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed">{m.content}</p>
                      </div>
                    ))
                }
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Input Footer */}
      <footer className="p-3 md:p-6 bg-white/80 border-t border-slate-100 relative z-20 shrink-0 backdrop-blur-md">
        <div className="max-w-3xl mx-auto">
          <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="relative flex items-center w-full">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={`Ask in ${activeLang.name}... · ${activeLang.flag}`}
              className="w-full bg-white border-2 border-slate-200 rounded-[2rem] pl-5 pr-32 py-4 text-sm font-medium text-slate-700 placeholder-slate-300 focus:outline-none focus:border-orange-400 transition-all shadow-sm"
            />
            <div className="absolute right-2 flex items-center gap-1.5">
              <motion.button
                whileTap={{ scale: 0.9 }}
                type="button"
                onClick={toggleListening}
                className={cn(
                  'h-11 w-11 flex items-center justify-center rounded-2xl transition-all relative',
                  isListening
                    ? 'bg-red-500 text-white shadow-lg shadow-red-500/40'
                    : 'bg-slate-100 text-slate-400 hover:bg-slate-200 border border-slate-200'
                )}
              >
                {isListening && (
                  <motion.div
                    animate={{ scale: [1, 2], opacity: [0.4, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                    className="absolute inset-0 bg-red-400 rounded-2xl"
                  />
                )}
                {isListening ? <Waves className="h-5 w-5 relative z-10" /> : <Mic className="h-5 w-5" />}
              </motion.button>

              <motion.button
                id="chat-submit-btn"
                whileTap={{ scale: 0.95 }}
                type="submit"
                disabled={!input.trim() || isLoading}
                className="h-11 px-5 flex items-center gap-2 rounded-2xl bg-orange-500 text-white font-bold text-sm shadow-lg shadow-orange-500/25 hover:bg-orange-600 transition-all disabled:opacity-30 disabled:shadow-none"
              >
                <Send className="h-4 w-4" />
                <span className="hidden sm:block">Ask</span>
              </motion.button>
            </div>
          </form>

          <p className="text-center text-[10px] text-slate-300 font-medium mt-2">
            Auto-detects Hindi · Tamil · Telugu · Marathi · Bengali · Gujarati · Kannada + more
          </p>
        </div>
      </footer>
    </div>
  );
}
