type LogoProps = {
  large?: boolean;
  wordClassName?: string;
};

export default function Logo({ large = false, wordClassName = "" }: LogoProps) {
  return (
    <div 
      className={`
        flex items-center gap-2 pt-2
        font-sans font-black tracking-tight select-none
        ${large ? "text-5xl md:text-6xl text-[#e0e0e0]" : "text-xl text-[#04530c]"}
      `}
      style={{ fontFamily: "'Nunito', 'Segoe UI', sans-serif" }} 
    >
      <span className={`${wordClassName} transition-all duration-300`}>
        MonTrip
      </span>
    </div>
  );
}