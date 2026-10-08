---
name: estilo-recorte-3d
description: Estilo "Perspectiva 3D com recorte de fundo" do framework Edição no Automático — reel vertical curto (5–15 s, ou um trecho de um reel maior) com a pessoa falando embaixo e, no painel de cima, a pessoa recortada na frente de um título gigante (palco de pôster), com profundidade entre camadas atrás e na frente. Use quando o aluno pedir "recorte", "pessoa na frente do texto", "palco de pôster", "texto atrás de mim", "perspectiva 3D", ou quando escolher este estilo no painel. Roda sobre o motor curto do estilo-split-explicativo.
---

# Estilo: perspectiva 3d com recorte de fundo

**O que é:** a pessoa recortada na frente de um título gigante (palco de pôster), com profundidade entre camadas atrás e na frente.
**Quando usar:** Frase-tese, número de impacto ou contraste curto ("horas → segundos") que merece virar capa de revista.
**Exemplo pronto:** `assets/exemplo/exemplo.mp4` (assista antes), beat em `assets/exemplo/beats/c-behind.html + c-front.html`, configuração em `assets/exemplo/config.mjs`.

## Contrato do framework
Siga o "Contrato do framework" de `_SISTEMA/skills/estilos/estilo-split-explicativo/SKILL.md`: marca e **Preferências de edição** do `0-MARCA/MANUAL-DA-MARCA.md` (sem ele → `configurar-marca`; as preferências valem mais que o padrão da skill), pastas 1-MATERIAIS → projetos → 3-EDITADOS, elementos do `ELEMENTOS.md`, portões de aprovação.

## Kit padrão de elementos
| Papel | Elemento |
|---|---|
| Título atrás | LEG-10 atrás da pessoa · ANI-05 texto 3D |
| Troca de palavra | slot que rola e trava (exemplo Apple b-ultimos) |
| Câmera | CAM-02 dolly zoom ou CAM-03 punch-in |
| Saída | corte seco ou TRA-10 flash |

## Regras do estilo
- Precisa do recorte: `npx hyperframes remove-background assets/limpo.mp4 -o assets/subject.webm --quality best` (10–15 min).
- Reduza e desça o recorte (scale ~0.84, y ~285) para liberar o topo para o título.
- `c-behind` fica abaixo do recorte, `c-front` acima; suprima a legenda enquanto o título diz a frase.
- Glow do acento atrás da pessoa, nunca fundo inteiro no acento.

## Fluxo
1. **Fonte, transcrição e cortes:** passos 1–5 do `estilo-split-explicativo` (preparar-fonte → transcrever → `limpar-bruto` → build-groups). Escolha o trecho de 5–15 s que melhor cabe no estilo.
2. **Plano visual (portão):** mostre ao aluno o trecho, o texto de cada camada/card/título e os elementos. Espere o OK.
3. **Montar:**
   ```bash
   bash _SISTEMA/skills/estilos/estilo-split-explicativo/assets/motor-curto/scaffold.sh 5-PROJETOS/<slug> _SISTEMA/skills/estilos/estilo-recorte-3d/assets/exemplo/config.mjs
   cp _SISTEMA/skills/estilos/estilo-recorte-3d/assets/exemplo/beats/*.html 5-PROJETOS/<slug>/compositions/beats/
   node _SISTEMA/skills/nucleo/configurar-marca/scripts/aplicar-marca.mjs 5-PROJETOS/<slug>
   ```
   Edite `.work/config.mjs` (`SEG`, `BEATS`, `EMPHASIS_SRC`, `CAMERA`, `SFX`) e o texto do beat.
4. **Ciclo:** `(cd 5-PROJETOS/<slug> && npm run build)` → `npx hyperframes snapshot --at <tempos> --no-end` → leia o contact sheet → corrija → `npx hyperframes check`.
5. **Áudio:** `trilha-e-sfx`. **Entrega:** `revisar-e-entregar`.

Se o vídeo for maior que 15 s, use este estilo como **um beat** dentro do `estilo-split-explicativo`.
