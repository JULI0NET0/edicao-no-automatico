// Estilo 3 — Perspectiva 3D + recorte de fundo. Tempos LOCAIS (s desde o início do trecho).
// Trecho: 12.76–17.6 do limpo.mp4 do reel-2612 — "fazer um negócio que demorava horas sendo feito em segundos, em alguns minutos".
export const TITLE = "exemplo-recorte-3d";
export const SEG = { start: 12.76, end: 17.6 };
const LEN = 4.84;

export const BEATS = [
  { id: "c-behind", layer: "behind", start: 0, end: LEN },
  { id: "c-front", layer: "front", start: 0, end: LEN },
];
// o recorte (subject.webm) acompanha o trecho inteiro, alinhado ao vídeo base
export const SUBJECT_CLIPS = [{ start: 0, end: LEN }];

// 32 horas · 36 segundos · 38 alguns · 39 minutos
export const EMPHASIS_SRC = [32, 36, 39];

export const CAMERA = [
  // recorte desce e encolhe para o palco (título fica livre em cima) — mesmo molde do reel-2612
  { t: "sub", at: 0.9, dur: 0.01, scale: 1.0, y: 0, ease: "none" },
  { t: "sub", at: 0.96, dur: 0.45, scale: 0.84, y: 285, ease: "sine.out" },
  { t: "sub", at: 1.38, dur: 0.1, scale: 0.96, y: 240, ease: "expo.out" }, // slam "horas"
  { t: "sub", at: 1.5, dur: 1.6, scale: 0.87, y: 278, ease: "sine.inOut" },
  { t: "sub", at: 3.12, dur: 0.1, scale: 0.96, y: 240, ease: "expo.out" }, // slam "segundos"
  { t: "sub", at: 3.24, dur: 1.5, scale: 0.88, y: 275, ease: "sine.inOut" },
];
export const WHIPS = [];
export const SHAKES = [
  { at: 1.38, amp: 0.9 },
  { at: 3.12, amp: 1.1 },
];
// bordas suaves do recorte só dentro do palco (no wipe do xadrez o recorte fica inteiro)
export const MASKS = [
  { at: 0, on: false },
  { at: 0.95, on: true },
];
// a legenda é o próprio título dentro do palco
export const SUPPRESS = [[0.95, 4.9]];
export const MODE_WINDOWS = [{ mode: "low", from: 0, to: 6 }];

export const SFX = [
  ["whoosh", 0.3, 0.3],
  ["sparkle", 0.85, 0.26],
  ["impact-bass-1", 1.38, 0.4],
  ["whoosh-short", 1.45, 0.22],
  ["impact-bass-2", 3.12, 0.4],
  ["pop", 3.15, 0.28],
  ["pop", 4.25, 0.28],
];
