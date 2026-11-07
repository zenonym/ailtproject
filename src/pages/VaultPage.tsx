import { ArrowLeft, CheckCircle2, ExternalLink, KeyRound, Lightbulb, Lock, ScrollText, Sparkles, XCircle } from 'lucide-react';
import { useMemo, useState } from 'react';
import type { Route, Update } from '../App';
import { Panel, SpeakButton } from '../components/ui';
import { IDIOMS, RIDDLES } from '../data/lore';
import { isLoreVaultUnlocked, recordLore, shuffle } from '../game/engine';
import type { Idiom, Riddle, SaveData } from '../types';

const STATUS = {
  documented: { label: 'Documented origin', cls: 'ok' },
  'partly-documented': { label: 'Partly documented', cls: 'warn' },
  uncertain: { label: 'Origin uncertain / disputed', cls: 'bad' },
} as const;

export function VaultPage({ save, update, go }: { save: SaveData; update: Update; go: (r: Route) => void }) {
  const [tab, setTab] = useState<'idioms' | 'riddles'>('idioms');
  const [openIdiom, setOpenIdiom] = useState<Idiom | null>(null);
  const [openRiddle, setOpenRiddle] = useState<Riddle | null>(null);

  if (!isLoreVaultUnlocked(save)) {
    return (
      <div className="page narrow center">
        <Lock size={48} />
        <h1 className="page-title">The Lore Vault is sealed</h1>
        <p>Defeat the Cinder Wyrm in Emberfall to open it.</p>
        <button className="btn btn-primary" onClick={() => go({ name: 'map' })}>World Map</button>
      </div>
    );
  }

  if (openIdiom) return <IdiomStudy idiom={openIdiom} save={save} update={update} onBack={() => setOpenIdiom(null)} />;
  if (openRiddle) return <RiddleView riddle={openRiddle} save={save} update={update} onBack={() => setOpenRiddle(null)} />;

  const collected = save.progress.idiomsCollected;
  const solved = save.progress.riddlesSolved;

  return (
    <div className="page vault">
      <div className="vault-hero">
        <KeyRound size={36} />
        <h1 className="page-title">The Lore Vault</h1>
        <p>Beneath the Archive, words keep their histories. Study idioms and their origins, and test your linguistic wits in the Riddle Chamber.</p>
      </div>
      <div className="tabs" role="tablist">
        <button role="tab" aria-selected={tab === 'idioms'} className={`tab ${tab === 'idioms' ? 'active' : ''}`} onClick={() => setTab('idioms')}>
          <ScrollText size={16} /> Idiom Archives <small>{collected.length}/{IDIOMS.length}</small>
        </button>
        <button role="tab" aria-selected={tab === 'riddles'} className={`tab ${tab === 'riddles' ? 'active' : ''}`} onClick={() => setTab('riddles')}>
          <Sparkles size={16} /> Riddle Chamber <small>{solved.length}/{RIDDLES.length}</small>
        </button>
      </div>

      {tab === 'idioms' ? (
        <>
          <p className="muted center">Open a sealed scroll to study an idiom. Pass its challenge to earn the Lore Card.</p>
          <div className="lore-grid">
            {IDIOMS.map((i, n) => {
              const has = collected.includes(i.id);
              const seen = save.progress.idiomsDiscovered.includes(i.id);
              return (
                <button key={i.id} className={`lore-card ${has ? 'collected' : seen ? 'seen' : 'sealed'}`} onClick={() => {
                  setOpenIdiom(i);
                  if (!seen) update((s) => ({ ...s, progress: { ...s.progress, idiomsDiscovered: [...s.progress.idiomsDiscovered, i.id] } }));
                }}>
                  <span className="lore-num">{String(n + 1).padStart(2, '0')}</span>
                  <strong>{seen || has ? i.phrase : 'Sealed scroll'}</strong>
                  <small>{has ? 'Lore Card collected' : seen ? 'Challenge pending' : 'Click to unseal'}</small>
                  {has && <span className={`chip ${STATUS[i.status].cls}`}>{STATUS[i.status].label}</span>}
                </button>
              );
            })}
          </div>
        </>
      ) : (
        <>
          <p className="muted center">Riddles grow harder as you go deeper. Solve one to open the next door.</p>
          <ol className="riddle-path">
            {RIDDLES.map((r, n) => {
              const open = n === 0 || solved.includes(RIDDLES[n - 1].id);
              const done = solved.includes(r.id);
              return (
                <li key={r.id}>
                  <button className={`riddle-door ${done ? 'done' : open ? 'open' : 'locked'}`} disabled={!open} onClick={() => setOpenRiddle(r)}>
                    <span className="lore-num">{n + 1}</span>
                    <span>{done ? <><strong>{r.options[r.answer]}</strong><small>{r.concept}</small></> : open ? <><strong>Unsolved riddle</strong><small>Door open</small></> : <><strong>Locked door</strong><small>Solve riddle {n} first</small></>}</span>
                    {done ? <CheckCircle2 size={20} /> : open ? <KeyRound size={20} /> : <Lock size={20} />}
                  </button>
                </li>
              );
            })}
          </ol>
        </>
      )}
    </div>
  );
}

