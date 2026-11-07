# LEXQUEST — Assignment Guide

Live site: https://zenonym.github.io/ailtproject/
Source: https://github.com/zenonym/ailtproject

---

## A. Project Overview

LEXQUEST is a browser-based fantasy role-playing game (RPG) for Hong Kong secondary school students (roughly ages 12–18) with mixed English proficiency. The player creates a "wordsmith" character and travels through a world where mistakes in language have taken the form of monsters.

**Core loop**

1. The player explores a region, talks to non-player characters (NPCs) and chooses a creature to fight.
2. In battle, the creature asks an English question (usually four-option multiple choice, sometimes a listening clip or a sentence-building task).
3. A correct answer damages the creature. A wrong answer lets the creature counter-attack, and the game immediately shows the correct answer with an explanation and an example.
4. Victory gives experience points (EXP), coins and progress. Defeat gives a small amount of EXP and the option to retry at once.
5. Every answer updates the player's statistics, which feed rule-based learning recommendations.

**World structure**

| Area | Level | Focus |
|---|---|---|
| Verdant Vale | Beginner | Prepositions, articles, tenses, subject–verb agreement, everyday vocabulary, simple reading and listening |
| Emberfall | Intermediate | Phrasal verbs, word forms, collocations, linking words, relative clauses, reading inference, listening for detail and attitude, three side quests |
| The Obsidian Archive | Advanced | Nuanced vocabulary, inversion, conditionals, subjunctive, reported speech, figurative language, tone and inference |
| The Lore Vault | Enrichment | Idiom Archives (meanings + documented histories) and the Riddle Chamber (wordplay and ambiguity) |

Each region has three ordinary creatures and a boss. The boss appears only after the three ordinary creatures are defeated; the boss's last hit must be landed with a **Final Challenge** (rebuilding a sentence from fragments). Defeating a boss unlocks the next region. Completing Emberfall unlocks both the Obsidian Archive and the Lore Vault.

**Content bank (all static, curated)**

- 47 combat questions (15 Verdant Vale, 16 Emberfall, 16 Obsidian Archive), including 6 reading items, 4 listening items and 6 sentence-building items
- 8 idiom entries, each with meaning, example, history, the link between original and modern meaning, an origin-reliability label, references and a challenge question
- 8 riddles, ordered by difficulty, each with a hint, explanation and named linguistic concept

Total: **63 learning activities**.

## B. Learning Objectives

By playing LEXQUEST, learners should be able to:

1. **Grammar** — choose correct prepositions, articles, tenses, conditionals and agreement; recognise and avoid errors such as dangling modifiers.
2. **Vocabulary** — understand words from context, distinguish near-synonyms and confusables (imply/infer, affect/effect), use collocations (heavy rain, do homework) and phrasal verbs (put off vs call off), and form words with suffixes.
3. **Reading** — read short passages for detail, make inferences supported by clues, identify the writer's purpose and tone.
4. **Listening** — follow short spoken dialogues and a mini-lecture, pick out key information (times, places, items) and recognise attitude from hedging language.
5. **Writing** — build well-ordered sentences, including subordinate clauses, relative clauses, participle clauses and inversion; transform direct to reported speech.
6. **Idioms** — understand the meaning and usage of common idioms and how their history explains their modern meaning.
7. **Linguistic awareness** — notice polysemy, homophones, transitive/intransitive verbs, use vs mention, presupposition and structural ambiguity.
8. **Reflection** — monitor their own accuracy by topic and act on transparent recommendations.

## C. Implementation Strategy

**How students interact with the app**

- Students open the website on a school computer, tablet or phone. No login, download or account is required. Progress is saved in the browser's `localStorage`.
- A short tutorial explains battles, hints, the Focus ability and keyboard shortcuts.
- Students choose which creature to fight, so they control the pace. Each creature has a topic focus (e.g. the Mossling asks mostly about prepositions and articles), which lets teachers direct students to particular skills.

