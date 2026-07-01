"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowLeft, Check, Plus, Trash2, CheckSquare, Calendar, Clock, Bell, BellOff } from "lucide-react";
import HomeBackdrop from "@/components/home/HomeBackdrop";
import PhoneFrame from "@/components/home/PhoneFrame";

type ChecklistItem = {
  id: number;
  text: string;
  checked: boolean;
  category: "Чухал" | "Ариун цэвэр" | "Эм бэлдмэл" | "Хувцас" | "Технологи";
};

export default function ChecklistPage() {
  const [items, setItems] = useState<ChecklistItem[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<ChecklistItem["category"]>("Чухал");
  
  const [alarmDate, setAlarmDate] = useState("2026-07-01");
  const [alarmTime, setAlarmTime] = useState("07:30");
  const [isAlarmSet, setIsAlarmSet] = useState(false);
  const [isAlarmTriggered, setIsAlarmTriggered] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const audioIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const savedItems = localStorage.getItem("montrip-checklist-v7");
    const savedDate = localStorage.getItem("montrip-alarm-date");
    const savedTime = localStorage.getItem("montrip-alarm-time");
    const savedIsSet = localStorage.getItem("montrip-alarm-set");

    if (savedItems && savedItems !== "[]") {
      setItems(JSON.parse(savedItems));
    } else {
      const defaultItems: ChecklistItem[] = [
        { id: 1, text: "Иргэний үнэмлэх ", checked: false, category: "Чухал" },
        { id: 2, text: "Бэлэн мөнгө / Банкны карт", checked: false, category: "Чухал" },
        { id: 3, text: "Машины бичиг баримт / Жолооны үнэмлэх", checked: false, category: "Чухал" },
        { id: 4, text: "Шүдний сойз, оо", checked: false, category: "Ариун цэвэр" },
        { id: 5, text: "Шампунь", checked: false, category: "Ариун цэвэр" },
        { id: 6, text: "Нойтон, хуурай салфетка", checked: false, category: "Ариун цэвэр" },
        { id: 7, text: "Нарны тос ", checked: false, category: "Ариун цэвэр" },
        { id: 10, text: "Харшлын эм", checked: false, category: "Эм бэлдмэл" },
        { id: 11, text: "Шархны  боолт, хөвөн", checked: false, category: "Эм бэлдмэл" },
        { id: 16, text: "Малгай / Нарны шил", checked: false, category: "Хувцас" },
        { id: 18, text: "Утасны цэнэглэгч ", checked: false, category: "Технологи" },
        { id: 19, text: "(Powerbank)", checked: false, category: "Технологи" },
        { id: 20, text: "Чихэвч speaker", checked: false, category: "Технологи" },
      ];
      setItems(defaultItems);
      localStorage.setItem("montrip-checklist-v7", JSON.stringify(defaultItems));
    }
    
    if (savedDate) setAlarmDate(savedDate);
    if (savedTime) setAlarmTime(savedTime);
    if (savedIsSet) setIsAlarmSet(savedIsSet === "true");
    
    setIsLoaded(true);
  }, []);

  const playBeepSound = () => {
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    } catch (e) {}
  };

  useEffect(() => {
    if (isAlarmTriggered) {
      playBeepSound();
      audioIntervalRef.current = setInterval(playBeepSound, 1000);
    } else {
      if (audioIntervalRef.current) clearInterval(audioIntervalRef.current);
    }
    return () => {
      if (audioIntervalRef.current) clearInterval(audioIntervalRef.current);
    };
  }, [isAlarmTriggered]);

  useEffect(() => {
    if (!isAlarmSet || isAlarmTriggered) return;
    const checkAlarm = () => {
      const now = new Date();
      const todayString = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
      const timeString = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
      if (todayString === alarmDate && timeString === alarmTime) {
        setIsAlarmTriggered(true);
        setIsAlarmSet(false);
        localStorage.setItem("montrip-alarm-set", "false");
      }
    };
    const interval = setInterval(checkAlarm, 3000);
    return () => clearInterval(interval);
  }, [alarmDate, alarmTime, isAlarmSet, isAlarmTriggered]);

  const toggleAlarmSetting = () => {
    const newState = !isAlarmSet;
    setIsAlarmSet(newState);
    localStorage.setItem("montrip-alarm-set", String(newState));
    localStorage.setItem("montrip-alarm-date", alarmDate);
    localStorage.setItem("montrip-alarm-time", alarmTime);
  };

  const toggleCheck = (id: number) => {
    const updated = items.map(item => item.id === id ? { ...item, checked: !item.checked } : item);
    setItems(updated);
    localStorage.setItem("montrip-checklist-v7", JSON.stringify(updated));
  };

  const addItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    const newItem: ChecklistItem = {
      id: Date.now(),
      text: inputValue.trim(),
      checked: false,
      category: selectedCategory, 
    };
    const updated = [...items, newItem];
    setItems(updated);
    localStorage.setItem("montrip-checklist-v7", JSON.stringify(updated));
    setInputValue("");
  };

  const deleteItem = (id: number) => {
    const updated = items.filter(item => item.id !== id);
    setItems(updated);
    localStorage.setItem("montrip-checklist-v7", JSON.stringify(updated));
  };

  const categories: ChecklistItem["category"][] = ["Чухал", "Ариун цэвэр", "Эм бэлдмэл", "Хувцас", "Технологи"];

  if (!isLoaded) return null;

  return (
    <main className="relative grid min-h-screen place-items-center overflow-hidden px-4 py-8 text-slate-950">
      <HomeBackdrop active={true} />

      <div className="relative z-10">
        <PhoneFrame>
          <section className="flex h-full flex-col bg-[#fbfbff]">
            
            <header className="flex items-center gap-4 px-5 pt-14 pb-4 border-b border-gray-100 bg-white shrink-0">
              <Link href="/home" className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-100 hover:bg-gray-50 text-gray-700 transition-colors">
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <h1 className="text-base font-bold text-[#0F2942]">Авч явах зүйлс</h1>
            </header>

            <div className="flex gap-2 overflow-x-auto px-5 py-3 bg-white shrink-0 scrollbar-invisible border-b border-gray-50">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`text-[11px] font-black px-3 py-1.5 rounded-full shrink-0 transition-all ${
                    selectedCategory === cat
                      ? "bg-[#0A4429] text-white shadow-sm"
                      : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <form onSubmit={addItem} className="p-5 pb-3 flex gap-2 bg-white shrink-0">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={`"${selectedCategory}" ангилалд нэмэх...`}
                className="flex-1 bg-gray-50 rounded-xl px-4 py-2.5 text-xs outline-none border border-transparent focus:border-emerald-500 transition-all placeholder-gray-400"
              />
              <button type="submit" className="h-9 w-9 shrink-0 bg-[#0A4429] hover:bg-[#083520] text-white flex items-center justify-center rounded-xl shadow-sm transition-colors">
                <Plus className="h-4 w-4" />
              </button>
            </form>

            <div className="px-5 pb-4 bg-white border-b border-gray-100 shrink-0">
              {isAlarmTriggered ? (
                <div className="p-3 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-between animate-pulse shadow-sm">
                  <div className="flex items-center gap-2">
                    <Bell className="h-4 w-4 text-rose-600 animate-bounce" />
                    <span className="text-xs font-black text-rose-800 tracking-tight">⏰ ЦАГ БОЛЛОО: Юмаа бэлдээрэй!</span>
                  </div>
                  <button 
                    onClick={() => setIsAlarmTriggered(false)}
                    className="text-[10px] bg-rose-600 hover:bg-rose-700 text-white px-3 py-1.5 rounded-xl font-black shadow-md"
                  >
                    УНТРААХ
                  </button>
                </div>
              ) : (
                <div className="p-2.5 rounded-2xl bg-gray-50/80 border border-gray-100 flex items-center justify-between gap-1.5">
                  <div className="flex items-center gap-1 flex-1 min-w-0">
                    <div className="flex items-center gap-1 bg-white rounded-lg px-1.5 py-1 border border-gray-100 flex-1 min-w-0">
                      <Calendar className="h-3 w-3 text-gray-400 shrink-0" />
                      <input 
                        type="date" 
                        value={alarmDate} 
                        disabled={isAlarmSet}
                        onChange={(e) => setAlarmDate(e.target.value)}
                        className="bg-transparent text-[10.5px] font-bold text-gray-700 outline-none w-full disabled:opacity-50"
                      />
                    </div>
                    <div className="flex items-center gap-1 bg-white rounded-lg px-1.5 py-1 border border-gray-100 shrink-0">
                      <Clock className="h-3 w-3 text-gray-400" />
                      <input 
                        type="time" 
                        value={alarmTime} 
                        disabled={isAlarmSet}
                        onChange={(e) => setAlarmTime(e.target.value)}
                        className="bg-transparent text-[10.5px] font-bold text-gray-700 outline-none w-11 disabled:opacity-50"
                      />
                    </div>
                  </div>

                  <button
                    onClick={toggleAlarmSetting}
                    className={`h-7 px-2.5 flex items-center gap-1 rounded-xl text-[10px] font-black shrink-0 transition-all ${
                      isAlarmSet 
                        ? "bg-emerald-600 text-white shadow-sm" 
                        : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                    }`}
                  >
                    {isAlarmSet ? <Bell className="h-3 w-3 animate-pulse" /> : <BellOff className="h-3 w-3" />}
                    {isAlarmSet ? "Асаалттай" : "Сануулах"}
                  </button>
                </div>
              )}
            </div>

            <div className="flex-1 overflow-y-auto px-5 pt-4 pb-6 scrollbar-invisible">
              {items.filter(i => i.category === selectedCategory).length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center text-gray-400">
                  <CheckSquare className="h-10 w-10 stroke-[1.5] mb-2 text-gray-300" />
                  <p className="text-xs">Энэ ангилалд зүйл алга.</p>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {items
                    .filter((item) => item.category === selectedCategory)
                    .map((item) => (
                      <div
                        key={item.id}
                        className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all ${
                          item.checked ? "bg-gray-50/60 border-gray-100" : "bg-white border-gray-100 shadow-sm"
                        }`}
                      >
                        <div onClick={() => toggleCheck(item.id)} className="flex items-center gap-3 flex-1 cursor-pointer select-none">
                          <div className={`h-4 w-4 rounded-full border flex items-center justify-center transition-all ${
                            item.checked ? "bg-[#0A4429] border-[#0A4429] text-white" : "border-gray-300 bg-white"
                          }`}>
                            {item.checked && <Check className="h-2.5 w-2.5 stroke-[3]" />}
                          </div>
                          <span className={`text-xs font-medium transition-all ${item.checked ? "line-through text-gray-400" : "text-gray-700"}`}>
                            {item.text}
                          </span>
                        </div>
                        <button onClick={() => deleteItem(item.id)} className="p-1 text-gray-400 hover:text-red-500 transition-colors">
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ))}
                </div>
              )}
            </div>

          </section>
        </PhoneFrame>
      </div>
    </main>
  );
}