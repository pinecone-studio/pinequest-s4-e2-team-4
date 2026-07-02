import { cx, QUICK_OPTIONS } from "@/app/chat/types";
import { Loader2, Mic, MicOff, Send, Volume2, VolumeX } from "lucide-react";
import type { RefObject } from "react";

interface InputBarProps {
  input: string;
  isLoading: boolean;
  isRecording: boolean;
  sttLoading: boolean;
  isVoiceMode: boolean;
  textareaRef: RefObject<HTMLTextAreaElement | null>;
  quickReplies: { label: string; value: string }[];
  onInputChange: (value: string) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  onSend: (text: string) => void;
  onToggleRecording: () => void;
  onToggleVoiceMode: () => void;
  onStopSpeaking: () => void;
}

export function InputBar({
  input,
  isLoading,
  isRecording,
  sttLoading,
  isVoiceMode,
  textareaRef,
  quickReplies,
  onInputChange,
  onKeyDown,
  onSend,
  onToggleRecording,
  onToggleVoiceMode,
  onStopSpeaking,
}: InputBarProps) {
  const quickOptions = quickReplies.length > 0 ? quickReplies : QUICK_OPTIONS;

  const autoResize = () => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = Math.min(ta.scrollHeight, 160) + "px";
  };

  return (
    <>
      <div className="flex items-center justify-between px-4 pb-3 gap-2 overflow-x-auto">
        <div className="flex gap-2">
          {quickOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => onSend(opt.value)}
              disabled={isLoading}
              className="whitespace-nowrap rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-600 shadow-sm transition-all hover:bg-slate-50 hover:border-slate-300 disabled:cursor-not-allowed disabled:opacity-50 active:scale-95"
            >
              {opt.label}
            </button>
          ))}
        </div>

        <button
          onClick={onToggleVoiceMode}
          className={cx(
            "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all border shadow-sm shrink-0",
            isVoiceMode
              ? "bg-[#0A4429] border-[#0A4429] text-white"
              : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50",
          )}
        >
          {isVoiceMode ? (
            <>
              <Volume2 className="h-3.5 w-3.5 animate-pulse" />
              <span>Дуут горим</span>
            </>
          ) : (
            <>
              <VolumeX className="h-3.5 w-3.5" />
              <span>Текст горим</span>
            </>
          )}
        </button>
      </div>

      <div className="shrink-0 border-t border-slate-100 bg-white/95 backdrop-blur-md px-4 pb-6 pt-2">
        <div className="flex items-end gap-2 rounded-2xl border border-slate-200 bg-slate-50 pl-4 pr-2 py-2 transition-all focus-within:border-[#0A4429] focus-within:ring-2 focus-within:ring-[#0A4429]/10 focus-within:bg-white shadow-inner">
          <button
            onClick={onToggleRecording}
            disabled={isLoading || sttLoading}
            className={cx(
              "flex h-8 w-8 shrink-0 items-center justify-center rounded-xl transition-all duration-200 self-center",
              isRecording
                ? "bg-red-500 text-white animate-pulse shadow-md"
                : "bg-slate-200 hover:bg-slate-300 text-slate-600",
            )}
            title={isRecording ? "Бичлэгийг зогсоох" : "Дуугаар асуух"}
          >
            {sttLoading ? (
              <Loader2 className="h-4 w-4 animate-spin text-[#0A4429]" />
            ) : isRecording ? (
              <MicOff className="h-4 w-4" />
            ) : (
              <Mic className="h-4 w-4" />
            )}
          </button>

          <textarea
            ref={textareaRef}
            value={input}
            rows={1}
            disabled={isLoading || sttLoading}
            placeholder={
              isRecording
                ? "Таны яриаг сонсож байна..."
                : "Аяллын талаар асуугаарай..."
            }
            onChange={(e) => {
              onInputChange(e.target.value);
              autoResize();
            }}
            onKeyDown={onKeyDown}
            className="max-h-32 flex-1 resize-none bg-transparent text-sm leading-relaxed text-slate-800 outline-none placeholder:text-slate-400 disabled:opacity-50 py-1"
          />

          <button
            onClick={() => {
              onSend(input);
              onStopSpeaking();
            }}
            disabled={isLoading || !input.trim() || sttLoading}
            aria-label="Илгээх"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#0A4429] text-white shadow-sm transition-all duration-200 hover:scale-105 active:scale-95 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400 disabled:scale-100"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </>
  );
}
