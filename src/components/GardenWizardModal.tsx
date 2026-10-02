import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  Trees, 
  Sun, 
  Compass, 
  Layers, 
  HeartHandshake, 
  Check, 
  Loader2,
  AlertCircle
} from 'lucide-react';
import { GardenPlan, GardenPreferences, GardenStyle, SoilType, SunExposure } from '../types/garden';

interface GardenWizardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGardenCreated: (newPlan: GardenPlan) => void;
}

const STYLE_OPTIONS: { id: GardenStyle; title: string; description: string; icon: string; colors: string[] }[] = [
  {
    id: 'cottage',
    title: 'English Cottage',
    description: 'Romantic drifts of roses, foxgloves, lavender, and meandering flagstone paths.',
    icon: '🌸',
    colors: ['#f472b6', '#c084fc', '#4ade80']
  },
  {
    id: 'zen',
    title: 'Japanese Zen',
    description: 'Minimalist stillness, sculptural maples, raked river gravel, moss, and stone water basins.',
    icon: '🎋',
    colors: ['#ef4444', '#ca8a04', '#15803d']
  },
  {
    id: 'mediterranean',
    title: 'Mediterranean & Dry',
    description: 'Drought-tolerant silver olive trees, lavender, rosemary, terracotta pots, and limestone gravel.',
    icon: '🫒',
    colors: ['#ca8a04', '#6366f1', '#ea580c']
  },
  {
    id: 'modern',
    title: 'Modern Architectural',
    description: 'Clean geometric lines, evergreen structural hedges, ornamental grasses, and concrete fire features.',
    icon: '🪴',
    colors: ['#334155', '#22c55e', '#f8fafc']
  },
  {
    id: 'potager',
    title: 'Edible Kitchen Potager',
    description: 'Raised cedar garden beds, heirloom tomatoes, fragrant herbs, espalier fruit trees, and edible flowers.',
    icon: '🍅',
    colors: ['#dc2626', '#16a34a', '#eab308']
  },
  {
    id: 'pollinator',
    title: 'Native Pollinator Meadow',
    description: 'Wild biodiversity sanctuary, milkweed, coneflowers, asters, bee hotel, and water sources.',
    icon: '🦋',
    colors: ['#e11d48', '#8b5cf6', '#0284c7']
  },
  {
    id: 'urban',
    title: 'Urban Rooftop & Courtyard',
    description: 'Vertical herb walls, compact containers, atmospheric string lighting, and cozy corner seating.',
    icon: '🌆',
    colors: ['#0d9488', '#f59e0b', '#475569']
  }
];

const FEATURE_OPTIONS = [
  'Flagstone stone pathway',
  'Acoustic water fountain / pond',
  'Cedar timber pergola / arbour',
  'Outdoor dining patio',
  'Raised cedar planter beds',
  'Fire pit lounge area',
  'Pollinator bee hotel / birdbath',
  'Ambient warm string lighting',
  'Herb spiral / edible nook',
  'Privacy evergreen hedge'
];

const SPECIAL_NEEDS_OPTIONS = [
  'Pet-friendly (Non-toxic plants)',
  'Deer-resistant varieties',
  'Child-safe (No thorny brambles)',
  'Fragrant evening aroma',
  'Drought-tolerant / low irrigation',
  'Edible harvest focus'
];

