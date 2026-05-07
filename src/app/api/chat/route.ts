import { NextResponse } from "next/server";
import { callJsonModel } from "@/lib/ai/client";
import { isJsonObject } from "@/lib/ai/json";
import { buildChatbotContext, buildCompactChatbotContext } from "@/lib/chatbot/context-builder";
import { extractSparkiIntent } from "@/lib/chatbot/intent";
import { detectChatbotUserIntent } from "@/lib/chatbot/local-intent";
import { SPARKI_SYSTEM_PROMPT, buildSparkiUserPrompt } from "@/lib/chatbot/system-prompt";
import type { ChatApiRequest, ChatApiResponse, CompactChatbotContext, SparkiAiResponse } from "@/lib/chatbot/types";
import { searchLearningResources } from "@/lib/search/tavily";
import { searchYouTubeVideos } from "@/lib/youtube/search";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase";
import type { SupabaseClient } from "@supabase/supabase-js";

type AuthContext = {
  supabase: SupabaseClient<Database>;
  userId: string;
};

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as Partial<ChatApiRequest> | null;
  const userMessage = body?.message?.trim();
  const history = body?.history || [];
  const clientContext = body?.context as any;

  if (!userMessage) {
    return NextResponse.json({ error: "Message is required." }, { status: 400 });
  }

  const authContext = await getAuthContext(request);
  const staticSystemPrompt = clientContext?.staticSystemPrompt;

  // Use client-provided system prompt or build fallback if missing
  const finalSystemPrompt = staticSystemPrompt || SPARKI_SYSTEM_PROMPT;

  const chatIntent = detectChatbotUserIntent(userMessage);

  if (authContext) {
    await authContext.supabase.from("chat_messages").insert({
      user_id: authContext.userId,
      role: "user",
      content: userMessage,
      metadata: {},
    });
  }

  const intent = await extractSparkiIntent(userMessage);

  if (intent.resourceType === "web" && intent.needsSearch) {
    const result = await searchLearningResources({
      searchQuery: intent.searchQuery || userMessage,
      topic: intent.topic || intent.searchQuery || userMessage,
      level: intent.level,
    });
    const message = result.error
      ? result.error
      : `I found ${result.data.length} useful web resources for ${intent.topic || "that topic"}. Start with the one that feels easiest, then save one action you can do today.`;
    const response: ChatApiResponse = {
      type: "web_resources",
      reply: message,
      message,
      usedFallback: Boolean(result.error),
      resources: result.data,
    };

    await saveAssistantMessage(authContext, response.message, response.usedFallback, null);
    return NextResponse.json(response);
  }

  if (intent.resourceType === "youtube" && intent.needsSearch) {
    const result = await searchYouTubeVideos({
      searchQuery: intent.searchQuery || userMessage,
      topic: intent.topic || intent.searchQuery || userMessage,
      level: intent.level,
    });
    const message = result.error
      ? result.error
      : `I found ${result.data.length} YouTube videos for ${intent.topic || "that topic"}. Watch one, then write down the next small thing to practice.`;
    const response: ChatApiResponse = {
      type: "video_recommendations",
      reply: message,
      message,
      usedFallback: Boolean(result.error),
      videos: result.data,
    };

    await saveAssistantMessage(authContext, response.message, response.usedFallback, null);
    return NextResponse.json(response);
  }

  const aiResult = await callJsonModel<SparkiAiResponse>({
    messages: [
      { role: "system", content: finalSystemPrompt },
      ...history.map((m: any) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      })),
      { role: "user", content: userMessage },
    ],
    validate: isSparkiAiResponse,
    fallback: { message: "I'm having trouble connecting right now, but I can still chat. Tell me what you want to think through." },
    temperature: 0.55,
    maxOutputTokens: 420,
    retryInvalidJson: false,
    jsonSchema: {
      name: "sparki_chat_response",
      description: "Sparki career roadmap coaching response.",
      strict: true,
      schema: {
        type: "object",
        additionalProperties: false,
        required: ["message"],
        properties: {
          message: { type: "string" },
        },
      },
    },
  });

  await saveAssistantMessage(authContext, aiResult.data.message, aiResult.usedFallback, aiResult.error?.code ?? null);

  const response: ChatApiResponse = {
    type: "chat",
    reply: aiResult.data.message,
    message: aiResult.data.message,
    usedFallback: aiResult.usedFallback,
  };

  return NextResponse.json(response);
}

