import React from "react";
import Auth from "@/components/auth/Auth";
import { getSession } from "next-auth/react";
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
