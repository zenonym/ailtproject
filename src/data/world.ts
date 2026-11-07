import type { Monster, Region, RegionId, Topic } from '../types';

export const REGIONS: Region[] = [
  {
    id: 'vale',
    name: 'Verdant Vale',
    level: 'Beginner',
    village: 'Hearthmoor Village',
    theme: 'A peaceful forest slowly being corrupted by creatures made of tangled words.',
    story: 'Since the Great Silence, the forest creatures of Verdant Vale have begun to speak in broken sentences — and the broken words have taken shape as monsters. Elder Rowan believes a young wordsmith can mend them.',
    focus: ['Prepositions', 'Articles', 'Tenses', 'Subject–verb agreement', 'Everyday vocabulary', 'Simple reading'],
    colors: { bg: '#0f2a1f', accent: '#5fd08a', glow: 'rgba(95, 208, 138, 0.35)' },
    npcs: [
      {
        name: 'Elder Rowan',
        role: 'Village elder · Guide',
        lines: [
          'Welcome, wordsmith. The creatures of the Vale feed on mistakes — but a correct answer breaks their hold.',
          'In battle, choose the right answer and you strike. Choose wrongly and the creature strikes back — but I will always show you why.',
          'Three blows defeat an ordinary creature. Defeat all three in the Vale and the Blighted Stag will appear.',
          'If your health runs low, a Herbal Tonic restores it. Lost a battle? No shame — rest and try again.',
        ],
      },
      {
        name: 'Pip the Pedlar',
        role: 'Travelling merchant',
        lines: ['Tonics! Fresh tonics! Two health in a bottle, only 25 coins. Can\'t say fairer than that.'],
      },
    ],
  },
  {
    id: 'ember',
    name: 'Emberfall',
    level: 'Intermediate',
    village: 'Cinderhold',
    theme: 'A volcanic forge-town where the creatures burn hotter and the questions grow longer.',
    story: 'The forges of Cinderhold once shaped words as well as steel. Now the volcano rumbles, ash creatures roam the slopes, and the townsfolk need help with lost letters, garbled messages and broken inscriptions.',
    focus: ['Phrasal verbs', 'Word forms', 'Collocations', 'Linking words', 'Reading inference', 'Listening'],
    colors: { bg: '#2a120c', accent: '#ff8a4c', glow: 'rgba(255, 138, 76, 0.35)' },
    npcs: [
      {
        name: 'Forgemistress Kaela',
        role: 'Head of the Smiths\' Guild',
        lines: [
          'So you\'re the wordsmith from the Vale. Good — Emberfall\'s beasts are tougher, and some of them speak.',
          'Listen carefully out here. Listening encounters can be replayed as often as you like, and you can always read the transcript.',
          'Help the townsfolk with their troubles. Side quests train the skills you need for the Cinder Wyrm.',
        ],
      },
      {
        name: 'Mayor Orrin',
        role: 'Mayor of Cinderhold',
        lines: ['Defeat the Cinder Wyrm and I will open the road to the Obsidian Archive — and the vault beneath it.'],
      },
    ],
  },
  {
    id: 'archive',
    name: 'The Obsidian Archive',
    level: 'Advanced',
    village: 'The Reading Hall',
    theme: 'An ancient library of black glass, where forgotten knowledge whispers between the shelves.',
    story: 'Beneath the volcano lies the Obsidian Archive, built to hold every word ever written. Its guardians have turned against readers. Deep inside waits the Hollow Lexicon — a book that devours meaning itself.',
    focus: ['Nuanced vocabulary', 'Complex grammar', 'Sentence transformation', 'Inference and tone', 'Figurative language'],
    colors: { bg: '#15122b', accent: '#a98bff', glow: 'rgba(169, 139, 255, 0.35)' },
    npcs: [
      {
        name: 'Archivist Sefa',
        role: 'Last keeper of the Archive',
        lines: [
          'Few reach these halls. The guardians here care about precision — the difference between "imply" and "infer" matters.',
          'Beneath us lies the Lore Vault: idioms, their histories and the Riddle Chamber. Knowledge there is rarer than gold.',
        ],
      },
    ],
  },
];

const m = (x: Monster) => x;

