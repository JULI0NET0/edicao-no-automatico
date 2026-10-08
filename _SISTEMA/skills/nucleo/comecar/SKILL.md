---
name: comecar
description: Primeiro passo do framework Edição no Automático, para quem está começando do zero — define a identidade visual (marca) e o objetivo do perfil (nicho, público, para que servem os vídeos, plataformas, CTA padrão), grava tudo no 0-MARCA/MANUAL-DA-MARCA.md e sugere o primeiro vídeo e o estilo. Use quando o aluno disser "começar", "primeiro uso", "configurar tudo", "acabei de instalar", "por onde começo", ou abrir o framework sem MANUAL-DA-MARCA.
---

# Começar

Deixa o framework pronto para editar: **identidade visual + objetivo**. Tudo o que for decidido aqui vale para todos os vídeos, e todas as skills leem.

## 1. Conferir o estado
- `0-MARCA/MANUAL-DA-MARCA.md` existe? Se sim, mostre um resumo (paleta em lista, fontes, @, objetivo) e pergunte se quer **manter** ou **refazer**. Se manter, pule para o passo 4.
- Liste `0-MARCA/assets/` e `1-MATERIAIS-PARA-EDITAR/` para saber o que já chegou.

## 2. Identidade visual
Siga a skill `configurar-marca` (caminho A se houver logo/foto/manual em `0-MARCA/assets`, caminho B com entrevista se não houver). Ela mostra a prévia e só grava depois do OK.

## 3. Objetivo (uma mensagem, até 6 perguntas)
1. Sobre o que são os seus vídeos (nicho/tema)?
2. Para quem (público)?
3. O que o vídeo precisa causar: ensinar, gerar autoridade, vender, levar para um link, crescer seguidores?
4. Onde você posta (Reels, TikTok, YouTube, Shorts, aula/curso)?
5. Qual o CTA padrão do final (seguir, comentar, link na bio, nenhum)?
6. Frequência e duração típica (ex.: 3 reels de 30–45 s por semana)?

Grave no manual, logo depois do bloco yaml:

```markdown
## Objetivo
- **Tema:** …
- **Público:** …
- **O vídeo precisa:** …
- **Plataformas e formato:** … (9:16, 16:9…)
- **CTA padrão:** …
- **Ritmo de postagem:** …
```

## 4. Primeiro vídeo
- Se houver material em `1-MATERIAIS-PARA-EDITAR/`, sugira o estilo que combina com o objetivo e o material (pessoa falando → `estilo-split-explicativo` ou `estilo-motion-cards`; só voz → `estilo-minimalista-pontilhado`; aula → `estilo-aula-moldura`) e mostre o `exemplo.mp4` dele.
- Se não houver, diga para arrastar o bruto no painel (`npm run hyperframes` → aba Criação) e para o próximo pedido ser, por exemplo: `/estilo-motion-cards edita o <arquivo>`.
- Lembre: a aba **Estilos** do painel tem o comando de cada estilo pronto para copiar.

## Regras
- Não grave nada sem mostrar antes (prévia da marca, resumo do objetivo).
- Pergunte tudo de cada etapa numa mensagem só; não faça interrogatório.
