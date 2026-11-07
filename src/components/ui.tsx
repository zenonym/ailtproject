import { BookOpen, Compass, Eye, EyeOff, Pause, Shield, Sparkles, Volume2 } from 'lucide-react';
import { useEffect, useState, type ReactNode } from 'react';
import type { AvatarId } from '../types';
import { speakLines, speechSupported, stopSpeech } from '../utils/speech';

export const AVATARS: { id: AvatarId; name: string; blurb: string; color: string; Icon: typeof BookOpen }[] = [
  { id: 'scholar', name: 'Scholar', blurb: 'Reads every footnote.', color: '#e8b84a', Icon: BookOpen },
  { id: 'ranger', name: 'Ranger', blurb: 'Tracks words to their roots.', color: '#5fd08a', Icon: Compass },
  { id: 'mage', name: 'Mage', blurb: 'Bends meaning with a spell.', color: '#a98bff', Icon: Sparkles },
  { id: 'knight', name: 'Knight', blurb: 'Defends grammar with honour.', color: '#ff8a4c', Icon: Shield },
];

export function Avatar({ id, size = 56 }: { id: AvatarId; size?: number }) {
  const a = AVATARS.find((x) => x.id === id) ?? AVATARS[0];
  return (
    <span className="avatar" style={{ width: size, height: size, ['--c' as string]: a.color }} aria-hidden="true">
      <a.Icon size={size * 0.5} />
    </span>
  );
}

export function Bar({ value, max, kind, label }: { value: number; max: number; kind: 'hp' | 'exp' | 'enemy' | 'energy'; label?: string }) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  return (
    <div className={`bar bar-${kind}`} role="meter" aria-valuemin={0} aria-valuemax={max} aria-valuenow={value} aria-label={label ?? kind}>
      <div className="bar-fill" style={{ width: `${pct}%` }} />
      {label && <span className="bar-text">{label}</span>}
    </div>
  );
}

export function Panel({ children, className = '', title }: { children: ReactNode; className?: string; title?: ReactNode }) {
  return (
    <section className={`panel ${className}`}>
      {title && <h2 className="panel-title">{title}</h2>}
      {children}
    </section>
  );
}

/** Play/replay a dialogue with a transcript toggle; transcript is forced open without speech support. */
export function ListenPanel({ lines, rate }: { lines: { speaker: string; line: string }[]; rate: number }) {
  const supported = speechSupported();
  const [playing, setPlaying] = useState(false);
  const [plays, setPlays] = useState(0);
  const [showText, setShowText] = useState(!supported);

  useEffect(() => () => stopSpeech(), []);

  const play = () => {
    if (playing) {
      stopSpeech();
      setPlaying(false);
      return;
    }
    setPlaying(true);
    setPlays((p) => p + 1);
    speakLines(lines, rate, () => setPlaying(false));
  };

  return (
    <div className="listen">
      {supported ? (
        <div className="listen-controls">
          <button className="btn btn-listen" onClick={play} aria-label={playing ? 'Stop audio' : plays ? 'Replay audio' : 'Play audio'}>
            {playing ? <Pause size={20} /> : <Volume2 size={20} />}
            {playing ? 'Stop' : plays ? 'Replay' : 'Play recording'}
          </button>
          <button className="btn btn-ghost" onClick={() => setShowText((s) => !s)}>
            {showText ? <EyeOff size={18} /> : <Eye size={18} />} {showText ? 'Hide' : 'Show'} transcript
          </button>
          {playing && <span className="wave" aria-hidden="true"><i /><i /><i /><i /><i /></span>}
        </div>
      ) : (
        <p className="note">Your browser does not support speech playback, so the transcript is shown instead.</p>
      )}
      {showText && (
        <div className="transcript">
          {lines.map((l, i) => (
            <p key={i}><strong>{l.speaker}:</strong> {l.line}</p>
          ))}
        </div>
      )}
    </div>
  );
}

/** Small "hear it" button used for speaking practice (model pronunciation). */
export function SpeakButton({ text, rate, label = 'Hear it' }: { text: string; rate: number; label?: string }) {
  if (!speechSupported()) return null;
  return (
    <button className="btn btn-ghost btn-sm" onClick={() => speakLines([{ speaker: 'A', line: text }], rate)} aria-label={`${label}: ${text}`}>
      <Volume2 size={16} /> {label}
    </button>
  );
}

export function ConfirmDialog({ title, body, confirm, onConfirm, onCancel }: { title: string; body: string; confirm: string; onConfirm: () => void; onCancel: () => void }) {
  useEffect(() => {
    const k = (e: KeyboardEvent) => e.key === 'Escape' && onCancel();
    window.addEventListener('keydown', k);
    return () => window.removeEventListener('keydown', k);
  }, [onCancel]);
  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="dlg-title">
      <div className="modal panel">
        <h2 id="dlg-title">{title}</h2>
        <p>{body}</p>
        <div className="row end">
          <button className="btn btn-ghost" onClick={onCancel} autoFocus>Cancel</button>
          <button className="btn btn-danger" onClick={onConfirm}>{confirm}</button>
        </div>
      </div>
    </div>
  );
}
