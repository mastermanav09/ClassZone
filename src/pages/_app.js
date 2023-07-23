import "@/styles/globals.css";
import "react-responsive-modal/styles.css";
import "react-tooltip/dist/react-tooltip.css";
import { useEffect } from "react";
import Layout from "@/components/layout/Layout";
import { Suspense } from "react";
import Head from "next/head";
import { Provider as StoreProvider } from "react-redux";
import store from "../../utils/store/store";
import { useRouter } from "next/router";
import { SessionProvider, useSession } from "next-auth/react";
import PageLoader from "@/components/progress/PageLoader";
import { Progress } from "@/components/progress";
import { useProgressStore } from "../../utils/store/progress-store/useProgressStore";

export default function App({ Component, pageProps, session }) {
  const setIsAnimating = useProgressStore((state) => state.setIsAnimating);
  const isAnimating = useProgressStore((state) => state.isAnimating);
  const router = useRouter();

  useEffect(() => {
    const handleStart = () => {
      setIsAnimating(true);
    };

    const handleStop = () => {
      setIsAnimating(false);
    };

    router.events.on("routeChangeStart", handleStart);
    router.events.on("routeChangeComplete", handleStop);
    router.events.on("routeChangeError", handleStop);

    return () => {
      router.events.off("routeChangeStart", handleStart);
      router.events.off("routeChangeComplete", handleStop);
      router.events.off("routeChangeError", handleStop);
    };
  }, [router, setIsAnimating]);

  return (
    <SessionProvider session={session}>
      <Suspense>
        <StoreProvider store={store}>
          <Head>
            <meta
              name="description"
              content="It is a learning management system which is designed to help teachers create, distribute, and manage assignments, as well as communicate with their students."
            />
          </Head>
          <Progress isAnimating={isAnimating} />
          {Component.auth ? (
            <Auth adminOnly={Component.auth.adminOnly}>
              <Layout>
                <Component {...pageProps} />
              </Layout>
            </Auth>
          ) : (
            <>
              <Layout>
                <Component {...pageProps} />
              </Layout>
            </>
          )}
        </StoreProvider>
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
