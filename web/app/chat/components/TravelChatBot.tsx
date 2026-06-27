// "use client";
// import { useState, useRef, useEffect } from "react";
// import { Send } from "lucide-react";

// type Message = {
//   role: "user" | "ai";
//   text: string;
//   card?: TripCard;
// };

// type TripCard = {
//   title: string;
//   items: { label: string; price: string; icon: string }[];
//   total: string;
// };

// const mockResponses = (text: string): { text: string; card?: TripCard } => {
//   const lower = text.toLowerCase();
//   if (lower.includes("visa") || lower.includes("виза"))
//     return {
//       text: "🛂 Монгол иргэдэд Бали руу 30 хоногийн Visa-on-arrival олгодог. Зардал $35.",
//     };
//   if (lower.includes("буудал") || lower.includes("hotel"))
//     return {
//       text: "🏨 Ubud Tropical Suite – $45/шөнө ⭐4.8\nSeminyak Beach Resort – $60/шөнө ⭐4.6",
//     };
//   if (lower.includes("цаг") || lower.includes("weather"))
//     return {
//       text: "🌤 Хуурай улирал (11-р – 4-р сар) нь аяллын хамгийн тохиромжтой цаг.",
//     };
//   if (lower.match(/(бали|тайланд|япон|солонгос|европ)/)) {
//     return {
//       text: "Маш сайн сонголт! Энд тооцоолсон зардал:",
//       card: {
//         title: `✈️ ${text.trim()} — 5 хоног, 2 хүн`,
//         items: [
//           { label: "Нислэг", price: "~$480", icon: "✈️" },
//           { label: "Буудал, 5 шөнө", price: "~$300", icon: "🏨" },
//           { label: "Тээвэр + экскурс", price: "~$120", icon: "🚗" },
//           { label: "Хоол хүнс", price: "~$150", icon: "🍜" },
//         ],
//         total: "~$1,050",
//       },
//     };
//   }
//   return { text: "Аяллын мэдээлэл хайж байна... Хаашаа явахыг хэлэх үү?" };
// };

// export const TravelChatbot = () => {
//   const [messages, setMessages] = useState<Message[]>([
//     { role: "ai", text: "Сайн байна уу! 👋 Хаашаа явахыг мөрөөдөж байна вэ?" },
//   ]);
//   const [input, setInput] = useState("");
//   const [typing, setTyping] = useState(false);
//   const bottomRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     bottomRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages, typing]);

//   const send = async (text?: string) => {
//     const msg = text ?? input.trim();
//     if (!msg) return;
//     setInput("");
//     setMessages((prev) => [...prev, { role: "user", text: msg }]);
//     setTyping(true);
//     await new Promise((r) => setTimeout(r, 1000));
//     setTyping(false);
//     const res = mockResponses(msg);
//     setMessages((prev) => [...prev, { role: "ai", ...res }]);
//   };

//   const quickReplies = [
//     "📅 Өдрийн хөтөлбөр",
//     "🛂 Visa мэдээлэл",
//     "🏨 Буудал",
//     "🌤 Цаг агаар",
//   ];

//   return (
//     <div className="flex flex-col h-full bg-slate-50 text-slate-800 overflow-hidden">
//       {/* Header */}
//       <div className="flex items-end h-23 mt-20  gap-3 px-4 py-3 border-b border-green-100 bg-white shadow-sm flex-shrink-0">
//         <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-yellow-400 flex items-center justify-center text-xs font-semibold text-white">
//           AI
//         </div>
//         <div>
//           <p className="text-sm font-semibold text-slate-800">Аяллын Зөвлөгч</p>
//           <p className="text-[10px] text-green-600 flex items-center gap-1 font-medium">
//             <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse inline-block" />
//             онлайн
//           </p>
//         </div>
//       </div>

