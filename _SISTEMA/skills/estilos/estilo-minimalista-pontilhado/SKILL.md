---
name: estilo-minimalista-pontilhado
description: Estilo "minimalista conceitual" do framework Edição no Automático — vídeo vertical 100% animado, sem a pessoa na tela, só a voz (áudio solto ou roteiro), com cada frase virando uma metáfora feita de PONTOS (matriz de pontos, contornos pontilhados, morph de partículas entre cenas), fundo da marca, acento só na ideia-chave, legenda de 2–3 palavras com a palavra-chave em serifa itálica. Use quando o aluno mandar um áudio/roteiro e pedir "minimalista", "conceitual", "pontilhado", "animação com a minha voz", "vídeo sem eu aparecer", mesmo sem citar a skill. Pessoa falando na câmera → estilo-split-explicativo.
---

# Estilo: minimalista pontilhado

Transforma **uma locução solta** (áudio ou roteiro) em um vídeo vertical 100% animado: cada frase vira uma **metáfora desenhada em pontos**, o mesmo enxame de pontos se reorganiza de uma cena para a outra, legenda curta por cima. O exemplo é o vídeo "IA e emprego" (35 s), feito na marca do Julio Neto: assista `assets/exemplo-ia-emprego/exemplo.mp4`; o projeto está em `assets/exemplo-ia-emprego/` e a prancha visual em `assets/moodboard-referencia.png`.

## Contrato do framework
Siga o "Contrato do framework" de `_SISTEMA/skills/estilos/estilo-split-explicativo/SKILL.md`: marca e **Preferências de edição** do `0-MARCA/MANUAL-DA-MARCA.md` (sem ele → `configurar-marca`; as preferências valem mais que o padrão da skill), áudio em `1-MATERIAIS-PARA-EDITAR/`, projeto em `5-PROJETOS/<slug>/`, entrega em `3-EDITADOS/`, portões de aprovação. Nos templates, `{{HANDLE}}` e as cores do exemplo são trocados pelo `aplicar-marca.mjs`.

## Kit padrão de elementos
| Papel | Elemento |
|---|---|
| Cenas | `ANI-01` pontilhado · `ANI-02` dispersão · `ANI-03` traço SVG |
| Ritmo da voz | `ANI-09` pulso na voz |
| Números | `DAD-12` donut + KPI · `ANI-06` contador (em pontos) |
| Mapas | `DAD-09` mapa-múndi (dot matrix) |
| Legenda | 2–3 palavras, 1 linha, palavra-chave em `fontes.destaque` itálico no acento |

> **Caminhos**: `scripts/`, `assets/` e `references/` são desta skill (`_SISTEMA/skills/estilos/estilo-minimalista-pontilhado/`). `assets/voz.m4a`, `.work/`, `compositions/` são do **projeto** (`5-PROJETOS/<slug>/`).

## Princípios (por quê)

1. **Uma metáfora por frase, e ela precisa mudar.** Nenhum gráfico pode ficar parado mais de ~4–5 s (no exemplo, uma cena de gráfico de 11 s e outra só com um boneco parado foram reprovadas). Se a frase longa tem 3 ideias, são 3 cenas (`references/metaforas.md`).
2. **Pontilhado é a assinatura.** Tudo é feito de pontos: matriz de pontos (figuras), contornos tracejados, grade sutil de fundo, partículas que se soltam e se reagrupam. Sem linha cheia, sem sombra, gradiente ou textura.
3. **Acento = a ideia.** Fundo `cores.fundo`, texto neutro, `cores.acento` só no que carrega a tese (o ponto de interesse, a linha que dispara). Nenhuma cor fora do manual.
4. **A fala manda no tempo.** Cada elemento entra um pouco antes da palavra que ilustra — use os tempos por palavra, nunca "mais ou menos". Elementos que falam de "agora" caem na batida da palavra.
5. **Movimento calmo, sem efeito barato.** Draw, fade, morph, escala suave. Sem shake/whip/flash.
6. **Aprovação antes do que custa.** Moodboard estático antes de animar; rascunho 1080p antes do 4K; só então o render final.
7. **Confira olhando.** Todo beat passa por `snapshot` + leitura do contact sheet (quase todo bug foi visual: legenda sobre elemento, câmera que não volta, texto fora do quadro).

## Padrões do estilo (decididos no exemplo; confirme com o aluno só se ele quiser mudar)

