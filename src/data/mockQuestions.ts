import type { AssessmentQuestion } from "@/types/assessment";

export const mockQuestions: AssessmentQuestion[] = [
  {
    id: "q1",
    text: "You have a free weekend. What sounds most exciting?",
    options: [
      { key: "A", text: "Designing an idea or visual concept", traitEffects: { creativity: 2, empathy: 1 } },
      { key: "B", text: "Building a small app or automation", traitEffects: { technicalAptitude: 2, execution: 1 } },
      { key: "C", text: "Analyzing a topic and finding patterns", traitEffects: { analysis: 2, curiosity: 1 } },
      { key: "D", text: "Planning a project with clear next steps", traitEffects: { structuredThinking: 2, execution: 1 } },
    ],
  },
  {
    id: "q2",
    text: "When a problem feels confusing, what do you do first?",
    options: [
      { key: "A", text: "Talk to people affected by it", traitEffects: { empathy: 2, communication: 1 } },
      { key: "B", text: "Break it into smaller parts", traitEffects: { structuredThinking: 2, analysis: 1 } },
      { key: "C", text: "Search for technical examples", traitEffects: { technicalAptitude: 2, curiosity: 1 } },
      { key: "D", text: "Sketch possible solutions", traitEffects: { creativity: 2, execution: 1 } },
    ],
  },
  {
    id: "q3",
    text: "Which school or work task do you usually enjoy most?",
    options: [
      { key: "A", text: "Creating presentations or campaigns", traitEffects: { communication: 2, creativity: 1 } },
      { key: "B", text: "Researching users or audiences", traitEffects: { empathy: 2, analysis: 1 } },
      { key: "C", text: "Solving logic-heavy challenges", traitEffects: { technicalAptitude: 2, analysis: 1 } },
      { key: "D", text: "Coordinating people and deadlines", traitEffects: { execution: 2, structuredThinking: 1 } },
    ],
  },
  {
    id: "q4",
    text: "A team asks for your help. Where do you naturally contribute?",
    options: [
      { key: "A", text: "Clarifying the goal and priorities", traitEffects: { structuredThinking: 2, communication: 1 } },
      { key: "B", text: "Making the experience easier to use", traitEffects: { empathy: 2, creativity: 1 } },
      { key: "C", text: "Turning requirements into working code", traitEffects: { technicalAptitude: 2, execution: 1 } },
      { key: "D", text: "Measuring what is working", traitEffects: { analysis: 2, curiosity: 1 } },
    ],
  },
  {
    id: "q5",
    text: "Which compliment would feel most accurate?",
    options: [
      { key: "A", text: "You explain things clearly", traitEffects: { communication: 2, empathy: 1 } },
      { key: "B", text: "You make ideas look and feel better", traitEffects: { creativity: 2, empathy: 1 } },
      { key: "C", text: "You learn tools quickly", traitEffects: { technicalAptitude: 2, curiosity: 1 } },
      { key: "D", text: "You bring order to chaos", traitEffects: { structuredThinking: 2, execution: 1 } },
    ],
  },
  {
    id: "q6",
    text: "What kind of impact motivates you most?",
    options: [
      { key: "A", text: "Helping people make better choices", traitEffects: { empathy: 2, communication: 1 } },
      { key: "B", text: "Creating useful digital products", traitEffects: { technicalAptitude: 1, execution: 2 } },
      { key: "C", text: "Turning data into decisions", traitEffects: { analysis: 2, structuredThinking: 1 } },
      { key: "D", text: "Growing an idea or audience", traitEffects: { creativity: 1, communication: 2 } },
    ],
  },
  {
    id: "q7",
    text: "Pick the workspace you would prefer.",
    options: [
      { key: "A", text: "Whiteboard, sticky notes, and user flows", traitEffects: { creativity: 2, empathy: 1 } },
      { key: "B", text: "Code editor, docs, and problem tickets", traitEffects: { technicalAptitude: 2, structuredThinking: 1 } },
      { key: "C", text: "Dashboards, spreadsheets, and insights", traitEffects: { analysis: 2, curiosity: 1 } },
      { key: "D", text: "Calendar, roadmap, and team check-ins", traitEffects: { execution: 2, communication: 1 } },
    ],
  },
  {
    id: "q8",
    text: "When learning something new, you prefer to:",
    options: [
      { key: "A", text: "Try it hands-on immediately", traitEffects: { execution: 2, technicalAptitude: 1 } },
      { key: "B", text: "Understand who it helps and why", traitEffects: { empathy: 2, curiosity: 1 } },
      { key: "C", text: "Compare examples and patterns", traitEffects: { analysis: 2, structuredThinking: 1 } },
      { key: "D", text: "Create a simple explanation for others", traitEffects: { communication: 2, creativity: 1 } },
    ],
  },
  {
    id: "q9",
    text: "You're asked to redesign a common household object. What's your first thought?",
    options: [
      { key: "A", text: "How to make it look more beautiful", traitEffects: { creativity: 2, empathy: 1 } },
      { key: "B", text: "How to make it function more efficiently", traitEffects: { analysis: 2, structuredThinking: 1 } },
      { key: "C", text: "What new technology could be integrated", traitEffects: { technicalAptitude: 2, curiosity: 1 } },
      { key: "D", text: "How to make it cheaper to produce", traitEffects: { execution: 2, analysis: 1 } },
    ],
  },
  {
    id: "q10",
    text: "You find a bug in a system you use daily. How do you react?",
    options: [
      { key: "A", text: "Try to find exactly what's causing it", traitEffects: { analysis: 2, technicalAptitude: 1 } },
      { key: "B", text: "Look for a creative workaround", traitEffects: { creativity: 2, execution: 1 } },
      { key: "C", text: "Report it with a detailed explanation", traitEffects: { communication: 2, structuredThinking: 1 } },
      { key: "D", text: "Wait for someone else to fix it", traitEffects: { curiosity: 1 } },
    ],
  },
  {
    id: "q11",
    text: "A friend is frustrated with their career progress. How do you help?",
    options: [
      { key: "A", text: "Listen and validate their feelings", traitEffects: { empathy: 2, communication: 1 } },
      { key: "B", text: "Help them map out a 5-year plan", traitEffects: { structuredThinking: 2, execution: 1 } },
      { key: "C", text: "Brainstorm unconventional career paths", traitEffects: { creativity: 2, curiosity: 1 } },
      { key: "D", text: "Research market data for their role", traitEffects: { analysis: 2, technicalAptitude: 1 } },
    ],
  },
  {
    id: "q12",
    text: "You need to explain a complex idea to a 5-year-old. What's your strategy?",
    options: [
      { key: "A", text: "Use a simple, relatable story", traitEffects: { communication: 2, creativity: 1 } },
      { key: "B", text: "Draw a diagram or use props", traitEffects: { structuredThinking: 1, creativity: 2 } },
      { key: "C", text: "Break it into three basic steps", traitEffects: { analysis: 1, structuredThinking: 2 } },
      { key: "D", text: "Focus on how it makes people feel", traitEffects: { empathy: 2, communication: 1 } },
    ],
  },
  {
    id: "q13",
    text: "Your team is divided on which direction to take. What's your move?",
    options: [
      { key: "A", text: "Facilitate a compromise between both sides", traitEffects: { empathy: 1, communication: 2 } },
      { key: "B", text: "List the pros and cons based on data", traitEffects: { analysis: 2, structuredThinking: 1 } },
      { key: "C", text: "Suggest a third, completely new option", traitEffects: { creativity: 2, curiosity: 1 } },
      { key: "D", text: "Step up and make a final decision", traitEffects: { execution: 2, communication: 1 } },
    ],
  },
  {
    id: "q14",
    text: "You have a massive project due in a month. How do you organize it?",
    options: [
      { key: "A", text: "Create a detailed daily schedule", traitEffects: { structuredThinking: 2, execution: 1 } },
      { key: "B", text: "Identify the biggest risks first", traitEffects: { analysis: 2, curiosity: 1 } },
      { key: "C", text: "Focus on the creative vision first", traitEffects: { creativity: 2, communication: 1 } },
      { key: "D", text: "Just start working and see where it goes", traitEffects: { execution: 1, curiosity: 2 } },
    ],
  },
  {
    id: "q15",
    text: "You encounter a word or concept you've never heard of. What do you do?",
    options: [
      { key: "A", text: "Immediately look it up and read deeply", traitEffects: { curiosity: 2, analysis: 1 } },
      { key: "B", text: "Ask someone to explain it to you", traitEffects: { communication: 1, empathy: 1 } },
      { key: "C", text: "Try to deduce the meaning from context", traitEffects: { analysis: 2, structuredThinking: 1 } },
      { key: "D", text: "Note it down to research later", traitEffects: { execution: 1, curiosity: 1 } },
    ],
  },
  {
    id: "q16",
    text: "A new technology is trending in your field. How do you approach it?",
    options: [
      { key: "A", text: "Experiment with it in a side project", traitEffects: { technicalAptitude: 2, creativity: 1 } },
      { key: "B", text: "Read technical documentation and reviews", traitEffects: { analysis: 2, technicalAptitude: 1 } },
      { key: "C", text: "Wait to see if it becomes a standard", traitEffects: { structuredThinking: 1 } },
      { key: "D", text: "Think about how it could help users", traitEffects: { empathy: 2, curiosity: 1 } },
    ],
  },
  {
    id: "q17",
    text: "You have an idea that could fail but might change everything. What do you do?",
    options: [
      { key: "A", text: "Pitch it to someone for feedback", traitEffects: { communication: 2, creativity: 1 } },
      { key: "B", text: "Build a small prototype to test it", traitEffects: { execution: 2, technicalAptitude: 1 } },
      { key: "C", text: "Analyze all possible failure points", traitEffects: { analysis: 2, structuredThinking: 1 } },
      { key: "D", text: "Go all-in and trust your intuition", traitEffects: { creativity: 2, execution: 1 } },
    ],
  },
  {
    id: "q18",
    text: "You have a long list of small tasks. How do you tackle them?",
    options: [
      { key: "A", text: "Batch similar tasks together", traitEffects: { structuredThinking: 2, execution: 1 } },
      { key: "B", text: "Do the most difficult one first", traitEffects: { execution: 2, analysis: 1 } },
      { key: "C", text: "Automate as many as possible", traitEffects: { technicalAptitude: 2, creativity: 1 } },
      { key: "D", text: "Work on whatever feels easiest now", traitEffects: { empathy: 1 } },
    ],
  },
  {
    id: "q19",
    text: "A coworker is struggling to meet a deadline. What do you do?",
    options: [
      { key: "A", text: "Offer to take over some of their work", traitEffects: { execution: 2, empathy: 1 } },
      { key: "B", text: "Help them reorganize their priorities", traitEffects: { structuredThinking: 2, communication: 1 } },
      { key: "C", text: "Listen to their frustrations", traitEffects: { empathy: 2, communication: 1 } },
      { key: "D", text: "Focus on your own work to not fall behind", traitEffects: { execution: 1 } },
    ],
  },
  {
    id: "q20",
    text: "You want to learn a new language. How do you start?",
    options: [
      { key: "A", text: "Immerse yourself in movies and music", traitEffects: { creativity: 1, curiosity: 2 } },
      { key: "B", text: "Study grammar rules and structures", traitEffects: { structuredThinking: 2, analysis: 1 } },
      { key: "C", text: "Use a gamified app for quick wins", traitEffects: { execution: 1, technicalAptitude: 1 } },
      { key: "D", text: "Find a partner to practice speaking", traitEffects: { communication: 2, empathy: 1 } },
    ],
  },
  {
    id: "q21",
    text: "You're reviewing a final report. What are you looking for?",
    options: [
      { key: "A", text: "Errors in data and logic", traitEffects: { analysis: 2, structuredThinking: 1 } },
      { key: "B", text: "Spelling, grammar, and formatting", traitEffects: { execution: 1, communication: 1 } },
      { key: "C", text: "How well the story is told", traitEffects: { communication: 2, creativity: 1 } },
      { key: "D", text: "If the conclusions are actionable", traitEffects: { execution: 2, analysis: 1 } },
    ],
  },
  {
    id: "q22",
    text: "You're given a vague assignment with no instructions. How do you feel?",
    options: [
      { key: "A", text: "Excited by the freedom to explore", traitEffects: { curiosity: 2, creativity: 1 } },
      { key: "B", text: "Determined to create your own structure", traitEffects: { structuredThinking: 2, execution: 1 } },
      { key: "C", text: "Anxious and need to ask for clarity", traitEffects: { communication: 1, analysis: 1 } },
      { key: "D", text: "Ready to prototype several ideas", traitEffects: { execution: 2, creativity: 1 } },
    ],
  },
  {
    id: "q23",
    text: "You have a blank canvas and some paint. What's your process?",
    options: [
      { key: "A", text: "Start with a clear, pre-planned sketch", traitEffects: { structuredThinking: 1, execution: 1 } },
      { key: "B", text: "Let your emotions guide the brush", traitEffects: { creativity: 2, empathy: 1 } },
      { key: "C", text: "Experiment with different textures", traitEffects: { curiosity: 2, technicalAptitude: 1 } },
      { key: "D", text: "Try to recreate a specific scene", traitEffects: { analysis: 1, creativity: 1 } },
    ],
  },
  {
    id: "q24",
    text: "You're presented with a lot of data about a trend. What's your first step?",
    options: [
      { key: "A", text: "Look for outliers and anomalies", traitEffects: { analysis: 2, curiosity: 1 } },
      { key: "B", text: "Visualize it in different charts", traitEffects: { creativity: 1, structuredThinking: 1 } },
      { key: "C", text: "Group it into logical categories", traitEffects: { structuredThinking: 2, analysis: 1 } },
      { key: "D", text: "Think about the human stories behind it", traitEffects: { empathy: 2, communication: 1 } },
    ],
  },
  {
    id: "q25",
    text: "A customer is angry about a service delay. How do you respond?",
    options: [
      { key: "A", text: "Apologize sincerely and empathize", traitEffects: { empathy: 2, communication: 1 } },
      { key: "B", text: "Explain the technical reason for the delay", traitEffects: { technicalAptitude: 1, communication: 1 } },
      { key: "C", text: "Offer a practical solution or discount", traitEffects: { execution: 2, analysis: 1 } },
      { key: "D", text: "Ask questions to understand their needs", traitEffects: { curiosity: 1, empathy: 1 } },
    ],
  },
  {
    id: "q26",
    text: "You're giving a presentation and notice the audience is bored. What do you do?",
    options: [
      { key: "A", text: "Tell a quick, engaging story", traitEffects: { communication: 2, creativity: 1 } },
      { key: "B", text: "Ask the audience a direct question", traitEffects: { communication: 1, empathy: 1 } },
      { key: "C", text: "Speed up to get to the important parts", traitEffects: { execution: 1, analysis: 1 } },
      { key: "D", text: "Change your tone and body language", traitEffects: { creativity: 1, communication: 1 } },
    ],
  },
  {
    id: "q27",
    text: "A new member joins your team and seems lost. How do you handle it?",
    options: [
      { key: "A", text: "Give them a tour and introduce everyone", traitEffects: { communication: 1, empathy: 1 } },
      { key: "B", text: "Assign them a small, clear task", traitEffects: { execution: 2, structuredThinking: 1 } },
      { key: "C", text: "Explain the team's goals and vision", traitEffects: { communication: 2, structuredThinking: 1 } },
      { key: "D", text: "Ask them about their background and skills", traitEffects: { curiosity: 1, empathy: 1 } },
    ],
  },
  {
    id: "q28",
    text: "Your workspace is cluttered and disorganized. How does it affect you?",
    options: [
      { key: "A", text: "It's fine, I know where everything is", traitEffects: { creativity: 1, curiosity: 1 } },
      { key: "B", text: "I can't focus until I clean it up", traitEffects: { structuredThinking: 2, execution: 1 } },
      { key: "C", text: "It's a sign of a busy, productive mind", traitEffects: { execution: 1, creativity: 1 } },
      { key: "D", text: "I use the chaos to find new connections", traitEffects: { creativity: 2, curiosity: 1 } },
    ],
  },
  {
    id: "q29",
    text: "You're visiting a new city for the first time. How do you spend your day?",
    options: [
      { key: "A", text: "Follow a strictly planned itinerary", traitEffects: { structuredThinking: 2, execution: 1 } },
      { key: "B", text: "Wander around and get lost", traitEffects: { curiosity: 2, creativity: 1 } },
      { key: "C", text: "Visit all the major historical sites", traitEffects: { analysis: 1, curiosity: 1 } },
      { key: "D", text: "Find where the locals eat and hang out", traitEffects: { empathy: 2, communication: 1 } },
    ],
  },
  {
    id: "q30",
    text: "You're curious about how a specific software works. What do you do?",
    options: [
      { key: "A", text: "Search for the source code online", traitEffects: { technicalAptitude: 2, curiosity: 1 } },
      { key: "B", text: "Read blog posts about its architecture", traitEffects: { analysis: 2, technicalAptitude: 1 } },
      { key: "C", text: "Try to reverse-engineer its behavior", traitEffects: { analysis: 2, creativity: 1 } },
      { key: "D", text: "Ask an expert to explain it to you", traitEffects: { communication: 1, empathy: 1 } },
    ],
  },
  {
    id: "q31",
    text: "You're offered a high-risk, high-reward opportunity. What's your reaction?",
    options: [
      { key: "A", text: "Analyze the mathematical odds of success", traitEffects: { analysis: 2, structuredThinking: 1 } },
      { key: "B", text: "Get excited about the potential impact", traitEffects: { creativity: 1, communication: 1 } },
      { key: "C", text: "Think about the worst-case scenario", traitEffects: { analysis: 1, structuredThinking: 1 } },
      { key: "D", text: "Trust your gut and take the leap", traitEffects: { execution: 1, curiosity: 1 } },
    ],
  },
  {
    id: "q32",
    text: "You've hit a roadblock in your project. What's your next step?",
    options: [
      { key: "A", text: "Take a break to clear your head", traitEffects: { creativity: 1, curiosity: 1 } },
      { key: "B", text: "Systematically test every variable", traitEffects: { analysis: 2, technicalAptitude: 1 } },
      { key: "C", text: "Ask a colleague for a fresh perspective", traitEffects: { communication: 1, empathy: 1 } },
      { key: "D", text: "Research how others solved this problem", traitEffects: { curiosity: 2, analysis: 1 } },
    ],
  },
  {
    id: "q33",
    text: "You're in a group project and someone isn't contributing. How do you handle it?",
    options: [
      { key: "A", text: "Talk to them privately to find out why", traitEffects: { empathy: 2, communication: 1 } },
      { key: "B", text: "Clearly redefine their tasks and deadlines", traitEffects: { structuredThinking: 2, execution: 1 } },
      { key: "C", text: "Do their work yourself to ensure quality", traitEffects: { execution: 2, analysis: 1 } },
      { key: "D", text: "Bring it up in a group meeting", traitEffects: { communication: 2, execution: 1 } },
    ],
  },
  {
    id: "q34",
    text: "You're attending a workshop. Which part do you find most valuable?",
    options: [
      { key: "A", text: "The hands-on practice sessions", traitEffects: { execution: 2, technicalAptitude: 1 } },
      { key: "B", text: "The theoretical explanations", traitEffects: { analysis: 2, structuredThinking: 1 } },
      { key: "C", text: "Networking with other participants", traitEffects: { communication: 2, empathy: 1 } },
      { key: "D", text: "The Q&A with the instructor", traitEffects: { curiosity: 2, communication: 1 } },
    ],
  },
  {
    id: "q35",
    text: "You're writing a story. What's the most important element to you?",
    options: [
      { key: "A", text: "A complex and logical plot", traitEffects: { analysis: 1, structuredThinking: 2 } },
      { key: "B", text: "Deeply emotional character arcs", traitEffects: { empathy: 2, creativity: 1 } },
      { key: "C", text: "A unique and imaginative world", traitEffects: { creativity: 2, curiosity: 1 } },
      { key: "D", text: "Clear and impactful themes", traitEffects: { communication: 2, analysis: 1 } },
    ],
  },
  {
    id: "q36",
    text: "You're trying to figure out why a machine isn't working. What's your method?",
    options: [
      { key: "A", text: "Read the manual from cover to cover", traitEffects: { analysis: 1, structuredThinking: 1 } },
      { key: "B", text: "Take it apart to see how it works", traitEffects: { curiosity: 2, technicalAptitude: 1 } },
      { key: "C", text: "Search for common issues online", traitEffects: { analysis: 2, technicalAptitude: 1 } },
      { key: "D", text: "Try turning it off and on again", traitEffects: { execution: 1 } },
    ],
  },
  {
    id: "q37",
    text: "You're a mediator in a conflict between two friends. What's your goal?",
    options: [
      { key: "A", text: "Find a fair and logical solution", traitEffects: { analysis: 1, structuredThinking: 1 } },
      { key: "B", text: "Make sure both feel heard and understood", traitEffects: { empathy: 2, communication: 1 } },
      { key: "C", text: "Keep the peace at any cost", traitEffects: { empathy: 1 } },
      { key: "D", text: "Clarify the misunderstandings", traitEffects: { communication: 2, analysis: 1 } },
    ],
  },
  {
    id: "q38",
    text: "You're writing an email to a senior executive. What's your main focus?",
    options: [
      { key: "A", text: "Being as concise and clear as possible", traitEffects: { communication: 2, structuredThinking: 1 } },
      { key: "B", text: "Showing your deep knowledge of the topic", traitEffects: { analysis: 1, technicalAptitude: 1 } },
      { key: "C", text: "Making a persuasive argument", traitEffects: { communication: 2, creativity: 1 } },
      { key: "D", text: "Formatting it perfectly", traitEffects: { execution: 1, structuredThinking: 1 } },
    ],
  },
];
