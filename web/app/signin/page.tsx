import HomeBackdrop from "@/components/home/HomeBackdrop";
import PhoneFrame from "@/components/home/PhoneFrame";
import HeaderPhoto from "./components/HeaderPhoto";
import Input from "./components/Input";

const SignIn = () => {
  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden p-6">
      <HomeBackdrop active />
      <PhoneFrame>
        <div className="relative h-full w-full overflow-hidden bg-[#fbfff5]">
          <div className="absolute inset-0 bg-[linear-gradient(180deg,#fbfff5_0%,#fbfff5_58%,#f3fae9_76%,#e8f6d3_100%)]" />
          <HeaderPhoto />
          <Input />
        </div>
      </PhoneFrame>
    </div>
  );
};

export default SignIn;
