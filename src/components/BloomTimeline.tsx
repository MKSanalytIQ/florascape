import React, { useState } from 'react';
import { 
  Calendar, 
  Sparkles, 
  HeartHandshake, 
  Scissors, 
  ShieldCheck, 
  Sun, 
  CloudSnow, 
  Leaf, 
  Flower 
} from 'lucide-react';
import { GardenPlan } from '../types/garden';

interface BloomTimelineProps {
  garden: GardenPlan;
}

export const BloomTimeline: React.FC<BloomTimelineProps> = ({ garden }) => {
  const [activeSeasonTab, setActiveSeasonTab] = useState<'spring' | 'summer' | 'autumn' | 'winter'>('spring');

  const seasonIcons = {
    'Early Spring': '🌱',
    'Late Spring': '🌷',
    'Early Summer': '🌸',
    'Mid Summer': '☀️',
    'Autumn': '🍁',
    'Winter Interest': '❄️',
  };

  return (
    <div className="space-y-8">
      {/* 1. Seasonal Bloom Progression */}
      <div className="bg-[#0f291e] border border-emerald-800/70 rounded-2xl p-6 shadow-xl text-white space-y-6">
        <div>
          <div className="flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-emerald-400" />
            <h2 className="font-serif text-2xl font-bold">Seasonal Bloom & Interest Timeline</h2>
          </div>
          <p className="text-xs text-emerald-300/80 mt-1">
            Experience the year-round metamorphosis of your garden across seasons
          </p>
        </div>

        {/* Timeline Horizontal Drifts */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {garden.bloomTimeline.map((item, idx) => (
            <div
              key={idx}
              className="bg-[#143628] border border-emerald-800/60 rounded-xl p-4 space-y-3 relative overflow-hidden"
            >
              <div className="flex items-center justify-between">
                <span className="font-serif font-bold text-base text-emerald-100 flex items-center space-x-2">
                  <span className="text-lg">
                    {seasonIcons[item.season as keyof typeof seasonIcons] || '🌿'}
                  </span>
                  <span>{item.season}</span>
                </span>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-emerald-900 text-emerald-300">
                  Phase {idx + 1}
                </span>
              </div>

              {/* Key Highlights */}
              <p className="text-xs text-emerald-200/90 leading-relaxed bg-[#0f291e] p-2.5 rounded-lg border border-emerald-800/40">
                {item.keyHighlights}
              </p>

              {/* Active Plants */}
              <div>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-emerald-400 block mb-1.5">
                  Floral / Structural Highlights:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {item.plantsInBloom.map((p, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded-md text-[11px] bg-emerald-800/60 text-emerald-200 border border-emerald-700/40"
                    >
                      {p}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Companion Planting Matrix */}
      <div className="bg-[#0f291e] border border-emerald-800/70 rounded-2xl p-6 shadow-xl text-white space-y-4">
        <div>
          <div className="flex items-center space-x-2">
            <HeartHandshake className="w-5 h-5 text-emerald-400" />
            <h2 className="font-serif text-2xl font-bold">Companion Planting Synergies</h2>
          </div>
          <p className="text-xs text-emerald-300/80 mt-1">
            Ecological plant pairings engineered for organic pest deterrence, microclimate shading, and nutrient cycling
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {garden.companionPairs.map((pair, idx) => (
            <div
              key={idx}
              className="bg-[#143628] border border-emerald-800/60 rounded-xl p-4 space-y-2.5"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-sm font-semibold text-white">
                  <span>{pair.plantA}</span>
                  <span className="text-emerald-400 font-bold">&</span>
                  <span>{pair.plantB}</span>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-900 text-emerald-300 border border-emerald-700/50">
                  {pair.relationship}
                </span>
              </div>
              <p className="text-xs text-emerald-200/90 leading-relaxed bg-[#0f291e] p-3 rounded-lg border border-emerald-800/40">
                {pair.reason}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Horticultural Seasonal Maintenance Tasks */}
      <div className="bg-[#0f291e] border border-emerald-800/70 rounded-2xl p-6 shadow-xl text-white space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Scissors className="w-5 h-5 text-emerald-400" />
            <h2 className="font-serif text-2xl font-bold">Seasonal Care & Maintenance Calendar</h2>
          </div>

          {/* Season Switcher */}
          <div className="flex rounded-xl bg-[#143628] p-1 border border-emerald-800/60">
            {(['spring', 'summer', 'autumn', 'winter'] as const).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setActiveSeasonTab(s)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                  activeSeasonTab === s
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-emerald-300 hover:text-white'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Task Cards */}
        <div className="bg-[#143628] rounded-xl p-4 border border-emerald-800/60">
          <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-300 mb-3 flex items-center space-x-2">
            <span>Essential {activeSeasonTab} Tasks for {garden.title}</span>
          </h3>

          <ul className="space-y-2.5">
            {garden.maintenanceTips[activeSeasonTab]?.map((tip, idx) => (
              <li
                key={idx}
                className="flex items-start space-x-3 text-xs text-emerald-100 bg-[#0f291e] p-3 rounded-lg border border-emerald-800/40"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