//       {/* Messages */}
//       <div className="flex-1 overflow-y-auto px-3 py-3 space-y-3 scrollbar-none">
//         {messages.map((m, i) => (
//           <div
//             key={i}
//             className={`flex gap-2 ${m.role === "user" ? "flex-row-reverse" : "flex-row"} items-end`}
//           >
//             {m.role === "ai" && (
//               <div className="w-6 h-6 rounded-full bg-gradient-to-br from-green-500 to-yellow-400 flex items-center justify-center text-[9px] font-bold text-white flex-shrink-0">
//                 AI
//               </div>
//             )}
//             <div className="max-w-[210px] space-y-2">
//               <div
//                 className={`px-3 py-2 rounded-2xl text-[12px] leading-relaxed whitespace-pre-line shadow-sm ${
//                   m.role === "user"
//                     ? "bg-green-600 text-white rounded-br-sm"
//                     : "bg-white border border-green-100 text-slate-800 rounded-bl-sm"
//                 }`}
//               >
//                 {m.text}
//               </div>
//               {m.card && (
//                 <div className="bg-amber-50/60 border border-yellow-200 rounded-xl p-3 text-[11px] shadow-sm">
//                   <p className="text-emerald-800 font-bold mb-2">
//                     {m.card.title}
//                   </p>
//                   {m.card.items.map((item, j) => (
//                     <div
//                       key={j}
//                       className="flex justify-between py-1 border-b border-yellow-600/10 last:border-0"
//                     >
//                       <span className="text-slate-600">
//                         {item.icon} {item.label}
//                       </span>
//                       <span className="text-green-700 font-semibold">
//                         {item.price}
//                       </span>
//                     </div>
//                   ))}
//                   <div className="flex justify-between pt-2 mt-1 border-t border-yellow-200">
//                     <span className="text-slate-500 font-medium">Нийт дүн</span>
//                     <span className="text-emerald-700 font-bold">
//                       {m.card.total}
//                     </span>
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>
//         ))}
//         {typing && (
//           <div className="flex gap-2 items-end">
//             <div className="w-6 h-6 rounded-full bg-gradient-to-br from-green-500 to-yellow-400 flex items-center justify-center text-[9px] font-bold text-white flex-shrink-0">
//               AI
//             </div>
//             <div className="flex gap-1 bg-white border border-green-100 rounded-2xl rounded-bl-sm px-3 py-2.5 shadow-sm">
//               {[0, 1, 2].map((d) => (
//                 <span
//                   key={d}
//                   className="w-1.5 h-1.5 bg-green-400 rounded-full animate-bounce"
//                   style={{ animationDelay: `${d * 0.2}s` }}
//                 />
//               ))}
//             </div>
//           </div>
//         )}
//         <div ref={bottomRef} />
//       </div>

//       {/* Quick Replies */}
//       <div className="flex gap-1.5 flex-wrap px-3 pb-2 flex-shrink-0">
//         {quickReplies.map((q) => (
//           <button
//             key={q}
//             onClick={() => send(q)}
//             className="text-[10px] px-2.5 py-1.5 rounded-full bg-white border border-yellow-300 text-emerald-800 font-medium hover:bg-yellow-400 hover:text-slate-900 hover:border-yellow-400 shadow-sm transition-all"
//           >
//             {q}
//           </button>
//         ))}
//       </div>

//       {/* Input */}
//       <div className="flex gap-2 px-3 pb-4 pt-2 border-t border-green-100 bg-white flex-shrink-0">
//         <input
//           value={input}
//           onChange={(e) => setInput(e.target.value)}
//           onKeyDown={(e) => e.key === "Enter" && send()}
//           placeholder="Хаашаа явах вэ..."
//           className="flex-1 bg-slate-50 border border-green-200 rounded-full px-4 py-2 text-[12px] text-slate-800 placeholder-slate-400 outline-none focus:border-green-500 focus:bg-white transition-colors"
//         />
//         <button
//           onClick={() => send()}
//           className="w-9 h-9 rounded-full bg-gradient-to-br from-green-500 to-yellow-400 flex items-center justify-center text-white hover:opacity-95 active:scale-95 shadow-sm transition-all"
//         >
//           <Send size={14} />
//         </button>
//       </div>
//     </div>
//   );
// };
// export default TravelChatbot;

// "use client";
// import React, { useState } from "react";

// const TravelChatBot = () => {
//   const [messages, setMessages] = useState<any[]>([]);
//   const [input, setInput] = useState("");
//   const [sessionId, setSessionId] = useState<string | null>(null);

//   const sendMessage = async () => {
//     if (!input.trim()) return;

//     const userMessage = {
//       role: "user",
//       content: input,
//     };

//     setMessages((prev) => [...prev, userMessage]);

//     const currentInput = input;
//     setInput("");

//     const res = await fetch("/api/chat", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         sessionId,
//         message: currentInput,
//       }),
//     });

//     const data = await res.json();

//     if (!res.ok) {
//       console.log(data.error);
//       return;
//     }

//     setSessionId(data.sessionId);

//     setMessages((prev) => [
//       ...prev,
//       {
//         role: "model",
//         content: data.response,
//       },
//     ]);
//   };

//   return <div></div>;
// };

// export default TravelChatBot;

"use client";
import React, { useState, useRef, useEffect } from "react";

interface Message {
  role: "user" | "model";
  content: string;
}

