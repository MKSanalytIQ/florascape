import { GardenPlan } from '../types/garden';
import { PRESET_GARDENS } from '../data/presetGardens';

const STORAGE_KEY = 'florascape_saved_gardens_v1';
const ACTIVE_GARDEN_ID_KEY = 'florascape_active_garden_id_v1';

export function getSavedGardens(): GardenPlan[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(PRESET_GARDENS));
      return PRESET_GARDENS;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(PRESET_GARDENS));
      return PRESET_GARDENS;
    }
    return parsed;
  } catch (e) {
    console.error('Failed to load saved gardens from localStorage', e);
    return PRESET_GARDENS;
  }
}

export function saveGarden(garden: GardenPlan): void {
  try {
    const all = getSavedGardens();
    const index = all.findIndex((g) => g.id === garden.id);
    let updated: GardenPlan[];
    if (index >= 0) {
      updated = [...all];
      updated[index] = garden;
    } else {
      updated = [garden, ...all];
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to save garden to localStorage', e);
  }
}

export function deleteGarden(id: string): GardenPlan[] {
  try {
    const all = getSavedGardens();
    const updated = all.filter((g) => g.id !== id);
    const finalGardens = updated.length > 0 ? updated : PRESET_GARDENS;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(finalGardens));
    return finalGardens;
  } catch (e) {
    console.error('Failed to delete garden', e);
    return PRESET_GARDENS;
  }
}

export function getActiveGardenId(): string {
  try {
    const active = localStorage.getItem(ACTIVE_GARDEN_ID_KEY);
    return active || PRESET_GARDENS[0].id;
  } catch (e) {
    return PRESET_GARDENS[0].id;
  }
}

export function setActiveGardenId(id: string): void {
  try {
    localStorage.setItem(ACTIVE_GARDEN_ID_KEY, id);
  } catch (e) {
    console.error('Failed to set active garden id', e);
  }
}
