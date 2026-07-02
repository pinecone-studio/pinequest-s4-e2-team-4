import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

export type PresentationSlide = {
  id: string;
  title: string;
  icon?: LucideIcon;
  render: () => ReactNode;
};
