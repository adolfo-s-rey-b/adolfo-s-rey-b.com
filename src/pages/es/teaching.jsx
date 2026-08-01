import TeachingView from '../../views/TeachingView';
import { teachingProps } from '../../lib/props/index';

export default TeachingView;

export async function getStaticProps() {
  return { props: teachingProps('es') };
}
