// Constructores de props por página.
//
// Estos módulos SÍ pueden tocar fs (a través de lib/markdown), porque solo los
// importan los shims bajo src/pages/, donde el transform SSG de Next elimina
// getStaticProps y sus imports huérfanos del bundle de cliente.
//
// REGLA DURA: ningún archivo de src/views/ puede importar fs, path ni
// lib/markdown. Si lo hace, el build falla con "Can't resolve 'fs'".

const { pageCopy } = require('../../content/i18n');
const { tDeep } = require('../i18n');
const { personJsonLd } = require('../site');

// Props que toda página necesita: locale para el selector y los hreflang,
// routeKey + params para calcular la página equivalente, copy para el chrome.
function baseProps(locale, routeKey, pageKey, { params = {}, width = 'prose' } = {}) {
  return { locale, routeKey, params, width, copy: pageCopy(locale, pageKey) };
}

function homeProps(locale) {
  const props = baseProps(locale, 'home', 'home');
  return { ...props, jsonLd: personJsonLd(locale, props.copy) };
}

function researchProps(locale) {
  const research = require('../../../data/research.json');
  return {
    ...baseProps(locale, 'research', 'research', { width: 'wide' }),
    applied: tDeep(research.applied, locale),
    legalScholarship: tDeep(research.legalScholarship, locale),
  };
}

function teachingProps(locale) {
  const teaching = require('../../../data/teaching.json');
  return {
    ...baseProps(locale, 'teaching', 'teaching', { width: 'wide' }),
    appointments: tDeep(teaching.appointments, locale),
    history: tDeep(teaching.history, locale),
  };
}

function cvProps(locale) {
  const cv = require('../../../data/cv.json');
  const fs = require('fs');
  const path = require('path');

  // §7.6: el enlace al CV en inglés solo se renderiza si el PDF existe.
  const hasEnglishCv = fs.existsSync(
    path.join(process.cwd(), 'public', 'Rey_CV_EN.pdf')
  );

  return {
    ...baseProps(locale, 'cv', 'cv', { width: 'wide' }),
    education: tDeep(cv.education, locale),
    employment: tDeep(cv.employment, locale),
    skills: tDeep(cv.skills, locale),
    honors: tDeep(cv.honors, locale),
    additionalCoursework: tDeep(cv.additionalCoursework, locale),
    hasEnglishCv,
  };
}

function codeProps(locale) {
  const fs = require('fs');
  const path = require('path');
  const file = path.join(process.cwd(), 'content', 'code.json');
  const repos = fs.existsSync(file)
    ? JSON.parse(fs.readFileSync(file, 'utf8')).repos || []
    : [];

  return {
    ...baseProps(locale, 'code', 'code'),
    repos: tDeep(repos, locale),
  };
}

function contactProps(locale) {
  return baseProps(locale, 'contact', 'contact');
}

module.exports = {
  baseProps,
  homeProps,
  researchProps,
  teachingProps,
  cvProps,
  codeProps,
  contactProps,
};
