/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Compass, Calendar, MapPin, DollarSign, Users, Sparkles, 
  ArrowRight, ArrowLeft, Heart, Check, HelpCircle, Laptop,
  Activity, Star, Globe, Info, Award
} from 'lucide-react';

interface OnboardingProps {
  userName: string;
  onComplete: (profile: any) => void;
}

const CITY_SUGGESTIONS = [
  'Mumbai', 'Delhi', 'Bengaluru', 'New York', 'London', 'Tokyo', 'Paris', 'Sydney'
];

const CURRENCIES = [
  { code: 'INR', symbol: '₹' },
  { code: 'USD', symbol: '$' },
  { code: 'EUR', symbol: '€' },
  { code: 'GBP', symbol: '£' }
];

const TRAVEL_STYLES = [
  { key: 'Adventure', name: 'Adventure', emoji: '🧗', desc: 'Climb peaks, seek thrills, and conquer wild treks.' },
  { key: 'Relaxation', name: 'Relaxation', emoji: '🏖️', desc: 'Laze by crystal beaches, slow tea sips, and deep breathers.' },
  { key: 'Cultural', name: 'Cultural', emoji: '🏛️', desc: 'Wander ancient paths, local museums, and historic streets.' },
  { key: 'Foodie', name: 'Foodie', emoji: '🍜', desc: 'Savor street feasts, elite cafés, and culinary secrets.' },
  { key: 'Backpacker', name: 'Backpacker', emoji: '🎒', desc: 'High autonomy, raw routes, and community hostels.' },
  { key: 'Luxury', name: 'Luxury', emoji: '👑', desc: 'First-class lounges, elite stays, and tailored comfort.' }
];

const TRIP_DURATIONS = [
  { key: 'Weekend', label: 'Weekend' },
  { key: '1 week', label: '1 Week' },
  { key: '2 weeks', label: '2 Weeks' },
  { key: '1 month+', label: '1 Month+' }
];

const BUDGET_TIERS = [
  { key: 'Budget', label: 'Budget', desc: 'Raw, clever savings', emoji: '💸' },
  { key: 'Mid-range', label: 'Mid-range', desc: 'Balanced lifestyle comfort', emoji: '💼' },
  { key: 'Luxury', label: 'Luxury', desc: 'Elite high-end premium', emoji: '💎' }
];

const ACCOMMODATIONS = ['Hostel', 'Hotel', 'Airbnb', 'Resort', 'Homestay'];

const COMPANIONS = [
  { key: 'Solo', emoji: '🧭' },
  { key: 'Couple', emoji: '💑' },
  { key: 'Family', emoji: '👨‍👩‍👧‍👦' },
  { key: 'Friends', emoji: '🎉' }
];

const FOOD_PREFS = ['No Preference', 'Vegetarian', 'Vegan', 'Halal', 'Kosher', 'Gluten-Free'];

const INTEREST_CHIPS = ['Beaches', 'Mountains', 'History', 'Nightlife', 'Food', 'Shopping', 'Wildlife', 'Adventure Sports'];

const LANGUAGES = ['English', 'Hindi', 'Spanish', 'French', 'German', 'Japanese', 'Chinese', 'Arabic'];

