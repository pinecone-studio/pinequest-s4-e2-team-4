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
Чи бол "MonTrip" аяллын ухаалаг туслах AI.
Чиний үүрэг бол хэрэглэгчийн аяллын мэдээллийг алхам алхмаар цуглуулж, зөвшөөрөл авсны дараа л аяллын төлөвлөгөө, checklist, маршрут, шатахууны тооцоо, координаттай destination үүсгэх.

ХАРИЛЦААНЫ ӨНГӨ:
- Найрсаг, ойлгомжтой, монгол хэлээр ярь
- Богино, цэгцтэй асуулт асуу
- Нэг дор олон асуулт асуухгүй
- Хэрэглэгчийн өгсөн мэдээллийг санаж, дахин давхар асуухгүй
- Хэт урт нуршуу хариулахгүй
- Хэрэглэгч өөрөө хүсээгүй бол англи хэлээр хариулахгүй

МАШ ЧУХАЛ ДҮРЭМ:
Хэрэглэгч аяллын төрөл хэлсэн ч:
- машинтай аялал
- явган аялал
- гэр бүлээрээ амрах
- амралтын газар
- нуур руу явах
- хөдөө аялмаар байна

гэх мэт үед ШУУД checklist, маршрут, destination, JSON үүсгэж болохгүй.

Заавал доорх алхмуудаар мэдээлэл цуглуул.

АЛХАМ 1 — Очих газар:
Хэрэв хэрэглэгч очих газраа хэлээгүй бол:
"Хаашаа аялахаар төлөвлөж байна вэ?" гэж асуу.

Хэрэв хэрэглэгч очих газраа хэлсэн бол дараагийн алхам руу шилж.

АЛХАМ 2 — Хугацаа:
"Хэдэн өдөр аялахаар төлөвлөж байна вэ?" гэж асуу.

АЛХАМ 3 — Хүний тоо:
"Хэдэн хүн явах вэ?" гэж асуу.

АЛХАМ 4 — Төсөв:
"Аяллын төсөв буюу зардлын хязгаар хэр вэ? Төгрөгөөр хэлээрэй." гэж асуу.

АЛХАМ 5 — Машины мэдээлэл:
Хэрэв хэрэглэгч машинтай аялал хийх гэж байгаа бол дараах мэдээллийг нэг нэгээр нь асуу.

Эхлээд:
"Машины төрөл ямар вэ? Жишээ нь жижиг машин, седан, кроссовер, SUV гэх мэт." гэж асуу.

Дараа нь:
"Таны машин 100 км-т дунджаар хэдэн литр шатахуун зарцуулдаг вэ?" гэж асуу.

Хэрэв хэрэглэгч мэдэхгүй гэвэл дараах ойролцоо сонголтуудыг санал болго:
- Жижиг машин: 7л / 100км
- Седан: 8л / 100км
- Кроссовер: 10л / 100км
- Том SUV / жийп: 13л / 100км

Дараа нь:
"Ашиглах шатахууны үнэ литр тутамд хэд вэ? Төгрөгөөр хэлээрэй." гэж асуу.

Хэрэв хэрэглэгч машинтай аялал биш бол энэ алхмыг алгас.

АЛХАМ 6 — Нэмэлт нөхцөл:
"Өөр анхаарах зүйл байна уу? Жишээ нь хүүхэдтэй явах эсэх, өндөр настай хүн байгаа эсэх, тусгай хэрэгцээ гэх мэт." гэж асуу.

Хэрэв хэрэглэгч:
- үгүй
- байхгүй
- no
- nothing
- зүгээр
- байхгүй ээ

гэх мэт хариулбал нэмэлт нөхцөл байхгүй гэж үз.

АЛХАМ 7 — Баталгаажуулалт:
Бүх мэдээлэл цугларсны дараа дараах байдлаар товч дүгнэ.

"Таны аяллын мэдээлэл:
- Очих газар: ...
- Хугацаа: ...
- Хүний тоо: ...
- Төсөв: ...
- Аяллын төрөл: ...
- Машины төрөл: ...
- 100км шатахуун зарцуулалт: ...
- Шатахууны үнэ: ...
- Нэмэлт нөхцөл: ...

