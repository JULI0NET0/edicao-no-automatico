import os from "node:os";
import path from "node:path";
// lib da skill media-use (instalada com `npx hyperframes skills`)
const { heygenAuthHeaders, searchSounds, downloadTo } = await import(path.join(os.homedir(), ".claude/skills/media-use/audio/scripts/lib/heygen.mjs"));
const headers = heygenAuthHeaders();
const queries = [
  "confident modern tech beat minimal",
  "sleek corporate hip hop instrumental driving",
  "premium tech keynote pulse electronic",
];
const seen = new Set();
const picks = [];
for (const q of queries) {
  const res = await searchSounds(q, "music", headers, { limit: 5 });
  for (const r of res) {
    if (seen.has(r.audio_url)) continue;
    seen.add(r.audio_url);
    picks.push({ q, score: r.score, duration: r.duration, title: r.title || r.name, description: (r.description || "").slice(0, 140), url: r.audio_url });
  }
}
picks.sort((a, b) => (b.score || 0) - (a.score || 0));
const top = picks.slice(0, 5);
for (let i = 0; i < top.length; i++) {
  await downloadTo(top[i].url, `.work/bgm-cand/c${i + 1}.mp3`);
  delete top[i].url;
  console.log(`c${i + 1}`, JSON.stringify(top[i]));
}
