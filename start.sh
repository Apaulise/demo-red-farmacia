#!/bin/zsh
export PATH="$HOME/.local/bin:/opt/homebrew/bin:/usr/local/bin:$PATH"
cd ~/Proyectos/demo-red-farmacias
claude --model opus --effort high --permission-mode auto --remote-control "Demo Red Farmacias" -n "Demo Red Farmacias" "Leé BRIEF.md y construí la demo completa que describe, de punta a punta, sin pedirme confirmaciones salvo que algo sea imposible. Primero escribí el plan en STATUS.md y avisale a Mr. Pou, después ejecutá todo."
