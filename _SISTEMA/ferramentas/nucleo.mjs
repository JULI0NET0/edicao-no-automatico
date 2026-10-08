// Núcleo do framework: projetos, editor (HyperFrames Studio), elementos e catálogo.
// Usado pelo painel (painel/servidor.mjs) e pela linha de comando (cli.mjs). Sem dependências.
import fs from "node:fs";
import path from "node:path";
import net from "node:net";
import { spawn, execFile } from "node:child_process";
import { fileURLToPath } from "node:url";

export const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const pkg = JSON.parse(fs.readFileSync(path.join(RAIZ, "package.json"), "utf8"));
export const HF = `hyperframes@${pkg.config.hyperframes}`;
export const PASTAS = {
  projetos: path.join(RAIZ, "5-PROJETOS"),
  materiais: path.join(RAIZ, "1-MATERIAIS-PARA-EDITAR"),
  assets: path.join(RAIZ, "2-ASSETS"),
  editados: path.join(RAIZ, "3-EDITADOS"),
  elementos: path.join(RAIZ, "4-ELEMENTOS"),
};
const NPX = process.platform === "win32" ? "npx.cmd" : "npx";
const ENV = { ...process.env, HYPERFRAMES_SKIP_SKILLS: "1" };

export const slugify = (s) =>
  String(s).normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 48);

function hf(args, cwd = RAIZ) {
  return new Promise((ok, falha) =>
    execFile(NPX, ["--yes", HF, ...args], { cwd, env: ENV, maxBuffer: 64 * 1024 * 1024 }, (err, stdout, stderr) =>
      err ? falha(new Error((stderr || stdout || err.message).toString().slice(-2000))) : ok(stdout.toString()),
    ),
  );
}

function dirProjeto(slug) {
  const s = slugify(slug);
  const d = path.join(PASTAS.projetos, s);
  if (!s || !fs.existsSync(path.join(d, "index.html"))) throw new Error(`Projeto não encontrado: ${slug}`);
  return d;
}

// ---------- Projetos ----------
export function listarProjetos() {
  if (!fs.existsSync(PASTAS.projetos)) return [];
  return fs.readdirSync(PASTAS.projetos, { withFileTypes: true })
    .filter((d) => d.isDirectory() && fs.existsSync(path.join(PASTAS.projetos, d.name, "index.html")))
    .map((d) => {
      const dir = path.join(PASTAS.projetos, d.name);
      const meta = lerJson(path.join(dir, "meta.json")) || {};
      const html = fs.readFileSync(path.join(dir, "index.html"), "utf8");
      const w = +(html.match(/data-width="(\d+)"/) || [])[1] || 0, h = +(html.match(/data-height="(\d+)"/) || [])[1] || 0;
      const renders = fs.existsSync(path.join(dir, "renders")) ? fs.readdirSync(path.join(dir, "renders")).filter((f) => /\.(mp4|webm|mov)$/i.test(f)) : [];
      return {
        slug: d.name, titulo: meta.name || d.name, criado: meta.createdAt || null,
        formato: w && h ? (h > w ? "9:16" : w > h ? "16:9" : "1:1") : "?",
        elementos: lerElementosDoProjeto(dir), renders,
        editor: editores.get(d.name)?.url || null,
        modificado: fs.statSync(path.join(dir, "index.html")).mtimeMs,
      };
    })
    .sort((a, b) => b.modificado - a.modificado);
}

export function listarMateriais() {
  if (!fs.existsSync(PASTAS.materiais)) return [];
  const todos = fs.readdirSync(PASTAS.materiais, { withFileTypes: true }).flatMap((d) =>
    d.isDirectory() ? fs.readdirSync(path.join(PASTAS.materiais, d.name)).map((f) => path.join(d.name, f)) : [d.name]);
  return todos.filter((f) => /\.(mov|mp4|m4v|webm|m4a|mp3|wav)$/i.test(f));
}

