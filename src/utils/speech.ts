export const speechSupported = () =>
  typeof window !== 'undefined' && 'speechSynthesis' in window && typeof SpeechSynthesisUtterance !== 'undefined';

function englishVoices() {
  return window.speechSynthesis.getVoices().filter((v) => v.lang.toLowerCase().startsWith('en'));
}

/**
 * Speaks lines in order. Different speakers get slightly different pitch/voice so
 * dialogues are easier to follow. Returns false if speech is unsupported.
 */
export function speakLines(lines: { speaker: string; line: string }[], rate = 0.9, onEnd?: () => void): boolean {
  if (!speechSupported()) return false;
  const synth = window.speechSynthesis;
  synth.cancel();
  const voices = englishVoices();
  const speakers = [...new Set(lines.map((l) => l.speaker))];
  lines.forEach((l, i) => {
    const u = new SpeechSynthesisUtterance(l.line);
    const s = speakers.indexOf(l.speaker);
    u.lang = 'en-GB';
    u.rate = rate;
    u.pitch = s % 2 === 0 ? 1 : 0.8;
    if (voices.length) u.voice = voices[s % voices.length];
    if (i === lines.length - 1 && onEnd) {
      u.onend = onEnd;
      u.onerror = onEnd;
    }
    synth.speak(u);
  });
  return true;
}

export const speakText = (text: string, rate = 0.9, onEnd?: () => void) => speakLines([{ speaker: 'A', line: text }], rate, onEnd);

export function stopSpeech() {
  if (speechSupported()) window.speechSynthesis.cancel();
}
