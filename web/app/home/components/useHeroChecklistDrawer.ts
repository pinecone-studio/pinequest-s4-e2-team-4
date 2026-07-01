"use client";

import axios from "axios";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import type { ChecklistItem } from "./checklistTypes";

type AudioWindow = Window &
  typeof globalThis & {
    webkitAudioContext?: typeof AudioContext;
  };

function playBeepSound() {
  try {
    const AudioContextClass =
      window.AudioContext || (window as AudioWindow).webkitAudioContext;
    if (!AudioContextClass) return;

    const ctx = new AudioContextClass();
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
  } catch {}
}

export function useHeroChecklistDrawer() {
  const params = useParams();
  const tripId = (params?.id || params?.tripId || "") as string;

  const [items, setItems] = useState<ChecklistItem[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [alarmDate, setAlarmDate] = useState("2026-07-01");
  const [alarmTime, setAlarmTime] = useState("07:30");
  const [isAlarmSet, setIsAlarmSet] = useState(false);
  const [isAlarmTriggered, setIsAlarmTriggered] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const audioIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const fetchChecklist = async () => {
    try {
      setIsLoaded(false);
      const url = tripId ? `/api/checklist?tripId=${tripId}` : "/api/checklist";
      const response = await axios.get(url);
      setItems(response.data);
    } catch (error) {
      console.error("Checklist татахад алдаа гарлаа:", error);
      setItems([]);
    } finally {
      setIsLoaded(true);
    }
  };

  useEffect(() => {
    const savedDate = localStorage.getItem("montrip-alarm-date");
    const savedTime = localStorage.getItem("montrip-alarm-time");
    const savedIsSet = localStorage.getItem("montrip-alarm-set");

    if (savedDate) setAlarmDate(savedDate);
    if (savedTime) setAlarmTime(savedTime);
    if (savedIsSet) setIsAlarmSet(savedIsSet === "true");

    fetchChecklist();
  }, [tripId]);

  useEffect(() => {
    if (isAlarmTriggered) {
      playBeepSound();
      audioIntervalRef.current = setInterval(playBeepSound, 1000);
    } else if (audioIntervalRef.current) {
      clearInterval(audioIntervalRef.current);
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

  // ✅ Зөвхөн DB-д бодитоор байгаа category-нуудаас гаргаж авна
  const categories = useMemo(() => {
    return Array.from(new Set(items.map((item) => item.category || "Бусад")));
  }, [items]);

  // Сонгосон category нь боломжит жагсаалтад байхгүй болсон бол эхнийх рүү шилжинэ
  useEffect(() => {
    if (categories.length === 0) {
      setSelectedCategory("");
      return;
    }
    if (!categories.includes(selectedCategory)) {
      setSelectedCategory(categories[0]);
    }
  }, [categories, selectedCategory]);

  const addItem = async (event: FormEvent) => {
    event.preventDefault();
    if (!inputValue.trim() || !selectedCategory) return;

    try {
      const response = await axios.post("/api/checklist", {
        title: inputValue.trim(),
        category: selectedCategory,
        tripId: tripId || undefined,
      });

      if (response.data) {
        const newItem = response.data.item || response.data;
        setItems((prev) => [...prev, newItem]);
        setInputValue("");
      }
    } catch (error) {
      console.error("Нэмэхэд алдаа гарлаа:", error);
    }
  };

  const toggleCheck = async (id: string) => {
    const targetItem = items.find((item) => item.id === id);
    if (!targetItem) return;

    try {
      setItems((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, isCompleted: !item.isCompleted } : item,
        ),
      );

      await axios.patch(`/api/checklist/${id}`, {
        isCompleted: !targetItem.isCompleted,
      });
    } catch (error) {
      console.error("Шинэчлэхэд алдаа гарлаа:", error);
      setItems((prev) =>
        prev.map((item) =>
          item.id === id
            ? { ...item, isCompleted: targetItem.isCompleted }
            : item,
        ),
      );
    }
  };

  const deleteItem = async (id: string) => {
    try {
      setItems((prev) => prev.filter((item) => item.id !== id));
      await axios.delete(`/api/checklist/${id}`);
    } catch (error) {
      console.error("Устгахад алдаа гарлаа:", error);
      fetchChecklist();
    }
  };

  return {
    addItem,
    alarmDate,
    alarmTime,
    categories,
    deleteItem,
    inputValue,
    isAlarmSet,
    isAlarmTriggered,
    isLoaded,
    selectedCategory,
    setAlarmDate,
    setAlarmTime,
    setInputValue,
    setIsAlarmTriggered,
    setSelectedCategory,
    toggleAlarmSetting,
    toggleCheck,
    visibleItems: items.filter((item) => item.category === selectedCategory),
  };
}
