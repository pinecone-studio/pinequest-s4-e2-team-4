"use client";

function WaveHeader() {
  return (
    <>
      <svg
        aria-hidden="true"
        className="absolute -top-11 left-0 h-14 w-full text-white"
        preserveAspectRatio="none"
        viewBox="0 0 390 56"
      >
        <path
          d="M0 56V19C48 0 92 15 137 24C185 34 230 34 278 23C323 12 356 4 390 19V56H0Z"
          fill="currentColor"
        />
      </svg>

      <div className="relative z-10 mb-2.5 flex items-center gap-3">
        <div>
          <p className="mt-0.5 text-[13px] font-medium leading-5 text-zinc-500">
            Нэвтрэхийн тулд мэдээллээ оруулна уу
          </p>
        </div>
      </div>
    </>
  );
}
