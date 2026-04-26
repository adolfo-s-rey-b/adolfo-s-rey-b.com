import Head from 'next/head';
import Link from 'next/link';
import { Calendar, GraduationCap, User, BookMarked, BookOpen } from 'lucide-react';
import teachingData from '../../data/teaching.json';

const { history: teachingHistory, notes: studyNotes } = teachingData;

export default function TeachingPage() {
  return (
    <>
      <Head>
        <title>Docencia — Adolfo S. Rey B.</title>
        <meta name="description" content="Historial de docencia universitaria y notas de clase en economía — Universidad de los Andes." />
        <meta property="og:title" content="Docencia — Adolfo S. Rey B." />
        <meta property="og:description" content="Historial de docencia y notas de clase en economía." />
        <meta property="og:url" content="https://adolfo-s-rey-b.com/teaching" />
      </Head>
    <div className="animate-fade-in max-w-4xl mx-auto">
      <div className="mb-12">
        <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-4">Docencia</h2>
        <p className="text-lg text-gray-600">
          A lo largo de mi trayectoria académica en la Universidad de los Andes, he acompañado procesos de formación como
          profesor complementario.
        </p>
      </div>

      <div className="relative border-l-2 border-gray-100 ml-4 space-y-12 pb-12 mb-16 border-b-2">
        {teachingHistory.map((term, index) => (
          <div key={index} className="relative pl-8 md:pl-12 group">
            <div className="absolute top-1.5 left-0 -translate-x-[9px] w-4 h-4 rounded-full bg-gray-200 border-4 border-white group-hover:bg-[#5e026e] transition-colors"></div>
            <div className="bg-white p-6 md:p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
              <div className="flex flex-col mb-6">
                <div className="flex items-center gap-2 mb-1">
                  <Calendar size={20} className="text-[#5e026e]" />
                  <h3 className="font-serif font-bold text-gray-900 text-xl">{term.semester}</h3>
                </div>
                <p className="text-sm text-gray-500 ml-7">{term.institution}</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {term.courses.map((course, idx) => {
                  const cardContent = (
                    <div className="flex items-start gap-3">
                      <GraduationCap size={20} className="text-gray-400 mt-0.5 group-hover/card:text-[#5e026e] transition-colors" />
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-800 text-base mb-1.5 group-hover/card:text-[#5e026e] transition-colors">{course.name}</h4>
                        <p className="text-xs font-medium text-gray-500 bg-white border border-gray-200 px-2 py-0.5 rounded-md inline-flex items-center gap-1.5">
                          <User size={12} />
                          Prof. {course.professor}
                        </p>
                      </div>
                    </div>
                  );
                  return course.programUrl ? (
                    <a
                      key={idx}
                      href={course.programUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group/card bg-gray-50/80 p-4 rounded-xl border border-gray-100 hover:border-[#5e026e]/40 hover:bg-white transition-all cursor-pointer block"
                    >
                      {cardContent}
                    </a>
                  ) : (
                    <div
                      key={idx}
                      className="group/card bg-gray-50/80 p-4 rounded-xl border border-gray-100 transition-all"
                    >
                      {cardContent}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mb-8">
        <div className="flex items-center gap-3 mb-6">
          <BookMarked className="text-[#5e026e]" size={28} />
          <h2 className="text-2xl md:text-3xl font-serif font-bold text-gray-900">Notas de clase</h2>
        </div>
        <p className="text-gray-600 mb-8">
          Material y apuntes diseñados para facilitar la comprensión matemática y conceptual de las materias.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {studyNotes.map((note) => (
            <Link
              key={note.id}
              href={`/notes/${note.id}`}
              className="text-left group flex flex-col bg-white border border-gray-200 hover:border-[#5e026e] p-6 rounded-2xl shadow-sm transition-all"
            >
              <div className="bg-gray-50 text-gray-400 p-3 rounded-xl w-fit mb-4 group-hover:text-[#5e026e] group-hover:bg-[#5e026e]/10 transition-colors">
                <BookOpen size={24} />
              </div>
              <h3 className="font-bold text-gray-900 mb-2 group-hover:text-[#5e026e]">{note.title}</h3>
              <p className="text-sm text-gray-600 line-clamp-3">{note.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
    </>
  );
}
