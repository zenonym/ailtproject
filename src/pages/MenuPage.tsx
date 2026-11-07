import { Play, RotateCcw, Settings } from 'lucide-react';
import type { Route } from '../App';
import type { SaveData } from '../types';

export function MenuPage({ hasSave, save, go }: { hasSave: boolean; save: SaveData | null; go: (r: Route) => void }) {
  return (
    <div className="menu">
      <div className="logo-wrap">
        <svg className="logo-sigil" viewBox="0 0 120 120" aria-hidden="true">
          <defs>
            <linearGradient id="lg" x1="0" x2="1" y1="0" y2="1"><stop offset="0" stopColor="#ffe08a" /><stop offset="1" stopColor="#b9781e" /></linearGradient>
          </defs>
          <path d="M60 6 106 32v56L60 114 14 88V32z" fill="none" stroke="url(#lg)" strokeWidth="4" />
          <path d="M60 22 92 40v40L60 98 28 80V40z" fill="none" stroke="url(#lg)" strokeWidth="1.5" opacity=".6" />
          <path d="M44 38v44h32" fill="none" stroke="url(#lg)" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <h1 className="logo">LEXQUEST</h1>
        <p className="tagline">An English adventure where words are your weapons</p>
      </div>

      <p className="intro">
        Mend a world broken by mistakes. Explore three regions, battle creatures by answering English questions,
        uncover the histories of idioms in the Lore Vault, and watch your skills grow.
      </p>

      <div className="menu-buttons">
        {hasSave && save && (
          <button className="btn btn-primary btn-lg" onClick={() => go({ name: 'map' })} autoFocus>
            <Play size={20} /> Continue — {save.player.name}, Lv {save.player.level}
          </button>
        )}
        <button className={`btn ${hasSave ? 'btn-secondary' : 'btn-primary'} btn-lg`} onClick={() => go({ name: 'setup' })} autoFocus={!hasSave}>
          {hasSave ? <RotateCcw size={20} /> : <Play size={20} />} {hasSave ? 'Start a new adventure' : 'Start adventure'}
        </button>
        <button className="btn btn-ghost btn-lg" onClick={() => go({ name: 'settings', back: { name: 'menu' } })}>
          <Settings size={20} /> Settings
        </button>
      </div>
      {hasSave && <p className="note center">Starting a new adventure will replace your saved progress.</p>}
      <p className="foot">Made for Hong Kong secondary learners · progress saved in this browser</p>
    </div>
  );
}
