import os from "node:os";
import path from "node:path";
// lib da skill media-use (instalada com `npx hyperframes skills`)
const { heygenAuthHeaders, searchSounds, downloadTo } = await import(path.join(os.homedir(), ".claude/skills/media-use/audio/scripts/lib/heygen.mjs"));
const headers = heygenAuthHeaders();
const queries = ["dramatic epic orchestral trailer drums build", "intense epic cinematic hybrid trailer powerful", "dark dramatic cinematic tension rising epic climax", "epic emotional orchestral motivational strings drums"];
const seen = new Set(), picks = [];
for (const q of queries) for (const r of await searchSounds(q, "music", headers, { limit: 8 })) {
  if (seen.has(r.audio_url) || (r.duration || 0) < 34) continue; seen.add(r.audio_url);
  picks.push({ q, score: r.score, duration: r.duration, description: (r.description || "").slice(0, 140), url: r.audio_url });
}
picks.sort((a, b) => (b.score || 0) - (a.score || 0));
const top = picks.slice(0, 6);
for (let i = 0; i < top.length; i++) { await downloadTo(top[i].url, `.work/bgm-cand/d${i + 1}.mp3`); delete top[i].url; console.log(`d${i + 1}`, JSON.stringify(top[i])); }
