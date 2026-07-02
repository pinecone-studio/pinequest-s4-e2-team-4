import { Compass, Sparkles } from "lucide-react";
import { SUGGESTIONS } from "./Suggetion";

interface WelcomeScreenProps {
  isLoading: boolean;
  onSend: (text: string) => void;
}

export function WelcomeScreen({ isLoading, onSend }: WelcomeScreenProps) {
  return (
    <div className="flex min-h-full flex-col justify-center py-4">
      <div className="flex flex-col items-center text-center gap-2 mb-8">
        <div className="flex h-14 w-14 items-center justify-center rounded-[20px] bg-[#0A4429]/10 text-[#0A4429] shadow-inner mb-2">
          <Compass className="h-7 w-7 animate-[spin_10s_linear_infinite]" />
        </div>
        <h2 className="text-lg font-bold text-slate-800 tracking-tight">
          Аяллаа төлөвлөцгөөе
        </h2>
        <p className="max-w-60 text-xs font-medium text-slate-400 leading-normal">
          Хаашаа аялахыг хүсэж байна вэ? Доорх бэлэн асуултуудаас сонгох эсвэл
          чатаар асуугаарай.
        </p>
      </div>

      <div className="space-y-2.5 px-1">
        {SUGGESTIONS.map((s, idx) => (
          <button
            key={idx}
            onClick={() => onSend(s.prompt)}
            disabled={isLoading}
            className="w-full flex items-start gap-3 rounded-2xl border border-slate-100 bg-white p-3.5 text-left transition-all duration-200 hover:border-[#1b9bd7]/30 hover:bg-[#1b9bd7]/5 hover:shadow-sm active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50 shadow-sm"
          >
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-orange-500 font-semibold text-xs">
              <Sparkles className="h-3.5 w-3.5" />
            </span>
            <div className="min-w-0">
              <p className="text-xs font-bold text-slate-700 leading-snug">
                {s.title}
              </p>
              <p className="text-[11px] font-medium text-slate-400 mt-0.5">
                {s.desc}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
