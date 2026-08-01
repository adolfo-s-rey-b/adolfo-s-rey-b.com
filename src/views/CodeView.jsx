import SeoHead from '../components/SeoHead';
import { LINKS } from '../lib/site';

export default function CodeView({ locale, routeKey, copy, repos }) {
  return (
    <>
      <SeoHead
        routeKey={routeKey}
        locale={locale}
        title={copy.title}
        description={copy.metaDescription}
      />

      <h1 className="text-h1">{copy.heading}</h1>

      <div className="mt-6 space-y-5">
        <p>
          {copy.body[0].split('GitHub')[0]}
          <a href={LINKS.github}>{copy.githubLabel}</a>
          {copy.body[0].split('GitHub')[1]}
        </p>
        <p>{copy.body[1]}</p>
      </div>

      {/* El listado lee de content/code.json para que añadir un repo sea editar
          una línea. Deliberadamente NO se consulta la API de GitHub (§7.5). */}
      {repos.length > 0 && (
        <ul className="mt-10">
          {repos.map((repo) => (
            <li key={repo.name} className="border-t border-rule py-4 first:border-t-0">
              <p className="text-h3">
                <a href={repo.url}>{repo.name}</a>
              </p>
              <p className="mt-1 text-muted">{repo.description}</p>
              {repo.language && (
                <p className="mt-1 text-meta text-muted">{repo.language}</p>
              )}
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
