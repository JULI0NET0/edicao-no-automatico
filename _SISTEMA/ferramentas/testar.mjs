// Teste automático do framework. Uso:
//   npm run testar            (completo: inclui criar projeto, montar um reel de teste e rodar o check)
//   npm run testar -- --rapido (só estrutura, skills, elementos, marca e painel; sem rede)
// Não mexe nos seus projetos: cria 5-PROJETOS/teste-automatico-framework e apaga no fim.
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { execFileSync, spawn } from "node:child_process";
import * as N from "./nucleo.mjs";

const R = N.RAIZ;
const RAPIDO = process.argv.includes("--rapido");
const TMP = fs.mkdtempSync(path.join(os.tmpdir(), "edicao-teste-"));
let ok = 0, falhas = [];
const passo = (t) => console.log(`\n\x1b[1m${t}\x1b[0m`);
const certo = (t) => { ok++; console.log(`  \x1b[38;5;208m✓\x1b[0m ${t}`); };
const errado = (t, d = "") => { falhas.push(t); console.log(`  \x1b[31m✗ ${t}\x1b[0m${d ? "\n    " + String(d).split("\n").slice(-6).join("\n    ") : ""}`); };
const checa = (cond, t, d) => (cond ? certo(t) : errado(t, d));
const sh = (cmd, args, opts = {}) => execFileSync(cmd, args, { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"], ...opts });

async function main() {
  passo("1. Ambiente");
  checa(+process.versions.node.split(".")[0] >= 20, `Node ${process.version} (precisa 20+)`);
  try { sh("ffmpeg", ["-version"]); certo("ffmpeg instalado"); } catch { errado("ffmpeg não encontrado (brew install ffmpeg)"); }

  passo("2. Estrutura de pastas");
  for (const p of ["AGENTS.md", "CLAUDE.md", "COMECE-AQUI.md", "instalar.sh", "package.json", "_SISTEMA/skills", "_SISTEMA/ferramentas", "_SISTEMA/modelos", "0-MARCA/assets", "0-MARCA/exemplo-julio/MANUAL-DA-MARCA.md",
    "1-MATERIAIS-PARA-EDITAR", "2-ASSETS/imagens", "2-ASSETS/broll", "2-ASSETS/trilhas", "2-ASSETS/sfx", "3-EDITADOS", "4-ELEMENTOS/catalogo.json",
    "4-ELEMENTOS/VITRINE.html", "_SISTEMA/modelos/briefing.md", "_SISTEMA/modelos/ficha-revisao.md", "5-PROJETOS"])
    checa(fs.existsSync(path.join(R, p)), p);

  passo("2b. Versão (Julio ou aluno) e o que não pode vazar");
  const agents = fs.readFileSync(path.join(R, "AGENTS.md"), "utf8");
  const ehJulio = agents.includes("<!-- julio:inicio -->");
  const vazio = (rel, raiz = R) => !fs.existsSync(path.join(raiz, rel)) || fs.readdirSync(path.join(raiz, rel)).every((f) => f === ".gitkeep" || f === ".DS_Store");
  const checaModelo = (M, nome) => {
    checa(!fs.existsSync(path.join(M, "0-MARCA/MANUAL-DA-MARCA.md")), `${nome}: sem MANUAL-DA-MARCA do Julio (o aluno cria o dele)`);
    checa(["0-MARCA/assets", "1-MATERIAIS-PARA-EDITAR", "3-EDITADOS", "5-PROJETOS", "2-ASSETS/sfx", "2-ASSETS/imagens"].every((d) => vazio(d, M)), `${nome}: pastas de trabalho vazias`);
    checa(!fs.readFileSync(path.join(M, "AGENTS.md"), "utf8").includes("julio:inicio"), `${nome}: AGENTS.md sem o bloco pessoal`);
    checa(!fs.existsSync(path.join(M, "_SISTEMA/moodboards")) && !fs.existsSync(path.join(M, "_SISTEMA/ferramentas/atualizar-modelo.mjs")), `${nome}: sem ferramentas de autor`);
    checa(fs.existsSync(path.join(M, "0-MARCA/exemplo-julio/MANUAL-DA-MARCA.md")), `${nome}: exemplo de marca presente`);
  };
  if (ehJulio) {
    console.log("  (versão do Julio)");
    const man = path.join(R, "0-MARCA/MANUAL-DA-MARCA.md");
    checa(fs.existsSync(man) && fs.readFileSync(man, "utf8").includes("## Preferências de edição"), "MANUAL-DA-MARCA preenchido, com Preferências de edição");
    checa(fs.existsSync(path.join(R, "_SISTEMA/moodboards/GUIA-ESTILOS.md")), "fonte dos elementos em _SISTEMA/moodboards");
    const M = path.resolve(R, "..", "MODELO-ALUNO");
    if (fs.existsSync(M)) checaModelo(M, "MODELO-ALUNO");
    else console.log("  · MODELO-ALUNO ainda não gerado (npm run atualizar-modelo)");
  } else {
    console.log("  (versão do aluno)");
    checaModelo(R, "esta pasta");
  }

  passo("2c. Pronto para o GitHub");
  for (const f of ["README.md", "LICENSE", "CHANGELOG.md", "instalar-rapido.sh", ".gitignore", "_SISTEMA/ferramentas/atualizar.mjs"]) checa(fs.existsSync(path.join(R, f)), f);
  const gi = fs.readFileSync(path.join(R, ".gitignore"), "utf8");
  checa(["0-MARCA/MANUAL-DA-MARCA.md", "0-MARCA/assets/*", "1-MATERIAIS-PARA-EDITAR/*", "3-EDITADOS/*", "5-PROJETOS/*", "_SISTEMA/skills/meus-estilos/*", "!**/.gitkeep"].every((l) => gi.includes(l)), ".gitignore protege marca, brutos, editados, projetos e estilos do aluno");
  const pkgV = JSON.parse(fs.readFileSync(path.join(R, "package.json"), "utf8"));
  checa(/^\d+\.\d+\.\d+$/.test(pkgV.version || "") && pkgV.scripts?.atualizar, `versão ${pkgV.version} e npm run atualizar`);
  const varrer = (raiz) => {
    const achados = [];
    const andar = (d) => { for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      if ([".git", "node_modules", ".claude", ".agents", "_fontes", "moodboards", "1-MATERIAIS-PARA-EDITAR", "2-ASSETS", "3-EDITADOS", "5-PROJETOS", "meus-estilos"].includes(e.name)) continue;
      const p = path.join(d, e.name);
      if (e.isDirectory()) andar(p);
      else if (/\.(md|mjs|js|sh|json|html)$/.test(e.name) && e.name !== "testar.mjs" && !p.includes("exemplo-apple") && fs.statSync(p).size < 2e6 && /\/Users\/julioneto|CONTEUDO-EDIT/.test(fs.readFileSync(p, "utf8"))) achados.push(path.relative(raiz, p));
    } };
    andar(raiz); return achados;
  };
  const modeloP = ehJulio ? path.resolve(R, "..", "MODELO-ALUNO") : R;
  if (fs.existsSync(modeloP)) { const v = varrer(modeloP); checa(!v.length, "nenhum caminho do computador do Julio no que vai para o GitHub", v.join(", ")); }

  passo("3. Skills do curso");
  const skills = fs.readdirSync(path.join(R, "_SISTEMA/skills")).flatMap((c) => fs.readdirSync(path.join(R, "_SISTEMA/skills", c)).map((s) => [c, s]))
    .filter(([c, s]) => fs.existsSync(path.join(R, "_SISTEMA/skills", c, s, "SKILL.md")));
  const base = skills.filter(([c]) => c !== "meus-estilos");
  checa(base.length === 16, `${base.length} skills do curso (esperado 16)` + (skills.length > base.length ? ` + ${skills.length - base.length} em meus-estilos` : ""));
  for (const [c, s] of skills) {
    const md = fs.readFileSync(path.join(R, "_SISTEMA/skills", c, s, "SKILL.md"), "utf8");
    const nome = (md.match(/^name:\s*(.+)$/m) || [])[1]?.trim(), desc = (md.match(/^description:\s*(.+)$/m) || [])[1];
    const linkado = [".claude/skills", ".agents/skills"].every((d) => fs.existsSync(path.join(R, d, s, "SKILL.md")));
    checa(nome === s && desc && desc.length > 80 && linkado, `${c}/${s}`, nome !== s ? `name "${nome}" ≠ pasta` : !linkado ? "não está ligada em .claude/.agents (rode bash instalar.sh)" : "description curta");
  }
  let pessoais = "";
  try { pessoais = sh("grep", ["-rlE", "/Users/julioneto|CONTEUDO-EDIT|videos/reel-", path.join(R, "_SISTEMA/skills"), "--include=*.mjs", "--include=*.sh", "--include=SKILL.md"]).trim(); } catch { /* grep sai com 1 quando não acha nada */ }
  checa(!pessoais, "nenhum caminho do computador do Julio nas skills", pessoais);

  passo("4. Os 108 elementos");
  const cat = N.catalogoElementos();
  checa(cat.length === 108, `catalogo.json com ${cat.length} elementos`);
  const faltando = cat.filter((e) => !["preview.mp4", "poster.jpg", "elemento.html", "PEDIR.md"].every((f) => fs.existsSync(path.join(R, "4-ELEMENTOS", e.pasta, f))));
  checa(!faltando.length, "cada elemento tem preview, poster, código e PEDIR.md", faltando.map((e) => e.codigo).join(", "));
  checa(new Set(cat.map((e) => e.codigo)).size === 108, "códigos únicos");
  checa(cat.every((e) => e.pedir && e.oque), "todos com 'o que é' e 'você informa'");
  checa(fs.readFileSync(path.join(R, "4-ELEMENTOS/VITRINE.html"), "utf8").includes('"LEG-01"'), "VITRINE.html com o catálogo embutido");

  passo("5. Marca (aplicar-marca.mjs com uma marca fictícia)");
  const manual = fs.readFileSync(path.join(R, "0-MARCA/exemplo-julio/MANUAL-DA-MARCA.md"), "utf8")
    .replace('acento: "#F97316"', 'acento: "#22C55E"').replace('fundo: "#0A0A0A"', 'fundo: "#0B1020"').replace('"@juli0net0"', '"@marca.teste"');
  fs.writeFileSync(path.join(TMP, "manual.md"), manual);
  fs.mkdirSync(path.join(TMP, "marca"));
  for (const b of ["estilo-3d-camadas/assets/exemplo/beats/a-camadas.html", "estilo-minimalista-pontilhado/assets/capa-index.html"])
    fs.copyFileSync(path.join(R, "_SISTEMA/skills/estilos", b), path.join(TMP, "marca", path.basename(b)));
  const am = path.join(R, "_SISTEMA/skills/nucleo/configurar-marca/scripts/aplicar-marca.mjs");
  const saida = sh("node", [am, path.join(TMP, "marca"), `--manual=${path.join(TMP, "manual.md")}`]);
  const depois = fs.readFileSync(path.join(TMP, "marca/a-camadas.html"), "utf8") + fs.readFileSync(path.join(TMP, "marca/capa-index.html"), "utf8");
  checa(/troca/.test(saida) && !/#F97316|249,\s*115,\s*22/i.test(depois), "laranja do exemplo trocado pelo acento da marca (hex e rgba)");
  checa(depois.includes("@marca.teste") && !depois.includes("{{HANDLE}}"), "handle aplicado no lugar de {{HANDLE}}");
  const deNovo = sh("node", [am, path.join(TMP, "marca"), `--manual=${path.join(TMP, "manual.md")}`]);
  checa(/^0 troca/m.test(deNovo.split("\n").at(-2) || deNovo), "rodar de novo não troca nada (idempotente)", deNovo);

  passo("6. Painel (npm run hyperframes)");
  const porta = 3029;
  const srv = spawn(process.execPath, [path.join(R, "_SISTEMA/ferramentas/painel/servidor.mjs"), "--sem-abrir"], { env: { ...process.env, PORTA: String(porta) }, stdio: "ignore" });
  try {
    let est = null;
    for (let i = 0; i < 30 && !est; i++) { await new Promise((r) => setTimeout(r, 200)); est = await fetch(`http://localhost:${porta}/api/estado`).then((r) => r.json()).catch(() => null); }
    checa(est && Array.isArray(est.projetos), "painel responde (/api/estado)");
    const el = await fetch(`http://localhost:${porta}/api/elementos`).then((r) => r.json());
    checa(el.length === 108, "aba Elementos recebe os 108");
    const arq = await fetch(`http://localhost:${porta}/api/arquivos`).then((r) => r.json());
    checa(arq.marca && arq.materiais && arq.editados, "aba Criação lista marca, materiais e editados");
    const lista = await fetch(`http://localhost:${porta}/api/estilos`).then((r) => r.json());
    const doCurso = lista.filter((e) => e.grupo === "estilos");
    checa(lista.length >= 16 && lista.every((e) => e.comando.startsWith("/")), `aba Estilos com ${lista.length} comandos para copiar`);
    checa(doCurso.length === 7 && doCurso.every((e) => e.video && e.poster), "os 7 estilos do curso têm exemplo.mp4 e poster");
    const pag = await fetch(`http://localhost:${porta}/`).then((r) => r.text());
    checa(pag.includes("Painel de") && pag.includes("Catálogo") && pag.includes("Seus <em>comandos"), "página do painel carrega (com a aba Estilos)");
    const vid = await fetch(`http://localhost:${porta}/4-ELEMENTOS/${el[0].pasta}/preview.mp4`, { headers: { Range: "bytes=0-99" } });
    checa(vid.status === 206, "previews em vídeo servidos com Range (tocam no navegador)");
    if (!RAPIDO) {
      const c = await fetch(`http://localhost:${porta}/api/catalogo`).then((r) => r.json()).catch(() => []);
      checa(c.length > 300, `catálogo HyperFrames com ${c.length} itens`);
    }
  } finally { srv.kill(); }

  if (RAPIDO) return;

  passo("7. Projeto de ponta a ponta (cria, usa elemento, monta reel de teste, check)");
  const slug = "teste-automatico-framework";
  const P = path.join(R, "5-PROJETOS", slug);
  if (fs.existsSync(P)) { errado(`já existe 5-PROJETOS/${slug}; apague e rode de novo`); return; }
  try {
    await N.criarProjeto({ titulo: slug, formato: "9:16" });
    checa(fs.existsSync(path.join(P, "index.html")) && fs.existsSync(path.join(P, "BRIEF.md")), "npm run novo: projeto 9:16 com BRIEF e ELEMENTOS");
    N.usarElemento("LEG-01", slug);
    checa(fs.readFileSync(path.join(P, "ELEMENTOS.md"), "utf8").includes("LEG-01") && fs.existsSync(path.join(P, ".work/elementos/LEG-01/elemento.html")), "npm run usar: LEG-01 registrado no projeto");

    // material sintético: 6 s vertical com tom de voz, e palavras inventadas
    fs.mkdirSync(path.join(P, "assets"), { recursive: true }); fs.mkdirSync(path.join(P, ".work"), { recursive: true });
    sh("ffmpeg", ["-y", "-v", "error", "-f", "lavfi", "-i", "testsrc2=s=1080x1920:r=30:d=6", "-f", "lavfi", "-i", "sine=f=220:d=6", "-c:v", "libx264", "-pix_fmt", "yuv420p", "-c:a", "aac", "-shortest", path.join(P, "assets/limpo.mp4")]);
    const palavras = "não tem nada melhor do que ver uma automação rodando e funcionando lisinho".split(" ");
    fs.writeFileSync(path.join(P, ".work/words.json"), JSON.stringify(palavras.map((t, i) => ({ text: t, start: +(i * 0.42).toFixed(2), end: +(i * 0.42 + 0.38).toFixed(2) }))));
    const est = path.join(R, "_SISTEMA/skills/estilos/estilo-3d-camadas/assets/exemplo");
    sh("bash", [path.join(R, "_SISTEMA/skills/estilos/estilo-split-explicativo/assets/motor-curto/scaffold.sh"), P, path.join(est, "config.mjs")]);
    // o exemplo usa recorte; para o teste, sem recorte
    for (const f of fs.readdirSync(path.join(est, "beats"))) fs.copyFileSync(path.join(est, "beats", f), path.join(P, "compositions/beats", f));
    sh("npm", ["run", "build"], { cwd: P });
    checa(fs.readFileSync(path.join(P, "index.html"), "utf8").includes("a-camadas"), "motor curto montou o reel (estilo 3D camadas)");
    fs.writeFileSync(path.join(TMP, "manual-verde.md"), manual);
    sh("node", [am, P, `--manual=${path.join(TMP, "manual-verde.md")}`]);
    certo("marca fictícia aplicada no projeto");
    try {
      const out = sh("npx", ["--yes", N.HF, "check"], { cwd: P, env: { ...process.env, HYPERFRAMES_SKIP_SKILLS: "1" } });
      checa(/0 error/.test(out) || /Check passed/.test(out), "npx hyperframes check passou", out);
    } catch (e) { errado("npx hyperframes check", (e.stdout || "") + (e.stderr || "")); }
  } catch (e) {
    errado("projeto de teste", e.stderr || e.message);
  } finally {
    fs.rmSync(P, { recursive: true, force: true });
  }
}

main()
  .catch((e) => errado("erro inesperado", e.stack))
  .finally(() => {
    fs.rmSync(TMP, { recursive: true, force: true });
    console.log(`\n${falhas.length ? "\x1b[31m" : "\x1b[38;5;208m"}${ok} ok · ${falhas.length} falha(s)\x1b[0m`);
    if (falhas.length) { console.log("Falhas:\n- " + falhas.join("\n- ")); process.exitCode = 1; }
  });
