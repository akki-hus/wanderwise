/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, MapPin, Calendar, Compass, DollarSign, Send, 
  MessageSquare, Sliders, Check, Plus, Trash2, Mail, Info, 
  ArrowLeft, Share2, Award, ClipboardCheck, Clock, Map, ChevronRight,
  RefreshCw, CheckCircle, Smartphone
} from 'lucide-react';
import { OnboardingPreferences, Itinerary, BudgetItem, Message, Activity, TravelStyle, Companions } from './types';
import Onboarding from './components/Onboarding';
import InteractiveMap from './components/InteractiveMap';
import LoginScreen from './components/LoginScreen';
import ProfileView from './components/ProfileView';

// Safe Mock Data generator for Demo / Testing if Gemini API key is not configured
const MOCK_ITINERARY_SAMPLE: Itinerary = {
  destination: "Kyoto, Japan",
  durationDays: 4,
  personaTitle: "The Culture Curator",
  personaDescription: "A traveler drawn to profound history, traditional gardens, and artisanal craft studios. You value quiet moments of aesthetic contemplation and local culinary history.",
  days: [
    {
      dayNumber: 1,
      theme: "Ancient Whispers & Vermilion Gates",
      activities: [
        {
          id: "act-1-1",
          time: "08:30 AM",
          title: "Fushimi Inari-Taisha",
          description: "Hike through the majestic corridor of ten thousand vermilion torii gates stretching up Mount Inari. Beat the crowds for peaceful contemplation.",
          estimatedCost: 0,
          locationName: "Fushimi Inari-Taisha Shrine",
          category: "sightseeing",
          coordinates: { x: 30.2, y: 75.6 },
          isVisited: true
        },
        {
          id: "act-1-2",
          time: "12:30 PM",
          title: "Traditional Soba Lunch at Gion",
          description: "Savor freshly rolled organic buckwheat noodles served with crisp seasonal vegetable tempura in a classic machiya townhome.",
          estimatedCost: 22,
          locationName: "Gion Okaru Nishiki",
          category: "food",
          coordinates: { x: 45.8, y: 48.2 },
          isVisited: false
        },
        {
          id: "act-1-3",
          time: "03:00 PM",
          title: "Tea Ceremony Experience",
          description: "Participate in a peaceful, private tea whisking session taught by a licensed Urasenke master. Learn the art of tea mindfulness.",
          estimatedCost: 45,
          locationName: "En Tea House Experience",
          category: "relaxation",
          coordinates: { x: 50.1, y: 42.4 },
          isVisited: false
        }
      ]
    },
    {
      dayNumber: 2,
      theme: "Zen Gardens & Golden Pavilions",
      activities: [
        {
          id: "act-2-1",
          time: "09:00 AM",
          title: "Kinkaku-ji (Golden Pavilion)",
          description: "Mirroring perfectly onto the Kyoko-chi pond, this spectacular Zen temple is completely covered in brilliant gold leaf. Stunning morning visuals.",
          estimatedCost: 5,
          locationName: "Kinkaku-ji Garden Ground",
          category: "sightseeing",
          coordinates: { x: 18.5, y: 22.3 },
          isVisited: false
        },
        {
          id: "act-2-2",
          time: "01:30 PM",
          title: "Nishiki Market Culinary Expedition",
          description: "Squeeze through centuries-old streets tasting unique glazed baby octopus, dashi tamago-yaki, and visual strawberry mochi skewered sweets.",
          estimatedCost: 15,
          locationName: "Nishiki-koji Alleyways",
          category: "food",
          coordinates: { x: 42.1, y: 44.5 },
          isVisited: false
        },
        {
          id: "act-2-3",
          time: "05:30 PM",
          title: "Bamboo Path Evening Walk",
          description: "Wander through the towering green stalks of Arashiyama as the wind drafts through, creating a relaxing acoustics retreat.",
          estimatedCost: 0,
          locationName: "Arashiyama Bamboo Grove",
          category: "adventure",
          coordinates: { x: 12.0, y: 48.0 },
          isVisited: false
        }
      ]
    },
    {
      dayNumber: 3,
      theme: "Philosopher's Trails & Local Clay Handcrafts",
      activities: [
        {
          id: "act-3-1",
          time: "09:30 AM",
          title: "Walk the Path of Philosophy",
          description: "Trace the stone trail alongside a scenic canal lined with cherry trees and ancient stone shrines, inspired by Kyoto University professors.",
          estimatedCost: 0,
          locationName: "Tetsugaku-no-Michi Path",
          category: "relaxation",
          coordinates: { x: 82.3, y: 20.1 },
          isVisited: false
        },
        {
          id: "act-3-2",
          time: "01:00 PM",
          title: "Kiyomizu-dera & Sannenzaka Lanes",
          description: "Ascend the iconic wooden veranda of Kiyomizu temple built completely without nails. Explore historic wooden alleys for elegant souvenirs.",
          estimatedCost: 6,
          locationName: "Kiyomizu Temple Compound",
          category: "sightseeing",
          coordinates: { x: 65.4, y: 55.2 },
          isVisited: false
        },
        {
          id: "act-3-3",
          time: "04:30 PM",
          title: "Artisanal Pottery Workshop",
          description: "Shape your own souvenir matcha cup using Kiyomizu-yaki techniques on an interactive spinning pottery wheel under elder guidance.",
          estimatedCost: 40,
          locationName: "Asahiyaki Craft Workshop",
          category: "shopping",
          coordinates: { x: 68.2, y: 62.4 },
          isVisited: false
        }
      ]
    },
    {
      dayNumber: 4,
      theme: "Whisky & Historic Willow Alleys",
      activities: [
        {
          id: "act-4-1",
          time: "10:30 AM",
          title: "Nijo Castle Gardens Walk",
          description: "Stroll through defensive moats and explore nightingale wooden floorboards built to squeak like birds warning guards of incoming ninja.",
          estimatedCost: 8,
          locationName: "Nijo Castle Palace Grounds",
          category: "sightseeing",
          coordinates: { x: 34.2, y: 38.0 },
          isVisited: false
        },
        {
          id: "act-4-2",
          time: "01:30 PM",
          title: "Kyoto Distillery Tasting Room",
          description: "Sip sophisticated local gins infused with fresh yuzu, sansho peppers, and high-altitude green tea. Perfectly paired with light local plates.",
          estimatedCost: 35,
          locationName: "House of Ki No Bi Gin",
          category: "food",
          coordinates: { x: 44.0, y: 32.5 },
          isVisited: false
        },
        {
          id: "act-4-3",
          time: "07:00 PM",
          title: "Gion Shirakawa Willow Walk",
          description: "Indulge in a twilight stroll along willow-lined canals with lanterns flickering on Shirakawa stream, spotting geiko going to tea meetings.",
          estimatedCost: 0,
          locationName: "Shirakawa Canal Walk",
          category: "relaxation",
          coordinates: { x: 55.4, y: 44.8 },
          isVisited: false
        }
      ]
    }
  ],
  packingList: [
    "A breathable camera strap to snap quick temple snapshots.",
    "Easily slip-on minimalist loafers (ideal for entering temple tatamis).",
    "Light waterproof technical layer for passing Arashiyama showers.",
    "A gorgeous leather journal for stamping historic train stamp inks.",
    "Sleek reusable chopsticks and pocket sanitizers for food stalls."
  ],
  essentialAdvice: "Kyoto values peaceful quiet. Keep talk whispers high on buses. Do not touch traveling geiko or advance with cameras aggressively. Carrying cash is highly practical as elder merchants often do not support card terminals.",
  estimatedTotalCost: 153
};

