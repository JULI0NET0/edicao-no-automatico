---
name: estilo-bruto-editado
description: Estilo "Bruto → editado com lettering" do framework Edição no Automático — reel vertical curto (5–15 s, ou um trecho de um reel maior) com a pessoa falando embaixo e, no painel de cima, colagem dos brutos virando o enquadrado final, fechando com tipografia grande e a palavra-chave em serifa itálica no acento. Use quando o aluno pedir "bruto para editado", "antes e depois da edição", "lettering", "tipografia grande", "bastidor da edição", ou quando escolher este estilo no painel. Roda sobre o motor curto do estilo-split-explicativo.
---

# Estilo: bruto → editado com lettering

**O que é:** colagem dos brutos virando o enquadrado final, fechando com tipografia grande e a palavra-chave em serifa itálica no acento.
**Quando usar:** Vídeo sobre o próprio processo ("olha o que a IA fez com o meu bruto"), satisfação, resultado.
**Exemplo pronto:** `assets/exemplo/exemplo.mp4` (assista antes), beat em `assets/exemplo/beats/d-letra.html`, configuração em `assets/exemplo/config.mjs`.

## Contrato do framework
Siga o "Contrato do framework" de `_SISTEMA/skills/estilos/estilo-split-explicativo/SKILL.md`: marca e **Preferências de edição** do `0-MARCA/MANUAL-DA-MARCA.md` (sem ele → `configurar-marca`; as preferências valem mais que o padrão da skill), pastas 1-MATERIAIS → projetos → 3-EDITADOS, elementos do `ELEMENTOS.md`, portões de aprovação.

## Kit padrão de elementos
| Papel | Elemento |
|---|---|
| Antes/depois | TPL-11 antes / depois |
| Lettering | LEG-08 editorial · ANI-04 texto cinético |
| Textura | PAP-05 texto textura (opcional) |
| Fechamento | FEC-08 logo sting |

## Regras do estilo
- Use trechos reais do bruto (mesmo errados): é a prova.
- Lettering com no máximo 4 palavras; só a palavra-chave em serifa itálica no acento.
- A transição bruto → editado é o momento do vídeo: dê 0,6–1 s a ela.

## Fluxo
1. **Fonte, transcrição e cortes:** passos 1–5 do `estilo-split-explicativo` (preparar-fonte → transcrever → `limpar-bruto` → build-groups). Escolha o trecho de 5–15 s que melhor cabe no estilo.
2. **Plano visual (portão):** mostre ao aluno o trecho, o texto de cada camada/card/título e os elementos. Espere o OK.
3. **Montar:**
   ```bash
   bash _SISTEMA/skills/estilos/estilo-split-explicativo/assets/motor-curto/scaffold.sh 5-PROJETOS/<slug> _SISTEMA/skills/estilos/estilo-bruto-editado/assets/exemplo/config.mjs
   cp _SISTEMA/skills/estilos/estilo-bruto-editado/assets/exemplo/beats/*.html 5-PROJETOS/<slug>/compositions/beats/
   node _SISTEMA/skills/nucleo/configurar-marca/scripts/aplicar-marca.mjs 5-PROJETOS/<slug>
   ```
   Edite `.work/config.mjs` (`SEG`, `BEATS`, `EMPHASIS_SRC`, `CAMERA`, `SFX`) e o texto do beat.
4. **Ciclo:** `(cd 5-PROJETOS/<slug> && npm run build)` → `npx hyperframes snapshot --at <tempos> --no-end` → leia o contact sheet → corrija → `npx hyperframes check`.
5. **Áudio:** `trilha-e-sfx`. **Entrega:** `revisar-e-entregar`.

Se o vídeo for maior que 15 s, use este estilo como **um beat** dentro do `estilo-split-explicativo`.
