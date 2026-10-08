// Gera 4-ELEMENTOS/ a partir dos 9 moodboards.
// Para cada célula: preview.mp4 (recorte do render), poster.jpg, elemento.html (célula isolada) e PEDIR.md.
// Também escreve catalogo.json, usado pela VITRINE.html e pela skill escolher-elementos.
//
// Uso: node _SISTEMA/ferramentas/gerar-elementos.mjs [--sem-video]
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const VIDEOS = path.join(RAIZ, "_SISTEMA", "moodboards");
const ELEM = path.join(RAIZ, "4-ELEMENTOS");
const FONTES = path.join(ELEM, "_fontes");
const GUIA = fs.readFileSync(path.join(VIDEOS, "GUIA-ESTILOS.md"), "utf8");
const SEM_VIDEO = process.argv.includes("--sem-video");

// número do moodboard no GUIA → pasta, prefixo e categoria
const MOODBOARDS = [
  { n: 1, pasta: "moodboard-estilos", pre: "ANI", cat: "Animação" },
  { n: 2, pasta: "moodboard-templates", pre: "TPL", cat: "Templates e mockups" },
  { n: 3, pasta: "moodboard-legendas", pre: "LEG", cat: "Legendas" },
  { n: 4, pasta: "moodboard-transicoes", pre: "TRA", cat: "Transições" },
  { n: 5, pasta: "moodboard-camera", pre: "CAM", cat: "Câmera e footage" },
  { n: 6, pasta: "moodboard-papel", pre: "PAP", cat: "Doodle, papel e textura" },
  { n: 7, pasta: "moodboard-3d", pre: "3DV", cat: "3D e VFX" },
  { n: 8, pasta: "moodboard-dados", pre: "DAD", cat: "Carrosséis, dados e mapas" },
  { n: 9, pasta: "moodboard-fechamento", pre: "FEC", cat: "Prova social e fechamento" },
];

// Contextos: tabela "## Contextos" do GUIA (coluna Moodboards → números)
const CONTEXTOS = {
  "Reel do Julio falando pra câmera": "reel-falando",
  "Vídeo só com a voz (minimalista)": "so-voz",
  "Cliente da agência": "cliente",
  "Aula da Bruna": "aula",
  "Aula do Rubens": "aula",
  "Anúncio, produto ou lançamento": "anuncio",
};
const ctxPorMb = {};
for (const linha of GUIA.split("## Contextos")[1].split("## ")[0].split("\n")) {
  const c = linha.split("|").map((s) => s.trim());
  if (c.length < 5 || !CONTEXTOS[c[1]]) continue;
  for (const num of c[3].match(/\d+/g) || []) (ctxPorMb[num] ||= new Set()).add(CONTEXTOS[c[1]]);
}

