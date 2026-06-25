import Image from "next/image";

type HomeBackdropProps = {
  active: boolean;
};

export default function HomeBackdrop({ active }: HomeBackdropProps) {
  if (!active) {
    return <div className="absolute inset-0 bg-[linear-gradient(135deg,#edf7f4,#d6ece7_45%,#f7fbff)]" />;
  }

  return (
    <div className="absolute inset-0 overflow-hidden">
      <Image
        src="/intro.PNG"
        alt="Mongolian mountain nature background"
        fill
        priority
        sizes="100vw"
        className="mongolia-bg-motion object-cover"
      />
      <div className="absolute inset-0 bg-[#06221f]/45 backdrop-blur-[1px]" />
    </div>
  );
}
