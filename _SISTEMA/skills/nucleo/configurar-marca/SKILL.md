---
name: configurar-marca
description: Cria ou atualiza o 0-MARCA/MANUAL-DA-MARCA.md do framework Edição no Automático — o arquivo que todas as skills de estilo leem (cores, fontes, handle, logo, avatar, tom). Lê o que o aluno colocou em 0-MARCA/assets (logo, foto de perfil, design system, manual próprio) ou, se a pasta estiver vazia, faz uma entrevista curta e propõe direções. Use quando o aluno disser "configura minha marca", "minha identidade visual", "troca minhas cores", "meu logo", ou quando qualquer skill de estilo encontrar o manual ausente ou incompleto.
---

# Configurar marca

Todo vídeo do framework usa **um único arquivo de marca**: `0-MARCA/MANUAL-DA-MARCA.md`. As skills de estilo nunca têm cor, fonte ou @ fixos; elas leem esse manual. Esta skill cria esse arquivo.

## Antes de começar

1. Leia `0-MARCA/MANUAL-DA-MARCA.md`, se existir. Se estiver completo e o aluno só quer trocar um item, edite só esse item e pule para "Aplicar".
2. Liste `0-MARCA/assets/`. Isso decide o caminho:
   - **Tem material** (logo, foto, PDF/print de design system, manual próprio, link do site) → **Caminho A**.
   - **Vazio** → **Caminho B** (entrevista).
3. O exemplo preenchido está em `0-MARCA/exemplo-julio/MANUAL-DA-MARCA.md`. Use como modelo de nível de detalhe, nunca como resposta.

## Caminho A — ler o material

1. **Logo** (svg/png): extraia as cores reais. SVG: leia os `fill`/`stroke`. PNG: `ffmpeg -i logo.png -vf "palettegen=max_colors=6:reserve_transparent=1" paleta.png` e leia a paleta. Anote qual versão é para fundo escuro e qual para claro.
2. **Design system / manual** (PDF, md, print, Figma export): leia hex, fontes, regras ("nunca usar…"). Isso vale mais que o que você deduzir do logo.
3. **Site** (se o aluno der o link): pegue cores e fontes do CSS (`hyperframes capture <url>` ajuda).
4. **Foto de perfil**: gere `0-MARCA/avatar.jpg` 1024×1024, recorte quadrado com **a cabeça inteira e um pouco de ombro** (nada de close no rosto). Confira olhando antes de salvar.
5. Monte o manual (formato abaixo). Onde faltar informação, proponha e marque `# sugerido`.

## Caminho B — entrevista (uma mensagem, até 8 perguntas)

1. Nicho e público (o que você ensina/vende, para quem).
2. @ principal e nome que aparece nos vídeos.
3. Três adjetivos da marca.
4. Duas ou três referências que você admira (perfis, marcas).
5. Uma cor que você gosta e uma que você não quer de jeito nenhum.
6. Mais sério ou mais divertido (1 a 5)?
7. Tem foto de perfil? (peça para jogar em `0-MARCA/assets/`)
8. Tem logo? Se não, o nome em texto serve como logo.

Depois de escolhida a direção, pergunte (opcional) as **preferências de edição**: onde fica a animação no split, como quer o end card, o que quer aprovar antes, se quer versão sem trilha, grafias de nomes. Grave na seção "Preferências de edição". Sempre que o aluno corrigir algo durante uma edição ("não, o painel fica em cima"), ofereça salvar ali.

Depois proponha **3 direções** numa prancha HTML (ver "Prévia"): cada uma com paleta de 6 cores + par de fontes + exemplo de legenda e end card. Regras para propor:
- 1 cor de **acento** só. Ela é luz e destaque, **nunca fundo dominante**.
- Fundo escuro ou claro neutro; texto com contraste ≥ 4.5:1 sobre o fundo.
- Fontes: use as embutidas no renderer do HyperFrames sempre que possível (Montserrat, Inter, League Gothic, Playfair Display, EB Garamond, JetBrains Mono). Fonte fora da lista exige `@font-face` com o arquivo em `0-MARCA/fontes/`.

O aluno escolhe uma; gere o manual dela.

## Formato do manual (as skills dependem dele)

O bloco `yaml` é lido pelo script `aplicar-marca.mjs`. Mantenha as chaves exatamente assim.

````markdown
# Manual da marca — <Nome>

```yaml
nome: <Nome que aparece no vídeo>
handle: "@seuhandle"
cores:
  fundo: "#0A0A0A"
  superficie: "#1C1C1C"
  acento: "#F97316"
  texto: "#FFFFFF"
  texto-secundario: "#A8A8A8"
  borda: "#282828"
fontes:
  titulo: League Gothic
  corpo: Montserrat
  destaque: Playfair Display
logo:
  escuro: 0-MARCA/assets/logo-fundo-escuro.png
  claro: 0-MARCA/assets/logo-fundo-claro.png
  icone: 0-MARCA/assets/icone.png
avatar: 0-MARCA/avatar.jpg
```

## Objetivo
- **Tema / Público / O vídeo precisa / Plataformas e formato / CTA padrão / Ritmo de postagem** (preenchido pela skill `comecar`)

## Tom de voz
<2–4 linhas>

## Regras de uso
- <como o acento é usado; o que nunca fazer>

## Proibições
- <cores vetadas, palavras, estilos>

## Preferências de edição
- <como o aluno gosta de editar: layout do split, end card, o que sempre aprovar antes, versões extras, grafias de nomes>
````

## Prévia (sempre mostrar antes de salvar como definitivo)

Gere `0-MARCA/previa.html` (1080×1920) com: paleta em amostras, os três pesos de fonte, uma legenda karaokê com a palavra ativa no acento, o end card com avatar + nome + handle + botão seguir. Tire um snapshot (`npx hyperframes snapshot` num projeto temporário ou screenshot no navegador) e mostre ao aluno. Só grave o manual final depois do OK.

## Aplicar

O manual vale para os **próximos** vídeos automaticamente. Para converter um projeto que já usa as cores do exemplo (preto + laranja do Julio):

```bash
node _SISTEMA/skills/nucleo/configurar-marca/scripts/aplicar-marca.mjs 5-PROJETOS/<slug>
```

Ele troca, nos `.html` / `.mjs` do projeto, as cores, fontes e `{{HANDLE}}` / `{{NOME}}` do exemplo pelas do manual (mapa em `references/mapa-de-tokens.md`) e lista o que trocou. Depois rode `npx hyperframes check` e confira um snapshot.

## Checklist

- [ ] Hex conferidos (não "parecidos": os do logo/manual)
- [ ] Acento só como destaque; contraste do texto ok
- [ ] Avatar com a cabeça inteira
- [ ] Handle escrito exatamente como o aluno usa (não "corrija" a grafia)
- [ ] Prévia aprovada pelo aluno