const RES = { "9:16": "portrait", "16:9": "landscape", "1:1": "square" };
export async function criarProjeto({ titulo, formato = "9:16", material = "", objetivo = "", estilo = "", identidade = "" }) {
  const slug = slugify(titulo);
  if (!slug) throw new Error("Dê um nome ao projeto.");
  const dir = path.join(PASTAS.projetos, slug);
  if (fs.existsSync(dir)) throw new Error(`Já existe um projeto "${slug}".`);
  fs.mkdirSync(PASTAS.projetos, { recursive: true });

  const args = ["init", dir, "--non-interactive", "--example=blank", `--resolution=${RES[formato] || "portrait"}`, "--skill=general-video"];
  if (material) {
    const src = path.resolve(PASTAS.materiais, material);
    if (!src.startsWith(PASTAS.materiais + path.sep) || !fs.existsSync(src)) throw new Error(`Material não encontrado em 1-MATERIAIS-PARA-EDITAR: ${material}`);
    args.push(/\.(m4a|mp3|wav)$/i.test(src) ? `--audio=${src}` : `--video=${src}`, "--skip-transcribe");
  }
  await hf(args);

  const meta = lerJson(path.join(dir, "meta.json")) || {};
  fs.writeFileSync(path.join(dir, "meta.json"), JSON.stringify({ ...meta, id: slug, name: titulo, formato, material: material || null, estilo: estilo || null, objetivo: objetivo || null, createdAt: new Date().toISOString() }, null, 2));
  fs.writeFileSync(
    path.join(dir, "BRIEF.md"),
    `# ${titulo}\n\n- **Formato:** ${formato}\n- **Material:** ${material ? `1-MATERIAIS-PARA-EDITAR/${material}` : "—"}\n- **Estilo:** ${estilo ? `/${estilo}` : "(a definir: aba Estilos do painel)"}\n- **Identidade visual:** ${identidade || "0-MARCA/MANUAL-DA-MARCA.md (marca principal)"}\n- **Elementos:** ver ELEMENTOS.md\n- **Entrega:** 3-EDITADOS/\n\n## Objetivo deste vídeo\n${objetivo || "(a definir no início da edição: o que o vídeo precisa causar, para quem, CTA final)"}\n\n## Público\n\n## Roteiro / fala\n`,
  );
  fs.writeFileSync(path.join(dir, "ELEMENTOS.md"), `# Elementos escolhidos — ${titulo}\n\nCódigos de 4-ELEMENTOS/ que este vídeo deve usar. A cópia de cada um fica em .work/elementos/.\n\n`);
  return { slug };
}

// ---------- Editor (HyperFrames Studio) ----------
const editores = new Map(); // slug -> { proc, porta, url }

function portaLivre(inicio) {
  return new Promise((ok) => {
    const s = net.createServer();
    s.once("error", () => ok(portaLivre(inicio + 1)));
    s.listen(inicio, "127.0.0.1", () => s.close(() => ok(inicio)));
  });
}
async function esperarPorta(porta, ms = 90000) {
  const fim = Date.now() + ms;
  while (Date.now() < fim) {
    const aberta = await new Promise((ok) => {
      const c = net.connect(porta, "127.0.0.1", () => { c.end(); ok(true); });
      c.on("error", () => ok(false));
    });
    if (aberta) return true;
    await new Promise((r) => setTimeout(r, 400));
  }
  return false;
}

export async function abrirEditor(slug, { abrirNavegador = false } = {}) {
  const dir = dirProjeto(slug);
  const nome = path.basename(dir);
  const ativo = editores.get(nome);
  if (ativo && ativo.proc.exitCode === null) return { url: ativo.url, jaAberto: true };
  const porta = await portaLivre(3100);
  const args = ["--yes", HF, "preview", dir, `--port=${porta}`, "--force-new", "--foreground"];
  if (!abrirNavegador) args.push("--no-open");
  const proc = spawn(NPX, args, { cwd: dir, env: ENV, stdio: ["ignore", "pipe", "pipe"] });
  let log = "";
  proc.stdout.on("data", (d) => (log += d));
  proc.stderr.on("data", (d) => (log += d));
  const url = `http://localhost:${porta}`;
  editores.set(nome, { proc, porta, url });
  proc.on("exit", () => editores.delete(nome));
  if (!(await esperarPorta(porta))) {
    proc.kill();
    throw new Error("O editor não abriu a tempo.\n" + log.slice(-1200));
  }
  return { url };
}
export function fecharEditores() {
  for (const { proc } of editores.values()) proc.kill();
}

