import FullscreenLoader from "@/components/fullscreen-loader";
import { RegisterCard } from "@/modules/register/ui/components/register-card";
import React, { Suspense } from "react";

const AddAccountPage = () => {
  return (
    <Suspense fallback={<FullscreenLoader />}>
      <RegisterCard />
    </Suspense>
  );
};

export default AddAccountPage;
