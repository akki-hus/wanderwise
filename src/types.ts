/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type TravelStyle = 'adventure' | 'relaxation' | 'cultural' | 'culinary' | 'luxury' | 'budget' | 'mixed';
export type Companions = 'solo' | 'partner' | 'family' | 'friends';

export interface OnboardingPreferences {
  destination: string;
  durationDays: number;
  travelStyle: TravelStyle;
  companions: Companions;
  budgetLimit: number;
  interests: string[];
}

export interface Activity {
  id: string;
  time: string;
  title: string;
  description: string;
  estimatedCost: number;
  locationName: string;
  category: 'food' | 'sightseeing' | 'adventure' | 'shopping' | 'relaxation';
  coordinates: { x: number; y: number }; // Relative position (0-100) for custom visual map representation
  isVisited: boolean;
}

export interface DayPlan {
  dayNumber: number;
  theme: string;
  activities: Activity[];
}

export interface Itinerary {
  destination: string;
  durationDays: number;
  personaTitle: string;        // e.g., "Epicurean Explorer"
  personaDescription: string;  // Profile paragraph of their traveling identity
  days: DayPlan[];
  packingList: string[];
  essentialAdvice: string;
  estimatedTotalCost: number;
}

export interface BudgetItem {
  id: string;
  category: 'lodging' | 'transportation' | 'food' | 'entertainment' | 'shopping' | 'other';
  amount: number;
  description: string;
  date: string;
}

export interface Message {
  id: string;
  sender: 'user' | 'globi';
  text: string;
  timestamp: string;
}
