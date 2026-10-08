# Identidade visual — Julio Neto

Fonte: paleta enviada pelo Julio em 2026-09-28. Tudo que é gráfico no reel usa **só** estas cores.

| Papel | Hex | Uso no reel |
|---|---|---|
| Fundo principal | `#0A0A0A` | Palcos escuros, painéis dos splits, base de qualquer layout |
| Fundo secundário | `#1C1C1C` | Cards, caixas, containers, fim do degradê dos palcos |
| Laranja destaque | `#F97316` | Palavra ativa da legenda, placas de destaque, selos #1, líder do ranking, linha do gráfico, botão, divisórias |
| Texto principal | `#FFFFFF` | Títulos e legenda |
| Texto secundário | `#A8A8A8` | Labels, kickers, linha dos concorrentes, @handle |
| Bordas | `#282828` | Bordas de card, divisórias |

Apoios derivados (não novos matizes): `#111111` (meio do degradê), `#050505` (extremo do degradê), `#3A3A3A` (barra neutra), `#FDBA74` (centro claro da divisória laranja), `#EA580C` (laranja escuro no fim de gradiente).

## Regra de ouro do Julio

> O laranja é acento, não fundo dominante em estilos fotográficos/cinematográficos. Aparece como luz, reflexo ou glow — nunca preenchendo o fundo.

Como isso se traduz em edição:

- **Palcos** (recorte do Julio sobre título gigante): fundo `#1C1C1C → #0A0A0A`, laranja só como **glow** atrás do sujeito e na palavra-chave do título.
- **Splits e cards**: fundo escuro, laranja só no elemento que deve ganhar o olho (uma coisa por vez).
- **Legenda**: a palavra ativa leva fundo laranja. Palavra de ênfase leva fundo `#0A0A0A` + contorno laranja de 4px + glow — laranja sobre laranja some.
- **A parede do Julio já é laranja/vermelha** nos vídeos gravados no escritório. Por isso o azul e o amarelo da primeira versão saíram: brigavam com a parede E fugiam da identidade. Não reintroduza cores fora da paleta.

## Semântica de cor (o que cada uso significa)

- Barra do **Apple** no ranking: branca enquanto sobe, laranja só quando assume o #1. Cor = "está liderando".
- Linha do gráfico: laranja = protagonista, `#A8A8A8` = os outros.
- Chip de preço riscado: **branco** (o risco é laranja; laranja sobre laranja não lê).
- Selo "TALVEZ NÃO POSSAM": fundo `#0A0A0A` com borda laranja, texto branco.
- Botão de follow: laranja com texto `#0A0A0A`; estado "Seguindo" cinza `#282828` com texto branco.

## Tipografia

- Título de impacto: **League Gothic** (condensada, 400). Vem embutida no renderer, sem `@font-face`.
- Legenda e labels: **Montserrat** 800/900, caixa alta. Também embutida.
- **Anton NÃO está na lista de fontes embutidas** — o lint acusa `font_family_without_font_face`. Use League Gothic no lugar.
- League Gothic só existe em peso 400; não peça 700/900.

## Avatar / foto de perfil

`assets/perfil/avatar-julio.jpg` (512x512, recorte quadrado do rosto da foto de estúdio com luz laranja). Use no card de follow do end card com anel `#F97316` de 4px e glow leve. Se o Julio mandar outra foto: recorte quadrado centrado no rosto (na foto original 1611x2000 foi `crop=1000:1000:300:170`), confira visualmente antes de aplicar.

## Handle

No end card, o Julio pediu **`@juli0net0`** (com zeros no lugar dos "o") em 2026-09-28. O perfil aparece como `@julioneto.ia` em outras skills. Na dúvida, pergunte qual usar no vídeo novo — nunca "corrija" a grafia sozinho.
