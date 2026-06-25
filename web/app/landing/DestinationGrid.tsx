

import DestinationCard from "./Destination";

const destinations = [
  {
    title: "Khuvsgul Lake",
    image:
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
  },
  {
    title: "Gobi Desert",
    image:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee",
  },
  {
    title: "Gorkhi-Terelj",
    image:
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b",
  },
  {
    title: "Altai Tavan Bogd",
    image:
      "https://images.unsplash.com/photo-1511497584788-876760111969",
  },
];

export default function DestinationGallery() {
  return (
    <section className="mx-auto max-w-7xl px-8 py-24">
      <div className="mb-12 flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">Destinations</p>

          <h2 className="text-5xl text-gray-600 font-semibold">
            Discover the Land of the
            <br />
            Eternal Blue Sky
          </h2>
        </div>

        <button className="rounded-full border px-5 py-2 text-sm">
          Explore All Regions
        </button>
      </div>

      <div className="grid gap-6 text-gray-600 md:grid-cols-4">
        {destinations.map((item) => (
          <DestinationCard
            key={item.title}
            {...item}
          />
        ))}
      </div>
    </section>
  );
}
