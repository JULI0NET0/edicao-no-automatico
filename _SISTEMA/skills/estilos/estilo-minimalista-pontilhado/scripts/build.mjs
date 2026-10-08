import { readFileSync, writeFileSync } from "node:fs";
const w = readFileSync(".work/words.compact.json", "utf8").trim();
let t = readFileSync(".work/index.template.html", "utf8").replace("/*WORDS*/[]", w);
if (process.env.NOBGM) t = t.replace(/<audio id="bgm"[^>]*>\s*<\/audio>/, "");
writeFileSync("index.html", t);
console.log("index.html ok", process.env.NOBGM ? "(sem trilha)" : "");
