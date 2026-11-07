import { SAVE_KEY } from '../game/engine';
import type { SaveData } from '../types';

export function loadSave(): SaveData | null {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw) as SaveData;
    return data && data.version === 1 && data.player ? data : null;
  } catch {
    return null;
  }
}

export function writeSave(data: SaveData | null) {
  try {
    if (data) localStorage.setItem(SAVE_KEY, JSON.stringify(data));
    else localStorage.removeItem(SAVE_KEY);
  } catch {
    /* storage unavailable (private mode); the game still runs for this session */
  }
}
