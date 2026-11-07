import { QUESTIONS, questionById } from '../data/questions';
import { MONSTERS, REGIONS } from '../data/world';
import type { AvatarId, Monster, Question, RegionId, SaveData, Topic } from '../types';

export const SAVE_KEY = 'lexquest.save.v1';
export const TONIC_PRICE = 25;
export const TONIC_HEAL = 2;

export function newSave(name: string, avatar: AvatarId): SaveData {
  return {
    version: 1,
    player: { name, avatar, level: 1, exp: 0, coins: 30 },
    stats: { battles: 0, wins: 0, byTopic: {}, mistakes: [], seen: {}, answered: 0, history: [] },
    progress: { defeated: [], regionsCompleted: [], idiomsDiscovered: [], idiomsCollected: [], riddlesSolved: [] },
    inventory: { tonic: 1 },
    settings: { speechRate: 0.9, reducedMotion: false },
  };
}

// ── Levels ──────────────────────────────────────────────────────────────
export const expToNext = (level: number) => 60 + level * 40;
export const maxHpFor = (level: number) => Math.min(5 + Math.floor((level - 1) / 2), 9);

/** Adds EXP and handles any number of level-ups. */
export function addExp(level: number, exp: number, gained: number) {
  let l = level;
  let e = exp + gained;
  while (e >= expToNext(l)) {
    e -= expToNext(l);
    l += 1;
  }
  return { level: l, exp: e, levelsGained: l - level };
}

// ── Unlocks ─────────────────────────────────────────────────────────────
export const REGION_ORDER: RegionId[] = ['vale', 'ember', 'archive'];

export function isRegionUnlocked(save: SaveData, id: RegionId) {
  const i = REGION_ORDER.indexOf(id);
  return i === 0 || save.progress.regionsCompleted.includes(REGION_ORDER[i - 1]);
}

export const isLoreVaultUnlocked = (save: SaveData) => save.progress.regionsCompleted.includes('ember');

export const ordinaryMonsters = (region: RegionId) =>
  MONSTERS.filter((m) => m.region === region && !m.boss && !m.quest && !m.training);

export function isBossUnlocked(save: SaveData, region: RegionId) {
  return ordinaryMonsters(region).every((m) => save.progress.defeated.includes(m.id));
}

export function isMonsterAvailable(save: SaveData, monster: Monster) {
  if (!isRegionUnlocked(save, monster.region)) return false;
  if (monster.boss) return isBossUnlocked(save, monster.region);
  if (monster.training) return save.stats.mistakes.length > 0;
  return true;
}

// ── Question selection ──────────────────────────────────────────────────
/**
 * Picks the next question for a battle. Prefers the monster's focus topics,
 * never repeats within a battle while unused questions remain, and favours
 * questions not seen recently (spacing).
 */
export function pickQuestion(
  monster: Monster,
  save: SaveData,
  usedThisBattle: string[],
  opts: { kind?: Question['kind']; rand?: () => number } = {},
): Question {
  const rand = opts.rand ?? Math.random;
  let pool: Question[] = monster.training
    ? save.stats.mistakes.map((id) => questionById(id)).filter((q): q is Question => !!q)
    : QUESTIONS.filter((q) => q.region === monster.region);
  if (pool.length === 0) pool = QUESTIONS.filter((q) => q.region === 'vale');
  if (opts.kind) {
    const k = pool.filter((q) => q.kind === opts.kind);
    if (k.length) pool = k;
  }

  const fresh = pool.filter((q) => !usedThisBattle.includes(q.id));
  let candidates = fresh.length ? fresh : pool;
  if (monster.focus && !opts.kind) {
    const focused = candidates.filter((q) => monster.focus!.includes(q.topic));
    if (focused.length) candidates = focused;
  }

  // Least recently seen first (never seen = -1); random tie-break.
  const seen = (q: Question) => save.stats.seen[q.id] ?? -1;
  const oldest = Math.min(...candidates.map(seen));
  // Treat anything seen within a small window of the oldest as "old enough" for variety.
  const tier = candidates.filter((q) => seen(q) <= oldest + 2);
  return tier[Math.floor(rand() * tier.length)];
}

