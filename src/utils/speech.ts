/**
 * High-Fidelity Greek Audio and Pronunciation Synthesizer.
 * 
 * Uses direct Greek Neural Audio Stream (/api/tts) to ensure 100% natural,
 * authentic native Greek sentence and word pronunciation without relying on
 * whether the client's OS/browser has a Greek voice package installed.
 */

let currentAudio: HTMLAudioElement | null = null;
const audioCache: Map<string, string> = new Map();

let cachedVoices: SpeechSynthesisVoice[] = [];
let voicesLoaded = false;

function loadVoices(): void {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  const list = window.speechSynthesis.getVoices();
  if (list && list.length > 0) {
    cachedVoices = list;
    voicesLoaded = true;
  }
}

if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  loadVoices();
  window.speechSynthesis.onvoiceschanged = () => {
    loadVoices();
  };
}

/**
 * Checks if a REAL, verified Greek voice is installed in the client's browser.
 */
export function getVerifiedGreekVoice(): SpeechSynthesisVoice | null {
  if (!voicesLoaded || cachedVoices.length === 0) {
    loadVoices();
  }

  const voice = cachedVoices.find(
    v =>
      v.lang === 'el-GR' ||
      v.lang === 'el_GR' ||
      v.lang.toLowerCase() === 'el' ||
      v.lang.startsWith('el-') ||
      v.lang.startsWith('el_') ||
      v.name.toLowerCase().includes('greek') ||
      v.name.toLowerCase().includes('eleni') ||
      v.name.toLowerCase().includes('nikos') ||
      v.name.toLowerCase().includes('athena') ||
      v.name.toLowerCase().includes('ellinika')
  );

  return voice || null;
}

/**
 * Modern Greek to natural phonetic Latin transliteration.
 */
