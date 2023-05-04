import React from "react";
import Auth from "@/components/auth/Auth";
import { getServerSession } from "next-auth/next";
import Head from "next/head";
import { authOptions } from "./api/auth/[...nextauth]";

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
  const session = await getServerSession(context.req, context.res, authOptions);
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
