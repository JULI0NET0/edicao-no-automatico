# Padrões de beat

Um reel é uma sequência de **beats**: cada trecho do roteiro ganha o tratamento visual que ilustra o que está sendo dito. O beat não enfeita — ele **prova** a fala. Se um trecho não tem o que ilustrar, deixe só o Julio na tela com um punch-in; silêncio visual também é ritmo.

Todos os exemplos abaixo estão prontos em `assets/exemplo-apple/beats/` (reel da Apple, aprovado como referência). Copie o arquivo mais próximo e adapte texto, tempos e imagens — não reescreva do zero.

## Escolhendo o padrão pelo tipo de fala

| A fala é… | Padrão | Arquivo de exemplo |
|---|---|---|
| A tese / frase de abertura | **Palco de pôster** | `a-behind.html` + `a-front.html` |
| Uma palavra que vira o argumento | **Slot que rola e trava** | `b-ultimos.html` |
| Uma lista falada (produtos, passos, nomes) | **Split com estações** | `c-lista1.html` |
| Duas palavras-chave em sequência | **Palco com troca de palavra** | `d-behind.html` |
| "Liderou / ultrapassou / cresceu" | **Ranking animado** | `e-lider.html` |
| Segunda lista / prova em massa | **Grade de cards com selo** | `f-grade.html` |
| Virada do argumento ("só que…") | **Flash + gráfico** | `g-virada.html` |
| Comparação / consequência | **Split com focus-swap** | `h-outras.html` |
| Fechamento que retoma a abertura | **Palco de payoff** | `i-behind.html` |
| Final | **End card com follow** | `j-endcard.html` |

Não precisa usar todos. Um reel de 30s pode ter 4–5 beats. Regra prática: um beat novo a cada 3–7s, nunca dois splits seguidos sem respiro em tela cheia.

## Anatomia comum

- Cada beat é um sub-composition em `compositions/beats/<id>.html`, montado no `index.html` com `data-composition-src`.
- O tempo local do beat começa em 0 no `data-start` do host. Nos exemplos, os beats que ficam em tempo **global** declaram `OFFSET` e uma função `T(g) = g - OFFSET` — escreva os tempos em segundos do vídeo e converta com `T()`. É muito menos propenso a erro do que fazer a conta de cabeça.
- `layer: "behind"` = abaixo do recorte do Julio; `"front"` = acima. Só os palcos de pôster usam `behind`.
- O `index.html` é **gerado** por `build-v2.mjs` a partir de `assets/index.template.html`. Edite o template ou o build, nunca o `index.html` gerado (ele é sobrescrito).

## 1. Palco de pôster (hook, troca de palavra, payoff)

O que é: num ponto do roteiro o vídeo **corta seco** para um palco escuro; um título gigante fica atrás e o Julio, recortado e reduzido, fica na frente com o cabelo sobrepondo as letras. Estilo capa de revista/thumbnail.

Por que existe: a primeira tentativa foi "texto atrás do sujeito" direto sobre a sala. Não funciona no enquadramento do Julio — a cabeça ocupa o topo e o texto some atrás dela. O palco resolve porque reduz e desce o recorte (`scale ~0.84, y ~285`) e libera o topo para o título.

Como montar:
- `beats/x-behind.html`: `#stage` com degradê `#1C1C1C → #0A0A0A`, glow laranja, título com letras em máscara (`overflow:hidden`) subindo com `power4.out` em cascata (~0.05s por letra).
- A câmera move `#cam-sub` (o recorte) separadamente de `#cam` (o vídeo base): entrada `scale 0.8 → 0.84`, slam de `0.96` na palavra de impacto. Veja o array `CAMERA` em `exemplo-apple/build-v2.mjs` — entradas com `t: "sub"`.
- O recorte só toca nos intervalos do palco (`SUBJECT_CLIPS`) — fora deles fica escondido.
- `#cam-sub` tem `mask-image` em gradiente horizontal para suavizar as bordas do quadro quando reduzido.
- Suprima a legenda nesse trecho (`SUPPRESS`) — o título já diz a frase.
- Feche o palco com `tl.set("#stage", {opacity:0}, EXIT)` (corte seco de volta à sala).

Catálogo usado: `caption-parallax-layers` (ideia do layer atrás do sujeito), `shutter-slam` (ghosts de blur), `beat-accent` (flash radial + anel), `camera-shake`.

## 2. Slot que rola e trava

