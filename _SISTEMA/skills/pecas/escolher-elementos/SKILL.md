---
name: escolher-elementos
description: Escolhe, entre os 108 elementos do framework Edição no Automático (pasta 4-ELEMENTOS, códigos como LEG-01, TRA-05, FEC-12) e o catálogo HyperFrames, quais usar em cada trecho de um vídeo, a partir da transcrição/roteiro e do estilo escolhido, e mostra uma prancha com os previews para aprovação. Use quando o aluno disser "escolhe os elementos", "o que combina com esse vídeo", "sugere animações", "usa LEG-02 e TRA-05", ou quando o ELEMENTOS.md do projeto estiver vazio no plano visual.
---

# Escolher elementos

Os 108 elementos estão em `4-ELEMENTOS/`. O índice é `4-ELEMENTOS/catalogo.json`: para cada código, `nome`, `categoria`, `contextos` (reel-falando, so-voz, aula, cliente, anuncio), `oque` (o que é), `pedir` (o que o aluno precisa informar), `base` (item do catálogo HyperFrames) e `pasta`.

Cada pasta tem `preview.mp4`, `poster.jpg`, `elemento.html` (código isolado, roda no navegador) e `PEDIR.md`.

| Prefixo | Categoria |
|---|---|
| `ANI` | Animação (pontilhado, dispersão, traço, texto cinético, 3D, contador, glitch, pulso na voz, spring pop) |
| `TPL` | Templates e mockups (notificações, chat de IA, post, follow, terminal, browser, lower thirds, devices, notas, mapa, antes/depois, liquid glass) |
| `LEG` | Legendas (pill karaokê, highlight, gradient, neon, glitch, matrix, slam, editorial, weight shift, atrás da pessoa, burst, emoji) |
| `TRA` | Transições (zoom through, iris, whip pan, push, blur zoom, persianas, mosaico, glitch, light leak, flash, dip, radial) |
| `CAM` | Câmera e footage (shake, dolly, punch-in, speed ramp, camcorder, grain, warp, HUD, tracking, cursor, anotação, split) |
| `PAP` | Doodle, papel e textura |
| `3DV` | 3D e VFX |
| `DAD` | Carrosséis, dados e mapas |
| `FEC` | Prova social e fechamento (depoimento, nota, logos, follow, comentários, logo sting, end card) |

## Quando o aluno já deu os códigos

"usa LEG-02, TRA-05, FEC-04" → confira no `catalogo.json`, registre no projeto e pergunte só o que o campo `pedir` exige e não estiver claro:
```bash
npm run usar -- LEG-02 <slug>
```
(ou o botão "Usar no projeto" no painel). Isso anota em `5-PROJETOS/<slug>/ELEMENTOS.md` e copia a referência para `.work/elementos/<código>/`.

## Quando é para sugerir

1. Leia a transcrição/roteiro e o `BRIEF.md`; divida em trechos (beats) pela fala.
2. Filtre o catálogo pelo contexto do estilo (`reel-falando` para split, `so-voz` para minimalista, `aula` para aula).
3. Para cada trecho, escolha **1 elemento principal** pela função da fala:
   - lista → `ANI-12`, `TPL-09`, motion cards; número → `ANI-06`, `DAD-05`, `DAD-12`; comparação → `TPL-11`; virada → `TRA-10`, `ANI-08`; tese → `LEG-10`, `ANI-05`; prova social → `FEC-01`, `FEC-02`, `FEC-05`; ferramenta/tela → `TPL-02`, `TPL-05`, `TPL-06`; final → `FEC-12`.
4. Uma legenda (`LEG-*`) para o vídeo todo, no máximo 2 tipos de transição, 1 fechamento.
5. Regra de dose: um elemento novo a cada 3–7 s; nada parado por mais de ~5 s; nenhum elemento sem relação com a fala.
6. Se nenhum dos 108 servir, procure no catálogo HyperFrames (`npm run catalogo -- <termo>` ou a aba do painel) antes de construir à mão.

## Prancha para aprovação (portão "plano visual")

Monte uma tabela (tempo · fala · código · por quê) **e** uma prancha com os `poster.jpg` lado a lado:
```bash
ffmpeg -i 4-ELEMENTOS/<pasta1>/poster.jpg -i 4-ELEMENTOS/<pasta2>/poster.jpg ... -filter_complex "xstack=inputs=N:layout=..." 5-PROJETOS/<slug>/.work/prancha-elementos.jpg
```
Mostre ao aluno. Depois do OK, registre cada um com `npm run usar`.

## Ao construir

- `elemento.html` é uma **referência** (célula 445×300 em cores livres), não um bloco pronto: adapte posição, tamanho e tempo ao vídeo e troque as cores pelos papéis do manual (`_SISTEMA/skills/nucleo/configurar-marca/references/mapa-de-tokens.md`).
- O código completo de cada célula está em `4-ELEMENTOS/_fontes/<moodboard>/index.html`, procurando por `cell("NN"`.
- Se o campo `base` aponta para um item do catálogo HyperFrames, prefira instalar o item (`hyperframes add <base>`) e adaptar.
