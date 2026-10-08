---
name: criar-estilo
description: Transforma um vídeo aprovado do framework Edição no Automático numa skill de estilo reutilizável com nome curto (ex.: /estilo-podcast-cortes), guardando o exemplo, a receita (layout, elementos, ritmo, áudio) e as decisões do aluno, para repetir o mesmo visual nos próximos vídeos com um comando. Use quando o aluno disser "salva esse estilo", "quero repetir esse visual", "cria uma skill desse vídeo", "transforma em estilo", ou quando revisar-e-entregar terminar um vídeo aprovado com um visual novo.
---

# Criar estilo

Todo visual aprovado pode virar um comando. A skill nova fica em `_SISTEMA/skills/meus-estilos/estilo-<nome>/`, aparece na aba **Estilos** do painel com o comando pronto para copiar e é chamada com `/estilo-<nome>`.

## 1. Nome (pergunte, sugerindo 2–3 opções)
- Curto, em minúsculas, sem acento, com hífen, começando com `estilo-`: `estilo-podcast-cortes`, `estilo-dica-rapida`, `estilo-cliente-bruna`.
- Não pode repetir um nome existente (`ls _SISTEMA/skills/*/`).

## 2. Montar a pasta (script)
```bash
npm run criar-estilo -- <projeto> <nome-sem-estilo->
```
O script cria `_SISTEMA/skills/meus-estilos/estilo-<nome>/` com:
- `assets/exemplo/exemplo.mp4` (versão leve do render final do projeto) e `poster.jpg`;
- `assets/exemplo/projeto/` (index.html, compositions/, .work/config.mjs, STORYBOARD/BRIEF/ELEMENTOS do projeto);
- um `SKILL.md` rascunho;
- e liga a skill em `.claude/skills` e `.agents/skills`.

## 3. Escrever o SKILL.md (o que importa)
Reescreva o rascunho com o que foi **decidido e aprovado** nesse vídeo, lendo o projeto (`STORYBOARD.md`, `ELEMENTOS.md`, `BRIEF.md`, `.work/config.mjs`, beats) e a conversa:

- `description`: o que é o visual + frases que o aluno usaria para pedir ("igual ao vídeo X", "estilo podcast"). É isso que faz o comando ser achado.
- **Base:** de qual estilo ou motor partiu (ex.: motor curto do `estilo-split-explicativo`).
- **Layout:** onde fica cada coisa (painel, pessoa, legenda), formato (9:16, 16:9).
- **Elementos:** códigos usados e para quê (ex.: `LEG-09` legenda, `ANI-12` cards, `FEC-12` final).
- **Ritmo:** duração típica, quantos beats, quanto tempo cada elemento fica.
- **Áudio:** SFX por evento, trilha (sim/não, volume), versão sem trilha.
- **Aprovações e correções:** o que o aluno pediu para mudar durante o vídeo (isso é o mais valioso).
- **Fluxo:** passos para repetir (preparar-projeto → limpar-bruto → montar a partir de `assets/exemplo/projeto/` → aplicar-marca → revisar-e-entregar).
- **Contrato do framework:** marca e Preferências de edição do `0-MARCA/MANUAL-DA-MARCA.md` valem mais que a skill.

## 4. Confirmar
- Mostre o SKILL.md final e o comando: `/estilo-<nome> edita o <arquivo>`.
- Diga onde achar: painel → aba **Estilos** → "Copiar comando".
- Se a sessão do Claude Code já estava aberta, o comando novo pode precisar de uma nova sessão para aparecer na lista de `/`.
