import ContactView from '../views/ContactView';
import { contactProps } from '../lib/props/index';

export default ContactView;

export async function getStaticProps() {
  return { props: contactProps('en') };
}
