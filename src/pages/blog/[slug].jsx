import BlogPostView from '../../views/BlogPostView';
import { postPaths, postProps } from '../../lib/props/blog';

export default BlogPostView;

export async function getStaticPaths() {
  return { paths: postPaths(), fallback: false };
}

export async function getStaticProps({ params }) {
  return { props: await postProps('en', params) };
}
