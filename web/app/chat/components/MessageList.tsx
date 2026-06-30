"use client";

import React, { RefObject } from "react";
import { Message, cx, QUICK_OPTIONS } from "@/app/chat/types";
import { Compass, User, Send, Sparkles } from "lucide-react";

interface MessageListProps {
  messages: Message[];
  isLoading: boolean;
  input: string;
  messagesEndRef: RefObject<HTMLDivElement | null>;
  textareaRef: RefObject<HTMLTextAreaElement | null>;
  onInputChange: (value: string) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  onSend: (text: string) => void;
}

const SUGGESTIONS = [
  {
    title: "🌲 Хөвсгөл нуурын аялал",
    desc: "3 өдрийн аяллын төлөвлөгөө гаргах",
    prompt:
      "Хөвсгөл нуур руу 3 өдөр аялах дэлгэрэнгүй төлөвлөгөө гаргаж өгнө үү.",
  },
  {
    title: "🚗 Говийн аялал",
    desc: "Машинаар аялахад юу бэлдэх вэ?",
    prompt:
      "Говь руу машинаар аялахад анхаарах зүйлс болон бэлтгэл хангахад шаардлагатай зүйлсийг зөвлөнө үү.",
  },
  {
    title: "🏕️ Тэрэлжийн амралт",
    desc: "Очих шилдэг амралтын газрууд",
    prompt:
      "Горхи Тэрэлжийн байгалийн цогцолбор газарт байрлах, амрахад тохиромжтой шилдэг амралтын газруудыг санал болгоорой.",
  },
];

const MessageList = ({
  messages,
  isLoading,
  input,
  messagesEndRef,
  textareaRef,
  onInputChange,
  onKeyDown,
  onSend,
}: MessageListProps) => {
  const autoResize = () => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = Math.min(ta.scrollHeight, 160) + "px";
  };

  return (
    <>
      {/* Messages Feed */}
      <div className="flex-1 space-y-5 overflow-y-auto px-4 py-6 scrollbar-thin">
        {messages.length === 0 && (
          <div className="flex min-h-full flex-col justify-center py-4">
            {/* Header section of empty state */}
            <div className="flex flex-col items-center text-center gap-2 mb-8">
              <div className="flex h-14 w-14 items-center justify-center rounded-[20px] bg-[#1b9bd7]/10 text-[#1b9bd7] shadow-inner mb-2">
                <Compass className="h-7 w-7 animate-[spin_10s_linear_infinite]" />
              </div>
              <h2 className="text-lg font-bold text-slate-800 tracking-tight">
                Аяллаа төлөвлөцгөөе
              </h2>
              <p className="max-w-[240px] text-xs font-medium text-slate-400 leading-normal">
                Хаашаа аялахыг хүсэж байна вэ? Доорх бэлэн асуултуудаас сонгох
                эсвэл чатаар асуугаарай.
              </p>
            </div>

            {/* Suggestions cards */}
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
        )}

        {messages.map((msg, i) => (
          <div
            key={i}
            className={cx(
              "flex items-end gap-2.5",
              msg.role === "user" ? "justify-end" : "justify-start",
            )}
          >
            {msg.role === "model" && (
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[#1b9bd7]/10 text-[#1b9bd7] border border-[#1b9bd7]/10">
                <Compass className="h-4 w-4" />
              </div>
            )}

            <div
              className={cx(
                "max-w-[75%] rounded-[20px] px-4 py-2.5 shadow-sm text-sm leading-relaxed",
                msg.role === "user"
                  ? "rounded-br-[4px] bg-gradient-to-r from-[#1b9bd7] to-[#1581b3] text-white font-medium"
                  : "rounded-bl-[4px] border border-slate-100 bg-white text-slate-800",
              )}
            >
              <p className="whitespace-pre-wrap">{msg.content}</p>
            </div>

            {msg.role === "user" && (
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-slate-200 text-slate-600 border border-slate-300/30">
                <User className="h-4 w-4" />
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex items-end gap-2.5">
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[#1b9bd7]/10 text-[#1b9bd7] border border-[#1b9bd7]/10">
              <Compass className="h-4 w-4" />
            </div>
            <div className="rounded-[20px] rounded-bl-[4px] border border-slate-100 bg-white px-4 py-3.5 shadow-sm">
              <div className="flex items-center gap-1.5 px-1 py-0.5">
                {[0, 1, 2].map((n) => (
                  <span
                    key={n}
                    className="h-2 w-2 animate-bounce rounded-full bg-[#1b9bd7]"
                    style={{ animationDelay: `${n * 0.15}s` }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick options */}
      <div className="flex flex-wrap gap-2 px-4 pb-3">
        {QUICK_OPTIONS.map((opt) => (
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

      {/* Input bar */}
      <div className="flex-shrink-0 border-t border-slate-100 bg-white/95 backdrop-blur-md px-4 pb-6 pt-2">
        <div className="flex items-end gap-2 rounded-2xl border border-slate-200 bg-slate-50 pl-4 pr-2 py-2 transition-all focus-within:border-[#1b9bd7] focus-within:ring-2 focus-within:ring-[#1b9bd7]/10 focus-within:bg-white shadow-inner">
          <textarea
            ref={textareaRef}
            value={input}
            rows={1}
            disabled={isLoading}
            placeholder="Аяллын талаар асуугаарай..."
            onChange={(e) => {
              onInputChange(e.target.value);
              autoResize();
            }}
            onKeyDown={onKeyDown}
            className="max-h-32 flex-1 resize-none bg-transparent text-sm leading-relaxed text-slate-800 outline-none placeholder:text-slate-400 disabled:opacity-50 py-1"
          />
          <button
            onClick={() => onSend(input)}
            disabled={isLoading || !input.trim()}
            aria-label="Илгээх"
            className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl bg-[#1b9bd7] hover:bg-[#1581b3] text-white shadow-sm transition-all duration-200 hover:scale-105 active:scale-95 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400 disabled:scale-100"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </>
  );
};

export default MessageList;
