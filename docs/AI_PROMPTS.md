# Reusable Content-Generation Prompts

These prompts were used (in adapted form) to draft LEXQUEST content with a generative AI assistant. **Every output must be reviewed by a teacher before use.** Replace the parts in `{braces}`.

General instructions to add to any prompt:

> The audience is Hong Kong secondary students (ages 12–18) learning English as a second language. Use British spelling. All names, places and stories must be original and fit a fantasy setting. Return the result as JSON matching the schema given. Do not include anything you are unsure is correct; say so instead.

---

## 1. Grammar questions

```
Write {5} four-option multiple-choice grammar questions on {prepositions after adjectives}
at {beginner / intermediate / advanced} level.

Requirements:
- Each question is one sentence with a single blank (___), set in a fantasy village or forest.
- Exactly ONE option is correct. The three distractors must be clearly wrong to a
  proficient speaker but tempting to a learner (use common Cantonese-speaker errors
  where relevant).
- Do not use options where two could be accepted in some dialects or registers.
- For each item give: id, prompt, options[4], answer (index), concept (short name of the
  rule), explanation (2–3 sentences: the rule + why the main distractor is wrong),
  example (a new sentence using the rule), hint (optional, does not give away the answer).
```

## 2. Vocabulary questions

```
Write {5} vocabulary questions at {intermediate} level testing {words in context /
synonyms / antonyms / collocations / phrasal verbs / word forms}.

- Each sentence must contain a context clue that lets a careful reader work out the meaning.
- Options must be the same part of speech and similar length.
- Include a "vocab" field: { word, meaning } with a learner-dictionary-style definition.
- Explanation should point to the context clue and distinguish the correct word from the
  closest distractor.
```

## 3. Reading passages

```
Write a {60–90}-word original passage set in {a volcanic forge-town} at {intermediate} level,
followed by ONE question testing {inference / detail / writer's purpose / tone}.

- The answer must be supported by specific clues in the passage, but (for inference)
  not stated directly.
- Distractors: one that is true but irrelevant, one that over-generalises,
  one that is not mentioned.
- Explanation must quote or point to the clues.
```

## 4. Listening dialogues

```
Write a short dialogue (2–3 turns, under 60 words in total) between {two named characters}
for a listening question at {beginner} level, testing {key information such as a time,
place or item / speaker attitude}.

- Include one "distractor" detail that is mentioned and then corrected, as in real
  listening exams (e.g. "not the market square — the north gate").
- Use natural spoken language that a text-to-speech voice can read clearly
  (write numbers as words; avoid abbreviations).
- Give: audio [{ speaker, line }], prompt, options[4], answer, explanation.
```

## 5. Sentence-building (writing) tasks

```
Write {3} sentences at {advanced} level demonstrating {inversion after "Not only" /
participle clauses / relative clauses}. Split each into 4–5 fragments that have only ONE
grammatical order. Avoid fragments that could be swapped and still be correct.
Give: tokens (in the correct order), concept, explanation, example.
```

## 6. Idiom explanations and historical backgrounds

```
For the idiom "{bite the bullet}", provide:
1. Modern meaning (learner-dictionary style).
2. An example sentence a Hong Kong teenager might say.
3. Historical background. Only include claims supported by reliable sources
   (OED, Merriam-Webster, Online Etymology Dictionary, The Phrase Finder,
   World Wide Words). Give the earliest recorded use if known, with hedged wording
   if sources disagree.
4. Explicitly separate documented facts from popular explanations. If a popular story
   is unproven or false, say so.
5. A reliability label: documented / partly-documented / uncertain, with a one-sentence
   reason.
6. How the original sense connects to the modern meaning.
7. A list of the specific sources (title + URL) that support each claim.
8. A four-option question testing meaning, usage or origin.

If you are not confident about any historical claim, write "UNVERIFIED" next to it
so a human can check it.
```

Review checklist for idiom output:

- [ ] Every historical claim is supported by a listed source that was actually opened and read.
- [ ] Dates are hedged where sources disagree.
- [ ] Popular myths are labelled as myths.
- [ ] The reliability label matches the evidence.

## 7. Riddles and linguistic puzzles

```
Write {4} riddles that depend on LANGUAGE, not general knowledge. Each must turn on one of:
polysemy, homophones, transitive vs intransitive verbs, reversed spelling, use vs mention,
presupposition, or structural ambiguity.

For each give: riddle, options[4] (one correct, three plausible), hint (nudges toward
the language feature without giving the answer), explanation (name and explain the
feature), concept (name of the feature). Order them from easiest to hardest.
Avoid riddles that only work in American English or need cultural knowledge.
```

## 8. Difficulty variations

```
Here is a {beginner} question:
{paste question JSON}

Create two variations testing the SAME language point:
- an intermediate version (longer sentence, less obvious context, closer distractors);
- an advanced version (formal register or embedded clause, distractors that are
  grammatical but wrong in meaning).
Keep exactly one correct answer in each and explain what makes each version harder.
```

## 9. Review prompt (second pass)

```
Act as an experienced HKDSE English teacher. Review the following questions.
For each, report: (a) is there exactly one defensible answer? (b) is any distractor
arguably correct? (c) is the explanation accurate and clear for a 14-year-old?
(d) is the difficulty label right? Suggest specific fixes.
{paste questions}
```
