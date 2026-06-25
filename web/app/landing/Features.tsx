
import FeatureCard from "./FeaturesCard";

export default function Features() {
  const features = [
    {
      title: "AI-Powered Planning",
      description:
        "Generate routes and personalized trips instantly.",
    },
    {
      title: "Cost Estimation",
      description:
        "Calculate fuel, hotel, and food costs automatically.",
    },
    {
      title: "Easy Navigation",
      description:
        "Interactive route maps and travel guidance.",
    },
  ];

  return (
    <section className="mx-auto max-w-7xl px-8 py-24">
      <div className="mb-16 text-center">
        <h2 className="text-5xl text-gray-600 font-bold">
          Engineered for the Modern Nomad
        </h2>

        <p className="mt-4  text-gray-600">
          Smart planning tools for modern travelers.
        </p>
      </div>

      <div className="grid gap-8 text-gray-600 md:grid-cols-3">
        {features.map((feature) => (
          <FeatureCard
            key={feature.title}
            title={feature.title}
            description={feature.description}
          />
        ))}
      </div>
    </section>
  );
}