import { CheckCircle2, Library, Lock } from 'lucide-react';
import type { Route } from '../App';
import { Panel } from '../components/ui';
import { isLoreVaultUnlocked, isRegionUnlocked, ordinaryMonsters } from '../game/engine';
import { recommend } from '../game/recommend';
import { MONSTERS, REGIONS } from '../data/world';
import type { SaveData } from '../types';

const POS = { vale: { x: 18, y: 70 }, ember: { x: 50, y: 34 }, archive: { x: 82, y: 66 } } as const;

export function WorldMapPage({ save, go }: { save: SaveData; go: (r: Route) => void }) {
  const vault = isLoreVaultUnlocked(save);
  const top = recommend(save)[0];

  return (
    <div className="page">
      <h1 className="page-title">The Known Lands</h1>
      <div className="worldmap" role="group" aria-label="World map">
        <svg className="worldmap-bg" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          <defs>
            <radialGradient id="wm-v" cx="18%" cy="70%" r="35%"><stop offset="0" stopColor="#5fd08a" stopOpacity=".35" /><stop offset="1" stopColor="#5fd08a" stopOpacity="0" /></radialGradient>
            <radialGradient id="wm-e" cx="50%" cy="34%" r="35%"><stop offset="0" stopColor="#ff8a4c" stopOpacity=".35" /><stop offset="1" stopColor="#ff8a4c" stopOpacity="0" /></radialGradient>
            <radialGradient id="wm-a" cx="82%" cy="66%" r="35%"><stop offset="0" stopColor="#a98bff" stopOpacity=".35" /><stop offset="1" stopColor="#a98bff" stopOpacity="0" /></radialGradient>
          </defs>
          <rect width="100" height="100" fill="url(#wm-v)" /><rect width="100" height="100" fill="url(#wm-e)" /><rect width="100" height="100" fill="url(#wm-a)" />
          <path d="M18 70 C28 50 38 38 50 34 C62 30 74 48 82 66" stroke="#e8b84a" strokeWidth=".6" strokeDasharray="1.5 1.5" fill="none" opacity=".7" />
          <path d="M82 66 C80 78 72 86 66 88" stroke="#e8b84a" strokeWidth=".5" strokeDasharray="1 1.5" fill="none" opacity={vault ? 0.8 : 0.25} />
        </svg>
        {REGIONS.map((r) => {
          const unlocked = isRegionUnlocked(save, r.id);
          const done = save.progress.regionsCompleted.includes(r.id);
          const total = MONSTERS.filter((m) => m.region === r.id && !m.training).length;
          const beaten = MONSTERS.filter((m) => m.region === r.id && !m.training && save.progress.defeated.includes(m.id)).length;
          return (
            <button key={r.id} className={`map-node ${unlocked ? '' : 'locked'} ${done ? 'done' : ''}`}
              style={{ left: `${POS[r.id].x}%`, top: `${POS[r.id].y}%`, ['--accent' as string]: r.colors.accent, ['--glow' as string]: r.colors.glow }}
              disabled={!unlocked} onClick={() => go({ name: 'region', region: r.id })}
              aria-label={`${r.name}, ${r.level}${unlocked ? '' : ', locked'}${done ? ', completed' : ''}`}>
              <span className="map-dot">{unlocked ? (done ? <CheckCircle2 size={22} /> : <span className="pulse" />) : <Lock size={20} />}</span>
              <span className="map-label"><strong>{r.name}</strong><small>{r.level} · {beaten}/{total}</small></span>
            </button>
          );
        })}
        <button className={`map-node vault-node ${vault ? '' : 'locked'}`} style={{ left: '64%', top: '88%', ['--accent' as string]: '#f5c451', ['--glow' as string]: 'rgba(245,196,81,.35)' }}
          disabled={!vault} onClick={() => go({ name: 'vault' })} aria-label={vault ? 'Lore Vault' : 'Lore Vault, locked until Emberfall is completed'}>
          <span className="map-dot">{vault ? <Library size={20} /> : <Lock size={20} />}</span>
          <span className="map-label"><strong>Lore Vault</strong><small>{vault ? 'Idioms & riddles' : 'Complete Emberfall'}</small></span>
        </button>
      </div>

      <div className="grid-2">
        {REGIONS.map((r) => {
          const unlocked = isRegionUnlocked(save, r.id);
          const ord = ordinaryMonsters(r.id);
          return (
            <Panel key={r.id} className={`region-card ${unlocked ? '' : 'dim'}`} title={<><span style={{ color: r.colors.accent }}>{r.name}</span> <small className="chip">{r.level}</small></>}>
              <p>{r.theme}</p>
              <p className="muted">Focus: {r.focus.join(' · ')}</p>
              <p className="muted">{unlocked ? `Creatures defeated: ${ord.filter((m) => save.progress.defeated.includes(m.id)).length}/${ord.length}` : 'Locked — defeat the previous region\'s boss.'}</p>
              {unlocked && <button className="btn btn-secondary btn-sm" onClick={() => go({ name: 'region', region: r.id })}>Travel</button>}
            </Panel>
          );
        })}
        {top && (
          <Panel className="rec-card" title="Suggested next step">
            <p><strong>{top.title}</strong></p>
            <p>{top.action}</p>
            <p className="muted small">Why: {top.rule}</p>
            <button className="btn btn-ghost btn-sm" onClick={() => go({ name: 'stats' })}>All recommendations</button>
          </Panel>
        )}
      </div>
    </div>
  );
}