const SUGGESTIONS = [
  "Best places to visit in Mongolia?",
  "Plan a 5-day trip to Tokyo",
  "Budget travel tips for Europe",
  "Hidden gems in Southeast Asia",
];

export default function TravelChatBot() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = Math.min(ta.scrollHeight, 140) + "px";
  }, [input]);

  const sendMessage = async (text?: string) => {
    const msg = (text ?? input).trim();
    if (!msg || loading) return;

    setMessages((prev) => [...prev, { role: "user", content: msg }]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, message: msg }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessages((prev) => [
          ...prev,
          {
            role: "model",
            content: `⚠️ ${data.error || "Something went wrong. Please try again."}`,
          },
        ]);
        return;
      }

      setSessionId(data.sessionId);
      setMessages((prev) => [
        ...prev,
        { role: "model", content: data.response },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "model",
          content:
            "⚠️ Network error. Please check your connection and try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col h-screen bg-slate-950 text-slate-100 font-sans">
      {/* Header */}
      <header className="flex items-center gap-3 px-6 py-4 border-b border-white/[0.07] bg-white/[0.02] backdrop-blur flex-shrink-0">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-lg flex-shrink-0">
          🌍
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="text-base font-bold tracking-tight text-slate-100">
            Travel AI
          </span>
          <span className="text-xs text-slate-500 flex items-center gap-1.5">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400" />
            Ready to explore
          </span>
        </div>
        <button
          onClick={() => {
            setMessages([]);
            setSessionId(null);
          }}
          className="ml-auto text-sm text-slate-400 border border-white/10 rounded-lg px-3 py-1.5 hover:bg-white/[0.07] hover:text-slate-200 transition-colors"
        >
          + New chat
        </button>
      </header>

      {/* Message list */}
      <main className="flex-1 overflow-y-auto px-5 py-7 flex flex-col gap-5 scrollbar-thin scrollbar-thumb-white/10">
        {/* Empty state */}
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center flex-1 text-center px-4 gap-4">
            <div className="text-5xl mb-2">✈️</div>
            <h2 className="text-2xl font-extrabold tracking-tight text-slate-100">
              Where to next?
            </h2>
            <p className="text-sm text-slate-500 leading-relaxed max-w-xs">
              Ask me anything about destinations, itineraries, budgets, or
              hidden gems around the world.
            </p>
            <div className="flex flex-wrap gap-2 justify-center mt-2">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => sendMessage(s)}
                  className="px-4 py-2 rounded-full text-sm border border-indigo-500/40 bg-indigo-500/10 text-indigo-300 hover:bg-indigo-500/20 hover:border-indigo-400/60 hover:text-indigo-200 transition-all"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Messages */}
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex items-end gap-2.5 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
          >
            {msg.role === "model" && (
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-sm flex-shrink-0">
                ✈
              </div>
            )}
            <div
              className={`max-w-[70%] px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap break-words ${
                msg.role === "user"
                  ? "bg-gradient-to-br from-indigo-500 to-violet-600 text-white rounded-br-sm shadow-lg shadow-indigo-500/20"
                  : "bg-white/[0.05] border border-white/[0.08] text-slate-300 rounded-bl-sm"
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {loading && (
          <div className="flex items-end gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-sm flex-shrink-0">
              ✈
            </div>
            <div className="bg-white/[0.05] border border-white/[0.08] rounded-2xl rounded-bl-sm px-4 py-3.5 flex gap-1.5 items-center">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-500 animate-bounce [animation-delay:0ms]" />
              <span className="w-1.5 h-1.5 rounded-full bg-slate-500 animate-bounce [animation-delay:150ms]" />
              <span className="w-1.5 h-1.5 rounded-full bg-slate-500 animate-bounce [animation-delay:300ms]" />
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </main>

      {/* Input bar */}
      <div className="flex-shrink-0 border-t border-white/[0.07] bg-white/[0.02] px-5 py-4 flex flex-col gap-2">
        <div className="flex items-end gap-2.5">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about destinations, trips, travel tips…"
            rows={1}
            className="flex-1 resize-none bg-white/[0.05] border border-white/10 focus:border-indigo-500/50 rounded-2xl px-4 py-3 text-sm text-slate-100 placeholder-slate-600 outline-none transition-colors leading-relaxed overflow-hidden"
          />
          <button
            onClick={() => sendMessage()}
            disabled={!input.trim() || loading}
            className="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white flex items-center justify-center flex-shrink-0 transition-all hover:scale-105 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-lg shadow-indigo-500/20"
          >
            ➤
          </button>
        </div>
        <p className="text-center text-xs text-slate-700">
          Enter to send · Shift+Enter for new line
        </p>
      </div>
    </div>
  );
}
