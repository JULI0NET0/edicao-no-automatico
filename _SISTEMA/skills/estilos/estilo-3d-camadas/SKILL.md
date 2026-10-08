---
name: estilo-3d-camadas
description: Estilo "Montagem 3D em camadas" do framework Edição no Automático — reel vertical curto (5–15 s, ou um trecho de um reel maior) com a pessoa falando embaixo e, no painel de cima, painéis de vidro empilhados em perspectiva, entrando um a um com ícone e rótulo, e um impacto quando a pilha fecha. Use quando o aluno pedir "3D em camadas", "camadas", "pilha de cards", "montagem 3D", "painéis de vidro", ou quando escolher este estilo no painel. Roda sobre o motor curto do estilo-split-explicativo.
---

# Estilo: montagem 3d em camadas

**O que é:** painéis de vidro empilhados em perspectiva, entrando um a um com ícone e rótulo, e um impacto quando a pilha fecha.
**Quando usar:** A fala lista partes de um sistema, etapas que se somam ou "o que tem por trás" de algo (automação, funil, stack de ferramentas).
**Exemplo pronto:** `assets/exemplo/exemplo.mp4` (assista antes), beat em `assets/exemplo/beats/a-camadas.html`, configuração em `assets/exemplo/config.mjs`.

## Contrato do framework
Siga o "Contrato do framework" de `_SISTEMA/skills/estilos/estilo-split-explicativo/SKILL.md`: marca e **Preferências de edição** do `0-MARCA/MANUAL-DA-MARCA.md` (sem ele → `configurar-marca`; as preferências valem mais que o padrão da skill), pastas 1-MATERIAIS → projetos → 3-EDITADOS, elementos do `ELEMENTOS.md`, portões de aprovação.

## Kit padrão de elementos
| Papel | Elemento |
|---|---|
| Peças da pilha | 3DV-07 depth stack · 3DV-08 tilt card |
| Legenda | LEG-01 pill karaokê |
| Impacto ao fechar | CAM-03 punch-in + SFX impact |
| Entrada | TRA-03 whip pan |

## Regras do estilo
- 3 a 5 camadas; mais que isso vira ruído no celular.
- Cada camada entra um pouco antes da palavra que a nomeia.
- Só a camada da ideia principal leva o acento.
- Perspectiva sutil (rotateX 50–60°); texto sempre legível de frente.

## Fluxo
1. **Fonte, transcrição e cortes:** passos 1–5 do `estilo-split-explicativo` (preparar-fonte → transcrever → `limpar-bruto` → build-groups). Escolha o trecho de 5–15 s que melhor cabe no estilo.
2. **Plano visual (portão):** mostre ao aluno o trecho, o texto de cada camada/card/título e os elementos. Espere o OK.
3. **Montar:**
   ```bash
   bash _SISTEMA/skills/estilos/estilo-split-explicativo/assets/motor-curto/scaffold.sh 5-PROJETOS/<slug> _SISTEMA/skills/estilos/estilo-3d-camadas/assets/exemplo/config.mjs
   cp _SISTEMA/skills/estilos/estilo-3d-camadas/assets/exemplo/beats/*.html 5-PROJETOS/<slug>/compositions/beats/
   node _SISTEMA/skills/nucleo/configurar-marca/scripts/aplicar-marca.mjs 5-PROJETOS/<slug>
   ```
   Edite `.work/config.mjs` (`SEG`, `BEATS`, `EMPHASIS_SRC`, `CAMERA`, `SFX`) e o texto do beat.
4. **Ciclo:** `(cd 5-PROJETOS/<slug> && npm run build)` → `npx hyperframes snapshot --at <tempos> --no-end` → leia o contact sheet → corrija → `npx hyperframes check`.
5. **Áudio:** `trilha-e-sfx`. **Entrega:** `revisar-e-entregar`.

Se o vídeo for maior que 15 s, use este estilo como **um beat** dentro do `estilo-split-explicativo`.
