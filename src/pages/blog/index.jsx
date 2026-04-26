import Head from 'next/head';
import Link from 'next/link';
import { getAllBlogMeta } from '../../lib/markdown';

export default function BlogPage({ posts }) {
  return (
    <>
      <Head>
        <title>Blog — Adolfo S. Rey B.</title>
        <meta name="description" content="Reflexiones sobre economía, regulación financiera y ciencia de datos por Adolfo S. Rey B." />
        <meta property="og:title" content="Blog — Adolfo S. Rey B." />
        <meta property="og:description" content="Reflexiones sobre economía, regulación financiera y ciencia de datos." />
        <meta property="og:url" content="https://adolfo-s-rey-b.com/blog" />
      </Head>
    <div className="animate-fade-in max-w-4xl mx-auto">
      <div className="mb-12 border-b border-gray-200 pb-8">
        <h1 className="text-4xl font-serif font-bold text-gray-900 mb-4">Blog</h1>
        <p className="text-lg text-gray-600">
          Reflexiones sobre economía, regulación financiera y ciencia de datos.
        </p>
      </div>
      <div className="space-y-8">
        {posts.map((post) => (
          <article
            key={post.slug}
            className="group bg-white border border-gray-100 hover:border-[#5e026e]/40 p-6 rounded-2xl shadow-sm transition-all"
          >
            <span className="bg-[#5e026e]/10 text-[#5e026e] font-semibold px-3 py-1 rounded-full text-sm">
              {post.frontmatter.category}
            </span>
            <Link href={`/blog/${post.slug}`}>
              <h2 className="text-2xl font-serif font-bold text-gray-900 mt-4 mb-2 group-hover:text-[#5e026e] transition-colors cursor-pointer">
                {post.frontmatter.title}
              </h2>
            </Link>
            {post.frontmatter.excerpt && (
              <p className="text-gray-600 leading-relaxed line-clamp-2">{post.frontmatter.excerpt}</p>
            )}
            <p className="text-sm text-gray-400 mt-3">{post.frontmatter.date}</p>
          </article>
        ))}
      </div>
    </div>
    </>
  );
}

export async function getStaticProps() {
  const posts = getAllBlogMeta();
  return { props: { posts } };
}
