// "use client";
// import React from "react";
// import {
//   User,
//   Bookmark,
//   MapPin,
//   Settings,
//   LogOut,
//   Heart,
//   Clock,
//   MessageCircle,
//   Home,
// } from "lucide-react";
// import Footer from "@/components/home/Footer";
// import { Header } from "@/app/components/Header";
// import PhoneFrame from "@/components/home/PhoneFrame";
// import HomeBackdrop from "@/components/home/HomeBackdrop";
// import { LinkProps } from "next/link";
// import { useRouter } from "next/navigation";

// export const Page = () => {
//   const router = useRouter();
//   return (
//     <div className="relative min-h-screen flex items-center justify-center">
//       <HomeBackdrop active={true} />
//       <div className="relative z-10">
//         <PhoneFrame>
//           <div className="h-[95%]">
//             <div className="flex flex-col justify-between mt-10 h-full">
//               <div className="flex-1 overflow-y-auto bg-gray-100">
//                 {/*Profile heseg*/}
//                 <div className="bg-white flex flex-col items-center py-6 px-4 ">
//                   <div className="relative mb-3">
//                     <div className="w-20 h-20 rounded-full overflow-hidden bg-green-200">
//                       <img
//                         src="Burged.jfif"
//                         alt="profile"
//                         className="w-full h-full object-cover"
//                       />
//                     </div>
//                     <div className="absolute bottom-0 right-0 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
//                       <svg className="w-3 h-3 fill-white" viewBox="0 0 24 24">
//                         <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
//                       </svg>
//                     </div>
//                   </div>
//                   <h2 className="text-xl font-bold text-gray-900">Bold</h2>
//                   <p className="text-sm text-gray-400 mb-4">
//                     bold.traveler@email.com
//                   </p>
//                   <div className="flex gap-8">
//                     <div className="flex flex-col items-center">
//                       <Clock className="w-4 h-4 text-gray-400 mb-1" />
//                       <span className="text-xl font-bold text-gray-900">2</span>
//                       <span className="text-xs text-gray-400">Аялсан</span>
//                     </div>
//                     <div className="flex flex-col items-center">
//                       <Heart className="w-4 h-4 text-red-500 mb-1 fill-red-500" />
//                       <span className="text-xl font-bold text-red-500">4</span>
//                       <span className="text-xs text-gray-400">Хадгалсан</span>
//                     </div>
//                   </div>
//                 </div>
//                 {/*Menu tovchnuud */}
//                 <div className="bg-white mx-3 mt-3 rounded-2xl overflow-hidden">
//                   <button className="w-full flex items-center px-4 py-3.5 border-b border-gray-100 hover:bg-gray-200 transition-colors duration-400">
//                     <div className="w-8 h-8 flex items-center justify-center mr-3">
//                       <Bookmark className="w-5 h-5 text-blue-500" />
//                     </div>
//                     <span className="flex-1 text-left text-sm font-medium text-gray-800">
//                       Хадгалсан аяллууд
//                     </span>
//                     <span className="text-gray-300 text-lg">›</span>
//                   </button>

//                   <button className="w-full flex items-center px-4 py-3.5 border-b border-gray-100 hover:bg-gray-200 transition-colors duration-400">
//                     <div className="w-8 h-8 flex items-center justify-center mr-3">
//                       <MapPin className="w-5 h-5 text-amber-500" />
//                     </div>
//                     <span className="flex-1 text-left text-sm font-medium text-gray-800">
//                       Өмнөх маршрутууд
//                     </span>
//                     <span className="text-gray-300 text-lg">›</span>
//                   </button>

//                   <button
//                     onClick={() => router.push("/settings")}
//                     className="w-full flex items-center px-4 py-3.5 hover:bg-gray-200 transition-colors duration-400"
//                   >
//                     <div className="w-8 h-8 flex items-center justify-center mr-3">
//                       <Settings className="w-5 h-5 text-purple-500" />
//                     </div>
//                     <span className="flex-1 text-left text-sm font-medium text-gray-800">
//                       Тохиргоо
//                     </span>
//                     <span className="text-gray-300 text-lg">›</span>
//                   </button>
//                 </div>

//                 {/*Gardg tovch*/}
//                 <div className="mx-3 mb-12 mt-12">
//                   <button className="w-full bg-white rounded-2xl py-3.5 flex hover:cursor-pointer transition-colours duration-400 hover:bg-gray-200  items-center justify-center gap-2 text-red-500 font-semibold text-sm">
//                     <LogOut className="w-4 h-4" />
//                     Гарах
//                   </button>
//                 </div>
//               </div>
//               <Footer />
//             </div>
//           </div>
//         </PhoneFrame>
//       </div>
//     </div>
//   );
// };

// export default Page;

"use client";
import React from "react";
import {
  Settings,
  LogOut,
  Heart,
  Clock,
  Home,
  MessageCircle,
  ShoppingCart,
  User,
  ChevronRight,
  MoreVertical,
  RefreshCw,
  Lock,
  Languages,
  Package,
} from "lucide-react";
import Footer from "@/components/home/Footer";
import PhoneFrame from "@/components/home/PhoneFrame";
import HomeBackdrop from "@/components/home/HomeBackdrop";
import { useRouter } from "next/navigation";

