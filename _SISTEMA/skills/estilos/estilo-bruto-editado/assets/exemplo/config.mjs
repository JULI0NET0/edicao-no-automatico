// Estilo 4 — Bruto → editado + lettering. Tempos LOCAIS (s desde o início do trecho).
// Trecho: 21.7–26.1 do limpo.mp4 do reel-2612 — "uma satisfação pura de simplesmente ver rodando algo tão bem".
export const TITLE = "exemplo-bruto-editado";
export const SEG = { start: 21.7, end: 26.1 };
const LEN = 4.4;

export const BEATS = [{ id: "d-letra", layer: "front", start: 0, end: LEN }];

// 52 satisfação · 53 pura · 57 rodando
export const EMPHASIS_SRC = [52, 53, 57];

const SPLIT_Y = 760;
export const CAMERA = [
  { at: 0.0, dur: 0.36, scale: 1.0, y: SPLIT_Y, ease: "power4.inOut" },
  { at: 1.0, dur: 0.1, scale: 1.05, y: SPLIT_Y, ease: "expo.out" },
  { at: 1.12, dur: 0.6, scale: 1.0, y: SPLIT_Y, ease: "power2.out" },
];
export const WHIPS = [{ at: 0.0, dur: 0.36, blur: 10 }];
export const SHAKES = [{ at: 1.02, amp: 0.8 }];
export const FLASHES = [{ at: 2.76, peak: 0.28, decay: 0.3 }];
// o próprio lettering diz "satisfação pura"
export const SUPPRESS = [[0, 1.5]];
export const MODE_WINDOWS = [{ mode: "seamtop", from: 0, to: 6 }];

export const SFX = [
  ["whoosh", 0.0, 0.32],
  ["pop", 0.22, 0.3],
  ["impact-bass-2", 1.0, 0.4],
  ["whoosh", 1.82, 0.3],
  ["click-soft", 2.4, 0.3],
  ["pop", 2.76, 0.3],
  ["sparkle", 2.9, 0.26],
  ["ping", 3.3, 0.24],
];
