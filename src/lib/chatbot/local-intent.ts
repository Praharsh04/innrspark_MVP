import type { ChatbotUserIntent } from "./types";

export function detectChatbotUserIntent(message: string): ChatbotUserIntent {
  const normalized = message.toLowerCase();

  if (/\b(resource|resources|search|latest|web|article|articles|course|courses|guide|guides|tutorial|tutorials|docs|documentation|youtube|video|videos|watch)\b/.test(normalized)) {
    return "resources";
  }

  if (/\b(next|work on|start|continue|today|now)\b/.test(normalized)) {
    return "next_step";
  }

  if (/\b(stuck|confused|lost|overwhelmed|hard|difficult|can't|cannot|don'?t know)\b/.test(normalized)) {
    return "stuck";
  }

  if (/\b(explain|understand|mean|what is|why does|how does|help me understand)\b/.test(normalized)) {
    return "explanation";
  }

  if (/\b(motivate|motivation|tired|discouraged|confidence|encourage)\b/.test(normalized)) {
    return "motivation";
  }

  if (/\b(adjust|change|modify|update|different roadmap|new roadmap|switch)\b/.test(normalized)) {
    return "roadmap_adjustment";
  }

  return "general_chat";
}
