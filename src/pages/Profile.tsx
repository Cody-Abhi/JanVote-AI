import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'motion/react';
import { User, Mail, Shield, Save, CheckCircle2, AlertCircle, Camera, BadgeCheck, MapPin } from 'lucide-react';
import { db, auth, handleFirestoreError, OperationType } from '../lib/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { updateProfile } from 'firebase/auth';

export default function Profile() {
  const { user, userProfile, updateUserProfile } = useAuth();
  const [formData, setFormData] = useState({
    displayName: '',
    phone: '',
    location: '',
    voterId: ''
  });
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    if (userProfile || user) {
      setFormData({
        displayName: userProfile?.displayName || user?.displayName || '',
        phone: userProfile?.phone || '',
        location: userProfile?.location || '',
        voterId: userProfile?.voterId || ''
      });
    }
  }, [userProfile, user]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsSaving(true);
    setMessage(null);

    try {
      // Update Firebase Auth Profile
      await updateProfile(user, {
        displayName: formData.displayName
      });

      // Update via Context (which updates Firestore and Local State)
      await updateUserProfile({
        displayName: formData.displayName,
        phone: formData.phone,
        location: formData.location,
        voterId: formData.voterId
      });

      setMessage({ type: 'success', text: 'Profile updated successfully!' });
    } catch (error) {
      console.error(error);
      setMessage({ type: 'error', text: 'Failed to update profile. Please try again.' });
    } finally {
      setIsSaving(false);
    }
  };

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="bg-orange-50 p-6 rounded-full mb-6">
          <Shield className="h-12 w-12 text-[#FF6500]" />
        </div>
        <h2 className="text-2xl font-display font-bold mb-2 text-[#0B0F2E]">Login Required</h2>
        <p className="text-slate-500 max-w-sm mb-6">Please log in to your account to view and manage your voter profile.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto pb-12">
      <div className="mb-8">
        <h2 className="text-3xl font-display font-bold text-[#0B0F2E] mb-2">My Profile</h2>
        <p className="text-slate-500 font-medium tracking-tight">Manage your account information and voting preferences</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-[32px] p-8 border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.08)] text-center sticky top-24"
          >
            <div className="relative inline-block mb-6">
              <div className="h-32 w-32 rounded-[2.5rem] overflow-hidden border-4 border-slate-50 shadow-inner group cursor-pointer relative">
                {user.photoURL ? (
                  <img src={user.photoURL} alt={user.displayName || 'User'} className="h-full w-full object-cover transition-transform group-hover:scale-110" />
                ) : (
                  <div className="h-full w-full bg-orange-50 flex items-center justify-center text-[#FF6500] text-4xl font-bold">
                    {formData.displayName?.[0] || user.email?.[0]?.toUpperCase()}
                  </div>
                )}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Camera className="text-white h-8 w-8" />
                </div>
              </div>
              <div className="absolute -bottom-2 -right-2 bg-[#0B0F2E] text-white p-2 rounded-xl shadow-[0_4px_14px_rgba(11,15,46,0.3)] border-2 border-white">
                <BadgeCheck className="h-5 w-5" />
              </div>
            </div>

            <h3 className="text-xl font-black text-slate-900 mb-1">{formData.displayName}</h3>
            <p className="text-sm text-slate-500 font-medium mb-6">{user.email}</p>

            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-100">
                <Shield className="h-5 w-5 text-[#FF6500]" />
                <div className="text-left">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Status</div>
                  <div className="text-xs font-bold text-slate-700">Verified Citizen</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-100">
                <MapPin className="h-5 w-5 text-emerald-600" />
                <div className="text-left">
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Location</div>
                  <div className="text-xs font-bold text-slate-700">{formData.location || 'Not set'}</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Edit Form */}
        <div className="lg:col-span-2">
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-[32px] p-8 border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.08)]"
          >
            {message && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-4 rounded-2xl mb-8 flex items-center gap-3 ${
                  message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-red-50 text-red-700 border border-red-100'
                }`}
              >
                {message.type === 'success' ? <CheckCircle2 className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
                <span className="text-sm font-bold">{message.text}</span>
              </motion.div>
            )}

            <form onSubmit={handleSave} className="space-y-6">
              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input 
                      type="text" 
                      value={formData.displayName}
                      onChange={e => setFormData({...formData, displayName: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3.5 pl-12 pr-4 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-[#FF6500]/20 focus:border-[#FF6500] transition-all outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Email (Read Only)</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input 
                      type="email" 
                      value={user.email || ''} 
                      readOnly
                      className="w-full bg-slate-100 border border-slate-200 rounded-2xl py-3.5 pl-12 pr-4 text-sm font-bold text-slate-400 cursor-not-allowed outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Voter ID (EPIC)</label>
                  <input 
                    type="text" 
                    placeholder="Enter your EPIC number"
                    value={formData.voterId}
                    onChange={e => setFormData({...formData, voterId: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3.5 px-4 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-[#FF6500]/20 focus:border-[#FF6500] transition-all outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Mobile Number</label>
                  <input 
                    type="tel" 
                    placeholder="+91"
                    value={formData.phone}
                    onChange={e => setFormData({...formData, phone: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3.5 px-4 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-[#FF6500]/20 focus:border-[#FF6500] transition-all outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Constituency / Area</label>
                <div className="relative">
                   <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                   <input 
                    type="text" 
                    placeholder="e.g. Bangalore Central"
                    value={formData.location}
                    onChange={e => setFormData({...formData, location: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3.5 pl-12 pr-4 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-[#FF6500]/20 focus:border-[#FF6500] transition-all outline-none"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#FF6500] text-white px-8 py-4 rounded-2xl font-bold text-sm uppercase tracking-widest hover:bg-[#0B0F2E] shadow-[0_4px_14px_rgba(255,101,0,0.3)] hover:shadow-[0_8px_30px_rgba(11,15,46,0.3)] transition-all duration-300 disabled:opacity-50 active:scale-95"
                >
                  {isSaving ? (
                    <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <Save className="h-5 w-5" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
