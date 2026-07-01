import { CheckSquare, Crosshair, Fuel, Utensils, Wrench } from "lucide-react";
import type { AppLanguage } from "@/app/lib/language";

type RouteMapControlsProps = {
  gasStationStatus: string;
  language: AppLanguage;
  isFindingGasStation: boolean;
  isFindingRestaurant: boolean;
  isFindingTireRepair: boolean;
  onFindGasStation: () => void;
  onFindRestaurant: () => void;
  onFindTireRepair: () => void;
  onOpenChecklist: () => void;
  onRecenterLocation: () => void;
};

export default function RouteMapControls({
  gasStationStatus,
  language,
  isFindingGasStation,
  isFindingRestaurant,
  isFindingTireRepair,
  onFindGasStation,
  onFindRestaurant,
  onFindTireRepair,
  onOpenChecklist,
  onRecenterLocation,
}: RouteMapControlsProps) {
  const t =
    language === "en"
      ? {
          gas: "Show gas stations",
          location: "Go to my location",
          restaurants: "Show nearby restaurants",
          tireRepair: "Show nearby tire repairs",
          checklist: "Show checklist",
        }
      : {
          gas: "Шатахуун түгээх станцуудыг харуулах",
          location: "Өөрийн байршил руу очих",
          restaurants: "Ойролцоох хоолны газруудыг харуулах",
          tireRepair: "Ойролцоох дугуй засварын газруудыг харуулах",
          checklist: "Авч явах зүйлсийн жагсаалт",
        };

  return (
    <div className="">
      <button
        type="button"
        aria-label={t.gas}
        title={t.gas}
        onClick={onFindGasStation}
        disabled={isFindingGasStation}
        className="absolute left-6 top-12 z-20 flex h-11 w-11 items-center justify-center rounded-full bg-white/95 text-orange-600 shadow-lg backdrop-blur transition hover:bg-white active:scale-95 disabled:cursor-wait disabled:opacity-75"
      >
        <Fuel className="h-5 w-5" strokeWidth={2.4} />
      </button>

      <button
        type="button"
        aria-label={t.location}
        title={t.location}
        onClick={onRecenterLocation}
        className="absolute left-76 top-12 z-20 flex h-11 w-11 items-center justify-center rounded-full bg-white/95 text-blue-600 shadow-lg backdrop-blur transition hover:bg-white active:scale-95"
      >
        <Crosshair className="h-5 w-5" strokeWidth={2.4} />
      </button>

      <button
        type="button"
        aria-label={t.restaurants}
        title={t.restaurants}
        onClick={onFindRestaurant}
        disabled={isFindingRestaurant}
        className="absolute left-6 top-[100px] z-20 flex h-11 w-11 items-center justify-center rounded-full bg-white/95 text-amber-500 shadow-lg backdrop-blur transition hover:bg-white active:scale-95 disabled:cursor-wait disabled:opacity-75"
      >
        <Utensils className="h-5 w-5" strokeWidth={2.4} />
      </button>

      <button
        type="button"
        aria-label={t.tireRepair}
        title={t.tireRepair}
        onClick={onFindTireRepair}
        disabled={isFindingTireRepair}
        className="absolute left-6 top-[152px] z-20 flex h-11 w-11 items-center justify-center rounded-full bg-white/95 text-violet-500 shadow-lg backdrop-blur transition hover:bg-white active:scale-95 disabled:cursor-wait disabled:opacity-75"
      >
        <Wrench className="h-5 w-5" strokeWidth={2.4} />
      </button>

      <button
        type="button"
        aria-label={t.checklist}
        title={t.checklist}
        onClick={onOpenChecklist}
        className="absolute left-6 top-[204px] z-20 flex h-11 w-11 items-center justify-center rounded-full bg-white/95 text-emerald-700 shadow-lg backdrop-blur transition hover:bg-white active:scale-95"
      >
        <CheckSquare className="h-5 w-5" strokeWidth={2.4} />
      </button>

      {gasStationStatus && (
        <div className="absolute bottom-8 left-6 right-6 z-20 rounded-2xl bg-white/95 px-4 py-3 text-sm font-semibold text-slate-700 shadow-lg backdrop-blur">
          {gasStationStatus}
        </div>
      )}
    </div>
  );
}