export const Page = () => {
  const router = useRouter();

  const menuItems = [
    {
      icon: <User className="w-5 h-5 text-blue-400" />,
      label: "My Profile",
      bg: "bg-blue-50",
    },
    {
      icon: <Package className="w-5 h-5 text-green-500" />,
      label: "My Orders",
      bg: "bg-green-50",
    },
    {
      icon: <RefreshCw className="w-5 h-5 text-purple-500" />,
      label: "Refund",
      bg: "bg-purple-50",
    },
    {
      icon: <Lock className="w-5 h-5 text-orange-400" />,
      label: "Change Password",
      bg: "bg-orange-50",
    },
    {
      icon: <Languages className="w-5 h-5 text-pink-500" />,
      label: "Change Language",
      bg: "bg-pink-50",
    },
  ];

  return (
    <div className="relative min-h-screen flex items-center justify-center">
      <HomeBackdrop active={true} />
      <div className="relative z-10">
        <PhoneFrame>
          <div className="h-[95%] flex flex-col">
            <div className="flex flex-col justify-between h-full">
              <div className="flex-1 overflow-y-auto bg-gray-100">
                {/* Dark green header with decorative shapes */}
                <div
                  className="relative overflow-hidden flex flex-col items-center pb-10 pt-10 px-4"
                  style={{ backgroundColor: "#1a3c2e" }}
                >
                  {/* Decorative circles */}
                  <div
                    className="absolute top-[-30px] left-[-30px] w-24 h-24 rounded-full opacity-40"
                    style={{ backgroundColor: "#2d5c42" }}
                  />
                  <div
                    className="absolute top-[10px] right-[-10px] w-16 h-16 rounded-full opacity-30"
                    style={{ backgroundColor: "#2d5c42" }}
                  />
                  <div
                    className="absolute bottom-[20px] left-[10px] w-12 h-12 rounded-full opacity-30"
                    style={{ backgroundColor: "#2d5c42" }}
                  />
                  <div
                    className="absolute bottom-[-10px] right-[20px] w-20 h-20 rounded-full opacity-25"
                    style={{ backgroundColor: "#2d5c42" }}
                  />
                  {/* Half-circle arcs for abstract shapes */}
                  <div
                    className="absolute top-[30px] right-[60px] w-14 h-7 rounded-t-full opacity-20"
                    style={{ backgroundColor: "#4a9068" }}
                  />
                  <div
                    className="absolute bottom-[30px] left-[50px] w-10 h-5 rounded-t-full opacity-20"
                    style={{ backgroundColor: "#4a9068" }}
                  />

                  {/* Top bar: Profile title + 3-dot menu */}
                  <div className="w-full flex items-center justify-between mb-6 relative z-10">
                    <h1 className="text-white text-xl font-bold">Profile</h1>
                    <button className="w-9 h-9 rounded-full border border-white/30 flex items-center justify-center">
                      <MoreVertical className="w-4 h-4 text-white" />
                    </button>
                  </div>

                  {/* Avatar */}
                  <div className="relative mb-3 z-10">
                    <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white bg-gray-200">
                      <img
                        src="Burged.jfif"
                        alt="profile"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <button className="absolute bottom-0 right-0 w-7 h-7 rounded-full flex items-center justify-center bg-[#e8924a]">
                      <svg
                        className="w-3.5 h-3.5 fill-white"
                        viewBox="0 0 24 24"
                      >
                        <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
                      </svg>
                    </button>
                  </div>

                  {/* Name & phone */}
                  <h2 className="text-white text-lg font-bold z-10">Bold</h2>
                  <p className="text-white/60 text-sm z-10">
                    bold.traveler@email.com
                  </p>
                </div>

                {/* White card — Account Overview */}
                <div className="bg-white mx-3 rounded-3xl overflow-hidden shadow-sm z-10 mt-[-20px] relative">
                  <div className="px-4 pt-5 pb-2">
                    <p className="text-sm font-bold text-gray-800 mb-3">
                      Account Overview
                    </p>
                  </div>

                  {menuItems.map((item, i) => (
                    <button
                      key={i}
                      className="w-full flex items-center px-4 py-3.5 hover:bg-gray-50 transition-colors"
                    >
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center mr-3 ${item.bg}`}
                      >
                        {item.icon}
                      </div>
                      <span className="flex-1 text-left text-sm font-medium text-gray-800">
                        {item.label}
                      </span>
                      <ChevronRight className="w-4 h-4 text-gray-300" />
                    </button>
                  ))}

                  <div className="pb-2" />
                </div>

                {/* Logout */}
                <div className="mx-3 mb-24 mt-4">
                  <button className="w-full bg-white rounded-2xl py-3.5 flex items-center justify-center gap-2 text-red-500 font-semibold text-sm hover:bg-red-50 transition-colors">
                    <LogOut className="w-4 h-4" />
                    Гарах
                  </button>
                </div>
              </div>

              {/* Bottom nav */}
              <div className="absolute top-[90%] w-full">
                <Footer />
              </div>
            </div>
          </div>
        </PhoneFrame>
      </div>
    </div>
  );
};

export default Page;
