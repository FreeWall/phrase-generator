import Layout from '@/components/layout';
import { StorageProvider } from '@/stores/storage';
import '@/styles/globals.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'next-themes';
import { AppProps } from 'next/app';
import Head from 'next/head';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

export type Theme = 'light' | 'dark';

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
        <ThemeProvider attribute="class">
          <StorageProvider>
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </StorageProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </>
  );
}
