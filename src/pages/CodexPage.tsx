import { BookOpen, Lock, Search } from 'lucide-react';
import { useState } from 'react';
import { Panel, SpeakButton } from '../components/ui';
import { IDIOMS, RIDDLES } from '../data/lore';
import { QUESTIONS } from '../data/questions';
import { REGIONS, TOPIC_LABELS } from '../data/world';
import type { RegionId, SaveData } from '../types';

type Tab = 'vocab' | 'concepts' | 'idioms' | 'riddles';
const STATUS_LABEL = { documented: 'Documented origin', 'partly-documented': 'Partly documented', uncertain: 'Origin uncertain' } as const;

export function CodexPage({ save }: { save: SaveData }) {
  const [tab, setTab] = useState<Tab>('vocab');
  const [query, setQuery] = useState('');
  const [region, setRegion] = useState<RegionId | 'all'>('all');
  const rate = save.settings.speechRate;
  const seen = (id: string) => id in save.stats.seen;
  const match = (...txt: string[]) => !query || txt.join(' ').toLowerCase().includes(query.toLowerCase());
  const inRegion = (r: RegionId) => region === 'all' || region === r;

  const vocab = QUESTIONS.filter((q) => q.vocab && inRegion(q.region));
  const concepts = QUESTIONS.filter((q) => inRegion(q.region));
  const tabs: { id: Tab; label: string; count: string }[] = [
    { id: 'vocab', label: 'Vocabulary', count: `${vocab.filter((q) => seen(q.id)).length}/${vocab.length}` },
    { id: 'concepts', label: 'Concepts', count: `${concepts.filter((q) => seen(q.id)).length}/${concepts.length}` },
    { id: 'idioms', label: 'Idioms', count: `${save.progress.idiomsCollected.length}/${IDIOMS.length}` },
    { id: 'riddles', label: 'Riddles', count: `${save.progress.riddlesSolved.length}/${RIDDLES.length}` },
  ];

  return (
    <div className="page">
      <h1 className="page-title"><BookOpen size={28} /> Language Codex</h1>
      <p className="muted center">Everything you have discovered on your journey. Entries unlock as you meet them in battle or in the Lore Vault.</p>

      <div className="tabs" role="tablist">
        {tabs.map((t) => (
          <button key={t.id} role="tab" aria-selected={tab === t.id} className={`tab ${tab === t.id ? 'active' : ''}`} onClick={() => setTab(t.id)}>
            {t.label} <small>{t.count}</small>
          </button>
        ))}
      </div>

      <div className="filters">
        <label className="search">
          <Search size={18} />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search the Codex…" aria-label="Search the Codex" />
        </label>
        {(tab === 'vocab' || tab === 'concepts') && (
          <select value={region} onChange={(e) => setRegion(e.target.value as RegionId | 'all')} aria-label="Filter by region">
            <option value="all">All regions</option>
            {REGIONS.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
          </select>
        )}
      </div>

      <div className="codex-list">
        {tab === 'vocab' && vocab.filter((q) => match(q.vocab!.word, q.vocab!.meaning)).map((q) => seen(q.id) ? (
          <Panel key={q.id} className="codex-entry">
            <h3>{q.vocab!.word} <SpeakButton text={q.vocab!.word} rate={rate} label="Say" /></h3>
            <p>{q.vocab!.meaning}</p>
            {q.example && <p className="example">{q.example}</p>}
          </Panel>
        ) : <LockedEntry key={q.id} text="Meet this word in battle to unlock it." />)}

        {tab === 'concepts' && concepts.filter((q) => match(q.concept, q.explanation, TOPIC_LABELS[q.topic])).map((q) => seen(q.id) ? (
          <Panel key={q.id} className="codex-entry">
            <h3>{q.concept} <span className="chip">{TOPIC_LABELS[q.topic]}</span></h3>
            <p>{q.explanation}</p>
            {q.example && <p className="example">{q.example}</p>}
          </Panel>
        ) : <LockedEntry key={q.id} text={`A ${TOPIC_LABELS[q.topic].toLowerCase()} concept from ${REGIONS.find((r) => r.id === q.region)!.name}.`} />)}

        {tab === 'idioms' && IDIOMS.filter((i) => match(i.phrase, i.meaning, i.origin)).map((i) => {
          const collected = save.progress.idiomsCollected.includes(i.id);
          if (!collected) return <LockedEntry key={i.id} text={save.progress.idiomsDiscovered.includes(i.id) ? `"${i.phrase}" — complete its challenge in the Lore Vault to collect the card.` : 'Discover this idiom in the Lore Vault.'} />;
          return (
            <Panel key={i.id} className="codex-entry">
              <h3>{i.phrase} <SpeakButton text={i.phrase} rate={rate} label="Say" /></h3>
              <p><strong>Meaning:</strong> {i.meaning}</p>
              <p className="example">{i.example}</p>
              <p><strong>Origin:</strong> {i.origin}</p>
              <p className={`status status-${i.status}`}>{STATUS_LABEL[i.status]} — {i.statusNote}</p>
            </Panel>
          );
        })}

        {tab === 'riddles' && RIDDLES.filter((r) => match(r.riddle, r.concept, r.explanation)).map((r) => save.progress.riddlesSolved.includes(r.id) ? (
          <Panel key={r.id} className="codex-entry">
            <h3>{r.riddle}</h3>
            <p><strong>Answer:</strong> {r.options[r.answer]} <span className="chip">{r.concept}</span></p>
            <p>{r.explanation}</p>
          </Panel>
        ) : <LockedEntry key={r.id} text="Solve this riddle in the Riddle Chamber." />)}
      </div>
    </div>
  );
}

function LockedEntry({ text }: { text: string }) {
  return (
    <div className="panel codex-entry locked">
      <Lock size={18} /> <span>{text}</span>
    </div>
  );
}
