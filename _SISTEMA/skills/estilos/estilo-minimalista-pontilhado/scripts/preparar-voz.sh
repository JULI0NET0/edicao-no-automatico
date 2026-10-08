#!/usr/bin/env bash
# Prepara a locução para o estilo minimalista conceitual.
#
#   preparar-voz.sh trim   <voz.m4a> <saida.wav> <velocidade> <ini:fim,ini:fim,...>
#       Concatena só os trechos mantidos (cortando pausas longas / respiração inicial)
#       e acelera com atempo (preserva o tom). Ex.: 1.22  "0.45:5.28,5.56:8.11,8.12:38.95"
#
#   preparar-voz.sh polish <voz-isolada.(wav|mp3)> <saida.m4a> [silenciar_ate_s]
#       Filtro anti-sopro sobre a voz já isolada pela IA: corta graves, de-esser,
#       reduz a faixa do "ar" (~6,5 kHz) e silencia o sopro antes da 1ª palavra.
#
# Entre os dois passos, a voz acelerada passa pelo isolamento de voz da Magnific (MCP
# audio_isolate, ~128 créditos) — ver SKILL.md, passo 3.
set -euo pipefail
modo="${1:?trim|polish}"
case "$modo" in
trim)
  IN="${2:?}"; OUT="${3:?}"; SP="${4:?}"; SEGS="${5:?}"
  F=""; N=0; LBL=""
  IFS=',' read -ra ARR <<< "$SEGS"
  for seg in "${ARR[@]}"; do
    a="${seg%%:*}"; b="${seg##*:}"
    F+="[0:a]atrim=${a}:${b},asetpts=N/SR/TB[s${N}];"; LBL+="[s${N}]"; N=$((N+1))
  done
  F+="${LBL}concat=n=${N}:v=0:a=1,atempo=${SP}[v]"
  ffmpeg -v error -y -i "$IN" -filter_complex "$F" -map "[v]" -ar 48000 "$OUT"
  ffprobe -v error -show_entries format=duration -of csv=p=0 "$OUT"
  ;;
polish)
  IN="${2:?}"; OUT="${3:?}"; MUTE="${4:-0.36}"
  ffmpeg -v error -y -i "$IN" -af "highpass=f=90,deesser=i=0.5:m=0.5:f=0.5,equalizer=f=6500:t=q:w=1.2:g=-3,volume=0:enable='lt(t,${MUTE})',afade=t=in:st=${MUTE}:d=0.07" -ar 48000 -c:a aac -b:a 256k "$OUT"
  ;;
*) echo "modo inválido"; exit 1;;
esac
