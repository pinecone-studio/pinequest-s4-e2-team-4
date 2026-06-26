import Image from "next/image";
import Logo from "@/components/home/Logo";
import type { MainScreen } from "./mainTypes";

type MainIntroScreenProps = {
  screen: MainScreen;
  onStart: () => void;
};

export default function MainIntroScreen({ screen, onStart }: MainIntroScreenProps) {
  const isZooming = screen === "zooming";

  return (
    <section className="relative flex h-full items-end justify-center overflow-hidden px-5 pb-14 pt-16">
      <Image
        src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=900&q=80"
        alt="Mongolia nature lake and mountains"
        fill
        priority
        sizes="100vw"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/5 via-black/20 to-black/75" />
      <div className="relative flex w-full max-w-sm flex-col items-center gap-8 text-center text-white">
        <Logo large wordClassName={isZooming ? "intro-word-forward" : ""} />
        <div className={`space-y-4 ${isZooming ? "intro-fade-away" : ""}`}>
          <h1 className="text-4xl font-black leading-tight">Аяллаа амархан төлөвлө</h1>
          <p className="rounded-2xl bg-white/18 px-5 py-4 text-base leading-7 shadow-xl backdrop-blur-md">
            Монголд аялах хамгийн тохиромжтой газрыг AI санал болгоно
          </p>
        </div>
        <button
          onClick={onStart}
          disabled={isZooming}
          className={`mb-2 h-14 w-56 rounded-full bg-[#0b7f71] text-lg font-bold text-white shadow-2xl transition hover:scale-[1.03] hover:bg-[#096b60] ${
            isZooming ? "intro-fade-away" : ""
          }`}
        >
          Эхлэх →
        </button>
      </div>
    </section>
  );
}
