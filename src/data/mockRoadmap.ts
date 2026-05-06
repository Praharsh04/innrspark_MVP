import type { CareerRoadmap } from "@/types/roadmap";

export const mockRoadmap: CareerRoadmap = {
  careerId: "product-manager",
  careerTitle: "Product Manager",
  milestones: [
    {
      id: "pm-fundamentals",
      title: "Foundations",
      description: "Master the core principles of product management and the modern tech ecosystem.",
      tasks: [
        {
          id: "pm-task-1",
          title: "PM Role Deep-Dive",
          description: "Understand the difference between Product, Project, and Program management.",
          completed: true,
        },
        {
          id: "pm-task-2",
          title: "Tech Stack Basics",
          description: "Learn how Frontend, Backend, and APIs communicate in a high-level architecture.",
          completed: true,
        },
        {
          id: "pm-task-3",
          title: "Product Vocabulary",
          description: "Master terms like MVP, KPI, OKR, North Star Metric, and Technical Debt.",
          completed: true,
        },
        {
          id: "pm-task-16",
          title: "Competitive Analysis",
          description: "Choose an industry and map out the top 3 players and their value props.",
          completed: false,
        },
      ],
    },
    {
      id: "pm-discovery",
      title: "User Discovery",
      description: "Learn to identify real user problems through research and data.",
      tasks: [
        {
          id: "pm-task-4",
          title: "Interview Techniques",
          description: "Practice the 'Jobs to be Done' (JTBD) interview framework.",
          completed: true,
        },
        {
          id: "pm-task-5",
          title: "Synthesize Findings",
          description: "Create user personas and journey maps based on interview data.",
          completed: false,
        },
        {
          id: "pm-task-6",
          title: "Problem Framing",
          description: "Write clear 'How Might We' statements for identified user pain points.",
          completed: false,
        },
        {
          id: "pm-task-17",
          title: "Survey Design",
          description: "Draft a 5-question survey to validate a problem at scale.",
          completed: false,
        },
      ],
    },
    {
      id: "pm-strategy",
      title: "Product Strategy",
      description: "Learn to prioritize features and align them with business goals.",
      tasks: [
        {
          id: "pm-task-7",
          title: "Prioritization Frameworks",
          description: "Apply RICE, Kano, and MoSCoW models to a feature backlog.",
          completed: false,
        },
        {
          id: "pm-task-8",
          title: "Success Metrics (North Star)",
          description: "Define a North Star metric and its supporting 'Input' metrics.",
          completed: false,
        },
        {
          id: "pm-task-9",
          title: "PRD Writing",
          description: "Draft a Product Requirements Document for a new mobile app feature.",
          completed: false,
        },
        {
          id: "pm-task-18",
          title: "Roadmap Visualization",
          description: "Create a theme-based roadmap (Now, Next, Later) for a 6-month period.",
          completed: false,
        },
      ],
    },
    {
      id: "pm-design",
      title: "Design & UX",
      description: "Collaborate effectively with designers to build intuitive experiences.",
      tasks: [
        {
          id: "pm-task-19",
          title: "UX Principles for PMs",
          description: "Learn about cognitive load, affordance, and accessibility basics.",
          completed: false,
        },
        {
          id: "pm-task-20",
          title: "Wireframing Basics",
          description: "Create low-fidelity wireframes for a checkout flow in Excalidraw or Figma.",
          completed: false,
        },
        {
          id: "pm-task-21",
          title: "Design Critique",
          description: "Practice giving objective, problem-focused feedback on UI mocks.",
          completed: false,
        },
      ],
    },
    {
      id: "pm-execution",
      title: "Execution & Agile",
      description: "Master the rituals of building and shipping software with engineering teams.",
      tasks: [
        {
          id: "pm-task-10",
          title: "User Story Workshop",
          description: "Write 10 'perfect' user stories with clear acceptance criteria.",
          completed: false,
        },
        {
          id: "pm-task-11",
          title: "Agile Ceremonies",
          description: "Understand the purpose of Standups, Sprint Planning, and Retros.",
          completed: false,
        },
        {
          id: "pm-task-12",
          title: "Backlog Grooming",
          description: "Practice breaking down a large 'Epic' into manageable 'Sprints'.",
          completed: false,
        },
        {
          id: "pm-task-22",
          title: "Tech Feasibility Check",
          description: "Learn how to discuss tradeoffs with engineering leads.",
          completed: false,
        },
      ],
    },
    {
      id: "pm-launch",
      title: "Growth & Iteration",
      description: "Launch products, analyze results, and drive continuous improvement.",
      tasks: [
        {
          id: "pm-task-13",
          title: "GTM (Go-to-Market) Plan",
          description: "Coordinate with marketing to define the launch strategy and messaging.",
          completed: false,
        },
        {
          id: "pm-task-14",
          title: "Post-Launch Analytics",
          description: "Use tools like Mixpanel or Amplitude to track user retention.",
          completed: false,
        },
        {
          id: "pm-task-15",
          title: "Feedback Loops",
          description: "Setup a system to capture and categorize user feedback post-launch.",
          completed: false,
        },
        {
          id: "pm-task-23",
          title: "A/B Testing Basics",
          description: "Design an experiment to test two different landing page CTAs.",
          completed: false,
        },
      ],
    },
  ],
};
