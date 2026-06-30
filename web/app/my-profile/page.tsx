import React from "react";
import HomeBackdrop from "@/components/home/HomeBackdrop";
import PhoneFrame from "@/components/home/PhoneFrame";

export const myProfile = () => {
  return (
    <div className="h-screen w-screen flex items-center justify-center">
      <HomeBackdrop active={true} />
      <PhoneFrame>
        <div></div>
      </PhoneFrame>
    </div>
  );
};

export default myProfile;
