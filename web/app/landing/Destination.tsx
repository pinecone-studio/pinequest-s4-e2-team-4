
interface DestinationCardProps {
  image: string;
  title: string;
}

export default function DestinationCard({
  image,
  title,
}: DestinationCardProps) {
  return (
    <div className="group">
      <div className="overflow-hidden rounded-xl shadow-md">
        <img
          src={image}
          alt={title}
          className="h-60 w-full object-cover transition duration-500 group-hover:scale-105"
        />
      </div>

      <div className="mt-3 flex items-center justify-between">
        <span className="font-medium">{title}</span>

        <button className="text-xs text-teal-700 hover:underline">
          View Route
        </button>
      </div>
    </div>
  );
}