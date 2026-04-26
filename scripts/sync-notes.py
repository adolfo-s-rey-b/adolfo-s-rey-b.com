#!/usr/bin/env python3
"""
sync-notes.py — Sincroniza notas de la bóveda de Obsidian al sitio web.

Lee data/obsidian-sync.json para los mapeos. Para cada mapeo activo:
  1. Recolecta archivos .md de la bóveda (recursivo si flatten=true)
  2. Compara con archivos en content/notes/<subject>/
  3. Copia archivos nuevos o modificados, inyectando frontmatter YAML si falta
  4. Convierte sintaxis Obsidian → Markdown estándar
  5. Crea _meta.json si no existe

Exit code: 0 si no hubo cambios, 1 si hubo cambios (para trigger de cron)
"""

import json
import os
import re
import shutil
import sys
from datetime import datetime
from pathlib import Path

# ── Rutas ──────────────────────────────────────────────────────────────────────
SCRIPT_DIR = Path(__file__).parent
WEBSITE_ROOT = SCRIPT_DIR.parent
CONFIG_FILE = WEBSITE_ROOT / "data" / "obsidian-sync.json"


# ── Helpers ────────────────────────────────────────────────────────────────────

def load_config():
    with open(CONFIG_FILE, "r", encoding="utf-8") as f:
        return json.load(f)


def slugify(text: str) -> str:
    """Convierte texto a slug: minúsculas, sin tildes, espacios→guiones."""
    replacements = {
        "á": "a", "é": "e", "í": "i", "ó": "o", "ú": "u",
        "Á": "a", "É": "e", "Í": "i", "Ó": "o", "Ú": "u",
        "ñ": "n", "Ñ": "n", "ü": "u", "Ü": "u",
    }
    for char, replacement in replacements.items():
        text = text.replace(char, replacement)
    text = text.lower()
    text = re.sub(r"[^a-z0-9\s-]", "", text)
    text = re.sub(r"[\s_-]+", "-", text)
    return text.strip("-")


def title_from_filename(filename: str) -> str:
    """Extrae un título limpio del nombre del archivo."""
    name = Path(filename).stem
    # Quitar prefijos tipo "01 -", "Capítulo 01 -", "01." al inicio
    name = re.sub(r"^[\d\s.]+[-–]\s*", "", name)
    # Normalizar espacios múltiples
    name = re.sub(r"\s+", " ", name)
    # Guiones y underscores → espacios
    name = name.replace("_", " ")
    return name.strip()


def infer_order_from_filename(filename: str, existing_orders: list) -> int:
    """Infiere el order desde el número en el nombre del archivo.

    Busca patrones como: "Capítulo 01", "01 -", "Parte 3", etc.
    """
    stem = Path(filename).stem
    # Buscar el primer número que aparezca en el nombre (incluyendo "Capítulo 01", "Parte 3", etc.)
    match = re.search(r"\b(\d+)\b", stem)
    if match:
        return int(match.group(1))
    # Si no hay número, usar el siguiente disponible
    return (max(existing_orders) + 1) if existing_orders else 1


def has_frontmatter(content: str) -> bool:
    return content.strip().startswith("---")


def parse_frontmatter(content: str) -> tuple[dict, str]:
    """Extrae frontmatter YAML. Retorna (metadata_dict, body_str)."""
    if not has_frontmatter(content):
        return {}, content
    lines = content.split("\n")
    end_idx = None
    for i, line in enumerate(lines[1:], start=1):
        if line.strip() == "---":
            end_idx = i
            break
    if end_idx is None:
        return {}, content
    fm_text = "\n".join(lines[1:end_idx])
    body = "\n".join(lines[end_idx + 1:])
    # Parseo simple de YAML (key: value)
    meta = {}
    for line in fm_text.split("\n"):
        if ":" in line:
            key, _, value = line.partition(":")
            key = key.strip()
            value = value.strip().strip('"').strip("'")
            if key and value:
                # Intentar convertir a int si es posible
                try:
                    meta[key] = int(value)
                except ValueError:
                    meta[key] = value
    return meta, body


def build_frontmatter(title: str, description: str, order: int) -> str:
    return f'---\ntitle: "{title}"\ndescription: "{description}"\norder: {order}\n---\n'


def convert_obsidian_to_standard(content: str) -> str:
    """Convierte sintaxis Obsidian a Markdown estándar."""
    # Wikilinks con alias: [[Destino|Alias]] → [Alias](Destino)
    content = re.sub(
        r"\[\[([^\]|]+)\|([^\]]+)\]\]",
        lambda m: f"[{m.group(2)}]({slugify(m.group(1))})",
        content,
    )
    # Wikilinks simples: [[Nota]] → Nota (texto plano)
    content = re.sub(r"\[\[([^\]]+)\]\]", r"\1", content)
    # Embeds de imágenes: ![[imagen.png]] → (eliminar)
    content = re.sub(r"!\[\[[^\]]*\]\]", "", content)
    # Callouts de Obsidian: > [!note] → > **Nota:**
    callout_map = {
        "note": "Nota", "info": "Info", "tip": "Consejo",
        "warning": "Advertencia", "danger": "Peligro",
        "example": "Ejemplo", "quote": "Cita", "abstract": "Resumen",
    }
    for callout_type, label in callout_map.items():
        content = re.sub(
            rf"> \[!{callout_type}\]",
            f"> **{label}:**",
            content,
            flags=re.IGNORECASE,
        )
    # Tags de Obsidian al inicio de línea: #tag → (eliminar)
    content = re.sub(r"(?<!\S)#([a-zA-ZáéíóúÁÉÍÓÚñÑ][a-zA-Z0-9_-]*)", "", content)
    # Limpiar líneas en blanco múltiples (máximo 2 consecutivas)
    content = re.sub(r"\n{3,}", "\n\n", content)
    return content


