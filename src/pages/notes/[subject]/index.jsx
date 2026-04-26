import Link from 'next/link';
import { ChevronLeft, BookOpen } from 'lucide-react';
import { getSubjects, getLessonsForSubject } from '../../../lib/markdown';

export default function SubjectIndexPage({ subject, lessons }) {
  return (
    <div className="animate-fade-in max-w-4xl mx-auto">
      <Link
        href="/teaching"
        className="flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-[#5e026e] mb-8 transition-colors"
      >
        <ChevronLeft size={16} />
        Volver a Docencia
      </Link>

      <div className="mb-10">
        <h1 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-3">
          {subject.title}
        </h1>
        {subject.professor && (
          <p className="text-gray-500 mb-1">Prof. {subject.professor} &middot; {subject.semester}</p>
        )}
        {subject.description && (
          <p className="text-lg text-gray-600 mt-4">{subject.description}</p>
        )}
      </div>

      <div className="space-y-4">
        {lessons.map((lesson, i) => (
          <Link
            key={lesson.slug}
            href={`/notes/${subject.id}/${lesson.slug}`}
            className="block group bg-white border border-gray-200 hover:border-[#5e026e]/40 p-6 rounded-xl transition-all hover:shadow-sm"
          >
            <div className="flex items-start gap-4">
              <span className="text-[#5e026e]/40 font-serif font-bold text-2xl leading-none mt-0.5 group-hover:text-[#5e026e] transition-colors">
                {String(i + 1).padStart(2, '0')}
              </span>
              <div className="flex-1">
                <h3 className="font-bold text-gray-900 text-lg group-hover:text-[#5e026e] transition-colors">
                  {lesson.title}
                </h3>
                {lesson.description && (
                  <p className="text-sm text-gray-500 mt-1">{lesson.description}</p>
                )}
              </div>
              <BookOpen size={20} className="text-gray-300 group-hover:text-[#5e026e] transition-colors mt-1" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export async function getStaticPaths() {
  const subjects = getSubjects();
  return {
    paths: subjects.map((s) => ({ params: { subject: s.id } })),
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const subjects = getSubjects();
  const subject = subjects.find((s) => s.id === params.subject);
  const lessons = getLessonsForSubject(params.subject);
  return { props: { subject, lessons } };
}
