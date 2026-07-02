import { QUICK_OPTIONS } from "@/app/chat/types";

export type ChatQuickReply = {
  label: string;
  value: string;
};

function normalize(value: string) {
  return value.toLowerCase().replace(/\s+/g, " ").trim();
}

function hasAny(content: string, keywords: string[]) {
  return keywords.some((keyword) => content.includes(keyword));
}

function replies(values: string[]): ChatQuickReply[] {
  return values.map((value) => ({ label: value, value }));
}

export function getStepQuestionReplies(lastModelMessage: string): ChatQuickReply[] {
  const content = normalize(lastModelMessage);

  if (hasAny(content, ["хаашаа аялахаар", "очих газар", "хаашаа явах"])) {
    return replies(["Хөвсгөл нуур", "Архангай", "Говь", "Хэнтий"]);
  }

  if (hasAny(content, ["хэдэн өдөр", "хугацаа"])) {
    return replies(["1 өдөр", "2 өдөр", "3 өдөр", "5 өдөр"]);
  }

  if (hasAny(content, ["хэдэн хүн", "Хүний тоо"])) {
    return replies(["1 хүн", "2 хүн", "4 хүн", "6 хүн"]);
  }

  if (hasAny(content, ["төсөв", "зардлын хязгаар"])) {
    return replies(["300000₮", "500000₮", "1000000₮", "1500000₮", "2000000₮+"]);
  }

  if (hasAny(content, ["аяллын төрөл"])) {
    return QUICK_OPTIONS;
  }

  if (hasAny(content, ["машины төрөл", "жижиг машин", "седан", "кроссовер", "suv"])) {
    return replies(["Жижиг машин", "Седан", "Кроссовер", "SUV"]);
  }

  if (hasAny(content, ["100 км", "100км", "шатахуун зарцуулдаг", "литр шатахуун"])) {
    return replies(["7л / 100км", "8л / 100км", "10л / 100км", "11л / 100км", "12л / 100км","13л / 100км","14л / 100км", "15л / 100км", "16л / 100км", "17л / 100км", "18л / 100км", "19л / 100км", "20л / 100км"]);
  }

  if (hasAny(content, ["шатахууны үнэ", "литр тутам", "1 литрийн үнэ"])) {
    return replies(["2590₮", "2890₮", "2990₮", "3200₮"]);
  }

  if (hasAny(content, ["өөр анхаарах зүйл", "нэмэлт нөхцөл", "тусгай хэрэгцээ"])) {
    return replies(["Байхгүй", "Хүүхэдтэй явна", "Өндөр настай хүнтэй явна", "Майхантай явна"]);
  }

  if (hasAny(content, ["төлөвлөгөө үүсгэх үү", "үндэслэн аяллын төлөвлөгөө"])) {
    return replies(["Тийм, төлөвлөгөө үүсгэ", "Мэдээллээ засмаар байна"]);
  }

  return [];
}

export function destinationReplies(destinations: string[]): ChatQuickReply[] {
  return destinations.map((place) => ({
    label: place,
    value: `${place} талаар дэлгэрэнгүй мэдээлэл өгөөч`,
  }));
}
