import Layout from "@/components/layout/Layout";
import "@/styles/globals.css";
import { Suspense } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { SessionProvider, useSession } from "next-auth/react";
import PageLoader from "@/components/progress/PageLoader";

export default function App({ Component, pageProps, session }) {
  return (
    <SessionProvider session={session}>
      <Suspense>
        <Head>
          <title>{pageProps?.title}</title>
          <meta name="description" content={pageProps?.description} />
        </Head>
        {Component.auth ? (
          <Auth adminOnly={Component.auth.adminOnly}>
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </Auth>
        ) : (
          <Layout>
            <Component {...pageProps} />
          </Layout>
        )}
      </Suspense>
    </SessionProvider>
  );
}

function Auth({ children, adminOnly }) {
  const router = useRouter();
  const { status, data: session } = useSession({
    required: true,
    onUnauthenticated() {
      router.push("/unauthorized?message=login required");
    },
  });

  if (status === "loading") {
    return <PageLoader />;
  }

  if (adminOnly && !session.user.isAdmin) {
    router.push("/unauthorized?message=admin login required");
  }

  return children;
}
