#!/usr/bin/env bash
# Edição no Automático — instalação em um comando.
#
#   curl -fsSL https://raw.githubusercontent.com/JULI0NET0/edicao-no-automatico/main/instalar-rapido.sh | bash
#
# Baixa o framework em ~/edicao-no-automatico (ou em DESTINO=/outra/pasta), instala, testa e abre o painel.
# Se a pasta já existir, só atualiza (não apaga nada seu).
set -euo pipefail

# Tudo dentro de uma função. Com `curl | bash`, o bash lê o script pelo pipe e comandos internos
# (git, npm, npx) poderiam consumir o resto dele. Assim o script é lido inteiro antes de rodar.
main() {

REPO="${EDICAO_REPO:-https://github.com/JULI0NET0/edicao-no-automatico.git}"
DESTINO="${DESTINO:-$HOME/edicao-no-automatico}"
ABRIR_PAINEL="${ABRIR_PAINEL:-1}"

laranja(){ printf "\033[38;5;208m%s\033[0m\n" "$1"; }
ok(){ printf "  \033[38;5;208m✓\033[0m %s\n" "$1"; }
erro(){ printf "  \033[31m✗ %s\033[0m\n" "$1"; }

echo; laranja "Edição no Automático — instalação"; echo

# 1. sistema e ferramentas
case "$(uname -s)" in
  Darwin) SO=mac ;;
  Linux) SO=linux ;;
  *) erro "Este instalador funciona no Mac e no Linux. No Windows, use o WSL (Ubuntu) e rode de novo lá."; exit 1 ;;
esac
FALTA=()
command -v git >/dev/null || FALTA+=("git")
if command -v node >/dev/null && [ "$(node -p 'process.versions.node.split(".")[0]')" -ge 20 ]; then ok "Node $(node -v)"; else FALTA+=("node"); fi
command -v ffmpeg >/dev/null && ok "ffmpeg" || FALTA+=("ffmpeg")
command -v git >/dev/null && ok "git"
if [ ${#FALTA[@]} -gt 0 ]; then
  echo
  erro "Falta instalar: ${FALTA[*]}"
  if [ "$SO" = mac ]; then
    command -v brew >/dev/null || echo '  1) Instale o Homebrew:  /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"'
    echo "  2) Depois:  brew install ${FALTA[*]}"
  else
    echo "  Ex. (Ubuntu): sudo apt install -y ${FALTA[*]/node/nodejs}   (Node precisa ser 20 ou mais novo: https://nodejs.org)"
  fi
  echo "  E rode este comando de novo."
  exit 1
fi

# 2. baixar (ou atualizar, se já existe)
echo
if [ -d "$DESTINO/.git" ]; then
  laranja "→ A pasta já existe: $DESTINO — vou só atualizar"
  cd "$DESTINO"
  npm run --silent atualizar
  exit 0
elif [ -e "$DESTINO" ] && [ -n "$(ls -A "$DESTINO" 2>/dev/null)" ]; then
  erro "Já existe uma pasta com arquivos em $DESTINO (que não veio daqui)."
  echo "  Escolha outro lugar:  DESTINO=~/Documentos/edicao-no-automatico bash -c \"\$(curl -fsSL https://raw.githubusercontent.com/JULI0NET0/edicao-no-automatico/main/instalar-rapido.sh)\""
  exit 1
fi
laranja "→ Baixando para $DESTINO"
git clone --depth 1 "$REPO" "$DESTINO"
cd "$DESTINO"

# 3. instalar (skills do HyperFrames + skills do curso)
echo
bash instalar.sh

# 4. testar
echo; laranja "→ Conferindo a instalação"
npm run --silent testar -- --rapido || { erro "Algo não passou no teste. Veja as linhas em vermelho acima."; exit 1; }

# 5. pronto
echo
laranja "Tudo pronto!"
echo "  Pasta:  $DESTINO"
echo "  1. Abra o Claude Code (ou o Codex) nesta pasta e digite:  /comecar"
echo "  2. O painel: npm run hyperframes   (abre em http://localhost:3020)"
echo "  3. Para receber novidades do curso:  npm run atualizar"
echo
if [ "$ABRIR_PAINEL" = 1 ] && [ -t 1 ]; then
  laranja "→ Abrindo o painel (Ctrl+C para fechar)"
  npm run --silent hyperframes
fi
}

main "$@"
