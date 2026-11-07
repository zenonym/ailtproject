import { ArrowLeft, Coins, Crown, FlaskConical, Lock, MessageCircle, ScrollText, Swords, Target } from 'lucide-react';
import { useState } from 'react';
import type { Route, Update } from '../App';
import { MonsterArt } from '../components/MonsterArt';
import { Panel } from '../components/ui';
import { isMonsterAvailable, TONIC_PRICE } from '../game/engine';
import { MONSTERS, regionById } from '../data/world';
import type { Monster, RegionId, SaveData } from '../types';

export function RegionPage({ save, update, region, go }: { save: SaveData; update: Update; region: RegionId; go: (r: Route) => void }) {
  const r = regionById(region);
  const [talk, setTalk] = useState<{ npc: number; line: number } | null>(
    region === 'vale' && save.stats.battles === 0 ? { npc: 0, line: 0 } : null,
  );
  const monsters = MONSTERS.filter((m) => m.region === region);
  const ordinary = monsters.filter((m) => !m.boss && !m.quest && !m.training);
  const quests = monsters.filter((m) => m.quest);
  const boss = monsters.find((m) => m.boss)!;
  const training = monsters.find((m) => m.training);
  const fight = (m: Monster) => go({ name: 'battle', monsterId: m.id, from: region, nonce: Date.now() });
  const canBuy = save.player.coins >= TONIC_PRICE;

  const npc = talk ? r.npcs[talk.npc] : null;

  return (
    <div className="page region" style={{ ['--accent' as string]: r.colors.accent, ['--glow' as string]: r.colors.glow, ['--region-bg' as string]: r.colors.bg }}>
      <div className="region-hero">
        <button className="btn btn-ghost btn-sm" onClick={() => go({ name: 'map' })}><ArrowLeft size={16} /> World Map</button>
        <h1 className="page-title">{r.name}</h1>
        <p className="chip">{r.level}</p>
        <p className="story">{r.story}</p>
      </div>

      <div className="region-layout">
        <div>
          <Panel title={<><MessageCircle size={18} /> {r.village}</>}>
            <div className="npc-list">
              {r.npcs.map((n, i) => (
                <button key={n.name} className="npc" onClick={() => setTalk({ npc: i, line: 0 })}>
                  <span className="npc-portrait" aria-hidden="true">{n.name[0]}</span>
                  <span><strong>{n.name}</strong><small>{n.role}</small></span>
                </button>
              ))}
            </div>
            {npc && talk && (
              <div className="dialogue" aria-live="polite">
                <p className="dialogue-name">{npc.name}</p>
                <p>{npc.lines[talk.line]}</p>
                <div className="row end">
                  {talk.line < npc.lines.length - 1
                    ? <button className="btn btn-secondary btn-sm" onClick={() => setTalk({ ...talk, line: talk.line + 1 })} autoFocus>Next ({talk.line + 1}/{npc.lines.length})</button>
                    : <button className="btn btn-secondary btn-sm" onClick={() => setTalk(null)} autoFocus>Farewell</button>}
                </div>
              </div>
            )}
            <div className="shop">
              <div><FlaskConical size={18} /> <strong>Herbal Tonic</strong> <span className="muted">restores 2 HP in battle · you have {save.inventory.tonic}</span></div>
              <button className="btn btn-secondary btn-sm" disabled={!canBuy}
                onClick={() => update((s) => ({ ...s, player: { ...s.player, coins: s.player.coins - TONIC_PRICE }, inventory: { tonic: s.inventory.tonic + 1 } }))}>
                <Coins size={14} /> Buy for {TONIC_PRICE}
              </button>
            </div>
          </Panel>

          {quests.length > 0 && (
            <Panel title={<><ScrollText size={18} /> Side quests</>}>
              {quests.map((q) => {
                const done = save.progress.defeated.includes(q.id);
                return (
                  <div key={q.id} className={`quest ${done ? 'done' : ''}`}>
                    <div>
                      <strong>{q.quest!.title}</strong> {done && <span className="chip ok">Complete</span>}
                      <p>{q.quest!.text}</p>
                      <small className="muted">From {q.quest!.giver} · {q.quest!.reward}</small>
                    </div>
                    <button className="btn btn-secondary btn-sm" onClick={() => fight(q)}>{done ? 'Replay' : 'Accept'}</button>
                  </div>
                );
              })}
            </Panel>
          )}

          {training && (
            <Panel title={<><Target size={18} /> Training Grounds</>}>
              <p>{training.flavour}</p>
              <p className="muted">Mistakes waiting for review: {save.stats.mistakes.length}</p>
              <button className="btn btn-secondary btn-sm" disabled={!isMonsterAvailable(save, training)} onClick={() => fight(training)}>
                {save.stats.mistakes.length ? 'Practise my mistakes' : 'No mistakes to review yet'}
              </button>
            </Panel>
          )}
        </div>

        <div>
          <h2 className="section-title"><Swords size={18} /> Creatures</h2>
          <div className="monster-grid">
            {[...ordinary, boss].map((m) => {
              const available = isMonsterAvailable(save, m);
              const beaten = save.progress.defeated.includes(m.id);
              return (
                <button key={m.id} className={`monster-card ${m.boss ? 'boss' : ''} ${available ? '' : 'locked'}`} disabled={!available} onClick={() => fight(m)}
                  aria-label={`${m.name}, ${m.title}${available ? '' : ', locked'}${beaten ? ', defeated' : ''}`}>
                  <div className="monster-thumb">{available ? <MonsterArt monster={m} size={110} /> : <Lock size={40} />}</div>
                  <strong>{m.boss && <Crown size={16} />} {available ? m.name : '???'}</strong>
                  <small>{available ? m.title : 'Defeat every creature here to summon the boss'}</small>
                  <span className="monster-meta">{m.hp} HP · {m.exp} EXP {beaten && <span className="chip ok">Defeated</span>}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
