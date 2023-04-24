import React from "react";
import Auth from "@/components/auth/Auth";

const RegisterPage = () => {
  return <Auth isRegister={true} />;
};

export default RegisterPage;

RegisterPage.getInitialProps = async (context) => {
  return {
    title: "Register",
    description:
      "It is a learning management system which is designed to manage and deliver online educational content, including online courses, training programs, and other educational content.",
  };
};
