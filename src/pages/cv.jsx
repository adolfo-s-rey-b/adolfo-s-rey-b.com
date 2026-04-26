import Head from 'next/head';
import { useState } from 'react';
import { Download, Briefcase, GraduationCap, Code2, BookOpen, Languages, Award, ExternalLink } from 'lucide-react';
import cvData from '../../data/cv.json';
import certificationsData from '../../data/certifications.json';

export default function CvPage() {
  const [activeCategory, setActiveCategory] = useState('Todos');
  const categories = ['Todos', ...new Set(certificationsData.items.map(c => c.category))];
  const filteredCerts = activeCategory === 'Todos'
    ? certificationsData.items
    : certificationsData.items.filter(c => c.category === activeCategory);

  return (
    <>
      <Head>
        <title>Curriculum Vitae — Adolfo S. Rey B.</title>
        <meta name="description" content="CV de Adolfo S. Rey B. — Economista y Abogado. Experiencia en Colombia Fintech, política pública, economía financiera y tecnología." />
        <meta property="og:title" content="Curriculum Vitae — Adolfo S. Rey B." />
        <meta property="og:description" content="Experiencia, educación y habilidades de Adolfo S. Rey B." />
        <meta property="og:url" content="https://adolfo-s-rey-b.com/cv" />
      </Head>
    <div className="animate-fade-in w-full max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 border-b border-gray-200 pb-8 gap-6">
        <div>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-3 tracking-tight">
            Curriculum Vitae
          </h1>
          <p className="text-lg text-gray-600">Economista y Abogado</p>
        </div>
        <a
          href="/Hoja_de_vida___Adolfo_S__Rey_B_.pdf"
          download
          className="flex items-center gap-2 bg-[#5e026e] hover:bg-[#7b0391] text-white px-6 py-3 rounded-xl transition-all shadow-md font-medium"
        >
          <Download size={18} />
          Descargar PDF
        </a>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-16">

          <section>
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-8 flex items-center gap-3">
              <Briefcase className="text-[#5e026e]" size={24} /> Experiencia Profesional
            </h2>
            <div className="space-y-10">
              {cvData.experience.map((job, i) => (
                <div key={i} className="md:grid md:grid-cols-4 md:gap-6">
                  <div className="text-sm font-semibold text-gray-500 mb-2 md:mb-0">{job.dates}</div>
                  <div className="md:col-span-3">
                    <h3 className="text-xl font-bold text-gray-900">{job.title}</h3>
                    <p className="text-[#5e026e] font-medium mb-3">{job.company}</p>
                    {job.items ? (
                      <ul className="list-disc list-outside ml-4 space-y-2 text-gray-600">
                        {job.items.map((item, j) => (
                          <li key={j}>{item}</li>
                        ))}
                      </ul>
                    ) : job.description ? (
                      <p className="text-gray-600 text-sm leading-relaxed">{job.description}</p>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-8 flex items-center gap-3">
              <GraduationCap className="text-[#5e026e]" size={24} /> Educación
            </h2>
            <div className="space-y-10">
              {cvData.education.map((edu, i) => (
                <div key={i} className="md:grid md:grid-cols-4 md:gap-6">
                  <div className="text-sm font-semibold text-gray-500 mb-2 md:mb-0">{edu.dates}</div>
                  <div className="md:col-span-3">
                    <h3 className="text-xl font-bold text-gray-900">{edu.title}</h3>
                    <p className="text-[#5e026e] mb-1">{edu.institution}</p>
                    <p className="text-sm text-gray-500">{edu.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-6 flex items-center gap-3">
              <Award className="text-[#5e026e]" size={24} /> Credenciales y Certificados
            </h2>

            <div className="flex flex-wrap gap-2 mb-6">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    activeCategory === cat
                      ? 'bg-[#5e026e] text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {filteredCerts.map((cert, i) => (
                <a
                  key={i}
                  href={cert.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start justify-between gap-3 p-4 bg-gray-50 border border-gray-100 hover:border-[#5e026e]/30 hover:bg-white rounded-xl transition-colors group"
                >
                  <div className="min-w-0">
                    <p className="font-semibold text-gray-900 text-sm leading-snug group-hover:text-[#5e026e] transition-colors">{cert.title}</p>
                    <p className="text-xs text-gray-500 mt-1">{cert.issuer} · {cert.date}</p>
                  </div>
                  <ExternalLink size={14} className="shrink-0 mt-0.5 text-gray-300 group-hover:text-[#5e026e] transition-colors" />
                </a>
              ))}
            </div>
          </section>
        </div>

        <div className="space-y-8">
          <section className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
            <h2 className="text-xl font-serif font-bold text-gray-900 mb-5 flex items-center gap-2">
              <Code2 className="text-[#5e026e]" size={20} /> Habilidades
            </h2>
            <div className="space-y-4">
              {cvData.skills.map((skill, i) => (
                <div key={i}>
                  <h4 className="font-bold text-gray-800 text-sm mb-1">{skill.category}</h4>
                  <p className="text-sm text-gray-600">{skill.detail}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
            <h2 className="text-xl font-serif font-bold text-gray-900 mb-5 flex items-center gap-2">
              <Languages className="text-[#5e026e]" size={20} /> Idiomas
            </h2>
            <ul className="space-y-3 text-sm text-gray-700">
              {cvData.languages.map((lang, i) => (
                <li key={i} className={`flex justify-between ${i < cvData.languages.length - 1 ? 'border-b border-gray-200 pb-2' : ''}`}>
                  <span className="font-medium">{lang.name}</span>
                  <span className="text-gray-500">{lang.level}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="bg-[#5e026e]/5 rounded-2xl p-6 border border-[#5e026e]/10">
            <h2 className="text-xl font-serif font-bold text-gray-900 mb-5 flex items-center gap-2">
              <BookOpen className="text-[#5e026e]" size={20} /> Semilleros
            </h2>
            <ul className="space-y-2 text-sm text-gray-700 list-disc list-inside">
              {cvData.seminars.map((seminar, i) => (
                <li key={i}>{seminar}</li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </div>
    </>
  );
}
