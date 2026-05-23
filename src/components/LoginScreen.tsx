/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Compass, Mail, Lock, User, Sparkles, LogIn, AlertCircle } from 'lucide-react';

interface LoginScreenProps {
  onSuccess: (user: any) => void;
  showToast: (msg: string, type: 'success' | 'error') => void;
}

export default function LoginScreen({ onSuccess, showToast }: LoginScreenProps) {
  const [tab, setTab] = useState<'signin' | 'signup'>('signin');
  
  // Sign In inputs
  const [signInEmail, setSignInEmail] = useState('');
  const [signInPassword, setSignInPassword] = useState('');

  // Sign Up inputs
  const [signUpName, setSignUpName] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [signUpConfirm, setSignUpConfirm] = useState('');

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!signInEmail || !signInPassword) {
      showToast('Please fill in all sign-in fields.', 'error');
      return;
    }

    const savedUsersStr = localStorage.getItem('users');
    const users = savedUsersStr ? JSON.parse(savedUsersStr) : [];
    
    const matchedUser = users.find(
      (u: any) => u.email.toLowerCase() === signInEmail.toLowerCase() && u.password === signInPassword
    );

    if (matchedUser) {
      localStorage.setItem('currentUser', JSON.stringify({ name: matchedUser.name, email: matchedUser.email }));
      showToast(`Welcome back, ${matchedUser.name}!`, 'success');
      onSuccess({ name: matchedUser.name, email: matchedUser.email });
    } else {
      showToast('Invalid email address or passcode mismatch.', 'error');
    }
  };

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!signUpName || !signUpEmail || !signUpPassword || !signUpConfirm) {
      showToast('Please complete all sign-up fields.', 'error');
      return;
    }

    if (signUpPassword !== signUpConfirm) {
      showToast('Passwords do not match.', 'error');
      return;
    }

    const savedUsersStr = localStorage.getItem('users');
    const users = savedUsersStr ? JSON.parse(savedUsersStr) : [];

    const alreadyExists = users.some(
      (u: any) => u.email.toLowerCase() === signUpEmail.toLowerCase()
    );

    if (alreadyExists) {
      showToast('This email is already registered.', 'error');
      return;
    }

    const newUser = {
      name: signUpName.trim(),
      email: signUpEmail.trim().toLowerCase(),
      password: signUpPassword
    };

    localStorage.setItem('users', JSON.stringify([...users, newUser]));
    localStorage.setItem('currentUser', JSON.stringify({ name: newUser.name, email: newUser.email }));
    
    showToast('Account initialized successfully!', 'success');
    onSuccess({ name: newUser.name, email: newUser.email });
  };

  const handleGuest = () => {
    const guestUser = {
      name: 'Guest Traveller',
      email: 'guest@wanderwise.com',
      isGuest: true
    };
    localStorage.setItem('currentUser', JSON.stringify(guestUser));
    showToast('Continuing anonymously as Guest.', 'success');
    onSuccess(guestUser);
  };

  return (
    <div className="absolute inset-0 bg-[#fdfaf6] bg-opacity-95 backdrop-blur-md flex items-center justify-center p-4 z-50">
      
      {/* Decorative vectors mimicking existing design traits */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-[#fbe7d5]/40 rounded-full filter blur-3xl -z-10 animate-pulse pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-emerald-50/40 rounded-full filter blur-3xl -z-10 pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white border border-[#e5e0d8] rounded-3xl shadow-xl overflow-hidden shadow-slate-200/50 p-6 sm:p-8 space-y-6"
      >
        
        {/* Logo & Headline Branding block */}
        <div className="text-center space-y-1">
          <div className="w-11 h-11 bg-[#d4a373] rounded-full flex items-center justify-center text-white mx-auto shadow-inner mb-3">
            <Compass className="w-6 h-6" />
          </div>
          <h1 className="text-3xl font-serif font-extrabold italic tracking-tight text-[#1a1a1a]">
            WanderWise
          </h1>
          <p className="text-[11px] tracking-widest uppercase font-mono text-[#d4a373] font-bold">
            Your AI Travel Companion
          </p>
        </div>

        {/* Auth Tabs selectors */}
        <div className="grid grid-cols-2 p-1 bg-[#f5f2ed] rounded-xl border border-[#e5e0d8]/60">
          <button
            onClick={() => setTab('signin')}
            className={`py-2 text-xs font-bold rounded-lg transition-all ${
              tab === 'signin' 
                ? 'bg-white text-[#1a1a1a] shadow-sm font-black' 
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => setTab('signup')}
            className={`py-2 text-xs font-bold rounded-lg transition-all ${
              tab === 'signup' 
                ? 'bg-white text-[#1a1a1a] shadow-sm font-black' 
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* Tab contents forms */}
        <AnimatePresence mode="wait">
          {tab === 'signin' ? (
            <motion.form
              key="signin-form"
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 6 }}
              onSubmit={handleSignIn}
              className="space-y-4"
            >
              <div className="space-y-3">
                {/* Email address input */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 font-mono uppercase tracking-wider block">Email Address</label>
                  <div className="relative">
                    <input
                      type="email"
                      required
                      value={signInEmail}
                      onChange={(e) => setSignInEmail(e.target.value)}
                      placeholder="e.g. wanderer@example.com"
                      className="w-full bg-[#faf9f6] border border-[#e5e0d8] rounded-xl pl-10 pr-4 py-3 text-xs focus:outline-none focus:ring-1 focus:ring-[#d4a373] text-slate-800"
                    />
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  </div>
                </div>

                {/* Password field */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 font-mono uppercase tracking-wider block">Secret Password</label>
                  <div className="relative">
                    <input
                      type="password"
                      required
                      value={signInPassword}
                      onChange={(e) => setSignInPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-[#faf9f6] border border-[#e5e0d8] rounded-xl pl-10 pr-4 py-3 text-xs focus:outline-none focus:ring-1 focus:ring-[#d4a373] text-slate-800"
                    />
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#1a1a1a] hover:bg-[#d4a373] text-white text-xs font-bold rounded-xl tracking-wider uppercase transition-all shadow-md mt-2 flex items-center justify-center gap-1.5"
              >
                <LogIn className="w-4 h-4" /> Enter Atelier
              </button>
            </motion.form>
          ) : (
            <motion.form
              key="signup-form"
              initial={{ opacity: 0, x: 6 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -6 }}
              onSubmit={handleSignUp}
              className="space-y-4"
            >
              <div className="space-y-3">
                {/* Full name field */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 font-mono uppercase tracking-wider block">Full Name</label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={signUpName}
                      onChange={(e) => setSignUpName(e.target.value)}
                      placeholder="e.g. Alan Rickman"
                      className="w-full bg-[#faf9f6] border border-[#e5e0d8] rounded-xl pl-10 pr-4 py-3 text-xs focus:outline-none focus:ring-1 focus:ring-[#d4a373] text-slate-800"
                    />
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  </div>
                </div>

                {/* Email address field */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 font-mono uppercase tracking-wider block">Email Address</label>
                  <div className="relative">
                    <input
                      type="email"
                      required
                      value={signUpEmail}
                      onChange={(e) => setSignUpEmail(e.target.value)}
                      placeholder="e.g. wanderer@example.com"
                      className="w-full bg-[#faf9f6] border border-[#e5e0d8] rounded-xl pl-10 pr-4 py-3 text-xs focus:outline-none focus:ring-1 focus:ring-[#d4a373] text-slate-800"
                    />
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  </div>
                </div>

                {/* Password field */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 font-mono uppercase tracking-wider block">Secret Password</label>
                  <div className="relative">
                    <input
                      type="password"
                      required
                      value={signUpPassword}
                      onChange={(e) => setSignUpPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-[#faf9f6] border border-[#e5e0d8] rounded-xl pl-10 pr-4 py-3 text-xs focus:outline-none focus:ring-1 focus:ring-[#d4a373] text-slate-800"
                    />
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  </div>
                </div>

                {/* Confirm password field */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 font-mono uppercase tracking-wider block">Confirm Password</label>
                  <div className="relative">
                    <input
                      type="password"
                      required
                      value={signUpConfirm}
                      onChange={(e) => setSignUpConfirm(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-[#faf9f6] border border-[#e5e0d8] rounded-xl pl-10 pr-4 py-3 text-xs focus:outline-none focus:ring-1 focus:ring-[#d4a373] text-slate-800"
                    />
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#1a1a1a] hover:bg-[#d4a373] text-white text-xs font-bold rounded-xl tracking-wider uppercase transition-all shadow-md mt-2 flex items-center justify-center gap-1.5"
              >
                <Sparkles className="w-4 h-4 text-[#d4a373]" /> Register & Create Profile
              </button>
            </motion.form>
          )}
        </AnimatePresence>

        {/* Elegant divider */}
        <div className="relative flex items-center justify-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[#e5e0d8]/70" />
          </div>
          <span className="relative bg-white px-4 text-[10px] font-mono font-bold text-slate-400 uppercase">
            or
          </span>
        </div>

        {/* Continue as Guest */}
        <button
          onClick={handleGuest}
          className="w-full py-3 border border-[#e5e0d8] hover:border-[#1a1a1a] bg-white text-xs font-bold rounded-xl text-slate-700 hover:text-[#1a1a1a] tracking-wider transition-all shadow-sm flex items-center justify-center gap-1.5"
        >
          Continue as Guest
        </button>

      </motion.div>
    </div>
  );
}
