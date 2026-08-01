import ResearchView from '../views/ResearchView';
import { researchProps } from '../lib/props/index';

export default ResearchView;

export async function getStaticProps() {
  return { props: researchProps('en') };
}
