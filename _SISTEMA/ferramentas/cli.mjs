// Atalhos de terminal (o painel faz o mesmo com botões).
//   npm run editor -- <projeto>
//   npm run novo -- "Nome do vídeo" [9:16|16:9|1:1] [arquivo em 1-MATERIAIS-PARA-EDITAR]
//   npm run usar -- LEG-01 <projeto>
//   npm run catalogo -- legenda karaokê
//   npm run check -- <projeto>
//   npm run render -- <projeto> [draft|delivery]
import * as N from "./nucleo.mjs";

const [cmd, ...a] = process.argv.slice(2);
const precisa = (v, uso) => { if (!v) { console.log(`Uso: ${uso}`); process.exit(1); } return v; };

try {
  if (cmd === "editor") {
    const slug = a[0] || N.listarProjetos()[0]?.slug;
    precisa(slug, 'npm run editor -- <projeto>   (crie um com: npm run novo -- "Meu vídeo")');
    const { url } = await N.abrirEditor(slug, { abrirNavegador: true });
    console.log(`Editor aberto: ${url}  (Ctrl+C fecha)`);
    process.on("SIGINT", () => { N.fecharEditores(); process.exit(0); });
    await new Promise(() => {});
  } else if (cmd === "novo") {
    const { slug } = await N.criarProjeto({ titulo: precisa(a[0], 'npm run novo -- "Nome do vídeo" [9:16|16:9|1:1] [material]'), formato: a[1] || "9:16", material: a[2] || "" });
    console.log(`Projeto criado: 5-PROJETOS/${slug}\nAbra no editor: npm run editor -- ${slug}`);
  } else if (cmd === "usar") {
    const r = N.usarElemento(precisa(a[0], "npm run usar -- LEG-01 <projeto>"), precisa(a[1], "npm run usar -- LEG-01 <projeto>"), a.slice(2).join(" "));
    console.log(`${r.codigo} adicionado em 5-PROJETOS/${r.projeto}/ELEMENTOS.md`);
  } else if (cmd === "catalogo") {
    const q = a.join(" ").toLowerCase();
    const itens = (await N.catalogoHyperframes()).filter((i) => !q || [i.name, i.title, i.description, ...(i.tags || [])].join(" ").toLowerCase().includes(q));
    for (const i of itens.slice(0, 40)) console.log(`${i.name.padEnd(34)} ${i.type.padEnd(10)} ${i.title}`);
    console.log(`\n${itens.length} itens. Instalar num projeto: pelo painel (npm run hyperframes) ou: cd 5-PROJETOS/<p> && npx ${N.HF} add <nome>`);
  } else if (cmd === "check") {
    console.log(await N.check(precisa(a[0], "npm run check -- <projeto>")));
  } else if (cmd === "render") {
    const r = await N.render(precisa(a[0], "npm run render -- <projeto> [draft|delivery]"), { qualidade: a[1] || "draft" });
    console.log(`Pronto: ${r.arquivo}`);
  } else {
    console.log("Comandos: hyperframes (painel) · editor · novo · usar · catalogo · check · render");
  }
} catch (e) {
  console.error("Erro:", e.message);
  process.exit(1);
}
