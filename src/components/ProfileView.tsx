/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { 
  User, Calendar, MapPin, DollarSign, Users, Sparkles, 
  Map, LogOut, CheckCircle2, ChevronRight, Activity, Globe, Heart, ShieldAlert
} from 'lucide-react';

interface ProfileViewProps {
  userProfile: any;
  currentUser: any;
  onSignOut: () => void;
  onReplayOnboarding: () => void;
}

export default function ProfileView({ userProfile, currentUser, onSignOut, onReplayOnboarding }: ProfileViewProps) {
  const getCurrencySymbol = (code: string) => {
    if (code === 'INR') return '₹';
    if (code === 'EUR') return '€';
    if (code === 'GBP') return '£';
    return '$';
  };

  const symbol = getCurrencySymbol(userProfile.currency);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto w-full bg-white border border-[#e5e0d8] rounded-3xl p-6 sm:p-8 shadow-sm space-y-8"
      id="profile-view-frame"
    >
      {/* 1. Profile Core Banner Header */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-5 border-b border-[#e5e0d8]/60 pb-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left">
          <div className="w-16 h-16 rounded-full border border-[#d4a373] bg-[#fdf5ed]/60 p-0.5 flex items-center justify-center text-3xl shadow-inner font-mono font-black text-[#d4a373]">
            {userProfile.name.slice(0, 2).toUpperCase()}
          </div>
          <div className="space-y-1">
            <h2 className="text-2xl font-serif font-black text-slate-900 flex items-center gap-1.5 justify-center sm:justify-start">
              {userProfile.name}
              {currentUser?.isGuest && (
                <span className="text-[10px] font-mono uppercase bg-slate-100 text-slate-500 font-bold border rounded px-1.5 py-0.5">Guest</span>
              )}
            </h2>
            <div className="flex flex-wrap gap-1.5 justify-center sm:justify-start">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-[#fdf5ed] text-[#d4a373] border border-[#fdf5ed] rounded-full text-[10px] font-mono font-bold uppercase tracking-wider">
                <Sparkles className="w-3 h-3 animate-pulse" /> {userProfile.travelPersona}
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-full text-[10px] font-mono uppercase">
                {userProfile.companions} pace
              </span>
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={onReplayOnboarding}
            className="px-3 py-1.5 rounded-xl border border-[#e5e0d8] text-[11px] font-bold text-slate-600 hover:bg-[#faf9f6] transition-all"
          >
            Reset Persona Prefs
          </button>
          <button
            onClick={onSignOut}
            className="px-3.5 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 text-[11px] font-black tracking-wider uppercase transition-all flex items-center gap-1.5"
          >
            <LogOut className="w-3.5 h-3.5" /> Sign Out
          </button>
        </div>
      </div>

      {/* 2. Key Attribute Metadata Panels */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-[#faf9f6] border border-[#e5e0d8]/70 rounded-2xl space-y-0.5">
          <span className="text-[10px] text-slate-400 font-mono uppercase block">Home Base Basin</span>
          <span className="font-serif italic font-extrabold text-[#1a1a1a] flex items-center gap-1 text-sm">
            <MapPin className="w-3.5 h-3.5 text-[#d4a373]" /> {userProfile.homeCity}
          </span>
        </div>
        <div className="p-4 bg-[#faf9f6] border border-[#e5e0d8]/70 rounded-2xl space-y-0.5">
          <span className="text-[10px] text-slate-400 font-mono uppercase block">Date & Age Chrono</span>
          <span className="font-serif italic font-extrabold text-[#1a1a1a] flex items-center gap-1 text-sm">
            <Calendar className="w-3.5 h-3.5 text-[#d4a373]" /> {userProfile.dob}
          </span>
        </div>
        <div className="p-4 bg-[#faf9f6] border border-[#e5e0d8]/70 rounded-2xl space-y-0.5">
          <span className="text-[10px] text-slate-400 font-mono uppercase block">Currency Target</span>
          <span className="font-bold text-[#1a1a1a] font-mono text-sm uppercase flex items-center gap-1">
            <DollarSign className="w-3.5 h-3.5 text-[#d4a373]" /> {userProfile.currency} ({symbol})
          </span>
        </div>
        <div className="p-4 bg-[#faf9f6] border border-[#e5e0d8]/70 rounded-2xl space-y-0.5">
          <span className="text-[10px] text-slate-400 font-mono uppercase block">Mobility Tier</span>
          <span className="font-bold text-[#1a1a1a] text-sm flex items-center gap-1">
            <Activity className="w-3.5 h-3.5 text-[#d4a373]" /> {userProfile.mobility} Level
          </span>
        </div>
      </div>

      {/* 3. Splitting budgets graphic representation */}
      <div className="space-y-3 p-5 bg-[#fbfbf9] border border-[#e5e0d8] rounded-2xl">
        <div className="flex flex-col sm:flex-row justify-between items-baseline gap-1">
          <div>
            <span className="text-[10px] font-mono tracking-wider text-[#d4a373] uppercase font-black">
              calculated wallet profile
            </span>
            <h3 className="font-serif italic text-lg font-bold text-slate-800">
              Personalized Cost Allocation Split
            </h3>
          </div>
          <span className="text-xl font-mono font-black text-[#1a1a1a]">
            {symbol}{userProfile.dailyBudget} <span className="text-xs text-slate-400 font-normal">allocated daily</span>
          </span>
        </div>

        {/* Dynamic Graphic Split Bar */}
        <div>
          <div className="flex items-center w-full h-4.5 rounded-lg overflow-hidden text-[9px] font-mono font-black text-white text-center select-none shadow-sm">
            <div className="bg-slate-900 border-r border-white/20 h-full flex items-center justify-center" style={{ width: '40%' }}>Stay 40%</div>
            <div className="bg-[#d4a373] border-r border-white/10 h-full flex items-center justify-center" style={{ width: '25%' }}>Food 25%</div>
            <div className="bg-emerald-600 border-r border-white/10 h-full flex items-center justify-center" style={{ width: '15%' }}>Transport 15%</div>
            <div className="bg-purple-600 border-r border-white/10 h-full flex items-center justify-center" style={{ width: '15%' }}>Activities 15%</div>
            <div className="bg-amber-500 h-full flex items-center justify-center" style={{ width: '5%' }}>Shop 5%</div>
          </div>
          <p className="text-[10px] text-slate-400 mt-1.5 leading-normal">
            ⚙️ Calculated daily allowance details: {symbol}{Math.round(userProfile.dailyBudget * 0.4)} stay stay, {symbol}{Math.round(userProfile.dailyBudget * 0.25)} culinary budgets, {symbol}{Math.round(userProfile.dailyBudget * 0.15)} local transits, {symbol}{Math.round(userProfile.dailyBudget * 0.15)} excursions, {symbol}{Math.round(userProfile.dailyBudget * 0.05)} shopping.
          </p>
        </div>
      </div>

      {/* 4. Details lists */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
        
        {/* Lodging & Diet choices */}
        <div className="space-y-4">
          <div className="space-y-2">
            <h4 className="font-bold text-xs text-slate-500 font-mono uppercase tracking-wider">Accommodation Choices</h4>
            <div className="flex flex-wrap gap-1.5">
              {userProfile.accommodation.map((acc: string) => (
                <span key={acc} className="px-3 py-1 bg-white border border-[#e5e0d8] rounded-xl text-xs font-semibold text-slate-700">
                  🏠 {acc}
                </span>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-xs text-slate-500 font-mono uppercase tracking-wider">Food Habits & Restraints</h4>
            <div className="flex flex-wrap gap-1.5">
              {userProfile.foodPrefs.map((pref: string) => (
                <span key={pref} className="px-3 py-1 bg-[#fdf5ed] border border-[#fdf5ed] rounded-xl text-xs font-semibold text-[#d4a373]">
                  🥑 {pref}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Interests & Languages spoken list */}
        <div className="space-y-4">
          <div className="space-y-2">
            <h4 className="font-bold text-xs text-slate-500 font-mono uppercase tracking-wider">Core Selected Interests</h4>
            <div className="flex flex-wrap gap-1.5">
              {userProfile.interests.map((int: string) => (
                <span key={int} className="px-3 py-1 bg-purple-50 border border-purple-100 rounded-xl text-xs font-semibold text-purple-700">
                  📍 {int}
                </span>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-xs text-slate-500 font-mono uppercase tracking-wider">Spoken Languages Standard</h4>
            <div className="flex flex-wrap gap-1.5">
              {userProfile.languages.map((lang: string) => (
                <span key={lang} className="px-3 py-1 bg-slate-100 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 flex items-center gap-1">
                  <Globe className="w-3 h-3 text-slate-400" /> {lang}
                </span>
              ))}
            </div>
          </div>
        </div>

      </div>

    </motion.div>
  );
}
