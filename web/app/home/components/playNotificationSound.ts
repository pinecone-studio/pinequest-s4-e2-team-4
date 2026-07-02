type AudioWindow = Window &
  typeof globalThis & {
    webkitAudioContext?: typeof AudioContext;
  };

export function playNotificationSound() {
  try {
    const AudioContextClass =
      window.AudioContext || (window as AudioWindow).webkitAudioContext;
    if (!AudioContextClass) return;

    const ctx = new AudioContextClass();
    const gain = ctx.createGain();
    const firstTone = ctx.createOscillator();
    const secondTone = ctx.createOscillator();

    firstTone.type = "sine";
    secondTone.type = "sine";
    firstTone.frequency.setValueAtTime(880, ctx.currentTime);
    secondTone.frequency.setValueAtTime(1174, ctx.currentTime + 0.12);
    gain.gain.setValueAtTime(0.0001, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.22, ctx.currentTime + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.55);

    firstTone.connect(gain);
    secondTone.connect(gain);
    gain.connect(ctx.destination);
    firstTone.start(ctx.currentTime);
    firstTone.stop(ctx.currentTime + 0.18);
    secondTone.start(ctx.currentTime + 0.12);
    secondTone.stop(ctx.currentTime + 0.55);
  } catch {}
}
