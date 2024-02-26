import React from "react";
import dynamic from "next/dynamic";
import LoadingSpinner from "@/components/progress/LoadingSpinner";

const Call = dynamic(() => import("@/components/call/Call"), {
  ssr: false,
  loading: () => <LoadingSpinner />,
});

const CallPage = () => {
  return <Call />;
};

export default CallPage;
