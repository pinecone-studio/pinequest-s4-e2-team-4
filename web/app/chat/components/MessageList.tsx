"use client";

import { Message } from "@/app/chat/types";
import { useSpeechToText } from "@/hooks/useSpeechToText";
import { useTextToSpeech } from "@/hooks/useTextToSpeech";
import { Compass } from "lucide-react";
import { RefObject, useEffect } from "react";
import { InputBar } from "./InputBar";
import { MessageBubble } from "./MessageBubble";
import { WelcomeScreen } from "./WelcomeScreen";

interface MessageListProps {
  messages: Message[];
  isLoading: boolean;
  input: string;
  messagesEndRef: RefObject<HTMLDivElement | null>;
  textareaRef: RefObject<HTMLTextAreaElement | null>;
  quickReplies: { label: string; value: string }[];
  onInputChange: (value: string) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  onSend: (text: string) => void;
}

const MessageList = ({
  messages,
  isLoading,
  input,
  messagesEndRef,
  textareaRef,
  quickReplies,
  onInputChange,
  onKeyDown,
  onSend,
}: MessageListProps) => {
  const { startRecording, stopRecording, isRecording, sttLoading } =
    useSpeechToText((text) => {
      if (text.trim()) {
        onSend(text);
      }
    });

  const { isVoiceMode, isPlaying, speak, stopSpeaking, toggleVoiceMode } =
    useTextToSpeech();

  useEffect(() => {
    if (messages.length > 0 && !isLoading) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.role === "model") {
        speak(lastMessage.content);
      }
    }
  }, [messages, isLoading, speak]);

  return (
    <>
      <div className="flex-1 space-y-5 overflow-y-auto px-4 py-6 scrollbar-thin">
        {messages.length === 0 && (
          <WelcomeScreen isLoading={isLoading} onSend={onSend} />
        )}

        {messages.map((msg, i) => (
          <MessageBubble
            key={i}
            msg={msg}
            isPlaying={isPlaying}
            onSpeak={speak}
            onStopSpeaking={stopSpeaking}
          />
        ))}

        {isLoading && (
          <div className="flex items-end gap-2.5">
            <div className="flex h-8 w-8 shrink items-center justify-center rounded-full bg-[#0A4429]/10 text-[#0A4429] border border-[#0A4429]/10">
              <Compass className="h-4 w-4" />
            </div>
            <div className="rounded-[20px] rounded-bl-sm border border-slate-100 bg-white px-4 py-3.5 shadow-sm">
              <div className="flex items-center gap-1.5 px-1 py-0.5">
                {[0, 1, 2].map((n) => (
                  <span
                    key={n}
                    className="h-2 w-2 animate-bounce rounded-full bg-[#0A4429]"
                    style={{ animationDelay: `${n * 0.15}s` }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <InputBar
        input={input}
        isLoading={isLoading}
        isRecording={isRecording}
        sttLoading={sttLoading}
        isVoiceMode={isVoiceMode}
        textareaRef={textareaRef}
        quickReplies={quickReplies}
        onInputChange={onInputChange}
        onKeyDown={onKeyDown}
        onSend={onSend}
        onToggleRecording={isRecording ? stopRecording : startRecording}
        onToggleVoiceMode={toggleVoiceMode}
        onStopSpeaking={stopSpeaking}
      />
    </>
  );
};

export default MessageList;
