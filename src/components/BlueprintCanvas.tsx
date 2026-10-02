import React, { useState, useRef } from 'react';
import { 
  Sun, 
  Layers, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Info, 
  Sparkles, 
  Droplets, 
  Maximize2,
  TreeDeciduous,
  Plus,
  Compass
} from 'lucide-react';
import { GardenPlan, GardenPlant, GardenZone, GardenElement } from '../types/garden';

interface BlueprintCanvasProps {
  garden: GardenPlan;
  onSelectPlant: (plant: GardenPlant) => void;
  onAddPlantToMap?: (newPlant: Partial<GardenPlant>) => void;
  onOpenImageStudioWithPrompt?: (prompt: string) => void;
}

export const BlueprintCanvas: React.FC<BlueprintCanvasProps> = ({
  garden,
  onSelectPlant,
  onOpenImageStudioWithPrompt,
}) => {
  const [zoom, setZoom] = useState(1);
  const [sunHour, setSunHour] = useState(12); // 8am to 6pm
  const [showSpreads, setShowSpreads] = useState(true);
  const [showZones, setShowZones] = useState(true);
  const [showGrid, setShowGrid] = useState(true);
  const [hoveredPlant, setHoveredPlant] = useState<GardenPlant | null>(null);
  const [selectedPlantId, setSelectedPlantId] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  const { lengthFt, widthFt } = garden.dimensions;
  const aspectRatio = widthFt / lengthFt; // viewBox width / height

  // Calculate sun shadow angle and length based on sunHour (8 to 18)
  // At 12, shadow is minimal; at 8am shadow is long toward NW; at 5pm shadow is long toward NE
  const shadowAngleDeg = (sunHour - 12) * 20; // -80deg to +80deg
  const shadowLength = Math.max(0.4, Math.abs(sunHour - 12) * 0.4);
  const shadowOpacity = Math.max(0.15, 0.45 - Math.abs(sunHour - 12) * 0.05);

  const handleZoom = (delta: number) => {
    setZoom((prev) => Math.min(2.5, Math.max(0.7, prev + delta)));
  };

  const getSunLabel = (hour: number) => {
    if (hour < 12) return `${hour} AM (Morning Sun)`;
    if (hour === 12) return `12 PM (Midday Overhead)`;
    return `${hour - 12} PM (Afternoon / Golden Hour)`;
  };

  return (
    <div className="flex flex-col lg:flex-row h-full min-h-[640px] bg-[#0c2219] rounded-2xl border border-emerald-800/70 overflow-hidden shadow-2xl">
      {/* Main Canvas Area */}
      <div className="flex-1 flex flex-col relative overflow-hidden">
        {/* Canvas Toolbar */}
        <div className="bg-[#123023] px-4 py-2.5 border-b border-emerald-800/60 flex flex-wrap items-center justify-between gap-3 z-10">
          {/* Garden Dimensions info */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-1.5 text-xs font-semibold text-emerald-300">
              <Compass className="w-4 h-4 text-emerald-400" />
              <span>Scale: {lengthFt}′ × {widthFt}′</span>
              <span className="text-emerald-500">•</span>
              <span className="text-emerald-400/80">{garden.dimensions.totalSqFt} sq ft</span>
            </div>
            <div className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-900/60 text-emerald-300 border border-emerald-700/40">
              {garden.style.toUpperCase()} BLUEPRINT
            </div>
          </div>

          {/* Sun Path Simulator Controller */}
          <div className="flex items-center space-x-2 bg-[#0c2219] px-3 py-1.5 rounded-xl border border-emerald-700/40">
            <Sun className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="text-[11px] font-medium text-emerald-200 hidden md:inline">
              Sun Path:
            </span>
            <input
              type="range"
              min="8"
              max="18"
              step="1"
              value={sunHour}
              onChange={(e) => setSunHour(Number(e.target.value))}
              className="w-20 sm:w-28 accent-amber-400 h-1.5 bg-emerald-950 rounded-lg cursor-pointer"
            />
            <span className="text-[11px] font-mono text-amber-300 w-16 text-right">
              {sunHour > 12 ? `${sunHour - 12} PM` : `${sunHour} ${sunHour === 12 ? 'PM' : 'AM'}`}
            </span>
          </div>

          {/* Layer and Zoom Controls */}
          <div className="flex items-center space-x-1.5">
            <button
              type="button"
              onClick={() => setShowZones(!showZones)}
              title="Toggle Zones"
              className={`px-2 py-1 text-xs rounded-lg border transition-colors ${
                showZones
                  ? 'bg-emerald-700/80 text-white border-emerald-500'
                  : 'bg-[#163a2b] text-emerald-400 border-emerald-800'
              }`}
            >
              Zones
            </button>
            <button
              type="button"
              onClick={() => setShowSpreads(!showSpreads)}
              title="Toggle Plant Canopies"
              className={`px-2 py-1 text-xs rounded-lg border transition-colors ${
                showSpreads
                  ? 'bg-emerald-700/80 text-white border-emerald-500'
                  : 'bg-[#163a2b] text-emerald-400 border-emerald-800'
              }`}
            >
              Canopies
            </button>
            <button
              type="button"
              onClick={() => setShowGrid(!showGrid)}
              title="Toggle Grid"
              className={`px-2 py-1 text-xs rounded-lg border transition-colors ${
                showGrid
                  ? 'bg-emerald-700/80 text-white border-emerald-500'
                  : 'bg-[#163a2b] text-emerald-400 border-emerald-800'
              }`}
            >
              Grid
            </button>

            <div className="h-4 w-px bg-emerald-800 mx-1" />

            <button
              type="button"
              onClick={() => handleZoom(0.15)}
              title="Zoom In"
              className="p-1.5 bg-[#163a2b] hover:bg-[#1f4e3b] text-emerald-200 rounded-lg border border-emerald-800 transition-colors"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => handleZoom(-0.15)}
              title="Zoom Out"
              className="p-1.5 bg-[#163a2b] hover:bg-[#1f4e3b] text-emerald-200 rounded-lg border border-emerald-800 transition-colors"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setZoom(1)}
              title="Reset View"
              className="p-1.5 bg-[#163a2b] hover:bg-[#1f4e3b] text-emerald-200 rounded-lg border border-emerald-800 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Interactive SVG Canvas */}
        <div 
          ref={containerRef}
          className="flex-1 bg-[#102a1e] relative overflow-auto flex items-center justify-center p-4 sm:p-8"
        >
          <div 
            style={{ transform: `scale(${zoom})`, transformOrigin: 'center center' }}
            className="transition-transform duration-150 ease-out shadow-2xl rounded-2xl overflow-hidden border border-emerald-600/40 relative bg-[#133526]"
          >
            {/* SVG Viewport */}
            <svg
              viewBox="0 0 100 100"
              className="w-[320px] h-[320px] sm:w-[540px] sm:h-[540px] md:w-[620px] md:h-[620px] select-none"
              style={{
                filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.5))'
              }}
            >
              <defs>
                {/* Yard Grass Pattern */}
                <pattern id="lawnPattern" width="10" height="10" patternUnits="userSpaceOnUse">
                  <rect width="10" height="10" fill="#184331" />
                  <circle cx="2" cy="2" r="0.8" fill="#1b4d38" opacity="0.6" />
                  <circle cx="7" cy="6" r="0.9" fill="#143c2c" opacity="0.6" />
                  <path d="M 1 9 Q 2 6 3 9 M 6 3 Q 7 1 8 3" stroke="#225d44" strokeWidth="0.5" fill="none" opacity="0.4" />
                </pattern>

                {/* Flagstone Pattern */}
                <pattern id="flagstonePattern" width="12" height="12" patternUnits="userSpaceOnUse">
                  <rect width="12" height="12" fill="#78716c" opacity="0.75" />
                  <rect x="0.5" y="0.5" width="5" height="5" rx="1" fill="#a8a29e" opacity="0.9" stroke="#57534e" strokeWidth="0.3" />
                  <rect x="6" y="0.5" width="5.5" height="5" rx="1" fill="#94a3b8" opacity="0.9" stroke="#57534e" strokeWidth="0.3" />
                  <rect x="0.5" y="6" width="6.5" height="5.5" rx="1" fill="#94a3b8" opacity="0.9" stroke="#57534e" strokeWidth="0.3" />
                  <rect x="7.5" y="6" width="4" height="5.5" rx="1" fill="#cbd5e1" opacity="0.9" stroke="#57534e" strokeWidth="0.3" />
                </pattern>

                {/* Gravel Pattern */}
                <pattern id="gravelPattern" width="6" height="6" patternUnits="userSpaceOnUse">
                  <rect width="6" height="6" fill="#ca8a04" opacity="0.35" />
                  <circle cx="1.5" cy="1.5" r="0.6" fill="#fef08a" opacity="0.8" />
                  <circle cx="4.5" cy="2" r="0.7" fill="#fde047" opacity="0.6" />
                  <circle cx="3" cy="4.5" r="0.5" fill="#fef9c3" opacity="0.8" />
                </pattern>

                {/* Water Pattern */}
                <radialGradient id="waterGrad" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#38bdf8" />
                  <stop offset="70%" stopColor="#0284c7" />
                  <stop offset="100%" stopColor="#0369a1" />
                </radialGradient>

                {/* Drop shadow filter for trees and pergolas */}
                <filter id="shadowFilter" x="-30%" y="-30%" width="160%" height="160%">
                  <feDropShadow 
                    dx={Math.cos((shadowAngleDeg * Math.PI) / 180) * shadowLength * 2} 
                    dy={Math.sin((shadowAngleDeg * Math.PI) / 180) * shadowLength * 2} 
                    stdDeviation="1.5" 
                    floodColor="#000000" 
                    floodOpacity={shadowOpacity} 
                  />
                </filter>
              </defs>

              {/* Garden Boundary Base Lawn */}
              <rect x="0" y="0" width="100" height="100" fill="url(#lawnPattern)" rx="3" />

              {/* Grid Lines */}
              {showGrid && (
                <g stroke="#225d44" strokeWidth="0.25" opacity="0.5">
                  {[10, 20, 30, 40, 50, 60, 70, 80, 90].map((coord) => (
                    <React.Fragment key={coord}>
                      <line x1={coord} y1="0" x2={coord} y2="100" />
                      <line x1="0" y1={coord} x2="100" y2={coord} />
                    </React.Fragment>
                  ))}
                </g>
              )}

              {/* Garden Zones Layer */}
              {showZones && garden.zones.map((zone) => (
                <g key={zone.id}>
                  <rect
                    x={zone.x}
                    y={zone.y}
                    width={zone.width}
                    height={zone.height}
                    rx="4"
                    fill={zone.themeColor}
                    fillOpacity="0.16"
                    stroke={zone.themeColor}
                    strokeWidth="0.6"
                    strokeDasharray="2,2"
                  />
                  <text
                    x={zone.x + 2}
                    y={zone.y + 4.5}
                    fontSize="2.4"
                    fill={zone.themeColor}
                    fontWeight="bold"
                    letterSpacing="0.2"
                    opacity="0.9"
                  >
                    {zone.name}
                  </text>
                </g>
              ))}

              {/* Hardscape & Structural Elements Layer */}
              {garden.elements.map((elem) => {
                if (elem.type === 'pathway') {
                  return (
                    <g key={elem.id} filter="url(#shadowFilter)">
                      <rect
                        x={elem.x}
                        y={elem.y}
                        width={elem.width}
                        height={elem.height}
                        rx="4"
                        fill="url(#flagstonePattern)"
                        stroke="#44403c"
                        strokeWidth="0.5"
                      />
                      <text
                        x={elem.x + elem.width / 2}
                        y={elem.y + elem.height / 2 + 1}
                        fontSize="2.2"
                        textAnchor="middle"
                        fill="#f5f5f4"
                        fontWeight="600"
                        style={{ pointerEvents: 'none' }}
                      >
                        {elem.name}
                      </text>
                    </g>
                  );
                }

                if (elem.type === 'gravel_patio') {
                  return (
                    <g key={elem.id}>
                      <rect
                        x={elem.x}
                        y={elem.y}
                        width={elem.width}
                        height={elem.height}
                        rx="3"
                        fill="url(#gravelPattern)"
                        stroke="#a16207"
                        strokeWidth="0.5"
                      />
                      <text
                        x={elem.x + elem.width / 2}
                        y={elem.y + elem.height / 2 + 1}
                        fontSize="2.2"
                        textAnchor="middle"
                        fill="#fef08a"
                        fontWeight="bold"
                      >
                        {elem.name}
                      </text>
                    </g>
                  );
                }

                if (elem.type === 'water_feature') {
                  return (
                    <g key={elem.id} filter="url(#shadowFilter)">
                      <circle
                        cx={elem.x + elem.width / 2}
                        cy={elem.y + elem.height / 2}
                        r={Math.min(elem.width, elem.height) / 2}
                        fill="url(#waterGrad)"
                        stroke="#0284c7"
                        strokeWidth="0.8"
                      />
                      <circle
                        cx={elem.x + elem.width / 2}
                        cy={elem.y + elem.height / 2}
                        r={Math.min(elem.width, elem.height) / 3.5}
                        fill="none"
                        stroke="#e0f2fe"
                        strokeWidth="0.5"
                        strokeDasharray="1.5,1.5"
                      />
                      <text
                        x={elem.x + elem.width / 2}
                        y={elem.y + elem.height / 2 + 0.8}
                        fontSize="2"
                        textAnchor="middle"
                        fill="#ffffff"
                        fontWeight="bold"
                      >
                        Fountain
                      </text>
                    </g>
                  );
                }

                if (elem.type === 'pergola') {
                  return (
                    <g key={elem.id} filter="url(#shadowFilter)">
                      {/* Pergola posts & crossbeams */}
                      <rect
                        x={elem.x}
                        y={elem.y}
                        width={elem.width}
                        height={elem.height}
                        rx="1"
                        fill="#78350f"
                        fillOpacity="0.25"
                        stroke="#92400e"
                        strokeWidth="0.8"
                      />
                      {/* Cedar slats */}
                      {[0.2, 0.4, 0.6, 0.8].map((ratio, idx) => (
                        <line
                          key={idx}
                          x1={elem.x}
                          y1={elem.y + elem.height * ratio}
                          x2={elem.x + elem.width}
                          y2={elem.y + elem.height * ratio}
                          stroke="#b45309"
                          strokeWidth="0.6"
                        />
                      ))}
                      <text
                        x={elem.x + elem.width / 2}
                        y={elem.y + elem.height / 2 + 1}
                        fontSize="2.2"
                        textAnchor="middle"
                        fill="#fef3c7"
                        fontWeight="bold"
                      >
                        {elem.name}
                      </text>
                    </g>
                  );
                }

                return (
                  <rect
                    key={elem.id}
                    x={elem.x}
                    y={elem.y}
                    width={elem.width}
                    height={elem.height}
                    rx="1.5"
                    fill="#334155"
                    opacity="0.8"
                    stroke="#64748b"
                    strokeWidth="0.5"
                  />
                );
              })}

              {/* Placed Plants Layer */}
              {garden.plants.map((plant) => {
                const isSelected = selectedPlantId === plant.id;
                const isHovered = hoveredPlant?.id === plant.id;

                // Scale spread diameter to percentage of 100 viewBox
                // If yard is lengthFt long, spreadFt / lengthFt * 100 is radius in svg units
                const radiusSvg = Math.max(2.5, (plant.spreadFt / lengthFt) * 50);

                return (
                  <g
                    key={plant.id}
                    onClick={() => {
                      setSelectedPlantId(plant.id);
                      onSelectPlant(plant);
                    }}
                    onMouseEnter={() => setHoveredPlant(plant)}
                    onMouseLeave={() => setHoveredPlant(null)}
                    className="cursor-pointer"
                    style={{ transition: 'all 0.2s' }}
                  >
                    {/* Plant Spread Canopy Circle */}
                    {showSpreads && (
                      <circle
                        cx={plant.x}
                        cy={plant.y}
                        r={radiusSvg}
                        fill={plant.bloomColor || '#22c55e'}
                        fillOpacity={isSelected ? '0.45' : isHovered ? '0.35' : '0.22'}
                        stroke={plant.bloomColor || '#16a34a'}
                        strokeWidth={isSelected ? '0.9' : '0.4'}
                        strokeDasharray={plant.type === 'groundcover' ? '1,1' : 'none'}
                        filter="url(#shadowFilter)"
                      />
                    )}

                    {/* Plant Center Node */}
                    <circle
                      cx={plant.x}
                      cy={plant.y}
                      r={plant.type === 'tree' ? 2.5 : plant.type === 'shrub' ? 2.0 : 1.6}
                      fill={plant.bloomColor || '#15803d'}
                      stroke={isSelected ? '#ffffff' : '#0f291e'}
                      strokeWidth={isSelected ? '0.7' : '0.4'}
                    />

                    {/* Center Icon Indicator */}
                    <circle
                      cx={plant.x}
                      cy={plant.y}
                      r="0.6"
                      fill="#ffffff"
                      opacity="0.9"
                    />

                    {/* Plant Label on Canvas */}
                    <text
                      x={plant.x}
                      y={plant.y + radiusSvg + 2.2}
                      fontSize="1.9"
                      textAnchor="middle"
                      fill="#ffffff"
                      fontWeight={isSelected ? 'bold' : 'normal'}
                      style={{
                        paintOrder: 'stroke',
                        stroke: '#0f291e',
                        strokeWidth: '0.6px',
                        strokeLinejoin: 'round'
                      }}
                    >
                      {plant.commonName}
                    </text>
                  </g>
                );
              })}

              {/* North Arrow Indicator */}
              <g transform="translate(93, 7)">
                <circle cx="0" cy="0" r="4" fill="#0f291e" opacity="0.8" stroke="#10b981" strokeWidth="0.4" />
                <path d="M 0 -3 L 1.8 1.5 L 0 0.8 L -1.8 1.5 Z" fill="#10b981" />
                <text x="0" y="3.2" fontSize="2" textAnchor="middle" fill="#10b981" fontWeight="bold">N</text>
              </g>
            </svg>

            {/* Sun Indicator Floating HUD */}
            <div className="absolute bottom-3 left-3 bg-[#0f291e]/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-emerald-700/50 flex items-center space-x-2 text-xs text-emerald-200">
              <Sun className="w-3.5 h-3.5 text-amber-400" />
              <span>Simulated Sun: <strong>{getSunLabel(sunHour)}</strong></span>
            </div>
          </div>
        </div>

        {/* Hovered Plant Quick Bar */}
        {hoveredPlant && (
          <div className="bg-[#123023] px-4 py-2 border-t border-emerald-800/60 flex items-center justify-between text-xs text-white">
            <div className="flex items-center space-x-3">
              <span
                className="w-3.5 h-3.5 rounded-full shrink-0 border border-white/20"
                style={{ backgroundColor: hoveredPlant.bloomColor }}
              />
              <span className="font-semibold">{hoveredPlant.commonName}</span>
              <span className="italic text-emerald-300">({hoveredPlant.botanicalName})</span>
              <span className="hidden sm:inline text-emerald-400">
                Spread: {hoveredPlant.spreadFt}′ • Height: {hoveredPlant.heightFt}′
              </span>
            </div>
            <div className="flex items-center space-x-2 text-emerald-300">
              <Droplets className="w-3.5 h-3.5 text-sky-400" />
              <span>Water: {hoveredPlant.waterNeed}</span>
            </div>
          </div>
        )}
      </div>

      {/* Side Inspector Drawer */}
      <div className="w-full lg:w-80 bg-[#0f291e] border-t lg:border-t-0 lg:border-l border-emerald-800/70 p-4 overflow-y-auto space-y-4">
        {selectedPlantId ? (
          (() => {
            const plant = garden.plants.find((p) => p.id === selectedPlantId);
            if (!plant) return null;
            return (
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full bg-emerald-900 text-emerald-300 border border-emerald-700/50">
                      {plant.type}
                    </span>
                    <h3 className="font-serif text-lg font-bold text-white mt-1">
                      {plant.commonName}
                    </h3>
                    <p className="text-xs italic text-emerald-300">
                      {plant.botanicalName}
                    </p>
                  </div>
                  <div
                    className="w-7 h-7 rounded-full shadow-md border-2 border-white/30 shrink-0"
                    style={{ backgroundColor: plant.bloomColor }}
                  />
                </div>

                {/* Specs Grid */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-[#143628] p-2.5 rounded-xl border border-emerald-800/50">
                    <span className="text-emerald-400 block text-[10px] uppercase">Mature Spread</span>
                    <span className="font-semibold text-white">{plant.spreadFt} ft diameter</span>
                  </div>
                  <div className="bg-[#143628] p-2.5 rounded-xl border border-emerald-800/50">
                    <span className="text-emerald-400 block text-[10px] uppercase">Mature Height</span>
                    <span className="font-semibold text-white">{plant.heightFt} ft</span>
                  </div>
                  <div className="bg-[#143628] p-2.5 rounded-xl border border-emerald-800/50">
                    <span className="text-emerald-400 block text-[10px] uppercase">Sun Requirement</span>
                    <span className="font-semibold text-white">{plant.sunRequirement}</span>
                  </div>
                  <div className="bg-[#143628] p-2.5 rounded-xl border border-emerald-800/50">
                    <span className="text-emerald-400 block text-[10px] uppercase">Water Appetite</span>
                    <span className="font-semibold text-white">{plant.waterNeed}</span>
                  </div>
                </div>

                {/* Companion Perk */}
                <div className="bg-emerald-950/60 p-3 rounded-xl border border-emerald-700/40 text-xs">
                  <span className="text-emerald-300 font-semibold block mb-1">Companion Planting Role</span>
                  <p className="text-emerald-200/90 leading-relaxed">
                    {plant.companionTips}
                  </p>
                </div>

                {/* Care Summary */}
                <div className="text-xs text-emerald-200/90 space-y-1">
                  <span className="text-emerald-400 font-semibold block text-[11px] uppercase tracking-wider">
                    Care Guidelines
                  </span>
                  <p className="leading-relaxed bg-[#143628] p-2.5 rounded-xl border border-emerald-800/40">
                    {plant.careSummary}
                  </p>
                </div>

                {/* Wildlife & Fragrance Badges */}
                <div className="flex flex-wrap gap-1.5 text-[11px]">
                  {plant.wildlifeFriendly && (
                    <span className="px-2 py-0.5 rounded-md bg-teal-900/60 text-teal-300 border border-teal-700/50">
                      🐝 Bee & Butterfly Host
                    </span>
                  )}
                  {plant.fragrant && (
                    <span className="px-2 py-0.5 rounded-md bg-purple-900/60 text-purple-300 border border-purple-700/50">
                      🌸 Scented Foliage/Bloom
                    </span>
                  )}
                  {plant.edible && (
                    <span className="px-2 py-0.5 rounded-md bg-amber-900/60 text-amber-300 border border-amber-700/50">
                      🥗 Edible / Culinary
                    </span>
                  )}
                </div>

                {plant.toxicityWarning && (
                  <div className="p-2.5 bg-amber-950/60 border border-amber-700/50 rounded-xl text-amber-200 text-xs">
                    ⚠️ {plant.toxicityWarning}
                  </div>
                )}

                {/* Visual Generator Action */}
                {onOpenImageStudioWithPrompt && (
                  <button
                    type="button"
                    onClick={() =>
                      onOpenImageStudioWithPrompt(
                        `Botanical specimen photography of ${plant.commonName} (${plant.botanicalName}), lush ${plant.bloomColor} flowers, vibrant green leaves, dew drops, shallow depth of field, natural morning light, macro lens 8k`
                      )
                    }
                    className="w-full flex items-center justify-center space-x-2 py-2 px-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl text-xs font-semibold shadow-md transition-colors"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Generate AI Visual of this Plant</span>
                  </button>
                )}
              </div>
            );
          })()
        ) : (
          <div className="space-y-4">
            <div>
              <h3 className="font-serif text-base font-bold text-white mb-1">
                Garden Blueprint Guide
              </h3>
              <p className="text-xs text-emerald-300/80 leading-relaxed">
                Click any plant marker on the blueprint to view horticultural specifications, companion synergies, and mature canopy dimensions.
              </p>
            </div>

            {/* Quick Plant List */}
            <div className="space-y-2">
              <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider block">
                Planted Varieties ({garden.plants.length})
              </span>
              <div className="space-y-1.5 max-h-80 overflow-y-auto pr-1">
                {garden.plants.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => setSelectedPlantId(p.id)}
                    className="flex items-center justify-between p-2 rounded-xl bg-[#143628] hover:bg-[#1b4332] cursor-pointer border border-emerald-800/40 transition-colors"
                  >
                    <div className="flex items-center space-x-2.5 min-w-0">
                      <span
                        className="w-3 h-3 rounded-full shrink-0"
                        style={{ backgroundColor: p.bloomColor }}
                      />
                      <div className="truncate">
                        <p className="text-xs font-medium text-white truncate">{p.commonName}</p>
                        <p className="text-[10px] text-emerald-400 italic truncate">{p.botanicalName}</p>
                      </div>
                    </div>
                    <span className="text-[10px] text-emerald-300 font-mono shrink-0">
                      {p.spreadFt}′ spread
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Zones Summary */}
            <div className="space-y-2">
              <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider block">
                Zoned Spaces ({garden.zones.length})
              </span>
              <div className="space-y-1.5">
                {garden.zones.map((z) => (
                  <div key={z.id} className="p-2 rounded-xl bg-[#143628] border border-emerald-800/40 text-xs">
                    <div className="flex items-center space-x-2">
                      <span className="w-2.5 h-2.5 rounded" style={{ backgroundColor: z.themeColor }} />
                      <span className="font-semibold text-white">{z.name}</span>
                    </div>
                    <p className="text-[11px] text-emerald-300/80 mt-1">{z.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
