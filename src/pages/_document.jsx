import Document, { Html, Head, Main, NextScript } from 'next/document';

// OJO: `next/font` NO puede importarse en este archivo — Next lanza
// "Cannot be used within pages/_document.js" y el build falla.
// La fuente se carga en _app.jsx.

export default class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx);
    // ctx.pathname es la ruta del ARCHIVO de página ("/es/research",
    // "/es/notes/class/[subject]"), más fiable que asPath en export estático.
    const pathname = ctx.pathname || '/';
    const lang = pathname === '/es' || pathname.startsWith('/es/') ? 'es' : 'en';
    return { ...initialProps, lang };
  }

  render() {
    return (
      <Html lang={this.props.lang}>
        <Head>
          <meta name="color-scheme" content="light dark" />
          <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
