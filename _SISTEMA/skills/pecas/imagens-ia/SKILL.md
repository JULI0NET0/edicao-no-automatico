---
name: imagens-ia
description: Gera ou prepara as imagens que entram nos vídeos do framework Edição no Automático (objetos de produto, cenas, ícones, fundos de moldura) na marca do aluno, com custo aprovado antes. Use quando um beat precisar de imagem ("gera a imagem do produto", "precisa de um fundo", "coloca um iPhone aqui", "imagem com IA"). Funciona com Magnific (MCP), qualquer gerador de imagem que o aluno tenha, ou só com as imagens de 2-ASSETS.
---

# Imagens com IA

## Antes de gerar
1. **Precisa mesmo?** Primeiro procure em `2-ASSETS/imagens/` e nos elementos (`TPL-08` devices, `3DV-01` iPhone 3D, `3DV-02` MacBook 3D). Imagem gerada é para o que o vídeo **mostra** (o produto citado, o objeto da metáfora).
2. **Estilo único por vídeo.** Escreva um prompt-base com a marca: fundo `cores.fundo`, luz de recorte no `cores.acento` (como brilho, nunca fundo), sem texto na imagem, sem logos de terceiros, objeto centralizado com respiro.
3. **Custo (portão).** Com Magnific: `simulate_cost` antes; mostre o valor ao aluno.

## Geração
- **Magnific (MCP):** `images_generate` com `seedream-5-pro` (fotoreal de produto) → **1 teste** → aluno aprova o estilo → lote → `images_remove_background` em cada objeto. Baixe para `5-PROJETOS/<slug>/assets/img/` e copie as boas para `2-ASSETS/imagens/` (reuso).
- **Outro gerador** (ChatGPT, Midjourney, Ideogram, Gemini…): gere com o mesmo prompt-base, salve em `2-ASSETS/imagens/`; para tirar o fundo, `npx hyperframes remove-background <img> -o <saida.png>`.
- **Sem gerador:** formas e ícones em SVG/CSS nas cores do manual, ou os elementos `ANI-01` (pontilhado) e `ANI-03` (traço) como ilustração.

## Ao usar no vídeo
- PNG com fundo transparente, ≥ 2× o tamanho em que aparece (o render final é 4K).
- Entrada com movimento leve (escala 0.96 → 1, blur → nítido); nada de imagem parada > 4 s.
- Dado ou marca de terceiros nunca entra como se fosse real.
