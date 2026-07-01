import { Crosshair, Fuel, Utensils, Wrench } from "lucide-react";

type RouteMapControlsProps = {
  gasStationStatus: string;
  isFindingGasStation: boolean;
  isFindingRestaurant: boolean;
  isFindingTireRepair: boolean;
  onFindGasStation: () => void;
  onFindRestaurant: () => void;
  onFindTireRepair: () => void;
  onRecenterLocation: () => void;
};

export default function RouteMapControls({
  gasStationStatus,
  isFindingGasStation,
  isFindingRestaurant,
  isFindingTireRepair,
  onFindGasStation,
  onFindRestaurant,
  onFindTireRepair,
  onRecenterLocation,
}: RouteMapControlsProps) {
  return (
    <div className="">
      <button
        type="button"
        aria-label="Show gas stations"
        title="Шатахуун түгээх станцуудыг харуулах"
        onClick={onFindGasStation}
        disabled={isFindingGasStation}
        className="absolute left-6 top-12 z-20 flex h-11 w-11 items-center justify-center rounded-full bg-white/95 text-orange-600 shadow-lg backdrop-blur transition hover:bg-white active:scale-95 disabled:cursor-wait disabled:opacity-75"
      >
        <Fuel className="h-5 w-5" strokeWidth={2.4} />
      </button>

      <button
        type="button"
        aria-label="Go to my location"
        title="Өөрийн байршил руу очих"
        onClick={onRecenterLocation}
        className="absolute left-76 top-12 z-20 flex h-11 w-11 items-center justify-center rounded-full bg-white/95 text-blue-600 shadow-lg backdrop-blur transition hover:bg-white active:scale-95"
      >
        <Crosshair className="h-5 w-5" strokeWidth={2.4} />
      </button>

      <button
        type="button"
        aria-label="Show nearby restaurants"
        title="Ойролцоох хоолны газруудыг харуулах"
        onClick={onFindRestaurant}
        disabled={isFindingRestaurant}
        className="absolute left-6 top-[100px] z-20 flex h-11 w-11 items-center justify-center rounded-full bg-white/95 text-amber-500 shadow-lg backdrop-blur transition hover:bg-white active:scale-95 disabled:cursor-wait disabled:opacity-75"
      >
        <Utensils className="h-5 w-5" strokeWidth={2.4} />
      </button>

      <button
        type="button"
        aria-label="Show nearby tire repairs"
        title="Ойролцоох дугуй засварын газруудыг харуулах"
        onClick={onFindTireRepair}
        disabled={isFindingTireRepair}
        className="absolute left-6 top-[152px] z-20 flex h-11 w-11 items-center justify-center rounded-full bg-white/95 text-violet-500 shadow-lg backdrop-blur transition hover:bg-white active:scale-95 disabled:cursor-wait disabled:opacity-75"
      >
        <Wrench className="h-5 w-5" strokeWidth={2.4} />
      </button>

      {gasStationStatus && (
        <div className="absolute bottom-8 left-6 right-6 z-20 rounded-2xl bg-white/95 px-4 py-3 text-sm font-semibold text-slate-700 shadow-lg backdrop-blur">
          {gasStationStatus}
        </div>
      )}
    </div>
  );
}
