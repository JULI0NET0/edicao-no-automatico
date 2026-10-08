// Aplica o 0-MARCA/MANUAL-DA-MARCA.md a um projeto (ou pasta) que usa os valores do exemplo do Julio.
// Uso: node _SISTEMA/skills/nucleo/configurar-marca/scripts/aplicar-marca.mjs <pasta> [--dry] [--manual=outro.md]
// Também exporta lerManual() para outras ferramentas.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../../../..");

// yaml mínimo: chaves de 1 ou 2 níveis, valores escalares
export function lerManual(arquivo = path.join(RAIZ, "0-MARCA", "MANUAL-DA-MARCA.md")) {
  if (!fs.existsSync(arquivo)) return null;
  const bloco = (fs.readFileSync(arquivo, "utf8").match(/```ya?ml\n([\s\S]*?)```/) || [])[1];
  if (!bloco) return null;
  const out = {};
  let pai = null;
  for (const linha of bloco.split("\n")) {
    if (!linha.trim() || linha.trim().startsWith("#")) continue;
    const m = linha.match(/^(\s*)([\w-]+):\s*(?:"([^"]*)"|'([^']*)'|([^#]*?))\s*(?:#.*)?$/);
    if (!m) continue;
    const [, ind, k, a1, a2, a3] = m;
    const v = (a1 ?? a2 ?? a3 ?? "").trim();
    if (!ind) { if (v) { out[k] = v; pai = null; } else { out[k] = {}; pai = k; } }
    else if (pai) out[pai][k] = v;
  }
  return out;
}

export function trocas(m) {
  const c = m.cores || {}, f = m.fontes || {};
  const t = [];
  const add = (de, para) => para && de.toUpperCase() !== para.toUpperCase() && t.push([de, para]);
  // tons derivados do exemplo só mudam quando a cor base muda
  const familia = (base, variantes, para) => { if (para && base.toUpperCase() !== para.toUpperCase()) [base, ...variantes].forEach((de) => add(de, para)); };
  familia("#0A0A0A", ["#050505", "#111111"], c.fundo);
  add("#1C1C1C", c.superficie);
  familia("#F97316", ["#EA580C", "#FDBA74"], c.acento);
  add("#FFFFFF", c.texto);
  add("#A8A8A8", c["texto-secundario"]);
  familia("#282828", ["#3A3A3A"], c.borda);
  add("League Gothic", f.titulo);
  add("Montserrat", f.corpo);
  add("Playfair Display", f.destaque);
  add("EB Garamond", f.destaque);
  add("{{HANDLE}}", m.handle);
  add("@juli0net0", m.handle);
  add("{{NOME}}", m.nome);
  return t;
}

// rgba(): mesmos papéis, transparência preservada
const hex2rgb = (h) => { const x = h.replace("#", ""); const n = parseInt(x.length === 3 ? x.replace(/./g, "$&$&") : x, 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255]; };
export function trocasRgb(m) {
  const c = m.cores || {}, t = new Map();
  const fam = (base, rgbs, para) => { if (para && base.toUpperCase() !== para.toUpperCase()) rgbs.forEach((k) => t.set(k, hex2rgb(para))); };
  fam("#F97316", ["249,115,22", "234,88,12", "253,186,116"], c.acento);
  fam("#0A0A0A", ["10,10,10", "5,5,5", "17,17,17", "0,0,0"], c.fundo);
  fam("#1C1C1C", ["28,28,28", "20,20,20", "24,24,24", "44,44,44"], c.superficie);
  fam("#282828", ["40,40,40", "58,58,58"], c.borda);
  fam("#FFFFFF", ["255,255,255"], c.texto);
  return t;
}

const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const alvo = process.argv[2];
  const dry = process.argv.includes("--dry");
  if (!alvo) { console.log("Uso: node aplicar-marca.mjs <pasta-do-projeto> [--dry]"); process.exit(1); }
  const argManual = process.argv.find((a) => a.startsWith("--manual="));
  const m = lerManual(argManual ? path.resolve(argManual.slice(9)) : undefined);
  if (!m) { console.log("0-MARCA/MANUAL-DA-MARCA.md não existe ou não tem o bloco yaml. Rode a skill configurar-marca."); process.exit(1); }
  const lista = trocas(m);
  const rgb = trocasRgb(m);
  const mapa = new Map(lista.map(([de, para]) => [de.toUpperCase(), para]));
  const re = new RegExp(lista.map(([de]) => esc(de)).sort((x, y) => y.length - x.length).join("|"), "gi");
  const arquivos = [];
  const andar = (d) => {
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      if (["node_modules", "renders", "snapshots", ".git"].includes(e.name)) continue;
      const p = path.join(d, e.name);
      if (e.isDirectory()) andar(p);
      else if (/\.(html|mjs|js|css|json)$/.test(e.name) && !e.name.endsWith(".lock.json")) arquivos.push(p);
    }
  };
  andar(path.resolve(alvo));
  let total = 0;
  for (const a of arquivos) {
    // uma passada só: o resultado de uma troca nunca é trocado de novo
    let n = 0;
    const s = fs.readFileSync(a, "utf8")
      .replace(re, (achado) => (n++, mapa.get(achado.toUpperCase())))
      .replace(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(,\s*[\d.]+\s*)?\)/g, (achado, r, g, b, alfa) => {
        const novo = rgb.get(`${r},${g},${b}`);
        if (!novo) return achado;
        n++;
        return alfa ? `rgba(${novo.join(", ")}${alfa.replace(/\s+/g, " ")})` : `rgb(${novo.join(", ")})`;
      });
    if (n) { total += n; console.log(`${n.toString().padStart(4)}  ${path.relative(process.cwd(), a)}`); if (!dry) fs.writeFileSync(a, s); }
  }
  console.log(`${dry ? "[simulação] " : ""}${total} troca(s). Rode \`npx hyperframes check\` e confira um snapshot.`);
}