export function convertGreekToPhonetic(greekText: string): string {
  if (!greekText) return '';

  let text = greekText
    .replace(/[;;]/g, '?')
    .replace(/[··]/g, ';')
    .replace(/["'“”«»]/g, '')
    .trim();

  // Diphthongs with Voiceless / Voiced Consonant Rules:
  const voicelessConsonants = '[θκξπστφχψςθΚΞΠΣΤΦΧΨ\\s.,!?$:;]|$';

  text = text.replace(
    new RegExp(`([αΑ][υύΥΎ])(?=${voicelessConsonants})`, 'g'),
    m => (m[0] === m[0].toUpperCase() ? 'Af' : 'af')
  );
  text = text.replace(
    new RegExp(`([εΕ][υύΥΎ])(?=${voicelessConsonants})`, 'g'),
    m => (m[0] === m[0].toUpperCase() ? 'Ef' : 'ef')
  );
  text = text.replace(
    new RegExp(`([ηΗ][υύΥΎ])(?=${voicelessConsonants})`, 'g'),
    m => (m[0] === m[0].toUpperCase() ? 'If' : 'if')
  );

  text = text.replace(/[αΑ][υύΥΎ]/g, m => (m[0] === m[0].toUpperCase() ? 'Av' : 'av'));
  text = text.replace(/[εΕ][υύΥΎ]/g, m => (m[0] === m[0].toUpperCase() ? 'Ev' : 'ev'));
  text = text.replace(/[ηΗ][υύΥΎ]/g, m => (m[0] === m[0].toUpperCase() ? 'Iv' : 'iv'));

  // Vowel Digraphs
  text = text.replace(/[οΟ][υύΥΎ]/g, m => (m[0] === m[0].toUpperCase() ? 'Oo' : 'oo'));
  text = text.replace(/[αΑ][ιίΙΊ]/g, m => (m[0] === m[0].toUpperCase() ? 'E' : 'e'));
  text = text.replace(/[εΕ][ιίΙΊ]/g, m => (m[0] === m[0].toUpperCase() ? 'Ee' : 'ee'));
  text = text.replace(/[οΟ][ιίΙΊ]/g, m => (m[0] === m[0].toUpperCase() ? 'Ee' : 'ee'));
  text = text.replace(/[υΥ][ιίΙΊ]/g, m => (m[0] === m[0].toUpperCase() ? 'Ee' : 'ee'));

  // Consonant Digraphs
  text = text.replace(/\b[μΜ][πΠ]/g, m => (m[0] === m[0].toUpperCase() ? 'B' : 'b'));
  text = text.replace(/[μΜ][πΠ]/g, m => (m[0] === m[0].toUpperCase() ? 'Mb' : 'mb'));

  text = text.replace(/\b[νΝ][τΤ]/g, m => (m[0] === m[0].toUpperCase() ? 'D' : 'd'));
  text = text.replace(/[νΝ][τΤ]/g, m => (m[0] === m[0].toUpperCase() ? 'Nd' : 'nd'));

  text = text.replace(/\b[γΓ][κΚ]/g, m => (m[0] === m[0].toUpperCase() ? 'G' : 'g'));
  text = text.replace(/[γΓ][κΚ]/g, m => (m[0] === m[0].toUpperCase() ? 'Ng' : 'ng'));
  text = text.replace(/[γΓ][γΓ]/g, m => (m[0] === m[0].toUpperCase() ? 'Ng' : 'ng'));

  text = text.replace(/[τΤ][σΣς]/g, m => (m[0] === m[0].toUpperCase() ? 'Ts' : 'ts'));
  text = text.replace(/[τΤ][ζΖ]/g, m => (m[0] === m[0].toUpperCase() ? 'Dz' : 'dz'));

  const frontVowels = '[εειηιουΕΕΙΗΙΟΥEe]';
  text = text.replace(
    new RegExp(`[γΓ](?=${frontVowels})`, 'g'),
    m => (m === m.toUpperCase() ? 'Y' : 'y')
  );
  text = text.replace(/[γΓ]/g, m => (m === m.toUpperCase() ? 'Gh' : 'gh'));

  text = text.replace(
    new RegExp(`[χΧ](?=${frontVowels})`, 'g'),
    m => (m === m.toUpperCase() ? 'H' : 'h')
  );
  text = text.replace(/[χΧ]/g, m => (m === m.toUpperCase() ? 'Kh' : 'kh'));

  const letterMap: Record<string, string> = {
    'α': 'a', 'ά': 'a', 'Α': 'A', 'Ά': 'A',
    'ε': 'e', 'έ': 'e', 'Ε': 'E', 'Έ': 'E',
    'η': 'ee', 'ή': 'ee', 'Η': 'Ee', 'Ή': 'Ee',
    'ι': 'ee', 'ί': 'ee', 'ϊ': 'ee', 'ΐ': 'ee', 'Ι': 'Ee', 'Ί': 'Ee', 'Ϊ': 'Ee',
    'ο': 'o', 'ό': 'o', 'Ο': 'O', 'Ό': 'O',
    'υ': 'ee', 'ύ': 'ee', 'ϋ': 'ee', 'ΰ': 'ee', 'Υ': 'Ee', 'Ύ': 'Ee', 'Ϋ': 'Ee',
    'ω': 'o', 'ώ': 'o', 'Ω': 'O', 'Ώ': 'O',

    'β': 'v', 'Β': 'V',
    'δ': 'th', 'Δ': 'Th',
    'ζ': 'z', 'Ζ': 'Z',
    'θ': 'th', 'Θ': 'Th',
    'κ': 'k', 'Κ': 'K',
    'λ': 'l', 'Λ': 'L',
    'μ': 'm', 'Μ': 'M',
    'ν': 'n', 'Ν': 'N',
    'ξ': 'x', 'Ξ': 'X',
    'π': 'p', 'Π': 'P',
    'ρ': 'r', 'Ρ': 'R',
    'σ': 's', 'ς': 's', 'Σ': 'S',
    'τ': 't', 'Τ': 'T',
    'φ': 'f', 'Φ': 'F',
    'ψ': 'ps', 'Ψ': 'Ps'
  };

  let result = '';
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (letterMap[char] !== undefined) {
      result += letterMap[char];
    } else {
      result += char;
    }
  }

  return result
    .replace(/eeee/g, 'ee')
    .replace(/eee/g, 'ee')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Fallback synthesizer using Web Speech API with verified voice or phonetic transliteration.
 */
function speakWebSpeechFallback(cleanGreek: string, transliteration?: string, rate: number = 0.9): void {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

  try {
    window.speechSynthesis.cancel();
    const verifiedGreekVoice = getVerifiedGreekVoice();

    let utterance: SpeechSynthesisUtterance;

    if (verifiedGreekVoice) {
      // Browser DOES have a genuine Greek voice installed
      utterance = new SpeechSynthesisUtterance(cleanGreek);
      utterance.voice = verifiedGreekVoice;
      utterance.lang = verifiedGreekVoice.lang || 'el-GR';
    } else {
      // Browser DOES NOT have a Greek voice.
      // NEVER send raw Greek characters to an English voice, or it spells them out!
      // Send Latin phonetic transliteration so it reads the words naturally:
      const phoneticText = (transliteration && transliteration.trim().length > 0)
        ? transliteration.replace(/["'“”]/g, '').trim()
        : convertGreekToPhonetic(cleanGreek);

      utterance = new SpeechSynthesisUtterance(phoneticText);
      utterance.lang = 'en-US';
    }

    utterance.rate = rate;
    utterance.pitch = 1.0;

    (window as unknown as { _currentUtterance?: SpeechSynthesisUtterance })._currentUtterance = utterance;
    utterance.onend = () => {
      delete (window as unknown as { _currentUtterance?: SpeechSynthesisUtterance })._currentUtterance;
    };

    window.speechSynthesis.speak(utterance);
  } catch (err) {
    console.debug('WebSpeech fallback error:', err);
  }
}

/**
 * Main Greek Speech Pronunciation Function.
 *
 * 1. Immediately streams authentic, native Greek audio from /api/tts?text=...
 * 2. Stops any ongoing audio so multiple button clicks feel snappy.
 * 3. Gracefully falls back if offline.
 */
export function speakGreek(
  text: string,
  transliteration?: string,
  rate: number = 0.9
): void {
  if (typeof window === 'undefined') return;

  const cleanGreek = text.replace(/["'“”«»]/g, '').trim();
  if (!cleanGreek) return;

  // 1. Stop any ongoing audio playback & Web Speech synthesis
  if (currentAudio) {
    try {
      currentAudio.pause();
      currentAudio.currentTime = 0;
    } catch {
      // ignore
    }
    currentAudio = null;
  }

  if ('speechSynthesis' in window) {
    try {
      window.speechSynthesis.cancel();
    } catch {
      // ignore
    }
  }

  // 2. Play native Greek audio stream from /api/tts
  const audioUrl = `/api/tts?text=${encodeURIComponent(cleanGreek)}`;

  try {
    const audio = new Audio(audioUrl);
    currentAudio = audio;
    audio.playbackRate = 1.0;

    const playPromise = audio.play();

    if (playPromise !== undefined) {
      playPromise.catch((err) => {
        console.debug('Audio stream playback failed, using WebSpeech fallback:', err);
        // Fallback to Web Speech API if fetch/playback was blocked or offline
        speakWebSpeechFallback(cleanGreek, transliteration, rate);
      });
    }
  } catch (err) {
    console.debug('Native audio instantiation failed:', err);
    speakWebSpeechFallback(cleanGreek, transliteration, rate);
  }
}

// Gentle pleasant audio effects using Web Audio API
export function playSound(type: 'click' | 'correct' | 'reveal' | 'success'): void {
  try {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;

    const ctx = new AudioContextClass();
    const now = ctx.currentTime;

    if (type === 'click') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.05);
      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.05);
    } else if (type === 'correct') {
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();
      osc1.type = 'triangle';
      osc2.type = 'sine';
      osc1.frequency.setValueAtTime(523.25, now);
      osc1.frequency.setValueAtTime(659.25, now + 0.08);
      osc2.frequency.setValueAtTime(783.99, now + 0.08);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);
      osc1.start(now);
      osc2.start(now + 0.08);
      osc1.stop(now + 0.35);
      osc2.stop(now + 0.35);
    } else if (type === 'reveal') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(640, now + 0.12);
      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.18);
    } else if (type === 'success') {
      const notes = [523.25, 659.25, 783.99, 1046.50];
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);
        gain.gain.setValueAtTime(0.06, now + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.25);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.25);
      });
    }
  } catch (e) {
    console.debug('Web Audio API not allowed without user interaction:', e);
  }
}
