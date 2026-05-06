import { assets } from "@/lib/assets";

export type OnboardingSlide = {
  id: string;
  title: string;
  highlight: string;
  description: string;
  image: string;
  alt: string;
};

export const onboardingSlides: OnboardingSlide[] = [
  {
    id: "welcome",
    title: "Welcome to",
    highlight: "Innrspark",
    description: "Explore, empower, and evolve into a career path that fits you.",
    image: assets.onboarding.slide1Logo,
    alt: "Innrspark logo",
  },
  {
    id: "discover",
    title: "Discover what",
    highlight: "fits you",
    description: "Reflect on how you like to think, build, solve, and collaborate.",
    image: assets.onboarding.slide2Doodle,
    alt: "Person thinking doodle",
  },
  {
    id: "explore",
    title: "Explore your",
    highlight: "strengths",
    description: "Spot patterns in your interests and natural working style.",
    image: assets.onboarding.slide3Magnifier,
    alt: "Magnifying glass doodle",
  },
  {
    id: "roadmap",
    title: "Build your",
    highlight: "roadmap",
    description: "Turn a career match into milestones, tasks, and progress.",
    image: assets.onboarding.slide4Scientist,
    alt: "Scientist doodle",
  },
  {
    id: "sparki",
    title: "Meet",
    highlight: "Sparki",
    description: "Get guided support when AI is added in a later phase.",
    image: assets.onboarding.slide5Robot,
    alt: "Robot doodle",
  },
];
