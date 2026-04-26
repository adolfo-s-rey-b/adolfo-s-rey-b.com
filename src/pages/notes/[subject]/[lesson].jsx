import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Menu, PanelLeftClose } from 'lucide-react';
import { getSubjects, getLessonsForSubject, getLessonBySlug } from '../../../lib/markdown';
import { LayoutFullScreen } from '../../../components/Layout';

export default function LessonPage({ note, subjectMeta, lessons, currentIndex }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTocId, setActiveTocId] = useState(null);
  const contentRef = useRef(null);

  const prevLesson = currentIndex > 0 ? lessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < lessons.length - 1 ? lessons[currentIndex + 1] : null;

  useEffect(() => {
    if (!contentRef.current || !note.toc.length) return;
    const headings = contentRef.current.querySelectorAll('h2[id]');
    if (!headings.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveTocId(entry.target.id);
        });
      },
      { rootMargin: '-20% 0px -70% 0px', threshold: 0 }
    );
    headings.forEach((h) => observer.observe(h));
    return () => observer.disconnect();
  }, [note.toc]);

  return (
    <div className="flex flex-1 w-full bg-white animate-fade-in relative">
      {/* Sidebar */}
      <aside
        className={`bg-gray-50 border-r border-gray-200 transition-all duration-300 ease-in-out flex flex-col
          h-[calc(100vh-61px)] md:h-[calc(100vh-73px)]
          sticky top-[61px] md:top-[73px] shrink-0 z-40 overflow-y-auto
          ${sidebarOpen ? 'w-72 md:w-80 px-6 py-8' : 'w-0 px-0 opacity-0 overflow-hidden'}`}
      >
        <div className="flex justify-between items-center mb-6 border-b border-gray-200 pb-4 min-w-[200px]">
          <h3 className="font-serif font-bold text-gray-900 text-lg">Contenidos</h3>
          <button
            onClick={() => setSidebarOpen(false)}
            className="text-gray-400 hover:text-[#5e026e] transition-colors"
          >
            <PanelLeftClose size={20} />
          </button>
        </div>
        <ul className="space-y-3 text-sm min-w-[200px]">
          {note.toc.map((item, i) => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                className={`transition-colors hover:text-[#5e026e] ${
                  activeTocId === item.id
                    ? 'text-[#5e026e] font-semibold'
                    : 'text-gray-600'
                }`}
              >
                {i + 1}. {item.text}
              </a>
            </li>
          ))}
        </ul>
      </aside>

      {/* Main content */}
      <div className="flex-1 min-w-0 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-6 py-8 md:px-12 md:py-12">
          {/* Navigation header */}
          <div className="flex items-center gap-4 mb-6">
            {!sidebarOpen && (
              <button
                onClick={() => setSidebarOpen(true)}
                className="p-2 text-gray-600 hover:text-[#5e026e] bg-gray-50 border border-gray-200 rounded-md shadow-sm transition-colors"
              >
                <Menu size={20} />
              </button>
            )}
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Link href="/teaching" className="hover:text-[#5e026e] transition-colors">Docencia</Link>
              <span>/</span>
              <Link href={`/notes/${note.subject}`} className="hover:text-[#5e026e] transition-colors">{subjectMeta.title}</Link>
              <span>/</span>
              <span className="text-gray-900 font-medium">{note.frontmatter.title}</span>
            </div>
          </div>

          {/* Prev / Next navigation */}
          <div className="flex justify-between items-center mb-10 gap-4">
            {prevLesson ? (
              <Link
                href={`/notes/${note.subject}/${prevLesson.slug}`}
                className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-[#5e026e] transition-colors"
              >
                <ChevronLeft size={16} />
                {prevLesson.title}
              </Link>
            ) : <span />}
            {nextLesson ? (
              <Link
                href={`/notes/${note.subject}/${nextLesson.slug}`}
                className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-[#5e026e] transition-colors"
              >
                {nextLesson.title}
                <ChevronRight size={16} />
              </Link>
            ) : <span />}
          </div>

          <article
            ref={contentRef}
            className="prose prose-gray max-w-none prose-headings:font-serif prose-a:text-[#5e026e] prose-a:no-underline hover:prose-a:underline"
            dangerouslySetInnerHTML={{ __html: note.contentHtml }}
          />

          {/* Bottom prev/next */}
          <div className="flex justify-between items-center mt-16 pt-8 border-t border-gray-200 gap-4">
            {prevLesson ? (
              <Link
                href={`/notes/${note.subject}/${prevLesson.slug}`}
                className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-[#5e026e] transition-colors"
              >
                <ChevronLeft size={16} />
                {prevLesson.title}
              </Link>
            ) : <span />}
            {nextLesson ? (
              <Link
                href={`/notes/${note.subject}/${nextLesson.slug}`}
                className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-[#5e026e] transition-colors"
              >
                {nextLesson.title}
                <ChevronRight size={16} />
              </Link>
            ) : <span />}
          </div>
        </div>
      </div>
    </div>
  );
}

LessonPage.getLayout = function getLayout(page) {
  return <LayoutFullScreen>{page}</LayoutFullScreen>;
};

export async function getStaticPaths() {
  const subjects = getSubjects();
  const paths = [];
  for (const subject of subjects) {
    const lessons = getLessonsForSubject(subject.id);
    for (const lesson of lessons) {
      paths.push({ params: { subject: subject.id, lesson: lesson.slug } });
    }
  }
  return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
  const subjects = getSubjects();
  const subjectMeta = subjects.find((s) => s.id === params.subject);
  const lessons = getLessonsForSubject(params.subject);
  const note = await getLessonBySlug(params.subject, params.lesson);
  const currentIndex = lessons.findIndex((l) => l.slug === params.lesson);

  return {
    props: {
      note,
      subjectMeta,
      lessons,
      currentIndex,
    },
  };
}