- **Handle** do manual na assinatura final, escrito exatamente como está lá.
- **Legenda:** 2–3 palavras por vez, sempre numa linha, bloco inteiro entra de uma vez (blur+subida). `fontes.corpo` 600 na cor do texto; **palavra-chave em `fontes.destaque` itálica no acento** (Playfair e EB Garamond vêm embutidas no renderer).
- **Voz:** acelerada ~1.22x (tom preservado) com pausas longas aparadas; o ritmo natural costuma soar "devagar" em vídeo curto. Sempre limpa (isolamento por IA + anti-sopro) — gravação de celular costuma ter sopro, e a respiração antes da 1ª palavra é silenciada.
- **Trilha:** dramática/épica, **exporte também sem trilha** (muita gente aplica a música no próprio Instagram). Entregue as duas versões.
- **Formato:** 1080×1920 composto, render final 4K (2160×3840), áudio −14 LUFS.

## Fluxo

### 1. Sondar o áudio
`ffprobe` (duração) e transcrição para entender a tese:
```bash
npx hyperframes@0.8.85 transcribe assets/voz.m4a --language pt --model medium --json
```
Gera `assets/transcript.json` com tempo por palavra. **Leia** — erros do Whisper viram erro de legenda.

### 2. Projeto e plano
Crie o projeto pelo painel ou `npm run novo -- "Nome" 9:16 <audio>`, copie o áudio para `assets/voz.m4a`, escreva `BRIEF.md` e `STORYBOARD.md` (formato em `assets/exemplo-ia-emprego/`). Divida o roteiro em beats pela fala — metáfora de cada um em `references/metaforas.md` — e **mostre o plano** ao aluno.

### 3. Voz: ritmo e limpeza
1. Medir pausas: `ffmpeg -i voz.m4a -af silencedetect=noise=-42dB:d=0.18 -f null -`. Escolha os trechos mantidos (corta pausas > ~0.5 s e o sopro do início).
2. `scripts/preparar-voz.sh trim assets/voz.m4a .work/voz-122.wav 1.22 "0.45:5.28,5.56:8.11,8.12:38.95"` (ajuste os trechos).
3. **Isolamento por IA** (Magnific MCP): `creations_request_upload` (audio/wav) → `curl -X PUT --data-binary` no `proxyUploadUrl` → `creations_finalize_upload` → `simulate_cost audio_isolate` (~128 créditos) → `audio_isolate` → `creations_wait` → `creations_register_download` → baixe o mp3 do `url`. Sem Magnific: use o `ffmpeg afftdn` + `polish` abaixo, ou `npx hyperframes` media-use (`audio_isolate` local, se disponível).
4. `scripts/preparar-voz.sh polish voz-isolada.mp3 assets/voz-122.m4a 0.36` — anti-sopro + silêncio até logo antes da 1ª palavra (`início_da_palavra_na_voz_nova − ~0.06`).
5. **Ofereça A/B** (1.00x / 1.12x / 1.22x e limpeza suave/forte/IA) com 14–16 s de teste antes de decidir — o aluno escolhe de ouvido (no exemplo: 1.22x e IA + anti-sopro).

### 3b. Re-sincronizar tudo ao novo relógio
Todo tempo do roteiro (palavras, beats, SFX) está no relógio da voz **original**. O template (`assets/index.template.html`) tem a função `T(t)` que mapeia o tempo original → tempo novo (trechos cortados + `/SP`) e **embrulha `tl.to/fromTo/set`** para converter automaticamente tempos e durações. Ajuste `SP`, `VEND` e os trechos de `T` para o novo corte; a duração do root (`data-duration`) e do `<audio>` também. Os `<audio>` de SFX **não** passam por `T` — converta os `data-start` à mão (há um trecho em Python no histórico: `T(t)` aplicado a cada `sfx-N`).

### 4. Moodboard (aprovação)
Antes de animar: um quadro-chave estático por cena + prancha de estilo, com o gerador de pontos real. Copie `assets/moodboard-index.html` (+ `scripts/dots.js` em `lib/`), troque as cenas/legendas, `hyperframes snapshot moodboard --at ...`, junte em uma prancha (`ffmpeg tile`) e **mostre ao aluno**. Ajuste densidade/laranja/metáforas até o OK. Referência aprovada: `assets/moodboard-referencia.png`.

