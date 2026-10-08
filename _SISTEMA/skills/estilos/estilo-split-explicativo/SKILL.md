---
name: estilo-split-explicativo
description: Estilo principal do framework Edição no Automático — reel vertical de alguém falando para a câmera, com painel de animação em cima que PROVA o que está sendo dito (listas em cards, ranking, gráfico, palco de pôster com a pessoa recortada), legenda karaokê na emenda, SFX, trilha e end card com seguir, exportado em 4K a −14 LUFS na marca do aluno. Use quando o aluno mandar um vídeo dele falando e pedir "edita esse reel", "split", "painel em cima", "igual ao reel da Apple", "motion explicativo", "legenda animada", mesmo sem citar a skill. Só voz sem a pessoa na tela → estilo-minimalista-pontilhado. Aula horizontal → estilo-aula-moldura.
---

# Estilo: split explicativo

Transforma **um vídeo bruto de alguém falando** em um reel de alto padrão: limpo, legendado, com motion graphics que **provam a fala**, som e trilha, em 4K. Referência viva: `assets/exemplo-apple/` (o reel aprovado que originou este estilo) e o motor curto de `assets/motor-curto/` (reels de 5–15 s).

> **Caminhos.** `scripts/`, `assets/`, `references/` são desta skill (`_SISTEMA/skills/estilos/estilo-split-explicativo/`). `assets/limpo.mp4`, `compositions/`, `.work/` são do **projeto** (`5-PROJETOS/<slug>/`). Rode tudo a partir da raiz do framework.

## Contrato do framework (vale para todo estilo)

1. **Marca e preferências.** Leia `0-MARCA/MANUAL-DA-MARCA.md`, incluindo a seção **Preferências de edição**: o que estiver lá vale mais que o padrão desta skill. Se não existir, rode a skill `configurar-marca` antes de qualquer outra coisa. Os exemplos usam a marca do Julio; traduza cada valor pelo papel em `_SISTEMA/skills/nucleo/configurar-marca/references/mapa-de-tokens.md`, ou rode `aplicar-marca.mjs` no projeto depois de copiar os arquivos do exemplo.
2. **Pastas.** Bruto em `1-MATERIAIS-PARA-EDITAR/`. Projeto em `5-PROJETOS/<slug>/` (criado pelo painel `npm run hyperframes` ou `npm run novo`). Assets do aluno em `2-ASSETS/`. Entrega em `3-EDITADOS/`.
3. **Elementos.** Leia `5-PROJETOS/<slug>/ELEMENTOS.md`. Cada código (ex.: `LEG-01`) tem referência em `.work/elementos/<código>/` e no `4-ELEMENTOS/`. Se estiver vazio, use o kit padrão abaixo ou rode `escolher-elementos`.
4. **Portões de aprovação.** Plano de cortes → plano visual (com elementos) → imagens geradas (se custarem créditos) → rascunho → 4K. Não pule portão.
5. **Ferramentas pagas são opcionais.** Magnific, Palmier, HeyGen: use se o aluno tiver; senão, siga o caminho gratuito indicado em cada etapa.

## Kit padrão de elementos

| Papel | Código | Observação |
|---|---|---|
| Legenda | `LEG-01` pill karaokê | palavra ativa no acento; 2–4 palavras por tela |
| Listas faladas | `TPL-` / `ANI-12` spring pop | cards em sequência |
| Virada do argumento | `TRA-10` flash ou `ANI-08` glitch | só uma vez por vídeo |
| Números | `ANI-06` contador + barras | sempre "ILUSTRATIVO" se não for dado real |
| Ênfase de câmera | `CAM-03` punch-in | na palavra de impacto |
| Fechamento | `FEC-12` end card | avatar com a cabeça inteira |

## Princípios

1. **Cada gráfico ilustra a fala.** Lista falada → cards. Virada → flash. Comparação → dois cards. Sem nada a ilustrar → a pessoa em tela cheia com punch-in.
2. **A fala manda no tempo.** Cada elemento entra um pouco antes da palavra que ilustra. Use os tempos do `words.json`.
3. **A marca é lei.** Acento só como luz/destaque, uma coisa por vez. Nada fora do manual.
4. **Não invente dado.** Gráfico fictício leva "ILUSTRATIVO"; sem logos de terceiros.
5. **Confira olhando.** Nenhum beat está pronto sem `snapshot` lido.

