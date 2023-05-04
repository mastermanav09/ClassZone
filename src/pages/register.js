import { authOptions } from "./api/auth/[...nextauth]";
import React from "react";
import Auth from "@/components/auth/Auth";
import { getServerSession } from "next-auth/next";
import Head from "next/head";

const RegisterPage = () => {
  return (
    <>
      <Head>
        <title>Register</title>
      </Head>
      <Auth isRegister={true} />
    </>
  );
};

export default RegisterPage;

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
