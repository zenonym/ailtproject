import { ArrowLeft, Trash2, Volume2 } from 'lucide-react';
import { useState } from 'react';
import type { Update } from '../App';
import { ConfirmDialog, Panel } from '../components/ui';
import type { SaveData } from '../types';
import { speakText, speechSupported } from '../utils/speech';

export function SettingsPage({ save, update, onBack, onReset }: { save: SaveData | null; update: Update; onBack: () => void; onReset: () => void }) {
  const [confirming, setConfirming] = useState(false);
  const [rate, setRate] = useState(save?.settings.speechRate ?? 0.9);
  const supported = speechSupported();

  return (
    <div className="page narrow">
      <button className="btn btn-ghost btn-sm" onClick={onBack}><ArrowLeft size={16} /> Back</button>
      <h1 className="page-title">Settings</h1>

      <Panel title="Listening">
        {supported ? (
          <>
            <label className="field">
              <span>Speech speed: {rate.toFixed(2)}×</span>
              <input type="range" min={0.6} max={1.2} step={0.05} value={rate}
                onChange={(e) => { const v = Number(e.target.value); setRate(v); update((s) => ({ ...s, settings: { ...s.settings, speechRate: v } })); }} />
            </label>
            <button className="btn btn-secondary btn-sm" onClick={() => speakText('Welcome to Lexquest. Listen carefully, wordsmith.', rate)}>
              <Volume2 size={16} /> Test voice
            </button>
            {!save && <p className="note">Start an adventure to save your speed preference.</p>}
          </>
        ) : (
          <p className="note">Speech playback is not supported in this browser. Listening activities will show a written transcript instead.</p>
        )}
      </Panel>

      <Panel title="Display">
        <label className="check">
          <input type="checkbox" disabled={!save} checked={!!save?.settings.reducedMotion}
            onChange={(e) => update((s) => ({ ...s, settings: { ...s.settings, reducedMotion: e.target.checked } }))} />
          Reduce animations
        </label>
        {!save && <p className="note">Start an adventure to change display settings.</p>}
      </Panel>

      <Panel title="Saved progress">
        <p>Your progress is saved automatically in this browser (localStorage). It is not uploaded anywhere.</p>
        <button className="btn btn-danger" disabled={!save} onClick={() => setConfirming(true)}>
          <Trash2 size={16} /> Reset all progress
        </button>
      </Panel>

      {confirming && (
        <ConfirmDialog
          title="Reset all progress?"
          body="This permanently deletes your character, levels, statistics, Codex entries and Lore Cards from this browser. This cannot be undone."
          confirm="Yes, reset everything"
          onCancel={() => setConfirming(false)}
          onConfirm={() => { setConfirming(false); onReset(); }}
        />
      )}
    </div>
  );
}
