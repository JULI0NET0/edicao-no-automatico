# Edição no Automático

Framework para editar vídeos com IA: você joga o bruto, escolhe um estilo e **aprova**. O Claude Code (ou o Codex) corta os erros, legenda, anima e entrega em 4K, sempre na **sua** identidade visual.

Feito por [@juli0net0](https://instagram.com/juli0net0) para o curso **Edição no Automático**.

---

## Instalar (um comando)

Abra o **Terminal** e cole:

```bash
curl -fsSL https://raw.githubusercontent.com/JULI0NET0/edicao-no-automatico/main/instalar-rapido.sh | bash
```

Isso baixa tudo para a pasta `edicao-no-automatico` (na sua pasta de usuário), instala as skills, confere se está tudo certo e abre o painel.

**Precisa ter:** Mac ou Linux (no Windows, use o WSL), [Node.js 20+](https://nodejs.org), ffmpeg e o [Claude Code](https://claude.com/claude-code) ou o Codex. No Mac, o que faltar se instala com `brew install node ffmpeg`. O instalador avisa o que estiver faltando.

## Primeiros passos

1. Abra o Claude Code dentro da pasta `edicao-no-automatico` e digite:
   ```text
   /comecar
   ```
   Ele define a sua **identidade visual** (a partir do seu logo e foto, ou com uma entrevista curta) e o **objetivo** dos seus vídeos.
2. Abra o painel:
   ```bash
   npm run hyperframes
   ```
   Arraste o vídeo bruto para **Criação → Vídeos para editar**.
3. Na aba **Estilos**, escolha o vídeo, clique em **Copiar** no estilo que quiser e cole no Claude Code. Ex.:
   ```text
   /estilo-motion-cards edita o meu-video.MOV
   ```
4. Aprove o plano de cortes e o plano visual. O vídeo pronto aparece em `3-EDITADOS/`.
5. Gostou do visual? **Salvar como estilo** (aba Projetos) cria o seu comando `/estilo-<nome>` para repetir nos próximos vídeos.

## Receber novidades

```bash
npm run atualizar
```

Traz as skills, estilos e elementos novos. **Não mexe** na sua marca, nos seus vídeos, projetos e estilos.

## O que vem dentro

| Pasta | O que é |
|---|---|
| `0-MARCA/` | sua identidade visual (`MANUAL-DA-MARCA.md`, logo, foto) |
| `1-MATERIAIS-PARA-EDITAR/` | onde você joga os brutos |
| `2-ASSETS/` | imagens, b-roll, trilhas, efeitos sonoros |
| `3-EDITADOS/` | os vídeos prontos |
| `4-ELEMENTOS/` | 108 elementos animados (legendas, transições, cards, 3D…) |
| `5-PROJETOS/` | um projeto por vídeo (o sistema cuida) |
| `_SISTEMA/` | skills, painel e ferramentas |

**Estilos incluídos:** split explicativo, minimalista pontilhado, motion cards, 3D em camadas, recorte 3D, bruto → editado e aula com moldura (16:9).

## Comandos

| Comando | Para quê |
|---|---|
| `npm run hyperframes` | abre o painel (criação, estilos, projetos, elementos, catálogo) |
| `npm run testar` | confere se a instalação está ok |
| `npm run atualizar` | recebe as novidades do curso |
| `npm run editor -- <projeto>` | abre um projeto no editor HyperFrames |

Mais detalhes em [COMECE-AQUI.md](COMECE-AQUI.md).

## Licença

Uso pessoal para criar os seus vídeos e os dos seus clientes. Não é permitido revender ou redistribuir o framework. Veja [LICENSE](LICENSE). Construído sobre o [HyperFrames](https://hyperframes.heygen.com) (Apache 2.0).
