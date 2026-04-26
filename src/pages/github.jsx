import Head from 'next/head';
import { useState, useEffect } from 'react';
import { Github, ExternalLink, Star, GitFork, RefreshCw } from 'lucide-react';
import fallbackRepos from '../../data/github-fallback.json';

const LANGUAGE_COLORS = {
  Python: '#3572A5',
  JavaScript: '#f1e05a',
  TypeScript: '#3178c6',
  Jupyter: '#DA5B0B',
  HTML: '#e34c26',
  CSS: '#563d7c',
  Shell: '#89e051',
  R: '#198CE7',
};

function RepoCard({ repo }) {
  const langColor = LANGUAGE_COLORS[repo.language] || '#6b7280';
  return (
    <a
      href={repo.html_url}
      target="_blank"
      rel="noopener noreferrer"
      className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-md transition-all group"
      style={{ borderTopColor: langColor, borderTopWidth: '3px' }}
    >
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-lg font-bold text-[#5e026e] group-hover:text-[#7b0391] transition-colors">
          {repo.name}
        </h3>
        <ExternalLink size={16} className="text-gray-400 group-hover:text-[#5e026e] transition-colors mt-1 shrink-0" />
      </div>
      <p className="text-gray-600 text-sm mb-6 line-clamp-2">
        {repo.description || 'Sin descripción.'}
      </p>
      <div className="flex items-center gap-5 text-sm text-gray-500">
        {repo.language && (
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: langColor }}></span>
            {repo.language}
          </span>
        )}
        {repo.stargazers_count > 0 && (
          <span className="flex items-center gap-1">
            <Star size={14} />
            {repo.stargazers_count}
          </span>
        )}
        {repo.forks_count > 0 && (
          <span className="flex items-center gap-1">
            <GitFork size={14} />
            {repo.forks_count}
          </span>
        )}
      </div>
    </a>
  );
}

function SkeletonCard() {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 animate-pulse" style={{ borderTopWidth: '3px', borderTopColor: '#e5e7eb' }}>
      <div className="h-5 bg-gray-200 rounded w-3/4 mb-3"></div>
      <div className="h-3 bg-gray-100 rounded w-full mb-2"></div>
      <div className="h-3 bg-gray-100 rounded w-2/3 mb-6"></div>
      <div className="h-3 bg-gray-100 rounded w-1/4"></div>
    </div>
  );
}

export default function GithubPage() {
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [usingFallback, setUsingFallback] = useState(false);

  useEffect(() => {
    async function fetchRepos() {
      try {
        const res = await fetch(
          'https://api.github.com/users/adolfo-s-rey-b/repos?sort=updated&per_page=20'
        );
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        const filtered = data
          .filter((r) => !r.fork && !r.private)
          .map((r) => ({
            name: r.name,
            description: r.description,
            language: r.language,
            html_url: r.html_url,
            stargazers_count: r.stargazers_count,
            forks_count: r.forks_count,
            updated_at: r.updated_at,
          }));
        if (filtered.length === 0) throw new Error('No public repos');
        setRepos(filtered);
        setUsingFallback(false);
      } catch {
        setRepos(fallbackRepos);
        setUsingFallback(true);
      } finally {
        setLoading(false);
      }
    }
    fetchRepos();
  }, []);

  return (
    <>
      <Head>
        <title>Código y Proyectos — Adolfo S. Rey B.</title>
        <meta name="description" content="Repositorios y proyectos de Adolfo S. Rey B. en GitHub: economía, ciencia de datos y automatización." />
        <meta property="og:title" content="Código y Proyectos — Adolfo S. Rey B." />
        <meta property="og:description" content="Repositorios de GitHub: economía, ciencia de datos y automatización." />
        <meta property="og:url" content="https://adolfo-s-rey-b.com/github" />
      </Head>
      <div className="animate-fade-in w-full max-w-5xl mx-auto">
        <div className="mb-12 border-b border-gray-200 pb-8 flex items-end justify-between gap-6">
          <h1 className="text-4xl font-serif font-bold text-gray-900 flex items-center gap-4">
            <Github size={40} />
            Código y Proyectos
          </h1>
          {!loading && (
            <a
              href="https://github.com/adolfo-s-rey-b"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-gray-500 hover:text-[#5e026e] transition-colors"
            >
              <Github size={16} />
              Ver perfil completo
            </a>
          )}
        </div>

        {usingFallback && (
          <div className="mb-6 flex items-center gap-2 text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
            <RefreshCw size={14} className="shrink-0" />
            Mostrando proyectos guardados. Los datos se actualizarán en tu próxima visita.
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
            : repos.map((repo) => <RepoCard key={repo.name} repo={repo} />)
          }
        </div>
      </div>
    </>
  );
}
