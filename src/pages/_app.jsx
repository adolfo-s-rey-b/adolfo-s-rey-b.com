import '../styles/globals.css';
import { Layout } from '../components/Layout';

export default function App({ Component, pageProps }) {
  // Pages can override layout by defining a static getLayout function.
  const getLayout = Component.getLayout ?? ((page) => <Layout>{page}</Layout>);
  return getLayout(<Component {...pageProps} />);
}
