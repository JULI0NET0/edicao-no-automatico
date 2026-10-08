import { readFileSync, writeFileSync } from "node:fs";

// ---------------------------------------------------------------------------
// Timing source of truth: .work/words.json (seconds in assets/limpo.mp4).
// ---------------------------------------------------------------------------
const words = JSON.parse(readFileSync(".work/words.json", "utf8"));
const rawGroups = JSON.parse(readFileSync(".work/groups.json", "utf8"));

const VIDEO_DURATION = 49.2;
const ROOT_DURATION = 50.7;

// Brand names + thesis words get the yellow emphasis.
const EMPHASIS = [0, 4, 18, 21, 22, 25, 42, 45, 115, 130, 136, 141, 142, 144];

// ---------------------------------------------------------------------------
// Beats. layer "behind" sits under the subject cutout; "front" above it.
// ---------------------------------------------------------------------------
const BEATS = [
  { id: "a-behind", layer: "behind", start: 0.0, end: 2.9 },
  { id: "a-front", layer: "front", start: 0.0, end: 2.9 },
  { id: "b-ultimos", layer: "front", start: 2.62, end: 5.3 },
  { id: "c-lista1", layer: "front", start: 5.0, end: 12.75 },
  { id: "d-behind", layer: "behind", start: 15.25, end: 17.35 },
  { id: "e-lider", layer: "front", start: 17.05, end: 22.85 },
  { id: "f-grade", layer: "front", start: 22.62, end: 29.95 },
  { id: "g-virada", layer: "front", start: 29.6, end: 35.85 },
  { id: "h-outras", layer: "front", start: 35.6, end: 42.95 },
  { id: "i-behind", layer: "behind", start: 43.3, end: 48.95 },
  { id: "j-endcard", layer: "front", start: 48.85, end: ROOT_DURATION },
];

// Subject cutout plays only where text sits behind the subject.
const SUBJECT_CLIPS = [
  { start: 0.0, end: 2.6 },
  { start: 15.25, end: 17.3 },
  { start: 43.3, end: 48.95 },
];

// ---------------------------------------------------------------------------
// Camera: yt-camera-move keyframes on #cam + #cam-sub (global time).
// Split screen = footage lifted (y) so the face sits in the top panel.
// ---------------------------------------------------------------------------
const SPLIT_Y = -170;
const CAMERA = [
  // A · poster stage: cutout scaled down under a giant "APPLE"
  { t: "sub", at: 0.24, dur: 0.01, scale: 0.8, y: 300, ease: "none" },
  { t: "sub", at: 0.3, dur: 1.3, scale: 0.84, y: 285, ease: "sine.inOut" },
  { t: "sub", at: 1.66, dur: 0.1, scale: 0.96, y: 240, ease: "expo.out" }, // slam "produto"
  { t: "cam", at: 2.6, dur: 0.01, scale: 1.14, ease: "none" }, // cut back to footage, punched
  { t: "cam", at: 2.64, dur: 0.7, scale: 1.0, ease: "power3.out" },
  { t: "sub", at: 2.95, dur: 0.01, scale: 1, y: 0, ease: "none" },
  { at: 4.42, dur: 0.22, scale: 1.1, ease: "power3.out" }, // "últimos"
  { at: 5.08, dur: 0.36, scale: 1.0, y: SPLIT_Y, ease: "power4.inOut" }, // whip into split
  { at: 12.32, dur: 0.36, scale: 1.08, y: 0, ease: "power4.inOut" }, // exit split
  { at: 13.4, dur: 1.8, scale: 1.14, ease: "sine.inOut" }, // lean in: "muito bons em gerar"
  // D · poster stage: "DESEJO" → "DEMANDA"
  { t: "sub", at: 15.28, dur: 0.01, scale: 0.8, y: 300, ease: "none" },
  { t: "sub", at: 15.3, dur: 0.8, scale: 0.84, y: 285, ease: "sine.out" },
  { t: "sub", at: 16.15, dur: 0.1, scale: 0.96, y: 240, ease: "expo.out" }, // slam "demanda"
  { at: 17.12, dur: 0.01, scale: 1.0, y: SPLIT_Y, ease: "none" }, // under the stage: park in split
  { t: "sub", at: 17.5, dur: 0.01, scale: 1, y: 0, ease: "none" },
  { at: 22.62, dur: 0.45, scale: 1.04, y: 0, ease: "power3.inOut" }, // F full frame
  { at: 23.1, dur: 6.4, scale: 1.1, y: 0, ease: "none" }, // slow push under the grid
  { at: 29.74, dur: 0.12, scale: 1.18, ease: "expo.out" }, // flash cut (virada)
  { at: 30.4, dur: 0.9, scale: 1.1 },
  { at: 31.3, dur: 4.3, scale: 1.02, ease: "sine.inOut" },
  { at: 35.72, dur: 0.4, scale: 1.0, y: SPLIT_Y, ease: "power4.inOut" }, // into split (H)
  { at: 42.72, dur: 0.45, scale: 1.06, y: 0, ease: "power4.inOut" }, // exit split
  // I · poster stage payoff: slow push, final hit
  { t: "sub", at: 43.32, dur: 0.01, scale: 0.8, y: 300, ease: "none" },
  { t: "sub", at: 43.6, dur: 5.0, scale: 0.9, y: 270, ease: "sine.inOut" },
  { t: "sub", at: 48.7, dur: 0.12, scale: 0.98, y: 240, ease: "expo.out" },
];
const WHIPS = [
  { at: 5.06, dur: 0.36, blur: 10 },
  { at: 12.3, dur: 0.34, blur: 8 },
  { at: 35.7, dur: 0.38, blur: 10 },
];
const SHAKES = [
  { at: 1.68, amp: 1 },
  { at: 16.18, amp: 1.1 },
  { at: 29.78, amp: 0.8 },
  { at: 48.72, amp: 1 },
];
const DIMS = [
  { at: 22.7, dur: 0.5, to: 0.55 }, // F grid over dimmed footage
  { at: 29.5, dur: 0.25, to: 0 },
  { at: 31.4, dur: 0.5, to: 0.35 }, // G graph card
  { at: 35.4, dur: 0.3, to: 0 },
];

