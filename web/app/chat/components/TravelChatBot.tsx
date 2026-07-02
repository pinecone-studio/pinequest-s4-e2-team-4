"use client";

import { useTextToSpeech } from "@/hooks/useTextToSpeech";
import { useTravelChat } from "@/hooks/useTravelChat";
import { Menu, Plus } from "lucide-react";
import { SpeakButton } from "./ChatButton";
import MessageList from "./MessageList";
import Sidebar from "./Sidebar";

const TravelChatBot = () => {
  const {
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
    loadSession,
    deleteSession,
    startNewChat,
    sendMessage,
    handleKeyDown,
  } = useTravelChat();

  const { isPlaying, speak, stopSpeaking } = useTextToSpeech();

  return (
    <div className="flex h-full overflow-hidden bg-slate-50 font-sans relative">
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

      <main className="flex min-w-0 flex-1 flex-col">
        <div className="flex shrink-0 items-center gap-3 border-b border-slate-100 bg-white px-4 pb-3 pt-10 shadow-sm z-10">
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

          {lastModelMessage && (
            <SpeakButton
              content={lastModelMessage}
              isPlaying={isPlaying}
              onSpeak={speak}
              onStopSpeaking={stopSpeaking}
            />
          )}

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
