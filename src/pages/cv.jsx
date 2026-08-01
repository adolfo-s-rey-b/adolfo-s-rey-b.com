import CvView from '../views/CvView';
import { cvProps } from '../lib/props/index';

export default CvView;

export async function getStaticProps() {
  return { props: cvProps('en') };
}
