import DesignContainer from "@/components/auth/DesignContainer";
import AuthForm from "@/components/auth/AuthForm";
import React from "react";

const LoginPage = () => {
  return (
    <div style={{ display: "flex", height: "100vh", width: "100%" }}>
      <DesignContainer />
      <AuthForm Register={false} />
    </div>
  );
};

export default LoginPage;
