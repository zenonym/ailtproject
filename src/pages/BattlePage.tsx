import { ArrowRight, CheckCircle2, Crown, FlaskConical, Lightbulb, LogOut, RotateCcw, Sparkles, Trophy, XCircle, Zap } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import type { Route, Update } from '../App';
import { MonsterArt } from '../components/MonsterArt';
import { Avatar, Bar, ListenPanel, SpeakButton } from '../components/ui';
import { finishBattle, maxHpFor, pickQuestion, recordAnswer, regionName, shuffle, TONIC_HEAL, type BattleOutcome } from '../game/engine';
import { monsterById, TOPIC_LABELS } from '../data/world';
import type { Question, RegionId, SaveData } from '../types';

const LETTERS = ['A', 'B', 'C', 'D'];
const PRAISE = ['Direct hit!', 'Well struck!', 'Precise!', 'Excellent!', 'Spot on!'];
const FOCUS_COST = 3;

interface Turn { q: Question; correct: boolean }

export function BattlePage({ save, update, monsterId, from, go }: { save: SaveData; update: Update; monsterId: string; from: RegionId; go: (r: Route) => void }) {
  const monster = monsterById(monsterId)!;
  const maxHp = maxHpFor(save.player.level);
  const [playerHp, setPlayerHp] = useState(maxHp);
  const [enemyHp, setEnemyHp] = useState(monster.hp);
  const [used, setUsed] = useState<string[]>([]);
  const [q, setQ] = useState<Question>(() => pickQuestion(monster, save, []));
  const [phase, setPhase] = useState<'ask' | 'feedback' | 'over'>('ask');
  const [picked, setPicked] = useState<number | null>(null);
  const [placed, setPlaced] = useState<number[]>([]);
  const [lastCorrect, setLastCorrect] = useState(false);
  const [combo, setCombo] = useState(0);
  const [energy, setEnergy] = useState(0);
  const [hidden, setHidden] = useState<number[]>([]);
  const [hint, setHint] = useState(false);
  const [anim, setAnim] = useState<'hit' | 'hurt' | null>(null);
  const [turns, setTurns] = useState<Turn[]>([]);
  const [outcome, setOutcome] = useState<BattleOutcome | null>(null);
  const [message, setMessage] = useState('');
  const continueRef = useRef<HTMLButtonElement>(null);

  const isFinal = monster.boss && enemyHp === 1;
  // Shuffled display order for options / tokens, fixed per question.
  const order = useMemo(() => (q.kind === 'choice' ? shuffle([0, 1, 2, 3]) : shuffle(q.tokens.map((_, i) => i))), [q]);

  const answer = (correct: boolean, choice: number | null) => {
    if (phase !== 'ask') return;
    setPicked(choice);
    setLastCorrect(correct);
    setPhase('feedback');
    setTurns((t) => [...t, { q, correct }]);
    update((s) => recordAnswer(s, q, correct));
    if (correct) {
      setEnemyHp((h) => h - 1);
      setCombo((c) => c + 1);
      setEnergy((e) => Math.min(FOCUS_COST, e + 1));
      setMessage(combo + 1 >= 3 ? `${combo + 1}× combo! ${PRAISE[combo % PRAISE.length]}` : PRAISE[(turns.length + combo) % PRAISE.length]);
      setAnim('hit');
    } else {
      setPlayerHp((h) => h - 1);
      setCombo(0);
      setMessage(`${monster.name} strikes back!`);
      setAnim('hurt');
    }
    setTimeout(() => setAnim(null), 650);
  };

  const next = () => {
    const correct = turns.filter((t) => t.correct).length;
    if (enemyHp <= 0 || playerHp <= 0) {
      const r = finishBattle(save, monster, enemyHp <= 0, correct, turns.length);
      update(() => r.save);
      setOutcome(r.outcome);
      setPhase('over');
      return;
    }
    const nowUsed = [...used, q.id];
    setUsed(nowUsed);
    setQ(pickQuestion(monster, save, nowUsed, { kind: monster.boss && enemyHp === 1 ? 'order' : undefined }));
    setPicked(null);
    setPlaced([]);
    setHidden([]);
    setHint(false);
    setPhase('ask');
  };

  useEffect(() => {
    if (phase === 'feedback') continueRef.current?.focus();
  }, [phase]);

  // Keyboard: 1–4 or A–D to answer multiple-choice questions.
  useEffect(() => {
    if (phase !== 'ask' || q.kind !== 'choice') return;
    const onKey = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement).tagName === 'INPUT') return;
      const k = e.key.toLowerCase();
      const pos = '1234'.indexOf(k) >= 0 ? '1234'.indexOf(k) : 'abcd'.indexOf(k);
      if (pos >= 0 && k.length === 1) {
        const opt = order[pos];
        if (!hidden.includes(opt)) answer(opt === q.answer, opt);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  const useFocus = () => {
    if (q.kind !== 'choice' || energy < FOCUS_COST || hidden.length) return;
    const wrong = shuffle([0, 1, 2, 3].filter((i) => i !== q.answer)).slice(0, 2);
    setHidden(wrong);
    setEnergy(0);
  };

  const useTonic = () => {
    if (save.inventory.tonic < 1 || playerHp >= maxHp) return;
    setPlayerHp((h) => Math.min(maxHp, h + TONIC_HEAL));
    update((s) => ({ ...s, inventory: { tonic: s.inventory.tonic - 1 } }));
  };

  if (phase === 'over' && outcome) {
    return <ResultScreen outcome={outcome} monsterName={monster.name} turns={turns} save={save} from={from}
      onRetry={() => go({ name: 'battle', monsterId, from, nonce: Date.now() })} go={go} rate={save.settings.speechRate} />;
  }

  const correctSentence = q.kind === 'order' ? q.tokens.join(' ') : '';

  return (
    <div className={`battle ${monster.boss ? 'is-boss' : ''}`} style={{ ['--accent' as string]: monster.accent }}>
      <div className="battle-top">
        <button className="btn btn-ghost btn-sm" onClick={() => go({ name: 'region', region: from })} aria-label="Retreat from battle">
          <LogOut size={16} /> Retreat
        </button>
        <span className="chip">{monster.boss ? <><Crown size={14} /> Boss</> : monster.training ? 'Training' : monster.quest ? 'Side quest' : regionName(monster.region)}</span>
      </div>

      <div className={`arena ${anim ? `anim-${anim}` : ''}`}>
        <div className="combatant enemy">
          <div className="combatant-info">
            <strong>{monster.name}</strong> <small>{monster.title}</small>
            <Bar kind="enemy" value={Math.max(0, enemyHp)} max={monster.hp} label={`HP ${Math.max(0, enemyHp)}/${monster.hp}`} />
          </div>
          <div className="monster-sprite">
            <MonsterArt monster={monster} size={190} />
            {anim === 'hit' && <span className="dmg" aria-hidden="true">-1</span>}
            {anim === 'hit' && <span className="slash" aria-hidden="true" />}
          </div>
        </div>
        <div className="combatant player">
          <Avatar id={save.player.avatar} size={64} />
          <div className="combatant-info">
            <strong>{save.player.name}</strong> <small>Lv {save.player.level}</small>
            <Bar kind="hp" value={Math.max(0, playerHp)} max={maxHp} label={`HP ${Math.max(0, playerHp)}/${maxHp}`} />
            <div className="energy" title="Focus charges with each correct answer">
              <Zap size={14} /> Focus
              {Array.from({ length: FOCUS_COST }).map((_, i) => <i key={i} className={i < energy ? 'on' : ''} />)}
              {combo >= 2 && <span className="combo">{combo}× combo</span>}
            </div>
          </div>
          {anim === 'hurt' && <span className="dmg dmg-player" aria-hidden="true">-1</span>}
        </div>
      </div>

      <section className={`question-panel panel ${isFinal ? 'final' : ''}`} aria-live="polite">
        <div className="q-meta">
          <span className="chip">{TOPIC_LABELS[q.topic]}</span>
          {isFinal && <span className="chip gold"><Sparkles size={14} /> Final Challenge — rebuild the sentence to seal the boss</span>}
        </div>

        {q.passage && <blockquote className="passage">{q.passage}</blockquote>}
        {q.audio && <ListenPanel key={q.id} lines={q.audio} rate={save.settings.speechRate} />}
        <h2 className="q-prompt">{q.prompt}</h2>

        {q.kind === 'choice' ? (
          <div className="answers">
            {order.map((opt, pos) => {
              const state = phase === 'feedback'
                ? opt === q.answer ? 'correct' : opt === picked ? 'wrong' : 'faded'
                : hidden.includes(opt) ? 'hidden' : '';
              return (
                <button key={opt} className={`answer ${state}`} disabled={phase !== 'ask' || hidden.includes(opt)}
                  onClick={() => answer(opt === q.answer, opt)} aria-label={`${LETTERS[pos]}: ${q.options[opt]}`}>
                  <span className="letter">{LETTERS[pos]}</span>
                  <span>{q.options[opt]}</span>
                  {state === 'correct' && <CheckCircle2 className="mark" size={20} />}
                  {state === 'wrong' && <XCircle className="mark" size={20} />}
                </button>
              );
            })}
          </div>
        ) : (
          <div className="builder">
            <div className={`built ${phase === 'feedback' ? (lastCorrect ? 'correct' : 'wrong') : ''}`} aria-label="Your sentence">
              {placed.length === 0 && <span className="muted">Tap the fragments below in the right order…</span>}
              {placed.map((ti, i) => (
                <button key={ti} className="token placed" disabled={phase !== 'ask'} onClick={() => setPlaced(placed.filter((_, j) => j !== i))}>{q.tokens[ti]}</button>
              ))}
            </div>
            <div className="tokens">
              {order.filter((ti) => !placed.includes(ti)).map((ti) => (
                <button key={ti} className="token" disabled={phase !== 'ask'} onClick={() => setPlaced([...placed, ti])}>{q.tokens[ti]}</button>
              ))}
            </div>
            {phase === 'ask' && (
              <div className="row">
                <button className="btn btn-ghost btn-sm" onClick={() => setPlaced([])} disabled={!placed.length}>Clear</button>
                <button className="btn btn-primary" disabled={placed.length !== q.tokens.length}
                  onClick={() => answer(placed.every((ti, i) => ti === i), null)}>Check sentence</button>
              </div>
            )}
          </div>
        )}

        {phase === 'ask' && (
          <div className="tools">
            {q.hint && <button className="btn btn-ghost btn-sm" onClick={() => setHint(true)} disabled={hint}><Lightbulb size={16} /> {hint ? 'Hint shown' : 'Hint'}</button>}
            {q.kind === 'choice' && (
              <button className="btn btn-ghost btn-sm" onClick={useFocus} disabled={energy < FOCUS_COST || hidden.length > 0}>
                <Zap size={16} /> Focus: remove 2 options
              </button>
            )}
            <button className="btn btn-ghost btn-sm" onClick={useTonic} disabled={save.inventory.tonic < 1 || playerHp >= maxHp}>
              <FlaskConical size={16} /> Tonic ({save.inventory.tonic})
            </button>
          </div>
        )}
        {hint && phase === 'ask' && <p className="hint"><Lightbulb size={16} /> {q.hint}</p>}

        {phase === 'feedback' && (
          <div className={`feedback ${lastCorrect ? 'good' : 'bad'}`}>
            <h3>{lastCorrect ? <CheckCircle2 size={22} /> : <XCircle size={22} />} {message}</h3>
            {!lastCorrect && (
              <p><strong>Correct answer:</strong> {q.kind === 'choice' ? q.options[q.answer] : correctSentence}</p>
            )}
            <p className="concept">{q.concept}</p>
            <p>{q.explanation}</p>
            {q.example && <p className="example"><em>Example:</em> {q.example}</p>}
            {q.kind === 'order' && (
              <p className="speak-tip">
                <strong>Speaking practice:</strong> read the sentence aloud, then compare with the model. <SpeakButton text={correctSentence} rate={save.settings.speechRate} label="Model" />
              </p>
            )}
            <div className="row end">
              <button ref={continueRef} className="btn btn-primary" onClick={next}>
                {enemyHp <= 0 ? 'Claim victory' : playerHp <= 0 ? 'See result' : 'Next question'} <ArrowRight size={18} />
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

function ResultScreen({ outcome, monsterName, turns, save, from, onRetry, go, rate }: {
  outcome: BattleOutcome; monsterName: string; turns: Turn[]; save: SaveData; from: RegionId; onRetry: () => void; go: (r: Route) => void; rate: number;
}) {
  const acc = outcome.total ? Math.round((outcome.correct / outcome.total) * 100) : 0;
  const missed = turns.filter((t) => !t.correct);
  return (
    <div className="result narrow">
      <div className={`result-banner ${outcome.won ? 'win' : 'lose'}`}>
        {outcome.won ? <Trophy size={56} /> : <RotateCcw size={56} />}
        <h1>{outcome.won ? 'Victory!' : 'Defeated — but wiser'}</h1>
        <p>{outcome.won ? `${monsterName} has been mended.` : `${monsterName} won this time. Every mistake you saw is now in your review list.`}</p>
      </div>
      <div className="result-stats">
        <div><span>EXP</span><strong>+{outcome.exp}</strong></div>
        <div><span>Coins</span><strong>+{outcome.coins}</strong></div>
        <div><span>Accuracy</span><strong>{acc}%</strong></div>
        <div><span>Answers</span><strong>{outcome.correct}/{outcome.total}</strong></div>
      </div>
      <div className="rewards">
        {outcome.firstClear && <p className="reward">★ First victory bonus: +25% EXP, +50% coins</p>}
        {outcome.levelsGained > 0 && <p className="reward">⬆ Level up! You are now level {save.player.level}. Max HP: {maxHpFor(save.player.level)}</p>}
        {outcome.regionCleared && <p className="reward big">🏰 {regionName(outcome.regionCleared)} completed!
          {outcome.regionCleared === 'vale' && ' Emberfall is now open.'}
          {outcome.regionCleared === 'ember' && ' The Obsidian Archive and the Lore Vault are now open.'}
          {outcome.regionCleared === 'archive' && ' You have mended every region. The Lore Vault still holds secrets.'}
        </p>}
      </div>
      {missed.length > 0 && (
        <section className="panel">
          <h2 className="panel-title">Review</h2>
          {missed.map(({ q }, i) => (
            <details key={i} className="review-item">
              <summary>{q.prompt} <span className="chip">{TOPIC_LABELS[q.topic]}</span></summary>
              <p><strong>Answer:</strong> {q.kind === 'choice' ? q.options[q.answer] : q.tokens.join(' ')} {q.kind === 'order' && <SpeakButton text={q.tokens.join(' ')} rate={rate} />}</p>
              <p>{q.explanation}</p>
            </details>
          ))}
        </section>
      )}
      <div className="row center">
        <button className="btn btn-ghost" onClick={onRetry}><RotateCcw size={18} /> {outcome.won ? 'Fight again' : 'Retry'}</button>
        <button className="btn btn-primary" onClick={() => go(outcome.regionCleared && outcome.regionCleared !== 'archive' ? { name: 'map' } : { name: 'region', region: from })} autoFocus>
          Continue <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
}
