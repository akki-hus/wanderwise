/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { MapPin, Compass, Navigation, Eye, CheckCircle } from 'lucide-react';
import { Itinerary, Activity } from '../types';

interface InteractiveMapProps {
  itinerary: Itinerary;
  visitedActivityIds: string[];
  activeActivityId: string | null;
  onActivitySelect: (activityId: string) => void;
}

export default function InteractiveMap({ 
  itinerary, 
  visitedActivityIds, 
  activeActivityId, 
  onActivitySelect 
}: InteractiveMapProps) {
  const [selectedPin, setSelectedPin] = useState<Activity | null>(null);

  // Compile all activities into a flat sequenced array
  const allActivities: { activity: Activity; dayNum: number; seqIndex: number }[] = [];
  let index = 1;
  itinerary.days.forEach((day) => {
    day.activities.forEach((act) => {
      allActivities.push({
        activity: act,
        dayNum: day.dayNumber,
        seqIndex: index++
      });
    });
  });

  const handlePinClick = (act: Activity) => {
    setSelectedPin(act);
    onActivitySelect(act.id);
  };

  // Find currently selected activity from activeActivityId prop
  const currentHighlighted = allActivities.find(a => a.activity.id === activeActivityId)?.activity || selectedPin || allActivities[0]?.activity;

  return (
    <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm flex flex-col h-full justify-between" id="interactive-map-root">
      {/* Header Info */}
      <div className="mb-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5 font-display">
            <Compass className="w-4 h-4 text-brand-500 animate-spin" style={{ animationDuration: '6s' }} /> WanderWise Geographic Projection
          </h3>
          <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full font-mono font-medium">
            GRID PROJECTION: COMPASS REF
          </span>
        </div>
        <p className="text-xs text-slate-400 mt-1">
          Interactive coordinate canvas plotting planned paths. Green markers represent visited milestones.
        </p>
      </div>

      {/* SVG Canvas Frame */}
      <div className="relative bg-slate-900 border border-slate-950 rounded-2xl overflow-hidden shadow-inner h-[280px] sm:h-[340px] flex-grow flex items-center justify-center">
        {/* Background grid canvas */}
        <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px]" />
        
        {/* Topographic Lines sketched in SVG */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.06]" viewBox="0 0 400 300" preserveAspectRatio="none">
          <path d="M 50 20 Q 150 50 220 15 T 380 90" fill="none" stroke="white" strokeWidth="2.5" />
          <path d="M 10 120 Q 120 170 200 110 T 390 220" fill="none" stroke="white" strokeWidth="1.5" strokeDasharray="4 4" />
          <path d="M 90 280 Q 230 200 320 270" fill="none" stroke="white" strokeWidth="2" />
          <circle cx="200" cy="150" r="110" fill="none" stroke="white" strokeWidth="1" strokeDasharray="2 3" />
          <circle cx="200" cy="150" r="55" fill="none" stroke="white" strokeWidth="1" strokeDasharray="3 5" />
        </svg>

        {/* Dynamic Connected Lines in order */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" viewBox="0 0 100 100" preserveAspectRatio="none">
          {allActivities.length > 1 && allActivities.map((node, i) => {
            if (i === 0) return null;
            const prevNode = allActivities[i - 1];
            const isVisitedPath = visitedActivityIds.includes(node.activity.id) && visitedActivityIds.includes(prevNode.activity.id);

            return (
              <line
                key={`line-${node.activity.id}`}
                x1={`${prevNode.activity.coordinates.x}%`}
                y1={`${prevNode.activity.coordinates.y}%`}
                x2={`${node.activity.coordinates.x}%`}
                y2={`${node.activity.coordinates.y}%`}
                stroke={isVisitedPath ? '#10b981' : '#3b82f6'}
                strokeWidth={isVisitedPath ? '1.5' : '1.2'}
                strokeDasharray={isVisitedPath ? '0' : '4 3'}
                className="transition-all duration-500"
              />
            );
          })}
        </svg>

        {/* Interactive Pins */}
        {allActivities.map((node) => {
          const isVisited = visitedActivityIds.includes(node.activity.id);
          const isActive = activeActivityId === node.activity.id;

          return (
            <button
              key={`pin-${node.activity.id}`}
              onClick={() => handlePinClick(node.activity)}
              className="absolute group z-10 -translate-x-1/2 -translate-y-1/2 cursor-pointer focus:outline-none transition-all duration-300"
              style={{
                left: `${node.activity.coordinates.x}%`,
                top: `${node.activity.coordinates.y}%`,
              }}
            >
              {/* Pulsing ring for active or highlighted status */}
              {(isActive || (selectedPin && selectedPin.id === node.activity.id)) && (
                <span className={`absolute -inset-3 rounded-full animate-ping opacity-25 ${isVisited ? 'bg-emerald-400' : 'bg-blue-400'}`} />
              )}

              {/* Pin bubble */}
              <div className={`shadow-md flex items-center justify-center text-[10px] font-black w-6.5 h-6.5 rounded-full border transition-all duration-300 ${
                isVisited
                  ? 'bg-emerald-500 border-emerald-300 text-white hover:scale-115'
                  : isActive
                    ? 'bg-blue-500 border-white text-white scale-115'
                    : 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700 hover:scale-110'
              }`}>
                {node.seqIndex}
              </div>

              {/* Hover Tooltip name tags */}
              <div className="absolute left-1/2 -translate-x-1/2 bottom-7 hidden group-hover:flex flex-col items-center pointer-events-none z-20 transition-all">
                <div className="bg-slate-950/90 text-[10px] text-white font-medium px-2 py-1 rounded shadow-md whitespace-nowrap border border-slate-800/60 font-sans">
                  Day {node.dayNum}: {node.activity.title}
                </div>
                <div className="w-1.5 h-1.5 bg-slate-950/90 rotate-45 -mt-1 border-r border-b border-slate-800/60" />
              </div>
            </button>
          );
        })}

        {/* Dynamic Cardinal markers and scale indicator */}
        <div className="absolute top-3 left-4 text-[9px] text-slate-500 font-mono">
          N 35.0116° / E 135.7681°
        </div>
        <div className="absolute bottom-3 right-4 flex items-center gap-1.5 text-[9px] text-slate-500 font-mono bg-slate-950/80 px-2 py-0.5 rounded border border-slate-800/50">
          <Navigation className="w-2.5 h-2.5 text-blue-500 fill-blue-500" /> SCALE: 1 UNIT ~ 1.2 KM
        </div>
      </div>

      {/* Pin Highlight Details panel */}
      {currentHighlighted && (
        <div className="mt-4 p-4 bg-slate-50 border border-slate-100/80 rounded-2xl flex items-start gap-3.5 animate-fade-in transition-all">
          <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
            <MapPin className="w-5 h-5" />
          </div>
          <div className="flex-grow space-y-1">
            <span className="inline-flex items-center gap-1 text-[10px] text-slate-400 font-mono uppercase font-bold tracking-wider">
              Selected Attraction • {currentHighlighted.time}
            </span>
            <h4 className="text-xs font-black text-slate-800 font-display">
              {currentHighlighted.title}
            </h4>
            <div className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
              {currentHighlighted.description}
            </div>
            <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-100 mt-1.5">
              <span className="font-medium text-slate-400 font-mono">
                {currentHighlighted.locationName}
              </span>
              <span className="flex items-center gap-1">
                {visitedActivityIds.includes(currentHighlighted.id) ? (
                  <span className="text-emerald-600 font-bold flex items-center gap-0.5"><CheckCircle className="w-3.5 h-3.5 inline" /> Visited</span>
                ) : (
                  <span className="text-blue-600 font-medium">Scheduled</span>
                )}
                {currentHighlighted.estimatedCost > 0 && (
                  <span className="text-slate-500 font-bold font-mono ml-4 text-[10px] bg-slate-100/50 px-1.5 py-0.5 rounded">
                    Est: ${currentHighlighted.estimatedCost}
                  </span>
                )}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
