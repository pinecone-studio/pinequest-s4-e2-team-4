type LogoProps = {
  large?: boolean;
  wordClassName?: string;
};

export default function Logo({ large = false, wordClassName = "" }: LogoProps) {
  return (
    <div className={`flex items-center gap-2 font-black ${large ? "flex-col text-2xl" : "text-2xl text-[#075f56]"}`}>
    
      <span className={wordClassName}>MonTrip</span>
    </div>
  );
}
