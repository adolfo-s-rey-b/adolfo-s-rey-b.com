const { tDeep } = require('../i18n');
const { baseProps } = require('./index');
const { getSubjects, getLessonsForSubject, getLessonBySlug } = require('../markdown');

// Índice /notes/ — solo notas de clase. Los escritos (fichas de papers,
// comentarios, policy briefs) viven en /blog/.
function notesIndexProps(locale) {
  const subjects = getSubjects().map((subject) => {
    const lessons = getLessonsForSubject(subject.id);
    return {
      id: subject.id,
      title: tDeep(subject.title, locale),
      description: tDeep(subject.description, locale),
      contentLang: subject.contentLang || 'es',
      lessonCount: lessons.length,
    };
  });

  return {
    ...baseProps(locale, 'notes', 'notes', { width: 'wide' }),
    subjects,
  };
}

function subjectPaths() {
  return getSubjects().map((subject) => ({ params: { subject: subject.id } }));
}

function subjectProps(locale, params) {
  const subject = getSubjects().find((s) => s.id === params.subject);
  const lessons = getLessonsForSubject(params.subject);

  return {
    ...baseProps(locale, 'subject', 'notes', { params, width: 'wide' }),
    subject: {
      id: subject.id,
      title: tDeep(subject.title, locale),
      description: tDeep(subject.description, locale),
      professor: subject.professor || null,
      semester: subject.semester || null,
      contentLang: subject.contentLang || 'es',
    },
    lessons,
    // El contenido está en español: bajo la interfaz en inglés se sirve con
    // noindex para no competir con la versión /es/ ni emitir señal de idioma
    // contradictoria.
    noindex: locale === 'en',
  };
}

function lessonPaths() {
  const paths = [];
  for (const subject of getSubjects()) {
    for (const lesson of getLessonsForSubject(subject.id)) {
      paths.push({ params: { subject: subject.id, lesson: lesson.slug } });
    }
  }
  return paths;
}

async function lessonProps(locale, params) {
  const subject = getSubjects().find((s) => s.id === params.subject);
  const lessons = getLessonsForSubject(params.subject);
  const index = lessons.findIndex((l) => l.slug === params.lesson);
  const lesson = await getLessonBySlug(params.subject, params.lesson);

  const neighbour = (i) =>
    i >= 0 && i < lessons.length
      ? { slug: lessons[i].slug, title: lessons[i].title }
      : null;

  return {
    ...baseProps(locale, 'lesson', 'notes', { params, width: 'wide' }),
    subject: {
      id: subject.id,
      title: tDeep(subject.title, locale),
      contentLang: subject.contentLang || 'es',
    },
    lesson: {
      slug: lesson.slug,
      title: lesson.frontmatter.title || lesson.slug,
      description: lesson.frontmatter.description || '',
      contentHtml: lesson.contentHtml,
      toc: lesson.toc,
      empty: lesson.empty,
    },
    prev: neighbour(index - 1),
    next: neighbour(index + 1),
    // Además del criterio de idioma, las lecciones sin cuerpo llevan noindex en
    // ambos locales: son thin content.
    noindex: locale === 'en' || lesson.empty,
  };
}

module.exports = {
  notesIndexProps,
  subjectPaths,
  subjectProps,
  lessonPaths,
  lessonProps,
};
