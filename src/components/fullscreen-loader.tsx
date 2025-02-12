import React from "react";

const FullscreenLoader = () => {
  return (
    <div className="min-h-screen z-20 flex justify-center items-center">
      <div className="text-center text-muted-foreground">
        <span className="loading loading-spinner loading-lg"></span>
        <p className="font-medium text-base">Loading...</p>
      </div>
    </div>
  );
};

export default FullscreenLoader;