// ---------------------------------------------------------------------------
// Captions: modes + suppression where big type already says the line.
// ---------------------------------------------------------------------------
const SUPPRESS = [
  [0, 2.7], // A: "APPLE / NÃO SABE CRIAR PRODUTO" is the title
  [2.62, 5.25], // B: kinetic-type-swap carries "sempre os últimos"
  [29.7, 31.36], // G: flash + GRANDE DIFERENÇA slams
  [43.85, 45.33], // I: "CRIAR PRODUTO" behind subject
  [46.0, 48.02], // I: "MERCADO + DESEJO" behind subject
];
const MODE_WINDOWS = [
  { mode: "seam", from: 5.2, to: 12.4 },
  { mode: "seam", from: 17.2, to: 22.7 },
  { mode: "top", from: 22.7, to: 29.78 },
  { mode: "top", from: 31.3, to: 35.8 },
  { mode: "seam", from: 35.8, to: 42.8 },
];
const inWin = (t, a, b) => t >= a - 0.001 && t < b;
const groups = rawGroups
  .filter((g) => !SUPPRESS.some(([a, b]) => inWin(g.start, a, b)))
  .map((g) => {
    const w = MODE_WINDOWS.find((m) => inWin(g.start, m.from, m.to));
    return { ...g, mode: w ? w.mode : "low" };
  });

// ---------------------------------------------------------------------------
// SFX (bundled media-use library, copied to assets/sfx/).
// ---------------------------------------------------------------------------
const SFX = [
  ["whoosh-short", 0.22, 0.3],
  ["impact-bass-1", 1.6, 0.4],
  ["pop", 4.45, 0.3],
  ["whoosh", 5.02, 0.35],
  ["click-soft", 6.4, 0.3],
  ["click-soft", 7.05, 0.3],
  ["click-soft", 8.68, 0.3],
  ["click-soft", 9.16, 0.3],
  ["click-soft", 10.86, 0.3],
  ["glitch-3", 12.26, 0.22],
  ["whoosh-short", 15.3, 0.3],
  ["impact-bass-1", 16.05, 0.4],
  ["whoosh", 17.06, 0.32],
  ["ping", 20.45, 0.3],
  ["whoosh-short", 22.6, 0.3],
  ["pop", 23.22, 0.28],
  ["pop", 24.38, 0.28],
  ["pop", 25.47, 0.28],
  ["pop", 26.49, 0.28],
  ["sparkle", 28.45, 0.3],
  ["whoosh", 29.62, 0.32],
  ["click", 29.76, 0.35],
  ["ping", 34.3, 0.26],
  ["whoosh", 35.66, 0.32],
  ["error", 39.9, 0.22],
  ["whoosh-short", 41.05, 0.3],
  ["pop", 41.3, 0.26],
  ["whoosh-short", 43.3, 0.3],
  ["click", 45.3, 0.3],
  ["impact-bass-2", 46.6, 0.38],
  ["sparkle", 47.45, 0.28],
  ["impact-bass-1", 48.65, 0.3],
  ["whoosh-short", 48.9, 0.3],
  ["pop", 49.35, 0.3],
  ["click-soft", 49.9, 0.3],
];
const SFX_DUR = {
  "whoosh-short": 0.57,
  whoosh: 0.57,
  "impact-bass-1": 2.12,
  "impact-bass-2": 2.59,
  pop: 0.72,
  "click-soft": 0.37,
  click: 0.37,
  "glitch-3": 3.1,
  ping: 1.32,
  sparkle: 1.8,
  error: 1.62,
};

