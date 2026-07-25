#!/usr/bin/env bash

set -e

CHOICE="$1"

function print_header() {
  echo "=========================================="
  echo "   🎵 GERENCIADOR DE CONTAINERS - MISSA   "
  echo "=========================================="
}

if [ -z "$CHOICE" ]; then
  print_header
  echo "Escolha como deseja rodar o projeto:"
  echo " 1) Subir TODOS os containers (MongoDB + Backend + Frontend)"
  echo " 2) Subir apenas o MONGODB (Docker)"
  echo " 3) Subir apenas o BACKEND (Docker + MongoDB)"
  echo " 4) Subir apenas o FRONTEND (Docker)"
  echo " 5) Subir MongoDB (Docker) + Backend/Frontend (LOCAL)"
  echo " 6) Ver LOGS dos containers"
  echo " 7) PARAR todos os containers (docker compose down)"
  echo " 0) Sair"
  echo "=========================================="
  read -r -p "Opção [0-7]: " CHOICE
fi

case "$CHOICE" in
  1|all|up)
    echo "🚀 Subindo TODOS os containers via Docker Compose..."
    docker compose up --build
    ;;
  2|mongo|mongodb)
    echo "🍃 Subindo container do MONGODB..."
    docker compose up -d mongodb
    echo "✅ MongoDB rodando em mongodb://localhost:27017"
    ;;
  3|backend)
    echo "⚙️ Subindo container do BACKEND (e MongoDB)..."
    docker compose up --build backend
    ;;
  4|frontend)
    echo "🎨 Subindo container do FRONTEND..."
    docker compose up --build frontend
    ;;
  5|dev|local)
    echo "🍃 Garantindo que o MongoDB está rodando no Docker..."
    docker compose up -d mongodb
    echo "⚡ Iniciando desenvolvimento local (Turborepo)..."
    npm run dev
    ;;
  6|logs)
    echo "📋 Exibindo logs dos containers..."
    docker compose logs -f
    ;;
  7|down|stop)
    echo "🛑 Parando todos os containers..."
    docker compose down
    ;;
  0|exit)
    echo "Até logo!"
    exit 0
    ;;
  *)
    echo "❌ Opção inválida: $CHOICE"
    exit 1
    ;;
esac
