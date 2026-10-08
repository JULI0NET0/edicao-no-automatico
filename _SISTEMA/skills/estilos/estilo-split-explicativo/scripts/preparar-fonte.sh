#!/usr/bin/env bash
# Prepara a fonte de um reel: proxy 1080 (análise/preview), áudio p/ transcrição
# e o corte 4K frame-accurate.
#
# Uso: preparar-fonte.sh <bruto.MOV> <projeto> <inicio_s> <duracao_s>
#   ex: preparar-fonte.sh IMG_0433.MOV 5-PROJETOS/reel-x 0.35 49.2
#
# Por que assim:
#  - O iPhone grava 3840x2160 com metadado rotation=90; o ffmpeg auto-rotaciona,
#    então o resultado já sai em pé (2160x3840).
#  - O corte 4K sai do ORIGINAL com -ss (decodifica até o ponto, sem snap de
#    keyframe). Cortar com "copy" deixava a imagem ~0.35s fora da fala.
#  - g=30 mantém keyframe a cada segundo (scrub suave no Studio).
set -euo pipefail

BRUTO="${1:?bruto.MOV}"
PROJ="${2:?pasta do projeto hyperframes}"
INI="${3:?inicio em segundos}"
DUR="${4:?duracao em segundos}"

mkdir -p "$PROJ/assets/img" "$PROJ/.work"

echo "→ proxy 1080 (análise)"
ffmpeg -v error -y -i "$BRUTO" -map 0:v:0 -map 0:a:0 -vf "scale=1080:1920" -r 30 \
  -c:v libx264 -crf 16 -preset fast -g 30 -pix_fmt yuv420p -c:a aac -b:a 192k \
  -movflags +faststart "$PROJ/assets/bruto.mp4"

echo "→ áudio 16k mono (transcrição)"
ffmpeg -v error -y -i "$PROJ/assets/bruto.mp4" -vn -ac 1 -ar 16000 "$PROJ/.work/audio.wav"

echo "→ corte 4K a partir do original ($INI + ${DUR}s)"
ffmpeg -v error -y -ss "$INI" -i "$BRUTO" -t "$DUR" -map 0:v:0 -map 0:a:0 -r 30 \
  -c:v libx264 -crf 14 -preset slow -pix_fmt yuv420p -g 30 \
  -c:a aac -b:a 256k -movflags +faststart "$PROJ/assets/limpo.mp4"

ffprobe -v error -show_entries stream=codec_type,width,height,start_time,duration -of default=nw=1 "$PROJ/assets/limpo.mp4"
echo "ok — esperado: 2160x3840, start_time 0 no vídeo e no áudio"
