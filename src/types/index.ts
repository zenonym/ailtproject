export type RegionId = 'vale' | 'ember' | 'archive';

export type Topic =
  | 'prepositions'
  | 'articles'
  | 'tenses'
  | 'agreement'
  | 'sentence-structure'
  | 'vocabulary'
  | 'collocations'
  | 'phrasal-verbs'
  | 'word-forms'
  | 'linking'
  | 'reading'
  | 'listening'
  | 'writing'
  | 'figurative'
  | 'idioms'
  | 'riddles';

export type Difficulty = 1 | 2 | 3;

interface QuestionBase {
  id: string;
  region: RegionId;
  difficulty: Difficulty;
  topic: Topic;
  /** Short name of the language point, shown in the Codex. */
  concept: string;
  prompt: string;
  explanation: string;
  example?: string;
  hint?: string;
  /** Reading passage shown above the question. */
  passage?: string;
  /** Lines read aloud by SpeechSynthesis; also the transcript fallback. */
  audio?: { speaker: string; line: string }[];
  /** Vocabulary entry unlocked in the Codex once the question is answered. */
  vocab?: { word: string; meaning: string };
}

export interface ChoiceQuestion extends QuestionBase {
  kind: 'choice';
  options: [string, string, string, string];
  /** Index into options. */
  answer: number;
}

export interface OrderQuestion extends QuestionBase {
  kind: 'order';
  /** Fragments in the correct order; shuffled for the player. */
  tokens: string[];
}

export type Question = ChoiceQuestion | OrderQuestion;

export type MonsterShape = 'blob' | 'spiky' | 'ghost' | 'beast' | 'tome' | 'golem';

export interface Monster {
  id: string;
  name: string;
  region: RegionId;
  title: string;
  flavour: string;
  hp: number;
  shape: MonsterShape;
  color: string;
  accent: string;
  boss?: boolean;
  /** Topics this monster prefers to ask about. */
  focus?: Topic[];
  exp: number;
  coins: number;
  /** Side quest wrapped around this encounter. */
  quest?: { title: string; giver: string; text: string; reward: string };
  /** Special training monster that draws from the mistakes list. */
  training?: boolean;
}

export interface Npc {
  name: string;
  role: string;
  lines: string[];
}

export interface Region {
  id: RegionId;
  name: string;
  level: string;
  village: string;
  theme: string;
  story: string;
  focus: string[];
  npcs: Npc[];
  colors: { bg: string; accent: string; glow: string };
}

export type OriginStatus = 'documented' | 'partly-documented' | 'uncertain';

export interface Idiom {
  id: string;
  phrase: string;
  meaning: string;
  example: string;
  origin: string;
  link: string;
  status: OriginStatus;
  statusNote: string;
  sources: { label: string; url: string }[];
  challenge: { prompt: string; options: [string, string, string, string]; answer: number; explanation: string };
}

export interface Riddle {
  id: string;
  riddle: string;
  options: [string, string, string, string];
  answer: number;
  hint: string;
  explanation: string;
  concept: string;
}

export type AvatarId = 'scholar' | 'ranger' | 'mage' | 'knight';

export interface TopicStat {
  correct: number;
  total: number;
}

export interface BattleRecord {
  at: number;
  monster: string;
  won: boolean;
  correct: number;
  total: number;
}

export interface SaveData {
  version: 1;
  player: { name: string; avatar: AvatarId; level: number; exp: number; coins: number };
  stats: {
    battles: number;
    wins: number;
    byTopic: Partial<Record<Topic, TopicStat>>;
    /** Question ids answered incorrectly and not yet corrected. */
    mistakes: string[];
    /** Question id -> answer counter value when last seen (for spacing repeats). */
    seen: Record<string, number>;
    answered: number;
    history: BattleRecord[];
  };
  progress: {
    defeated: string[];
    regionsCompleted: RegionId[];
    idiomsDiscovered: string[];
    idiomsCollected: string[];
    riddlesSolved: string[];
  };
  inventory: { tonic: number };
  settings: { speechRate: number; reducedMotion: boolean };
}
