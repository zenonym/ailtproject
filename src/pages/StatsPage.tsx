import { BarChart3, Compass, Flame, Target, TrendingUp } from 'lucide-react';
import type { Route } from '../App';
import { Panel } from '../components/ui';
import { IDIOMS, RIDDLES } from '../data/lore';
import { questionById } from '../data/questions';
import { REGIONS, TOPIC_LABELS } from '../data/world';
import { overallAccuracy } from '../game/engine';
import { recommend } from '../game/recommend';
import type { SaveData, Topic } from '../types';

const pct = (n: number) => `${Math.round(n * 100)}%`;

export function StatsPage({ save, go }: { save: SaveData; go: (r: Route) => void }) {
  const s = save.stats;
  const topics = (Object.entries(s.byTopic) as [Topic, { correct: number; total: number }][]).sort((a, b) => b[1].total - a[1].total);
  const weak = topics.filter(([, t]) => t.total >= 3 && t.correct / t.total < 0.6);
  const recs = recommend(save);
  const totalAnswered = topics.reduce((n, [, t]) => n + t.total, 0);

  const tiles = [
    { label: 'Level', value: save.player.level },
    { label: 'Battles won', value: `${s.wins}/${s.battles}` },
    { label: 'Overall accuracy', value: totalAnswered ? pct(overallAccuracy(save)) : '—' },
    { label: 'Questions answered', value: totalAnswered },
    { label: 'Regions completed', value: `${save.progress.regionsCompleted.length}/${REGIONS.length}` },
    { label: 'Idioms collected', value: `${save.progress.idiomsCollected.length}/${IDIOMS.length}` },
    { label: 'Riddles solved', value: `${save.progress.riddlesSolved.length}/${RIDDLES.length}` },
    { label: 'Mistakes to review', value: s.mistakes.length },
  ];

  return (
    <div className="page">
      <h1 className="page-title"><BarChart3 size={28} /> Adventurer's Ledger</h1>
      <div className="tiles">
        {tiles.map((t) => <div key={t.label} className="tile"><strong>{t.value}</strong><span>{t.label}</span></div>)}
      </div>

      <div className="grid-2">
        <Panel title={<><Target size={18} /> Accuracy by topic</>}>
          {topics.length === 0 && <p className="muted">Answer some questions to see your accuracy by topic.</p>}
          <ul className="topic-bars">
            {topics.map(([topic, t]) => {
              const a = t.correct / t.total;
              return (
                <li key={topic}>
                  <span className="tb-label">{TOPIC_LABELS[topic]}</span>
                  <span className="tb-track" role="meter" aria-valuenow={Math.round(a * 100)} aria-valuemin={0} aria-valuemax={100} aria-label={`${TOPIC_LABELS[topic]} accuracy`}>
                    <span className={`tb-fill ${a < 0.6 ? 'low' : a >= 0.85 ? 'high' : ''}`} style={{ width: pct(a) }} />
                  </span>
                  <span className="tb-val">{pct(a)} <small>({t.correct}/{t.total})</small></span>
                </li>
              );
            })}
          </ul>
          {weak.length > 0 && <p className="note"><Flame size={16} /> Weak areas (below 60%, at least 3 attempts): {weak.map(([t]) => TOPIC_LABELS[t]).join(', ')}</p>}
        </Panel>

        <Panel title={<><Compass size={18} /> Learning recommendations</>}>
          <p className="muted small">These are produced by simple, transparent rules applied to your statistics — not by AI. Each card shows the rule that triggered it.</p>
          {recs.length === 0 && <p className="muted">No recommendations right now — keep exploring!</p>}
          {recs.map((r) => (
            <div key={r.id} className={`rec rec-${r.tone}`}>
              <strong>{r.title}</strong>
              <p>{r.action}</p>
              <small>Rule: {r.rule}</small>
            </div>
          ))}
          <button className="btn btn-secondary btn-sm" onClick={() => go({ name: 'map' })}>Go to the World Map</button>
        </Panel>

        <Panel title="Mistakes to review">
          {s.mistakes.length === 0 ? <p className="muted">No outstanding mistakes. Wrong answers will appear here with explanations.</p> : (
            <>
              {s.mistakes.map((id) => {
                const q = questionById(id);
                if (!q) return null;
                return (
                  <details key={id} className="review-item">
                    <summary>{q.prompt} <span className="chip">{TOPIC_LABELS[q.topic]}</span></summary>
                    <p><strong>Answer:</strong> {q.kind === 'choice' ? q.options[q.answer] : q.tokens.join(' ')}</p>
                    <p>{q.explanation}</p>
                  </details>
                );
              })}
              <button className="btn btn-secondary btn-sm" onClick={() => go({ name: 'region', region: 'vale' })}>Practise at the Training Grounds</button>
            </>
          )}
        </Panel>

        <Panel title={<><TrendingUp size={18} /> Progression history</>}>
          {s.history.length === 0 ? <p className="muted">Your battles will be recorded here.</p> : (
            <table className="history">
              <thead><tr><th>When</th><th>Creature</th><th>Result</th><th>Score</th></tr></thead>
              <tbody>
                {s.history.map((h, i) => (
                  <tr key={i}>
                    <td>{new Date(h.at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</td>
                    <td>{h.monster}</td>
                    <td className={h.won ? 'txt-ok' : 'txt-bad'}>{h.won ? 'Won' : 'Lost'}</td>
                    <td>{h.correct}/{h.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </Panel>
      </div>
    </div>
  );
}
