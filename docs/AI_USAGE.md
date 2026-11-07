# AI Usage in LEXQUEST

## 1. How generative AI contributed to the educational material

Anthropic's Claude was used as a drafting and review assistant while building LEXQUEST. It produced first drafts of questions, passages, dialogues, idiom notes and riddles from prompts like those in `AI_PROMPTS.md`, and it wrote and tested the application code. A human-in-the-loop process then selected, corrected and approved what went into the game.

AI was **not** used to generate anything while the game is running.

## 2. Which parts were AI-assisted

| Part | AI role | Location |
|---|---|---|
| 47 combat questions (grammar, vocabulary, reading, listening, writing) | Drafted items, distractors, explanations and examples | `src/data/questions.ts` |
| Reading passages and listening dialogues | Drafted short original texts set in the game world | `src/data/questions.ts` |
| 8 idiom entries | Drafted meanings, examples and origin notes; suggested references | `src/data/lore.ts` |
| 8 riddles | Drafted riddles, distractors, hints and explanations | `src/data/lore.ts` |
| World-building (regions, NPCs, monster names and descriptions) | Drafted original names and flavour text | `src/data/world.ts` |
| Application code, styles, SVG illustrations, tests | Written with AI assistance and checked with type-checking, automated tests and manual play-testing | `src/` |
| Documentation | Drafted with AI assistance | `docs/` |

## 3. How content was reviewed and corrected

**Combat questions**

- Each item was checked to make sure exactly one option is correct. Distractors that could be defended (e.g. a collocation where both "make" and "take" a decision are acceptable) were removed or replaced.
- Explanations were rewritten to state the rule plainly and to explain why tempting wrong options are wrong.
- Items were placed at the right difficulty for each region, and topics were balanced across grammar, vocabulary, reading, listening and writing.
- All passages, dialogues, names and places are original to LEXQUEST.
- Automated tests (`src/game/game.test.ts`) check that every question has a unique ID, four distinct options, a valid answer index, a concept name and an explanation, and that the minimum content counts are met.

**Idiom origins** — the most sensitive content

- Origin notes were reduced to claims supported by the references in `CONTENT_SOURCES.md`.
- Each idiom carries a reliability label: **Documented**, **Partly documented** or **Origin uncertain / disputed**, with a short note.
- Popular stories without evidence are named as such rather than presented as fact: the "hound training" story for *red herring*, the "cat-o'-nine-tails" and market-fraud stories for *let the cat out of the bag*, the battlefield-surgery story for *bite the bullet*, and the Greek-voting story for *spill the beans*.
- Precise dates were avoided where sources disagree (e.g. "by the late 16th century" rather than a single year).
- Reference links were checked: Phrase Finder, World Wide Words and Truman Library pages returned successfully. Online Etymology Dictionary and Merriam-Webster pages block automated checks, so their links were not machine-verified, but they use the sites' standard URL formats.

**Riddles**

- Riddles were chosen for linguistic reasoning (polysemy, homophones, transitivity, reversal, use–mention, presupposition, structural ambiguity) rather than general knowledge, and ordered from easiest to hardest.

**Remaining responsibility.** AI-drafted educational content can contain subtle errors. Teachers using LEXQUEST should still review items before classroom use, especially idiom histories.

## 4. Why no runtime AI API was necessary

- **The content is fixed and curated.** Every question and explanation has been checked by a person. Generating new content during play would bypass that check and could show students incorrect explanations or invented idiom histories.
- **Reliability and consistency.** Static content behaves the same for every student, which makes results comparable and the game easy to test.
- **Privacy.** Nothing a student does leaves their browser. There is no account, no server and no third-party service receiving student data.
- **Cost and access.** No API keys, subscription or network connection beyond loading the page are needed. The site is free to host on GitHub Pages.
- **Simplicity.** The personalisation students need (pointing them to their weak areas) can be done with transparent rules.

## 5. How rule-based personalisation works

Recommendations are produced by `src/game/recommend.ts`. The function reads the player's saved statistics and applies fixed rules in order. No machine learning or AI is involved, and each recommendation shows the rule that triggered it.

| Rule | Condition | Recommendation |
|---|---|---|
| New player | No battles fought | Talk to Elder Rowan and fight the Mossling |
| Weak topic | A topic has **at least 3 attempts** and accuracy **below 60%** | Practise that topic with a specific creature or side quest (e.g. low reading accuracy → *The Lost Ledger*; low prepositions → Mossling) |
| Outstanding mistakes | **3 or more** questions answered wrongly and not yet corrected | Fight the Echo of Errors at the Training Grounds |
| Strong topic | A topic has **at least 5 attempts** and accuracy **85% or higher** | Move on to harder questions in the next region |
| Region complete | A region's boss is defeated and the next region is not complete | Advance to the next region |
| Lore Vault | The Vault is unlocked and not all cards/riddles are collected | Explore the Lore Vault |

Supporting rules elsewhere in the game:

- **Question selection** (`pickQuestion` in `src/game/engine.ts`): prefer the creature's focus topics; never repeat a question within one battle while unused questions remain; prefer the least recently seen questions.
- **Mistake tracking**: a wrong answer adds the question to the mistakes list; a later correct answer removes it.
- **Weak areas** on the statistics page use the same 3-attempts / 60% rule.

These rules are covered by automated tests.
