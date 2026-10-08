// Gera 4-ELEMENTOS/VITRINE.html com o catálogo embutido (abre por duplo clique, sem servidor).
// Uso: node _SISTEMA/ferramentas/gerar-vitrine.mjs   (rodar depois de gerar-elementos.mjs)
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const ELEM = path.join(RAIZ, "4-ELEMENTOS");
const catalogo = JSON.parse(fs.readFileSync(path.join(ELEM, "catalogo.json"), "utf8"));
const tpl = fs.readFileSync(path.join(RAIZ, "_SISTEMA/ferramentas/vitrine.template.html"), "utf8");
const dados = JSON.stringify(catalogo).replace(/</g, "\\u003c");
fs.writeFileSync(path.join(ELEM, "VITRINE.html"), tpl.replace("/*__CATALOGO__*/[]", dados));
console.log(`VITRINE.html com ${catalogo.length} elementos`);
