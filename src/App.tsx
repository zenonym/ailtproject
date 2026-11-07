import { BarChart3, BookMarked, Coins, FlaskConical, Library, Map as MapIcon, Settings as SettingsIcon } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { Avatar, Bar } from './components/ui';
import { expToNext, isLoreVaultUnlocked } from './game/engine';
import { BattlePage } from './pages/BattlePage';
import { CodexPage } from './pages/CodexPage';
import { MenuPage } from './pages/MenuPage';
import { RegionPage } from './pages/RegionPage';
import { SettingsPage } from './pages/SettingsPage';
import { SetupPage } from './pages/SetupPage';
import { StatsPage } from './pages/StatsPage';
import { VaultPage } from './pages/VaultPage';
import { WorldMapPage } from './pages/WorldMapPage';
import type { RegionId, SaveData } from './types';
import { loadSave, writeSave } from './utils/storage';

export type Route =
  | { name: 'menu' }
  | { name: 'setup' }
  | { name: 'map' }
  | { name: 'region'; region: RegionId }
  | { name: 'battle'; monsterId: string; from: RegionId; nonce: number }
  | { name: 'codex' }
  | { name: 'stats' }
  | { name: 'vault' }
  | { name: 'settings'; back: Route };

export type Update = (fn: (s: SaveData) => SaveData) => void;

export default function App() {
  const [save, setSave] = useState<SaveData | null>(() => loadSave());
  const [route, setRoute] = useState<Route>({ name: 'menu' });

  useEffect(() => { writeSave(save); }, [save]);
  useEffect(() => {
    document.documentElement.dataset.motion = save?.settings.reducedMotion ? 'reduced' : 'full';
  }, [save?.settings.reducedMotion]);
  useEffect(() => { window.scrollTo(0, 0); }, [route]);

  const update: Update = useCallback((fn) => setSave((s) => (s ? fn(s) : s)), []);
  const go = setRoute;

  const showHud = save && !['menu', 'setup', 'battle'].includes(route.name);

  let page: JSX.Element;
  switch (route.name) {
    case 'menu':
      page = <MenuPage hasSave={!!save} save={save} go={go} />;
      break;
    case 'setup':
      page = <SetupPage onCreate={(s) => { setSave(s); go({ name: 'region', region: 'vale' }); }} onBack={() => go({ name: 'menu' })} />;
      break;
    case 'settings':
      page = <SettingsPage save={save} update={update} onBack={() => go(route.back)} onReset={() => { setSave(null); go({ name: 'menu' }); }} />;
      break;
    default:
      if (!save) {
        page = <MenuPage hasSave={false} save={null} go={go} />;
        break;
      }
      if (route.name === 'map') page = <WorldMapPage save={save} go={go} />;
      else if (route.name === 'region') page = <RegionPage save={save} update={update} region={route.region} go={go} />;
      else if (route.name === 'battle') page = <BattlePage key={route.nonce} save={save} update={update} monsterId={route.monsterId} from={route.from} go={go} />;
      else if (route.name === 'codex') page = <CodexPage save={save} />;
      else if (route.name === 'stats') page = <StatsPage save={save} go={go} />;
      else page = <VaultPage save={save} update={update} go={go} />;
  }

  return (
    <div className="app">
      <div className="bg-stars" aria-hidden="true" />
      {showHud && save && <Hud save={save} route={route} go={go} />}
      <main key={route.name + ('region' in route ? route.region : '')} className="screen">
        {page}
      </main>
    </div>
  );
}

function Hud({ save, route, go }: { save: SaveData; route: Route; go: (r: Route) => void }) {
  const p = save.player;
  const vault = isLoreVaultUnlocked(save);
  const nav: { r: Route; label: string; Icon: typeof MapIcon; show: boolean }[] = [
    { r: { name: 'map' }, label: 'World Map', Icon: MapIcon, show: true },
    { r: { name: 'codex' }, label: 'Codex', Icon: BookMarked, show: true },
    { r: { name: 'stats' }, label: 'Stats', Icon: BarChart3, show: true },
    { r: { name: 'vault' }, label: 'Lore Vault', Icon: Library, show: vault },
    { r: { name: 'settings', back: route }, label: 'Settings', Icon: SettingsIcon, show: true },
  ];
  return (
    <header className="hud">
      <button className="hud-player" onClick={() => go({ name: 'stats' })} aria-label="Open player statistics">
        <Avatar id={p.avatar} size={44} />
        <div className="hud-info">
          <div className="hud-name">{p.name} <span className="lv">Lv {p.level}</span></div>
          <Bar kind="exp" value={p.exp} max={expToNext(p.level)} label={`EXP ${p.exp}/${expToNext(p.level)}`} />
        </div>
      </button>
      <div className="hud-res">
        <span title="Coins"><Coins size={16} /> {p.coins}</span>
        <span title="Herbal Tonics"><FlaskConical size={16} /> {save.inventory.tonic}</span>
      </div>
      <nav className="hud-nav" aria-label="Main">
        {nav.filter((n) => n.show).map((n) => (
          <button key={n.label} className={`nav-btn ${route.name === n.r.name ? 'active' : ''}`} onClick={() => go(n.r)} aria-current={route.name === n.r.name ? 'page' : undefined}>
            <n.Icon size={18} /> <span>{n.label}</span>
          </button>
        ))}
      </nav>
    </header>
  );
}
