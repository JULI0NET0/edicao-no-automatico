// Estilo 2 — Motion explicativo + ícones animados. Tempos LOCAIS (s desde o início do trecho).
// Trecho: 5.97–12.78 do limpo.mp4 do reel-2612 — "pegar um processo chato de preencher contrato, formulário, mandar e-mail, disparo de whatsapp".
export const TITLE = "exemplo-motion-cards";
export const SEG = { start: 5.97, end: 12.72 };

export const BEATS = [{ id: "b-cards", layer: "front", start: 0, end: 6.75 }];

// 16 chato · 19 contrato · 20 formulário · 22 e-mail · 25 whatsapp
export const EMPHASIS_SRC = [16, 19, 20, 22, 25];

const SPLIT_Y = 760;
export const CAMERA = [{ at: 0.0, dur: 0.36, scale: 1.0, y: SPLIT_Y, ease: "power4.inOut" }];
export const WHIPS = [{ at: 0.0, dur: 0.36, blur: 10 }];
export const SHAKES = [];
export const MODE_WINDOWS = [{ mode: "seamtop", from: 0, to: 7 }];

export const SFX = [
  ["whoosh", 0.0, 0.32],
  ["pop", 0.55, 0.26],
  ["glitch-3", 1.0, 0.22],
  ["click-soft", 2.85, 0.3],
  ["click-soft", 3.57, 0.3],
  ["click-soft", 4.75, 0.3],
  ["click-soft", 5.88, 0.3],
  ["sparkle", 6.3, 0.26],
];
