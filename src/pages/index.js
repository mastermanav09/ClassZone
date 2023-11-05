import Dashboard from "@/components/home/Dashboard";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loadUser } from "../../utils/store/reducers/user";
import PageLoader from "@/components/progress/PageLoader";
import Head from "next/head";
import { notifyAndUpdate } from "@/helper/toastNotifyAndUpdate";
import { ERROR_TOAST } from "../../utils/constants";
import { toast } from "react-toastify";
import { useRouter } from "next/router";

function HomePage(props) {
  const [isLoading, setIsLoading] = useState(true);
  const userEnrolledClasses = useSelector(
    (state) => state.class.userEnrolledClasses
  );
  const userTeachingClasses = useSelector(
    (state) => state.class.userTeachingClasses
  );
  const dispatch = useDispatch();
  const { class_force_redirect, message } = props;
  const router = useRouter();
  const { query } = router;

  useEffect(() => {
    if (class_force_redirect) {
      setTimeout(() => {
        notifyAndUpdate(ERROR_TOAST, "error", message, toast, 6000);
      }, 800);

      const newQuery = { ...query };
      delete newQuery["class_force_redirect"];

      router.replace({
        pathname: router.pathname,
        query: newQuery,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [class_force_redirect, message, query]);

  useEffect(() => {
    const authenticateUser = async () => {
      dispatch(loadUser({ setIsLoading }));
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
  const { query } = context;
  const { class_force_redirect } = query;

  if (class_force_redirect === "true") {
    return {
      props: {
        class_force_redirect: true,
        message:
          "Can't access class, you are not authorized or you are no longer a member of this class",
      },
    };
  }

  return {
    props: {},
  };
}