export default function Onboarding({ userName, onComplete }: OnboardingProps) {
  const [step, setStep] = useState<number>(1);
  const [name, setName] = useState<string>(userName || 'Guest Traveller');
  const [dob, setDob] = useState<string>('2000-01-01');
  const [homeCity, setHomeCity] = useState<string>('');
  const [currency, setCurrency] = useState<string>('USD');

  // Step 2
  const [travelStyle, setTravelStyle] = useState<string>('Cultural');
  const [tripDuration, setTripDuration] = useState<string>('1 week');

  // Step 3
  const [budgetTier, setBudgetTier] = useState<string>('Mid-range');
  const [selectedAccommodation, setSelectedAccommodation] = useState<string[]>(['Hotel']);
  const [companions, setCompanions] = useState<string>('Solo');

  // Step 4
  const [selectedFoodPrefs, setSelectedFoodPrefs] = useState<string[]>(['No Preference']);
  const [selectedInterests, setSelectedInterests] = useState<string[]>(['Food', 'History']);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>(['English']);
  const [mobility, setMobility] = useState<string>('Moderate');

  // Show summary card before finishing
  const [showSummary, setShowSummary] = useState<boolean>(false);

  const toggleAccommodation = (acc: string) => {
    if (selectedAccommodation.includes(acc)) {
      setSelectedAccommodation(selectedAccommodation.filter(a => a !== acc));
    } else {
      setSelectedAccommodation([...selectedAccommodation, acc]);
    }
  };

  const toggleFoodPref = (pref: string) => {
    if (pref === 'No Preference') {
      setSelectedFoodPrefs(['No Preference']);
      return;
    }
    const filtered = selectedFoodPrefs.filter(p => p !== 'No Preference');
    if (filtered.includes(pref)) {
      setSelectedFoodPrefs(filtered.filter(p => p !== pref).length === 0 ? ['No Preference'] : filtered.filter(p => p !== pref));
    } else {
      setSelectedFoodPrefs([...filtered, pref]);
    }
  };

  const toggleInterest = (interest: string) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(selectedInterests.filter(i => i !== interest));
    } else {
      setSelectedInterests([...selectedInterests, interest]);
    }
  };

  const toggleLanguage = (lang: string) => {
    if (selectedLanguages.includes(lang)) {
      setSelectedLanguages(selectedLanguages.filter(l => l !== lang));
    } else {
      setSelectedLanguages([...selectedLanguages, lang]);
    }
  };

  const getCurrencySymbol = () => {
    return CURRENCIES.find(c => c.code === currency)?.symbol || '$';
  };

  // Get daily spend amount based on budget tier & currency representation
  const getDailyHint = (tier: string) => {
    const symbol = getCurrencySymbol();
    if (currency === 'INR') {
      if (tier === 'Budget') return `${symbol}1,500 / day`;
      if (tier === 'Mid-range') return `${symbol}6,000 / day`;
      return `${symbol}25,000 / day`;
    }
    if (currency === 'EUR') {
      if (tier === 'Budget') return `${symbol}35 / day`;
      if (tier === 'Mid-range') return `${symbol}140 / day`;
      return `${symbol}550 / day`;
    }
    if (currency === 'GBP') {
      if (tier === 'Budget') return `${symbol}30 / day`;
      if (tier === 'Mid-range') return `${symbol}120 / day`;
      return `${symbol}480 / day`;
    }
    // Default USD
    if (tier === 'Budget') return `${symbol}40 / day`;
    if (tier === 'Mid-range') return `${symbol}150 / day`;
    return `${symbol}600 / day`;
  };

  // Calculate profile metrics on complete
  const handleCalculateAndFinish = () => {
    // travelPersona = e.g., "Cultural Mid-range Explorer" or "Backpacker Budget Adventurer"
    const travelPersona = `${travelStyle} ${budgetTier} Explorer`;
    
    // Numeric value for daily budget helper
    let dailyBudget = 150;
    if (currency === 'INR') {
      if (budgetTier === 'Budget') dailyBudget = 1500;
      else if (budgetTier === 'Mid-range') dailyBudget = 6000;
      else dailyBudget = 25000;
    } else if (currency === 'EUR') {
      if (budgetTier === 'Budget') dailyBudget = 35;
      else if (budgetTier === 'Mid-range') dailyBudget = 140;
      else dailyBudget = 550;
    } else if (currency === 'GBP') {
      if (budgetTier === 'Budget') dailyBudget = 30;
      else if (budgetTier === 'Mid-range') dailyBudget = 120;
      else dailyBudget = 480;
    } else {
      if (budgetTier === 'Budget') dailyBudget = 40;
      else if (budgetTier === 'Mid-range') dailyBudget = 150;
      else dailyBudget = 600;
    }

    const budgetSplit = { stay: 40, food: 25, transport: 15, activities: 15, shopping: 5 };

    const profile = {
      name: name || 'Guest Traveller',
      dob,
      homeCity: homeCity || 'Discovery Capital',
      currency,
      travelStyle,
      tripDuration,
      budgetTier,
      accommodation: selectedAccommodation,
      companions,
      foodPrefs: selectedFoodPrefs,
      interests: selectedInterests,
      languages: selectedLanguages,
      mobility,
      travelPersona,
      dailyBudget,
      budgetSplit
    };

    setShowSummary(true);
  };

  const handleStartExploring = () => {
    // Create final profile object
    const travelPersona = `${travelStyle} ${budgetTier} Explorer`;
    let dailyBudget = 150;
    if (currency === 'INR') {
      if (budgetTier === 'Budget') dailyBudget = 1500;
      else if (budgetTier === 'Mid-range') dailyBudget = 6000;
      else dailyBudget = 25000;
    } else if (currency === 'EUR') {
      if (budgetTier === 'Budget') dailyBudget = 35;
      else if (budgetTier === 'Mid-range') dailyBudget = 140;
      else dailyBudget = 550;
    } else if (currency === 'GBP') {
      if (budgetTier === 'Budget') dailyBudget = 30;
      else if (budgetTier === 'Mid-range') dailyBudget = 120;
      else dailyBudget = 480;
    } else {
      if (budgetTier === 'Budget') dailyBudget = 40;
      else if (budgetTier === 'Mid-range') dailyBudget = 150;
      else dailyBudget = 600;
    }

    const budgetSplit = { stay: 40, food: 25, transport: 15, activities: 15, shopping: 5 };

    const profile = {
      name: name || 'Guest Traveller',
      dob,
      homeCity: homeCity || 'Discovery Capital',
      currency,
      travelStyle,
      tripDuration,
      budgetTier,
      accommodation: selectedAccommodation,
      companions,
      foodPrefs: selectedFoodPrefs,
      interests: selectedInterests,
      languages: selectedLanguages,
      mobility,
      travelPersona,
      dailyBudget,
      budgetSplit
    };

    onComplete(profile);
  };

  const nextStep = () => {
    if (step < 4) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  return (
    <div className="min-h-[620px] flex flex-col justify-between p-6 sm:p-8 relative bg-white" id="onboarding-wizard-frame">
      
      {!showSummary ? (
        <>
          {/* Progress Indicator Header */}
          <div className="w-full mb-6">
            <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-widest text-[#7a736a] font-bold mb-2.5">
              <span className="flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-[#d4a373] animate-pulse" />
                Step {step} of 4
              </span>
              <span>{Math.round((step / 4) * 100)}% Complete</span>
            </div>
            {/* Elegant multi-segment bar */}
            <div className="grid grid-cols-4 gap-1.5 h-1.5 w-full bg-[#f5f2ed] rounded-full overflow-hidden">
              <div className={`h-full rounded-full transition-all duration-300 ${step >= 1 ? 'bg-[#d4a373]' : 'bg-transparent'}`} />
              <div className={`h-full rounded-full transition-all duration-300 ${step >= 2 ? 'bg-[#d4a373]' : 'bg-transparent'}`} />
              <div className={`h-full rounded-full transition-all duration-300 ${step >= 3 ? 'bg-[#d4a373]' : 'bg-transparent'}`} />
              <div className={`h-full rounded-full transition-all duration-300 ${step >= 4 ? 'bg-[#d4a373]' : 'bg-transparent'}`} />
            </div>
          </div>

          <div className="flex-grow flex flex-col justify-center">
            <AnimatePresence mode="wait">
              {/* STEP 1: BASICS */}
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="space-y-4"
                >
                  <div>
                    <h3 className="text-xl font-serif italic text-slate-800 font-bold mb-1">Let’s map the basics</h3>
                    <p className="text-xs text-slate-400">Tell us details about your home base and currency settings.</p>
                  </div>

                  <div className="space-y-3.5 pt-2">
                    {/* Full Name */}
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 font-mono uppercase">Your Full Name</label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Traveler Name"
                        className="w-full bg-[#faf9f6]/70 border border-[#e5e0d8] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#d4a373]"
                      />
                    </div>

                    {/* DOB */}
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 font-mono uppercase">Date of Birth</label>
                      <input
                        type="date"
                        value={dob}
                        onChange={(e) => setDob(e.target.value)}
                        className="w-full bg-[#faf9f6]/70 border border-[#e5e0d8] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#d4a373]"
                      />
                    </div>

                    {/* Home City with suggestions */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-500 font-mono uppercase">Home City</label>
                      <input
                        type="text"
                        value={homeCity}
                        onChange={(e) => setHomeCity(e.target.value)}
                        placeholder="E.g., Mumbai, New York"
                        className="w-full bg-[#faf9f6]/70 border border-[#e5e0d8] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#d4a373]"
                      />
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {CITY_SUGGESTIONS.map((city) => (
                          <button
                            key={city}
                            type="button"
                            onClick={() => setHomeCity(city)}
                            className={`text-[11px] px-2.5 py-1 rounded-lg border transition-all ${
                              homeCity === city 
                                ? 'bg-[#d4a373] text-white border-[#d4a373] font-bold' 
                                : 'bg-white hover:bg-[#faf9f6] border-[#e5e0d8] text-slate-500'
                            }`}
                          >
                            {city}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Preferred Currency Segment */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-500 font-mono uppercase block">Preferred Currency</label>
                      <div className="grid grid-cols-4 gap-2">
                        {CURRENCIES.map((curr) => (
                          <button
                            key={curr.code}
                            type="button"
                            onClick={() => setCurrency(curr.code)}
                            className={`py-2.5 rounded-xl border flex flex-col items-center justify-center transition-all ${
                              currency === curr.code
                                ? 'border-[#d4a373] bg-[#fdf5ed]/60 text-[#1a1a1a] font-bold shadow-sm'
                                : 'border-[#e5e0d8] text-slate-400 bg-white hover:bg-slate-50'
                            }`}
                          >
                            <span className="text-sm font-mono font-bold">{curr.symbol}</span>
                            <span className="text-[10px] font-mono font-medium">{curr.code}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                  </div>
                </motion.div>
              )}

              {/* STEP 2: TRAVEL STYLE */}
              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="space-y-4"
                >
                  <div>
                    <h3 className="text-xl font-serif italic text-slate-800 font-bold mb-1">Pick your style & tempo</h3>
                    <p className="text-xs text-slate-400">Match active trip motifs and standard duration preference tags.</p>
                  </div>

                  <div className="space-y-4 pt-2">
                    {/* Travel Style Picking Cards */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-500 font-mono uppercase block">Travel Style (Pick One)</label>
                      <div className="grid grid-cols-2 gap-2 max-h-[250px] overflow-y-auto pr-1">
                        {TRAVEL_STYLES.map((style) => (
                          <button
                            key={style.key}
                            type="button"
                            onClick={() => setTravelStyle(style.key)}
                            className={`p-3 text-left border rounded-xl transition-all flex gap-3 items-start ${
                              travelStyle === style.key
                                ? 'border-[#d4a373] bg-[#fdf5ed]/40'
                                : 'border-[#e5e0d8]/80 bg-white hover:border-[#d4a373]/50'
                            }`}
                          >
                            <span className="text-2xl mt-0.5">{style.emoji}</span>
                            <div>
                              <span className="block text-xs font-bold text-slate-800">{style.name}</span>
                              <span className="block text-[10px] text-slate-400 leading-normal mt-0.5">{style.desc}</span>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Preferred Trip Duration */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-500 font-mono uppercase block">Preferred Trip Duration</label>
                      <div className="grid grid-cols-4 gap-2">
                        {TRIP_DURATIONS.map((dur) => (
                          <button
                            key={dur.key}
                            type="button"
                            onClick={() => setTripDuration(dur.key)}
                            className={`py-2 text-xs font-bold rounded-xl border transition-all ${
                              tripDuration === dur.key
                                ? 'border-[#d4a373] bg-[#d4a373] text-white shadow-sm'
                                : 'border-[#e5e0d8] text-slate-500 bg-white hover:bg-slate-50'
                            }`}
                          >
                            {dur.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* STEP 3: BUDGET & STAY */}
              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="space-y-4"
                >
                  <div>
                    <h3 className="text-xl font-serif italic text-slate-800 font-bold mb-1">Exquisite budget & stays</h3>
                    <p className="text-xs text-slate-400">Control budget tiers, lodging categories, and companions profiles.</p>
                  </div>

                  <div className="space-y-4 pt-2">
                    {/* Budget Tiers selection (cards) */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-500 font-mono uppercase block">Budget Tier (Pick One)</label>
                      <div className="grid grid-cols-3 gap-2">
                        {BUDGET_TIERS.map((tier) => (
                          <button
                            key={tier.key}
                            type="button"
                            onClick={() => setBudgetTier(tier.key)}
                            className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center justify-between ${
                              budgetTier === tier.key
                                ? 'border-[#d4a373] bg-[#fdf5ed]/40'
                                : 'border-[#e5e0d8] bg-white hover:bg-slate-50'
                            }`}
                          >
                            <span className="text-xl">{tier.emoji}</span>
                            <span className="block text-xs font-bold text-slate-800 mt-1">{tier.label}</span>
                            <span className="block text-[9px] text-[#d4a373] font-mono mt-1 tracking-tight font-black leading-none">
                              {getDailyHint(tier.key)}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Accommodation multiselect chips */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-500 font-mono uppercase block">Accommodation preferences (Multi-select)</label>
                      <div className="flex flex-wrap gap-1.5">
                        {ACCOMMODATIONS.map((acc) => {
                          const active = selectedAccommodation.includes(acc);
                          return (
                            <button
                              key={acc}
                              type="button"
                              onClick={() => toggleAccommodation(acc)}
                              className={`text-xs px-3 py-2 rounded-xl border transition-all flex items-center gap-1 ${
                                active
                                  ? 'bg-[#1a1a1a] text-white border-[#1a1a1a]'
                                  : 'bg-white text-slate-500 border-[#e5e0d8] hover:bg-slate-50'
                              }`}
                            >
                              {active && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                              <span>{acc}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Travel Companions Toggle */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-500 font-mono uppercase block">Travel Companions Profile</label>
                      <div className="grid grid-cols-4 gap-2">
                        {COMPANIONS.map((comp) => (
                          <button
                            key={comp.key}
                            type="button"
                            onClick={() => setCompanions(comp.key)}
                            className={`p-2.5 rounded-xl border text-center transition-all flex flex-col items-center ${
                              companions === comp.key
                                ? 'border-[#d4a373] bg-[#fdf5ed]/40'
                                : 'border-[#e5e0d8] bg-white hover:bg-slate-50'
                            }`}
                          >
                            <span className="text-xl">{comp.emoji}</span>
                            <span className="block text-[10px] font-bold text-slate-700 mt-0.5">{comp.key}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                  </div>
                </motion.div>
              )}

              {/* STEP 4: PREFERENCES & RESTRICTIONS */}
              {step === 4 && (
                <motion.div
                  key="step4"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="space-y-4"
                >
                  <div>
                    <h3 className="text-xl font-serif italic text-slate-800 font-bold mb-1">Cuisine & custom restraints</h3>
                    <p className="text-xs text-slate-400">Lock in diet guidelines, languages spoken, and mobility thresholds.</p>
                  </div>

                  <div className="space-y-3.5 pt-2 max-h-[360px] overflow-y-auto pr-1">
                    {/* Food preferences chips */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-500 font-mono uppercase block">Food Preference (Chips)</label>
                      <div className="flex flex-wrap gap-1.5">
                        {FOOD_PREFS.map((f) => {
                          const active = selectedFoodPrefs.includes(f);
                          return (
                            <button
                              key={f}
                              type="button"
                              onClick={() => toggleFoodPref(f)}
                              className={`text-[11px] px-2.5 py-1.5 rounded-lg border transition-all ${
                                active
                                  ? 'bg-[#d4a373] text-white border-[#d4a373]'
                                  : 'bg-white text-slate-500 border-[#e5e0d8] hover:bg-slate-50'
                              }`}
                            >
                              {f}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Interest Chips */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-500 font-mono uppercase block">Core Interests (Multi-select)</label>
                      <div className="flex flex-wrap gap-1.5">
                        {INTEREST_CHIPS.map((interest) => {
                          const active = selectedInterests.includes(interest);
                          return (
                            <button
                              key={interest}
                              type="button"
                              onClick={() => toggleInterest(interest)}
                              className={`text-[11px] px-2.5 py-1.5 rounded-lg border transition-all ${
                                active
                                  ? 'bg-purple-600 text-white border-purple-600'
                                  : 'bg-white text-slate-500 border-[#e5e0d8] hover:bg-slate-50'
                              }`}
                            >
                              {interest}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Languages Chips */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-500 font-mono uppercase block">Languages Spoken</label>
                      <div className="flex flex-wrap gap-1.5">
                        {LANGUAGES.map((lang) => {
                          const active = selectedLanguages.includes(lang);
                          return (
                            <button
                              key={lang}
                              type="button"
                              onClick={() => toggleLanguage(lang)}
                              className={`text-[11px] px-2.5 py-1.5 rounded-lg border transition-all ${
                                active
                                  ? 'bg-[#1a1a1a] text-white border-[#1a1a1a]'
                                  : 'bg-white text-slate-500 border-[#e5e0d8] hover:bg-slate-50'
                              }`}
                            >
                              {lang}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Mobility slider button toggler */}
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 font-mono uppercase block">Mobility Level Selection</label>
                      <div className="grid grid-cols-3 gap-2">
                        {['Low', 'Moderate', 'High'].map((lvl) => (
                          <button
                            key={lvl}
                            type="button"
                            onClick={() => setMobility(lvl)}
                            className={`py-2 text-xs font-bold rounded-xl border transition-all ${
                              mobility === lvl
                                ? 'border-[#d4a373] bg-[#fdf5ed] text-[#1a1a1a]'
                                : 'border-[#e5e0d8] text-slate-400 bg-white hover:bg-slate-50'
                            }`}
                          >
                            {lvl} Level
                          </button>
                        ))}
                      </div>
                      <p className="text-[10px] text-slate-400 mt-1 italic leading-normal">
                        {mobility === 'Low' && "⚖️ Ideal for minimal walking, accessible lifts, and vehicle-first sightseeing."}
                        {mobility === 'Moderate' && "🚶 Cozy urban streets walk, temple stone stairs hikes, and regular transit."}
                        {mobility === 'High' && "⛰️ Heavy hikes, bicycle exploration, vertical stairwells, and all-day trekking active paces."}
                      </p>
                    </div>

                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Action Step Controls Footer */}
          <div className="flex items-center justify-between border-t border-[#e5e0d8] pt-4 mt-6">
            <button
              type="button"
              onClick={prevStep}
              disabled={step === 1}
              className={`text-xs font-bold px-4 py-2 rounded-xl transition-all ${
                step === 1 ? 'text-slate-300 cursor-not-allowed' : 'text-slate-500 hover:bg-slate-100'
              }`}
            >
              Back
            </button>

            {step < 4 ? (
              <button
                type="button"
                onClick={nextStep}
                className="px-5 py-2.5 bg-[#1a1a1a] hover:bg-[#d4a373] text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1 shadow-md"
              >
                Continue <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleCalculateAndFinish}
                className="px-6 py-3 bg-gradient-to-r from-[#d4a373] to-[#b88555] hover:opacity-90 text-white text-xs font-black rounded-xl transition-all flex items-center gap-1.5 shadow-lg shadow-[#d4a373]/25"
              >
                <Sparkles className="w-4 h-4 text-white animate-pulse" /> Finalize Profile
              </button>
            )}
          </div>
        </>
      ) : (
        /* FINAL SUMMARY CARD DEPICTING SAVED ONBOARDING SUMMARY */
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="space-y-6 flex flex-col justify-between h-full"
        >
          <div className="space-y-2 text-center">
            <div className="w-12 h-12 bg-[#fdf5ed] rounded-full flex items-center justify-center text-[#d4a373] mx-auto shadow-inner">
              <Compass className="w-6 h-6 animate-spin" style={{ animationDuration: '6s' }} />
            </div>
            <h3 className="text-2xl font-serif italic font-bold text-slate-900 leading-tight">
              A Magnificent Profile Calculated!
            </h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              WanderWise parsed your constraints and modeled a custom traveler matrix.
            </p>
          </div>

          {/* Persona Card Display */}
          <div className="bg-[#faf9f6] border border-[#e5e0d8] rounded-2xl p-5 space-y-4">
            <div className="border-b border-[#e5e0d8]/60 pb-3 flex justify-between items-start">
              <div>
                <span className="text-[9px] font-mono tracking-widest text-[#d4a373] uppercase font-black">
                  calculated traveler identity
                </span>
                <h4 className="font-serif italic text-lg font-bold text-slate-800">
                  {travelStyle} {budgetTier} Explorer
                </h4>
              </div>
              <span className="text-2xl">🎩</span>
            </div>

            <div className="grid grid-cols-2 gap-3.5 text-xs">
              <div>
                <span className="text-[10px] text-slate-400 font-mono uppercase block">Origin Basin</span>
                <span className="font-semibold text-slate-700">{homeCity}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-mono uppercase block">Dob Chrono</span>
                <span className="font-semibold text-slate-700">{dob}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-mono uppercase block">Currency Standard</span>
                <span className="font-semibold text-slate-700">{currency}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-mono uppercase block">Companions Team</span>
                <span className="font-semibold text-slate-700">{companions} traveler</span>
              </div>
            </div>

            {/* Daily Budgets Splitting diagram style indicators */}
            <div className="border-t border-[#e5e0d8]/60 pt-3 space-y-2">
              <div className="flex justify-between items-baseline text-xs">
                <span className="text-slate-400 font-mono uppercase text-[10px]">Model Daily Budget Allowance</span>
                <span className="font-black text-[#1a1a1a] font-mono">
                  {getCurrencySymbol()}{budgetTier === 'Budget' ? (currency === 'INR' ? '1,500' : budgetTier === 'Mid-range' ? '6,000' : '40') : (budgetTier === 'Mid-range' ? (currency === 'INR' ? '6,000' : '150') : (currency === 'INR' ? '25,000' : '600'))} / day
                </span>
              </div>

              {/* Graphical Segment splits meter */}
              <div>
                <div className="flex items-center w-full h-3 rounded-md overflow-hidden bg-slate-100 text-[8px] font-mono font-bold text-white text-center select-none">
                  <div className="bg-slate-900 border-r border-white/20 h-full" style={{ width: '40%' }} title="Stay lodging (40%)">St</div>
                  <div className="bg-[#d4a373] border-r border-white/20 h-full" style={{ width: '25%' }} title="Food tastes (25%)">Fd</div>
                  <div className="bg-emerald-600 border-r border-white/20 h-full" style={{ width: '15%' }} title="Transport rides (15%)">Tr</div>
                  <div className="bg-purple-600 border-r border-white/20 h-full" style={{ width: '15%' }} title="Excursions (15%)">Ex</div>
                  <div className="bg-amber-500 h-full" style={{ width: '5%' }} title="Shopping (5%)">Sh</div>
                </div>
                <div className="flex justify-between text-[8px] text-slate-400 font-mono uppercase mt-1">
                  <span>Lodging 40%</span>
                  <span>Food 25%</span>
                  <span>Transit 15%</span>
                  <span>Activities 15%</span>
                  <span>Shop 5%</span>
                </div>
              </div>
            </div>

            {/* Interest/Language chips visual summaries */}
            <div className="border-t border-[#e5e0d8]/60 pt-3 space-y-2">
              <div className="flex flex-wrap gap-1">
                {selectedInterests.slice(0, 3).map((int) => (
                  <span key={int} className="px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-100 text-[10px]">
                    📍 {int}
                  </span>
                ))}
                {selectedFoodPrefs.slice(0, 2).map((food) => (
                  <span key={food} className="px-2 py-0.5 rounded-full bg-[#fdf5ed]/60 text-[#d4a373] border border-[#fdf5ed] text-[10px]">
                    🥑 {food}
                  </span>
                ))}
                <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px]">
                  🗣️ {selectedLanguages.length} Spoken
                </span>
              </div>
            </div>

          </div>

          <div className="pt-2">
            <button
              onClick={handleStartExploring}
              className="w-full py-4.5 bg-[#1a1a1a] hover:bg-[#d4a373] text-white text-xs font-black rounded-2xl tracking-widest uppercase transition-all shadow-lg flex items-center justify-center gap-2"
            >
              Start Exploring <Compass className="w-4 h-4 stroke-[3.5]" />
            </button>
            <button
              onClick={() => {
                setShowSummary(false);
                setStep(4);
              }}
              className="w-full text-center text-xs text-slate-400 hover:text-slate-600 transition-colors mt-3 block font-semibold"
            >
              Edit Choices
            </button>
          </div>
        </motion.div>
      )}

    </div>
  );
}
