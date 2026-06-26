import Image from "next/image";

export default function HeroTripCard() {
  return (
    <div className="relative h-56 overflow-hidden rounded-3xl">
      <Image
        src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=900&q=80"
        alt="Mountain travel destination"
        fill
        priority
        sizes="(max-width: 768px) 100vw, 448px"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
      <div className="absolute bottom-5 left-5 right-5 text-white">
        <p className="text-sm font-semibold">Шинэ аялал эхлүүлэх</p>
        <button className="mt-3 h-12 rounded-full bg-[#0b7f71] px-8 font-bold shadow-lg transition hover:scale-[1.02]">
          ▶ Эхлэх
        </button>
      </div>
    </div>
  );
}
