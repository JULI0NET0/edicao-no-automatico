---
name: limpar-bruto
description: Pega um vídeo bruto e devolve 1 vídeo limpo — remove os erros, apara os silêncios e tira as repetições sem perder o sentido, com plano de cortes aprovado antes. Use em todo vídeo com fala do framework Edição no Automático ("corta os erros", "tira os silêncios", "limpa o bruto", "plano de cortes"), antes da skill de estilo. Funciona só com ffmpeg; um editor com MCP é opcional.
---

# Corte limpo de vídeo (edição via agente)

Pega um vídeo bruto e devolve 1 vídeo limpo: erros removidos, silêncios aparados, repetições tiradas — sem quebrar a mensagem. É agnóstico de ferramenta.

## O que você precisa antes
- o(s) arquivo(s) bruto(s) do vídeo
- um jeito do agente editar: um editor com MCP, uma skill de edição, ou ffmpeg
- ffmpeg instalado (pra medir silêncio de verdade)
- uma transcrição do vídeo pra localizar os cortes pelo texto

## Princípio central: 3 passadas, nessa ordem
1. Erros — remove os trechos que você errou/refez.
2. Silêncio real — apara as pausas e o dead-air.
3. Redundância — nenhuma informação pode aparecer duas vezes.
Pular a 2 ou a 3 é o erro mais comum: sobra vídeo arrastado ou repetido.

### Passada 1 — Erros
- Se você marca os erros falando uma palavra-chave enquanto grava, diga isso ao agente: ele acha a palavra na transcrição e corta do fim da última fala boa antes do erro até a retomada depois. Dá pra ter dois níveis (erro curto x erro grande que volta mais).
- Se você não marca nada, peça pro agente ler a transcrição e achar gaguejos, frases abandonadas e refações.
- Tosse, pigarro ou ruído no meio da fala costuma aparecer na transcrição de dois jeitos: como palavra(s) sem sentido ou estranhamente repetida(s) no meio de uma frase normal (ex: "ampliar o o radiação" no lugar de uma palavra normal), ou como um trecho/clipe isolado sem nenhuma palavra transcrita entre dois trechos de fala. Os dois são pista de som não-fala pra cortar, não erro de fala em si — sinalize mesmo sem certeza absoluta, já que a transcrição sozinha pode não bater 100% com o áudio real, e confirme com quem gravou antes de cortar.
- Uma frase como "mais uma vez" ou "deixa eu repetir" antes de um trecho repetido pode ser recurso didático OU autocorreção de um erro (a pessoa errou e está refazendo). Antes de decidir, olhe se a passagem ANTERIOR tem sinal de erro (gaguejo, palavra repetida, frase abandonada) — se tiver, trate como Erro (corta a primeira passagem, mantém a refeita). Só é Redundância proposital de fato quando a primeira passagem está limpa.
- Regra de ouro: cortar sempre em fronteira de frase, nunca no meio da palavra. A emenda boa aparece onde a fala refeita repete as palavras de antes do erro.
- Peça o plano de cortes (tempo + o que sai) antes de aplicar.

### Passada 2 — Silêncio real (com ffmpeg, NÃO pela transcrição)
- Nunca meça silêncio pela transcrição: ela estica a duração das palavras e esconde as pausas reais.
- Use o áudio: ffmpeg -i entrada.mp4 -af silencedetect=noise=-30dB:d=0.35 -f null -  (lista início e fim de cada silêncio)
- Apare as pausas acima de ~0.6s, deixando ~0.3s de respiro. Mais agressivo: 0.5s. Mais conservador: 0.8s.
- Cuidado: mostrando a tela, uma pausa longa pode ser você demonstrando algo calado — revise antes de cortar.

### Passada 3 — Redundância (varre o vídeo INTEIRO)
- A repetição mais traiçoeira é semântica e distante: você explica o mesmo conceito 2x em momentos diferentes, com outras palavras.
- Peça pro agente ler a transcrição final inteira e listar todo ponto onde a mesma ideia aparece 2+ vezes (com timecode). Mantém a melhor, corta as outras.

### Passada 4 — Aplicar, revisar, exportar
- Junte todos os cortes num conjunto só, sem sobreposição e ordenados, e aplique de uma vez (ripple, pra o áudio acompanhar).
- Confira a transcrição depois: zero erros restantes, nenhuma palavra cortada no meio.
- Peça os timecodes das emendas pra conferir antes de exportar.
- Se o editor não salva sozinho, salve antes de exportar.

## Layout (opcional, câmera + tela)
Se você tem dois arquivos (câmera e tela), explique quando quer só a cara e quando quer cara + tela. O agente usa a transcrição pra trocar o layout na hora certa.

## No framework
- Bruto em `1-MATERIAIS-PARA-EDITAR/`; o plano de cortes vai para `5-PROJETOS/<slug>/CORTES.md` (timecode, o que sai, o que fica e por quê).
- Aplicar sem editor: gere a lista de trechos mantidos e use `_SISTEMA/skills/estilos/estilo-split-explicativo/scripts/preparar-fonte.sh` (um trecho) ou um `ffmpeg concat` com `-ss/-to` por trecho, sempre a partir do **original** (nunca do proxy).
- Se o take já é limpo, o corte pode ser só cabeça e cauda. Está certo.

## Como virar a SUA skill
Rode uma vez na mão ("corta os erros, apara os silêncios acima de 0.6s, tira as repetições, me mostra o plano antes"), ajuste o que não ficou do seu jeito e peça: "cria uma skill com esse processo". Da próxima é só mandar o bruto e citar a skill.
