# Como testar o framework

São três níveis. Os dois primeiros são automáticos; o terceiro é você usando como aluno.

| Nível | Comando | Tempo | O que prova |
|---|---|---|---|
| 1. Rápido | `npm run testar -- --rapido` | ~10 s | pastas, skills, 108 elementos, marca, painel |
| 2. Completo | `npm run testar` | ~2 min | o nível 1 + cria um projeto, monta um reel e roda o check do HyperFrames |
| 3. Como aluno | passo a passo abaixo | ~30 min | instalação do zero e o Claude usando as skills de verdade |

Rode o nível 1 sempre que mexer em alguma coisa. O nível 2 antes de entregar uma versão nova aos alunos. O nível 3 uma vez por versão.

---

## Níveis 1 e 2: o que o `npm run testar` confere

1. **Ambiente:** Node 20+ e ffmpeg.
2. **Estrutura:** todas as pastas e arquivos que o aluno precisa (AGENTS.md, 0-MARCA/, 1-MATERIAIS…, 4-ELEMENTOS/catalogo.json, _SISTEMA/modelos/…).
3. **Skills:** as 14 existem, o `name` bate com a pasta, têm descrição, estão ligadas em `.claude/skills` e `.agents/skills`, e nenhuma tem caminho do seu computador.
4. **Elementos:** 108 no catálogo, códigos únicos, cada um com preview, poster, código e PEDIR.md, e a VITRINE com o catálogo embutido.
5. **Marca:** aplica uma marca fictícia (verde) num beat e numa capa de exemplo, confere que o laranja sumiu (hex e rgba), que o handle entrou, e que rodar de novo não troca nada.
6. **Painel:** sobe o painel numa porta separada (3029) e testa as abas Criação, Elementos e Catálogo, a página e o vídeo dos previews.
7. **Ponta a ponta** (só no completo): cria `5-PROJETOS/teste-automatico-framework`, registra o `LEG-01`, gera um vídeo sintético de 6 s, monta o reel no estilo 3D camadas, aplica a marca verde e roda `npx hyperframes check`. Apaga o projeto no fim.

Resultado esperado: `0 falha(s)`. Se falhar, a linha em vermelho diz o que corrigir (ex.: "não está ligada… rode bash instalar.sh").

---

## Nível 3: teste como aluno (passo a passo)

### Preparar
1. Instale numa pasta nova, exatamente como o aluno:
   ```bash
   DESTINO=~/Desktop/teste-aluno ABRIR_PAINEL=0 bash -c "$(curl -fsSL https://raw.githubusercontent.com/JULI0NET0/edicao-no-automatico/main/instalar-rapido.sh)"
   ```
2. Tenha à mão: um bruto curto (20–60 s) falando para a câmera, um áudio solto (para o minimalista) e o logo e a foto de uma marca que **não** seja a sua (ex.: de um cliente).

### Instalar
3. `cd ~/Desktop/teste-aluno` (o instalador já rodou `instalar.sh`)
   - [ ] termina com "Pronto. Próximos passos"
   - [ ] lista as 14 skills do curso
4. `npm run testar` → `0 falha(s)`

### Painel
5. `npm run hyperframes` (abre o navegador em `localhost:3020`).
   - [ ] **Criação:** arraste o logo e a foto para o bloco Marca e o bruto para "Vídeos para editar". Os três aparecem.
   - [ ] **Elementos:** os previews tocam ao passar o mouse; o filtro "Legendas" mostra 12.
   - [ ] **Catálogo:** a busca "caption" encontra itens.

### Marca (skill `configurar-marca`)
6. Abra o Claude Code na pasta `teste-aluno` e peça: `configura minha marca`.
   - [ ] o Claude lê o logo e a foto (não faz a entrevista inteira)
   - [ ] mostra uma prévia com paleta, legenda e end card antes de salvar
   - [ ] grava `0-MARCA/MANUAL-DA-MARCA.md` com o bloco yaml
   - [ ] o avatar sai com a cabeça inteira
7. Teste a entrevista: apague `0-MARCA/MANUAL-DA-MARCA.md`, esvazie `0-MARCA/assets` e peça de novo.
   - [ ] faz até 8 perguntas numa mensagem só
   - [ ] propõe 3 direções
   - [ ] a aba Criação mostra "MANUAL-DA-MARCA.md pronto" com as cores

### Edição (skills de núcleo + estilo)
8. Peça: `edita o vídeo <bruto> no estilo split explicativo`.
   - [ ] carrega `preparar-projeto` e cria o projeto (aparece na aba Projetos)
   - [ ] transcreve em português (`--language pt --model medium`)
   - [ ] **para e mostra o plano de cortes** antes de cortar
   - [ ] **para e mostra o plano visual com códigos de elementos** antes de construir
   - [ ] usa as cores da marca nova, **sem laranja**
9. No painel, **Abrir no editor**:
   - [ ] o HyperFrames Studio abre com o projeto
10. Peça o rascunho e depois o final:
    - [ ] rascunho em `5-PROJETOS/<slug>/renders/`
    - [ ] final 4K em `3-EDITADOS/`, conferido com `ffprobe` (2160×3840) e áudio perto de −14 LUFS

### Outros estilos (pelo menos um)
11. `faz um vídeo minimalista pontilhado com o áudio <arquivo>`
    - [ ] mostra o moodboard antes de animar
    - [ ] entrega com e sem trilha
12. `usa LEG-02 e FEC-12 no projeto <slug>` → os códigos entram no `ELEMENTOS.md` e o Claude pergunta só o que o PEDIR.md exige.

### Anotar
Para cada item que falhar, anote: o que pediu, o que o Claude fez, o que esperava. A correção vai na skill do framework (`skills/…`), não nas suas skills pessoais.
