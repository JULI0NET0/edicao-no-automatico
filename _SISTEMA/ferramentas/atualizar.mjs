// Recebe as novidades do curso sem mexer nos seus arquivos.
// Uso: npm run atualizar
// Marca, brutos, assets, editados, projetos e os seus estilos estão no .gitignore: o git não toca neles.
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { RAIZ } from "./nucleo.mjs";

const git = (...a) => execFileSync("git", a, { cwd: RAIZ, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] }).trim();
const versao = () => JSON.parse(fs.readFileSync(path.join(RAIZ, "package.json"), "utf8")).version || "?";

if (!fs.existsSync(path.join(RAIZ, ".git"))) {
  console.log("Esta pasta não foi instalada pelo GitHub, então não dá para atualizar automaticamente.\nInstale de novo com o comando do README (seus arquivos ficam onde estão: copie 0-MARCA, 1-…, 2-…, 3-…, 5-PROJETOS e _SISTEMA/skills/meus-estilos para a pasta nova).");
  process.exit(1);
}

const antes = versao();
const alterados = git("status", "--porcelain", "--untracked-files=no");
if (alterados) {
  console.log("Você alterou arquivos do sistema do curso (não os seus vídeos):\n" + alterados.split("\n").map((l) => "  " + l).join("\n"));
  console.log("\nPara não perder essas mudanças, a atualização parou aqui. Se não precisa delas:\n  git checkout -- .   (desfaz só as mudanças nesses arquivos)\ne rode `npm run atualizar` de novo.");
  process.exit(1);
}

console.log("→ Buscando novidades…");
try {
  const saida = git("pull", "--ff-only");
  if (/Already up to date|Já está atualizado/i.test(saida)) { console.log(`Você já está na versão mais nova (${antes}).`); process.exit(0); }
} catch (e) {
  console.log("Não deu para atualizar:\n" + (e.stderr || e.message));
  process.exit(1);
}

console.log("→ Religando as skills");
execFileSync("bash", ["-c", 'for alvo in .claude/skills .agents/skills; do mkdir -p "$alvo"; for s in _SISTEMA/skills/*/*/; do n="$(basename "$s")"; [ -f "$s/SKILL.md" ] || continue; ln -sfn "../../${s%/}" "${alvo:?}/${n:?}"; done; done'], { cwd: RAIZ });

const depois = versao();
console.log(`\nAtualizado: ${antes} → ${depois}`);
const log = path.join(RAIZ, "CHANGELOG.md");
if (fs.existsSync(log)) {
  const txt = fs.readFileSync(log, "utf8");
  const ini = txt.indexOf(`## ${depois}`), fim = txt.indexOf(`## ${antes}`);
  if (ini >= 0) console.log("\nNovidades:\n" + txt.slice(ini, fim > ini ? fim : undefined).trim());
}
console.log("\nSe o Claude Code estava aberto, abra uma nova sessão para ver as skills novas.");
