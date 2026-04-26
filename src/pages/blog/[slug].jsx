import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { getBlogSlugs, getBlogPostBySlug } from '../../lib/markdown';
import { LayoutFullScreen } from '../../components/Layout';

export default function BlogPostPage({ post }) {
  return (
    <div className="animate-fade-in max-w-3xl mx-auto px-6 py-8">
      <Link
        href="/blog"
        className="flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-[#5e026e] mb-10 transition-colors"
      >
        <ChevronLeft size={16} />
        Volver al Blog
      </Link>
      <span className="bg-[#5e026e]/10 text-[#5e026e] font-semibold px-3 py-1 rounded-full text-sm">
        {post.frontmatter.category}
      </span>
      <h1 className="text-4xl font-serif font-bold text-gray-900 mb-3 mt-4 leading-tight">
        {post.frontmatter.title}
      </h1>
      <p className="text-sm text-gray-400 mb-10">{post.frontmatter.date}</p>
      <article
        className="prose prose-gray prose-lg max-w-none prose-headings:font-serif prose-a:text-[#5e026e] prose-a:no-underline hover:prose-a:underline"
        dangerouslySetInnerHTML={{ __html: post.contentHtml }}
      />
    </div>
  );
}

BlogPostPage.getLayout = function getLayout(page) {
  return <LayoutFullScreen>{page}</LayoutFullScreen>;
};

export async function getStaticPaths() {
  const slugs = getBlogSlugs();
  return {
    paths: slugs.map((slug) => ({ params: { slug } })),
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const post = await getBlogPostBySlug(params.slug);
  return { props: { post } };
}
