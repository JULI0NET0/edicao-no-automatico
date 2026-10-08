---
name: estilo-aula-moldura
description: Estilo "aula com moldura" do framework Edição no Automático — vídeo horizontal 16:9 em 4K para aulas, tutoriais e YouTube, com a gravação dentro de uma janela de cantos arredondados sobre um fundo de marca, marca-d'água, etiqueta "Aula NN · título" nos primeiros segundos, legenda karaokê, barra de progresso e encerramento com o logo. Use quando o aluno pedir "edita a aula", "modelo de aula", "vídeo para o YouTube", "moldura", "tutorial horizontal", ou quiser um quadro fixo reaproveitável para uma série de aulas.
---

# Estilo: aula com moldura

Um quadro fixo para uma série inteira: em cada aula nova só mudam o vídeo, o trecho, o título e a transcrição. Exemplo: `assets/exemplo/exemplo-20s.mp4` (Aula 00 do curso "Edição no Automático", na marca do Julio Neto).

## Contrato do framework
Siga o "Contrato do framework" de `_SISTEMA/skills/estilos/estilo-split-explicativo/SKILL.md`: marca e **Preferências de edição** do `0-MARCA/MANUAL-DA-MARCA.md` (sem ele → `configurar-marca`; as preferências valem mais que o padrão da skill), gravação em `1-MATERIAIS-PARA-EDITAR/`, projeto 16:9 em `5-PROJETOS/<slug>/`, entrega em `3-EDITADOS/`.

## Peças de marca (uma vez por série)

| Arquivo no projeto | O que é | De onde vem |
|---|---|---|
| `assets/moldura-fundo.png` | fundo 3840×2160 atrás da janela | gere na marca: textura sutil (pontilhado, grade, degradê) com o acento só em brilho. Sem gerador de imagem: um degradê `fundo → superficie` em HTML exportado com snapshot |
| `assets/marca-dagua.png` | ícone do logo, canto superior direito, ~60% | `logo.icone` do manual |
| `assets/logo-fim.png` | logo completo para o encerramento | `logo.escuro` do manual |

Os arquivos do exemplo estão em `assets/exemplo/` para comparação.

## Elementos que combinam
`TPL-07` lower thirds · `TPL-05` terminal · `TPL-06` browser + cursor · `CAM-10` cursor gigante · `PAP-03` caixa + seta · `LEG-09` weight shift.

## Fluxo

1. **Projeto 16:9:** painel (formato 16:9) ou `npm run novo -- "Aula 01" 16:9 <gravação>`. Copie a gravação para `assets/`.
2. **Transcrever:** `npx hyperframes transcribe assets/<aula>.mp4 --language pt --model medium --json` → `assets/transcript.json`. Leia e liste nomes de ferramenta errados (Cloud → Claude, Codec → Codex…).
3. **Cortes:** `limpar-bruto` (portão 1). Para aula, seja conservador com pausas em que a tela está demonstrando algo.
4. **Config:** copie `assets/exemplo/aula.exemplo.json` para `5-PROJETOS/<slug>/.work/aula.json` e ajuste `video`, `inicio`, `fim`, `kicker` ("Aula 01 · Primeiro projeto"), `titulo` (nome do curso/canal), `correcoes`, `juncoes`.
5. **Montar:**
   ```bash
   cp _SISTEMA/skills/estilos/estilo-aula-moldura/assets/exemplo/{moldura-fundo,marca-dagua,logo-fim}.png 5-PROJETOS/<slug>/assets/   # ou as peças da sua marca
   (cd 5-PROJETOS/<slug> && node ../../_SISTEMA/skills/estilos/estilo-aula-moldura/assets/exemplo/build.mjs)
   node _SISTEMA/skills/nucleo/configurar-marca/scripts/aplicar-marca.mjs 5-PROJETOS/<slug>
   ```
   O `aplicar-marca` troca `{{NOME}}`, `{{HANDLE}}`, cores e fontes. Rode-o **depois** de cada build (o build regenera o `index.html` a partir do template).
6. **Conferir:** `npx hyperframes snapshot --at 1,5,30 --no-end` (etiqueta, legenda, encerramento) → `npx hyperframes check`.
7. **Entrega:** `revisar-e-entregar` (4K 3840×2160, −14 LUFS).

## Regras
- A etiqueta fica só nos primeiros ~6 s; a marca-d'água o vídeo todo.
- Legenda: até 4 palavras por frase, palavra falada no acento, sombra para ler sobre qualquer tela.
- Encerramento de ~3,6 s com o logo sobre `cores.fundo`.
- Série: não mude o quadro entre aulas; só o config.
