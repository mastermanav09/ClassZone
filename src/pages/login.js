import React from "react";
import Auth from "@/components/auth/Auth";

const LoginPage = () => {
  return <Auth />;
};

export default LoginPage;

LoginPage.getInitialProps = async (context) => {
  return {
    title: "Login",
    description:
      "It is a learning management system which is designed to manage and deliver online educational content, including online courses, training programs, and other educational content.",
  };
};
