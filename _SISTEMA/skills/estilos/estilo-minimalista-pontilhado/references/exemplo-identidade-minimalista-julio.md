# Identidade — Minimalista Conceitual

Mesma paleta do Julio (ver `editar-reel-julioneto/references/identidade-visual.md`), mas aqui o laranja é **ponto/linha de destaque**, nunca fundo, glow ou preenchimento de tela.

| Papel | Valor | Uso |
|---|---|---|
| Fundo | `#0A0A0A` | Toda a tela. Sem gradiente. |
| Neutro | `#FFFFFF` | Pontos de figuras e legenda |
| Apoio | `#A8A8A8` | Rótulos secundários ("SEM IA"), chão pontilhado esmaecido |
| Ideia | `#F97316` | O que carrega a tese: "COM IA", ponto de interesse, linha que dispara, palavra-chave |
| Grade | branco 7% | Grade de pontos de fundo (passo 48 px, r 1.6) — fica em todas as cenas |

## Pontos

- **Matriz** (figuras sólidas): `DOTS.fill(path, {step: 12–13})`, r 3.4–3.8. Passo 17 para figuras pequenas (r 3).
- **Contorno** (figura "apagada"/ausente): `DOTS.stroke(path, {gap: 15})`, r 2.4, opacidade 0.3–0.5.
- **Chão**: linha pontilhada gap 16, r 2, opacidade 0.35.
- **Texto em pontos**: `DOTS.text(str, {size, step 7–8})`. Largura útil ≤ ~960 px: "DESEMPREGADO" a 96 px, "@juli0net0" a 112 px (a 150 px estoura o quadro).
- **Rótulos** (SVG `<text>`): Montserrat 700, `letter-spacing .18em`, 30–34 px, caixa alta.

## Legenda

- Posição: `top: 1500px`, centralizada, 1 linha (`white-space: nowrap`, `gap 20px`).
- Texto corrido: Montserrat 600, 64 px, branco, `letter-spacing -0.01em`.
- Palavra-chave: **Playfair Display itálico 500, 78 px, laranja**, `padding 0 6px` (sem o padding a serifa cola na palavra vizinha: "enquantoé").
- Entrada: bloco inteiro de uma vez, `y: 26 → 0` + `blur 8 → 0` (0.32 s, power3.out), com defasagem de 0.06 s por palavra dentro do bloco; palavra-chave dá um pulso de escala 1.08. Saída: fade 0.14 s.
- Fontes: Montserrat/Playfair/EB Garamond/League Gothic são embutidas — **não** use `@font-face` nem outras serifas (o lint acusa `font_family_without_font_face`).

## Handle
`@juli0net0` (com zeros). Montado em pontos brancos + 1 ponto laranja embaixo, grade de fundo apagando.
