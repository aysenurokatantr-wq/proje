import * as Speech from 'expo-speech';

let lastSpoken: string | null = null;

export function speak(text: string, opts?: { rate?: number; lang?: string }) {
  Speech.stop();
  lastSpoken = text;
  Speech.speak(text, {
    language: opts?.lang ?? 'tr-TR',
    rate: opts?.rate ?? 0.95,
    pitch: 1.0,
  });
}

export function stop() {
  Speech.stop();
  lastSpoken = null;
}

export async function isSpeaking() {
  return Speech.isSpeakingAsync();
}

export function toggle(text: string, opts?: { rate?: number; lang?: string }) {
  Speech.isSpeakingAsync().then((speaking) => {
    if (speaking && lastSpoken === text) {
      stop();
    } else {
      speak(text, opts);
    }
  });
}
