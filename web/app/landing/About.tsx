export default function About() {
  return (
    <section className="mx-auto max-w-7xl px-8 py-28">
      <div className="grid gap-16 lg:grid-cols-2">
        <div className="relative">
          <img
            src="https://images.unsplash.com/photo-1511497584788-876760111969"
            alt=""
            className="rounded-3xl shadow-xl"
          />

          <div className="absolute -bottom-6 left-8 rounded-2xl bg-teal-700 p-5 text-white shadow-xl">
            <p className="text-2xl font-bold">98%</p>
            <p className="text-sm">Accuracy Rate</p>
          </div>
        </div>

        <div className="flex flex-col justify-center">
          <span className="mb-4 w-fit rounded-full bg-teal-100 px-4 py-2 text-xs font-semibold text-teal-700">
            THE INTELLIGENT GUIDE
          </span>

          <h2 className="mb-6 text-5xl text-gray-600 font-bold">
            Experience Mongolia
            <br />
            Like Never Before
          </h2>

          <p className="mb-8  text-gray-600">
            MonTrip leverages state-of-the-art AI to
            handle the complex logistics of Mongolian
            travel planning.
          </p>

          <div className="space-y-4">
            <div className="rounded-xl text-gray-600 border p-4">
              Precision Route Mapping
            </div>

            <div className="rounded-xl text-gray-600 border p-4">
              Dynamic Budget Estimator
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