export function shuffle<T>(arr: T[], rand: () => number = Math.random): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ── Recording answers & battles ─────────────────────────────────────────
export function recordAnswer(save: SaveData, q: Question, correct: boolean): SaveData {
  const prev = save.stats.byTopic[q.topic] ?? { correct: 0, total: 0 };
  let mistakes = save.stats.mistakes;
  if (!correct && !mistakes.includes(q.id)) mistakes = [...mistakes, q.id];
  if (correct) mistakes = mistakes.filter((id) => id !== q.id);
  return {
    ...save,
    stats: {
      ...save.stats,
      answered: save.stats.answered + 1,
      seen: { ...save.stats.seen, [q.id]: save.stats.answered },
      mistakes,
      byTopic: { ...save.stats.byTopic, [q.topic]: { correct: prev.correct + (correct ? 1 : 0), total: prev.total + 1 } },
    },
  };
}

/** Records an idiom or riddle attempt in the topic statistics. */
export function recordLore(save: SaveData, topic: 'idioms' | 'riddles', correct: boolean): SaveData {
  const prev = save.stats.byTopic[topic] ?? { correct: 0, total: 0 };
  return {
    ...save,
    stats: { ...save.stats, byTopic: { ...save.stats.byTopic, [topic]: { correct: prev.correct + (correct ? 1 : 0), total: prev.total + 1 } } },
  };
}

export interface BattleOutcome {
  won: boolean;
  correct: number;
  total: number;
  exp: number;
  coins: number;
  levelsGained: number;
  firstClear: boolean;
  regionCleared: RegionId | null;
}

export function computeRewards(monster: Monster, won: boolean, correct: number, total: number, firstClear: boolean) {
  const acc = total ? correct / total : 0;
  if (!won) return { exp: Math.round(monster.exp * 0.25), coins: 0 };
  const exp = Math.round(monster.exp * (0.6 + 0.4 * acc) * (firstClear ? 1.25 : 1));
  const coins = Math.round(monster.coins * (firstClear ? 1.5 : 1));
  return { exp, coins };
}

export function finishBattle(save: SaveData, monster: Monster, won: boolean, correct: number, total: number): { save: SaveData; outcome: BattleOutcome } {
  const firstClear = won && !save.progress.defeated.includes(monster.id) && !monster.training;
  const { exp, coins } = computeRewards(monster, won, correct, total, firstClear);
  const lv = addExp(save.player.level, save.player.exp, exp);
  const defeated = firstClear ? [...save.progress.defeated, monster.id] : save.progress.defeated;
  const regionCleared = won && monster.boss && !save.progress.regionsCompleted.includes(monster.region) ? monster.region : null;
  const next: SaveData = {
    ...save,
    player: { ...save.player, level: lv.level, exp: lv.exp, coins: save.player.coins + coins },
    stats: {
      ...save.stats,
      battles: save.stats.battles + 1,
      wins: save.stats.wins + (won ? 1 : 0),
      history: [{ at: Date.now(), monster: monster.name, won, correct, total }, ...save.stats.history].slice(0, 30),
    },
    progress: {
      ...save.progress,
      defeated,
      regionsCompleted: regionCleared ? [...save.progress.regionsCompleted, regionCleared] : save.progress.regionsCompleted,
    },
  };
  return { save: next, outcome: { won, correct, total, exp, coins, levelsGained: lv.levelsGained, firstClear, regionCleared } };
}

// ── Stats helpers ───────────────────────────────────────────────────────
export function overallAccuracy(save: SaveData) {
  let c = 0;
  let t = 0;
  for (const s of Object.values(save.stats.byTopic)) {
    c += s!.correct;
    t += s!.total;
  }
  return t ? c / t : 0;
}

export function topicAccuracy(save: SaveData, topic: Topic) {
  const s = save.stats.byTopic[topic];
  return s && s.total ? s.correct / s.total : null;
}

export const regionName = (id: RegionId) => REGIONS.find((r) => r.id === id)!.name;