**Progression**

- EXP raises the player's level; higher levels slightly increase maximum HP, which makes later battles more forgiving.
- Coins buy Herbal Tonics, which restore HP in battle — a light safety net for weaker learners.
- Side quests in Emberfall target single skills: *The Lost Ledger* (reading), *Voices in the Ash* (listening), *The Broken Inscription* (sentence building).
- The **Training Grounds** encounter (Echo of Errors) draws only from the player's own mistakes; answering a question correctly removes it from the mistakes list.

**Delivering the content**

- Every question includes a concept name, explanation and (usually) an example. Explanations are shown after *every* answer, correct or not, so the feedback reinforces correct reasoning as well as fixing errors.
- Questions are chosen from the current region, prefer the creature's focus topics, never repeat within a battle while fresh questions remain, and favour questions the player has not seen recently.
- Listening items use the browser's built-in SpeechSynthesis voice. Students can replay as often as they wish and reveal the transcript. If the browser has no speech support, the transcript is shown automatically.
- Speaking is encouraged (not assessed): after sentence-building tasks and in the Idiom Archives, students can hear a model and are prompted to read aloud.
- The **Language Codex** collects vocabulary, concepts, idioms and riddles as they are met, with search and region filtering, so students can revise at any time.
- The **Adventurer's Ledger** (statistics page) shows accuracy by topic, weak areas, outstanding mistakes with explanations, battle history, and recommendations.

**Suggested classroom use**

- 15–20 minute warm-up or consolidation sessions; students play individually or in pairs.
- Teachers can assign a creature or side quest that matches the week's grammar point.
- Students can screenshot their Ledger as evidence of practice, or use it for a short written self-reflection.
- The Lore Vault suits stronger students as an extension task and supports discussion of "how do we know where a phrase comes from?".

## D. Expected Learning Outcomes

The following are **intended** outcomes. They have not been measured in a controlled study, and no claim is made that LEXQUEST has been proven to improve learning.

| Area | Expected outcome | Indicator available in the app |
|---|---|---|
| Grammar | Fewer errors with prepositions, articles, tenses, agreement and complex structures | Accuracy for Prepositions, Articles, Tenses, Agreement, Sentence structure |
| Vocabulary | Better use of words in context, collocations and phrasal verbs | Accuracy for Vocabulary, Collocations, Phrasal verbs, Word forms; Codex vocabulary entries unlocked |
| Reading | More accurate detail-finding and inference | Reading accuracy; *The Lost Ledger* quest completion |
| Listening | Better identification of key information and attitude | Listening accuracy; *Voices in the Ash* completion |
| Writing | More confident construction of correctly ordered sentences | Writing accuracy (sentence building); boss Final Challenges passed |
| Linguistic awareness | Understanding of idiom histories and of ambiguity in language | Lore Cards collected; riddles solved; Idioms/Riddles accuracy |
| Self-regulation | Students notice and act on their weak areas | Number of outstanding mistakes over time; Training Grounds use |

Possible measurable indicators for a teacher-run evaluation:

- Change in topic accuracy between a student's first and later attempts (visible in the Ledger).
- Reduction in the outstanding-mistakes count after Training Grounds sessions.
- Progression through the regions and the Lore Vault within a set period.
- A short paper pre-test and post-test on the same language points, which would give stronger evidence than in-game data alone.

## E. Pedagogical Rationale

