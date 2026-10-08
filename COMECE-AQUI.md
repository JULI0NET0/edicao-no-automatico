# Edição no Automático — comece aqui

Pasta de trabalho para editar vídeos com IA: você joga o bruto, escolhe o estilo e os elementos, e o Claude Code (ou Codex) edita em HyperFrames.

## 0. Instalar (uma vez)

Precisa de Node 20+ e ffmpeg. Na pasta do framework:

```bash
bash instalar.sh
```

Instala as skills do HyperFrames e liga as 16 skills do curso no Claude Code e no Codex desta pasta. Depois confira com `npm run testar` (esperado: `0 falha(s)`; detalhes em `TESTES.md`).

## 1. Abrir o painel

```bash
npm run hyperframes
```

Abre `http://localhost:3020` com quatro abas:

| Aba | O que tem |
|---|---|
| **Criação** | Sua marca (logo, foto, manual), vídeos para editar, assets e vídeos editados. Arraste arquivos para enviar. |
| **Estilos** | Todos os comandos (`/comecar`, `/estilo-…`, os seus estilos salvos) com botão **Copiar**: cole no Claude Code. |
| **Projetos** | Criar projeto, **abrir no editor** (HyperFrames Studio), check, rascunho e render 4K. |
| **Elementos** | Os 108 elementos com preview. "Usar no projeto" anota em `ELEMENTOS.md` do projeto ativo. |
| **Catálogo HyperFrames** | Os ~390 blocos e componentes oficiais. "Adicionar ao projeto" instala na pasta do projeto. |

## 2. Pastas

```
0-MARCA/                     MANUAL-DA-MARCA.md (cores, fontes, @, preferências de edição) + assets/ (logo, foto, design system)
1-MATERIAIS-PARA-EDITAR/     vídeos brutos e áudios
2-ASSETS/                    imagens, b-roll, trilhas, sfx
3-EDITADOS/                  renders finais (4K)
4-ELEMENTOS/                 os 108 elementos (preview, código, PEDIR.md) + VITRINE.html
5-PROJETOS/                  um projeto HyperFrames por vídeo
_SISTEMA/                    skills, ferramentas e modelos (não precisa mexer)
```

## 3. Atalhos de terminal

```bash
npm run novo -- "Reel automação" 9:16 meu-bruto.MOV
npm run editor -- reel-automacao
npm run usar -- LEG-01 reel-automacao
npm run catalogo -- caption
npm run check -- reel-automacao
npm run render -- reel-automacao delivery
```

## 4. Pedir a edição

Abra o Claude Code nesta pasta e peça, por exemplo:

```text
Edita o projeto reel-automacao no estilo split explicativo.
Usa os elementos do ELEMENTOS.md e a minha marca. Me mostra o plano de cortes antes.
```

`0-MARCA/exemplo-julio/` é um exemplo de marca preenchida.

## 5. As skills do curso

| Camada | Skills |
|---|---|
| Núcleo | `comecar`, `configurar-marca`, `preparar-projeto`, `limpar-bruto`, `revisar-e-entregar`, `criar-estilo` |
| Estilos | `estilo-split-explicativo`, `estilo-minimalista-pontilhado`, `estilo-3d-camadas`, `estilo-motion-cards`, `estilo-recorte-3d`, `estilo-bruto-editado`, `estilo-aula-moldura` |
| Peças | `escolher-elementos`, `imagens-ia`, `trilha-e-sfx` |

Primeira vez? Rode `/comecar` no Claude Code: ele define sua identidade visual e o objetivo dos seus vídeos.

Todo visual aprovado pode virar um comando seu: `/criar-estilo` (ou **Salvar como estilo** na aba Projetos) cria `/estilo-<nome>` em `_SISTEMA/skills/meus-estilos/`.

Cada estilo traz um `exemplo.mp4` em `_SISTEMA/skills/estilos/<estilo>/assets/`. O mapa completo de qual skill usar está no `AGENTS.md`.
