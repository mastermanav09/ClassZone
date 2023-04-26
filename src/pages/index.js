import Dashboard from "@/components/home/Dashboard";
import React from "react";
import { getSession, useSession } from "next-auth/react";
function HomePage() {
  return (
    <>
      <Dashboard />
    </>
  );
}

export default HomePage;

export async function getServerSideProps(context) {
  const pageMeta = {
    title: "Class Zone",
    description:
      "It is a learning management system which is designed to manage and deliver online educational content, including online courses, training programs, and other educational content.",
  };

  const session = await getSession({ req: context.req });

  if (!session) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  return {
    props: {
      ...pageMeta,
    },
  };
}
