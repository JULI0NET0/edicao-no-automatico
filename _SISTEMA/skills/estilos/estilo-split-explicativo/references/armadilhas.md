# Armadilhas conhecidas

Cada item abaixo custou tempo real no primeiro reel. Estão ordenados pelo estrago que fazem.

## Transcrição

**O padrão do CLI é `small.en`, um modelo só de inglês.** Com áudio em português ele "traduz" e devolve texto sem nexo (a primeira transcrição do reel da Apple saiu como "America's inclusive videos" com só 58 palavras). Sempre:

```bash
npx hyperframes@0.8.85 transcribe assets/bruto.mp4 --language pt --model medium --json
```

Na primeira vez o `medium` baixa ~1.5 GB e leva ~10 min; depois é rápido. Já existe `ggml-small.bin` (multilíngue) em `~/.cache/hyperframes/whisper/models/` — serve para rascunho, mas `medium` acertou nomes próprios (Apple Watch, iPad). **Depois de transcrever, leia o texto.** Se não faz sentido ou tem poucas palavras para o tempo do vídeo, o modelo errou.

Whisper às vezes inventa uma palavra no silêncio inicial (aqui foi um "A" em 0.01s). O `silencedetect` do ffmpeg é a verdade sobre onde a fala começa.

## Sincronia entre imagem e legenda

Corte com `transcript-cut.mjs --copy` **snapa em keyframe**: o vídeo saiu ~0.35s deslocado da fala e as animações ficaram adiantadas no preview. Para o arquivo que vai ao render, corte do original com `-ss` (script `preparar-fonte.sh`). Sempre confirme:

- `start_time` = 0 no vídeo e no áudio do `limpo.mp4`;
- o primeiro `silence_end` do `silencedetect` bate com o início da fala do `words.json` já deslocado.

Se houver cortes **internos** (não só cabeça/cauda), o `build-groups.mjs` precisa remapear os tempos por segmento — o script atual só aplica um `SHIFT` fixo. Ajuste antes de confiar nas legendas.

## HyperFrames / GSAP

- **`fromTo` em tween que começa depois do t=0 precisa de `immediateRender: false`.** Sem isso o estado inicial é aplicado no frame 0 e o elemento aparece antes da hora (anéis, traços, setas, selos apareciam "de fantasma"). Esconda também com `gsap.set(..., {opacity:0})`.
- **Letras que saem pela máscara continuam existindo.** O `check` acusa `content_overlap` e `text_occluded`. Depois de sair, `tl.set(letters, {opacity:0})`; antes de entrar, `opacity:0` inicial.
- **`<video>` com `data-start` dentro de wrapper que também tem `data-start`** é erro (`video_nested_in_timed_element`) e quebra a sincronia. Tempo só no `<video>`.
- **`z-index` negativo** é apagado por fundo opaco no root. Use 0 e ordem de DOM.
- **Elemento timed com filhos aninhados** (`nested_structure_needs_subcomposition`): vira sub-composição (foi assim com o grain/vinheta em `fx-overlay.html`).
- **Toda `<audio>` precisa de `id`**, senão o render sai mudo.
- **Fontes**: só as embutidas renderizam certo (Montserrat, League Gothic, Inter, Oswald…). Anton não. Veja `identidade-visual.md`.
- O componente do catálogo é **demo**: vem com 1920x1080, dados de exemplo e paleta própria. Leia o HTML, extraia a mecânica e refaça em 1080x1920 com a identidade do Julio — montar direto nunca funcionou.
- Contraste: texto branco sobre o vídeo sem plaquinha falha o WCAG. A legenda tem um radial escuro atrás de cada grupo (`.cc-group::before`) — não remova.

## Recorte do fundo e palco

- `remove-background` no 4K leva ~10–15 min (1476 frames, ~180ms cada) — rode em background e faça outra coisa. Use `--quality best` (o recorte é sobreposto ao próprio vídeo; qualidade menor deixa halo).
- Recorte só nos intervalos dos palcos; fora deles fica escondido. Arquivo de 349 MB para 49s.
- Texto direto atrás do sujeito na sala não funciona neste enquadramento. Use o palco de pôster.

## Magnific (imagens de produto)

- Modelo usado: `seedream-5-pro`, 2k, 1:1, ~100 créditos por imagem + 3 para `images_remove_background`. Nove imagens ≈ 930 créditos.
- **Sempre**: `simulate_cost` → uma imagem de teste → Julio aprova o estilo → lote. Não gere o lote de cara.
- Prompt-base: "Premium studio product render of <objeto>, angled three-quarters view, floating centered, soft cinematic key light from top left with subtle rim light, clean seamless light grey background, crisp reflections, hyper-detailed, **no logos, no text, no branding**".
- Gere todos em uma mesma rodada com o mesmo estilo (o "conjunto" precisa parecer conjunto). Depois tire o fundo de cada um.
- `account_balance` foi negado pelo classificador de permissões do modo automático — não dependa dele; use o `simulate_cost`.

