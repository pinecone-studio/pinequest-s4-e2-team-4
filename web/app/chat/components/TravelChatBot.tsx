"use client";
import { useState, useRef, useEffect } from "react";
import { Send } from "lucide-react";

type Message = {
  role: "user" | "ai";
  text: string;
  card?: TripCard;
};

type TripCard = {
  title: string;
  items: { label: string; price: string; icon: string }[];
  total: string;
};

const mockResponses = (text: string): { text: string; card?: TripCard } => {
  const lower = text.toLowerCase();
  if (lower.includes("visa") || lower.includes("виза"))
    return {
      text: "🛂 Монгол иргэдэд Бали руу 30 хоногийн Visa-on-arrival олгодог. Зардал $35.",
    };
  if (lower.includes("буудал") || lower.includes("hotel"))
    return {
      text: "🏨 Ubud Tropical Suite – $45/шөнө ⭐4.8\nSeminyak Beach Resort – $60/шөнө ⭐4.6",
    };
  if (lower.includes("цаг") || lower.includes("weather"))
    return {
      text: "🌤 Хуурай улирал (11-р – 4-р сар) нь аяллын хамгийн тохиромжтой цаг.",
    };
  if (lower.match(/(бали|тайланд|япон|солонгос|европ)/)) {
    return {
      text: "Маш сайн сонголт! Энд тооцоолсон зардал:",
      card: {
        title: `✈️ ${text.trim()} — 5 хоног, 2 хүн`,
        items: [
          { label: "Нислэг", price: "~$480", icon: "✈️" },
          { label: "Буудал, 5 шөнө", price: "~$300", icon: "🏨" },
          { label: "Тээвэр + экскурс", price: "~$120", icon: "🚗" },
          { label: "Хоол хүнс", price: "~$150", icon: "🍜" },
        ],
        total: "~$1,050",
      },
    };
  }
  return { text: "Аяллын мэдээлэл хайж байна... Хаашаа явахыг хэлэх үү?" };
};

export const TravelChatbot = () => {
  const [messages, setMessages] = useState<Message[]>([
    { role: "ai", text: "Сайн байна уу! 👋 Хаашаа явахыг мөрөөдөж байна вэ?" },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  const send = async (text?: string) => {
    const msg = text ?? input.trim();
    if (!msg) return;
    setInput("");
    setMessages((prev) => [...prev, { role: "user", text: msg }]);
    setTyping(true);
    await new Promise((r) => setTimeout(r, 1000));
    setTyping(false);
    const res = mockResponses(msg);
    setMessages((prev) => [...prev, { role: "ai", ...res }]);
  };

  const quickReplies = [
    "📅 Өдрийн хөтөлбөр",
    "🛂 Visa мэдээлэл",
    "🏨 Буудал",
    "🌤 Цаг агаар",
  ];

  return (
    <div className="flex flex-col h-full bg-slate-50 text-slate-800 overflow-hidden">
      {/* Header */}
      <div className="flex items-end h-23 mt-20  gap-3 px-4 py-3 border-b border-green-100 bg-white shadow-sm flex-shrink-0">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-yellow-400 flex items-center justify-center text-xs font-semibold text-white">
          AI
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-800">Аяллын Зөвлөгч</p>
          <p className="text-[10px] text-green-600 flex items-center gap-1 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse inline-block" />
            онлайн
          </p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-3 scrollbar-none">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`flex gap-2 ${m.role === "user" ? "flex-row-reverse" : "flex-row"} items-end`}
          >
            {m.role === "ai" && (
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-green-500 to-yellow-400 flex items-center justify-center text-[9px] font-bold text-white flex-shrink-0">
                AI
              </div>
            )}
            <div className="max-w-[210px] space-y-2">
              <div
                className={`px-3 py-2 rounded-2xl text-[12px] leading-relaxed whitespace-pre-line shadow-sm ${
                  m.role === "user"
                    ? "bg-green-600 text-white rounded-br-sm"
                    : "bg-white border border-green-100 text-slate-800 rounded-bl-sm"
                }`}
              >
                {m.text}
              </div>
              {m.card && (
                <div className="bg-amber-50/60 border border-yellow-200 rounded-xl p-3 text-[11px] shadow-sm">
                  <p className="text-emerald-800 font-bold mb-2">
                    {m.card.title}
                  </p>
                  {m.card.items.map((item, j) => (
                    <div
                      key={j}
                      className="flex justify-between py-1 border-b border-yellow-600/10 last:border-0"
                    >
                      <span className="text-slate-600">
                        {item.icon} {item.label}
                      </span>
                      <span className="text-green-700 font-semibold">
                        {item.price}
                      </span>
                    </div>
                  ))}
                  <div className="flex justify-between pt-2 mt-1 border-t border-yellow-200">
                    <span className="text-slate-500 font-medium">Нийт дүн</span>
                    <span className="text-emerald-700 font-bold">
                      {m.card.total}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
        {typing && (
          <div className="flex gap-2 items-end">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-green-500 to-yellow-400 flex items-center justify-center text-[9px] font-bold text-white flex-shrink-0">
              AI
            </div>
            <div className="flex gap-1 bg-white border border-green-100 rounded-2xl rounded-bl-sm px-3 py-2.5 shadow-sm">
              {[0, 1, 2].map((d) => (
                <span
                  key={d}
                  className="w-1.5 h-1.5 bg-green-400 rounded-full animate-bounce"
                  style={{ animationDelay: `${d * 0.2}s` }}
                />
              ))}
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Quick Replies */}
      <div className="flex gap-1.5 flex-wrap px-3 pb-2 flex-shrink-0">
        {quickReplies.map((q) => (
          <button
            key={q}
            onClick={() => send(q)}
            className="text-[10px] px-2.5 py-1.5 rounded-full bg-white border border-yellow-300 text-emerald-800 font-medium hover:bg-yellow-400 hover:text-slate-900 hover:border-yellow-400 shadow-sm transition-all"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="flex gap-2 px-3 pb-4 pt-2 border-t border-green-100 bg-white flex-shrink-0">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder="Хаашаа явах вэ..."
          className="flex-1 bg-slate-50 border border-green-200 rounded-full px-4 py-2 text-[12px] text-slate-800 placeholder-slate-400 outline-none focus:border-green-500 focus:bg-white transition-colors"
        />
        <button
          onClick={() => send()}
          className="w-9 h-9 rounded-full bg-gradient-to-br from-green-500 to-yellow-400 flex items-center justify-center text-white hover:opacity-95 active:scale-95 shadow-sm transition-all"
        >
          <Send size={14} />
        </button>
      </div>
    </div>
  );
};
export default TravelChatbot;
