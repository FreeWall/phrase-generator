import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AppProps } from 'next/app';
import Head from 'next/head';

import Layout from '@/components/Layout';
import { StorageProvider } from '@/stores/storage';
import '@/styles/globals.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

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

      <QueryClientProvider client={queryClient}>
        <StorageProvider>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </StorageProvider>
      </QueryClientProvider>
    </>
  );
}
