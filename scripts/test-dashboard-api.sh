#!/bin/bash

# Script para probar el endpoint de dashboard del usuario
# Uso: bash test-dashboard-api.sh <JWT_TOKEN>

TOKEN=${1:-""}

if [ -z "$TOKEN" ]; then
  echo "❌ Uso: bash test-dashboard-api.sh <JWT_TOKEN>"
  echo "Por favor, obtén el token JWT desde las cookies de la sesión autenticada"
  exit 1
fi

API_URL="http://localhost:3000/api/user/dashboard"

echo "🧪 Probando endpoint: $API_URL"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

curl -X GET "$API_URL" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -H "Cookie: next-auth.session-token=$TOKEN" \
  -s | jq .

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Test completado"
