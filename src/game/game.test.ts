import { describe, expect, it } from 'vitest';
import { IDIOMS, RIDDLES } from '../data/lore';
import { QUESTIONS } from '../data/questions';
import { MONSTERS, REGIONS } from '../data/world';
import {
  addExp, computeRewards, expToNext, finishBattle, isBossUnlocked, isLoreVaultUnlocked, isMonsterAvailable,
  isRegionUnlocked, newSave, ordinaryMonsters, pickQuestion, recordAnswer,
} from './engine';
import { recommend } from './recommend';
import type { SaveData } from '../types';

const fresh = () => newSave('Tester', 'scholar');
const monster = (id: string) => MONSTERS.find((m) => m.id === id)!;

describe('content bank', () => {
  it('meets the minimum content counts', () => {
    for (const r of REGIONS) expect(QUESTIONS.filter((q) => q.region === r.id).length).toBeGreaterThanOrEqual(10);
    expect(IDIOMS.length).toBeGreaterThanOrEqual(8);
    expect(RIDDLES.length).toBeGreaterThanOrEqual(8);
    expect(QUESTIONS.length + IDIOMS.length + RIDDLES.length).toBeGreaterThanOrEqual(46);
  });

  it('has unique ids and no duplicated prompts', () => {
    const ids = [...QUESTIONS.map((q) => q.id), ...IDIOMS.map((i) => i.id), ...RIDDLES.map((r) => r.id)];
    expect(new Set(ids).size).toBe(ids.length);
    const prompts = QUESTIONS.filter((q) => q.kind === 'choice' && !q.passage && !q.audio).map((q) => q.prompt);
    expect(new Set(prompts).size).toBe(prompts.length);
  });

  it('every question is well-formed with one valid answer and an explanation', () => {
    for (const q of QUESTIONS) {
      expect(q.explanation.length, q.id).toBeGreaterThan(30);
      expect(q.concept, q.id).toBeTruthy();
      if (q.kind === 'choice') {
        expect(q.options).toHaveLength(4);
        expect(new Set(q.options).size, q.id).toBe(4);
        expect(q.answer).toBeGreaterThanOrEqual(0);
        expect(q.answer).toBeLessThan(4);
      } else {
        expect(q.tokens.length).toBeGreaterThanOrEqual(3);
        expect(new Set(q.tokens).size).toBe(q.tokens.length);
      }
    }
  });

  it('every idiom has an origin status and sources; riddles have explanations', () => {
    for (const i of IDIOMS) {
      expect(i.sources.length, i.id).toBeGreaterThan(0);
      expect(['documented', 'partly-documented', 'uncertain']).toContain(i.status);
      expect(i.challenge.options[i.challenge.answer]).toBeTruthy();
    }
    for (const r of RIDDLES) {
      expect(r.explanation.length).toBeGreaterThan(40);
      expect(r.options[r.answer]).toBeTruthy();
      expect(r.hint).toBeTruthy();
    }
  });

  it('covers the required skill types', () => {
    const topics = new Set(QUESTIONS.map((q) => q.topic));
    for (const t of ['prepositions', 'tenses', 'articles', 'reading', 'listening', 'writing', 'phrasal-verbs', 'figurative'] as const) expect(topics).toContain(t);
    expect(QUESTIONS.some((q) => q.kind === 'order')).toBe(true);
  });
});

describe('levels and rewards', () => {
  it('levels up and carries over EXP', () => {
    expect(addExp(1, 0, expToNext(1) + 5)).toEqual({ level: 2, exp: 5, levelsGained: 1 });
  });

  it('rewards scale with accuracy, first clear gives a bonus, losses give no coins', () => {
    const m = monster('mossling');
    const perfect = computeRewards(m, true, 3, 3, false);
    const sloppy = computeRewards(m, true, 3, 6, false);
    expect(perfect.exp).toBeGreaterThan(sloppy.exp);
    expect(computeRewards(m, true, 3, 3, true).coins).toBeGreaterThan(perfect.coins);
    expect(computeRewards(m, false, 1, 4, false).coins).toBe(0);
  });
});