## Layout do split

Painel de animação **em cima** (≈0–860 px de 1920), pessoa na metade de baixo (câmera `y ≈ +760`), legenda na emenda logo abaixo do painel. Nunca dois splits seguidos sem um respiro em tela cheia.

## Fluxo

### 1. Sondar
`ffprobe` (iPhone grava 3840×2160 com `rotation=90` → real 2160×3840) e contact sheet (`ffmpeg … fps=1/10,tile`). Veja onde fica a cabeça.

### 2. Preparar a fonte
```bash
_SISTEMA/skills/estilos/estilo-split-explicativo/scripts/preparar-fonte.sh 1-MATERIAIS-PARA-EDITAR/<bruto> 5-PROJETOS/<slug> <inicio_s> <duracao_s>
```
Gera proxy 1080, áudio 16k e o corte 4K `assets/limpo.mp4`.

### 3. Transcrever (português, modelo `medium`)
```bash
npx hyperframes transcribe assets/bruto.mp4 --language pt --model medium --json
```
Leia a transcrição; corrija nomes próprios.

### 4. Plano de cortes → skill `limpar-bruto` (portão 1)

### 5. Palavras e grupos de legenda
Ajuste `SHIFT`/`KEEP_END` em `scripts/build-groups.mjs`, rode, confira `.work/words.json` / `groups.json`. Marque os índices de ênfase.

### 6. Plano visual (portão 2)
Divida em beats (`references/padroes-de-beat.md`), escolha elementos (ELEMENTOS.md ou kit), escreva `STORYBOARD.md` (formato de `assets/exemplo-apple/STORYBOARD.md`) e mostre ao aluno. Antes de construir algo à mão, procure no catálogo: aba Catálogo do painel ou `npx hyperframes catalog --query "…"`.

### 7. Assets
- **Recorte da pessoa** (palcos de pôster): `npx hyperframes remove-background assets/limpo.mp4 -o assets/subject.webm --quality best` (10–15 min, em background).
- **Imagens** (se os beats mostram objetos): skill `imagens-ia` (portão 3).
- **Avatar** do end card: o do manual.
- **Itens do catálogo**: `hyperframes add` — são demos 1920×1080; refaça no formato vertical.

### 8. Construir
- **Reel completo (>15 s):** copie `assets/index.template.html` → `.work/index.v2.template.html` e `assets/exemplo-apple/build-v2.mjs` → `.work/build-v2.mjs`; reescreva só as constantes do vídeo (`VIDEO_DURATION`, `BEATS`, `CAMERA`, `SFX`…). Um beat por vez a partir do exemplo mais parecido em `assets/exemplo-apple/beats/`.
- **Reel curto (5–15 s):** use `assets/motor-curto/` (`build.mjs` + `template.html` + `.work/config.mjs`; veja o README dele). É o motor dos estilos 3D camadas, motion cards, recorte 3D e bruto→editado.
- Depois de copiar arquivos de exemplo: `node _SISTEMA/skills/nucleo/configurar-marca/scripts/aplicar-marca.mjs 5-PROJETOS/<slug>`.
- Ciclo: build → `npx hyperframes snapshot --at <tempos> --no-end` → ler o contact sheet → corrigir → `npx hyperframes check` (meta: 0 erros).

### 9. Áudio → skill `trilha-e-sfx`

### 10. Rascunho e 4K → skill `revisar-e-entregar`

### 11. Legenda do post
Gancho que reforça (não repete) o vídeo, 1 CTA, ≤150 palavras, 5–8 hashtags, no tom de voz do manual.

## Referências

- `references/padroes-de-beat.md` — padrões de beat, quando usar, mecânica e catálogo
- `references/armadilhas.md` — o que já quebrou (leia antes de construir)
- `references/exemplo-identidade-julio.md` — como a marca do exemplo foi aplicada (modelo de raciocínio)
- `assets/exemplo-apple/` — reel completo de referência
- `assets/motor-curto/` — motor dos reels curtos