// Optional BGM (filled after HeyGen retrieve): assets/bgm/track.mp3
let BGM = null;
try {
  BGM = JSON.parse(readFileSync(".work/bgm.json", "utf8"));
} catch {}

// ---------------------------------------------------------------------------
const f = (n) => +n.toFixed(3);
const hostHtml = (b, i) => `      <div
        id="host-${b.id}"
        class="clip beat-${b.layer}"
        data-composition-id="${b.id}"
        data-composition-src="compositions/beats/${b.id}.html"
        data-start="${f(b.start)}"
        data-duration="${f(b.end - b.start)}"
        data-track-index="${10 + i}"
        data-width="1080"
        data-height="1920"
      ></div>`;

const behind = BEATS.map((b, i) => [b, i]).filter(([b]) => b.layer === "behind");
const front = BEATS.map((b, i) => [b, i]).filter(([b]) => b.layer === "front");

const subjectHtml = SUBJECT_CLIPS.map(
  (s, i) => `        <video
          id="subject-${i}"
          class="clip"
          src="assets/subject.webm"
          data-start="${f(s.start)}"
          data-duration="${f(s.end - s.start)}"
          data-media-start="${f(s.start)}"
          data-track-index="1"
          muted
          playsinline
        ></video>`,
).join("\n");

const sfxHtml = SFX.map(([name, at, vol], i) => {
  const dur = Math.min(SFX_DUR[name], ROOT_DURATION - at);
  return `      <audio id="sfx-${i}" src="assets/sfx/${name}.mp3" data-start="${f(at)}" data-duration="${f(dur)}" data-track-index="${40 + (i % 4)}" data-volume="${vol}"></audio>`;
}).join("\n");

// BGM: once carved, the carve-authored tag (fx chain + automation) is kept verbatim.
const bgmHtml = BGM
  ? BGM.tag
    ? "      " + BGM.tag
    : `      <audio id="bgm" src="${BGM.path}" data-start="0" data-duration="${ROOT_DURATION}" data-track-index="35" data-volume="${BGM.volume}"></audio>`
  : "";

let tpl = readFileSync(".work/index.v2.template.html", "utf8");
tpl = tpl
  .replaceAll("__ROOT_DURATION__", String(ROOT_DURATION))
  .replaceAll("__VIDEO_DURATION__", String(VIDEO_DURATION))
  .replace("__BEHIND_HOSTS__", behind.map(([b, i]) => hostHtml(b, i)).join("\n"))
  .replace("__FRONT_HOSTS__", front.map(([b, i]) => hostHtml(b, i)).join("\n"))
  .replace("__SUBJECT_CLIPS__", subjectHtml)
  .replace("__SFX_AUDIO__", sfxHtml)
  .replace("__BGM_AUDIO__", bgmHtml)
  .replace("__CAMERA__", JSON.stringify(CAMERA))
  .replace("__WHIPS__", JSON.stringify(WHIPS))
  .replace("__SHAKES__", JSON.stringify(SHAKES))
  .replace("__DIMS__", JSON.stringify(DIMS))
  .replace("__WORDS__", JSON.stringify(words))
  .replace("__GROUPS__", JSON.stringify(groups))
  .replace("__EMPHASIS__", JSON.stringify(EMPHASIS));

writeFileSync("index.html", tpl);
console.log(`index.html: ${groups.length} caption groups, ${BEATS.length} beats, ${SFX.length} sfx${BGM ? ", bgm" : ""}`);
