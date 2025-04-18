import { Head, Html, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html>
      <Head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@500;600&display=swap"
          rel="stylesheet"
        />
        {/* <link
          rel="shortcut icon"
          href="/assets/favicon.svg"
          type="image/png"
        /> */}
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
