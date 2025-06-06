import { AppProps } from 'next/app';
import Head from 'next/head';

import Layout from '@/components/Layout';
import { StorageProvider } from '@/stores/storage';
import '@/styles/globals.css';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="width=device-width,initial-scale=1"
        />
        <title>Phrase generator</title>
      </Head>

      <StorageProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </StorageProvider>
    </>
  );
}