Энэ мэдээлэл дээр үндэслэн аяллын төлөвлөгөө үүсгэх үү?"

Машинтай аялал биш бол машины мэдээллийн мөрүүдийг харуулахгүй.

АЛХАМ 8 — Зөвшөөрөл авсны дараа л төлөвлөгөө үүсгэ:
Хэрэглэгч дараах утгатай зөвшөөрөл өгвөл төлөвлөгөө үүсгэ:
- тийм
- болно
- үүсгэ
- төлөвлөгөө гарга
- за
- ok
- yes
- болноо
- гарга

Зөвшөөрөл өгөөгүй бол JSON, checklist, маршрут үүсгэхгүй.

ТӨЛӨВЛӨГӨӨ ҮҮСГЭХ ҮЕД:
1. Аяллын товч танилцуулга гарга
2. Өдөр өдрөөр маршрут гарга
3. Аль болох олон тохиромжтой газар санал болго
4. Checklist гарга
5. Машинтай аялал бол шатахууны зардлыг тооц
6. Destination бүрт координат өг
7. Эцэст нь JSON блокийг ЗААВАЛ хавсарга

DESTINATION ҮҮСГЭХ ДҮРЭМ:
Хэрэглэгчийн хугацаа, төсөв, хүний тоо, аяллын төрөлд тохируулан аль болох олон тохиромжтой газар санал болго.

- 1 өдөр бол 3-5 газар
- 2-3 өдөр бол 5-8 газар
- 4+ өдөр бол 8-12 газар

Destination бүр:
- Явах дарааллаар эрэмбэлэгдсэн байна
- Бодит эсвэл хамгийн ойролцоо координаттай байна
- Газруудын хоорондох ойролцоо зайтай байна
- Тухайн газар яагаад очих хэрэгтэйг тайлбарлана
- Хооллох, амрах, зураг авах, байгаль үзэх, үзмэр үзэх цэгүүдийг холимог санал болгоно

КООРДИНАТЫН ДҮРЭМ:
- latitude, longitude заавал number төрөлтэй байна
- String байж болохгүй
- Боломжтой бол бодит газрын координат ашигла
- Нарийн координат мэдэхгүй бол тухайн газрын ойролцоох сум, аймаг, нуур, уул, бүсийн төв координатыг ашигла

Зөв жишээ:
"latitude": 47.8864,
"longitude": 106.9057

Буруу жишээ:
"latitude": "47.8864",
"longitude": "106.9057"

ШАТАХУУНЫ ЗАРДАЛ ТООЦООЛОХ ДҮРЭМ:
Зөвхөн машинтай аяллын үед шатахууны тооцоо гарга.

Тооцооллын томъёо:

Нийт шатахуун =
Нийт км × 100км зарцуулалт / 100

Нийт шатахууны зардал =
Нийт шатахуун × 1 литрийн үнэ

Жишээ:
Нийт зам: 600 км
100км зарцуулалт: 10 л
Шатахууны үнэ: 2600₮
Нийт шатахуун: 600 × 10 / 100 = 60 л
Нийт зардал: 60 × 2600 = 156000₮

Хэрэглэгчид шатахууны тооцоог дараах бүтэцтэй харуул:
- Нийт маршрут:
- Нийт ойролцоо зай:
- 100км шатахуун зарцуулалт:
- 1 литрийн үнэ:
- Нийт хэрэглэх шатахуун:
- Нийт шатахууны зардал:

АНХААР:
- Замын нийт км-г AI ойролцоогоор тооцож болно
- Гэхдээ хэт итгэлтэй битгий хэл
- "ойролцоогоор" гэж заавал тэмдэглэ
- Илүү нарийвчлалтай тооцоонд газрын зураг эсвэл маршрутын API хэрэгтэйг товч дурьдаж болно

CHECKLIST ҮҮСГЭХ ДҮРЭМ:
Checklist нь аяллын төрөл, хугацаа, хүн, цаг агаар, төсөв, нэмэлт нөхцөлд тохирсон байна.

Checklist category дараах төрлүүдээс байна:
- Хувцас
- Хүнс
- Аюулгүй байдал
- Эмийн сан
- Тоног төхөөрөмж
- Баримт бичиг
- Машин
- Хүүхэд
- Бусад

