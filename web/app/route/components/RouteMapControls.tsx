import { ArrowLeft, Crosshair, Fuel } from "lucide-react";
import Link from "next/link";

type RouteMapControlsProps = {
  gasStationStatus: string;
  isFindingGasStation: boolean;
  onFindGasStation: () => void;
  onRecenterLocation: () => void;
};

export default function RouteMapControls({
  gasStationStatus,
  isFindingGasStation,
  onFindGasStation,
  onRecenterLocation,
}: RouteMapControlsProps) {
  return (
    <div className="">
      {/* <Link
        href="/"
        aria-label="Back to home"
        className="absolute left-6 top-12 z-20  flex h-11 w-11 items-center justify-center rounded-full bg-white/95 text-slate-900 shadow-lg backdrop-blur transition hover:bg-white active:scale-95"
      >
        <ArrowLeft className="h-5 w-5" strokeWidth={2.4} />
      </Link> */}

      <button
        type="button"
        aria-label="Show gas stations"
        title="Show gas stations"
        onClick={onFindGasStation}
        disabled={isFindingGasStation}
        className="absolute left-6 top-12 z-20 flex h-11 w-11 items-center justify-center rounded-full bg-white/95 text-orange-600 shadow-lg backdrop-blur transition hover:bg-white active:scale-95 disabled:cursor-wait disabled:opacity-75"
      >
        <Fuel className="h-5 w-5" strokeWidth={2.4} />
      </button>

      <button
        type="button"
        aria-label="Go to my location"
        title="Go to my location"
        onClick={onRecenterLocation}
        className="absolute left-6 top-25 z-20 flex h-11 w-11 items-center justify-center rounded-full bg-white/95 text-blue-600 shadow-lg backdrop-blur transition hover:bg-white active:scale-95"
      >
        <Crosshair className="h-5 w-5" strokeWidth={2.4} />
      </button>

      {gasStationStatus && (
        <div className="absolute bottom-8 left-6 right-6 z-20 rounded-2xl bg-white/95 px-4 py-3 text-sm font-semibold text-slate-700 shadow-lg backdrop-blur">
          {gasStationStatus}
        </div>
      )}
    </div>
  );
}
