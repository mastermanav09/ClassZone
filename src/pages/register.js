import { authOptions } from "./api/auth/[...nextauth]";
import React from "react";
import Auth from "@/components/auth/Auth";
import { getServerSession } from "next-auth/next";
import Head from "next/head";
import { useRouter } from "next/router";

const RegisterPage = () => {
  const router = useRouter();
  const { redirect, jc: joinClass, id } = router.query;

  return (
    <>
      <Head>
        <title>Register</title>
      </Head>
      <Auth
        isRegister={true}
        redirect={redirect}
        joinClass={joinClass}
        classId={id}
      />
    </>
  );
};

export default RegisterPage;

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
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
}
