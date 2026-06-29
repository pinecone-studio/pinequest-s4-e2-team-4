import Image from "next/image";

const Photo = () => {
  return (
    <div className="absolute inset-x-0 top-0 z-10 h-93.5 overflow-hidden">
      <div className="relative -top-11 h-104.5">
        <Image
          src="/signup-hero-bus.png"
          alt="MonTrip signup scenery"
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

export default Photo;
