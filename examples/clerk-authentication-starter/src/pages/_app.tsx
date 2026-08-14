import "@/styles/globals.css";
import { ClerkProvider } from '@clerk/nextjs';
import type { AppProps } from "next/app";
import Head from "next/head";
import Layout from '../components/Layout';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ClerkProvider {...pageProps}>
      <Head>
        <title>Clerk Authentication Starter | EdgeOne Makers</title>
      </Head>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </ClerkProvider>
  );
}