def get_existing_orders(subject_dir: Path) -> list:
    """Retorna lista de orders de las lecciones existentes."""
    orders = []
    for md_file in subject_dir.glob("*.md"):
        if md_file.name == "_meta.json":
            continue
        content = md_file.read_text(encoding="utf-8")
        meta, _ = parse_frontmatter(content)
        if "order" in meta:
            try:
                orders.append(int(meta["order"]))
            except (ValueError, TypeError):
                pass
    return orders


def ensure_meta_json(subject_dir: Path, subject_id: str):
    """Crea _meta.json básico si no existe."""
    meta_file = subject_dir / "_meta.json"
    if not meta_file.exists():
        meta = {
            "title": subject_id.replace("-", " ").title(),
            "professor": "",
            "semester": "",
            "description": f"Notas de {subject_id.replace('-', ' ').title()}",
        }
        meta_file.write_text(json.dumps(meta, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
        print(f"  [nuevo] _meta.json creado en {subject_dir.name}/")


def process_mapping(mapping: dict, vault_root: Path, notes_root: Path) -> int:
    """Procesa un mapeo. Retorna número de archivos copiados/actualizados."""
    subject = mapping["subject"]
    vault_rel = mapping["vaultPath"]
    flatten = mapping.get("flatten", True)

    vault_path = vault_root / vault_rel
    subject_dir = notes_root / subject

    if not vault_path.exists():
        print(f"[WARN] Ruta de bóveda no existe, omitiendo: {vault_path}")
        return 0

    # Recolectar archivos .md de la bóveda
    if flatten:
        source_files = sorted(vault_path.rglob("*.md"))
    else:
        source_files = sorted(vault_path.glob("*.md"))

    if not source_files:
        print(f"  [info] {subject}: no hay archivos .md en la bóveda")
        return 0

    subject_dir.mkdir(parents=True, exist_ok=True)
    ensure_meta_json(subject_dir, subject)

    existing_orders = get_existing_orders(subject_dir)
    copied = 0

    for src_file in source_files:
        # Determinar nombre de archivo destino
        dest_filename = slugify(src_file.stem) + ".md"
        dest_file = subject_dir / dest_filename

        # Leer contenido original
        content = src_file.read_text(encoding="utf-8")

        # Convertir sintaxis Obsidian
        content = convert_obsidian_to_standard(content)

        # Verificar si ya tiene frontmatter
        if has_frontmatter(content):
            meta, body = parse_frontmatter(content)
            # Verificar que tenga los campos requeridos
            if "title" not in meta or "order" not in meta:
                title = meta.get("title", title_from_filename(src_file.name))
                description = meta.get("description", "")
                order = meta.get("order", infer_order_from_filename(src_file.name, existing_orders))
                existing_orders.append(int(order))
                new_fm = build_frontmatter(title, description, int(order))
                content = new_fm + "\n" + body.lstrip("\n")
        else:
            # Inyectar frontmatter
            title = title_from_filename(src_file.name)
            order = infer_order_from_filename(src_file.name, existing_orders)
            existing_orders.append(order)
            new_fm = build_frontmatter(title, "", order)
            content = new_fm + "\n" + content.lstrip("\n")

        # Comparar con destino existente
        should_copy = True
        if dest_file.exists():
            existing_content = dest_file.read_text(encoding="utf-8")
            if existing_content == content:
                should_copy = False

        if should_copy:
            dest_file.write_text(content, encoding="utf-8")
            action = "actualizado" if dest_file.exists() else "nuevo"
            print(f"  [{action}] {subject}/{dest_filename}  (desde: {src_file.name})")
            copied += 1

    return copied


# ── Main ───────────────────────────────────────────────────────────────────────

def main():
    print(f"sync-notes.py — {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print(f"Config: {CONFIG_FILE}")
    print()

    config = load_config()
    vault_root = Path(config["vaultRoot"])
    notes_root = Path(config["notesRoot"])

    if not vault_root.exists():
        print(f"[ERROR] vaultRoot no existe: {vault_root}")
        sys.exit(2)

    total_changed = 0

    for mapping in config.get("mappings", []):
        if not mapping.get("enabled", True):
            print(f"[skip] {mapping['subject']} (disabled)")
            continue

        print(f"Procesando: {mapping['subject']} → {mapping['vaultPath']}")
        changed = process_mapping(mapping, vault_root, notes_root)
        total_changed += changed

        if changed == 0:
            print(f"  Sin cambios.")
        else:
            print(f"  {changed} archivo(s) procesado(s).")
        print()

    print(f"Total: {total_changed} archivo(s) modificado(s).")

    # Exit code 1 = hubo cambios (trigger de rebuild en cron)
    # Exit code 0 = sin cambios
    sys.exit(1 if total_changed > 0 else 0)


if __name__ == "__main__":
    main()
