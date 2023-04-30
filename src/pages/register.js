import React from "react";
import Auth from "@/components/auth/Auth";
import { getSession } from "next-auth/react";

const RegisterPage = () => {
  return <Auth isRegister={true} />;
};

export default RegisterPage;

export async function getServerSideProps(context) {
  const pageMeta = {
    title: "Register",
    description:
      "It is a learning management system which is designed to manage and deliver online educational content, including online courses, training programs, and other educational content.",
  };

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
    props: {
      ...pageMeta,
    },
  };
}
