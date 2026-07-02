import type { AppLanguage } from "./language";

type ChecklistTextKind = "category" | "item";

const checklistText: Record<string, string> = {
  "Машины бэлтгэл": "Car prep",
  "Машинтай аялал": "Road trip",
  "Явган аялал": "Hiking",
  "Амралтын газар": "Resort stay",
  "Хувийн бэлтгэл": "Personal prep",
  "Техник, Хэрэгсэл": "Technical tools",
  Навигаци: "Navigation",
  Хэрэгсэл: "Tools",
  Багаж: "Tools",
  "Цахилгаан хэрэгсэл": "Electrical tools",
  "Тээврийн хэрэгсэл": "Transportation tools",
  Хүнс: "Food",
  "Замын хүнс": "Road food",
  Хоол: "Food",
  Ус: "Water",
  "Эрүүл мэнд": "Health",
  "Анхны тусламж": "First aid",
  Эм: "Medicine",
  "Эмийн сан": "Medicine",
  Хувцас: "Clothes",
  "Дулаан хувцас": "Warm clothes",
  "Ариун цэвэр": "Toiletries",
  "Хувийн ариун цэвэр": "Toiletries",
  "Бичиг баримт": "Documents",
  Маршрут: "Route",
  Байршил: "Location",
  Аялал: "Trip",
  Бусад: "Other",

  "Хөдөлгүүрийн тос, хөргөх шингэн шалгах":
    "Check engine oil and coolant",
  "Чирэгч татлага, замын жижиг багаж хэрэгсэл":
    "Tow rope and small roadside tools",
  "Замын жижиг багаж хэрэгсэл": "Small roadside tools",
  "Машины нөөц дугуй болон домкрат шалгах":
    "Check spare tire and jack",
  "Машины нөөц дугуй, багаж шалгах": "Check spare tire and tools",
  "Нөөц дугуй болон домкрат шалгах": "Check spare tire and jack",
  "Нөөц дугуй, багаж шалгах": "Check spare tire and tools",
  "Анхны тусламжийн хайрцаг": "First aid kit",
  "Ундны ус": "Drinking water",
  "Усны сав": "Water bottle",
  "Замын хүнс бэлтгэх": "Prepare road food",
  Үүргэвч: "Backpack",
  "Борооны цув": "Raincoat",
  "Хувийн ариун цэврийн хэрэглэл": "Toiletries",
  "Нарны тос": "Sunscreen",
  "Гар чийдэн": "Flashlight",
  "Утасны цэнэглэгч": "Phone charger",
  "Газрын зураг": "Map",
  "GPS төхөөрөмж": "GPS device",
  "Power bank": "Power bank",
  Павербанк: "Power bank",
  "Нойтон салфетка": "Wet wipes",
  Салфетка: "Tissues",
  "Хуурай хүнс": "Dry food",
  "Лаазалсан хоол": "Canned food",
  "Хөнгөн зууш": "Snacks",
  Амттан: "Snacks",
  "Өвчин намдаах эм": "Pain reliever",
  "Харшлын эм": "Allergy medicine",
  "Толгойны эм": "Headache medicine",
  "Нарны малгай": "Sun hat",
  Малгай: "Hat",
  Бээлий: "Gloves",
  Оймс: "Socks",
  Куртик: "Jacket",
  "Солих хувцас": "Change of clothes",
  Гутал: "Shoes",
  "Аяллын гутал": "Travel shoes",
  "Дулаан оймс": "Warm socks",
  "Иргэний үнэмлэх": "ID card",
  Паспорт: "Passport",
  "Жолооны үнэмлэх": "Driver's license",
};

const cyrillicPattern = /[\u0400-\u04FF]/;

const checklistPhrases: { pattern: RegExp; value: string }[] = [
  { pattern: /нөөц дугуй|домкрат/i, value: "Check spare tire and jack" },
  {
    pattern: /хөдөлгүүрийн тос|хөргөх шингэн/i,
    value: "Check engine oil and coolant",
  },
  { pattern: /чирэгч|татлага/i, value: "Tow rope" },
  { pattern: /багаж/i, value: "Tools" },
  { pattern: /анхны тусламж/i, value: "First aid kit" },
  { pattern: /усны сав/i, value: "Water bottle" },
  { pattern: /ундны ус|ус/i, value: "Drinking water" },
  { pattern: /замын хүнс|хуурай хүнс|лаазалсан|хоол/i, value: "Road food" },
  { pattern: /хөнгөн зууш|амттан/i, value: "Snacks" },
  { pattern: /өвчин намдаах|толгойны эм/i, value: "Pain reliever" },
  { pattern: /харшлын эм/i, value: "Allergy medicine" },
  { pattern: /эм/i, value: "Medicine" },
  { pattern: /дулаан хувцас/i, value: "Warm clothes" },
  { pattern: /солих хувцас/i, value: "Change of clothes" },
  { pattern: /борооны цув/i, value: "Raincoat" },
  { pattern: /нарны малгай/i, value: "Sun hat" },
  { pattern: /малгай/i, value: "Hat" },
  { pattern: /бээлий/i, value: "Gloves" },
  { pattern: /оймс/i, value: "Socks" },
  { pattern: /куртик|хүрэм/i, value: "Jacket" },
  { pattern: /аяллын гутал|гутал/i, value: "Travel shoes" },
  { pattern: /үүргэвч/i, value: "Backpack" },
  { pattern: /ариун цэвэр/i, value: "Toiletries" },
  { pattern: /нойтон салфетка/i, value: "Wet wipes" },
  { pattern: /салфетка/i, value: "Tissues" },
  { pattern: /нарны тос/i, value: "Sunscreen" },
  { pattern: /гар чийдэн/i, value: "Flashlight" },
  { pattern: /цэнэглэгч/i, value: "Phone charger" },
  { pattern: /павербанк|power bank/i, value: "Power bank" },
  { pattern: /газрын зураг/i, value: "Map" },
  { pattern: /gps/i, value: "GPS device" },
  { pattern: /иргэний үнэмлэх/i, value: "ID card" },
  { pattern: /жолооны үнэмлэх/i, value: "Driver's license" },
  { pattern: /паспорт/i, value: "Passport" },
  { pattern: /амралтын гэр|бааз/i, value: "Resort stay" },
];

export function translateChecklistText(
  value: string,
  language: AppLanguage,
  kind: ChecklistTextKind = "item",
) {
  if (language !== "en") return value;

  const normalizedValue = value.trim();
  const exactValue = checklistText[normalizedValue];
  if (exactValue) return exactValue;

  const phrase = checklistPhrases.find(({ pattern }) =>
    pattern.test(normalizedValue),
  );
  if (phrase) return phrase.value;

  if (!cyrillicPattern.test(normalizedValue)) return normalizedValue;

  return kind === "category" ? "Other" : "Travel item";
}