// ---------- Elementos (os 108) ----------
export function catalogoElementos() {
  return lerJson(path.join(PASTAS.elementos, "catalogo.json")) || [];
}
function lerElementosDoProjeto(dir) {
  const f = path.join(dir, "ELEMENTOS.md");
  if (!fs.existsSync(f)) return [];
  return [...fs.readFileSync(f, "utf8").matchAll(/^- \*\*([A-Z0-9]{3}-\d{2})\*\*/gm)].map((m) => m[1]);
}
export function usarElemento(codigo, slug, nota = "") {
  const dir = dirProjeto(slug);
  const el = catalogoElementos().find((e) => e.codigo === String(codigo).toUpperCase());
  if (!el) throw new Error(`Elemento não existe: ${codigo}`);
  const destino = path.join(dir, ".work", "elementos", el.codigo);
  fs.mkdirSync(destino, { recursive: true });
  for (const f of ["elemento.html", "PEDIR.md", "poster.jpg"]) {
    const s = path.join(PASTAS.elementos, el.pasta, f);
    if (fs.existsSync(s)) fs.copyFileSync(s, path.join(destino, f));
  }
  // o elemento.html aponta para ../_fontes; dentro do projeto, aponta para a pasta 4-ELEMENTOS original
  const h = path.join(destino, "elemento.html");
  const rel = path.relative(destino, path.join(PASTAS.elementos, "_fontes")).split(path.sep).join("/");
  fs.writeFileSync(h, fs.readFileSync(h, "utf8").replaceAll("../_fontes/", rel + "/"));

  const md = path.join(dir, "ELEMENTOS.md");
  const atual = fs.existsSync(md) ? fs.readFileSync(md, "utf8") : "# Elementos escolhidos\n\n";
  if (!lerElementosDoProjeto(dir).includes(el.codigo)) {
    const linha = `- **${el.codigo}** · ${el.nome} (${el.categoria}) — você informa: ${el.pedir || "—"}${nota ? ` · nota: ${nota}` : ""} · ref: .work/elementos/${el.codigo}/\n`;
    fs.writeFileSync(md, atual + linha);
  }
  return { codigo: el.codigo, projeto: path.basename(dir) };
}
export function removerElemento(codigo, slug) {
  const dir = dirProjeto(slug);
  const md = path.join(dir, "ELEMENTOS.md");
  if (fs.existsSync(md)) fs.writeFileSync(md, fs.readFileSync(md, "utf8").split("\n").filter((l) => !l.startsWith(`- **${codigo}**`)).join("\n"));
  fs.rmSync(path.join(dir, ".work", "elementos", codigo), { recursive: true, force: true });
}

// ---------- Catálogo HyperFrames (~390 blocos e componentes) ----------
let cacheCatalogo = null;
export async function catalogoHyperframes() {
  if (cacheCatalogo) return cacheCatalogo;
  const cacheArq = path.join(RAIZ, "_SISTEMA", "ferramentas", ".cache-catalogo.json");
  try {
    cacheCatalogo = JSON.parse(await hf(["catalog", "--json"]));
    fs.writeFileSync(cacheArq, JSON.stringify(cacheCatalogo));
  } catch (e) {
    cacheCatalogo = lerJson(cacheArq);
    if (!cacheCatalogo) throw e;
  }
  return cacheCatalogo;
}
export async function adicionarDoCatalogo(nome, slug) {
  const dir = dirProjeto(slug);
  if (!/^[a-z0-9-]+$/.test(nome)) throw new Error("Nome de item inválido.");
  const saida = await hf(["add", nome, "--no-clipboard"], dir);
  const md = path.join(dir, "ELEMENTOS.md");
  if (fs.existsSync(md)) fs.appendFileSync(md, `- catálogo HyperFrames: \`${nome}\` (instalado em compositions/)\n`);
  return { nome, projeto: path.basename(dir), saida: saida.slice(-600) };
}

