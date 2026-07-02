"use client";

import { BarChart3, BrainCircuit, HelpCircle, ListChecks, Play, Sparkles, Target, ThumbsUp, Users } from "lucide-react";
import { ContentsSlide } from "./ContentsSlide";
import { CoverSlide } from "./CoverSlide";
import { DemoSlide } from "./DemoSlide";
import { FeaturesSlide } from "./FeaturesSlide";
import { GoalsSlide } from "./GoalsSlide";
import { ProblemSlide } from "./ProblemSlide";
import { ResearchSlide } from "./ResearchSlide";
import { SolutionSlide } from "./SolutionSlide";
import { TeamSlide } from "./TeamSlide";
import { ThanksSlide } from "./ThanksSlide";
import type { PresentationSlide } from "./types";

export function createPresentationSlides(onSelectSlide: (slideIndex: number) => void): PresentationSlide[] {
  const contentSlides: PresentationSlide[] = [
    {
      id: "team",
      title: "Манай баг",
      icon: Users,
      render: () => <TeamSlide />,
    },
    {
      id: "goals",
      title: "Зорилго",
      icon: Target,
      render: () => <GoalsSlide />,
    },
    {
      id: "problem",
      title: "Асуудал",
      icon: HelpCircle,
      render: () => <ProblemSlide />,
    },
    {
      id: "solution",
      title: "Шийдэл",
      icon: BrainCircuit,
      render: () => <SolutionSlide />,
    },
    {
      id: "features",
      title: "Онцлогууд",
      icon: Sparkles,
      render: () => <FeaturesSlide />,
    },
    {
      id: "research",
      title: "Судалгаа",
      icon: BarChart3,
      render: () => <ResearchSlide />,
    },
    {
      id: "thanks",
      title: "Баярлалаа",
      icon: ThumbsUp,
      render: () => <ThanksSlide />,
    },
    {
      id: "demo",
      title: "Demo",
      icon: Play,
      render: () => <DemoSlide />,
    },
  ];

  return [
    {
      id: "cover",
      title: "MonTrip",
      render: () => <CoverSlide />,
    },
    {
      id: "contents",
      title: "Агуулга",
      icon: ListChecks,
      render: () => <ContentsSlide contentSlides={contentSlides} onSelect={onSelectSlide} />,
    },
    ...contentSlides,
  ];
}
