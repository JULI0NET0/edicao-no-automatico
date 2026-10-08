#!/usr/bin/env bash
# Render final 4K + normalização de áudio para -14 LUFS (padrão Instagram).
#
# Uso: finalizar-4k.sh <projeto> [nome-do-arquivo]
#   gera <projeto>/renders/<nome>-master.mp4 e <nome>-final.mp4
#
# - `--resolution portrait-4k` supersampla via deviceScaleFactor: o layout de
#   1080x1920 fica intacto e o vídeo/recorte precisam ser 4K de verdade.
# - Render leva ~4-5 min para 50s (8 workers). Rode em background.
# - Vídeo é copiado (sem re-encode); só o áudio passa pelo loudnorm de 2 passes.
set -euo pipefail

PROJ="${1:?pasta do projeto}"
NOME="${2:-$(basename "$PROJ")}"
RAIZ="$(cd "$(dirname "$0")/../../../../.." && pwd)"
cd "$PROJ"
# resolução 4K pelo formato da composição (9:16, 16:9 ou 1:1)
W=$(grep -o 'data-width="[0-9]*"' index.html | head -1 | grep -o '[0-9]*'); H=$(grep -o 'data-height="[0-9]*"' index.html | head -1 | grep -o '[0-9]*')
if [ "$H" -gt "$W" ]; then RES=portrait-4k; elif [ "$W" -gt "$H" ]; then RES=landscape-4k; else RES=square-4k; fi
mkdir -p renders

echo "→ check"
npx --yes hyperframes@0.8.94 check | tail -4

echo "→ render 4K (delivery)"
npx --yes hyperframes@0.8.94 render --resolution "$RES" --quality delivery \
  -o "renders/${NOME}-master.mp4" --quiet >/dev/null 2>&1

echo "→ loudnorm passo 1 (medir)"
JSON="$(ffmpeg -hide_banner -nostats -i "renders/${NOME}-master.mp4" -vn \
  -af loudnorm=I=-14:TP=-1:LRA=11:print_format=json -f null /dev/null 2>&1 | sed -n '/^{/,/^}/p')"

AF="$(printf '%s' "$JSON" | python3 -c "
import json,sys
d=json.load(sys.stdin)
print('loudnorm=I=-14:TP=-1:LRA=11:measured_I=%s:measured_TP=%s:measured_LRA=%s:measured_thresh=%s:offset=%s:linear=true'
      % (d['input_i'],d['input_tp'],d['input_lra'],d['input_thresh'],d['target_offset']))")"

echo "→ loudnorm passo 2 (aplicar, vídeo em copy)"
ffmpeg -v error -y -i "renders/${NOME}-master.mp4" -c:v copy -af "$AF" \
  -ar 48000 -c:a aac -b:a 320k -movflags +faststart "renders/${NOME}-final.mp4"

echo "→ verificação"
ffprobe -v error -show_entries stream=codec_type,width,height:format=duration -of default=nw=1 "renders/${NOME}-final.mp4"
ffmpeg -hide_banner -nostats -i "renders/${NOME}-final.mp4" -vn -af ebur128=peak=true -f null /dev/null 2>&1 \
  | grep -A14 Summary | grep -E "I:|Peak:"
ls -la "renders/${NOME}-final.mp4"

mkdir -p "$RAIZ/3-EDITADOS"
cp "renders/${NOME}-final.mp4" "$RAIZ/3-EDITADOS/${NOME}.mp4"
echo "→ entregue em 3-EDITADOS/${NOME}.mp4"
