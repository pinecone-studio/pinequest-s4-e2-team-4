// "use client";
// import React, { useState } from "react";
// import PhoneFrame from "@/components/home/PhoneFrame";
// import HomeBackdrop from "@/components/home/HomeBackdrop";

// import { WeatherWidget } from "@/app/homescreen/components/WeatherWidget";
// import { CalendarWidget } from "@/app/homescreen/components/CalendarWidget";
// import { VideoAppIcon } from "@/app/homescreen/components/VideoApp";

// const APPS = [
//   { id: 1, name: "Photos", icon: "/photos.webp", special: false },
//   { id: 2, name: "Settings", icon: "/setting.webp", special: false },
//   { id: 3, name: "Camera", icon: "/camera.webp", special: false },
//   { id: 4, name: "Clock", icon: "/clock.jpg", special: false },
//   { id: 5, name: "App Store", icon: "/appstore.png", special: false },
//   { id: 6, name: "Face Time", icon: "/facetime.png", special: false },
//   { id: 7, name: "Video", icon: "/", special: true }, // ← VideoApp
//   { id: 8, name: "MonTrip", icon: "/montrip.png", special: false },
// ];

// const DOCK_APPS = [
//   { id: 9, name: "Phone", icon: "/phone.png" },
//   { id: 10, name: "Messages", icon: "/message.png" },
//   { id: 11, name: "Calendar", icon: "/calendar.webp" },
//   { id: 12, name: "Safari", icon: "/safari.jfif" },
// ];

// function AppIcon({ name, icon }: { name: string; icon: string }) {
//   return (
//     <div className="flex flex-col items-center gap-1 cursor-pointer group active:scale-95 transition-transform duration-100">
//       <img
//         src={icon}
//         alt={name}
//         className="w-[60px] h-[60px] rounded-xl object-cover shadow-md group-hover:opacity-90"
//       />
//       <span className="text-[10px] text-white font-medium text-center truncate w-14 drop-shadow">
//         {name}
//       </span>
//     </div>
//   );
// }

// const HomeScreen = () => {
//   const [isVideoOpen, setIsVideoOpen] = useState(false);

//   return (
//     <div className="h-screen w-screen flex items-center justify-center">
//       <HomeBackdrop active={true} />

//       <PhoneFrame>
//         <div className="relative w-full h-full flex flex-col justify-between p-4 box-border overflow-hidden select-none">
//           {/* Wallpaper */}
//           <img
//             src="/iphoneHomeScreen.jpg"
//             alt="Wallpaper"
//             className="absolute inset-0 w-full h-full object-cover z-0"
//           />

//           <div className="relative top-[20px] z-10 w-full flex flex-col gap-6 pt-6">
//             <div
//               className="flex gap-3 w-full transition-opacity duration-[400ms] ease-in-out"
//               style={{
//                 opacity: isVideoOpen ? 0 : 1,
//                 pointerEvents: isVideoOpen ? "none" : "auto",
//               }}
//             >
//               <WeatherWidget
//                 city="Ulaanbaatar"
//                 temp={20}
//                 condition="Mostly Cloudy"
//                 conditionIcon="🌤"
//                 high={22}
//                 low={12}
//               />
//               <CalendarWidget
//                 month="June"
//                 dayNumber={28}
//                 dayName="Sunday"
//                 dotColors={["#FF453A", "#0A84FF", "#30D158"]}
//                 events={[
//                   { title: "Team Standup", time: "9:00 AM", color: "#FF453A" },
//                   { title: "Design Review", time: "2:00 PM", color: "#0A84FF" },
//                 ]}
//               />
//             </div>

//             {/* App grid */}
//             <div className="grid grid-cols-4 gap-x-4 gap-y-5 justify-items-center">
//               {APPS.map((app) =>
//                 app.special ? (
//                   <VideoAppIcon
//                     key={app.id}
//                     name={app.name}
//                     icon={app.icon}
//                     onOpenChange={setIsVideoOpen}
//                   />
//                 ) : (
//                   <div
//                     key={app.id}
//                     className="transition-opacity duration-[400ms] ease-in-out"
//                     style={{
//                       opacity: isVideoOpen ? 0 : 1,
//                       pointerEvents: isVideoOpen ? "none" : "auto",
//                     }}
//                   >
//                     <AppIcon name={app.name} icon={app.icon} />
//                   </div>
//                 ),
//               )}
//             </div>
//           </div>

//           {/* Dock with transition */}
//           <div
//             className="relative z-10 w-full pb-2 transition-opacity duration-[400ms] ease-in-out"
//             style={{
//               opacity: isVideoOpen ? 0 : 1,
//               pointerEvents: isVideoOpen ? "none" : "auto",
//             }}
//           >
//             <div className="w-full bg-white/15 backdrop-blur-xl border border-white/20 rounded-[28px] p-3 grid grid-cols-4 gap-3 shadow-2xl justify-items-center">
//               {DOCK_APPS.map((app) => (
//                 <div
//                   key={app.id}
//                   className="flex flex-col items-center cursor-pointer active:scale-95 transition-transform duration-100"
//                 >
//                   <img
//                     src={app.icon}
//                     alt={app.name}
//                     className="w-[60px] h-[60px] rounded-xl object-cover shadow-md"
//                   />
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </PhoneFrame>
//     </div>
//   );
// };

