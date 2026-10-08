---
name: estilo-motion-cards
description: Estilo "Motion explicativo com cards e ícones" do framework Edição no Automático — reel vertical curto (5–15 s, ou um trecho de um reel maior) com a pessoa falando embaixo e, no painel de cima, cards numerados com ícone entrando em sequência no painel de cima, um por item falado. Use quando o aluno pedir "motion cards", "cards animados", "lista animada", "ícones animados", "passo a passo animado", ou quando escolher este estilo no painel. Roda sobre o motor curto do estilo-split-explicativo.
---

# Estilo: motion explicativo com cards e ícones

**O que é:** cards numerados com ícone entrando em sequência no painel de cima, um por item falado.
**Quando usar:** A fala enumera coisas (canais, ferramentas, passos, benefícios).
**Exemplo pronto:** `assets/exemplo/exemplo.mp4` (assista antes), beat em `assets/exemplo/beats/b-cards.html`, configuração em `assets/exemplo/config.mjs`.

## Contrato do framework
Siga o "Contrato do framework" de `_SISTEMA/skills/estilos/estilo-split-explicativo/SKILL.md`: marca e **Preferências de edição** do `0-MARCA/MANUAL-DA-MARCA.md` (sem ele → `configurar-marca`; as preferências valem mais que o padrão da skill), pastas 1-MATERIAIS → projetos → 3-EDITADOS, elementos do `ELEMENTOS.md`, portões de aprovação.

## Kit padrão de elementos
| Papel | Elemento |
|---|---|
| Cards | ANI-12 spring pop · TPL-09 app de notas |
| Legenda | LEG-01 pill karaokê |
| Ícones | ícones simples em traço (ANI-03 traço SVG) |
| Fechamento do bloco | TRA-04 push elástico |

## Regras do estilo
- Um card por item falado, no tempo da palavra.
- Numere (01, 02…) quando a ordem importa.
- Ícones de traço na cor do texto; o item atual ganha o acento.
- No máximo 4 cards visíveis; acima disso, role o painel (pan-stations do exemplo Apple).

## Fluxo
1. **Fonte, transcrição e cortes:** passos 1–5 do `estilo-split-explicativo` (preparar-fonte → transcrever → `limpar-bruto` → build-groups). Escolha o trecho de 5–15 s que melhor cabe no estilo.
2. **Plano visual (portão):** mostre ao aluno o trecho, o texto de cada camada/card/título e os elementos. Espere o OK.
3. **Montar:**
   ```bash
   bash _SISTEMA/skills/estilos/estilo-split-explicativo/assets/motor-curto/scaffold.sh 5-PROJETOS/<slug> _SISTEMA/skills/estilos/estilo-motion-cards/assets/exemplo/config.mjs
   cp _SISTEMA/skills/estilos/estilo-motion-cards/assets/exemplo/beats/*.html 5-PROJETOS/<slug>/compositions/beats/
   node _SISTEMA/skills/nucleo/configurar-marca/scripts/aplicar-marca.mjs 5-PROJETOS/<slug>
   ```
   Edite `.work/config.mjs` (`SEG`, `BEATS`, `EMPHASIS_SRC`, `CAMERA`, `SFX`) e o texto do beat.
4. **Ciclo:** `(cd 5-PROJETOS/<slug> && npm run build)` → `npx hyperframes snapshot --at <tempos> --no-end` → leia o contact sheet → corrija → `npx hyperframes check`.
5. **Áudio:** `trilha-e-sfx`. **Entrega:** `revisar-e-entregar`.

Se o vídeo for maior que 15 s, use este estilo como **um beat** dentro do `estilo-split-explicativo`.
