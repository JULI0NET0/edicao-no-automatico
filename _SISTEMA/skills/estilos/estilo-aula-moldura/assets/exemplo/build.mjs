// Modelo de aula 16:9 4K: vídeo na moldura, etiqueta "Aula NN · título", legenda karaokê, barra de progresso, encerramento com logo.
// Uso (dentro de 5-PROJETOS/<slug>/): node <skill>/assets/exemplo/build.mjs
// Lê .work/aula.json e assets/transcript.json; escreve index.html. Os placeholders de marca são trocados pelo aplicar-marca.mjs.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const AQUI = path.dirname(fileURLToPath(import.meta.url));
const cfg = JSON.parse(fs.readFileSync(".work/aula.json", "utf8"));
// cfg: { "video": "assets/aula01.mp4", "inicio": 1.5, "fim": 59.5, "kicker": "Aula 01 · Primeiro projeto",
//        "titulo": "Nome do curso", "encerramento": 3.6, "palavrasPorFrase": 4, "correcoes": { "Cloud": "Claude" }, "juncoes": [["da", "Vinci", "DaVinci"]] }
const T0 = cfg.inicio ?? 0, END = cfg.fim, DUR = +(END - T0).toFixed(2), ENDD = cfg.encerramento ?? 3.6;
const fix = cfg.correcoes || {};
const words = JSON.parse(fs.readFileSync("assets/transcript.json", "utf8"))
  .filter((w) => w.start >= T0 && w.end <= END + 0.05)
  .map((w) => {
    const pont = (w.text.match(/[.,!?]$/) || [""])[0], base = w.text.replace(/[.,!?]$/, "");
    return { t: (fix[base] ?? base) + pont, s: +(w.start - T0).toFixed(2), e: +(w.end - T0).toFixed(2) };
  });
// junções: ["da", "Vinci", "DaVinci"] junta duas palavras seguidas em uma
for (const [a, b, junto] of cfg.juncoes || [])
  for (let i = 0; i < words.length - 1; i++)
    if (words[i].t === a && words[i + 1].t.replace(/[.,!?]$/, "") === b) { words[i].t = junto + (words[i + 1].t.match(/[.,!?]$/)?.[0] ?? ""); words[i].e = words[i + 1].e; words.splice(i + 1, 1); }
const N = cfg.palavrasPorFrase ?? 4, frases = [];
let cur = [];
for (const w of words) { cur.push(w); if (cur.length >= N || /[.,!?]$/.test(w.t)) { frases.push(cur); cur = []; } }
if (cur.length) frases.push(cur);
const data = frases.map((p, i) => ({ s: p[0].s, e: Math.min(p.at(-1).e + 0.25, frases[i + 1]?.[0].s ?? DUR), w: p.map((w) => ({ t: w.t, s: w.s })) }));

const html = fs.readFileSync(path.join(AQUI, "template.html"), "utf8")
  .replace("__DATA__", JSON.stringify(data))
  .replaceAll("__VIDEO__", cfg.video).replaceAll("__KICKER__", cfg.kicker || "").replaceAll("__TITULO__", cfg.titulo || "")
  .replaceAll("__VID__", DUR).replaceAll("__ENDS__", DUR).replaceAll("__ENDD__", ENDD)
  .replaceAll("__TOTAL__", +(DUR + ENDD).toFixed(2)).replaceAll("__T0__", T0);
fs.writeFileSync("index.html", html);
console.log(`${frases.length} frases, ${DUR}s + ${ENDD}s de encerramento`);
