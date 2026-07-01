"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { Message, ChatSession } from "@/app/chat/types";
import Sidebar from "./Sidebar";
import MessageList from "./MessageList";
import { Menu, Plus } from "lucide-react";
import { useSearchParams } from "next/navigation";

const TravelChatBot = () => {
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
      //FAIL
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

  const sendMessage = useCallback(async (text: string, targetSessionId = sessionId) => {
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
        body: JSON.stringify({ message: trimmed, sessionId: targetSessionId }),
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
      setMessages((prev) => [...prev, { role: "model", content: `⚠️ ${msg}` }]);
    } finally {
      setIsLoading(false);
    }
  }, [fetchSessions, isLoading, sessionId]);

  useEffect(() => {
    const prompt =
      searchParams.get("prompt") ||
      sessionStorage.getItem("montrip-initial-chat-prompt");

    if (!prompt || initialPromptHandledRef.current) {
      return;
    }

    const timer = window.setTimeout(() => {
      if (initialPromptHandledRef.current) {
        return;
      }

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

  return (
    <div className="flex h-full overflow-hidden bg-slate-50 font-sans relative">
      {/* Mobile overlay - styled inside the PhoneFrame absolute box */}
      {sidebarOpen && (
        <div
          className="absolute inset-0 z-20 bg-black/40 backdrop-blur-sm transition-opacity duration-300"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <Sidebar
        sessions={sessions}
        sessionId={sessionId}
        sidebarOpen={sidebarOpen}
        historyLoading={historyLoading}
        deletingId={deletingId}
        onLoadSession={loadSession}
        onDeleteSession={deleteSession}
        onNewChat={startNewChat}
      />

      {/* Main */}
      <main className="flex min-w-0 flex-1 flex-col">
        {/* Top bar - padded at the top to accommodate the notch */}
        <div className="flex flex-shrink-0 items-center gap-3 border-b border-slate-100 bg-white px-4 pb-3 pt-10 shadow-sm z-10">
          <button
            onClick={() => setSidebarOpen(true)}
            aria-label="Түүх нээх"
            className="rounded-xl p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-800"
          >
            <Menu className="h-5 w-5" />
          </button>

          <h1 className="flex-1 text-sm font-bold text-slate-800 truncate">
            {activeSession ? activeSession.title : "Шинэ чат"}
          </h1>

          {sessionId && (
            <button
              onClick={startNewChat}
              className="flex items-center gap-1 text-xs font-semibold text-[#0A4429] transition-all hover:opacity-85 active:scale-95"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Шинэ чат</span>
            </button>
          )}
        </div>

        <MessageList
          messages={messages}
          isLoading={isLoading}
          input={input}
          messagesEndRef={messagesEndRef}
          textareaRef={textareaRef}
          onInputChange={setInput}
          onKeyDown={handleKeyDown}
          onSend={sendMessage}
        />
      </main>
    </div>
  );
};

export default TravelChatBot;
