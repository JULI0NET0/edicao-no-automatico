// Motor curto do framework. Uso: node <caminho>/build.mjs   (rodar dentro de 5-PROJETOS/<slug>/; o scaffold cria `npm run build`)
// Lê .work/config.mjs (tempos LOCAIS, em segundos desde o início do trecho) e .work/words.json
// (tempos de FONTE, em segundos do limpo.mp4). Escreve index.html.
import { readFileSync, writeFileSync } from "node:fs";
import { pathToFileURL } from "node:url";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const cfg = await import(pathToFileURL(resolve(".work/config.mjs")).href);
const { TITLE, SEG, BEATS, SUBJECT_CLIPS = [], CAMERA = [], WHIPS = [], SHAKES = [], DIMS = [], MASKS = [], GRADES = [], FLASHES = [], CC_POPS = [], EMPHASIS_SRC = [], SUPPRESS = [], MODE_WINDOWS = [], SFX = [], SFX_VOL = 0.55 } = cfg;

const SEG_LEN = +(SEG.end - SEG.start).toFixed(3);
const ROOT_DURATION = cfg.ROOT_DURATION ?? SEG_LEN;
const CAPTION_LEAD = 0.05;
const f = (n) => +n.toFixed(3);

// words → local time, limited to the segment
const srcWords = JSON.parse(readFileSync(".work/words.json", "utf8"));
const map = new Map();
const words = [];
srcWords.forEach((w, i) => {
  if (w.start >= SEG.start - 0.06 && w.start < SEG.end - 0.08) {
    map.set(i, words.length);
    words.push({ ...w, start: f(Math.max(0, w.start - SEG.start - CAPTION_LEAD)), end: f(Math.max(0.05, w.end - SEG.start - CAPTION_LEAD)) });
  }
});
const EMPHASIS = EMPHASIS_SRC.map((i) => map.get(i)).filter((i) => i !== undefined);

// groups (≤3 words, break on punctuation / pauses)
const idxGroups = [];
let cur = [];
words.forEach((w, i) => {
  cur.push(i);
  const gap = i + 1 < words.length ? words[i + 1].start - w.end : 999;
  if (/[,.:;!?]$/.test(w.text) || cur.length >= 3 || gap > 0.3) {
    idxGroups.push(cur);
    cur = [];
  }
});
if (cur.length) idxGroups.push(cur);
const inWin = (t, a, b) => t >= a - 0.001 && t < b;
const groups = idxGroups
  .map((idxs, gi) => {
    const gw = idxs.map((i) => words[i]);
    const nextStart = gi + 1 < idxGroups.length ? words[idxGroups[gi + 1][0]].start : gw[gw.length - 1].end + 0.5;
    const end = Math.min(f(gw[gw.length - 1].end + 0.3), f(nextStart - 0.04), ROOT_DURATION);
    return { wordStart: idxs[0], wordEnd: idxs[idxs.length - 1], start: gw[0].start, end };
  })
  .filter((g) => !SUPPRESS.some(([a, b]) => inWin(g.start, a, b)))
  .map((g) => {
    const w = MODE_WINDOWS.find((m) => inWin(g.start, m.from, m.to));
    return { ...g, mode: w ? w.mode : "low" };
  });

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
          data-media-start="${f(SEG.start + s.start)}"
          data-track-index="1"
          muted
          playsinline
        ></video>`,
).join("\n");

const SFX_DUR = { "whoosh-short": 0.57, whoosh: 0.57, "impact-bass-1": 2.1, "impact-bass-2": 2.59, pop: 0.72, "click-soft": 0.37, click: 0.37, "glitch-3": 0.6, ping: 1.32, sparkle: 1.8, error: 1.62, riser: 3 };
const trackEnd = {};
const sfxHtml = SFX.map(([name, at, rawVol, maxDur], i) => {
  const vol = +(rawVol * (/impact|riser/.test(name) ? 0.4 : SFX_VOL)).toFixed(3);
  const dur = Math.min(maxDur || SFX_DUR[name], ROOT_DURATION - at);
  let tr = 40;
  while ((trackEnd[tr] ?? -1) > at) tr++; // first track whose previous clip already ended
  trackEnd[tr] = at + dur;
  return `      <audio id="sfx-${i}" src="assets/sfx/${name}.mp3" data-start="${f(at)}" data-duration="${f(dur)}" data-track-index="${tr}" data-volume="${vol}"></audio>`;
}).join("\n");

let bgmHtml = "";
if (cfg.BGM) bgmHtml = `      <audio id="bgm" src="assets/bgm/track.mp3" data-start="0" data-media-start="${f(cfg.BGM.from ?? 0)}" data-duration="${ROOT_DURATION}" data-track-index="35" data-volume="${cfg.BGM.volume ?? 0.1}"></audio>`;

let tpl = readFileSync(resolve(here, "template.html"), "utf8");
tpl = tpl
  .replaceAll("__TITLE__", TITLE)
  .replaceAll("__SEG_START__", String(SEG.start))
  .replaceAll("__ROOT_DURATION__", String(ROOT_DURATION))
  .replaceAll("__VIDEO_DURATION__", String(SEG_LEN))
  .replace("__BEHIND_HOSTS__", behind.map(([b, i]) => hostHtml(b, i)).join("\n"))
  .replace("__FRONT_HOSTS__", front.map(([b, i]) => hostHtml(b, i)).join("\n"))
  .replace("__SUBJECT_CLIPS__", subjectHtml)
  .replace("__SFX_AUDIO__", sfxHtml)
  .replace("__BGM_AUDIO__", bgmHtml)
  .replace("__CAMERA__", JSON.stringify(CAMERA))
  .replace("__WHIPS__", JSON.stringify(WHIPS))
  .replace("__SHAKES__", JSON.stringify(SHAKES))
  .replace("__DIMS__", JSON.stringify(DIMS))
  .replace("__MASKS__", JSON.stringify(MASKS))
  .replace("__GRADES__", JSON.stringify(GRADES))
  .replace("__FLASHES__", JSON.stringify(FLASHES))
  .replace("__CC_POPS__", JSON.stringify(CC_POPS))
  .replace("__WORDS__", JSON.stringify(words))
  .replace("__GROUPS__", JSON.stringify(groups))
  .replace("__EMPHASIS__", JSON.stringify(EMPHASIS));
writeFileSync("index.html", tpl);
console.log(`index.html: ${words.length} words, ${groups.length} caption groups, ${BEATS.length} beats, ${SFX.length} sfx, ${ROOT_DURATION}s`);
console.log("words:", words.map((w, i) => `${i}:${w.text}@${w.start}`).join(" "));