// Linhas das tabelas do GUIA por moodboard
function linhasGuia(pasta) {
  const i = GUIA.indexOf("`videos/" + pasta + "`");
  const bloco = GUIA.slice(i).split("\n## ")[0];
  const rows = {};
  for (const l of bloco.split("\n")) {
    const c = l.split("|").map((s) => s.trim());
    if (/^\d{2}$/.test(c[1] || "")) rows[c[1]] = { estilo: c[2], base: c[3].replace(/`/g, ""), oque: c[4], pedir: c[5] };
  }
  return rows;
}

const slug = (s) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

// Célula isolada: só a célula NN roda, palco 445×300, caminhos apontando para _fontes/<pasta>/
function isolar(html, pasta, nn) {
  let h = html
    .replace(/^.*class="hd2?".*\n/gm, "")
    .replace(/data-width="1920" data-height="1080"/, 'data-width="445" data-height="300"')
    .replace(/content="width=1920, height=1080"/, 'content="width=445, height=300"')
    .replace(/el\.style\.left = 40 \+ \(i % 4\) \* 465 \+ "px"; el\.style\.top = 100 \+ Math\.floor\(i \/ 4\) \* 320 \+ "px";/, 'el.style.left = "0px"; el.style.top = "0px";')
    .replace(/<\/head>/, '  <style>#root { width: 445px !important; height: 300px !important; }</style>\n  </head>')
    .replace(/(\n\s*)const fns = cells\.map/, `$1cells.splice(0, cells.length, ...cells.filter((c) => c.n === "${nn}"));$1const fns = cells.map`)
    .replace(/(["'`(])(assets|compositions)\//g, `$1../_fontes/${pasta}/$2/`)
    // aberto direto no navegador, roda em loop; dentro do HyperFrames (iframe/render) segue pausado
    .replace(/window\.__timelines\["main"\] = tl;/, '(window.__timelines ||= {})["main"] = tl;\n      if (window.self === window.top && !navigator.webdriver) tl.repeat(-1).play();');
  h = h.replace(/<title>[^<]*<\/title>/, (t) => t.replace(/>.*</, `>${pasta} · célula ${nn}<`));
  return h;
}

const catalogo = [];
for (const mb of MOODBOARDS) {
  const fonte = path.join(FONTES, mb.pasta, "index.html");
  const html = fs.readFileSync(fonte, "utf8");
  const guia = linhasGuia(mb.pasta);
  const render = path.join(VIDEOS, mb.pasta, "renders", mb.pasta + ".mp4");
  const cells = [...html.matchAll(/cell\("(\d{2})", "([^"]*)", "([^"]*)"/g)];
  cells.forEach(([, nn, nome, tech], i) => {
    const g = guia[nn] || {};
    const codigo = `${mb.pre}-${nn}`;
    const titulo = g.estilo || nome;
    const dir = `${codigo}-${slug(titulo)}`;
    const abs = path.join(ELEM, dir);
    fs.mkdirSync(abs, { recursive: true });
    fs.writeFileSync(path.join(abs, "elemento.html"), isolar(html, mb.pasta, nn));

    const x = 40 + (i % 4) * 465, y = 100 + Math.floor(i / 4) * 320;
    if (!SEM_VIDEO) {
      const crop = `crop=445:260:${x}:${y}`;
      execFileSync("ffmpeg", ["-y", "-v", "error", "-ss", "0", "-t", "4", "-i", render, "-vf", `${crop},scale=890:520:flags=lanczos`, "-an", "-c:v", "libx264", "-crf", "23", "-pix_fmt", "yuv420p", "-movflags", "+faststart", path.join(abs, "preview.mp4")]);
      execFileSync("ffmpeg", ["-y", "-v", "error", "-ss", "2", "-i", render, "-frames:v", "1", "-vf", `${crop},scale=890:520:flags=lanczos`, "-q:v", "4", path.join(abs, "poster.jpg")]);
    }

    const pedido = `usa ${codigo} (${titulo})` + (g.pedir ? ` — ${g.pedir}` : "");
    fs.writeFileSync(
      path.join(abs, "PEDIR.md"),
      `# ${codigo} · ${titulo}\n\n` +
        `**Categoria:** ${mb.cat}\n**O que é:** ${g.oque || "—"}\n**Base no catálogo HyperFrames:** \`${g.base || tech}\`\n\n` +
        `## O que você informa\n${g.pedir || "—"}\n\n` +
        `## Pedido pronto\n\`\`\`text\n${pedido}\n\`\`\`\n\n` +
        `## Arquivos\n- \`preview.mp4\`: como fica (cores do moodboard; no seu vídeo entram as cores do MANUAL-DA-MARCA).\n- \`elemento.html\`: código isolado da célula. Abra no navegador para ver rodando.\n- Fonte completa: \`4-ELEMENTOS/_fontes/${mb.pasta}/index.html\`, célula ${nn}.\n`,
    );

    catalogo.push({
      codigo, nome: titulo, categoria: mb.cat, prefixo: mb.pre,
      contextos: [...(ctxPorMb[mb.n] || [])],
      oque: g.oque || "", pedir: g.pedir || "", base: g.base || tech,
      pasta: dir, fonte: `_fontes/${mb.pasta}/index.html#${nn}`,
    });
  });
  console.log(`${mb.pre}: ${cells.length} elementos`);
}
fs.writeFileSync(path.join(ELEM, "catalogo.json"), JSON.stringify(catalogo, null, 2));
console.log(`total: ${catalogo.length}`);
