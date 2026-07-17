// Sound engine — tổng hợp âm bằng Web Audio API, không dùng file audio.
// Mặc định BẬT với volume nhỏ; người dùng toggle mute, lưu localStorage.

const MUTE_KEY = 'swd392-sound-muted';

let ctx: AudioContext | null = null;
let muted: boolean = (() => {
  try {
    return localStorage.getItem(MUTE_KEY) === 'true';
  } catch {
    return false;
  }
})();

function getCtx(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  const AC = window.AudioContext || (window as any).webkitAudioContext;
  if (!AC) return null;
  if (!ctx) ctx = new AC();
  if (ctx.state === 'suspended') ctx.resume();
  return ctx;
}

export function isMuted(): boolean {
  return muted;
}

export function setMuted(value: boolean): void {
  muted = value;
  try {
    localStorage.setItem(MUTE_KEY, String(value));
  } catch {
    /* ignore */
  }
}

interface ToneOpts {
  freq: number;
  /** thời điểm bắt đầu (giây, tương đối) */
  at?: number;
  duration?: number;
  type?: OscillatorType;
  volume?: number;
  /** glide tần số về đích trong duration */
  glideTo?: number;
}

function tone({ freq, at = 0, duration = 0.12, type = 'sine', volume = 0.08, glideTo }: ToneOpts) {
  const c = getCtx();
  if (!c || muted) return;
  const t0 = c.currentTime + at;
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t0);
  if (glideTo) osc.frequency.exponentialRampToValueAtTime(glideTo, t0 + duration);
  // Envelope: attack nhanh, release mượt — tránh click
  gain.gain.setValueAtTime(0, t0);
  gain.gain.linearRampToValueAtTime(volume, t0 + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.0001, t0 + duration);
  osc.connect(gain).connect(c.destination);
  osc.start(t0);
  osc.stop(t0 + duration + 0.02);
}

/** Pop nhẹ khi chọn đáp án */
export function playSelect(): void {
  tone({ freq: 520, duration: 0.06, type: 'triangle', volume: 0.05 });
}

/** Chime 2 nốt khi trả lời đúng */
export function playCorrect(): void {
  tone({ freq: 660, duration: 0.1, type: 'sine', volume: 0.07 });
  tone({ freq: 880, at: 0.09, duration: 0.16, type: 'sine', volume: 0.08 });
}

/** Thud trầm khi trả lời sai — không gay gắt */
export function playWrong(): void {
  tone({ freq: 220, duration: 0.18, type: 'sine', volume: 0.06, glideTo: 160 });
}

/** Fanfare 3 nốt khi đạt mastery */
export function playFanfare(): void {
  tone({ freq: 523.25, at: 0, duration: 0.14, type: 'triangle', volume: 0.08 }); // C5
  tone({ freq: 659.25, at: 0.13, duration: 0.14, type: 'triangle', volume: 0.08 }); // E5
  tone({ freq: 783.99, at: 0.26, duration: 0.3, type: 'triangle', volume: 0.09 }); // G5
  tone({ freq: 1046.5, at: 0.26, duration: 0.3, type: 'sine', volume: 0.05 }); // C6 harmonic
}
