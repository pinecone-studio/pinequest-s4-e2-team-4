export interface Message {
  role: "user" | "model";
  content: string;
  createdAt?: string;
}

export interface ChatSession {
  id: string;
  title: string;
  createdAt: string;
}
