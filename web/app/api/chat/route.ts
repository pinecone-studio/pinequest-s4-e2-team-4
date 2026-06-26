import { prisma } from "@/lib/prisma";
import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(request: NextRequest) {
  try {
    const { sessionId, message, userId } = await request.json();

    if (!message) {
      return NextResponse.json(
        { error: "Мессеж хоосон байж болохгүй" },
        { status: 400 },
      );
    }

    let currentSessionId = sessionId;

    if (!currentSessionId) {
      if (!userId) {
        return NextResponse.json(
          {
            error:
              "Шинэ чат үүсгэхийн тулд хэрэглэгчийн userId заавал шаардлагатай",
          },
          { status: 400 },
        );
      }

      const userExists = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!userExists) {
        return NextResponse.json(
          { error: "Өгөгдлийн санд ийм ID-тай хэрэглэгч бүртгэгдээгүй байна" },
          { status: 404 },
        );
      }

      const newSession = await prisma.chatSession.create({
        data: {
          userId: userId,
          title: message.slice(0, 30) + "...",
        },
      });
      currentSessionId = newSession.id;
    }

    await prisma.message.create({
      data: {
        sessionId: currentSessionId,
        role: "user",
        content: message,
      },
    });

    const previousMessages = await prisma.message.findMany({
      where: { sessionId: currentSessionId },
      orderBy: { createdAt: "asc" },
    });

    const history = previousMessages.slice(0, -1).map((msg) => ({
      role: msg.role === "user" ? "user" : "model",
      parts: [{ text: msg.content }],
    }));

    const chat = ai.chats.create({
      model: "gemini-3.5-flash",
      history: history,
    });

    const result = await chat.sendMessage({ message });
    const aiResponse = result.text;

    if (!aiResponse) {
      return NextResponse.json(
        { error: "AI-аас ямар нэгэн хариу ирсэнгүй." },
        { status: 500 },
      );
    }

    await prisma.message.create({
      data: {
        sessionId: currentSessionId,
        role: "model",
        content: aiResponse,
      },
    });

    return NextResponse.json({
      success: true,
      sessionId: currentSessionId,
      response: aiResponse,
    });
  } catch (error) {
    console.error("Chat API Error:", error);
    return NextResponse.json(
      { error: "Сервер дээр алдаа гарлаа" },
      { status: 500 },
    );
  }
}
