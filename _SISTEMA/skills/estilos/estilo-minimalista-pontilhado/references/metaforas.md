# Motor e biblioteca de metáforas

## Motor de partículas (reutilizável)
Um **pool de ~1700 `<circle>`** é o único elemento gráfico. Cada cena reatribui pontos do pool a novas formas:

- `take(n)` → pega n índices livres. `release(idx, dy)` → devolve (some, opacidade 0).
- `put(idx, pts, {r, c, o})` → define o estado-alvo de cada ponto (`x, y, r, c, o`).
- `morph(idx, pts, {dropDy})` → leva um grupo para uma forma nova (reaproveita os mesmos pontos, pega extras ou solta sobras). **É a transição entre metáforas.**
- `key(t, dur, {stagger | delay(i,a,b,r), ease})` → **fecha um keyframe**: tira foto do estado e gera um tween por ponto `a → b` a partir de `t`. `delay` permite ordem (da esquerda p/ a direita, do peito p/ fora, por altura…). Aleatório sempre via `rand(seed)` (determinístico).
- Para um ponto **nascer** num lugar: `put` com `o:0` + `key(t-0.02, 0.01)` e depois `put` na posição final + `key(t, dur)`.
- Overlays que não são partículas (rótulos, anéis SVG, onda): `ovText`, `ovGroup`, `tl.to/fromTo` direto. Rótulo mantém `attr x/y` para acompanhar a balança.
- Câmera: `gsap.set(world,{svgOrigin:"540 960"})` uma vez; depois só `scale/x/y`. Se afastar, **volte** (`scale 1, x 0, y 0`) antes da cena seguinte.

Formas prontas em `DOTS.SHAPES` (coords locais): `person` (200×400), `chair` (220×300), `scaleBase`, `pan`, `arrow` (200×320). Ícones de ferramenta (chat, faísca, `</>`, anel) estão no template (`ICONS`).

## Biblioteca (todas já testadas)

| Ideia na fala | Metáfora | Notas |
|---|---|---|
| Pessoas "ficando para trás" / sumindo | Fila de 5 bonecos de matriz; os pontos de um a um se soltam, caem no chão e viram contorno | Pontos caídos reaproveitados para escrever a palavra-tese |
| "Perder a vaga" / competição por lugar | Cadeira de pontos; um boneco vira contorno, outro (ponto laranja no peito) a ocupa | O ponto laranja = "interesse" |
| "Briga não é justa" / vantagem | Balança de pontos; carga laranja cai no prato "COM IA" e a balança despenca | Viga e cordas também são pontos; rótulos acompanham |
| Crescimento desigual | Gráfico: linha branca lenta × linha laranja exponencial que sai pelo topo; anéis + rótulo a cada palavra dita | Máx. ~4 s. Sem rótulo "COM IA" encavalando a linha |
| "Pessoa com ferramentas" | Boneco + 4 ícones laranja em pontos que entram no peito | Reaproveitar `ICONS` |
| "Muito além" / produção | Pilha de blocos laranja crescendo e saindo do quadro × 2 blocos brancos que apagam | Blocos entram com cadência crescente |
| Se atualizar | Anel pontilhado laranja que se desenha em volta (barra de progresso) → ponto laranja cai no peito | |
| Se capacitar | Ferramentas surgem sobre o anel e são sugadas para o peito | |
| "Enquanto é tempo" | Onda pontilhada sai do peito; laranja toma o corpo; anel se apaga ao contrário (tempo acabando) | |
| Manter o emprego | A cadeira (vaga) volta, boneco laranja ao lado + ✓ pontilhado se desenha | Callback da cena 2 |
| Crescer | Cadeira vira escada de 5 degraus; boneco sobe um degrau por batida da fala; seta laranja nasce no topo | |
| Fecho | Pontos formam @juli0net0; grade apaga | Segure o topo ~0.5 s antes |

## Regra de ritmo
Cada frase da fala = pelo menos 1 mudança visível (nascer, mover, transformar). Frase longa com 3 ideias (técnica/resultado/performance; ferramentas; "muito além") = 3 cenas. Se uma cena está parada mais de ~4 s, divida ou adicione movimento.

## Ideias novas (não testadas)
Relógio/ampulheta de pontos (tempo), ponte entre dois penhascos, porta que abre, árvore que cresce, engrenagem, bússola, rede de pontos conectando bonecos. Teste no moodboard antes.
