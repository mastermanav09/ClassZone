import Layout from "@/components/layout/Layout";
import "@/styles/globals.css";
import { Suspense } from "react";
import Head from "next/head";

export default function App({ Component, pageProps }) {
  return (
    <Suspense>
      <Head>
        <title>{pageProps?.title}</title>
        <meta name="description" content={pageProps?.description} />
      </Head>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </Suspense>
  );
}
