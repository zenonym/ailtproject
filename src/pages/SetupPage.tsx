import { ArrowLeft, ArrowRight, Check, Heart, Lightbulb, Swords } from 'lucide-react';
import { useState } from 'react';
import { AVATARS, Avatar, Panel } from '../components/ui';
import { newSave } from '../game/engine';
import type { AvatarId, SaveData } from '../types';

export function SetupPage({ onCreate, onBack }: { onCreate: (s: SaveData) => void; onBack: () => void }) {
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState<AvatarId>('scholar');
  const [step, setStep] = useState<0 | 1>(0);
  const clean = name.trim().slice(0, 16);

  if (step === 1) {
    return (
      <div className="setup narrow">
        <Panel title="How battles work">
          <ol className="tutorial">
            <li><Swords size={22} /><div><strong>Answer to attack.</strong> Each creature asks an English question. A correct answer strikes it. Ordinary creatures fall after three hits; bosses take more and end with a special sentence-building challenge.</div></li>
            <li><Heart size={22} /><div><strong>Mistakes are for learning.</strong> A wrong answer lets the creature strike back — but you always see the correct answer and an explanation. Losing costs nothing; you can retry at once.</div></li>
            <li><Lightbulb size={22} /><div><strong>Hints and Focus.</strong> Many questions have a free hint. Answer correctly in a row to charge <em>Focus</em>, which removes two wrong options.</div></li>
            <li><Check size={22} /><div><strong>Keyboard friendly.</strong> Press <kbd>1</kbd>–<kbd>4</kbd> or <kbd>A</kbd>–<kbd>D</kbd> to answer and <kbd>Enter</kbd> to continue.</div></li>
          </ol>
          <div className="row between">
            <button className="btn btn-ghost" onClick={() => setStep(0)}><ArrowLeft size={18} /> Back</button>
            <button className="btn btn-primary" onClick={() => onCreate(newSave(clean, avatar))}>Enter Verdant Vale <ArrowRight size={18} /></button>
          </div>
        </Panel>
      </div>
    );
  }

  return (
    <div className="setup narrow">
      <Panel title="Create your wordsmith">
        <label className="field">
          <span>Your name</span>
          <input value={name} onChange={(e) => setName(e.target.value)} maxLength={16} placeholder="e.g. Ka Yan" autoFocus
            onKeyDown={(e) => { if (e.key === 'Enter' && clean) { e.preventDefault(); setStep(1); } }} />
        </label>
        <fieldset className="avatar-grid">
          <legend>Choose an avatar</legend>
          {AVATARS.map((a) => (
            <label key={a.id} className={`avatar-card ${avatar === a.id ? 'selected' : ''}`}>
              <input type="radio" name="avatar" value={a.id} checked={avatar === a.id} onChange={() => setAvatar(a.id)} />
              <Avatar id={a.id} size={64} />
              <strong>{a.name}</strong>
              <small>{a.blurb}</small>
            </label>
          ))}
        </fieldset>
        <div className="row between">
          <button className="btn btn-ghost" onClick={onBack}><ArrowLeft size={18} /> Menu</button>
          <button className="btn btn-primary" disabled={!clean} onClick={() => setStep(1)}>Continue <ArrowRight size={18} /></button>
        </div>
      </Panel>
    </div>
  );
}
