export interface ChecklistItem {
  id: string;
  title: string;
  isCompleted: boolean;
  category: string;
}

export const defaultChecklistCategories: string[] = [
  "Чухал",
  "Ариун цэвэр",
  "Эм бэлдмэл",
  "Хувцас",
  "Технологи",
];
