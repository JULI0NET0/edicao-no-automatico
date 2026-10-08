// Painel do framework: `npm run hyperframes` → http://localhost:3020
// Abas: Projetos (abrir no editor, criar, check, render) · Elementos (108) · Catálogo HyperFrames.
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { exec } from "node:child_process";
import * as N from "../nucleo.mjs";

const pkg = JSON.parse(fs.readFileSync(path.join(N.RAIZ, "package.json"), "utf8"));
const PORTA = +(process.env.PORTA || pkg.config.porta || 3020);
const ABA = (process.argv.find((a) => a.startsWith("--aba=")) || "").split("=")[1] || "criacao";
const SEM_ABRIR = process.argv.includes("--sem-abrir") || !!process.env.CI;

const TIPOS = { ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".mjs": "text/javascript", ".css": "text/css", ".json": "application/json", ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".svg": "image/svg+xml", ".mp4": "video/mp4", ".webm": "video/webm", ".mp3": "audio/mpeg", ".m4a": "audio/mp4", ".woff2": "font/woff2" };

function arquivo(req, res, abs) {
  const st = fs.statSync(abs);
  const tipo = TIPOS[path.extname(abs).toLowerCase()] || "application/octet-stream";
  const range = req.headers.range && /bytes=(\d*)-(\d*)/.exec(req.headers.range);
  if (range && tipo.startsWith("video/")) {
    const ini = range[1] ? +range[1] : 0, fim = range[2] ? +range[2] : st.size - 1;
    res.writeHead(206, { "Content-Type": tipo, "Content-Range": `bytes ${ini}-${fim}/${st.size}`, "Accept-Ranges": "bytes", "Content-Length": fim - ini + 1 });
    return fs.createReadStream(abs, { start: ini, end: fim }).pipe(res);
  }
  res.writeHead(200, { "Content-Type": tipo, "Content-Length": st.size, "Cache-Control": "no-cache" });
  fs.createReadStream(abs).pipe(res);
}

const json = (res, code, obj) => { res.writeHead(code, { "Content-Type": "application/json; charset=utf-8" }); res.end(JSON.stringify(obj)); };
const corpo = (req) => new Promise((ok) => { let b = ""; req.on("data", (d) => (b += d)); req.on("end", () => { try { ok(JSON.parse(b || "{}")); } catch { ok({}); } }); });

const API = {
  "GET /api/estado": async () => ({ projetos: N.listarProjetos(), materiais: N.listarMateriais(), hyperframes: N.HF, aba: ABA, versao: pkg.version }),
  "GET /api/elementos": async () => N.catalogoElementos(),
  "GET /api/estilos": async () => N.listarEstilos(),
  "POST /api/criar-estilo": async (b) => (await import("../criar-estilo.mjs")).criarEstilo(b.slug, b.nome),
  "GET /api/catalogo": async () => N.catalogoHyperframes(),
  "GET /api/arquivos": async () => N.listarArquivos(),
  "POST /api/abrir-pasta": async (b) => N.abrirPasta(b.area),
  "POST /api/projetos": async (b) => N.criarProjeto(b),
  "POST /api/editor": async (b) => N.abrirEditor(b.slug),
  "POST /api/usar": async (b) => N.usarElemento(b.codigo, b.slug, b.nota),
  "POST /api/remover": async (b) => (N.removerElemento(b.codigo, b.slug), { ok: true }),
  "POST /api/catalogo/add": async (b) => N.adicionarDoCatalogo(b.nome, b.slug),
  "POST /api/check": async (b) => ({ saida: await N.check(b.slug) }),
  "POST /api/render": async (b) => N.render(b.slug, { qualidade: b.qualidade }),
};

const servidor = http.createServer(async (req, res) => {
  const url = new URL(req.url, "http://x");
  if (req.method === "POST" && url.pathname === "/api/enviar") {
    try { json(res, 200, await N.salvarArquivo(url.searchParams.get("area"), url.searchParams.get("nome"), req)); }
    catch (e) { json(res, 400, { erro: e.message }); }
    return;
  }
  const rota = API[`${req.method} ${url.pathname}`];
  if (rota) {
    try { json(res, 200, await rota(req.method === "POST" ? await corpo(req) : Object.fromEntries(url.searchParams))); }
    catch (e) { json(res, 400, { erro: e.message }); }
    return;
  }
  // estáticos: o painel e as pastas do framework (elementos, 5-PROJETOS/renders)
  let p = decodeURIComponent(url.pathname);
  if (p === "/") p = "/_SISTEMA/ferramentas/painel/painel.html";
  const abs = path.join(N.RAIZ, p);
  if (!abs.startsWith(N.RAIZ) || !fs.existsSync(abs) || fs.statSync(abs).isDirectory()) { res.writeHead(404); return res.end("não encontrado"); }
  arquivo(req, res, abs);
});

servidor.listen(PORTA, "127.0.0.1", () => {
  const url = `http://localhost:${PORTA}/${ABA !== "criacao" ? "#" + ABA : ""}`;
  console.log(`\n  Edição no Automático — painel\n  ${url}\n\n  Projetos, editor HyperFrames (${N.HF}), 108 elementos e catálogo.\n  Ctrl+C para sair.\n`);
  if (!SEM_ABRIR) exec(`${process.platform === "darwin" ? "open" : process.platform === "win32" ? "start" : "xdg-open"} ${url}`);
});
servidor.on("error", (e) => {
  if (e.code === "EADDRINUSE") console.log(`O painel já está aberto: http://localhost:${PORTA}`);
  else console.error(e);
  process.exit(1);
});
const sair = () => { N.fecharEditores(); process.exit(0); };
process.on("SIGINT", sair);
process.on("SIGTERM", sair);
