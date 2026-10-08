import { readFileSync, writeFileSync } from "node:fs";

const SHIFT = Number(process.env.SHIFT ?? 0.35);
const KEEP_END = Number(process.env.KEEP_END ?? 49.04); // matches cutlist kept segment end (pre-shift)

const raw = JSON.parse(readFileSync("assets/transcript.json", "utf8"));
const words = raw
  .filter(w => w.text && w.text.trim().length > 0)
  .filter(w => w.start >= SHIFT - 0.001 && w.end <= KEEP_END + 0.001)
  .map(w => ({ text: w.text, start: +(w.start - SHIFT).toFixed(3), end: +(w.end - SHIFT).toFixed(3), id: w.id }));

const MAX_WORDS = 3;
const groups = [];
let cur = [];
for (let i = 0; i < words.length; i++) {
  cur.push(i);
  const w = words[i];
  const endsClause = /[,.:;!?]$/.test(w.text);
  const nextGap = i + 1 < words.length ? words[i + 1].start - w.end : 999;
  const hardBreak = endsClause || cur.length >= MAX_WORDS || nextGap > 0.32;
  if (hardBreak) {
    groups.push(cur);
    cur = [];
  }
}
if (cur.length) groups.push(cur);

const GROUPS = groups.map((idxs, gi) => {
  const gw = idxs.map(i => words[i]);
  const nextStart = gi + 1 < groups.length ? words[groups[gi + 1][0]].start : gw[gw.length - 1].end + 0.5;
  const end = Math.min(+(gw[gw.length - 1].end + 0.35).toFixed(3), +(nextStart - 0.04).toFixed(3));
  return {
    wordStart: idxs[0],
    wordEnd: idxs[idxs.length - 1],
    start: gw[0].start,
    end,
  };
});

writeFileSync(".work/words.json", JSON.stringify(words, null, 2));
writeFileSync(".work/groups.json", JSON.stringify(GROUPS, null, 2));
console.log("words:", words.length, "groups:", GROUPS.length, "lastEnd:", words[words.length-1].end);
