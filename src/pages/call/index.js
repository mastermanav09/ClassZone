import React, { useEffect, useState } from "react";
import Call from "@/components/call/Call";
import LoadingSpinner from "@/components/progress/LoadingSpinner";

const CallPage = () => {
  const [client, setClient] = useState(false);

  useEffect(() => {
    setClient(true);
  }, []);

  if (!client) {
    return <LoadingSpinner />;
  }

  return client && <Call />;
};

export default CallPage;
