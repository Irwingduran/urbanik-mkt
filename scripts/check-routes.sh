#!/bin/bash

# Script para verificar todas las rutas de API
echo "🔍 Verificando rutas de API..."

BASE_URL="${1:-http://localhost:3000}"

# Rutas públicas (sin autenticación)
echo -e "\n📊 Rutas Públicas:"
curl -s "$BASE_URL/api/health" | jq '.' && echo "✅ GET /api/health"
curl -s "$BASE_URL/api/categories" | jq '.length' > /dev/null && echo "✅ GET /api/categories"

# Rutas que pueden fallar sin autenticación
echo -e "\n🔐 Rutas Protegidas (esperan 403/401):"
curl -s -w "\nStatus: %{http_code}\n" "$BASE_URL/api/admin/dashboard" | head -5 && echo "- GET /api/admin/dashboard"

echo -e "\n✅ Verificación completada"
