# Motor curto (reels de 5–15 s)

Motor dos estilos **3D camadas**, **motion cards**, **recorte 3D** e **bruto → editado**. Split padrão: painel em cima, pessoa embaixo, legenda na emenda.

| Arquivo | O que é |
|---|---|
| `template.html` | index comum: câmera, legenda karaokê, SFX, recorte, flash |
| `build.mjs` | roda **dentro do projeto**; lê `.work/config.mjs` + `.work/words.json` e escreve `index.html` |
| `scaffold.sh` | prepara um projeto do framework (fx-overlay, SFX, `npm run build`) |
| `fx-overlay.html` | flash e vinheta usados pelos beats |

## Passo a passo
1. Projeto criado (painel ou `npm run novo`), `assets/limpo.mp4` e `.work/words.json` prontos (passos 2–5 do estilo-split-explicativo).
2. `bash _SISTEMA/skills/estilos/estilo-split-explicativo/assets/motor-curto/scaffold.sh 5-PROJETOS/<slug> _SISTEMA/skills/estilos/<estilo>/assets/exemplo/config.mjs`
3. Copie o beat do exemplo do estilo para `5-PROJETOS/<slug>/compositions/beats/` e adapte texto e tempos.
4. Edite `.work/config.mjs`: `SEG` (trecho do limpo.mp4), `BEATS`, `EMPHASIS_SRC`, `CAMERA`, `SFX`. Tempos são **locais** ao trecho.
5. `node _SISTEMA/skills/nucleo/configurar-marca/scripts/aplicar-marca.mjs 5-PROJETOS/<slug>` (cores do exemplo → sua marca).
6. `(cd 5-PROJETOS/<slug> && npm run build)` → snapshot → check.
