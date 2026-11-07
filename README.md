# LEXQUEST

An English language-learning fantasy RPG for Hong Kong secondary school students. Defeat creatures by answering English questions, explore three regions of rising difficulty, and uncover the histories of idioms in the Lore Vault.

**Play:** https://zenonym.github.io/ailtproject/

## Features

- Turn-based question battles with attack/counter-attack animations, explanations after every answer, hints, a Focus ability and healing tonics
- Three regions (Beginner → Advanced), region bosses with a sentence-building Final Challenge, three side quests and a mistakes-only Training Grounds
- 63 curated activities: 47 combat questions (grammar, vocabulary, reading, listening, writing), 8 idioms with sourced histories, 8 linguistic riddles
- Listening via the browser's SpeechSynthesis with replay and transcript fallback; speaking practice with model audio
- Language Codex with search and filters; statistics with accuracy by topic and transparent rule-based recommendations
- Progress saved in `localStorage`; reset with confirmation
- No runtime AI, no backend, no API keys

## Development

```bash
npm install
npm run dev      # http://localhost:5173/ailtproject/
npm test         # game logic and content integrity tests
npm run build    # production build in dist/
```

Pushing to `main` builds, tests and deploys to GitHub Pages via `.github/workflows/deploy.yml`.

## Structure

```
src/
  data/        questions, idioms, riddles, regions and monsters (static content)
  game/        pure game logic (engine, recommendations) + tests
  pages/       screens (menu, setup, map, region, battle, codex, stats, vault, settings)
  components/  shared UI and SVG monster illustrations
  utils/       storage and speech helpers
  styles/      global stylesheet
docs/          assignment guide, AI usage, prompts, content sources
```

See [`docs/ASSIGNMENT_GUIDE.md`](docs/ASSIGNMENT_GUIDE.md) for the educational rationale.
