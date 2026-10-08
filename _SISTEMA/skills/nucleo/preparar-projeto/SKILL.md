---
name: preparar-projeto
description: Abre um vídeo novo no framework Edição no Automático — confere a marca, cria o projeto a partir do material em 1-MATERIAIS-PARA-EDITAR, escreve o BRIEF, transcreve em português e escolhe a skill de estilo. Use no começo de qualquer edição ("edita esse vídeo", "tenho um bruto novo", "vamos fazer um reel"), antes da skill de estilo.
---

# Preparar projeto

1. **Marca.** `0-MARCA/MANUAL-DA-MARCA.md` existe e tem o bloco yaml? Se não → `comecar` primeiro (identidade visual + objetivo do perfil). Leia as seções **Objetivo** e **Preferências de edição** e siga-as durante todo o vídeo.
1b. **Identidade e objetivo DESTE vídeo (sempre, antes de qualquer corte).** Numa mensagem só, mostre e pergunte:
   - **Identidade visual:** "vou usar a sua marca (paleta: … · fontes: … · @…). Mantém ou este vídeo é de outra marca/cliente?" Se for outra, rode `configurar-marca` gravando em `5-PROJETOS/<slug>/MARCA.md` (mesmo formato) e use essa no lugar do manual principal.
   - **Objetivo do vídeo:** o que precisa causar, para quem, CTA final. Sugira a partir da seção Objetivo do manual e do BRIEF (o painel já pode ter preenchido).
   Grave as respostas no `BRIEF.md` (`Identidade visual` e `Objetivo deste vídeo`).
2. **Material.** Liste `1-MATERIAIS-PARA-EDITAR/`. Se houver vários, pergunte qual. `ffprobe` para duração, resolução e rotação (iPhone: 3840×2160 com `rotation=90` = vertical).
3. **Estilo.** Se o aluno chamou um comando de estilo (`/estilo-…`) ou o BRIEF já tem estilo, use esse. Senão, escolha pela tabela do `AGENTS.md` e pelos estilos salvos em `_SISTEMA/skills/meus-estilos/`; na dúvida, mostre 2–3 opções com o `exemplo.mp4` de cada uma.
4. **Projeto.** Se ainda não existe: `npm run novo -- "<Nome>" <9:16|16:9|1:1> <arquivo>` (ou pelo painel). O comando cria `5-PROJETOS/<slug>/` com `BRIEF.md` e `ELEMENTOS.md`.
5. **BRIEF.md.** Preencha objetivo, público, estilo, destino (Reels, YouTube, aula), CTA final. Pergunte só o que não der para inferir, numa mensagem.
6. **Transcrição.** Sempre em português e modelo `medium`:
   ```bash
   cd 5-PROJETOS/<slug> && npx hyperframes transcribe <video> --language pt --model medium --json
   ```
   O padrão (`small.en`) traduz para inglês. **Leia** a transcrição e corrija nomes próprios.
7. **Elementos.** Se `ELEMENTOS.md` estiver vazio, rode `escolher-elementos` ou use o kit do estilo.
8. Siga para `limpar-bruto` e depois para a skill do estilo.
