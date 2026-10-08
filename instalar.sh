#!/usr/bin/env bash
# Instala o framework Edição no Automático nesta pasta.
# Uso: bash instalar.sh
# - confere Node 20+, ffmpeg e Chrome do HyperFrames
# - instala as skills do HyperFrames (hyperframes, media-use, …) para Claude Code e Codex
# - liga as skills do curso (_SISTEMA/skills/) em .claude/skills e .agents/skills desta pasta
set -euo pipefail
cd "$(dirname "$0")"
RAIZ="$(pwd)"
HF="hyperframes@$(node -p 'require("./package.json").config.hyperframes' 2>/dev/null || echo latest)"
ok(){ printf "  \033[38;5;208m✓\033[0m %s\n" "$1"; }
falta(){ printf "  \033[31m✗\033[0m %s\n" "$1"; FALTOU=1; }
FALTOU=0

echo; echo "Edição no Automático — instalação"; echo

# 1. dependências
if command -v node >/dev/null && [ "$(node -p 'process.versions.node.split(".")[0]')" -ge 20 ]; then ok "Node $(node -v)"; else falta "Node 20 ou mais novo (https://nodejs.org)"; fi
if command -v ffmpeg >/dev/null; then ok "ffmpeg"; else
  if [ "$(uname)" = "Darwin" ]; then falta "ffmpeg — instale com: brew install ffmpeg"; else falta "ffmpeg — instale pelo gerenciador do sistema"; fi
fi
[ "$FALTOU" = 1 ] && { echo; echo "Instale o que falta e rode de novo."; exit 1; }

# 2. skills do HyperFrames (globais, para todas as ferramentas de IA)
echo; echo "→ skills do HyperFrames"
npx --yes "$HF" skills || echo "  (não deu para instalar agora; rode depois: npx $HF skills)"

# 3. skills do curso, ligadas nesta pasta
echo; echo "→ skills do curso"
for alvo in .claude/skills .agents/skills; do
  mkdir -p "$alvo"
  for s in _SISTEMA/skills/*/*/; do
    nome="$(basename "$s")"
    [ -f "$s/SKILL.md" ] || continue
    ln -sfn "../../${s%/}" "${alvo:?}/${nome:?}"
  done
done
for s in _SISTEMA/skills/*/*/SKILL.md; do ok "$(basename "$(dirname "$s")")"; done

# 4. pastas de trabalho
mkdir -p _SISTEMA/skills/meus-estilos 0-MARCA/assets 1-MATERIAIS-PARA-EDITAR 2-ASSETS/{imagens,broll,trilhas,sfx} 3-EDITADOS 5-PROJETOS

# 5. ambiente de render (Chrome do HyperFrames)
echo; echo "→ checando o ambiente de render"
npx --yes "$HF" doctor 2>&1 | grep -v -i "docker\|Some checks failed\|optional" | tail -10 || true
echo "  (Docker não é necessário: só serve para render na nuvem.)"

echo
echo "Pronto. Próximos passos:"
echo "  0. npm run testar               (confere se está tudo certo, ~2 min)"
echo "  1. npm run hyperframes          (abre o painel)"
echo "  2. arraste seu logo e sua foto para o bloco Marca"
echo "  3. abra o Claude Code nesta pasta e peça: configura minha marca"
echo
