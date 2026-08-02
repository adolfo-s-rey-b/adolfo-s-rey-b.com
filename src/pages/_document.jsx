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
          <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        </Head>
        <body>
          {/* Aplica el tema antes del primer pintado para que no haya parpadeo.
              El claro es el default: solo se pasa a oscuro si el usuario lo
              eligió antes. Deliberadamente NO se consulta prefers-color-scheme. */}
          <script
            dangerouslySetInnerHTML={{
              __html:
                "try{var t=localStorage.getItem('theme');if(t==='dark')document.documentElement.setAttribute('data-theme','dark')}catch(e){}",
            }}
          />
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
