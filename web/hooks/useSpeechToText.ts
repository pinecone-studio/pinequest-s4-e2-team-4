"use client";

import axios from "axios";
import { useEffect, useRef, useState } from "react";

export function useSpeechToText(onTranscriptComplete: (text: string) => void) {
  const [isRecording, setIsRecording] = useState(false);
  const [sttLoading, setSttLoading] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const silenceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const maxDurationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const MAX_DURATION = 30000;
  const SILENCE_DEBOUNCE = 2000;
  const VOLUME_THRESHOLD = 12;

  const startRecording = async () => {
    try {
      chunksRef.current = [];
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: "audio/webm",
      });
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(chunksRef.current, { type: "audio/webm" });

        if (audioBlob.size > 5 * 1024 * 1024) {
          alert("Дуут бичлэгийн хэмжээ хэтэрсэн байна (Макс 5MB).");
          await cleanup();
          return;
        }

        await uploadAudio(audioBlob);
        await cleanup();
      };

      const AudioContextClass =
        window.AudioContext || (window as any).webkitAudioContext;
      const audioContext = new AudioContextClass();
      audioContextRef.current = audioContext;

      const source = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 512;
      source.connect(analyser);
      analyserRef.current = analyser;

      mediaRecorder.start(200);
      setIsRecording(true);

      maxDurationTimeoutRef.current = setTimeout(() => {
        stopRecording();
      }, MAX_DURATION);

      trackSilence();
    } catch (err) {
      console.error("Микрофон ажиллуулахад алдаа гарлаа:", err);
    }
  };

  const trackSilence = () => {
    if (!analyserRef.current) return;

    const bufferLength = analyserRef.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const checkVolume = () => {
      if (
        !analyserRef.current ||
        mediaRecorderRef.current?.state !== "recording"
      )
        return;

      analyserRef.current.getByteFrequencyData(dataArray);
      let sum = 0;
      for (let i = 0; i < bufferLength; i++) {
        sum += dataArray[i];
      }
      const averageVolume = sum / bufferLength;

      if (averageVolume < VOLUME_THRESHOLD) {
        if (!silenceTimeoutRef.current) {
          silenceTimeoutRef.current = setTimeout(() => {
            stopRecording();
          }, SILENCE_DEBOUNCE);
        }
      } else {
        if (silenceTimeoutRef.current) {
          clearTimeout(silenceTimeoutRef.current);
          silenceTimeoutRef.current = null;
        }
      }

      if (mediaRecorderRef.current?.state === "recording") {
        requestAnimationFrame(checkVolume);
      }
    };

    requestAnimationFrame(checkVolume);
  };

  const stopRecording = () => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state === "recording"
    ) {
      mediaRecorderRef.current.stop();
    }
  };

  const cleanup = async () => {
    setIsRecording(false);

    if (silenceTimeoutRef.current) {
      clearTimeout(silenceTimeoutRef.current);
      silenceTimeoutRef.current = null;
    }
    if (maxDurationTimeoutRef.current) {
      clearTimeout(maxDurationTimeoutRef.current);
      maxDurationTimeoutRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }

    if (audioContextRef.current) {
      const ctx = audioContextRef.current;
      audioContextRef.current = null;

      if (ctx.state !== "closed") {
        try {
          await ctx.close();
        } catch (err) {
          console.error("AudioContext хаахад алдаа гарлаа:", err);
        }
      }
    }
  };

  const uploadAudio = async (blob: Blob) => {
    setSttLoading(true);
    try {
      const file = new File([blob], "voice.webm", { type: "audio/webm" });
      const formData = new FormData();
      formData.append("file", file);

      const res = await axios.post("/api/stt", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data?.success && res.data?.text) {
        onTranscriptComplete(res.data.text.trim());
      }
    } catch (error) {
      console.error("STT Хөрвүүлэлтийн алдаа:", error);
    } finally {
      setSttLoading(false);
    }
  };

  useEffect(() => {
    return () => {
      cleanup();
    };
  }, []);

  return { startRecording, stopRecording, isRecording, sttLoading };
}
