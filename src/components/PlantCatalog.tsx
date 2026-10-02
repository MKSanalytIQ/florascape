import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Sparkles, 
  Sun, 
  Droplets, 
  Maximize2, 
  TreePine, 
  Flower2, 
  Sprout, 
  Bug, 
  AlertTriangle 
} from 'lucide-react';
import { GardenPlan, GardenPlant, PlantType } from '../types/garden';

interface PlantCatalogProps {
  garden: GardenPlan;
  onOpenImageStudioWithPrompt: (prompt: string) => void;
  onSelectPlantForBlueprint?: (plant: GardenPlant) => void;
}

export const PlantCatalog: React.FC<PlantCatalogProps> = ({
  garden,
  onOpenImageStudioWithPrompt,
  onSelectPlantForBlueprint,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [filterSun, setFilterSun] = useState<string>('all');

  const filteredPlants = garden.plants.filter((p) => {
    const matchesSearch =
      p.commonName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.botanicalName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.companionTips.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = selectedType === 'all' || p.type === selectedType;
    const matchesSun = filterSun === 'all' || p.sunRequirement.toLowerCase().includes(filterSun.toLowerCase());

    return matchesSearch && matchesType && matchesSun;
  });

  const plantTypes: { id: string; label: string }[] = [
    { id: 'all', label: 'All Plants' },
    { id: 'tree', label: 'Trees' },
    { id: 'shrub', label: 'Shrubs' },
    { id: 'perennial', label: 'Perennials' },
    { id: 'climber', label: 'Climbers' },
    { id: 'groundcover', label: 'Groundcovers' },
    { id: 'herb', label: 'Herbs' },
  ];

  return (
    <div className="space-y-6">
      {/* Header & Filter Controls */}
      <div className="bg-[#0f291e] border border-emerald-800/70 rounded-2xl p-5 shadow-xl text-white">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div>
            <h2 className="font-serif text-2xl font-bold">Botanical Plant Catalog</h2>
            <p className="text-xs text-emerald-300/80">
              Curated flora specifically chosen for {garden.title} ({garden.plants.length} varieties)
            </p>
          </div>

          {/* Search Bar */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-emerald-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search botanical or common name..."
              className="w-full bg-[#143628] border border-emerald-700/50 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-emerald-500 focus:outline-none focus:border-emerald-400"
            />
          </div>
        </div>

        {/* Type Filter Pills */}
        <div className="flex flex-wrap gap-2 pt-2 border-t border-emerald-800/60">
          {plantTypes.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setSelectedType(t.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                selectedType === t.id
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-[#143628] text-emerald-300 hover:text-white hover:bg-[#1b4332]'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Plant Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredPlants.map((plant) => (
          <div
            key={plant.id}
            className="bg-[#0f291e] border border-emerald-800/70 hover:border-emerald-500 rounded-2xl p-5 shadow-xl transition-all flex flex-col justify-between space-y-4"
          >
            <div>
              {/* Top Meta & Color Swatch */}
              <div className="flex items-start justify-between mb-2">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-900/80 text-emerald-300 border border-emerald-700/40">
                    {plant.type}
                  </span>
                  <h3 className="font-serif text-lg font-bold text-white mt-1">
                    {plant.commonName}
                  </h3>
                  <p className="text-xs italic text-emerald-300 font-serif">
                    {plant.botanicalName}
                  </p>
                </div>
                <div
                  className="w-7 h-7 rounded-full shadow-md border-2 border-white/20 shrink-0"
                  style={{ backgroundColor: plant.bloomColor }}
                  title={`Bloom color: ${plant.bloomColor}`}
                />
              </div>

              {/* Physical Specs */}
              <div className="grid grid-cols-2 gap-2 my-3 text-xs">
                <div className="bg-[#143628] p-2 rounded-xl border border-emerald-800/50">
                  <span className="text-emerald-400 block text-[10px] uppercase">Mature Size</span>
                  <span className="font-semibold text-white">
                    {plant.heightFt}′ H × {plant.spreadFt}′ W
                  </span>
                </div>
                <div className="bg-[#143628] p-2 rounded-xl border border-emerald-800/50">
                  <span className="text-emerald-400 block text-[10px] uppercase">Sun & Water</span>
                  <span className="font-semibold text-white truncate block">
                    {plant.sunRequirement} • {plant.waterNeed}
                  </span>
                </div>
              </div>

              {/* Bloom Season */}
              <div className="bg-[#143628] p-2.5 rounded-xl border border-emerald-800/50 text-xs mb-3">
                <span className="text-emerald-400 block text-[10px] uppercase">Bloom / Interest Period</span>
                <span className="font-medium text-emerald-100">{plant.bloomSeason}</span>
              </div>

              {/* Companion Synergy Note */}
              <div className="bg-emerald-950/70 p-3 rounded-xl border border-emerald-700/40 text-xs text-emerald-200/90 leading-relaxed mb-3">
                <span className="text-emerald-300 font-semibold block mb-0.5">Companion Synergy</span>
                {plant.companionTips}
              </div>

              {/* Care Summary */}
              <p className="text-xs text-emerald-300/80 leading-relaxed">
                {plant.careSummary}
              </p>

              {/* Badges */}
              <div className="flex flex-wrap gap-1.5 mt-3 text-[11px]">
                {plant.wildlifeFriendly && (
                  <span className="px-2 py-0.5 rounded-md bg-teal-900/60 text-teal-300 border border-teal-700/50 flex items-center space-x-1">
                    <Bug className="w-3 h-3" />
                    <span>Pollinators</span>
                  </span>
                )}
                {plant.fragrant && (
                  <span className="px-2 py-0.5 rounded-md bg-purple-900/60 text-purple-300 border border-purple-700/50">
                    🌸 Fragrant
                  </span>
                )}
                {plant.edible && (
                  <span className="px-2 py-0.5 rounded-md bg-amber-900/60 text-amber-300 border border-amber-700/50">
                    🥗 Edible
                  </span>
                )}
                {plant.toxicityWarning && (
                  <span className="px-2 py-0.5 rounded-md bg-red-950 text-red-300 border border-red-800 flex items-center space-x-1">
                    <AlertTriangle className="w-3 h-3" />
                    <span>Caution</span>
                  </span>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="pt-3 border-t border-emerald-800/60">
              <button
                type="button"
                onClick={() =>
                  onOpenImageStudioWithPrompt(
                    `Macro botanical specimen photography of ${plant.commonName} (${plant.botanicalName}), vibrant blooming ${plant.bloomColor} flowers, morning dew drops, lush green foliage background, soft golden hour sunlight, architectural botanical illustration quality 8k`
                  )
                }
                className="w-full flex items-center justify-center space-x-2 py-2 px-3 bg-emerald-700/80 hover:bg-emerald-600 text-white rounded-xl text-xs font-semibold shadow-md transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Generate Specimen Visual with AI</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