async function saveAssistantMessage(
  authContext: AuthContext | null,
  content: string,
  usedFallback: boolean,
  aiErrorCode: string | null,
) {
  if (!authContext) {
    return;
  }

  await authContext.supabase.from("chat_messages").insert({
    user_id: authContext.userId,
    role: "assistant",
    content,
    metadata: {
      usedFallback,
      aiErrorCode,
    },
  });
}

async function getAuthContext(request: Request): Promise<AuthContext | null> {
  const accessToken = getBearerToken(request);

  if (!accessToken) {
    return null;
  }

  try {
    const supabase = createSupabaseServerClient({ accessToken });
    const { data, error } = await supabase.auth.getUser(accessToken);

    if (error || !data.user) {
      return null;
    }

    return {
      supabase,
      userId: data.user.id,
    };
  } catch {
    return null;
  }
}

async function tryBuildContext(authContext: AuthContext) {
  try {
    return await buildChatbotContext(authContext.supabase, authContext.userId);
  } catch {
    return null;
  }
}

function getBearerToken(request: Request): string | null {
  const authorization = request.headers.get("authorization");

  if (!authorization?.toLowerCase().startsWith("bearer ")) {
    return null;
  }

  return authorization.slice("bearer ".length).trim();
}

function isSparkiAiResponse(value: unknown): value is SparkiAiResponse {
  return isJsonObject(value) && typeof value.message === "string" && value.message.trim().length > 0;
}

function buildNormalChatFallback(
  userMessage: string,
  context: CompactChatbotContext,
  intent: ReturnType<typeof detectChatbotUserIntent>,
): string {
  const normalized = userMessage.toLowerCase();
  const nextTask = context.nextIncompleteTask;
  const currentMilestone = context.currentMilestone;
  const careerTitle = context.selectedCareer;

  if (isGreeting(normalized)) {
    return careerTitle
      ? `Hey, I'm here. We can talk normally, or I can help with your ${careerTitle} path. If you want something practical, ask me what to work on next, paste a task you do not understand, or tell me what feels stuck.`
      : "Hey, I'm here. We can chat normally, talk through career ideas, or break a goal into a small next step. What would you like to figure out?";
  }

  if (isThanks(normalized)) {
    return "You're welcome. I'm here whenever you want to talk through a career idea, simplify a task, find learning resources, or just think out loud for a minute.";
  }

  if (intent === "stuck") {
    if (nextTask) {
      return `Feeling stuck is normal when a task is too broad. Make "${nextTask}" smaller: spend 10 minutes doing only the first visible step, like opening a note, naming the task, and writing one question you need answered. What part feels unclear right now?`;
    }

    return "Feeling stuck usually means the next step is too vague. Shrink it to 10 minutes: write your goal, list what you already know, and choose one tiny action you can do without needing everything figured out. What are you stuck on specifically?";
  }

  if (intent === "explanation") {
    if (nextTask) {
      return `"${nextTask}" means creating evidence that you understand the skill, not doing it perfectly. It matters because small practice turns career interest into a concrete example you can discuss later. To complete it, define the output, make a rough first version, then note what you learned.`;
    }

    return "I can explain it clearly, but I need the exact task name. Send me the task you are looking at, and I'll break down what it means, why it matters, and how to finish it.";
  }

  if (intent === "next_step" || normalized.includes("roadmap") || normalized.includes("next") || normalized.includes("task")) {
    if (nextTask) {
      return `Your next useful step is "${nextTask}"${currentMilestone ? ` in ${currentMilestone}` : ""}. This matters because it turns the path from a big idea into one visible piece of progress. Spend 10 minutes starting it now: open a note, write the goal in one sentence, and list the first 2-3 actions you need.`;
    }

    if (careerTitle) {
      return `For your ${careerTitle} path, choose one small skill to practice today. This keeps momentum without making the roadmap feel too large. Spend 10 minutes picking a simple exercise, then write what finished would look like before you begin.`;
    }

    return "A good next step could be to pick one small roadmap action you can finish today. Start with something concrete, like reading one guide, creating one note, or practicing one tiny task for 20 minutes.";
  }

  return "I'm having trouble connecting right now, but I can still chat. Tell me what you want to think through, such as a career idea, a skill you are learning, a decision you are unsure about, or a task that feels unclear, and I'll help you break it down.";
}

function isGreeting(message: string): boolean {
  return /^(hi|hey|hello|yo|sup|good morning|good afternoon|good evening|how are you)\b/.test(message.trim());
}

function isThanks(message: string): boolean {
  return /\b(thanks|thank you|appreciate it|that helped)\b/.test(message);
}
