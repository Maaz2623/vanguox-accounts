import { LoginCard } from "@/modules/register/ui/components/login-card";
import React, { Suspense } from "react";

const SignInPage = () => {
  return (
    <Suspense fallback={<p>loading...</p>}>
      <LoginCard />
    </Suspense>
  );
};

export default SignInPage;
