import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head";
import 'tdesign-react/dist/tdesign.css'; // 全局引入所有组件样式代码

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Image Generator Starter | EdgeOne Makers</title>
      </Head>
      <Component {...pageProps} />
    </>
  );
}