function IdiomStudy({ idiom, save, update, onBack }: { idiom: Idiom; save: SaveData; update: Update; onBack: () => void }) {
  const has = save.progress.idiomsCollected.includes(idiom.id);
  const [attempt, setAttempt] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const order = useMemo(() => shuffle([0, 1, 2, 3]), [attempt]);
  const c = idiom.challenge;
  const rate = save.settings.speechRate;

  const choose = (i: number) => {
    if (picked !== null) return;
    setPicked(i);
    const ok = i === c.answer;
    update((s) => {
      const r = recordLore(s, 'idioms', ok);
      return ok && !r.progress.idiomsCollected.includes(idiom.id)
        ? { ...r, progress: { ...r.progress, idiomsCollected: [...r.progress.idiomsCollected, idiom.id] } }
        : r;
    });
  };

  return (
    <div className="page narrow vault">
      <button className="btn btn-ghost btn-sm" onClick={onBack}><ArrowLeft size={16} /> Idiom Archives</button>
      <article className={`panel idiom ${has ? 'collected' : ''}`}>
        <h1 className="idiom-phrase">{idiom.phrase}</h1>
        <div className="row"><SpeakButton text={idiom.phrase} rate={rate} label="Hear the idiom" /><SpeakButton text={idiom.example} rate={rate} label="Hear the example" /></div>
        <p className="speak-tip">Speaking practice: say the idiom and the example aloud, then compare with the model.</p>
        <h3>Meaning</h3><p>{idiom.meaning}</p>
        <h3>Example</h3><p className="example">{idiom.example}</p>
        <h3>Historical background</h3><p>{idiom.origin}</p>
        <h3>From original to modern meaning</h3><p>{idiom.link}</p>
        <p className={`status status-${idiom.status}`}><strong>{STATUS[idiom.status].label}.</strong> {idiom.statusNote}</p>
        <h3>Sources</h3>
        <ul className="sources">
          {idiom.sources.map((s) => <li key={s.url}><a href={s.url} target="_blank" rel="noreferrer">{s.label} <ExternalLink size={14} /></a></li>)}
        </ul>
      </article>

      <Panel title={<><Sparkles size={18} /> Lore challenge</>} className="challenge">
        <p className="q-prompt">{c.prompt}</p>
        <div className="answers">
          {order.map((i, pos) => {
            const st = picked === null ? '' : i === c.answer ? 'correct' : i === picked ? 'wrong' : 'faded';
            return (
              <button key={i} className={`answer ${st}`} disabled={picked !== null} onClick={() => choose(i)}>
                <span className="letter">{'ABCD'[pos]}</span><span>{c.options[i]}</span>
              </button>
            );
          })}
        </div>
        {picked !== null && (
          <div className={`feedback ${picked === c.answer ? 'good' : 'bad'}`}>
            <h3>{picked === c.answer ? <><CheckCircle2 size={20} /> Lore Card earned!</> : <><XCircle size={20} /> Not quite</>}</h3>
            <p>{c.explanation}</p>
            <div className="row end">
              {picked !== c.answer && <button className="btn btn-secondary" onClick={() => { setPicked(null); setAttempt((a) => a + 1); }}>Try again</button>}
              <button className="btn btn-primary" onClick={onBack} autoFocus>Back to the Archives</button>
            </div>
          </div>
        )}
      </Panel>
    </div>
  );
}

function RiddleView({ riddle, save, update, onBack }: { riddle: Riddle; save: SaveData; update: Update; onBack: () => void }) {
  const [attempt, setAttempt] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [hint, setHint] = useState(false);
  const order = useMemo(() => shuffle([0, 1, 2, 3]), [attempt]);
  const solved = save.progress.riddlesSolved.includes(riddle.id);

  const choose = (i: number) => {
    if (picked !== null) return;
    setPicked(i);
    const ok = i === riddle.answer;
    update((s) => {
      const r = recordLore(s, 'riddles', ok);
      return ok && !r.progress.riddlesSolved.includes(riddle.id)
        ? { ...r, progress: { ...r.progress, riddlesSolved: [...r.progress.riddlesSolved, riddle.id] } }
        : r;
    });
  };

  return (
    <div className="page narrow vault">
      <button className="btn btn-ghost btn-sm" onClick={onBack}><ArrowLeft size={16} /> Riddle Chamber</button>
      <Panel className="riddle">
        <p className="chip">Riddle {RIDDLES.indexOf(riddle) + 1} of {RIDDLES.length} {solved && '· solved'}</p>
        <h1 className="riddle-text">{riddle.riddle}</h1>
        <div className="answers">
          {order.map((i, pos) => {
            const st = picked === null ? '' : i === riddle.answer ? 'correct' : i === picked ? 'wrong' : 'faded';
            return (
              <button key={i} className={`answer ${st}`} disabled={picked !== null} onClick={() => choose(i)}>
                <span className="letter">{'ABCD'[pos]}</span><span>{riddle.options[i]}</span>
              </button>
            );
          })}
        </div>
        {picked === null && (
          <button className="btn btn-ghost btn-sm" onClick={() => setHint(true)} disabled={hint}><Lightbulb size={16} /> {hint ? 'Hint shown' : 'Show hint'}</button>
        )}
        {hint && picked === null && <p className="hint"><Lightbulb size={16} /> {riddle.hint}</p>}
        {picked !== null && (
          <div className={`feedback ${picked === riddle.answer ? 'good' : 'bad'}`}>
            <h3>{picked === riddle.answer ? <><CheckCircle2 size={20} /> Solved!</> : <><XCircle size={20} /> The door stays shut</>}</h3>
            {picked !== riddle.answer && <p>Think again about the wording — then try once more. The explanation will be revealed when you solve it.</p>}
            {picked === riddle.answer && (
              <>
                <p className="concept">Linguistic concept: {riddle.concept}</p>
                <p>{riddle.explanation}</p>
              </>
            )}
            <div className="row end">
              {picked !== riddle.answer && <button className="btn btn-secondary" onClick={() => { setPicked(null); setAttempt((a) => a + 1); setHint(true); }} autoFocus>Try again (with hint)</button>}
              <button className="btn btn-primary" onClick={onBack} autoFocus={picked === riddle.answer}>Back to the Chamber</button>
            </div>
          </div>
        )}
      </Panel>
    </div>
  );
}
