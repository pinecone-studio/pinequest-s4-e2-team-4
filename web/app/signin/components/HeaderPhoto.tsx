import Image from "next/image";

const HeaderPhoto = () => {
  return (
    <div className="absolute inset-x-0 top-0 z-10 h-107.5 overflow-hidden">
      <div className="relative h-full">
        <Image
          src="/hero-bus.png"
          alt="Header Photo"
          fill
          priority
          sizes="390px"
          className="object-cover object-[center_58%]"
        />
        <span className="signin-wind signin-wind-one" />
        <span className="signin-wind signin-wind-two" />
        <span className="signin-wind signin-wind-three" />
        <span className="signin-wind signin-wind-four" />
      </div>
    </div>
  );
};

export default HeaderPhoto;
