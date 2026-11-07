import { TOPIC_LABELS } from '../data/world';
import type { SaveData, Topic } from '../types';
import { isLoreVaultUnlocked, isRegionUnlocked, REGION_ORDER, regionName } from './engine';
import { IDIOMS, RIDDLES } from '../data/lore';

export interface Recommendation {
  id: string;
  title: string;
  action: string;
  /** The rule that produced this recommendation, shown to the player for transparency. */
  rule: string;
  tone: 'focus' | 'stretch' | 'progress';
}

/** Where to practise each topic. */
const PRACTICE: Partial<Record<Topic, string>> = {
  prepositions: 'Fight the Mossling in Verdant Vale (prepositions & articles).',
  articles: 'Fight the Mossling in Verdant Vale (prepositions & articles).',
  tenses: 'Fight the Bramble Imp in Verdant Vale (tenses).',
  agreement: 'Fight the Bramble Imp in Verdant Vale (agreement).',
  collocations: 'Fight the Ash Hound in Emberfall (collocations).',
  'phrasal-verbs': 'Fight the Ash Hound in Emberfall (phrasal verbs).',
  'word-forms': 'Fight the Slag Golem in Emberfall (word forms).',
  linking: 'Fight the Cinder Sprite in Emberfall (linking words).',
  'sentence-structure': 'Fight the Cinder Sprite or Glyph Sentinel (sentence structure).',
  reading: 'Take the side quest "The Lost Ledger" in Emberfall (reading).',
  listening: 'Take the side quest "Voices in the Ash" in Emberfall (listening).',
  writing: 'Take the side quest "The Broken Inscription" in Emberfall (sentence building).',
  vocabulary: 'Fight the Murk Wisp (Vale) or Ink Shade (Archive) for vocabulary.',
  figurative: 'Fight the Page Wraith in the Obsidian Archive (figurative language).',
};

const MIN_ATTEMPTS = 3;
const WEAK = 0.6;
const STRONG = 0.85;

/**
 * Deterministic, rule-based recommendations. No AI is involved: each rule is a
 * simple threshold on the player's own statistics, and the rule text is shown.
 */
export function recommend(save: SaveData): Recommendation[] {
  const recs: Recommendation[] = [];
  const { byTopic, mistakes, battles } = save.stats;

  if (battles === 0) {
    recs.push({ id: 'start', tone: 'progress', title: 'Begin your journey', action: 'Talk to Elder Rowan in Hearthmoor Village, then challenge the Mossling.', rule: 'You have not fought any battles yet.' });
  }

  const entries = (Object.entries(byTopic) as [Topic, { correct: number; total: number }][])
    .filter(([, s]) => s.total >= MIN_ATTEMPTS);

  for (const [topic, s] of entries.sort((a, b) => a[1].correct / a[1].total - b[1].correct / b[1].total)) {
    const acc = s.correct / s.total;
    if (acc < WEAK && PRACTICE[topic]) {
      recs.push({
        id: `weak-${topic}`, tone: 'focus',
        title: `Strengthen: ${TOPIC_LABELS[topic]}`,
        action: PRACTICE[topic]!,
        rule: `${TOPIC_LABELS[topic]} accuracy is ${Math.round(acc * 100)}% over ${s.total} questions (below ${WEAK * 100}%).`,
      });
    }
  }

  if (mistakes.length >= 3) {
    recs.push({ id: 'mistakes', tone: 'focus', title: 'Review your mistakes', action: 'Fight the Echo of Errors at the Training Grounds in Hearthmoor Village. Correct answers clear mistakes from your list.', rule: `You have ${mistakes.length} uncorrected mistakes (3 or more).` });
  }

  for (const [topic, s] of entries) {
    const acc = s.correct / s.total;
    if (acc >= STRONG && s.total >= 5) {
      const nextRegion = REGION_ORDER.find((r) => isRegionUnlocked(save, r) && !save.progress.regionsCompleted.includes(r));
      recs.push({
        id: `strong-${topic}`, tone: 'stretch',
        title: `Stretch yourself: ${TOPIC_LABELS[topic]}`,
        action: nextRegion && nextRegion !== 'vale'
          ? `Try harder ${TOPIC_LABELS[topic].toLowerCase()} questions in ${regionName(nextRegion)}.`
          : `Push on to the region boss — harder ${TOPIC_LABELS[topic].toLowerCase()} questions await in the next region.`,
        rule: `${TOPIC_LABELS[topic]} accuracy is ${Math.round(acc * 100)}% over ${s.total} questions (${STRONG * 100}% or higher).`,
      });
    }
  }

  for (let i = 0; i < REGION_ORDER.length - 1; i++) {
    const done = REGION_ORDER[i];
    const next = REGION_ORDER[i + 1];
    if (save.progress.regionsCompleted.includes(done) && !save.progress.regionsCompleted.includes(next)) {
      recs.push({ id: `next-${next}`, tone: 'progress', title: `Advance to ${regionName(next)}`, action: `You have completed ${regionName(done)}. ${regionName(next)} offers the next difficulty level.`, rule: `${regionName(done)} is complete and ${regionName(next)} is not.` });
      break;
    }
  }

  if (isLoreVaultUnlocked(save)) {
    const idiomsLeft = IDIOMS.length - save.progress.idiomsCollected.length;
    const riddlesLeft = RIDDLES.length - save.progress.riddlesSolved.length;
    if (idiomsLeft + riddlesLeft > 0) {
      recs.push({ id: 'vault', tone: 'stretch', title: 'Explore the Lore Vault', action: `${idiomsLeft} Lore Cards and ${riddlesLeft} riddles remain undiscovered.`, rule: 'The Lore Vault is unlocked and not yet complete.' });
    }
  }

  return recs;
}