Frase fixa + uma palavra que troca por máscara e trava na certa (ex.: "SEMPRE OS PRIMEIROS? → PIONEIROS? → **ÚLTIMOS**"). Use para a palavra que carrega o argumento. Todos os candidatos ficam na mesma célula de grid para o slot ter a largura do maior. Layout **empilhado** (prefixo em cima, slot embaixo) — lado a lado quebrava em 1080. Catálogo: `kinetic-type-swap`.

## 3. Split com estações (listas)

Julio sobe (câmera `y: -170`), painel inferior de 880px com cards que o "pan" atravessa, **cada pan chegando um pouco antes da palavra falada**. Entrada por whip lateral com blur; saída por wipe cromático. Trilho de bolinhas embaixo mostra o progresso. Item "misterioso" (silhueta + "?") no fim cria expectativa. Catálogo: `pan-stations`, `whip-pan-cut`, `chromatic-aberration-wipe`.

Cuidados: legenda vai para `mode-seam` (logo acima do painel); painel e legenda não podem se sobrepor.

## 4. Ranking animado

Barras com valores em keyframes; o rank é resolvido a cada passo e a posição da linha vem do rank (troca suave, nunca cruzam sem trocar). A barra do protagonista entra em último e ultrapassa. **Sem números reais** e com tag "ILUSTRATIVO" — nunca invente dado. Concorrentes são "Concorrente A–D". Catálogo: `bar-chart-race`.

Cor por inline style dentro do `render()` (não por classe): alternar classes em cada frame com scrub para trás dava estado errado.

## 5. Grade de cards com selo

Cards de vidro (fundo `rgba(28,28,28,.72)`, não translúcido demais — o vídeo por trás atrapalhava a leitura) entram cada um na palavra falada; selo "#1" com spring-pop; o último slot começa tracejado com "?" e se resolve na palavra final com um light-sweep. O vídeo fica escurecido por trás (`DIMS`). Catálogo: `stagger-cascade`, `spring-pop`, `light-sweep-pass`.

## 6. Flash + gráfico de virada

Flash de câmera (`editorial-flash-overlay`: wash branco + core radial `screen` + sweep) no exato ponto da virada, depois palavras em slam e um gráfico de linhas que se desenham (`stroke-dashoffset`) com etiquetas que acompanham a ponta. Clampe as etiquetas dentro do card — elas vazavam.

## 7. Split com focus-swap

Dois cards lado a lado: o "foco" está nítido, o outro recuado (0.92 de escala, blur 6px, opacidade .5), e trocam juntos. Risco duplo trêmulo (`hw-underline` strike, hash determinístico) cruza o preço; seta desenhada (`hw-arrow`) liga os cards. Traços com `stroke-dasharray` deixam **pontas visíveis** antes de desenhar — esconda com `opacity:0` até o início do desenho.

## 8. End card

Último frame do vídeo desfocado e escurecido + "SEGUE PRA / MAIS" + card de follow (slide-up, press-in, elastic release, "Seguir" → "Seguindo ✓"). Nome e @handle; **sem contagem de seguidores e sem selo de verificado** (seria inventar dado). Avatar: `assets/perfil/avatar-julio.jpg`. O root do vídeo é estendido ~1.5s além do vídeo base.

## Legenda (camada global)

Karaokê palavra a palavra (base: `caption-highlight`), grupos de até 3 palavras quebrando em pontuação ou pausa > 0.15s. Gerada por `scripts/build-groups.mjs` a partir da transcrição. Modos de posição:

- `low` (padrão): terço inferior, acima da zona de UI do Reels.
- `seam`: logo acima do painel nos splits.
- `top`: topo, quando o resto da tela está cheio (grade, gráfico).
- Suprima grupos onde um título grande já diz a frase.
- Palavras de ênfase (`EMPHASIS`, índices em `words.json`): marcas e palavras da tese.

## Camadas finais

Grain (12fps, deslocamento determinístico) + vinheta em `assets/fx-overlay.html`; câmera com punch-ins a cada 3–5s (1.0 / 1.1 / 1.16) e micro-shake nos impactos (`SHAKES`).

## SFX

Biblioteca local de 21 arquivos (`media-use/audio/assets/sfx/`): `whoosh`, `whoosh-short`, `impact-bass-1/2`, `pop`, `click`, `click-soft`, `ping`, `sparkle`, `glitch-3`, `error`, `riser`, `chime`. Volumes 0.22–0.4. Um som por evento visual: whoosh nas transições, click em cada item de lista, pop em cards/selos, impact nos slams, ping/sparkle em revelação. No exemplo são 35 cues em 50s.