export const GardenWizardModal: React.FC<GardenWizardModalProps> = ({
  isOpen,
  onClose,
  onGardenCreated,
}) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Form states
  const [name, setName] = useState('My Secret Garden');
  const [style, setStyle] = useState<GardenStyle>('cottage');
  const [lengthFt, setLengthFt] = useState(35);
  const [widthFt, setWidthFt] = useState(25);
  const [sunExposure, setSunExposure] = useState<SunExposure>('full-sun');
  const [hardinessZone, setHardinessZone] = useState('Zone 7 (Temperate)');
  const [soilType, setSoilType] = useState<SoilType>('loam');
  const [maintenanceLevel, setMaintenanceLevel] = useState<'low' | 'moderate' | 'high'>('moderate');
  const [budget, setBudget] = useState<'budget' | 'moderate' | 'luxury'>('moderate');
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([
    'Flagstone stone pathway',
    'Cedar timber pergola / arbour',
    'Acoustic water fountain / pond'
  ]);
  const [specialNeeds, setSpecialNeeds] = useState<string[]>([
    'Fragrant evening aroma',
    'Pet-friendly (Non-toxic plants)'
  ]);
  const [customNotes, setCustomNotes] = useState('');

  if (!isOpen) return null;

  const toggleFeature = (feat: string) => {
    setSelectedFeatures((prev) =>
      prev.includes(feat) ? prev.filter((f) => f !== feat) : [...prev, feat]
    );
  };

  const toggleSpecialNeed = (need: string) => {
    setSpecialNeeds((prev) =>
      prev.includes(need) ? prev.filter((n) => n !== need) : [...prev, need]
    );
  };

  const handleGenerate = async () => {
    setLoading(true);
    setErrorMsg(null);

    const preferences: GardenPreferences = {
      name,
      style,
      lengthFt,
      widthFt,
      sunExposure,
      hardinessZone,
      soilType,
      maintenanceLevel,
      budget,
      selectedFeatures,
      colorPalette: [],
      specialNeeds,
      customNotes,
    };

    try {
      const response = await fetch('/api/generate-garden', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(preferences),
      });

      const data = await response.json();
      if (!response.ok || !data.plan) {
        throw new Error(data.error || 'Failed to generate garden blueprint');
      }

      onGardenCreated(data.plan);
      onClose();
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Error communicating with AI landscape engine.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-[#0f291e] border border-emerald-700/60 rounded-2xl shadow-2xl text-white overflow-hidden my-6">
        {/* Header */}
        <div className="bg-[#143628] px-6 py-4 border-b border-emerald-800/60 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-md">
              <Sparkles className="w-5 h-5 text-[#0f291e]" />
            </div>
            <div>
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-white">
                Design Your Dream Garden
              </h2>
              <p className="text-xs text-emerald-300">
                AI creates architectural 2D zoning, plant layout, and photographic prompts
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="text-emerald-400 hover:text-white p-1 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Indicator */}
        <div className="px-6 py-3 bg-[#0c2219] border-b border-emerald-900/60 flex items-center justify-between text-xs font-medium text-emerald-400">
          <div className="flex items-center space-x-2">
            <span className={`px-2 py-0.5 rounded-full ${step === 1 ? 'bg-emerald-500 text-[#0f291e] font-bold' : 'bg-emerald-900 text-emerald-400'}`}>
              1
            </span>
            <span className={step === 1 ? 'text-white font-semibold' : ''}>Style & Dimensions</span>
          </div>
          <div className="w-8 h-px bg-emerald-800/80" />
          <div className="flex items-center space-x-2">
            <span className={`px-2 py-0.5 rounded-full ${step === 2 ? 'bg-emerald-500 text-[#0f291e] font-bold' : 'bg-emerald-900 text-emerald-400'}`}>
              2
            </span>
            <span className={step === 2 ? 'text-white font-semibold' : ''}>Sun, Soil & Climate</span>
          </div>
          <div className="w-8 h-px bg-emerald-800/80" />
          <div className="flex items-center space-x-2">
            <span className={`px-2 py-0.5 rounded-full ${step === 3 ? 'bg-emerald-500 text-[#0f291e] font-bold' : 'bg-emerald-900 text-emerald-400'}`}>
              3
            </span>
            <span className={step === 3 ? 'text-white font-semibold' : ''}>Features & Wishes</span>
          </div>
        </div>

        {/* Form Body */}
        <div className="p-6 max-h-[68vh] overflow-y-auto space-y-6">
          {errorMsg && (
            <div className="p-3 bg-red-950/80 border border-red-700/60 rounded-xl text-red-200 text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* STEP 1 */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-emerald-300 mb-1.5">
                  Garden Project Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., The Lavender Hearth, Morning Tea Courtyard"
                  className="w-full bg-[#163a2b] border border-emerald-700/50 rounded-xl px-4 py-2.5 text-sm text-white placeholder-emerald-500/60 focus:outline-none focus:border-emerald-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-emerald-300 mb-2">
                  Select Design Style Archetype
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {STYLE_OPTIONS.map((opt) => {
                    const isSelected = style === opt.id;
                    return (
                      <div
                        key={opt.id}
                        onClick={() => setStyle(opt.id)}
                        className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-[#1b4332] border-emerald-400 ring-2 ring-emerald-400/30 shadow-md'
                            : 'bg-[#143628] border-emerald-800/70 hover:border-emerald-600'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <div className="flex items-center space-x-2">
                            <span className="text-xl">{opt.icon}</span>
                            <span className="font-semibold text-sm text-white">{opt.title}</span>
                          </div>
                          {isSelected && <Check className="w-4 h-4 text-emerald-400" />}
                        </div>
                        <p className="text-xs text-emerald-200/80 leading-relaxed mb-2">
                          {opt.description}
                        </p>
                        <div className="flex space-x-1.5">
                          {opt.colors.map((c, i) => (
                            <span
                              key={i}
                              className="w-3.5 h-3.5 rounded-full border border-black/30"
                              style={{ backgroundColor: c }}
                            />
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-emerald-300 mb-2">
                  Yard Dimensions (Feet)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  <div className="bg-[#143628] p-3 rounded-xl border border-emerald-800/60">
                    <span className="text-xs text-emerald-300 block mb-1">Length</span>
                    <div className="flex items-center space-x-2">
                      <input
                        type="number"
                        min="10"
                        max="200"
                        value={lengthFt}
                        onChange={(e) => setLengthFt(Number(e.target.value))}
                        className="w-full bg-[#1b4332] border border-emerald-700/50 rounded-lg px-2.5 py-1.5 text-sm font-mono text-white text-center"
                      />
                      <span className="text-xs text-emerald-400">ft</span>
                    </div>
                  </div>

                  <div className="bg-[#143628] p-3 rounded-xl border border-emerald-800/60">
                    <span className="text-xs text-emerald-300 block mb-1">Width</span>
                    <div className="flex items-center space-x-2">
                      <input
                        type="number"
                        min="10"
                        max="200"
                        value={widthFt}
                        onChange={(e) => setWidthFt(Number(e.target.value))}
                        className="w-full bg-[#1b4332] border border-emerald-700/50 rounded-lg px-2.5 py-1.5 text-sm font-mono text-white text-center"
                      />
                      <span className="text-xs text-emerald-400">ft</span>
                    </div>
                  </div>

                  <div className="col-span-2 sm:col-span-1 bg-[#143628] p-3 rounded-xl border border-emerald-800/60 flex flex-col justify-center">
                    <span className="text-xs text-emerald-300 block mb-1">Total Footprint</span>
                    <span className="font-serif text-lg font-bold text-emerald-300">
                      {(lengthFt * widthFt).toLocaleString()} <span className="text-xs font-sans font-normal text-emerald-400">sq ft</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <div className="space-y-6">
              {/* Sunlight Exposure */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-emerald-300 mb-2">
                  Daily Sunlight Exposure
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { id: 'full-sun', label: 'Full Sun', sub: '6+ hours direct sun', icon: '☀️' },
                    { id: 'partial-sun', label: 'Partial Sun', sub: '3 to 6 hours sun', icon: '⛅' },
                    { id: 'full-shade', label: 'Deep Shade', sub: 'Under dense trees / walls', icon: '🌲' },
                    { id: 'mixed', label: 'Mixed Canopy', sub: 'Dappled light zones', icon: '🍃' },
                  ].map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setSunExposure(s.id as SunExposure)}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        sunExposure === s.id
                          ? 'bg-[#1b4332] border-emerald-400 ring-2 ring-emerald-400/20'
                          : 'bg-[#143628] border-emerald-800/70 hover:border-emerald-600'
                      }`}
                    >
                      <div className="text-xl mb-1">{s.icon}</div>
                      <div className="text-sm font-semibold text-white">{s.label}</div>
                      <div className="text-[11px] text-emerald-300/80">{s.sub}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Hardiness Zone & Soil */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-emerald-300 mb-1.5">
                    Climate / Hardiness Zone
                  </label>
                  <select
                    value={hardinessZone}
                    onChange={(e) => setHardinessZone(e.target.value)}
                    className="w-full bg-[#163a2b] border border-emerald-700/50 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-400"
                  >
                    <option value="Zone 4 (Cold Winters, -30°F)">Zone 4 (Cold Winters, -30°F)</option>
                    <option value="Zone 5 (Continental, -20°F)">Zone 5 (Continental, -20°F)</option>
                    <option value="Zone 6 (Cool Temperate, -10°F)">Zone 6 (Cool Temperate, -10°F)</option>
                    <option value="Zone 7 (Temperate 4-Season, 0°F)">Zone 7 (Temperate 4-Season, 0°F)</option>
                    <option value="Zone 8 (Mild Winter & Warm Summer, 10°F)">Zone 8 (Mild Winter & Warm Summer, 10°F)</option>
                    <option value="Zone 9 (Mediterranean / Subtropical, 20°F)">Zone 9 (Mediterranean / Subtropical, 20°F)</option>
                    <option value="Zone 10 (Tropical / Frost-Free, 30°F)">Zone 10 (Tropical / Frost-Free, 30°F)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-emerald-300 mb-1.5">
                    Native Soil Type
                  </label>
                  <select
                    value={soilType}
                    onChange={(e) => setSoilType(e.target.value as SoilType)}
                    className="w-full bg-[#163a2b] border border-emerald-700/50 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-400"
                  >
                    <option value="loam">Rich Garden Loam (Balanced & fertile)</option>
                    <option value="clay">Heavy Clay (Moisture-retentive)</option>
                    <option value="sandy">Sandy Soil (Fast draining, low nutrients)</option>
                    <option value="raised-bed">Raised Beds / Premium Potting Mix</option>
                    <option value="rocky">Rocky / Alkaline Stony Soil</option>
                  </select>
                </div>
              </div>

              {/* Maintenance & Budget */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-emerald-300 mb-1.5">
                    Maintenance Appetite
                  </label>
                  <div className="flex rounded-xl bg-[#143628] p-1 border border-emerald-800/70">
                    {(['low', 'moderate', 'high'] as const).map((m) => (
                      <button
                        key={m}
                        type="button"
                        onClick={() => setMaintenanceLevel(m)}
                        className={`flex-1 py-1.5 text-xs font-semibold rounded-lg capitalize transition-colors ${
                          maintenanceLevel === m
                            ? 'bg-emerald-600 text-white shadow-sm'
                            : 'text-emerald-300 hover:text-white'
                        }`}
                      >
                        {m === 'low' ? 'Low & Easy' : m === 'moderate' ? 'Weekend' : 'Enthusiast'}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-emerald-300 mb-1.5">
                    Budget Preference
                  </label>
                  <div className="flex rounded-xl bg-[#143628] p-1 border border-emerald-800/70">
                    {(['budget', 'moderate', 'luxury'] as const).map((b) => (
                      <button
                        key={b}
                        type="button"
                        onClick={() => setBudget(b)}
                        className={`flex-1 py-1.5 text-xs font-semibold rounded-lg capitalize transition-colors ${
                          budget === b
                            ? 'bg-emerald-600 text-white shadow-sm'
                            : 'text-emerald-300 hover:text-white'
                        }`}
                      >
                        {b}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <div className="space-y-6">
              {/* Features Desired */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-emerald-300 mb-2">
                  Living & Hardscape Elements to Include
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {FEATURE_OPTIONS.map((feat) => {
                    const isChecked = selectedFeatures.includes(feat);
                    return (
                      <button
                        key={feat}
                        type="button"
                        onClick={() => toggleFeature(feat)}
                        className={`px-3 py-2 rounded-xl text-xs font-medium text-left border flex items-center space-x-2 transition-all ${
                          isChecked
                            ? 'bg-[#1b4332] border-emerald-400 text-white'
                            : 'bg-[#143628] border-emerald-800/60 text-emerald-300 hover:border-emerald-600'
                        }`}
                      >
                        <div className={`w-3.5 h-3.5 rounded flex items-center justify-center shrink-0 border ${
                          isChecked ? 'bg-emerald-500 border-emerald-400 text-[#0f291e]' : 'border-emerald-600'
                        }`}>
                          {isChecked && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                        </div>
                        <span className="truncate">{feat}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Special Considerations */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-emerald-300 mb-2">
                  Special Considerations & Lifestyle
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {SPECIAL_NEEDS_OPTIONS.map((need) => {
                    const isChecked = specialNeeds.includes(need);
                    return (
                      <button
                        key={need}
                        type="button"
                        onClick={() => toggleSpecialNeed(need)}
                        className={`px-3 py-2 rounded-xl text-xs font-medium text-left border flex items-center space-x-2 transition-all ${
                          isChecked
                            ? 'bg-[#1b4332] border-emerald-400 text-white'
                            : 'bg-[#143628] border-emerald-800/60 text-emerald-300 hover:border-emerald-600'
                        }`}
                      >
                        <div className={`w-3.5 h-3.5 rounded flex items-center justify-center shrink-0 border ${
                          isChecked ? 'bg-emerald-500 border-emerald-400 text-[#0f291e]' : 'border-emerald-600'
                        }`}>
                          {isChecked && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                        </div>
                        <span className="truncate">{need}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Custom Personal Notes */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-emerald-300 mb-1.5">
                  Any Specific Dreams or Favorite Plants?
                </label>
                <textarea
                  rows={3}
                  value={customNotes}
                  onChange={(e) => setCustomNotes(e.target.value)}
                  placeholder="e.g., I'd love a weeping cherry or lilac tree near the bench, climbing sweet peas on the arbour, and lots of soft purple flowers that attract bumblebees."
                  className="w-full bg-[#163a2b] border border-emerald-700/50 rounded-xl px-4 py-2 text-sm text-white placeholder-emerald-500/60 focus:outline-none focus:border-emerald-400"
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        <div className="bg-[#143628] px-6 py-4 border-t border-emerald-800/60 flex items-center justify-between">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep((s) => (s - 1) as any)}
              disabled={loading}
              className="px-4 py-2 rounded-xl border border-emerald-700/50 text-emerald-300 hover:text-white hover:bg-emerald-800/40 text-sm font-medium transition-colors"
            >
              Previous
            </button>
          ) : (
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 rounded-xl border border-emerald-700/50 text-emerald-400 hover:text-white text-sm font-medium transition-colors"
            >
              Cancel
            </button>
          )}

          {step < 3 ? (
            <button
              type="button"
              onClick={() => setStep((s) => (s + 1) as any)}
              className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm transition-colors shadow-md"
            >
              Next Step
            </button>
          ) : (
            <button
              type="button"
              onClick={handleGenerate}
              disabled={loading}
              className="flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-[#0f291e] font-bold text-sm shadow-lg shadow-emerald-950/60 transition-all transform active:scale-95 disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-[#0f291e]" />
                  <span>Designing Your Garden...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-[#0f291e]" />
                  <span>Generate Dream Garden</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
