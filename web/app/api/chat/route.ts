import { prisma } from "@/lib/prisma";
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

    const { sessionId, message, tripId } = await request.json();

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
      Чи бол аяллын ухаалаг туслах AI байна. Хэрэглэгч өөрөө текст бичихээс гадна фронт дээрх дараах бэлэн сонголтуудыг дарж мессеж илгээж болно:
      - "Машинтай аялал"
      - "Явган аялал" эсвэл "Hiking"
      - "Амралтын газар" эсвэл "Camp"

      Үүрэг даалгавар:
      1. Үргэлж найрсаг монгол хэлээр хариулж, хэрэглэгчтэй чатал.
      2. Хэрэв хэрэглэгч дээрх бэлэн сонголтуудаас илгээсэн бол (эсвэл яриандаа дурдвал), тухайн аяллын төрөлд тохирох СУУРЬ checklist болон маршрутыг (destinations) заавал бодож олж үүсгэ.
         - Машинтай аялал: Машины нөөц дугуй, багаж шалгах, замын хүнс, замын маршрутын эхний цэгүүд.
         - Явган аялал: Үүргэвч, дулаан хувцас, усны сав, анхны тусламж, алхалтын чиглэл.
         - Амралтын газар: Хувийн ариун цэвэр, дулаан хувцас, амралтын гэр/бааз.
      3. Хэрэв чат дундуур хэрэглэгч шинээр хийх зүйл, очих газар хэлбэл түүнийг нь мөн дата хэсэгт нэм.
      4. Хэрэв хэрэглэгч тодорхой газрын нэр дурдвал (жишээ нь "Хөвсгөл нуур", "Тэрэлж", "Хустайн нуруу" гэх мэт), тухайн газрын БОДИТ, ойролцоо ГАЗАРЗҮЙН КООРДИНАТ (latitude, longitude)-ыг заавал өгөх ёстой. Монгол улсын газрын нэрсийн үнэн зөв координатыг чадах хэрээрээ нарийвчлалтай бод.
      5. Хэрэв чи ямар нэгэн суурь checklist эсвэл очих газар үүсгэсэн бол, тэдгээр өгөгдлийг чатны хариуны ХАМГИЙН ТӨГСГӨЛД яг дараах тусгай форматаар хавсарга:

      ===JSON_DATA_START===
      {
        "checklistItems": [
          { "title": "Суурь зүйл 1", "category": "Хэрэгсэл" },
          { "title": "Суурь зүйл 2", "category": "Хүнс" }
        ],
        "destinations": [
          { "name": "Очих цэг 1", "description": "Тайлбар 1", "order": 1, "latitude": 49.1234, "longitude": 100.1234 }
        ]
      }

      ===JSON_DATA_END===

      Координатыг ЗААВАЛ тоон утга (число) хэлбэрээр өг, хэрэв яг таг мэдэхгүй бол тухайн бүс нутгийн ойролцоо төв цэгийн координатыг ашигла. Хэрэв ямар ч тохиолдолд координат олж чадахгүй бол latitude, longitude талбарыг null гэж тавь.

      Хэрэв шинээр үүсгэх жагсаалт эсвэл очих газар байхгүй бол ===JSON_DATA_START=== хэсгийг огт БИТГИЙ хавсарга.
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
              title: item.title,
              category: item.category || "Бусад",
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
    return NextResponse.json(
      { error: "Сервер дээр алдаа гарлаа", sessionId: currentSessionId },
      { status: 500 },
    );
  }
}
