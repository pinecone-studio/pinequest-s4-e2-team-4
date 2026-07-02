"use client";

import axios from "axios"; // 👈 Axios-оо импортлов
import { useRef, useState } from "react";

export function useTextToSpeech() {
  const [isVoiceMode, setIsVoiceMode] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const speak = async (text: string) => {
    if (!isVoiceMode || !text) return;

    try {
      // Өмнө нь тоглож байсан аудио байвал зогсооно
      if (audioRef.current) {
        audioRef.current.pause();
      }

      setIsPlaying(true);

      // 🔄 fetch-ийг бүрэн axios болгож өөрчлөв
      const response = await axios.post(
        "/api/tts",
        { text },
        {
          responseType: "blob", // 👈 Chimege API-аас ирэх аудиог зөв уншихын тулд заавал хэрэгтэй!
        },
      );

      // Axios дээр дата нь шууд response.data дотор ирдэг
      const blob = response.data;
      const url = URL.createObjectURL(blob);

      const audio = new Audio(url);
      audioRef.current = audio;

      audio.onended = () => setIsPlaying(false);
      audio.onerror = () => setIsPlaying(false);

      await audio.play();
    } catch (err) {
      console.error("TTS тоглуулахад алдаа гарлаа:", err);
      setIsPlaying(false);
    }
  };

  const stopSpeaking = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const toggleVoiceMode = () => {
    const nextMode = !isVoiceMode;
    setIsVoiceMode(nextMode);
    if (!nextMode) {
      stopSpeaking();
    }
  };

  return {
    isVoiceMode,
    isPlaying,
    speak,
    stopSpeaking,
    toggleVoiceMode,
  };
}
