#!/bin/bash
# Prepara um projeto do framework para o motor curto (reels de 5–15 s).
# Uso (da raiz do framework): bash _SISTEMA/skills/estilos/estilo-split-explicativo/assets/motor-curto/scaffold.sh 5-PROJETOS/<slug> [config-de-exemplo.mjs]
# Pré-requisitos no projeto: assets/limpo.mp4 (preparar-fonte.sh) e .work/words.json (build-groups.mjs).
set -e
P="$1"; CFG="$2"
AQUI="$(cd "$(dirname "$0")" && pwd)"
[ -d "$P" ] || { echo "Projeto não existe: $P"; exit 1; }
mkdir -p "$P/compositions/beats" "$P/.work" "$P/renders" "$P/assets/sfx" "$P/assets/bgm" "$P/assets/img"
cp "$AQUI/fx-overlay.html" "$P/compositions/"
# SFX: biblioteca da skill media-use (vem com `npx hyperframes skills`) + os do aluno em 2-ASSETS/sfx
SFX="$HOME/.claude/skills/media-use/audio/assets/sfx"
[ -d "$SFX" ] && cp -n "$SFX"/*.mp3 "$P/assets/sfx/" 2>/dev/null || true
RAIZ="$(cd "$AQUI/../../../../../.." && pwd)"
[ -d "$RAIZ/2-ASSETS/sfx" ] && cp -n "$RAIZ/2-ASSETS/sfx/"*.mp3 "$P/assets/sfx/" 2>/dev/null || true
[ -n "$CFG" ] && [ ! -f "$P/.work/config.mjs" ] && cp "$CFG" "$P/.work/config.mjs"
# atalho: npm run build dentro do projeto
node -e '
const fs=require("fs"),p=process.argv[1]+"/package.json",j=JSON.parse(fs.readFileSync(p));
j.scripts.build="node "+require("path").relative(process.argv[1],process.argv[2]+"/build.mjs");
fs.writeFileSync(p,JSON.stringify(j,null,2));' "$P" "$AQUI"
[ -f "$P/assets/limpo.mp4" ] || echo "Atenção: falta assets/limpo.mp4 (rode preparar-fonte.sh)."
[ -f "$P/.work/words.json" ] || echo "Atenção: falta .work/words.json (rode build-groups.mjs)."
echo "ok: $P  →  edite .work/config.mjs, crie compositions/beats/<id>.html e rode: (cd $P && npm run build)"
