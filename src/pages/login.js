import React from "react";
import Auth from "@/components/auth/Auth";
import { getServerSession } from "next-auth/next";
import Head from "next/head";
import { authOptions } from "./api/auth/[...nextauth]";
import { useRouter } from "next/router";

const LoginPage = () => {
  const router = useRouter();
  const { redirect, jc: joinClass, id } = router.query;

  return (
    <>
      <Head>
        <title>Login</title>
      </Head>
      <Auth redirect={redirect} joinClass={joinClass} classId={id} />
    </>
  );
};

export default LoginPage;

export async function getServerSideProps(context) {
  const session = await getServerSession(context.req, context.res, authOptions);
  const { redirect, jc: joinClass, id } = context.query;

  let redirectLink = redirect;

  if (joinClass === "true" && id) {
    redirectLink = `${redirect}?jc=true&id=${id}`;
  }

  if (session) {
    return {
      redirect: {
        destination: redirectLink || "/",
        permanent: true,
      },
    };
  }

  return {
    props: {},
  };
}
