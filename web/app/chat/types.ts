export interface Message {
  role: "user" | "model";
  content: string;
  createdAt?: string;
  tripId?: string | null; 
}

export interface ChatSession {
  id: string;
  title: string;
  createdAt: string;
}

export const QUICK_OPTIONS = [
  { label: "Машинтай аялал", value: "Машинтай аялал" },
  { label: "Явган аялал", value: "Явган аялал" },
  { label: "Амралтын газар", value: "Амралтын газар" },
];

export function cx(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(" ");
}