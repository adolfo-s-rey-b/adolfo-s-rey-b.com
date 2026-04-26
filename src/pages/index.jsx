import Head from 'next/head';
import Image from 'next/image';
import { Mail, Linkedin, Github, ArrowRight } from 'lucide-react';
import profile from '../../data/profile.json';

export default function HomePage() {
  return (
    <>
      <Head>
        <title>{profile.name} — Economista y Abogado</title>
        <meta name="description" content={`${profile.name} — Economista y Abogado. Director de Investigaciones en Colombia Fintech. Especialista en economía financiera, regulación y políticas públicas.`} />
        <meta property="og:title" content={`${profile.name} — Economista y Abogado`} />
        <meta property="og:description" content="Economista y Abogado. Director de Investigaciones en Colombia Fintech." />
        <meta property="og:image" content={`https://adolfo-s-rey-b.com${profile.photo}`} />
        <meta property="og:url" content="https://adolfo-s-rey-b.com" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      <div className="animate-fade-in">
        <div className="flex flex-col-reverse md:flex-row gap-12 items-center md:items-start">
          <div className="md:w-2/3 space-y-6">
            <div>
              <h1 className="text-4xl md:text-6xl font-serif font-bold text-gray-900 mb-3 tracking-tight">
                {profile.name}
              </h1>
              <h2 className="text-xl md:text-2xl text-[#5e026e] font-medium tracking-wide">
                {profile.title}
              </h2>
            </div>
            <div className="space-y-4 text-lg text-gray-600 leading-relaxed">
              {profile.bio.map((paragraph, i) => (
                <p key={i} dangerouslySetInnerHTML={{ __html: paragraph }} />
              ))}
            </div>
            <div className="flex flex-wrap gap-4 pt-6">
              <a
                href={`mailto:${profile.email}`}
                className="flex items-center gap-2 bg-[#5e026e] hover:bg-[#7b0391] text-white px-6 py-3 rounded-lg transition-colors shadow-lg shadow-[#5e026e]/30 font-medium"
              >
                <Mail size={18} /> Contactar
              </a>
              <div className="flex gap-4 items-center px-2">
                <a
                  href={profile.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-500 hover:text-[#5e026e] transition-colors"
                >
                  <Linkedin size={24} />
                </a>
                <a
                  href={profile.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-500 hover:text-[#5e026e] transition-colors"
                >
                  <Github size={24} />
                </a>
              </div>
            </div>
          </div>
          <div className="md:w-1/3 flex justify-center md:justify-end w-full">
            <div className="relative w-64 md:w-full max-w-sm">
              <Image
                src={profile.photo}
                alt={profile.name}
                width={400}
                height={400}
                priority
                className="rounded-2xl object-cover w-full h-auto border-2 border-gray-100 shadow-xl bg-white"
              />
            </div>
          </div>
        </div>

        {profile.quote && (
          <div className="mt-16 border-l-2 border-[#5e026e]/40 pl-6 max-w-2xl">
            <p className="text-gray-500 italic text-lg leading-relaxed font-serif">
              &ldquo;{profile.quote}&rdquo;
            </p>
          </div>
        )}

        {profile.currently && profile.currently.length > 0 && (
          <div className="mt-16 pt-12 border-t border-gray-100">
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-5">
              En qué trabajo ahora
            </h3>
            <ul className="space-y-3 max-w-xl">
              {profile.currently.map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-gray-600">
                  <ArrowRight size={16} className="text-[#5e026e] mt-1 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </>
  );
}
