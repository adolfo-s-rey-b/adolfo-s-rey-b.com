import HomeView from '../views/HomeView';
import { homeProps } from '../lib/props/index';

export default HomeView;

export async function getStaticProps() {
  return { props: homeProps('en') };
}