## Trilha (HeyGen)

- Só o **Julio** consegue fazer o login: `npx hyperframes auth login` (OAuth no navegador). Peça e espere; não tente contornar. Confirme com `auth status`.
- O engine (`audio.mjs`) pega só o 1º resultado. `scripts/bgm-search.mjs` lista candidatos por score e baixa os 5 melhores em `.work/bgm-cand/` — escolha por descrição + duração (precisa cobrir o vídeo sem loop) e meça o volume por janelas com `volumedetect`.
- O `carve.mjs` (abre espaço na trilha sob a voz) precisa de `@hyperframes/core`, que não vem instalado. Instale **fora do projeto**:
  ```bash
  S=<scratchpad>/hfcore; mkdir -p $S && cd $S && npm i @hyperframes/core@0.8.85
  node ~/.claude/skills/hyperframes-audio/scripts/carve.mjs --comp index.html --bed bgm --voice voice --core $S
  ```
  O carve escreve **dentro do `index.html`**, que é gerado — ele seria perdido no próximo build. Depois de rodar, salve a tag `<audio id="bgm" …>` inteira em `.work/bgm.json` (`{"path", "volume", "tag"}`); o `build-v2.mjs` usa a `tag` verbatim quando ela existe.
- Trilha do Reel da Apple: candidato `c1` da busca "confident modern tech beat minimal", 57s, volume 0.12 (~−18 dB sob a voz).

## Render e áudio

- 4K = `--resolution portrait-4k`; a composição continua 1080x1920 e o Chrome supersampla. Não passe `--width/--height`.
- `--quality draft` serve para conferir mixagem; o final é `--quality delivery`.
- `loudnorm`: **em bash** o script `finalizar-4k.sh` funciona. Em zsh, `set -- $VAR` não separa palavras e o ffmpeg recebe uma string só (erro "Invalid chars"). Passe os valores medidos explicitamente ou use bash.
- Meta: −14 LUFS, pico −1 dBFS (padrão Instagram). Sem normalizar ficou −15.5/−16 LUFS e o reel soaria baixo no feed.

## Ambiente

- Porta 3002 costuma estar ocupada por outro preview (`claude-showreel`). Use `--port=3003` no `launch.json`.
- Clique na régua do Studio via automação não move o playhead de forma confiável; para conferir frames use `npx hyperframes snapshot --at t1,t2,…` e leia o `contact-sheet.jpg`.
- Se o `snapshot` ficar em `snapshots/`, apague antes de rodar de novo (`rm -f snapshots/*`), senão a contact sheet mistura execuções.

## Sincronia de legenda: os tempos do Whisper NÃO são confiáveis

No reel da automação (2026-09-30) a legenda ficou "dessincronizada" mesmo com áudio e vídeo alinhados (render × original: lag 0). Os tempos por palavra do Whisper (`medium`) erram de forma **irregular**: certos no começo, mas até 0,2–0,5s **atrasados** no meio do vídeo; e o DTW do `whisper-cli` (`--dtw medium -nfa`) devolveu tempos piores. Um deslocamento fixo (`CAPTION_LEAD`) não conserta erro que varia por trecho.

Receita que funcionou:
1. `npx hyperframes models install parakeet` (640 MB, ~12 min; peça OK antes) e `transcribe --engine parakeet --language pt`. O Parakeet acertou o meio/fim mas **errou o começo** (colocou "Não" em 1,12s com a fala começando em 0).
2. Compare os dois contra inícios de sílaba forte no áudio (picos de energia após uma queda, ≥5 dB em 30 ms). Use **Whisper onde ele bate, Parakeet onde ele bate** (híbrido por trecho), mantendo o texto/pontuação/índices do Whisper para não quebrar `EMPHASIS`.
3. Regrave `assets/transcript.json` com o híbrido, rode `build-groups.mjs` (limiar de pausa 0,32s para não gerar grupos de 1 palavra) e **reancore os cues dos beats, SFX e câmera nos mesmos tempos** — gráficos herdam o erro do Whisper.
4. `CAPTION_LEAD` pequeno (0,05s) e tweens de entrada rápidos (≤0,08s).

## Imagens fora da tela somem no render

`<img>` criado por JS e posicionado fora do quadro (strip de cards com `translateX`) sai **em branco** no render final, mesmo aparecendo no `snapshot`. Deixe as imagens estáticas no markup do beat, reduza a 1024px e embuta como data URI base64. Sempre confira frames do **arquivo renderizado**, não só o snapshot.
