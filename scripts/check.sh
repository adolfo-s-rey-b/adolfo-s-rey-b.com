#!/usr/bin/env bash
# check.sh — invariantes de contenido del rediseño 2026.
# Corre con `npm run check`. Cada regla corresponde a un ítem del §11 del spec.
set -uo pipefail

cd "$(dirname "$0")/.."

fail=0

# Ámbito: código y datos. Se excluye el contenido de las notas (español, del
# vault de Obsidian) y los comentarios de research.json, que describen los
# pendientes citando literalmente el spec.
SCOPE=(src/ data/ public/_redirects)

check() {
  local label="$1" pattern="$2"
  shift 2
  local hits
  hits=$(grep -rniE "$pattern" "${SCOPE[@]}" 2>/dev/null | grep -v '^\s*//' | grep -vF '"_comment' || true)
  if [ -n "$hits" ]; then
    printf '  ✗ %s\n' "$label"
    printf '%s\n' "$hits" | head -5 | sed 's/^/      /'
    fail=1
  else
    printf '  ✓ %s\n' "$label"
  fi
}

echo "Invariantes de contenido:"
check "sin el morado antiguo (#5e026e / #7b0391)"        '5e026e|7b0391'
check "sin el coautor inventado"                          'ficticio'
check "sin menciones a consultoría"                       'consultor[íi]a|consulting'
check "sin los nombres prohibidos del §3.4"               'hofstetter|villamizar|riascos'
check "sin el paper que no existe"                        'Regulaci[óo]n Macroprudencial en el Ecosistema'
check "sin Coursera, Semilleros ni bachillerato"          'certifications\.json|semilleros|gimnasio moderno'
check "sin el correo de Colombia Fintech en la home"      'colombiafintech\.co.*home'
check "sin lucide-react"                                  'lucide-react'
check "sin estilos prohibidos por el §6.1"                'rounded-(xl|2xl|3xl|full)|shadow-(sm|md|lg|xl)|backdrop-|animate-'

echo
echo "Rutas:"
# Las rutas viejas solo pueden aparecer como ORIGEN de un redirect.
old=$(grep -rniE 'teoria-juegos|/notes/macroeconomia|/notes/microeconomia|"/blog|"/github' src/ data/ 2>/dev/null || true)
if [ -n "$old" ]; then
  printf '  ✗ rutas viejas referenciadas fuera de _redirects\n'
  printf '%s\n' "$old" | head -5 | sed 's/^/      /'
  fail=1
else
  printf '  ✓ ninguna ruta vieja fuera de _redirects\n'
fi

# Ninguna vista puede tocar el sistema de archivos: arrastraría fs al bundle.
fsleak=$(grep -rnE "require\('fs'\)|from 'fs'|lib/markdown" src/views/ 2>/dev/null || true)
if [ -n "$fsleak" ]; then
  printf '  ✗ una vista importa fs o lib/markdown (rompería el build)\n'
  printf '%s\n' "$fsleak" | sed 's/^/      /'
  fail=1
else
  printf '  ✓ ninguna vista importa fs ni lib/markdown\n'
fi

echo
[ "$fail" -eq 0 ] && echo "OK" || echo "FALLA"
exit "$fail"
