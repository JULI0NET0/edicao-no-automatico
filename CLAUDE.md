# Edição no Automático — instruções para o agente

Esta pasta é um framework de edição de vídeo com IA em **HyperFrames** (vídeo em HTML). O aluno joga o material, escolhe estilo e elementos, e você edita. Idioma de trabalho: português.

**Sempre carregue a skill antes de editar. Não improvise o fluxo.** As skills estão em `_SISTEMA/skills/` (instaladas em `.claude/skills/` e `.agents/skills/` pelo `instalar.sh`).

## Primeiro passo de todo pedido

1. `0-MARCA/MANUAL-DA-MARCA.md` existe? Se não → skill **`comecar`** antes de tudo (identidade visual + objetivo). Se existe, leia a seção **Preferências de edição**: ela vale mais que o padrão de qualquer skill.
2. Vídeo novo → **`preparar-projeto`**: confirma identidade visual e objetivo do vídeo, cria `5-PROJETOS/<slug>/`, BRIEF e transcrição em português.
3. A aba **Estilos** do painel tem o comando de cada skill pronto para copiar (`/estilo-… edita o <arquivo>`).

## Qual skill usar

| Pedido | Skill |
|---|---|
| Primeiro uso, "por onde começo", configurar tudo (identidade + objetivo) | `comecar` |
| "configura minha marca", logo, cores, foto de perfil | `configurar-marca` |
| Bruto novo, "edita esse vídeo" (ponto de partida) | `preparar-projeto` |
| Cortar erros, silêncios, repetições | `limpar-bruto` |
| Pessoa falando pra câmera, reel com painel em cima | `estilo-split-explicativo` |
| Só a voz, animação em pontos, "sem eu aparecer" | `estilo-minimalista-pontilhado` |
| Pilha de painéis 3D, "camadas" | `estilo-3d-camadas` |
| Lista animada, cards numerados com ícones | `estilo-motion-cards` |
| Pessoa recortada na frente de título gigante | `estilo-recorte-3d` |
| Antes/depois da edição, lettering grande | `estilo-bruto-editado` |
| Aula, tutorial, YouTube 16:9 com moldura | `estilo-aula-moldura` |
| Escolher/usar elementos (`LEG-01`, `TRA-05`…) | `escolher-elementos` |
| Imagens geradas para o vídeo | `imagens-ia` |
| Trilha, efeitos sonoros, mixagem | `trilha-e-sfx` |
| Revisar, renderizar, exportar 4K | `revisar-e-entregar` |
| "salva esse estilo", repetir um visual aprovado | `criar-estilo` (vira `/estilo-<nome>` em `_SISTEMA/skills/meus-estilos/`) |
| Qualquer `/estilo-…` criado pelo aluno | a skill de mesmo nome em `_SISTEMA/skills/meus-estilos/` |
| Qualquer coisa técnica de HyperFrames | `hyperframes` (roteia para core, animation, cli, registry, media-use) |

Cada estilo tem um `assets/exemplo*/exemplo.mp4`: mostre ao aluno quando ele estiver em dúvida entre estilos.

## Pastas

| Pasta | O que é |
|---|---|
| `0-MARCA/` | `MANUAL-DA-MARCA.md` (fonte única de cores, fontes, handle, logo, avatar), `assets/` (material do aluno), `exemplo-julio/` (modelo preenchido) |
| `1-MATERIAIS-PARA-EDITAR/` | brutos e áudios |
| `2-ASSETS/` | imagens, b-roll, trilhas, sfx reaproveitáveis |
| `3-EDITADOS/` | entregas finais |
| `4-ELEMENTOS/` | os 108 elementos (`catalogo.json`, uma pasta por código, `VITRINE.html`) |
| `5-PROJETOS/<slug>/` | projeto HyperFrames de cada vídeo, com `BRIEF.md`, `ELEMENTOS.md`, `STORYBOARD.md` |
| `_SISTEMA/modelos/` | briefing, storyboard, ficha de revisão, prompts prontos |
| `_SISTEMA/` | `skills/` (nucleo, estilos, pecas), `ferramentas/` (painel, testes), `modelos/` |

## Regras que valem sempre

- **Marca:** nenhuma cor, fonte ou @ fora do manual. Exemplos das skills estão na marca do Julio: traduza pelo `_SISTEMA/skills/nucleo/configurar-marca/references/mapa-de-tokens.md` ou rode `aplicar-marca.mjs` no projeto.
- **Portões de aprovação:** plano de cortes → plano visual (com elementos) → imagens que custam créditos → rascunho → 4K. Espere o OK do aluno em cada um.
- **Transcrição** sempre `--language pt --model medium`, e leia o texto.
- **Confira olhando:** nenhum trecho está pronto sem `snapshot` lido; `npx hyperframes check` com 0 erros.
- **Não invente dado:** gráfico fictício leva "ILUSTRATIVO"; sem logos de terceiros.
- **Antes de construir à mão,** procure nos 108 elementos e no catálogo HyperFrames (`npm run catalogo -- <termo>`).
- **Ferramentas pagas** (Magnific, Palmier, HeyGen) são opcionais; ofereça o caminho gratuito.
- **Entrega:** 4K, áudio −14 LUFS, em `3-EDITADOS/`.

## Comandos

```bash
npm run hyperframes                          # painel: criação, projetos, elementos, catálogo
npm run novo -- "Nome" 9:16 <arquivo>         # cria projeto
npm run editor -- <slug>                     # HyperFrames Studio
npm run usar -- LEG-01 <slug>                # registra elemento no projeto
npm run catalogo -- <termo>                  # busca no catálogo HyperFrames
npm run check -- <slug>
bash _SISTEMA/skills/nucleo/revisar-e-entregar/scripts/finalizar-4k.sh 5-PROJETOS/<slug> <nome>
```