// ---------- Check / render ----------
export const check = (slug) => hf(["check"], dirProjeto(slug));
export async function render(slug, { qualidade = "draft" } = {}) {
  const dir = dirProjeto(slug);
  const nome = `${path.basename(dir)}-${qualidade}-${new Date().toISOString().slice(0, 16).replace(/[:T]/g, "")}.mp4`;
  fs.mkdirSync(path.join(dir, "renders"), { recursive: true });
  const saida = path.join(dir, "renders", nome);
  const args = ["render", "--quality", qualidade, "-o", saida];
  if (qualidade === "delivery") {
    const html = fs.readFileSync(path.join(dir, "index.html"), "utf8");
    const w = +(html.match(/data-width="(\d+)"/) || [])[1], h = +(html.match(/data-height="(\d+)"/) || [])[1];
    if (w && h && Math.max(w, h) <= 1920) args.push(`--resolution=${h > w ? "portrait-4k" : w > h ? "landscape-4k" : "square-4k"}`);
  }
  await hf(args, dir);
  if (qualidade !== "draft") {
    fs.mkdirSync(PASTAS.editados, { recursive: true });
    fs.copyFileSync(saida, path.join(PASTAS.editados, nome));
  }
  return { arquivo: path.relative(RAIZ, saida) };
}

function lerJson(f) {
  try { return JSON.parse(fs.readFileSync(f, "utf8")); } catch { return null; }
}

// ---------- Arquivos do painel de criação ----------
export const AREAS = {
  marca: { dir: path.join(RAIZ, "0-MARCA", "assets"), rotulo: "Marca" },
  materiais: { dir: PASTAS.materiais, rotulo: "Vídeos para editar" },
  imagens: { dir: path.join(PASTAS.assets, "imagens"), rotulo: "Imagens" },
  broll: { dir: path.join(PASTAS.assets, "broll"), rotulo: "B-roll" },
  trilhas: { dir: path.join(PASTAS.assets, "trilhas"), rotulo: "Trilhas" },
  sfx: { dir: path.join(PASTAS.assets, "sfx"), rotulo: "SFX" },
  editados: { dir: PASTAS.editados, rotulo: "Editados" },
};
const TIPO = (f) =>
  /\.(mov|mp4|m4v|webm)$/i.test(f) ? "video" : /\.(png|jpe?g|webp|gif|svg|avif)$/i.test(f) ? "imagem" : /\.(mp3|m4a|wav|aac|ogg)$/i.test(f) ? "audio" : /\.(md|txt|pdf|json)$/i.test(f) ? "doc" : "outro";

export function listarArquivos() {
  const out = {};
  for (const [k, { dir, rotulo }] of Object.entries(AREAS)) {
    fs.mkdirSync(dir, { recursive: true });
    out[k] = {
      rotulo,
      pasta: path.relative(RAIZ, dir),
      itens: fs.readdirSync(dir, { withFileTypes: true })
        .flatMap((d) => d.isDirectory() && !d.name.startsWith(".") && k !== "marca"
          ? fs.readdirSync(path.join(dir, d.name), { withFileTypes: true }).filter((x) => x.isFile()).map((x) => path.join(d.name, x.name))
          : d.isFile() ? [d.name] : [])
        .filter((nome) => !path.basename(nome).startsWith("."))
        .map((nome) => {
          const st = fs.statSync(path.join(dir, nome));
          return { nome, url: "/" + path.relative(RAIZ, path.join(dir, nome)).split(path.sep).map(encodeURIComponent).join("/"), tipo: TIPO(nome), tamanho: st.size, data: st.mtimeMs };
        })
        .sort((a, b) => b.data - a.data),
    };
  }
  const manual = path.join(RAIZ, "0-MARCA", "MANUAL-DA-MARCA.md");
  out.manual = fs.existsSync(manual) ? fs.readFileSync(manual, "utf8") : null;
  return out;
}

