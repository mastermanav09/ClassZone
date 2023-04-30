import Dashboard from "@/components/home/Dashboard";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { getSession } from "next-auth/react";
import { loadUser } from "../../utils/store/reducers/user";
import PageLoader from "@/components/progress/PageLoader";

function HomePage() {
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    let session;
    const authenticateUser = async () => {
      session = await getSession();

      if (session?.user) {
        dispatch(loadUser({ setIsLoading }));
      }
    };

    authenticateUser();
  }, [dispatch]);

  if (isLoading) {
    return <PageLoader />;
  }

  return <Dashboard />;
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
