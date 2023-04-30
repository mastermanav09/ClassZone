import React from "react";
import Auth from "@/components/auth/Auth";
import { getSession, useSession } from "next-auth/react";
import Head from "next/head";

const LoginPage = () => {
  return (
    <>
      <Head>
        <title>Login</title>
      </Head>
      <Auth />
    </>
  );
};

export default LoginPage;

export async function getServerSideProps(context) {
  const session = await getSession({ req: context.req });
  const { redirect } = context.query;

  if (session) {
    return {
      redirect: {
        destination: redirect || "/",
        permanent: true,
      },
    };
  }

  return {
    props: {},
  };
}
