import "@/styles/globals.css";
import { ClerkProvider } from '@clerk/nextjs';
import type { AppProps } from "next/app";
import Layout from '../components/Layout';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ClerkProvider {...pageProps}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </ClerkProvider>
  );
}
