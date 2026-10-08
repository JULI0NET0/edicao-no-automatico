// Estilo 1 — Montagem 3D em camadas. Tempos LOCAIS (s desde o início do trecho).
// Trecho: 0.1–5.85 do limpo.mp4 do reel-2612 — "não tem nada melhor do que ver uma automação rodando e funcionando lisinho".
export const TITLE = "exemplo-3d-camadas";
export const SEG = { start: 0.1, end: 5.85 };

export const BEATS = [{ id: "a-camadas", layer: "front", start: 0, end: 5.75 }];

// 8 automação · 9 rodando · 11 funcionando · 12 lisinho  (índices do words.json de fonte)
export const EMPHASIS_SRC = [8, 9, 12];

const SPLIT_Y = 760;
export const CAMERA = [
  { at: 0.0, dur: 0.36, scale: 1.0, y: SPLIT_Y, ease: "power4.inOut" },
  { at: 2.9, dur: 0.1, scale: 1.045, y: SPLIT_Y, ease: "expo.out" },
  { at: 3.02, dur: 0.6, scale: 1.0, y: SPLIT_Y, ease: "power2.out" },
];
export const WHIPS = [{ at: 0.0, dur: 0.36, blur: 10 }];
export const SHAKES = [{ at: 2.95, amp: 0.8 }];
export const MODE_WINDOWS = [{ mode: "seamtop", from: 0, to: 6 }];

// [arquivo, t, volume]
export const SFX = [
  ["whoosh", 0.0, 0.32],
  ["pop", 0.9, 0.3],
  ["pop", 1.45, 0.3],
  ["pop", 2.0, 0.3],
  ["pop", 2.55, 0.3],
  ["impact-bass-1", 2.93, 0.4],
  ["sparkle", 3.85, 0.28],
  ["whoosh-short", 4.5, 0.25],
  ["ping", 5.15, 0.28],
];
