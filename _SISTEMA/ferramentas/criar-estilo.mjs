// Cria a pasta de uma skill de estilo a partir de um projeto aprovado.
// Uso: npm run criar-estilo -- <projeto> <nome>     (nome sem o prefixo "estilo-")
// Gera _SISTEMA/skills/meus-estilos/estilo-<nome>/ com exemplo.mp4, poster, cópia do projeto e um SKILL.md rascunho,
// e liga a skill em .claude/skills e .agents/skills. O texto final do SKILL.md é escrito pela skill criar-estilo.
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { RAIZ, PASTAS, slugify } from "./nucleo.mjs";

export function criarEstilo(projeto, nomeBruto) {
  const slug = slugify(projeto);
  const P = path.join(PASTAS.projetos, slug);
  if (!slug || !fs.existsSync(path.join(P, "index.html"))) throw new Error(`Projeto não encontrado: ${projeto}`);
  const nome = "estilo-" + slugify(String(nomeBruto || "").replace(/^estilo-/, ""));
  if (nome === "estilo-") throw new Error("Dê um nome ao estilo (ex.: podcast-cortes).");
  const existentes = fs.readdirSync(path.join(RAIZ, "_SISTEMA/skills"), { withFileTypes: true })
    .filter((d) => d.isDirectory()).flatMap((d) => fs.readdirSync(path.join(RAIZ, "_SISTEMA/skills", d.name)));
  if (existentes.includes(nome)) throw new Error(`Já existe uma skill chamada ${nome}.`);

  const D = path.join(RAIZ, "_SISTEMA/skills/meus-estilos", nome);
  const EX = path.join(D, "assets/exemplo");
  fs.mkdirSync(path.join(EX, "projeto"), { recursive: true });

  // cópia leve do projeto (sem mídia pesada nem renders)
  const copiar = (rel) => {
    const de = path.join(P, rel);
    if (!fs.existsSync(de)) return;
    fs.cpSync(de, path.join(EX, "projeto", rel), { recursive: true, filter: (f) => !/\.(mp4|mov|webm|m4a|wav|mp3)$/i.test(f) || f.includes("/sfx/") });
  };
  for (const rel of ["index.html", "compositions", ".work/config.mjs", "STORYBOARD.md", "BRIEF.md", "ELEMENTOS.md", "meta.json"]) copiar(rel);

  // exemplo.mp4 a partir do render mais recente
  const renders = fs.existsSync(path.join(P, "renders"))
    ? fs.readdirSync(path.join(P, "renders")).filter((f) => /\.mp4$/i.test(f)).map((f) => path.join(P, "renders", f)).sort((a, b) => fs.statSync(b).mtimeMs - fs.statSync(a).mtimeMs)
    : [];
  let exemplo = "";
  if (renders[0]) {
    exemplo = path.join(EX, "exemplo.mp4");
    execFileSync("ffmpeg", ["-y", "-v", "error", "-i", renders[0], "-t", "30", "-vf", "scale=-2:1280:flags=lanczos", "-c:v", "libx264", "-crf", "26", "-preset", "slow", "-c:a", "aac", "-b:a", "96k", "-movflags", "+faststart", exemplo]);
    execFileSync("ffmpeg", ["-y", "-v", "error", "-ss", "1.5", "-i", exemplo, "-frames:v", "1", "-q:v", "4", path.join(EX, "poster.jpg")]);
  }

  const titulo = String(nomeBruto).replace(/^estilo-/, "").replace(/-/g, " ");
  fs.writeFileSync(path.join(D, "SKILL.md"), `---
name: ${nome}
description: Estilo "${titulo}" criado a partir do projeto ${slug} no framework Edição no Automático. RASCUNHO — a skill criar-estilo reescreve esta descrição com o visual aprovado e as frases que o aluno usaria para pedir.
---

# Estilo: ${titulo}

> Rascunho gerado por \`npm run criar-estilo\`. Complete com a skill \`criar-estilo\`.

**Exemplo:** ${exemplo ? "`assets/exemplo/exemplo.mp4`" : "(sem render: renderize o projeto e rode de novo)"} · projeto de referência em \`assets/exemplo/projeto/\`.

## Contrato do framework
Marca e **Preferências de edição** do \`0-MARCA/MANUAL-DA-MARCA.md\` valem mais que esta skill. Portões de aprovação: cortes → plano visual → imagens pagas → rascunho → 4K.

## Layout
## Elementos
## Ritmo
## Áudio
## Aprovações e correções do aluno
## Fluxo
1. \`preparar-projeto\` → \`limpar-bruto\`
2. Montar a partir de \`assets/exemplo/projeto/\`
3. \`node _SISTEMA/skills/nucleo/configurar-marca/scripts/aplicar-marca.mjs 5-PROJETOS/<slug>\`
4. \`revisar-e-entregar\`
`);

  for (const alvo of [".claude/skills", ".agents/skills"]) {
    fs.mkdirSync(path.join(RAIZ, alvo), { recursive: true });
    const link = path.join(RAIZ, alvo, nome);
    try { fs.unlinkSync(link); } catch {}
    fs.symlinkSync(`../../_SISTEMA/skills/meus-estilos/${nome}`, link);
  }
  return { nome, pasta: path.relative(RAIZ, D), exemplo: !!exemplo, comando: `/${nome}` };
}

if (process.argv[1] && process.argv[1].endsWith("criar-estilo.mjs")) {
  const [projeto, nome] = process.argv.slice(2);
  if (!projeto || !nome) { console.log("Uso: npm run criar-estilo -- <projeto> <nome>   (ex.: npm run criar-estilo -- reel-automacao dica-rapida)"); process.exit(1); }
  try {
    const r = criarEstilo(projeto, nome);
    console.log(`Estilo criado: ${r.pasta}\nComando: ${r.comando} edita o <arquivo>\n${r.exemplo ? "" : "Atenção: o projeto não tem render; o exemplo.mp4 não foi gerado.\n"}Agora peça ao Claude: "completa a skill ${r.nome}" (skill criar-estilo).`);
  } catch (e) { console.error("Erro:", e.message); process.exit(1); }
}
