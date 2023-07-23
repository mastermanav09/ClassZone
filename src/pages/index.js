import Dashboard from "@/components/home/Dashboard";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { authOptions } from "./api/auth/[...nextauth]";
import { getSession } from "next-auth/react";
import { getServerSession } from "next-auth/next";
import { loadUser } from "../../utils/store/reducers/user";
import PageLoader from "@/components/progress/PageLoader";
import Head from "next/head";

function HomePage() {
  const [isLoading, setIsLoading] = useState(true);
  const { userEnrolledClasses, userTeachingClasses } = useSelector(
    (state) => state.class
  );

  const dispatch = useDispatch();

  useEffect(() => {
    const authenticateUser = async () => {
      const session = await getSession();
      if (session?.user) {
        dispatch(loadUser({ setIsLoading, user: session.user }));
      }

      setIsLoading(false);
    };

    authenticateUser();
  }, [dispatch]);

  if (isLoading) {
    return <PageLoader />;
  }

  return (
    <>
      <Head>
        <title>Class Zone</title>
        <meta
          name="description"
          content="It is a learning management system which is designed to help teachers create, distribute, and manage assignments, as well as communicate with their students."
        />
      </Head>
      <Dashboard
        userEnrolledClasses={userEnrolledClasses}
        userTeachingClasses={userTeachingClasses}
      />
    </>
  );
}

export default HomePage;

export async function getServerSideProps(context) {
  const session = await getServerSession(context.req, context.res, authOptions);

  if (!session) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
}
