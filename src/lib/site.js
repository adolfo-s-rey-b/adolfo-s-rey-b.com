// Identidad canónica del §3.1. Fuente única para footer, contacto y JSON-LD.

const { SITE_URL } = require('./routes');

const LINKS = {
  // §3.1: el correo de Uniandes es el principal.
  email: 'as.rey@uniandes.edu.co',
  // Se mantiene por instrucción explícita del autor, pese a que el §3.1 y el
  // §7.7 piden retirarlo. Para revertirlo, poner en null.
  emailSecondary: 'headinvestigacion@colombiafintech.co',
  linkedin: 'https://linkedin.com/in/adolfo-sebastian-rey-bolivar',
  github: 'https://github.com/adolfo-s-rey-b',
  scholar: 'https://scholar.google.com/citations?user=i89scJ8AAAAJ',
  // <!-- PENDIENTE: Adolfo debe crear el perfil y suministrar el iD de ORCID.
  //      Mientras sea null se omite del footer y de sameAs. -->
  orcid: null,
};

const IDENTITY = {
  name: 'Adolfo S. Rey B.',
  alternateName: 'Adolfo Sebastián Rey Bolívar',
  affiliation: 'Universidad de los Andes',
  worksFor: 'Colombia Fintech',
  location: 'Bogotá, Colombia',
};

function personJsonLd(locale, copy) {
  const sameAs = [LINKS.linkedin, LINKS.github, LINKS.scholar, LINKS.orcid].filter(
    Boolean
  );

  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: IDENTITY.name,
    alternateName: IDENTITY.alternateName,
    jobTitle: copy.jobTitle,
    description: copy.metaDescription,
    url: SITE_URL + (locale === 'en' ? '/' : '/es/'),
    email: `mailto:${LINKS.email}`,
    affiliation: { '@type': 'CollegeOrUniversity', name: IDENTITY.affiliation },
    worksFor: { '@type': 'Organization', name: IDENTITY.worksFor },
    alumniOf: { '@type': 'CollegeOrUniversity', name: IDENTITY.affiliation },
    knowsAbout: copy.interests,
    sameAs,
  };
}

module.exports = { LINKS, IDENTITY, personJsonLd };