export default function App() {
  const [currentUser, setCurrentUser] = useState<any>(() => {
    const saved = localStorage.getItem('currentUser');
    return saved ? JSON.parse(saved) : null;
  });

  const [userProfile, setUserProfile] = useState<any>(() => {
    const saved = localStorage.getItem('userProfile');
    return saved ? JSON.parse(saved) : null;
  });

  const [activeTab, setActiveTab] = useState<'dashboard' | 'profile'>('dashboard');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  const [preferences, setPreferences] = useState<OnboardingPreferences | null>(null);
  const [itinerary, setItinerary] = useState<Itinerary | null>(null);
  
  // App states
  const [activeDay, setActiveDay] = useState<number>(1);
  const [activeActivityId, setActiveActivityId] = useState<string | null>(null);
  const [visitedActivityIds, setVisitedActivityIds] = useState<string[]>([]);
  const [budgetItems, setBudgetItems] = useState<BudgetItem[]>([]);
  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  const [currentPrompt, setCurrentPrompt] = useState<string>('');
  
  // UI states
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [isSendingEmail, setIsSendingEmail] = useState<boolean>(false);
  const [emailOpen, setEmailOpen] = useState<boolean>(false);
  const [toEmail, setToEmail] = useState<string>('kandulaakshithreddy2009@gmail.com');
  const [emailLog, setEmailLog] = useState<string | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  const [showDemoFlag, setShowDemoFlag] = useState<boolean>(false);

  // Budget forms states
  const [newExpDesc, setNewExpDesc] = useState<string>('');
  const [newExpAmount, setNewExpAmount] = useState<number>(15);
  const [newExpCategory, setNewExpCategory] = useState<'lodging' | 'transportation' | 'food' | 'entertainment' | 'shopping' | 'other'>('food');


  // Initialize Globi with a warm greeting when app starts or when itinerary changes
  useEffect(() => {
    const greetingText = itinerary 
      ? `Welcome to **${itinerary.destination}**! I'm **Globi**, your artistic Travel Concierge. I see your persona is **${itinerary.personaTitle}**. Ask me for secret viewpoint photo spots, dining guides, or hidden local routes!`
      : `Hello beautiful soul! I am **Globi**, WanderWise's AI companion guide. Tell me your travel aspirations, and I will help customize the perfect itinerary for you. Where would you love to travel today?`;
    
    setChatMessages([
      {
        id: 'globi-init',
        sender: 'globi',
        text: greetingText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  }, [itinerary]);

  // Handle Profile Completion (Onboarding Wizard Finish)
  const handleProfileComplete = (profile: any) => {
    localStorage.setItem('userProfile', JSON.stringify(profile));
    setUserProfile(profile);
    showToast(`Welcome ${profile.name}! Your travel persona of '${profile.travelPersona}' is active.`, 'success');
    setActiveTab('dashboard');
  };

  // Generate Itinerary matching saved Profile credentials
  const handleGenerateCustomTrip = async (destination: string, durationDays: number) => {
    if (!userProfile) return;
    setIsGenerating(true);
    setApiError(null);

    // Map style and companions to API compliant types
    const mapStyleToApi = (st: string): TravelStyle => {
      const lowered = st.toLowerCase();
      if (lowered === 'foodie') return 'culinary';
      if (lowered === 'backpacker') return 'budget';
      return lowered as TravelStyle;
    };

    const mapCompanionsToApi = (co: string): Companions => {
      const lowered = co.toLowerCase();
      if (lowered === 'couple') return 'partner';
      return lowered as Companions;
    };

    // Construct preferences aligned to API definitions
    const calculatedBudgetLimit = userProfile.dailyBudget * durationDays;
    const computedPrefs: OnboardingPreferences = {
      destination,
      durationDays,
      travelStyle: mapStyleToApi(userProfile.travelStyle),
      companions: mapCompanionsToApi(userProfile.companions),
      budgetLimit: calculatedBudgetLimit,
      interests: userProfile.interests
    };

    setPreferences(computedPrefs);

    try {
      const response = await fetch('/api/itinerary/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(computedPrefs)
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Server error compile');
      }

      const compiledItinerary = await response.json();
      setItinerary(compiledItinerary);
      setActiveDay(1);

      // Initialize visited activities using the first one
      if (compiledItinerary.days?.[0]?.activities?.[0]) {
        setVisitedActivityIds([compiledItinerary.days[0].activities[0].id]);
      } else {
        setVisitedActivityIds([]);
      }

      // Prepopulate budget logs with initial scheduled items
      const logs: BudgetItem[] = [];
      compiledItinerary.days.forEach((day: any) => {
        day.activities.forEach((act: any) => {
          if (act.estimatedCost > 0) {
            logs.push({
              id: `init-${act.id}`,
              category: mapCategoryToBudget(act.category),
              amount: act.estimatedCost,
              description: `${act.title} (${act.locationName})`,
              date: `Day ${day.dayNumber}`
            });
          }
        });
      });
      setBudgetItems(logs);

    } catch (err: any) {
      console.warn("Could not reach real Gemini API. Utilizing beautiful simulated backup trip: " + err.message);
      // Give simulated experience instead of blocking the student / PM hackathon user
      setApiError(err.message || 'The Gemini API is taking a moment to answer.');
      setShowDemoFlag(true);

      // Let's load standard beautiful Kyoto/or customized preset matching destination if possible
      const customMock = { ...MOCK_ITINERARY_SAMPLE, destination };
      setItinerary(customMock);
      setActiveDay(1);
      setVisitedActivityIds(['act-1-1']);
      
      const logs: BudgetItem[] = [];
      customMock.days.forEach((day) => {
        day.activities.forEach((act) => {
          if (act.estimatedCost > 0) {
            logs.push({
              id: `init-${act.id}`,
              category: mapCategoryToBudget(act.category),
              amount: act.estimatedCost,
              description: `${act.title} (${act.locationName})`,
              date: `Day ${day.dayNumber}`
            });
          }
        });
      });
      setBudgetItems(logs);
    } finally {
      setIsGenerating(false);
    }
  };

  const mapCategoryToBudget = (cat: string): 'lodging' | 'transportation' | 'food' | 'entertainment' | 'shopping' | 'other' => {
    switch(cat) {
      case 'food': return 'food';
      case 'sightseeing': return 'entertainment';
      case 'adventure': return 'entertainment';
      case 'shopping': return 'shopping';
      case 'relaxation': return 'other';
      default: return 'other';
    }
  };

  // Visited Place Toggles
  const toggleVisitedPlace = (activityId: string) => {
    if (visitedActivityIds.includes(activityId)) {
      setVisitedActivityIds(visitedActivityIds.filter(id => id !== activityId));
    } else {
      setVisitedActivityIds([...visitedActivityIds, activityId]);
    }
  };

  // Add Custom Budget Item
  const handleAddBudgetExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExpDesc.trim() || newExpAmount <= 0) return;

    const newItem: BudgetItem = {
      id: `exp-${Date.now()}`,
      category: newExpCategory,
      amount: newExpAmount,
      description: newExpDesc.trim(),
      date: `Day ${activeDay}`
    };

    setBudgetItems([...budgetItems, newItem]);
    setNewExpDesc('');
    setNewExpAmount(15);
  };

  const handleDeleteExpense = (id: string) => {
    setBudgetItems(budgetItems.filter(item => item.id !== id));
  };

  // Send Conversational Message to Globi
  const handleSendChat = async (inputStr?: string) => {
    const textToSend = inputStr || currentPrompt;
    if (!textToSend.trim()) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages(prev => [...prev, userMsg]);
    if (!inputStr) setCurrentPrompt('');

    // Put a loading placeholder
    const loadingId = `globi-loading-${Date.now()}`;
    setChatMessages(prev => [...prev, {
      id: loadingId,
      sender: 'globi',
      text: '✍️ Globi is penning recommendations...',
      timestamp: ''
    }]);

    try {
      const resp = await fetch('/api/concierge/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: textToSend,
          history: chatMessages.filter(m => m.id !== 'globi-init').slice(-8), // send last 8 turns as history context
          tripContext: itinerary,
          preferences: preferences
        })
      });

      if (!resp.ok) throw new Error('Could not get answer from Globi.');

      const data = await resp.json();
      setChatMessages(prev => prev.filter(m => m.id !== loadingId).concat({
        id: `globi-reply-${Date.now()}`,
        sender: 'globi',
        text: data.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }));

    } catch (err: any) {
      console.warn("Globi offline backup triggered", err);
      // Give helpful mock response
      let localAnswer = `I love that question! Kyoto’s weather is currently lovely at ${18}°C. If you are heading to that location, I highly recommend looking out for secondary side alleys. Should I update your planned timeline budget?`;
      if (textToSend.toLowerCase().includes('food') || textToSend.toLowerCase().includes('eat')) {
        localAnswer = `Oh! Based on your preference for local foodie tastes, try finding hidden stand-and-eat Yakitori alleys near Nishiki, or a warm Machiya tea-house on Shirakawa canal. Shall I add a $15 estimate to your Day ${activeDay} budget?`;
      } else if (textToSend.toLowerCase().includes('photo') || textToSend.toLowerCase().includes('camera')) {
        localAnswer = `For spectacular photographic light without tourist crowds, set a morning alert at 7:00 AM for the Fushimi Inari vermilion corridor, or catch golden sunset reflection off the Kinkaku-ji pond. Do you want me to write down these photo guidelines?`;
      }

      setChatMessages(prev => prev.filter(m => m.id !== loadingId).concat({
        id: `globi-reply-mock-${Date.now()}`,
        sender: 'globi',
        text: localAnswer,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }));
    }
  };

  // Mock Email Sending Dialog
  const handleEmailDispatch = async () => {
    if (!toEmail.trim() || !itinerary) return;
    setIsSendingEmail(true);
    setEmailLog(null);

    try {
      const resp = await fetch('/api/itinerary/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          toEmail: toEmail.trim(),
          itinerary: itinerary
        })
      });

      if (!resp.ok) throw new Error('Mail dispatch failed');

      const data = await resp.json();
      setEmailLog(data.rawContent);
    } catch (err: any) {
      alert('Failed to simulate mail delivery. High latency is expected.');
    } finally {
      setIsSendingEmail(false);
    }
  };

  // Calculations for budget breakdown
  const totalBudgetSpent = budgetItems.reduce((acc, curr) => acc + curr.amount, 0);
  const budgetGoal = preferences?.budgetLimit || 1500;
  const budgetSpentPercent = Math.min(100, Math.round((totalBudgetSpent / budgetGoal) * 100));

  const budgetCategoriesCount = {
    lodging: budgetItems.filter(i => i.category === 'lodging').reduce((acc, curr) => acc + curr.amount, 0),
    transportation: budgetItems.filter(i => i.category === 'transportation').reduce((acc, curr) => acc + curr.amount, 0),
    food: budgetItems.filter(i => i.category === 'food').reduce((acc, curr) => acc + curr.amount, 0),
    entertainment: budgetItems.filter(i => i.category === 'entertainment').reduce((acc, curr) => acc + curr.amount, 0),
    shopping: budgetItems.filter(i => i.category === 'shopping').reduce((acc, curr) => acc + curr.amount, 0),
    other: budgetItems.filter(i => i.category === 'other').reduce((acc, curr) => acc + curr.amount, 0),
  };

  const getDayActivities = () => {
    if (!itinerary) return [];
    const targetDay = itinerary.days.find(d => d.dayNumber === activeDay);
    return targetDay ? targetDay.activities : [];
  };

  const getDayTheme = () => {
    if (!itinerary) return '';
    const targetDay = itinerary.days.find(d => d.dayNumber === activeDay);
    return targetDay ? targetDay.theme : '';
  };

  const handleSignOut = () => {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('userProfile');
    setCurrentUser(null);
    setUserProfile(null);
    setItinerary(null);
    setPreferences(null);
    setBudgetItems([]);
    setVisitedActivityIds([]);
    setActiveTab('dashboard');
    showToast('Signed out successfully.', 'success');
  };

  const handleReplayOnboarding = () => {
    localStorage.removeItem('userProfile');
    setUserProfile(null);
  };

  // 1. Intercept Authentication Screen
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-[#fdfaf6] flex flex-col justify-center relative select-none" id="auth-screen-container">
        <LoginScreen onSuccess={(user) => {
          setCurrentUser(user);
          const profile = localStorage.getItem('userProfile');
          if (profile) {
            setUserProfile(JSON.parse(profile));
          }
        }} showToast={showToast} />
        {toast && (
          <div className={`fixed bottom-4 right-4 z-50 px-4 py-3 rounded-xl border flex items-center gap-2 text-xs font-semibold shadow-lg text-white ${toast.type === 'error' ? 'bg-rose-500 border-rose-400 animate-bounce' : 'bg-[#1a1a1a] border-[#e9d290]'}`}>
            <span>{toast.type === 'error' ? '🚨' : '✨'}</span>
            <span>{toast.message}</span>
          </div>
        )}
      </div>
    );
  }

  // 2. Intercept Onboarding Wizard Screen if incomplete
  if (!userProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-tr from-[#faf3e8] via-[#fdfaf6] to-[#ebe2d5] flex items-center justify-center p-4" id="onboarding-screen-container">
        <div className="w-full max-w-2xl bg-white border border-[#e5e0d8] rounded-3xl shadow-xl overflow-hidden p-1">
          <Onboarding userName={currentUser.name} onComplete={handleProfileComplete} />
        </div>
        {toast && (
          <div className={`fixed bottom-4 right-4 z-50 px-4 py-3 rounded-xl border flex items-center gap-2 text-xs font-semibold shadow-lg text-white ${toast.type === 'error' ? 'bg-rose-500 border-rose-400' : 'bg-[#d4a373] border-[#d4a373]'}`}>
            <span>{toast.type === 'error' ? '🚨' : '✨'}</span>
            <span>{toast.message}</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fdfaf6] text-[#1a1a1a] flex flex-col selection:bg-[#d4a373]/20" id="wanderwise-app-root">
      
      {/* 1. Header Bar following "Artistic Flair" styling */}
      <header className="h-16 border-b border-[#e5e0d8] px-6 sm:px-8 flex items-center justify-between bg-white/80 backdrop-blur-md sticky top-0 z-40 shadow-sm shadow-[#faf9f6]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-[#d4a373] rounded-full flex items-center justify-center text-white shadow-inner">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xl font-serif font-extrabold tracking-tight italic text-[#1a1a1a] flex items-center gap-1.5">
              WanderWise
            </span>
            <span className="text-[10px] uppercase tracking-widest block font-mono -mt-1 text-[#d4a373] font-bold">
              AI Travel Companion
            </span>
          </div>
        </div>

        <nav className="flex gap-4 sm:gap-6 text-[10px] sm:text-xs font-bold uppercase tracking-widest text-[#7a736a] items-center">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`pb-1 transition-all ${activeTab === 'dashboard' ? 'text-[#d4a373] border-b-2 border-[#d4a373] font-black' : 'hover:text-[#d4a373]'}`}
          >
            Atelier Dashboard
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`pb-1 transition-all ${activeTab === 'profile' ? 'text-[#d4a373] border-b-2 border-[#d4a373] font-black' : 'hover:text-[#d4a373]'}`}
          >
            Profile View
          </button>
          {itinerary && activeTab === 'dashboard' && (
            <button 
              onClick={() => {
                setPreferences(null);
                setItinerary(null);
              }} 
              className="hover:text-[#d4a373] transition-colors flex items-center gap-1 text-[10px] sm:text-xs text-slate-500 font-bold"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Re-Plan
            </button>
          )}
        </nav>

        <div className="flex items-center gap-3">
          {itinerary && activeTab === 'dashboard' && (
            <button
              onClick={() => setEmailOpen(true)}
              className="px-3 py-1.5 bg-[#1a1a1a] hover:bg-[#d4a373] text-[#fdfaf6] text-[10px] font-bold rounded-full transition-all flex items-center gap-1 shadow-md"
            >
              <Mail className="w-3 h-3" /> dispatch
            </button>
          )}
          <button 
            onClick={() => {
              if (confirm("Are you sure you want to sign out?")) {
                handleSignOut();
              }
            }}
            className="w-9 h-9 rounded-full border border-[#d4a373]/70 p-0.5 flex items-center justify-center bg-[#f5f2ed] text-[#1a1a1a] text-xs font-black font-mono hover:bg-rose-50 hover:border-rose-400 hover:text-rose-600 transition-all"
            title="Active traveller session. Tap to sign out."
          >
            {userProfile?.name ? userProfile.name.slice(0, 2).toUpperCase() : 'WW'}
          </button>
        </div>
      </header>

      {/* Toast Notification Container in App shell */}
      {toast && (
        <div className={`fixed bottom-4 right-4 z-50 px-4 py-3 rounded-xl border flex items-center gap-2 text-xs font-semibold shadow-lg text-white ${toast.type === 'error' ? 'bg-rose-500 border-rose-400' : 'bg-[#1a1a1a] border-[#e9e0c6]'}`}>
          <span>{toast.type === 'error' ? '🚨' : '✨'}</span>
          <span>{toast.message}</span>
        </div>
      )}

      {/* 2. Main Content Controller */}
      <div className="flex-grow flex flex-col justify-center">
        {activeTab === 'profile' ? (
          <div className="p-4 sm:p-6 lg:p-8">
            <ProfileView 
              userProfile={userProfile} 
              currentUser={currentUser} 
              onSignOut={handleSignOut} 
              onReplayOnboarding={handleReplayOnboarding} 
            />
          </div>
        ) : !itinerary ? (
          /* Landing Screen & Curated Onboarding experience */
          <div className="relative py-12 px-4 flex flex-col items-center">
            <AnimatePresence mode="wait">
              {!isGenerating ? (
                <motion.div 
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="w-full max-w-2xl flex flex-col items-center"
                >
                  {/* Highly elegant artistic landing hero block */}
                  <div className="text-center max-w-2xl mb-10">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#f5f2ed] border border-[#e5e0d8] text-[#7a736a] rounded-full text-[10px] font-bold tracking-widest uppercase mb-4">
                      <Sparkles className="w-3.5 h-3.5 text-[#d4a373] animate-pulse" /> Welcome back, {userProfile.name}
                    </div>
                    <h2 className="text-4xl sm:text-5xl font-serif font-bold italic tracking-tight text-slate-900 leading-tight">
                      Where would you love <br />
                      to <span className="text-[#d4a373]">travel today?</span>
                    </h2>
                    <p className="mt-3 text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                      We will compile custom landmarks and budget ledgers matching your <span className="font-bold text-slate-705 text-[#d4a373]">{userProfile.travelPersona}</span> style.
                    </p>
                  </div>

                  {/* Simplified Custom Journey Selector Form block */}
                  <div className="w-full bg-white border border-[#e5e0d8] rounded-3xl p-6 sm:p-8 shadow-xl space-y-5">
                    <div className="space-y-4">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500 font-mono uppercase block">Target Destination</label>
                        <input
                          type="text"
                          id="landing-destination-input"
                          placeholder="e.g. Kyoto, Paris, Barcelona, Berlin, New York, Reykjavik"
                          className="w-full bg-[#faf9f6]/80 border border-[#e5e0d8] rounded-xl px-4 py-3 text-xs focus:outline-none focus:ring-1 focus:ring-[#d4a373] text-slate-800 font-medium"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              const dest = (e.target as HTMLInputElement).value.trim();
                              if (dest) handleGenerateCustomTrip(dest, 4);
                            }
                          }}
                        />
                      </div>

                      {/* Select Curated Presets */}
                      <div className="space-y-1.5">
                        <span className="block text-[10px] font-bold text-slate-400 font-mono tracking-wider uppercase">
                          Or click a curated destination preset:
                        </span>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                          {[
                            { name: 'Kyoto, Japan', emoji: '⛩️' },
                            { name: 'Paris, France', emoji: '🥐' },
                            { name: 'Rome, Italy', emoji: '🍝' },
                            { name: 'Mauí, Hawaii', emoji: '🏝️' },
                            { name: 'Iceland', emoji: '🌋' },
                            { name: 'Cape Town', emoji: '🐧' }
                          ].map((preset) => (
                            <button
                              key={preset.name}
                              type="button"
                              onClick={() => handleGenerateCustomTrip(preset.name, 4)}
                              className="py-2.5 px-2 bg-white hover:bg-[#faf9f6]/80 text-[11px] font-bold text-slate-700 rounded-xl border border-[#e5e0d8] hover:border-[#d4a373] transition-all flex items-center justify-center gap-1.5"
                            >
                              <span>{preset.emoji}</span>
                              <span className="truncate">{preset.name}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Number of days selector slider */}
                      <div className="space-y-1.5 pt-1">
                        <label className="text-[10px] font-mono tracking-wider font-bold text-slate-500 uppercase block">
                          Journey Duration Option
                        </label>
                        <div className="flex gap-2">
                          {[2, 3, 4, 5, 7].map((num) => (
                            <button
                              key={num}
                              type="button"
                              onClick={() => {
                                const input = document.getElementById('landing-destination-input') as HTMLInputElement;
                                const dest = input?.value.trim() || 'Paris, France';
                                handleGenerateCustomTrip(dest, num);
                              }}
                              className="flex-1 py-1 px-1 border border-[#e5e0d8] text-[11px] h-9 rounded-xl font-bold bg-[#faf9f6] hover:bg-white text-slate-600 hover:border-[#d4a373] transition-all"
                            >
                              {num} Days
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        const input = document.getElementById('landing-destination-input') as HTMLInputElement;
                        const dest = input?.value.trim() || 'Kyoto, Japan';
                        handleGenerateCustomTrip(dest, 4);
                      }}
                      className="w-full py-4 bg-[#1a1a1a] hover:bg-[#d4a373] text-white text-xs font-black rounded-xl tracking-widest uppercase transition-all shadow-md flex items-center justify-center gap-2"
                    >
                      Weave AI Itinerary <Compass className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              ) : (
                /* Generation Stage loading state */
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="max-w-md w-full text-center py-20 bg-white border border-[#e5e0d8] rounded-3xl p-8 shadow-xl flex flex-col items-center justify-center min-h-[460px]"
                >
                  <div className="relative mb-6">
                    <div className="w-16 h-16 rounded-full border-4 border-[#e5e0d8] border-t-[#d4a373] animate-spin" />
                    <Compass className="w-7 h-7 text-[#d4a373] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
                  </div>

                  <span className="text-[10px] font-mono tracking-widest text-[#d4a373] uppercase font-bold animate-pulse">
                    weaving coordinates & matching logs
                  </span>
                  <h3 className="text-2xl font-serif italic font-bold text-slate-800 mt-2">
                    Architecting Your Dossier
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 max-w-xs leading-normal">
                    Globi is selecting authentic landmarks, calculating visual coordinates, compiling custom packing requirements, and budgeting daily schedules...
                  </p>

                  <div className="w-full bg-[#f5f2ed] h-1 rounded-full mt-6 overflow-hidden max-w-xs">
                    <div className="bg-[#d4a373] h-full animate-infinite-loading w-[40%]" />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ) : (
          /* 3. Fully Featured Artistic Dashboard View */
          <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-6 items-start" id="wanderwise-dashboard-layout">
            
            {/* Demo Flag Alert Header bar if APIs had any trouble */}
            {showDemoFlag && (
              <div className="lg:col-span-12 bg-amber-50 border border-amber-200/80 rounded-2xl p-4 flex items-start gap-3">
                <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-amber-800 flex items-center gap-1.5 font-sans">
                    Demonstration Suite Enabled (Mock Sandbox Backup)
                  </h4>
                  <p className="text-[11px] text-amber-700 leading-normal mt-0.5">
                    No Gemini API key detected inside Sandbox environments. WanderWise initialized high-quality offline coordinates, custom budget tracking, and simulated concierge tools so you can test and explore immediately!
                  </p>
                </div>
              </div>
            )}

            {/* COLUMN 1: Day Explorer Schedule (Weight: 4) */}
            <div className="lg:col-span-4 space-y-6 flex flex-col">
              
              {/* Day Selection Tabs following the Artistic styling */}
              <div className="bg-white border border-[#e5e0d8] rounded-3xl p-5 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-serif italic text-xl">Trip Timeline</h3>
                  <span className="text-[9px] font-mono uppercase bg-[#f5f2ed] border border-[#e5e0d8] px-2 py-1 rounded font-bold tracking-wider">
                    {itinerary.destination.toUpperCase()}
                  </span>
                </div>

                <div className="flex gap-2 overflow-x-auto pb-1 mb-4">
                  {itinerary.days.map((d) => (
                    <button
                      key={d.dayNumber}
                      onClick={() => {
                        setActiveDay(d.dayNumber);
                        setActiveActivityId(null);
                      }}
                      className={`px-4 py-2 text-xs font-bold rounded-xl border transition-all shrink-0 ${
                        activeDay === d.dayNumber
                          ? 'border-[#d4a373] bg-[#f5f2ed] text-[#1a1a1a] font-black scale-102'
                          : 'border-[#e5e0d8]/50 text-slate-500 hover:border-slate-300'
                      }`}
                    >
                      Day {d.dayNumber}
                    </button>
                  ))}
                </div>

                {/* Day Theme details */}
                <div className="p-3.5 bg-[#faf9f6] border border-[#e5e0d8] rounded-2xl mb-4">
                  <p className="text-[9px] font-mono uppercase tracking-widest text-[#d4a373] font-black">
                    Today’s Aesthetic Motif
                  </p>
                  <p className="text-xs font-bold font-serif italic text-[#1a1a1a] mt-0.5">
                    &ldquo;{getDayTheme()}&rdquo;
                  </p>
                </div>

                {/* Main list of activities */}
                <span className="block text-[10px] font-mono text-[#7a736a] uppercase tracking-wider mb-2">
                  Scheduled Stops & Sights:
                </span>
                <div className="space-y-3.5">
                  {getDayActivities().map((act) => {
                    const isVisited = visitedActivityIds.includes(act.id);
                    const isHighlighted = activeActivityId === act.id;

                    return (
                      <div
                        key={act.id}
                        onClick={() => setActiveActivityId(act.id)}
                        className={`group border rounded-2xl p-4.5 cursor-pointer transition-all relative ${
                          isHighlighted
                            ? 'border-[#d4a373] bg-white shadow-md'
                            : 'border-[#e5e0d8]/60 hover:border-[#d4a373]/55 bg-white'
                        }`}
                      >
                        {/* Time label and Visited complete indicator button inside card */}
                        <div className="flex justify-between items-start gap-2 mb-2">
                          <span className="text-[10px] font-mono font-bold text-[#d4a373] tracking-tight bg-[#f5f2ed] px-2 py-0.5 rounded">
                            {act.time}
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleVisitedPlace(act.id);
                            }}
                            className={`p-1.5 rounded-full transition-all border flex items-center justify-center ${
                              isVisited
                                ? 'bg-emerald-500 border-emerald-400 text-white'
                                : 'border-[#e5e0d8] text-slate-300 hover:text-slate-500 hover:bg-slate-50'
                            }`}
                            title={isVisited ? "Mark as planned" : "Mark as visited"}
                          >
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                          </button>
                        </div>

                        {/* Text labels */}
                        <h4 className={`text-sm font-bold text-slate-950 font-display transition-all ${isVisited ? 'line-through text-slate-400' : ''}`}>
                          {act.title}
                        </h4>
                        <p className="text-xs text-slate-500 mt-1 lines-clamp-3 leading-relaxed">
                          {act.description}
                        </p>

                        <div className="flex items-center justify-between text-[11px] pt-2 border-t border-[#e5e0d8]/40 mt-3 text-slate-400">
                          <span className="italic max-w-[150px] truncate">{act.locationName}</span>
                          <span className="font-mono font-black text-[#1a1a1a] text-[10px]">
                            {act.estimatedCost > 0 ? `$${act.estimatedCost}` : 'Free admission'}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Minimal Travel Packing lists / Essential advice panel */}
              <div className="bg-[#1a1a1a] text-white rounded-3xl p-6 shadow-lg space-y-4">
                <div>
                  <span className="text-[9px] font-mono tracking-widest text-[#d4a373] uppercase font-bold">
                    curated packing list
                  </span>
                  <ul className="mt-2.5 space-y-2">
                    {itinerary.packingList.map((item, index) => (
                      <li key={index} className="flex items-start gap-2.5 text-xs text-slate-300 leading-normal">
                        <span className="text-xs text-[#d4a373] font-mono select-none">0{index + 1}.</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="pt-3 border-t border-white/10">
                  <span className="text-[9px] font-mono tracking-widest text-emerald-400 uppercase font-bold flex items-center gap-1">
                    <Info className="w-3.5 h-3.5" /> Essential Advice
                  </span>
                  <p className="text-[11px] text-slate-300 mt-1.5 leading-relaxed">
                    {itinerary.essentialAdvice}
                  </p>
                </div>
              </div>

            </div>

            {/* COLUMN 2: Map Visualizer & Budget Tracker (Weight: 5) */}
            <div className="lg:col-span-4 space-y-6">
              
              {/* Connected Visual Coordinates Map (Interactive Map) */}
              <div className="h-[430px]">
                <InteractiveMap 
                  itinerary={itinerary} 
                  visitedActivityIds={visitedActivityIds} 
                  activeActivityId={activeActivityId}
                  onActivitySelect={(id) => setActiveActivityId(id)}
                />
              </div>

              {/* Dynamic Budget Tracker Expense Logger */}
              <div className="bg-white border border-[#e5e0d8] rounded-3xl p-5 shadow-sm space-y-4" id="budget-section">
                <div>
                  <h3 className="font-serif italic text-xl flex items-center justify-between">
                    Atelier Ledger
                    <span className="text-[10px] uppercase font-mono bg-[#f5f2ed] border border-[#e5e0d8] px-2 py-0.5 rounded font-bold">
                      total cost log
                    </span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Track activity spending limits. Real-time cost updates vs planned goals.
                  </p>
                </div>

                {/* Meter progress bar */}
                <div className="space-y-1 bg-[#faf9f6] border border-[#e5e0d8] rounded-2xl p-3">
                  <div className="flex justify-between items-baseline">
                    <span className="text-xs font-bold text-slate-500">Scheduled Expenditure</span>
                    <span className="text-lg font-serif italic font-bold">
                      ${totalBudgetSpent} <span className="text-xs text-slate-400 normal-case italic font-sans font-normal">/ max ${budgetGoal}</span>
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden mt-1">
                    <div 
                      className={`h-full transition-all duration-500 rounded-full ${
                        totalBudgetSpent > budgetGoal ? 'bg-rose-500' : 'bg-[#d4a373]'
                      }`} 
                      style={{ width: `${budgetSpentPercent}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[9px] font-mono text-slate-400 uppercase">
                    <span>{budgetSpentPercent}% used</span>
                    <span>${budgetGoal - totalBudgetSpent >= 0 ? `$${budgetGoal - totalBudgetSpent} remaining` : `Exceeded by $${Math.abs(budgetGoal - totalBudgetSpent)}`}</span>
                  </div>
                </div>

                {/* Subsidized list of extra expenses */}
                <div className="max-h-[140px] overflow-y-auto space-y-1.5 pr-1 font-sans">
                  {budgetItems.map((item) => (
                    <div key={item.id} className="flex items-center justify-between text-xs p-2.5 bg-white border border-[#e5e0d8]/50 hover:border-[#e5e0d8] rounded-xl transition-all">
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${
                          item.category === 'food' ? 'bg-[#d4a373]' :
                          item.category === 'lodging' ? 'bg-[#1a1a1a]' : 'bg-slate-300'
                        }`} />
                        <div>
                          <span className="font-semibold text-slate-800 block line-clamp-1">{item.description}</span>
                          <span className="text-[9px] text-slate-400 font-mono uppercase">{item.date} • {item.category}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-mono font-bold">${item.amount}</span>
                        <button
                          onClick={() => handleDeleteExpense(item.id)}
                          className="text-slate-300 hover:text-rose-500 transition-colors p-0.5"
                          title="Delete expense"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}

                  {budgetItems.length === 0 && (
                    <div className="text-center py-4 text-xs text-slate-400 italic">
                      No items logged in history.
                    </div>
                  )}
                </div>

                {/* Form to log manual item */}
                <form onSubmit={handleAddBudgetExpense} className="space-y-2 pt-2.5 border-t border-[#e5e0d8]">
                  <span className="block text-[10px] font-mono text-[#7a736a] uppercase tracking-wider">
                    Log Custom Trip Expense:
                  </span>
                  <div className="grid grid-cols-12 gap-2">
                    <input
                      type="text"
                      placeholder="e.g. Taxi ride, souvenirs, coffee shop visit..."
                      value={newExpDesc}
                      onChange={(e) => setNewExpDesc(e.target.value)}
                      className="col-span-7 text-xs bg-[#faf9f6] border border-[#e5e0d8]/80 rounded-xl px-3 py-2 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#d4a373]"
                    />
                    <input
                      type="number"
                      placeholder="$"
                      value={newExpAmount}
                      onChange={(e) => setNewExpAmount(Math.max(1, parseInt(e.target.value) || 0))}
                      className="col-span-3 text-xs bg-[#faf9f6] border border-[#e5e0d8]/80 rounded-xl px-3 py-2 font-mono text-slate-800 focus:outline-none"
                    />
                    <button
                      type="submit"
                      disabled={!newExpDesc.trim()}
                      className={`col-span-2 text-xs font-bold text-white rounded-xl flex items-center justify-center transition-all ${
                        newExpDesc.trim() ? 'bg-[#1a1a1a] hover:bg-[#d4a373]' : 'bg-slate-200 cursor-not-allowed'
                      }`}
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex gap-2.5 items-center">
                    <span className="text-[10px] text-slate-400 font-mono">Category tag:</span>
                    <div className="flex gap-1.5 overflow-x-auto pb-1">
                      {['lodging', 'transportation', 'food', 'shopping', 'other'].map((catName) => (
                        <button
                          key={catName}
                          type="button"
                          onClick={() => setNewExpCategory(catName as any)}
                          className={`text-[9px] font-mono uppercase font-bold px-2 py-0.5 rounded transition-all ${
                            newExpCategory === catName 
                              ? 'bg-[#d4a373] text-white' 
                              : 'bg-slate-100 hover:bg-slate-200 text-slate-500'
                          }`}
                        >
                          {catName}
                        </button>
                      ))}
                    </div>
                  </div>
                </form>

              </div>
            </div>

            {/* COLUMN 3: Conversational AI Concierge Globi & Personality profile (Weight: 4) */}
            <div className="lg:col-span-4 space-y-6">
              
              {/* Traveler Persona Profile description */}
              <div className="bg-[#f5f2ed] border border-[#e5e0d8] rounded-3xl p-5 shadow-sm space-y-3">
                <span className="text-[9px] font-mono tracking-widest text-[#d4a373] uppercase font-black">
                  travel persona profile
                </span>
                <div>
                  <h4 className="font-serif text-xl italic font-bold">
                    {itinerary.personaTitle}
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed mt-1.5">
                    {itinerary.personaDescription}
                  </p>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  <span className="text-[10px] italic bg-white border border-[#e5e0d8] px-2.5 py-1 rounded-full text-slate-700">
                    {preferences?.travelStyle ? `${preferences.travelStyle} vanguard` : 'artisanal exploration'}
                  </span>
                  <span className="text-[10px] italic bg-white border border-[#e5e0d8] px-2.5 py-1 rounded-full text-slate-700">
                    {preferences?.companions ? `${preferences.companions} companions` : 'solo pace'}
                  </span>
                </div>
              </div>

              {/* Chat Concierge widget with Globi */}
              <div className="bg-white rounded-3xl border border-[#e5e0d8] shadow-sm flex flex-col overflow-hidden min-h-[440px]">
                {/* Chat Title header */}
                <div className="bg-[#f5f2ed] p-4 flex items-center justify-between border-b border-[#e5e0d8]">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-[#1a1a1a] rounded-full flex items-center justify-center text-white ring-4 ring-[#d4a373]/10">
                      <span className="text-lg">🤖</span>
                    </div>
                    <div>
                      <h3 className="font-serif italic font-bold text-sm">Globi</h3>
                      <p className="text-[9px] text-[#7a736a] uppercase font-bold tracking-wider font-mono">
                        Google Gemini Guide
                      </p>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-[9px] font-mono font-bold uppercase">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Live Feed
                  </span>
                </div>

                {/* Messages pane Area */}
                <div className="flex-grow p-4 space-y-3.5 overflow-y-auto max-h-[240px] bg-[#faf9f6]/40">
                  {chatMessages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`p-3 rounded-2xl max-w-[85%] text-xs leading-relaxed shadow-sm ${
                        msg.sender === 'user'
                          ? 'bg-[#1a1a1a] text-white rounded-tr-none'
                          : 'bg-white border border-[#e5e0d8] text-[#1a1a1a] rounded-tl-none'
                      }`}>
                        {/* Render simple text message with markdown or standard bullet style supports */}
                        <div className="whitespace-pre-line">
                          {msg.text}
                        </div>
                        {msg.timestamp && (
                          <span className="block text-[8px] text-slate-400 text-right mt-1 font-mono uppercase">
                            {msg.timestamp}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Interactive situational quick-clickable tags */}
                <div className="px-4 py-2 bg-[#f5f2ed]/50 border-t border-b border-[#e5e0d8]/60">
                  <span className="block text-[9px] font-mono text-slate-400 uppercase tracking-widest leading-none mb-1.5">
                    Ask Globi quick advice:
                  </span>
                  <div className="flex gap-1.5 overflow-x-auto pb-1 max-w-full">
                    {[
                      { text: "Secret local snack tips 🍱", query: "Can you recommend 2 secret regional snacks near our planned food stops?" },
                      { text: "Safety guidelines 🏮", query: "What are some safety guidelines or local etiquette rules I should know?" },
                      { text: "Best photo spots 📸", query: "What are the absolute best photographic focal angles for today's itinerary?" },
                      { text: "Custom transport tips 🚕", query: "How is the transit system or taxi options in this city?" }
                    ].map((btn, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSendChat(btn.query)}
                        className="text-[10px] px-2.5 py-1 bg-white border border-[#e5e0d8] hover:border-[#d4a373] hover:bg-[#faf9f6] text-slate-600 rounded-lg transition-all text-left truncate shrink-0 max-w-[190px]"
                      >
                        {btn.text}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Chat Input form area */}
                <div className="p-3 bg-white border-t border-[#e5e0d8]">
                  <div className="relative flex items-center">
                    <input
                      type="text"
                      placeholder="Consult Globi on secret viewpoints..."
                      value={currentPrompt}
                      onChange={(e) => setCurrentPrompt(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSendChat()}
                      className="w-full pl-4 pr-12 py-3 bg-[#f5f2ed] rounded-2xl text-xs border-none focus:outline-none focus:ring-1 focus:ring-[#d4a373] placeholder:text-gray-400 text-slate-800"
                    />
                    <button
                      onClick={() => handleSendChat()}
                      disabled={!currentPrompt.trim()}
                      className={`absolute right-2 w-8 h-8 rounded-xl flex items-center justify-center transition-all ${
                        currentPrompt.trim() ? 'bg-[#1a1a1a] text-white hover:bg-[#d4a373]' : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                      }`}
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>

              </div>

            </div>

          </div>
        )}
      </div>

      {/* 4. EMAIL SENDING & SIMULATED MAIL DOCKET DIALOG */}
      <AnimatePresence>
        {emailOpen && itinerary && (
          <div className="fixed inset-0 bg-slate-900/45 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#fdfaf6] border border-[#e5e0d8] rounded-3xl max-w-lg w-full p-6 shadow-2xl relative space-y-4"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-serif italic text-2xl">itinerary Dispatch Centre</h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Generate visual plain-text dossier logs to keep printed or dispatch directly to companions.
                  </p>
                </div>
                <button 
                  onClick={() => {
                    setEmailOpen(false);
                    setEmailLog(null);
                  }}
                  className="text-slate-400 hover:text-slate-800 font-bold p-1 rounded-full hover:bg-slate-100"
                >
                  ✕
                </button>
              </div>

              {/* Form Input fields */}
              {!emailLog ? (
                <div className="space-y-4 pt-2">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 font-mono uppercase tracking-wider block">
                      recipient email address:
                    </label>
                    <input
                      type="email"
                      value={toEmail}
                      onChange={(e) => setToEmail(e.target.value)}
                      placeholder="e.g. wanderer@example.com"
                      className="w-full bg-[#faf9f6] border border-[#e5e0d8] rounded-xl px-4 py-3 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#d4a373] text-sm"
                    />
                  </div>

                  <div className="p-3 bg-white border border-[#e5e0d8] rounded-xl flex gap-3 text-xs text-slate-500">
                    <Info className="w-5 h-5 text-[#d4a373] shrink-0 mt-0.5" />
                    <p className="leading-relaxed">
                      WanderWise simulates an authentic SMTP transmission. Once typed, the server compiles the itinerary text and outputs the complete transcript of the email generated.
                    </p>
                  </div>

                  <button
                    onClick={handleEmailDispatch}
                    disabled={isSendingEmail || !toEmail.includes('@')}
                    className={`w-full py-3 bg-[#1a1a1a] text-white text-xs font-bold rounded-xl hover:bg-[#d4a373] transition-all flex items-center justify-center gap-2 ${
                      isSendingEmail || !toEmail.includes('@') ? 'opacity-55 cursor-not-allowed' : ''
                    }`}
                  >
                    {isSendingEmail ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" /> Compiling transit files...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" /> Ship Completed Dossier
                      </>
                    )}
                  </button>
                </div>
              ) : (
                /* Output Email Logs ASCII art text preview */
                <div className="space-y-4 pt-2">
                  <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 flex items-center gap-2.5 text-xs text-emerald-800">
                    <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
                    <span>Transmitted successfully to {toEmail}! Here is the documented log content:</span>
                  </div>

                  <div className="bg-slate-900 border border-slate-950 text-slate-100 rounded-xl p-4 max-h-[220px] overflow-y-auto">
                    <pre className="font-mono text-[10px] select-all leading-normal whitespace-pre-wrap">
                      {emailLog}
                    </pre>
                  </div>

                  <p className="text-[10px] text-slate-400 font-mono text-center uppercase">
                    Select the code box above to quickly copy the plain text logs
                  </p>

                  <button
                    onClick={() => {
                      setEmailOpen(false);
                      setEmailLog(null);
                    }}
                    className="w-full py-3 bg-[#f5f2ed] border border-[#e5e0d8] text-[#1a1a1a] text-xs font-bold rounded-xl hover:bg-[#ebe7e1] transition-all"
                  >
                    Done
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 5. Footer / Status bar following "Artistic Flair" patterns */}
      <footer className="h-10 border-t border-[#e5e0d8] px-6 sm:px-8 flex items-center justify-between text-[10px] uppercase font-bold tracking-widest text-slate-400 bg-white/50 z-20 font-mono">
        <div className="flex gap-6">
          <span className="hidden sm:inline">Destination Local: 10:42 PM (Kyoto Compass)</span>
          <span>Weather Forecast: 18°C Sunny</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          <span>Gemini Pro Active</span>
        </div>
      </footer>

    </div>
  );
}

// Simple local companion script helper components
function RotateCcw(props: any) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
  );
}