export function salvarArquivo(area, nome, stream) {
  const a = AREAS[area];
  if (!a) throw new Error("Área inválida.");
  const limpo = path.basename(String(nome)).replace(/[^\w.\- ()À-ÿ]/g, "_");
  if (!limpo || limpo.startsWith(".")) throw new Error("Nome de arquivo inválido.");
  fs.mkdirSync(a.dir, { recursive: true });
  const destino = path.join(a.dir, limpo);
  return new Promise((ok, falha) => {
    const w = fs.createWriteStream(destino);
    stream.pipe(w);
    w.on("finish", () => ok({ nome: limpo, area }));
    w.on("error", falha);
  });
}

export function abrirPasta(area) {
  const a = AREAS[area];
  if (!a) throw new Error("Área inválida.");
  const cmd = process.platform === "darwin" ? "open" : process.platform === "win32" ? "explorer" : "xdg-open";
  spawn(cmd, [a.dir], { detached: true, stdio: "ignore" }).unref();
  return { ok: true };
}

// ---------- Estilos (skills com comando) ----------
function lerFrontmatter(md) {
  const fm = (md.match(/^---\n([\s\S]*?)\n---/) || [])[1] || "";
  return { name: (fm.match(/^name:\s*(.+)$/m) || [])[1]?.trim(), description: (fm.match(/^description:\s*(.+)$/m) || [])[1]?.trim() || "" };
}
const GRUPOS = { estilos: "Estilos do curso", "meus-estilos": "Meus estilos", nucleo: "Comandos do dia a dia", pecas: "Peças" };
const PEDIDO = {
  comecar: "/comecar",
  "configurar-marca": "/configurar-marca",
  "preparar-projeto": "/preparar-projeto edita o {arquivo}",
  "limpar-bruto": "/limpar-bruto corta os erros e silêncios do {arquivo}",
  "revisar-e-entregar": "/revisar-e-entregar renderiza o projeto em 4K",
  "criar-estilo": "/criar-estilo salva o visual deste projeto como um estilo",
  "escolher-elementos": "/escolher-elementos sugere os elementos para este vídeo",
  "imagens-ia": "/imagens-ia gera as imagens que o vídeo precisa",
  "trilha-e-sfx": "/trilha-e-sfx coloca trilha e efeitos sonoros",
};
export function listarEstilos() {
  const base = path.join(RAIZ, "_SISTEMA", "skills");
  const out = [];
  for (const grupo of ["estilos", "meus-estilos", "nucleo", "pecas"]) {
    const g = path.join(base, grupo);
    if (!fs.existsSync(g)) continue;
    for (const nome of fs.readdirSync(g).sort()) {
      const md = path.join(g, nome, "SKILL.md");
      if (!fs.existsSync(md)) continue;
      const { name, description } = lerFrontmatter(fs.readFileSync(md, "utf8"));
      const acha = (re) => { const r = []; const andar = (d) => { for (const e of fs.readdirSync(d, { withFileTypes: true })) { const p = path.join(d, e.name); if (e.isDirectory() && e.name !== "projeto") andar(p); else if (re.test(e.name)) r.push(p); } }; if (fs.existsSync(path.join(g, nome, "assets"))) andar(path.join(g, nome, "assets")); return r[0]; };
      const url = (p) => p ? "/" + path.relative(RAIZ, p).split(path.sep).map(encodeURIComponent).join("/") : null;
      const resumo = description.split(/ — | - /)[1]?.split(/\. Use /)[0] || description.split(/\. Use /)[0];
      out.push({
        nome: name || nome, grupo, grupoNome: GRUPOS[grupo], description,
        resumo: description.includes("RASCUNHO") ? `Criado a partir de um vídeo aprovado. Ainda é rascunho: peça "/criar-estilo completa a skill ${name || nome}".` : resumo.slice(0, 260),
        comando: PEDIDO[nome] || `/${name || nome} edita o {arquivo}`,
        video: url(acha(/^exemplo.*\.mp4$/i)), poster: url(acha(/^poster\.jpg$/i)),
        rascunho: description.includes("RASCUNHO"),
      });
    }
  }
  return out;
}