describe('progression and unlocks', () => {
  it('starts with only Verdant Vale open and the boss locked', () => {
    const s = fresh();
    expect(isRegionUnlocked(s, 'vale')).toBe(true);
    expect(isRegionUnlocked(s, 'ember')).toBe(false);
    expect(isBossUnlocked(s, 'vale')).toBe(false);
    expect(isLoreVaultUnlocked(s)).toBe(false);
  });

  it('unlocks the boss after all ordinary monsters, and the next region after the boss', () => {
    let s: SaveData = fresh();
    for (const m of ordinaryMonsters('vale')) s = finishBattle(s, m, true, 3, 3).save;
    expect(isBossUnlocked(s, 'vale')).toBe(true);
    const r = finishBattle(s, monster('thornmaw'), true, 5, 5);
    expect(r.outcome.regionCleared).toBe('vale');
    expect(isRegionUnlocked(r.save, 'ember')).toBe(true);
  });

  it('opens the Lore Vault after completing Emberfall', () => {
    const s = fresh();
    s.progress.regionsCompleted = ['vale', 'ember'];
    expect(isLoreVaultUnlocked(s)).toBe(true);
    expect(isRegionUnlocked(s, 'archive')).toBe(true);
  });

  it('a lost battle records history but does not mark the monster defeated', () => {
    const r = finishBattle(fresh(), monster('mossling'), false, 1, 6);
    expect(r.save.progress.defeated).not.toContain('mossling');
    expect(r.save.stats.battles).toBe(1);
    expect(r.save.stats.wins).toBe(0);
  });

  it('training is only available when there are mistakes', () => {
    const s = fresh();
    expect(isMonsterAvailable(s, monster('echo'))).toBe(false);
    expect(isMonsterAvailable(recordAnswer(s, QUESTIONS[0], false), monster('echo'))).toBe(true);
  });
});

describe('answers and question selection', () => {
  it('records topic accuracy and tracks/clears mistakes', () => {
    const q = QUESTIONS[0];
    let s = recordAnswer(fresh(), q, false);
    expect(s.stats.mistakes).toEqual([q.id]);
    expect(s.stats.byTopic[q.topic]).toEqual({ correct: 0, total: 1 });
    s = recordAnswer(s, q, true);
    expect(s.stats.mistakes).toEqual([]);
    expect(s.stats.byTopic[q.topic]).toEqual({ correct: 1, total: 2 });
  });

  it('stays in the monster region and never repeats within a battle while fresh questions remain', () => {
    const m = monster('ash-hound');
    const s = fresh();
    const used: string[] = [];
    const pool = QUESTIONS.filter((q) => q.region === 'ember');
    for (let i = 0; i < pool.length; i++) {
      const q = pickQuestion(m, s, used);
      expect(q.region).toBe('ember');
      expect(used).not.toContain(q.id);
      used.push(q.id);
    }
  });

  it('prefers questions not seen recently', () => {
    let s = fresh();
    const vale = QUESTIONS.filter((q) => q.region === 'vale');
    const keep = vale.find((q) => q.topic === 'reading')!;
    for (let k = 0; k < 2; k++) for (const q of vale) if (q.id !== keep.id) s = recordAnswer(s, q, true);
    expect(pickQuestion(monster('murk-wisp'), s, []).id).toBe(keep.id);
  });

  it('can force a sentence-building question for boss final challenges', () => {
    expect(pickQuestion(monster('thornmaw'), fresh(), [], { kind: 'order' }).kind).toBe('order');
  });

  it('training draws from the mistakes list', () => {
    const target = QUESTIONS.find((q) => q.region === 'archive')!;
    const s = recordAnswer(fresh(), target, false);
    expect(pickQuestion(monster('echo'), s, []).id).toBe(target.id);
  });
});

describe('rule-based recommendations', () => {
  it('suggests starting for a new player', () => {
    expect(recommend(fresh())[0].id).toBe('start');
  });

  it('flags weak topics with a transparent rule', () => {
    const s = fresh();
    s.stats.battles = 2;
    s.stats.byTopic.prepositions = { correct: 1, total: 5 };
    const rec = recommend(s).find((r) => r.id === 'weak-prepositions')!;
    expect(rec.rule).toContain('20%');
    expect(rec.action).toContain('Mossling');
  });

  it('suggests a reading side quest when reading is weak', () => {
    const s = fresh();
    s.stats.byTopic.reading = { correct: 1, total: 4 };
    expect(recommend(s).find((r) => r.id === 'weak-reading')!.action).toContain('Lost Ledger');
  });

  it('suggests stretching strong topics and moving on after a region', () => {
    const s = fresh();
    s.stats.byTopic.vocabulary = { correct: 9, total: 10 };
    s.progress.regionsCompleted = ['vale'];
    const ids = recommend(s).map((r) => r.id);
    expect(ids).toContain('strong-vocabulary');
    expect(ids).toContain('next-ember');
  });
});
