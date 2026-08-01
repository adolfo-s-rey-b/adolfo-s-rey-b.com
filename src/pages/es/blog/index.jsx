import BlogIndexView from '../../../views/BlogIndexView';
import { blogIndexProps } from '../../../lib/props/blog';

export default BlogIndexView;

export async function getStaticProps() {
  return { props: blogIndexProps('es') };
}
