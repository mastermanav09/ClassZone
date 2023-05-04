import Head from "next/head";
import { useRouter } from "next/router";
import React from "react";
import Warning from "../components/svg/Warning";
import UnauthorizedError from "@/components/layout/UnauthorizedError";

const Unauthorized = () => {
  const router = useRouter();
  const { message } = router.query;

  return <UnauthorizedError message={message} />;
};

export default Unauthorized;
