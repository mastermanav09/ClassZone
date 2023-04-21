import React from "react";
import DesignContainer from "@/components/auth/DesignContainer";
import AuthForm from "@/components/auth/AuthForm";
const RegisterPage = () => {
  return <div style={{ display: "flex", height: "100vh", width: "100%" }}>
    <DesignContainer />
    <AuthForm Register={true} />
  </div>
};

export default RegisterPage;
