export type GardenStyle = 
  | 'cottage'
  | 'zen'
  | 'modern'
  | 'mediterranean'
  | 'potager'
  | 'pollinator'
  | 'urban';

export type SunExposure = 'full-sun' | 'partial-sun' | 'full-shade' | 'mixed';
export type SoilType = 'loam' | 'clay' | 'sandy' | 'raised-bed' | 'rocky';
export type MaintenanceLevel = 'low' | 'moderate' | 'high';

export interface GardenPreferences {
  name: string;
  style: GardenStyle;
  lengthFt: number;
  widthFt: number;
  sunExposure: SunExposure;
  hardinessZone: string;
  soilType: SoilType;
  maintenanceLevel: MaintenanceLevel;
  budget: 'budget' | 'moderate' | 'luxury';
  selectedFeatures: string[];
  colorPalette: string[];
  specialNeeds: string[]; // e.g. 'pet-safe', 'deer-resistant', 'edible', 'fragrant'
  customNotes: string;
}

export type PlantType = 'tree' | 'shrub' | 'perennial' | 'annual' | 'climber' | 'groundcover' | 'herb';

export interface GardenPlant {
  id: string;
  commonName: string;
  botanicalName: string;
  type: PlantType;
  x: number; // percentage of garden width (0 - 100)
  y: number; // percentage of garden length (0 - 100)
  spreadFt: number; // mature spread diameter in feet
  heightFt: number;
  sunRequirement: 'Full Sun' | 'Partial Shade' | 'Full Shade' | 'Any';
  waterNeed: 'Low' | 'Moderate' | 'High';
  bloomSeason: string; // e.g. "Late Spring to Mid Summer"
  bloomColor: string; // hex or color name
  foliageColor: string;
  companionTips: string;
  careSummary: string;
  wildlifeFriendly: boolean;
  fragrant: boolean;
  edible: boolean;
  toxicityWarning?: string;
  imageUrl?: string;
}

export interface GardenZone {
  id: string;
  name: string;
  description: string;
  x: number; // percentage (0 - 100)
  y: number; // percentage (0 - 100)
  width: number; // percentage
  height: number; // percentage
  themeColor: string; // for zone boundary/fill in 2D blueprint
  sunLevel: 'full-sun' | 'partial-sun' | 'shade';
  soilNote?: string;
  suggestedActivities: string;
}

export interface GardenElement {
  id: string;
  type: 'pathway' | 'water_feature' | 'pergola' | 'seating' | 'fire_pit' | 'fence' | 'raised_bed' | 'lawn' | 'gravel_patio';
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation?: number;
  description?: string;
}

export interface BloomTimelineItem {
  season: 'Early Spring' | 'Late Spring' | 'Early Summer' | 'Mid Summer' | 'Autumn' | 'Winter Interest';
  plantsInBloom: string[];
  keyHighlights: string;
}

export interface CompanionPair {
  plantA: string;
  plantB: string;
  relationship: 'beneficial' | 'harmful';
  reason: string;
}

export interface ShoppingItem {
  category: 'Plants' | 'Hardscape & Edging' | 'Soil & Mulch' | 'Irrigation & Lighting' | 'Hardware';
  item: string;
  estimatedQuantity: string;
  estimatedCost: string;
  priority: 'Essential' | 'Recommended' | 'Optional';
}

export interface GardenVisualImage {
  id: string;
  url: string;
  prompt: string;
  aspectRatio: string;
  createdAt: string;
  parentImageId?: string;
  editInstruction?: string;
  perspectiveLabel?: string; // e.g. "Main Landscape View", "Pergola Dining View", "Water Feature Close-up"
}

export interface GardenSoundtrack {
  id: string;
  audioUrl: string;
  prompt: string;
  model: 'lyria-3-clip-preview' | 'lyria-3-pro-preview';
  durationLabel: string;
  lyrics?: string;
  createdAt: string;
}

export interface GardenPlan {
  id: string;
  userId?: string;
  title: string;
  tagline: string;
  designNarrative: string;
  style: GardenStyle;
  dimensions: {
    lengthFt: number;
    widthFt: number;
    totalSqFt: number;
  };
  zones: GardenZone[];
  elements: GardenElement[];
  plants: GardenPlant[];
  bloomTimeline: BloomTimelineItem[];
  companionPairs: CompanionPair[];
  shoppingList: ShoppingItem[];
  maintenanceTips: {
    spring: string[];
    summer: string[];
    autumn: string[];
    winter: string[];
  };
  suggestedImagePrompts: {
    perspective: string;
    prompt: string;
  }[];
  visuals: GardenVisualImage[];
  soundtrack?: GardenSoundtrack;
  createdAt: string;
  updatedAt?: string;
}
