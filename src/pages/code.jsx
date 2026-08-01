import CodeView from '../views/CodeView';
import { codeProps } from '../lib/props/index';

export default CodeView;

export async function getStaticProps() {
  return { props: codeProps('en') };
}
