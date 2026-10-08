---
name: trilha-e-sfx
description: Coloca efeitos sonoros e trilha nos vídeos do framework Edição no Automático, abre espaço para a voz (carve/ducking) e mede a mixagem. Use quando o aluno pedir "coloca trilha", "música de fundo", "efeito sonoro", "whoosh", "a música está alta", ou na etapa de áudio de qualquer estilo.
---

# Trilha e SFX

## SFX
- **Onde estão:** `~/.claude/skills/media-use/audio/assets/sfx/` (vem com `npx hyperframes skills`; veja `manifest.json` e `CREDITS.md`) e os do aluno em `2-ASSETS/sfx/`. Copie os usados para `5-PROJETOS/<slug>/assets/sfx/`.
- **Regra:** um som por evento visual (card entrou, número travou, transição), nunca som sem imagem. Volume 0.22–0.4; impactos graves só na virada.
- **Kit básico:** `whoosh`/`whoosh-short` (entradas e transições), `pop` (cards), `click-soft` (UI), `ping` (destaque), `impact-bass-1` (virada), `sparkle` (revelação).
- No motor curto, liste em `SFX` do `.work/config.mjs` como `[arquivo, tempo, volume]`.

## Trilha
Ordem de preferência:
1. **Trilha do aluno** em `2-ASSETS/trilhas/` (licenciada).
2. **Biblioteca HeyGen** via HyperFrames: o aluno faz `npx hyperframes auth login` (só ele pode), depois `node _SISTEMA/skills/estilos/estilo-split-explicativo/scripts/bgm-search.mjs` (edite as `queries`; só candidatos ≥ duração do vídeo).
3. **Sem trilha** e o aluno aplica a música no próprio Instagram. Pergunte; não decida sozinho.

Ofereça 2–3 opções em rascunho e deixe o aluno escolher de ouvido.

## Mixagem
- Trilha em `assets/bgm/track.mp3`, com fade in/out e `data-volume` ~0.1–0.25.
- **Carve:** abre espaço na trilha sob a fala. Passo a passo em `_SISTEMA/skills/estilos/estilo-split-explicativo/references/armadilhas.md`, seção Trilha (skill `hyperframes-audio` para os detalhes de `data-fx-carve`).
- Meça no rascunho: `ffmpeg -i renders/rascunho.mp4 -af ebur128 -f null -`. A voz precisa ficar clara; o final é normalizado a −14 LUFS pelo `finalizar-4k.sh`.
- Estilo minimalista: entregue também a versão **sem trilha**.