export const MONSTERS: Monster[] = [
  // Verdant Vale
  m({ id: 'mossling', name: 'Mossling', title: 'Tangle of Prepositions', region: 'vale', hp: 3, shape: 'blob', color: '#3aa76d', accent: '#c6f6a8', focus: ['prepositions', 'articles'], exp: 30, coins: 12, flavour: 'A soft heap of moss that sticks words in the wrong places.' }),
  m({ id: 'bramble-imp', name: 'Bramble Imp', title: 'Twister of Tenses', region: 'vale', hp: 3, shape: 'spiky', color: '#8b5a2b', accent: '#ffd27a', focus: ['tenses', 'agreement', 'collocations'], exp: 32, coins: 13, flavour: 'It mixes up yesterday and tomorrow just to watch you stumble.' }),
  m({ id: 'murk-wisp', name: 'Murk Wisp', title: 'Whisperer in the Fog', region: 'vale', hp: 3, shape: 'ghost', color: '#5c7f9e', accent: '#d4f1ff', focus: ['reading', 'listening', 'vocabulary'], exp: 34, coins: 14, flavour: 'It hides meanings in fog. Read closely and listen well.' }),
  m({ id: 'thornmaw', name: 'Thornmaw', title: 'The Blighted Stag', region: 'vale', hp: 5, shape: 'beast', color: '#2f5d3a', accent: '#ff5d73', boss: true, exp: 90, coins: 40, flavour: 'Once guardian of the Vale, now crowned with thorns of broken grammar.' }),
  m({ id: 'echo', name: 'Echo of Errors', title: 'Training Grounds', region: 'vale', hp: 3, shape: 'ghost', color: '#7b6ba8', accent: '#f4e9ff', training: true, exp: 15, coins: 5, flavour: 'A shadow built from your own past mistakes. Defeat it to clear them from your record.' }),

  // Emberfall
  m({ id: 'ash-hound', name: 'Ash Hound', title: 'Hunter of Phrasal Verbs', region: 'ember', hp: 3, shape: 'beast', color: '#a3432a', accent: '#ffcf70', focus: ['phrasal-verbs', 'collocations'], exp: 45, coins: 18, flavour: 'It sniffs out learners who confuse "put off" with "put out".' }),
  m({ id: 'slag-golem', name: 'Slag Golem', title: 'Mangler of Word Forms', region: 'ember', hp: 3, shape: 'golem', color: '#6b4a3a', accent: '#ff8a4c', focus: ['word-forms', 'vocabulary', 'tenses'], exp: 48, coins: 19, flavour: 'Cooled lava stitched together with the wrong suffixes.' }),
  m({ id: 'cinder-sprite', name: 'Cinder Sprite', title: 'Spark of Linking Words', region: 'ember', hp: 3, shape: 'spiky', color: '#d9622b', accent: '#fff1a8', focus: ['linking', 'sentence-structure'], exp: 50, coins: 20, flavour: 'It snaps sentences apart at the joints. Mend them with the right connectors.' }),
  m({ id: 'ledger-mimic', name: 'Ledger Mimic', title: 'Side quest · The Lost Ledger', region: 'ember', hp: 3, shape: 'tome', color: '#8a5a33', accent: '#ffe0a3', focus: ['reading'], exp: 55, coins: 30, flavour: 'A ledger that bites. It swallowed the guild\'s records.',
    quest: { title: 'The Lost Ledger', giver: 'Forgemistress Kaela', text: 'Our guild ledger was swallowed by a mimic. Read its pages carefully and win it back.', reward: 'Bonus coins · Reading practice' } }),
  m({ id: 'ash-echo', name: 'Ash Echo', title: 'Side quest · Voices in the Ash', region: 'ember', hp: 3, shape: 'ghost', color: '#7a4b4b', accent: '#ffd7c2', focus: ['listening'], exp: 55, coins: 30, flavour: 'A ghost that repeats overheard conversations — with the details scrambled.',
    quest: { title: 'Voices in the Ash', giver: 'Mayor Orrin', text: 'Messages to the north gate keep getting garbled. Listen to the echo and pick out what was really said.', reward: 'Bonus coins · Listening practice' } }),
  m({ id: 'anvil-wraith', name: 'Anvil Wraith', title: 'Side quest · The Broken Inscription', region: 'ember', hp: 3, shape: 'golem', color: '#55606e', accent: '#9fe3ff', focus: ['writing'], exp: 55, coins: 30, flavour: 'It shattered the guild\'s inscription into fragments.',
    quest: { title: 'The Broken Inscription', giver: 'Forgemistress Kaela', text: 'The words over the forge door were smashed. Put the fragments back in the right order.', reward: 'Bonus coins · Writing practice' } }),
  m({ id: 'cinder-wyrm', name: 'Cinder Wyrm', title: 'Tyrant of the Caldera', region: 'ember', hp: 5, shape: 'beast', color: '#b8321c', accent: '#ffd23f', boss: true, exp: 140, coins: 60, flavour: 'Its breath melts careless sentences into slag.' }),

  // Obsidian Archive
  m({ id: 'ink-shade', name: 'Ink Shade', title: 'Blot of Nuance', region: 'archive', hp: 3, shape: 'ghost', color: '#3b3566', accent: '#c7b8ff', focus: ['vocabulary'], exp: 65, coins: 24, flavour: 'It thrives on near-synonyms. Choose exactly.' }),
  m({ id: 'glyph-sentinel', name: 'Glyph Sentinel', title: 'Warden of Syntax', region: 'archive', hp: 3, shape: 'golem', color: '#2d2a4a', accent: '#7ef0ff', focus: ['sentence-structure', 'tenses', 'agreement', 'writing'], exp: 68, coins: 25, flavour: 'Carved from obsidian; it only obeys perfectly formed sentences.' }),
  m({ id: 'page-wraith', name: 'Page Wraith', title: 'Reader of Shadows', region: 'archive', hp: 3, shape: 'tome', color: '#4a2f5c', accent: '#ffb3e6', focus: ['reading', 'listening', 'figurative'], exp: 70, coins: 26, flavour: 'It reads between the lines — and expects you to do the same.' }),
  m({ id: 'hollow-lexicon', name: 'The Hollow Lexicon', title: 'Devourer of Meaning', region: 'archive', hp: 6, shape: 'tome', color: '#1d1638', accent: '#a98bff', boss: true, exp: 220, coins: 100, flavour: 'An empty book that swallows the meanings of words. Fill it with precision.' }),
];

export const regionById = (id: RegionId) => REGIONS.find((r) => r.id === id)!;
export const monsterById = (id: string) => MONSTERS.find((x) => x.id === id);

export const TOPIC_LABELS: Record<Topic, string> = {
  prepositions: 'Prepositions',
  articles: 'Articles',
  tenses: 'Tenses',
  agreement: 'Agreement',
  'sentence-structure': 'Sentence structure',
  vocabulary: 'Vocabulary',
  collocations: 'Collocations',
  'phrasal-verbs': 'Phrasal verbs',
  'word-forms': 'Word forms',
  linking: 'Linking words',
  reading: 'Reading',
  listening: 'Listening',
  writing: 'Writing',
  figurative: 'Figurative language',
  idioms: 'Idioms',
  riddles: 'Riddles',
};