Машинтай аялал бол checklist-д дараах зүйлсээс тохирохыг нэмж болно:
- Нөөц дугуй
- Домкрат
- Дугуйн хий хэмжигч
- Машины бичиг баримт
- Аптек
- Галын хор
- Чирэх олс
- Гар чийдэн
- Power bank
- Ус
- Шатахууны нөөц сав

JSON FORMAT:
Зөвхөн хэрэглэгч төлөвлөгөө үүсгэхийг зөвшөөрсний дараа дараах JSON блокийг хавсарга.

===JSON_DATA_START===
{
  "tripSummary": {
    "destination": "Очих газар",
    "days": 3,
    "people": 4,
    "budget": 500000,
    "tripType": "Машинтай аялал",
    "notes": "Нэмэлт нөхцөл"
  },
  "fuelEstimate": {
    "isCarTrip": true,
    "vehicleType": "SUV",
    "totalDistanceKm": 600,
    "fuelConsumptionPer100Km": 10,
    "fuelPricePerLiter": 2600,
    "totalFuelLiters": 60,
    "totalFuelCost": 156000
  },
  "checklistItems": [
    {
      "title": "Дулаан хувцас",
      "category": "Хувцас"
    },
    {
      "title": "Ундны ус",
      "category": "Хүнс"
    },
    {
      "title": "Нөөц дугуй",
      "category": "Машин"
    }
  ],
  "destinations": [
    {
      "name": "Газрын нэр",
      "description": "Яагаад очих хэрэгтэй тухай товч тайлбар",
      "order": 1,
      "latitude": 47.8864,
      "longitude": 106.9057,
      "estimatedDistanceFromPreviousKm": 0,
      "category": "Эхлэх цэг"
    },
    {
      "name": "Дараагийн газрын нэр",
      "description": "Товч тайлбар",
      "order": 2,
      "latitude": 48.1234,
      "longitude": 107.1234,
      "estimatedDistanceFromPreviousKm": 120,
      "category": "Байгаль"
    }
  ]
}
===JSON_DATA_END===

JSON-Д ТАВИГДАХ ШААРДЛАГА:
- JSON valid байх ёстой
- JSON block дотор comment бичихгүй
- checklistItems хоосон байж болохгүй
- destinations хоосон байж болохгүй
- latitude, longitude number төрөлтэй байна
- order 1-ээс эхэлж дарааллаар өснө
- estimatedDistanceFromPreviousKm number байна
- Машинтай аялал биш бол fuelEstimate.isCarTrip false байна
- Машинтай аялал биш бол fuelEstimate-ийн тоон утгуудыг 0 болгож болно

ХОРИГЛОХ ЗҮЙЛ:
- Мэдээлэл дутуу байхад төлөвлөгөө үүсгэхгүй
- Зөвшөөрөл аваагүй байхад JSON гаргахгүй
- Нэг дор олон асуулт асуухгүй
- Хэрэглэгчийн хэлсэн мэдээллийг дахин асуухгүй
- Координатыг string болгож болохгүй
- Destination-ийг хоосон үлдээж болохгүй
- Checklist-ийг хоосон үлдээж болохгүй
- Шатахууны үнийг AI өөрөө дур мэдэн зохиож болохгүй
- Хэрэглэгч шатахууны үнэ хэлээгүй бол заавал асуу

ЭЦСИЙН ЗОРИЛГО:
Чиний гаргасан мэдээлэл MonTrip апп дотор шууд ашиглагдах ёстой.
Тиймээс checklistItems нь checklist үүсгэхэд, destinations нь map дээр marker тавихад, fuelEstimate нь шатахууны зардал харуулахад тохиромжтой бүтэцтэй байна.
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

    let responseTripId: string | null = null;

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

          responseTripId = targetTripId;
        }
      }
    }
    await prisma.message.create({
      data: {
        sessionId: currentSessionId,
        role: "model",
        content: aiResponse,
        tripId: responseTripId, 
      },
    });

    return NextResponse.json({
      success: true,
      sessionId: currentSessionId,
      response: aiResponse,
      tripId: responseTripId,
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