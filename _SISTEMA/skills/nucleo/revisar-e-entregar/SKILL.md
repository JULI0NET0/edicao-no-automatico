---
name: revisar-e-entregar
description: Etapa final de qualquer vídeo do framework Edição no Automático — revisão visual (snapshot e contact sheet), check do HyperFrames, rascunho para aprovação, render 4K, áudio a −14 LUFS e entrega em 3-EDITADOS. Use quando o aluno disser "renderiza", "exporta", "manda o final", "está pronto?", "revisa", ou quando uma skill de estilo chegar ao fim.
---

# Revisar e entregar

## 1. Revisão (antes de qualquer render)

- `npx hyperframes check` no projeto: meta **0 erros**. Avisos de texto atrás do recorte são esperados nos palcos de pôster.
- `npx hyperframes snapshot --at <meio de cada beat> --no-end` e **leia** o contact sheet. Procure:
  - legenda sobre gráfico ou fora da área segura (topo ~200 px e base ~350 px no 9:16 ficam sob a interface do Instagram);
  - elemento entrando cedo/tarde em relação à palavra;
  - cor fora do `MANUAL-DA-MARCA.md`; dado sem "ILUSTRATIVO"; handle diferente do manual;
  - cena parada por mais de ~5 s.
- Preencha `_SISTEMA/modelos/ficha-revisao.md` (copie para o projeto) e corrija antes de seguir.

## 2. Rascunho (portão de aprovação)

```bash
cd 5-PROJETOS/<slug> && npx hyperframes render --quality draft -o renders/rascunho.mp4
```
Meça a mixagem: `ffmpeg -i renders/rascunho.mp4 -af ebur128 -f null - 2>&1 | tail -12`. É o único jeito de ouvir voz × trilha × SFX. Mostre ao aluno e espere o OK.

## 3. Final 4K

```bash
bash _SISTEMA/skills/nucleo/revisar-e-entregar/scripts/finalizar-4k.sh 5-PROJETOS/<slug> <nome>
```
Faz check → render 4K `delivery` no formato da composição (9:16, 16:9 ou 1:1) → loudnorm em 2 passes (−14 LUFS, pico −1 dBFS) → copia para `3-EDITADOS/<nome>.mp4`. Leva ~5 min a cada 50 s de vídeo; rode em background.

Também dá pelo painel: aba Projetos → **Render 4K** (sem o loudnorm; prefira o script para a entrega).

## 4. Conferir o arquivo final

- `ffprobe`: 2160×3840 (9:16), 3840×2160 (16:9) ou 2160×2160 (1:1); duração = root.
- `ebur128`: integrado ≈ −14 LUFS.
- 6 frames do **arquivo renderizado** + um recorte 1:1 do rosto para provar que é 4K de verdade.
- Versão sem trilha, se o estilo pedir (minimalista).

## 5. Salvar o visual como estilo
Se o vídeo foi aprovado e o visual é novo (não é só repetição de um estilo existente), pergunte: "quer salvar esse visual como estilo? Vira o comando `/estilo-<nome>`". Se sim, siga a skill `criar-estilo`.

## Checklist
- [ ] Transcrição em português conferida
- [ ] Cortes e plano visual aprovados
- [ ] check 0 erros; todos os beats vistos em snapshot
- [ ] Só cores/fontes do manual; handle exato
- [ ] Rascunho aprovado
- [ ] 4K, −14 LUFS, em `3-EDITADOS/`
