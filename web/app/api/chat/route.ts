import { prisma } from "@/lib/prisma";
import { translateChecklistText } from "@/app/lib/checklistTranslations";
import { GoogleGenAI } from "@google/genai";
import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

type ExtractedChecklistItem = {
  title: string;
  category?: string | null;
};

type ExtractedDestination = {
  name: string;
  description?: string | null;
  order?: number | null;
  latitude?: number | null;
  longitude?: number | null;
};

type ExtractedTravelData = {
  checklistItems?: ExtractedChecklistItem[];
  destinations?: ExtractedDestination[];
};

type ChatLanguage = "mn" | "en";

function getChatLanguage(value: unknown): ChatLanguage {
  return value === "en" ? "en" : "mn";
}

export async function POST(request: NextRequest) {
  let currentSessionId: string | null = null;

  try {
    const token = request.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json(
        { error: "Нэвтрэх токен олдсонгүй" },
        { status: 401 },
      );
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: string;
    };
    const userId = decoded.id;

    if (!userId) {
      return NextResponse.json(
        { error: "Хүчингүй токен байна" },
        { status: 401 },
      );
    }

    const { language: requestLanguage, sessionId, message, tripId } =
      await request.json();
    const language = getChatLanguage(requestLanguage);

    if (!message) {
      return NextResponse.json(
        { error: "Мессеж хоосон байж болохгүй" },
        { status: 400 },
      );
    }

    currentSessionId = sessionId;

    if (!currentSessionId) {
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

    const systemInstruction = `
Чи бол "MonTrip" аяллын ухаалаг туслах AI байна. Хэрэглэгчтэй найрсаг монгол хэлээр ярилц.

ЧУХАЛ ДҮРЭМ: Хэрэглэгч аяллын төрөл дурдсан ч (Машинтай аялал, Явган аялал, Амралтын газар) ШУУД checklist эсвэл destination үүсгэж болохгүй. Эхлээд дараах мэдээллийг алхам алхамаар асуу:

АЛХАМ 1 - Очих газар:
- "Хаашаа аялахаар төлөвлөж байна вэ?" гэж асуу
- Хэрэглэгч газрын нэр хэлсний дараа л дараагийн алхам руу шилж

АЛХАМ 2 - Хугацаа:
- "Хэдэн өдөр аялахаар төлөвлөж байна вэ?" гэж асуу

АЛХАМ 3 - Хүний тоо:
- "Хэдэн хүн явах вэ?" гэж асуу

АЛХАМ 4 - Зардал:
- "Аяллын төсөв буюу зардлын хязгаар хэр вэ? (төгрөгөөр)" гэж асуу

АЛХАМ 5 - Нэмэлт:
- "Өөр анхаарах зүйл байна уу? (хүүхэдтэй эсэх, тусгай хэрэгцээ гэх мэт)" гэж асуу
- Хэрэглэгч "үгүй" эсвэл "байхгүй" гэвэл дараагийн алхам руу шилж

АЛХАМ 6 - Баталгаажуулалт:
- Цуглуулсан мэдээллийг товч дүгнэж харуул
- "Энэ мэдээлэл дээр үндэслэн аяллын төлөвлөгөө үүсгэх үү?" гэж асуу

АЛХАМ 7 - Зөвхөн хэрэглэгч "тийм", "болно", "үүсгэ" гэх мэт зөвшөөрөл өгсөний ДАРАА:
- Тухайн газар, хугацаа, хүний тоо, зардалд тохирсон дэлгэрэнгүй checklist үүсгэ
- Очих газруудын маршрут болон БОДИТ координатуудыг өг
- Доорх форматаар JSON өгөгдлийг хавсарга:

===JSON_DATA_START===
{
  "checklistItems": [
    { "title": "Зүйл 1", "category": "Хэрэгсэл" },
    { "title": "Зүйл 2", "category": "Хүнс" }
  ],
  "destinations": [
    { "name": "Газрын нэр", "description": "Тайлбар", "order": 1, "latitude": 49.1234, "longitude": 100.1234 }
  ]
}
===JSON_DATA_END===

САНАМЖ:
- Нэг асуултаас илүү нэгэн зэрэг бүү асуу
- Хэрэглэгч аль хэдийн мэдээлэл өгсөн бол дахин бүү асуу
- Координатыг заавал тоогоор өг, мэдэхгүй бол ойролцоо бүс нутгийн төв цэгийг ашигла
- JSON блокийг зөвхөн хэрэглэгч зөвшөөрсний дараа л хавсарга
`;

    const chat = ai.chats.create({
      model: "gemini-3.5-flash",
      history: history,
      config: {
        systemInstruction: systemInstruction,
      },
    });

    const result = await chat.sendMessage({ message });
    const rawAiResponse = result.text;

    if (!rawAiResponse) {
      return NextResponse.json(
        { error: "AI-аас ямар нэгэн хариу ирсэнгүй." },
        { status: 500 },
      );
    }

    let aiResponse = rawAiResponse;
    let extractedData: ExtractedTravelData | null = null;

    if (
      rawAiResponse.includes("===JSON_DATA_START===") &&
      rawAiResponse.includes("===JSON_DATA_END===")
    ) {
      const parts = rawAiResponse.split("===JSON_DATA_START===");
      aiResponse = parts[0].trim();

      const jsonPart = parts[1].split("===JSON_DATA_END===")[0].trim();
      try {
        extractedData = JSON.parse(jsonPart) as ExtractedTravelData;
      } catch (e) {
        console.error("Gemini JSON Parsing Error:", e);
      }
    }

    if (extractedData) {
      let targetTripId = tripId;

      if (!targetTripId && userId) {
        const lastTrip = await prisma.trip.findFirst({
          where: { userId: userId },
          orderBy: { createdAt: "desc" },
        });

        if (lastTrip) {
          targetTripId = lastTrip.id;
        } else {
          const newTrip = await prisma.trip.create({
            data: {
              title: message.slice(0, 20) + " аялал",
              userId: userId,
            },
          });
          targetTripId = newTrip.id;
        }
      }

      if (targetTripId) {
        if (
          extractedData.checklistItems &&
          extractedData.checklistItems.length > 0
        ) {
          await prisma.checklist.createMany({
            data: extractedData.checklistItems.map((item) => ({
              title: translateChecklistText(item.title, language),
              category: item.category
                ? translateChecklistText(item.category, language, "category")
                : language === "en"
                  ? "Other"
                  : "Бусад",
              tripId: targetTripId,
              sessionId: currentSessionId,
            })),
          });
        }

        if (
          extractedData.destinations &&
          extractedData.destinations.length > 0
        ) {
          await prisma.destination.createMany({
            data: extractedData.destinations.map((dest) => ({
              name: dest.name,
              description: dest.description || "",
              order: dest.order || 0,
              latitude:
                typeof dest.latitude === "number" ? dest.latitude : null,
              longitude:
                typeof dest.longitude === "number" ? dest.longitude : null,
              tripId: targetTripId,
            })),
          });
        }
      }
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
    if (error instanceof jwt.JsonWebTokenError) {
      return NextResponse.json(
        { error: "Хүчингүй токен байна" },
        { status: 401 },
      );
    }
    if ((error as any)?.status === 429 || (error as any)?.code === 429) {
      return NextResponse.json(
        {
          error:
            "AI хэт их хүсэлт хүлээн авлаа. Түр хүлээгээд дахин оролдоно уу.",
        },
        { status: 429 },
      );
    }
    return NextResponse.json(
      { error: "Сервер дээр алдаа гарлаа", sessionId: currentSessionId },
      { status: 500 },
    );
  }
}
