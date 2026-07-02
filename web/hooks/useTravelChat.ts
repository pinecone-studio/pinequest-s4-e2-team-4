"use client";

import { ChatSession, Message } from "@/app/chat/types";
import {
  destinationReplies,
  getStepQuestionReplies,
} from "@/app/chat/utils/chatQuickReplies";
import { extractAllDestinationSuggestions } from "@/app/chat/utils/destinationSuggestions";
import { useSearchParams } from "next/navigation";
import React, { useCallback, useEffect, useRef, useState } from "react";

export function useTravelChat() {
  const searchParams = useSearchParams();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [historyLoading, setHistoryLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const initialPromptHandledRef = useRef(false);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const fetchSessions = useCallback(async () => {
    setHistoryLoading(true);
    try {
      const res = await fetch("/api/chat/history", { credentials: "include" });
      const data = await res.json();
      if (data.success) setSessions(data.sessions);
    } catch {
      // silently fail
    } finally {
      setHistoryLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchSessions();
    }, 0);
    return () => clearTimeout(timer);
  }, [fetchSessions]);

  const loadSession = async (sid: string) => {
    try {
      const res = await fetch(`/api/chat/history?sessionId=${sid}`, {
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        setMessages(
          data.messages.map(
            (m: { role: string; content: string; createdAt: string }) => ({
              role: m.role,
              content: m.content,
              createdAt: m.createdAt,
            }),
          ),
        );
        setSessionId(sid);
        setSidebarOpen(false);
      }
    } catch {
      // FAIL
    }
  };

  const deleteSession = async (chatId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setDeletingId(chatId);
    try {
      const res = await fetch("/api/chat/history/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ chatId }),
      });
      const data = await res.json();
      if (data.success) {
        setSessions((prev) => prev.filter((s) => s.id !== chatId));
        if (sessionId === chatId) {
          setSessionId(null);
          setMessages([]);
        }
      }
    } catch {
      // FAIL
    } finally {
      setDeletingId(null);
    }
  };

  const startNewChat = () => {
    setSessionId(null);
    setMessages([]);
    setSidebarOpen(false);
  };

  const sendMessage = useCallback(
    async (text: string, targetSessionId = sessionId) => {
      const trimmed = text.trim();
      if (!trimmed || isLoading) return;

      setMessages((prev) => [...prev, { role: "user", content: trimmed }]);
      setInput("");
      if (textareaRef.current) textareaRef.current.style.height = "auto";
      setIsLoading(true);

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            message: trimmed,
            sessionId: targetSessionId,
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Сервер алдаа гарлаа");

        if (data.sessionId) {
          setSessionId(data.sessionId);
          fetchSessions();
        }
        setMessages((prev) => [
          ...prev,
          { role: "model", content: data.response },
        ]);
      } catch (err: unknown) {
        const msg =
          err instanceof Error ? err.message : "Холболтын алдаа гарлаа.";
        setMessages((prev) => [
          ...prev,
          { role: "model", content: `⚠️ ${msg}` },
        ]);
      } finally {
        setIsLoading(false);
      }
    },
    [fetchSessions, isLoading, sessionId],
  );

  useEffect(() => {
    const prompt =
      searchParams.get("prompt") ||
      sessionStorage.getItem("montrip-initial-chat-prompt");

    if (!prompt || initialPromptHandledRef.current) return;

    const timer = window.setTimeout(() => {
      if (initialPromptHandledRef.current) return;

      initialPromptHandledRef.current = true;
      sessionStorage.removeItem("montrip-initial-chat-prompt");
      setSessionId(null);
      setMessages([]);
      void sendMessage(prompt, null);
    }, 0);

    return () => window.clearTimeout(timer);
  }, [searchParams, sendMessage]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const activeSession = sessions.find((s) => s.id === sessionId);
  const lastModelMessage =
    [...messages].reverse().find((m) => m.role === "model")?.content ?? "";
  const destinationSuggestions = extractAllDestinationSuggestions(
    messages
      .filter((message) => message.role === "model" && !message.content.startsWith("⚠️"))
      .map((message) => message.content),
  );
  const stepReplies =
    lastModelMessage && !lastModelMessage.startsWith("⚠️")
      ? getStepQuestionReplies(lastModelMessage)
      : [];
  const quickReplies =
    stepReplies.length > 0 ? stepReplies : destinationReplies(destinationSuggestions);

  return {
    messages,
    input,
    setInput,
    isLoading,
    sessionId,
    sessions,
    sidebarOpen,
    setSidebarOpen,
    deletingId,
    historyLoading,
    messagesEndRef,
    textareaRef,
    activeSession,
    lastModelMessage,
    quickReplies,
    loadSession,
    deleteSession,
    startNewChat,
    sendMessage,
    handleKeyDown,
  };
}
