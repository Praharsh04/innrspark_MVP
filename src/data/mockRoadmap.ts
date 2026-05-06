import type { CareerRoadmap } from "@/types/roadmap";

export const mockRoadmap: CareerRoadmap = {
  careerId: "product-manager",
  careerTitle: "Product Manager",
  milestones: [
    {
      id: "pm-fundamentals",
      title: "Fundamentals",
      description: "Understand what product managers do and how product teams work.",
      tasks: [
        {
          id: "pm-task-1",
          title: "Read about product manager responsibilities",
          description: "Compare PM responsibilities across startups and larger companies.",
          completed: true,
        },
        {
          id: "pm-task-2",
          title: "Map one app you use daily",
          description: "Identify users, core problems, and key features.",
          completed: true,
        },
        {
          id: "pm-task-3",
          title: "Learn basic product vocabulary",
          description: "Review roadmap, MVP, KPI, user story, and prioritization.",
          completed: true,
        },
      ],
    },
    {
      id: "pm-discovery",
      title: "Discovery & User Research",
      description: "Practice identifying user needs and validating problems.",
      tasks: [
        {
          id: "pm-task-4",
          title: "Conduct 3 user interviews",
          description: "Ask open-ended questions to uncover pain points in a specific flow.",
          completed: true,
        },
        {
          id: "pm-task-5",
          title: "Create an Affinity Map",
          description: "Synthesize interview notes into actionable themes.",
          completed: false,
        },
        {
          id: "pm-task-6",
          title: "Write 5 user problem statements",
          description: "Frame findings into clear problem statements using HMW.",
          completed: false,
        },
      ],
    },
    {
      id: "pm-strategy",
      title: "Strategy & Prioritization",
      description: "Learn how to decide what to build next and why.",
      tasks: [
        {
          id: "pm-task-7",
          title: "Apply RICE framework",
          description: "Prioritize 5 feature ideas based on Reach, Impact, Confidence, and Effort.",
          completed: false,
        },
        {
          id: "pm-task-8",
          title: "Define Success Metrics",
          description: "Identify leading and lagging indicators for a new feature.",
          completed: false,
        },
        {
          id: "pm-task-9",
          title: "Draft a one-page solution proposal",
          description: "Outline the 'Why', 'What', and 'How' for a prioritized feature.",
          completed: false,
        },
      ],
    },
    {
      id: "pm-execution",
      title: "Execution & Agile",
      description: "Work with design and engineering to bring features to life.",
      tasks: [
        {
          id: "pm-task-10",
          title: "Write 5 User Stories",
          description: "Ensure stories follow the INVEST criteria with clear acceptance criteria.",
          completed: false,
        },
        {
          id: "pm-task-11",
          title: "Create a Roadmap in Jira/Linear",
          description: "Organize tasks into Sprints or Milestones.",
          completed: false,
        },
        {
          id: "pm-task-12",
          title: "Conduct a Design Review",
          description: "Provide feedback on mocks to ensure they align with requirements.",
          completed: false,
        },
      ],
    },
    {
      id: "pm-launch",
      title: "Launch & Iterate",
      description: "Go to market and learn from real user data.",
      tasks: [
        {
          id: "pm-task-13",
          title: "Plan a Beta Launch",
          description: "Define the scope and target users for a limited release.",
          completed: false,
        },
        {
          id: "pm-task-14",
          title: "Analyze Post-Launch Data",
          description: "Compare actual results against defined success metrics.",
          completed: false,
        },
        {
          id: "pm-task-15",
          title: "Prepare a Retrospective",
          description: "Identify what went well and what could be improved for next time.",
          completed: false,
        },
      ],
    },
  ],
};
