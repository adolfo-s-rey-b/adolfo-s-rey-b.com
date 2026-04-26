import Head from 'next/head';
import { BookOpen, FileText, ExternalLink, FlaskConical } from 'lucide-react';
import papers from '../../data/papers.json';

const workingPapers = papers.filter((p) => p.type === 'Working Paper');
const publications = papers.filter((p) => p.type === 'Publicación');

function PaperCard({ paper }) {
  const isWorkingPaper = paper.type === 'Working Paper';
  return (
    <article className="group border-l-4 border-transparent hover:border-[#5e026e] pl-6 transition-all duration-300">
      <div className="mb-2 flex items-center gap-3 text-sm font-medium">
        <span
          className={`px-3 py-1 rounded-full flex items-center gap-2 ${
            isWorkingPaper
              ? 'text-amber-700 bg-amber-50 border border-amber-200'
              : 'text-[#5e026e] bg-[#5e026e]/10'
          }`}
        >
          {isWorkingPaper ? <FlaskConical size={14} /> : <BookOpen size={14} />}
          {paper.type}
        </span>
        <span className="text-gray-400 border-l border-gray-300 pl-3">{paper.year}</span>
      </div>
      <h3 className="text-2xl font-serif font-bold text-gray-900 mb-2 leading-snug group-hover:text-[#5e026e] transition-colors">
        {paper.title}
      </h3>
      <p className="text-gray-700 font-medium mb-4">{paper.authors}</p>
      <div className="flex flex-wrap gap-2 mb-4">
        {paper.tags.map((tag, idx) => (
          <span key={idx} className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-md">
            {tag}
          </span>
        ))}
      </div>
      <p className="text-gray-600 leading-relaxed mb-6 text-justify">
        <strong className="text-gray-800 font-medium">Resumen: </strong>
        {paper.abstract}
      </p>
      <div className="flex gap-4">
        {paper.pdf && paper.pdf !== '#' && (
          <a
            href={paper.pdf}
            className="flex items-center gap-2 text-sm font-semibold text-white bg-gray-900 hover:bg-[#5e026e] px-4 py-2 rounded-lg transition-colors"
          >
            <FileText size={16} />
            PDF / Documento
          </a>
        )}
        {paper.link && paper.link !== '#' && (
          <a
            href={paper.link}
            className="flex items-center gap-2 text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg transition-colors"
          >
            <ExternalLink size={16} />
            Ir a la publicación
          </a>
        )}
      </div>
    </article>
  );
}

export default function ResearchPage() {
  return (
    <>
      <Head>
        <title>Investigación — Adolfo S. Rey B.</title>
        <meta name="description" content="Agenda de investigación en economía financiera, política pública y regulación. Working papers y publicaciones de Adolfo S. Rey B." />
        <meta property="og:title" content="Investigación — Adolfo S. Rey B." />
        <meta property="og:description" content="Agenda de investigación en economía financiera, política pública y regulación." />
        <meta property="og:url" content="https://adolfo-s-rey-b.com/research" />
      </Head>
      <div className="animate-fade-in max-w-4xl mx-auto">
        <div className="mb-12">
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-4">Investigación</h1>
          <p className="text-lg text-gray-600">
            Mi agenda de investigación se centra en la intersección de la economía financiera, la política pública y el
            diseño regulatorio, utilizando herramientas cuantitativas y de ciencia de datos.
          </p>
        </div>

        {workingPapers.length > 0 && (
          <section className="mb-16">
            <div className="flex items-center gap-3 mb-8 pb-3 border-b border-amber-100">
              <FlaskConical size={20} className="text-amber-600" />
              <h2 className="text-lg font-semibold text-gray-700 tracking-wide">
                Working Papers
              </h2>
              <span className="ml-auto text-sm text-gray-400">{workingPapers.length} documento{workingPapers.length !== 1 ? 's' : ''}</span>
            </div>
            <div className="space-y-12">
              {workingPapers.map((paper) => (
                <PaperCard key={paper.id} paper={paper} />
              ))}
            </div>
          </section>
        )}

        {publications.length > 0 && (
          <section>
            <div className="flex items-center gap-3 mb-8 pb-3 border-b border-[#5e026e]/15">
              <BookOpen size={20} className="text-[#5e026e]" />
              <h2 className="text-lg font-semibold text-gray-700 tracking-wide">
                Publicaciones
              </h2>
              <span className="ml-auto text-sm text-gray-400">{publications.length} publicación{publications.length !== 1 ? 'es' : ''}</span>
            </div>
            <div className="space-y-12">
              {publications.map((paper) => (
                <PaperCard key={paper.id} paper={paper} />
              ))}
            </div>
          </section>
        )}

        {papers.length === 0 && (
          <p className="text-gray-500 italic">Próximamente.</p>
        )}
      </div>
    </>
  );
}
