import type { ReactNode } from "react";

type PhoneFrameProps = {
  children: ReactNode;
  className?: string;
};

export default function PhoneFrame({ children, className = "" }: PhoneFrameProps) {
  const frameSize = className || "h-[812px] w-[390px]";

  return (
    <div
      className={`relative mx-auto max-w-[92vw] rounded-[3.3rem] bg-black p-[10px] shadow-2xl shadow-slate-900/35 ${frameSize}`}
    >
      <div className="absolute left-[-3px] top-32 h-14 w-[5px] rounded-l bg-black" />
      <div className="absolute right-[-3px] top-40 h-24 w-[5px] rounded-r bg-black" />
      <div className="relative h-full overflow-hidden rounded-[2.7rem] bg-white">
        <div className="absolute left-1/2 top-3 z-30 h-8 w-28 -translate-x-1/2 rounded-full bg-black" />
        <div className="h-full overflow-hidden pt-0">{children}</div>
      </div>
    </div>
  );
}
