import React, { useEffect } from "react";
import Auth from "@/components/auth/Auth";
import { getServerSession } from "next-auth/next";
import { useSession } from "next-auth/react";
import Head from "next/head";
import { authOptions } from "./api/auth/[...nextauth]";
import { useRouter } from "next/router";

const LoginPage = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const { redirect, joinClass, id } = router.query;

  useEffect(() => {
    if (session?.user) {
      router.push(redirect || "/");
    }
  }, [router, redirect, session?.user]);

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
  const { redirect, joinClass, id } = context.query;
  console.log(redirect);
  let redirectLink = redirect;

  if (joinClass === "true" && id) {
    redirectLink = `${redirect}?joinClass=true&id=${id}`;
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