// export default HomeScreen;

"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import PhoneFrame from "@/components/home/PhoneFrame";
import HomeBackdrop from "@/components/home/HomeBackdrop";

import { WeatherWidget } from "@/app/homescreen/components/WeatherWidget";
import { CalendarWidget } from "@/app/homescreen/components/CalendarWidget";
import { VideoAppIcon } from "@/app/homescreen/components/VideoApp";

const APPS = [
  { id: 1, name: "Photos", icon: "/photos.webp", special: false },
  { id: 2, name: "Settings", icon: "/setting.webp", special: false },
  { id: 3, name: "Camera", icon: "/camera.webp", special: false },
  { id: 4, name: "Clock", icon: "/clock.jpg", special: false },
  { id: 5, name: "App Store", icon: "/appstore.png", special: false },
  { id: 6, name: "Face Time", icon: "/facetime.png", special: false },
  { id: 7, name: "Video", icon: "/", special: true }, // ← VideoApp
  { id: 8, name: "MonTrip", icon: "/montrip.png", special: false },
];

const DOCK_APPS = [
  { id: 9, name: "Phone", icon: "/phone.png" },
  { id: 10, name: "Messages", icon: "/message.png" },
  { id: 11, name: "Calendar", icon: "/calendar.webp" },
  { id: 12, name: "Safari", icon: "/safari.jfif" },
];

function AppIcon({ name, icon }: { name: string; icon: string }) {
  return (
    <div className="flex flex-col items-center gap-1 cursor-pointer group active:scale-95 transition-transform duration-100">
      <img
        src={icon}
        alt={name}
        className="w-[60px] h-[60px] rounded-xl object-cover shadow-md group-hover:opacity-90"
      />
      <span className="text-[10px] text-white font-medium text-center truncate w-14 drop-shadow">
        {name}
      </span>
    </div>
  );
}

const HomeScreen = () => {
  const router = useRouter();
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  return (
    <div className="h-screen w-screen flex items-center justify-center">
      <HomeBackdrop active={true} />

      <PhoneFrame>
        <div className="relative w-full h-full flex flex-col justify-between p-4 box-border overflow-hidden select-none">
          {/* Wallpaper */}
          <img
            src="/iphoneHomeScreen.jpg"
            alt="Wallpaper"
            className="absolute inset-0 w-full h-full object-cover z-0"
          />

          <div className="relative top-[20px] z-10 w-full flex flex-col gap-6 pt-6">
            <div
              className="flex gap-3 w-full transition-opacity duration-[400ms] ease-in-out"
              style={{
                opacity: isVideoOpen ? 0 : 1,
                pointerEvents: isVideoOpen ? "none" : "auto",
              }}
            >
              <WeatherWidget
                city="Ulaanbaatar"
                temp={20}
                condition="Mostly Cloudy"
                conditionIcon="🌤"
                high={22}
                low={12}
              />
              <CalendarWidget
                month="June"
                dayNumber={28}
                dayName="Sunday"
                dotColors={["#FF453A", "#0A84FF", "#30D158"]}
                events={[
                  { title: "Team Standup", time: "9:00 AM", color: "#FF453A" },
                  { title: "Design Review", time: "2:00 PM", color: "#0A84FF" },
                ]}
              />
            </div>

            {/* App grid */}
            <div className="grid grid-cols-4 gap-x-4 gap-y-5 justify-items-center">
              {APPS.map((app) =>
                app.special ? (
                  <VideoAppIcon
                    key={app.id}
                    name={app.name}
                    icon={app.icon}
                    onOpenChange={setIsVideoOpen}
                  />
                ) : (
                  <div
                    key={app.id}
                    className="transition-opacity duration-[400ms] ease-in-out"
                    style={{
                      opacity: isVideoOpen ? 0 : 1,
                      pointerEvents: isVideoOpen ? "none" : "auto",
                    }}
                    onClick={
                      app.name === "MonTrip"
                        ? () => router.push("/main")
                        : undefined
                    }
                  >
                    <AppIcon name={app.name} icon={app.icon} />
                  </div>
                ),
              )}
            </div>
          </div>

          {/* Dock with transition */}
          <div
            className="relative z-10 w-full pb-2 transition-opacity duration-[400ms] ease-in-out"
            style={{
              opacity: isVideoOpen ? 0 : 1,
              pointerEvents: isVideoOpen ? "none" : "auto",
            }}
          >
            <div className="w-full bg-white/15 backdrop-blur-xl border border-white/20 rounded-[28px] p-3 grid grid-cols-4 gap-3 shadow-2xl justify-items-center">
              {DOCK_APPS.map((app) => (
                <div
                  key={app.id}
                  className="flex flex-col items-center cursor-pointer active:scale-95 transition-transform duration-100"
                >
                  <img
                    src={app.icon}
                    alt={app.name}
                    className="w-[60px] h-[60px] rounded-xl object-cover shadow-md"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </PhoneFrame>
    </div>
  );
};

export default HomeScreen;
