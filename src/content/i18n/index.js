// Imports estáticos por locale. Al ser estáticos, webpack los resuelve en build
// y no hay lectura de disco en tiempo de ejecución.

const enCommon = require('./en/common.json');
const enHome = require('./en/home.json');
const enResearch = require('./en/research.json');
const enTeaching = require('./en/teaching.json');
const enNotes = require('./en/notes.json');
const enCode = require('./en/code.json');
const enCv = require('./en/cv.json');
const enContact = require('./en/contact.json');

const esCommon = require('./es/common.json');
const esHome = require('./es/home.json');
const esResearch = require('./es/research.json');
const esTeaching = require('./es/teaching.json');
const esNotes = require('./es/notes.json');
const esCode = require('./es/code.json');
const esCv = require('./es/cv.json');
const esContact = require('./es/contact.json');

const COPY = {
  en: {
    common: enCommon,
    home: enHome,
    research: enResearch,
    teaching: enTeaching,
    notes: enNotes,
    code: enCode,
    cv: enCv,
    contact: enContact,
  },
  es: {
    common: esCommon,
    home: esHome,
    research: esResearch,
    teaching: esTeaching,
    notes: esNotes,
    code: esCode,
    cv: esCv,
    contact: esContact,
  },
};

// El copy que necesita el chrome del sitio (nav, footer, etiquetas) va siempre
// mezclado con el de la página, para que Layout lo reciba en un solo objeto.
function pageCopy(locale, pageKey) {
  const bundle = COPY[locale];
  return { ...bundle.common, ...bundle[pageKey] };
}

module.exports = { COPY, pageCopy };
