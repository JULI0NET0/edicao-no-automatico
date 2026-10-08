# Armadilhas (bugs reais deste fluxo)

- **Pool curto**: `take()` avisa `pool curto` no console se faltar ponto. N=1700 bastou para 5 bonecos + texto + balança; figuras grandes (pilha de blocos, escada) sobem o consumo — aumente `N` e confira o aviso.
- **Camera não volta**: depois de `scale 0.55`, a cena seguinte aparece deslocada. Sempre reset (`scale 1, x 0, y 0`) e **defina o `svgOrigin` uma vez** (`gsap.set`), nunca dentro de cada tween (reaplica a origem e desloca).
- **Texto estoura o quadro**: `DOTS.text` a 118–150 px passa de 1080 px. Meça (`size 96` para "DESEMPREGADO", 112 para o handle).
- **Legenda "enquantoé"**: palavra serifada itálica cola na vizinha; use `gap 20px` + `padding 0 6px`. Palavras quebradas pela transcrição ("en|quanto") → `GROUPS` pode pular índice e `TXT` reescreve o texto (`TXT[82] = "enquanto"`).
- **Grupos com 3 palavras longas quebram linha**: mantenha `nowrap` e, se passar de ~960 px, divida o grupo.
- **Legenda "aparece pela metade"**: se os spans entram escalonados mas o contêiner não está visível ainda, o texto "pisca". Contêiner `opacity 0` até `start` (`tl.set`), spans animam dentro.
- **Dois `<audio>` com a mesma `id`** / `<audio>` sem `id` → render mudo (`media_missing_id`). SFX = `sfx-0…N`, trilha = `bgm`, voz = `voz`.
- **SFX não seguem o remapeamento**: `T(t)` só embrulha `tl.to/fromTo/set`; os `data-start` dos `<audio>` precisam ser convertidos à mão.
- **`tl.to` embrulhado ignora `duration` em `tl.to(world…)`** com tempos > `VEND`: o `sd()` só escala durações para `t < VEND`. Cenas depois do fim da voz usam relógio novo direto.
- **`data-layout-allow-overflow`** no `<g id="world">`: o check acusa overflow porque o gráfico sai pelo topo de propósito.
- **Música com remapeamento**: corte a trilha no comprimento do vídeo (`-t`) e faça fade out; `data-duration` do `<audio bgm>` = duração do vídeo.
- **Loudnorm**: `finalizar-4k.sh` é bash (em zsh o `set -- $VAR` quebra). Rodar com `bash`.
- **Sopro no 1º segundo**: não é o render. A gravação tem respiração antes da 1ª palavra; mute com `volume=0:enable='lt(t,X)'` + `afade` curto. Meça com `volumedetect` em janelas de 0.1 s (`-ss s -t 0.1`).
- **Magnific `audio_clean_speech`** retorna "não disponível"; use `audio_isolate`.
- **Pergunta ao usuário dispensada**: se o Julio fechar o `AskUserQuestion`, pare e espere — ele responde em texto depois ("5" = a 5ª opção apresentada).
