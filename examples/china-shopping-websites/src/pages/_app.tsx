import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { NextSeo } from 'next-seo';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <NextSeo
        title="Chinese Shopping Websites | EdgeOne Makers"
        description="An one-stop navigation platform for Chinese e-commerce, integrating comprehensive resources across cross-border trade, fashion accessories, digital electronics, and other categories. · Demo only · EdgeOne Makers"
      />
      <Component {...pageProps} />
    </>
  );
}