- **Gamification.** Levels, EXP, coins, collectable Lore Cards and bosses give short-term goals and a sense of progress. The fantasy framing reframes errors as "creatures to mend" rather than failures, which can lower anxiety. Rewards are tied to learning actions (correct answers, reviewing mistakes) rather than to time spent.
- **Retrieval practice.** Each battle asks students to recall and apply rules rather than reread them. Retrieval practice is widely reported in cognitive psychology research to strengthen long-term retention.
- **Immediate corrective feedback.** The correct answer and a short, rule-based explanation appear instantly after every response, before misconceptions settle. Examples show the rule in a new context.
- **Spacing and review.** Question selection favours items not seen recently, and the Training Grounds return students to their own errors later, rather than immediately.
- **Scaffolding.** Difficulty rises from Verdant Vale to the Obsidian Archive. Within a battle, optional hints and the Focus ability (removing two wrong options) support weaker learners without lowering the ceiling for stronger ones.
- **Differentiated learning.** Students move at their own pace, choose creatures by topic, and receive personalised recommendations. Stronger learners can progress quickly to advanced content and the Lore Vault; weaker learners can stay in earlier regions and use tonics and hints.
- **Contextualised vocabulary learning.** Vocabulary items are embedded in sentences and passages with clues, so students practise inferring meaning from context — a transferable reading strategy.
- **Learning through discovery.** The Codex fills as students explore; sealed scrolls and riddle doors invite curiosity.
- **Self-directed learning.** The Ledger makes performance visible, and recommendations explain the rule that produced them, so students can understand and challenge the advice rather than simply follow it.
- **Low-stakes failure.** There are no strict timers. Losing a battle costs nothing except time, and retrying is one click.

**Why the Lore Vault matters.** Idioms are hard for second-language learners because their meaning is not the sum of their words. Learning *why* an idiom means what it does (for example, that "red-handed" comes from Scots legal language about blood-stained hands) gives students a memorable image that links form and meaning. Just as importantly, each idiom is labelled as *documented*, *partly documented* or *uncertain*, and popular myths (such as the Greek-voting story for "spill the beans") are explicitly identified. This teaches students to evaluate sources and to separate evidence from appealing stories — a critical-thinking skill that goes beyond English. The Riddle Chamber develops metalinguistic awareness: by noticing double meanings, homophones and structural ambiguity, students learn to look at language as a system, which supports careful reading and precise writing.

## F. AI Contribution

Generative AI (Anthropic's Claude) was used **during development only**:

- drafting combat questions, distractors, explanations and examples at three difficulty levels;
- drafting reading passages and listening dialogues;
- drafting idiom meanings, examples and origin notes, and suggesting references to check;
- drafting riddles and their linguistic explanations;
- writing and testing the application code and documentation.

All AI-drafted content was reviewed before inclusion: answers were checked for a single defensible key, ambiguous distractors were rewritten, and idiom-origin claims were reduced to what reliable references support, with uncertainty labelled. See `AI_USAGE.md` for details and `AI_PROMPTS.md` for reusable prompts.

**The game itself contains no AI.** It runs entirely on static, curated content in the browser. There are no API calls, no keys, no server and no chatbot. Personalised recommendations are produced by simple, documented rules (see `AI_USAGE.md`, section 5).

## G. Limitations

- **No speaking assessment.** Students are encouraged to read aloud and compare with a model voice, but the app cannot hear or evaluate pronunciation.
- **No open writing.** Writing practice is limited to sentence ordering and choosing the best expression; extended writing still needs teacher feedback.
- **Synthetic voices.** Listening quality depends on the voices installed on each device; they may sound robotic and vary in accent. Some browsers have no speech support (a transcript is shown instead).
- **Content size.** 63 activities is enough for several sessions, but frequent players will see questions repeat. The content bank would need to grow for long-term use.
- **Multiple-choice limits.** MCQs can be answered by elimination or guessing, so accuracy is only an approximate measure of understanding.
- **Human verification still needed.** AI-assisted content was reviewed, but teachers should still check items before classroom use, especially idiom histories, where scholarly views can change. Some reference websites may change or move.
- **Local saving only.** Progress lives in one browser on one device. Clearing browser data deletes it, and teachers cannot see students' results centrally.
- **Rule-based personalisation is simple.** Thresholds (e.g. below 60% after three attempts) are reasonable defaults, not research-validated cut-offs.
- **No evidence of effectiveness yet.** Expected outcomes in section D are design intentions, not measured results.
