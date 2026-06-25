import React from "react";
import { User } from "lucide-react";

export const Header = () => {
  return (
    <div>
      <div className="flex justify-between border-b border-gray-200 ">
        <div>
          <img
            src="Burged.jfif"
            alt=""
            className="w-10 h-10 rounded-full relative left-4 top-4"
          />
          <span className="relative left-15 bottom-[18px] font-semibold text-[20px]">
            MonTrip
          </span>
        </div>
        <div>
          <User className="border rounded-full p-1 w-10 h-10 mt-4 mr-4 " />
        </div>
      </div>
    </div>
  );
};

export default Header;
