
export default function CTASection() {
  return (
    <section className="mx-auto max-w-7xl px-8 py-24">
      <div className="relative overflow-hidden rounded-[24px]">
        <img
          src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee"
          alt=""
          className="h-[320px] w-full object-cover"
        />

        <div className="absolute inset-0 bg-teal-900/60" />

        <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white">
          <p className="mb-4 text-sm">
            Ready to Explore Mongolia?
          </p>

          <h2 className="max-w-xl text-3xl font-semibold">
            Join thousands of travelers who have built
            their dream journeys with MonTrip.
          </h2>

          <button className="mt-8 rounded-full bg-orange-500 px-10 py-4 font-medium">
            Get Started
          </button>
        </div>
      </div>
    </section>
  );
}