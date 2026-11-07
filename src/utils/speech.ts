export const speechSupported = () =>
  typeof window !== 'undefined' && 'speechSynthesis' in window && typeof SpeechSynthesisUtterance !== 'undefined';

/** Ranks English voices so natural-sounding British/American voices come first. */
function rankVoice(v: SpeechSynthesisVoice) {
  const lang = v.lang.toLowerCase().replace('_', '-');
  const name = v.name.toLowerCase();
  let score = 0;
  if (lang === 'en-gb') score += 30;
  else if (lang === 'en-us') score += 25;
  else if (lang.startsWith('en')) score += 15;
  if (/natural|online|neural|premium|enhanced/.test(name)) score += 20;
  if (name.includes('google')) score += 10;
  return score;
}

function englishVoices() {
  return window.speechSynthesis
    .getVoices()
    .filter((v) => v.lang.toLowerCase().startsWith('en'))
    .sort((a, b) => rankVoice(b) - rankVoice(a));
}

/** Voices load asynchronously in some browsers (e.g. Chrome); wait briefly for them. */
function whenVoicesReady(cb: () => void) {
  const synth = window.speechSynthesis;
  if (synth.getVoices().length) return cb();
  let done = false;
  const run = () => {
    if (done) return;
    done = true;
    synth.removeEventListener('voiceschanged', run);
    cb();
  };
  synth.addEventListener('voiceschanged', run);
  setTimeout(run, 1000);
}

/**
 * Speaks lines in order with an English voice. Different speakers get a different
 * English voice (or pitch) so dialogues are easier to follow. Returns false if unsupported.
 */
export function speakLines(lines: { speaker: string; line: string }[], rate = 0.9, onEnd?: () => void): boolean {
  if (!speechSupported()) return false;
  const synth = window.speechSynthesis;
  synth.cancel();
  whenVoicesReady(() => {
    const voices = englishVoices();
    const speakers = [...new Set(lines.map((l) => l.speaker))];
    lines.forEach((l, i) => {
      const u = new SpeechSynthesisUtterance(l.line);
      const s = speakers.indexOf(l.speaker);
      const voice = voices.length ? voices[Math.min(s, voices.length - 1)] : undefined;
      if (voice) u.voice = voice;
      u.lang = voice?.lang ?? 'en-GB';
      u.rate = rate;
      // If both speakers share one voice, vary pitch so they still sound different.
      u.pitch = voices.length > s ? 1 : s % 2 === 0 ? 1 : 0.8;
      if (i === lines.length - 1 && onEnd) {
        u.onend = onEnd;
        u.onerror = onEnd;
      }
      synth.speak(u);
    });
  });
  return true;
}

export const speakText = (text: string, rate = 0.9, onEnd?: () => void) => speakLines([{ speaker: 'A', line: text }], rate, onEnd);

export function stopSpeech() {
  if (speechSupported()) window.speechSynthesis.cancel();
}
