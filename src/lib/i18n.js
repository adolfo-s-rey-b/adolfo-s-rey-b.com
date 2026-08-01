// Resolución de hechos traducibles.
//
// Los datos de data/*.json guardan cada hecho UNA sola vez, con los campos
// traducibles como nodos { en: ..., es: ... }. Así las URLs, fechas y cifras no
// pueden derivar entre idiomas. `tDeep` aplana esos nodos al locale pedido.

const LOCALES = ['en', 'es'];
const LOCALE_SET = new Set(LOCALES);

// ¿Es un nodo hoja de traducción, es decir { en: ..., es: ... }?
function isTranslationLeaf(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  const keys = Object.keys(value);
  return keys.length > 0 && keys.every((k) => LOCALE_SET.has(k));
}

function tDeep(node, locale) {
  if (Array.isArray(node)) return node.map((child) => tDeep(child, locale));

  if (isTranslationLeaf(node)) {
    // `undefined` rompe la serialización de props de Next; caemos a inglés y
    // luego a null antes que dejar pasar undefined.
    const value = node[locale] !== undefined ? node[locale] : node.en;
    return value === undefined ? null : value;
  }

  if (node && typeof node === 'object') {
    const out = {};
    for (const [key, value] of Object.entries(node)) out[key] = tDeep(value, locale);
    return out;
  }

  return node === undefined ? null : node;
}

module.exports = { LOCALES, tDeep };
