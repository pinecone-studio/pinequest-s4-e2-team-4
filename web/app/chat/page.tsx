import React, { Suspense } from "react";
import Footer from "@/components/home/Footer";
import PhoneFrame from "@/components/home/PhoneFrame";
import HomeBackdrop from "@/components/home/HomeBackdrop";
import TravelChatbot from "@/app/chat/components/TravelChatBot";

export const Chat = () => {
  return (
    <div className="relative min-h-screen flex items-center justify-center">
      <HomeBackdrop active={true} />
      <div className="relative z-10">
        <PhoneFrame>
          <div className="flex flex-col h-full bg-slate-50">
            <div className="flex-1 min-h-0 relative">
              <Suspense fallback={null}>
                <TravelChatbot />
              </Suspense>
            </div>
            <Footer />
          </div>
        </PhoneFrame>
      </div>
    </div>
  );
};
export default Chat;
