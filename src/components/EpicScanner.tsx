import React, { useState, useRef } from 'react';
import { 
  Camera, 
  Upload, 
  X, 
  RefreshCw, 
  Check, 
  AlertCircle,
  CreditCard,
  User,
  MapPin,
  Building
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

interface EpicData {
  name: string;
  epicNumber: string;
  address: string;
  constituency: string;
  confidence?: number;
}

interface EpicScannerProps {
  onScanSuccess: (data: EpicData) => void;
  onClose: () => void;
}

export default function EpicScanner({ onScanSuccess, onClose }: EpicScannerProps) {
  const [step, setStep] = useState<'upload' | 'scanning' | 'result'>('upload');
  const [image, setImage] = useState<string | null>(null);
  const [scannedData, setScannedData] = useState<EpicData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      setImage(base64);
      processImage(base64.split(',')[1]);
    };
    reader.readAsDataURL(file);
  };

  const processImage = async (base64Data: string) => {
    setStep('scanning');
    setError(null);

    try {
      const response = await fetch('/api/scan-epic', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageData: base64Data })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Server responded with error ' + response.status }));
        throw new Error(errorData.error || 'Failed to scan image');
      }

      const data = await response.json();
      setScannedData(data);
      setStep('result');
    } catch (err: any) {
      console.error('Scan error:', err);
      setError(err.message || 'Failed to connect to the scanning service.');
      setStep('upload');
    }
  };

  const handleConfirm = () => {
    if (scannedData) {
      onScanSuccess(scannedData);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm"
    >
      <motion.div 
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-blue-600 text-white">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-white/20 flex items-center justify-center">
              <CreditCard className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-lg font-black tracking-tight leading-none">EPIC Card Scanner</h2>
              <p className="text-[10px] uppercase font-bold tracking-widest text-blue-200">AI-Powered Identity OCR</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="h-8 w-8 rounded-full hover:bg-white/10 flex items-center justify-center transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <AnimatePresence mode="wait">
            {step === 'upload' && (
              <motion.div 
                key="upload"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="space-y-6"
              >
                <div className="text-center space-y-2">
                  <p className="text-sm font-medium text-slate-600">
                    Upload a clear photo of your Voter ID (front side) to automatically find your polling booth.
                  </p>
                </div>

                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="aspect-[1.6/1] border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center gap-4 hover:border-blue-400 hover:bg-blue-50 transition-all cursor-pointer group group"
                >
                  <div className="h-16 w-16 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                    <Camera className="h-8 w-8 text-slate-400 group-hover:text-blue-500" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-bold text-slate-700">Click to capture or upload</p>
                    <p className="text-xs text-slate-400 mt-1">Supports JPG, PNG up to 10MB</p>
                  </div>
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleFileUpload} 
                    accept="image/*" 
                    className="hidden" 
                  />
                </div>

                {error && (
                  <div className="space-y-3">
                    <div className="flex items-start gap-3 p-4 bg-red-50 rounded-xl border border-red-100 text-red-600">
                      <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
                      <div className="space-y-1">
                        <p className="text-xs font-black uppercase tracking-wider">Scan Failed</p>
                        <p className="text-xs font-medium leading-relaxed">{error}</p>
                      </div>
                    </div>
                    <button 
                      onClick={onClose}
                      className="w-full py-3 rounded-xl border-2 border-slate-100 text-slate-500 text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all"
                    >
                      Enter Details Manually
                    </button>
                  </div>
                )}

                <div className="bg-amber-50 rounded-2xl p-4 border border-amber-100">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-amber-600 mb-2">Pro Tips</h4>
                  <ul className="text-[11px] font-bold text-amber-800/80 space-y-1.5">
                    <li className="flex items-center gap-2">
                      <Check className="h-3 w-3 text-amber-500" /> Use good lighting
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-3 w-3 text-amber-500" /> Keep the card flat and centered
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-3 w-3 text-amber-500" /> Ensure all text is legible
                    </li>
                  </ul>
                </div>
              </motion.div>
            )}

            {step === 'scanning' && (
              <motion.div 
                key="scanning"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-12 space-y-6"
              >
                <div className="relative">
                  <div className="h-24 w-24 rounded-3xl border-4 border-blue-100 flex items-center justify-center overflow-hidden">
                    {image && <img src={image} className="w-full h-full object-cover opacity-50" alt="Scanning" />}
                  </div>
                  <motion.div 
                    animate={{ top: ['0%', '100%', '0%'] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="absolute left-0 right-0 h-1 bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,1)] z-10"
                  />
                </div>
                <div className="text-center">
                  <h3 className="text-lg font-black text-slate-800 mb-1 flex items-center justify-center gap-2">
                    <RefreshCw className="h-5 w-5 animate-spin text-blue-600" />
                    Scanning Card...
                  </h3>
                  <p className="text-sm font-medium text-slate-500 animate-pulse">Extracting identity details using AI OCR</p>
                </div>
              </motion.div>
            )}

            {step === 'result' && scannedData && (
              <motion.div 
                key="result"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between mb-4">
                   <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Extracted Information</h3>
                   {scannedData.confidence && (
                     <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded-md text-[9px] font-black uppercase tracking-widest">
                       {Math.round(scannedData.confidence * 100)}% Match Confidence
                     </span>
                   )}
                </div>

                <div className="space-y-3">
                  <DataField icon={User} label="Voter Name" value={scannedData.name} />
                  <DataField icon={CreditCard} label="EPIC Number" value={scannedData.epicNumber} />
                  <DataField icon={Building} label="Constituency" value={scannedData.constituency} />
                  <DataField icon={MapPin} label="Address" value={scannedData.address} isLong />
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <p className="text-[10px] font-bold text-slate-400 leading-relaxed italic">
                    Note: If any information is incorrect, you can manually search by location or Voter ID in the main search bar.
                  </p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <button 
                    onClick={() => setStep('upload')}
                    className="py-4 rounded-2xl border-2 border-slate-100 font-black uppercase tracking-widest text-xs text-slate-500 hover:bg-slate-50 transition-all"
                  >
                    Rescan
                  </button>
                  <button 
                    onClick={handleConfirm}
                    className="py-4 rounded-2xl bg-blue-600 text-white font-black uppercase tracking-widest text-xs shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
                  >
                    Confirm & Locate <Check className="h-4 w-4" />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
}

interface DataFieldProps {
  icon: any;
  label: string;
  value: string;
  isLong?: boolean;
}

function DataField({ icon: Icon, label, value, isLong }: DataFieldProps) {
  return (
    <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl flex items-center gap-4 transition-all hover:bg-white hover:border-blue-200 group">
      <div className="h-10 w-10 shrink-0 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 group-hover:text-blue-500 group-hover:border-blue-100 transition-all shadow-sm">
        <Icon className="h-5 w-5" />
      </div>
      <div className="flex-1 overflow-hidden">
        <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 block mb-0.5">{label}</span>
        <p className={cn(
          "text-sm font-bold text-slate-700 overflow-hidden text-ellipsis whitespace-nowrap",
          isLong && "whitespace-normal line-clamp-2"
        )}>
          {value || "Not detected"}
        </p>
      </div>
    </div>
  );
}