### 5. Construir
1. Copie `assets/index.template.html` → `.work/index.template.html`, `scripts/build.mjs` → `.work/build.mjs`, `scripts/dots.js` → `compositions/lib/dots.js` (o template carrega `compositions/lib/dots.js`).
2. Gere `.work/words.compact.json` (`[["palavra", ini, fim], …]`, tempos **originais**): ver `assets/exemplo-ia-emprego/words.compact.json`.
3. Reescreva as **cenas** no template (o motor — `take/put/morph/key`, legenda, remapeamento — é reutilizável; as cenas são conteúdo). `references/metaforas.md` explica o motor e cada metáfora.
4. Legenda: edite `GROUPS` (índices de palavra, 2–3 por grupo, sem quebra de linha) e `KEY` (palavras em serifa laranja).
5. Ciclo por cena: `node .work/build.mjs` → `rm -rf snapshots` → `npx hyperframes@0.8.85 snapshot --at <tempos> --no-end --describe false` → **leia o contact sheet** → corrija. `npx hyperframes@0.8.85 check` a cada rodada (meta: 0 erros; os 2 avisos de arquivo grande/aninhamento são esperados).

### 6. Áudio e trilha
- **SFX:** `click-soft`, `ping`, `pop` (de `~/.claude/skills/media-use/audio/assets/sfx/` ou `2-ASSETS/sfx/`), volume 0.2–0.3, um som por evento visual (formou, encaixou, subiu). Discretos: com música no Instagram eles ficam por baixo.
- **Trilha:** `scripts/bgm-search.mjs` (edite as `queries`; só candidatos ≥ a duração do vídeo) com login HeyGen ativo (`npx hyperframes auth status`; o login é do aluno). Sem login: trilha própria em `2-ASSETS/trilhas/`. Foco: "dramatic epic orchestral trailer drums build". Corte no tamanho do vídeo com fade in/out; `data-volume` ~0.25 foi o "mais alto" aprovado. A tag `<audio id="bgm">` do template tem `data-fx-carve` apontando para a voz (abre espaço sob a fala), mas as lanes de automação foram calculadas para a voz de 35 s do exemplo: **com outra voz, apague `data-automation` da tag e rode o `carve.mjs`** (passo a passo em `_SISTEMA/skills/estilos/estilo-split-explicativo/references/armadilhas.md`, seção Trilha) e salve a tag nova no template.
- Ofereça 2–3 trilhas em rascunho e deixe o aluno escolher de ouvido.

### 7. Rascunho → final (detalhes em `revisar-e-entregar`)
1. Rascunho: `npx hyperframes@0.8.85 render --quality draft -o renders/rascunho.mp4` + `loudnorm` rápido (`-c:v copy`) → mostre ao aluno.
2. Final 4K: `bash _SISTEMA/skills/nucleo/revisar-e-entregar/scripts/finalizar-4k.sh 5-PROJETOS/<slug> <nome>` (check → render `portrait-4k` delivery → loudnorm 2 passes −14). Confira `ffprobe` (2160×3840), `ebur128` (≈ −14.3) e um contact sheet **do arquivo renderizado**.
3. **Duas versões:** com trilha e sem trilha (`NOBGM=1 node .work/build.mjs` remove a tag `bgm` antes de rodar o finalizar). Guarde a com música como `-com-musica`. Copie as duas para `3-EDITADOS/`.

### 8. Capa e legenda do post
- **Capa:** ofereça 3 opções (1080×1920) a partir de `assets/capa-index.html` (copie com `scripts/dots.js` em `lib/`, ajuste textos/figuras, `hyperframes snapshot --at 0.5,1.5,2.5`). Fórmula: título 2 linhas em Montserrat 800 branco com a palavra-chave em Playfair itálico laranja + **uma metáfora do próprio vídeo** em pontos + o handle do manual minúsculo embaixo (em caixa alta o zero vira "O"). Mantenha tudo na faixa central (o grid do perfil corta as bordas). No exemplo "IA e emprego" a capa escolhida foi a da **balança** ("Não é uma briga *justa*"): a imagem mais forte do vídeo, tese resolvida sozinha.
- **Legenda do post:** hook que reforça (não repete) o gancho, 1 CTA binário, 5–8 hashtags, no tom de voz do manual.

## Armadilhas

Ver `references/armadilhas.md` (bugs reais deste fluxo: pool de pontos, câmera, índices de legenda, timeline remapeada).
