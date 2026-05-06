import { NextResponse } from "next/server";
import { callJsonModel } from "@/lib/ai/client";
import { isJsonObject } from "@/lib/ai/json";
import { buildChatbotContext } from "@/lib/chatbot/context-builder";
import { SPARKI_SYSTEM_PROMPT, buildSparkiUserPrompt } from "@/lib/chatbot/system-prompt";
import type { ChatApiRequest, ChatApiResponse, SparkiAiResponse } from "@/lib/chatbot/types";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase";
import type { SupabaseClient } from "@supabase/supabase-js";

const CHAT_FALLBACK_MESSAGE =
  "I'm having trouble connecting right now, but I can still help you think through your next step. Try asking again in a moment.";

type AuthContext = {
  supabase: SupabaseClient<Database>;
  userId: string;
};

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as Partial<ChatApiRequest> | null;
  const userMessage = body?.message?.trim();

  if (!userMessage) {
    return NextResponse.json({ error: "Message is required." }, { status: 400 });
  }

  const authContext = await getAuthContext(request);
  const context = authContext ? await tryBuildContext(authContext) : null;

  if (authContext) {
    await authContext.supabase.from("chat_messages").insert({
      user_id: authContext.userId,
      role: "user",
      content: userMessage,
      metadata: {},
    });
  }

  const aiResult = await callJsonModel<SparkiAiResponse>({
    messages: [
      { role: "system", content: SPARKI_SYSTEM_PROMPT },
      {
        role: "user",
        content: buildSparkiUserPrompt({
          userMessage,
          context,
          clientContext: body?.context,
          history: body?.history,
        }),
      },
    ],
    validate: isSparkiAiResponse,
    fallback: { message: CHAT_FALLBACK_MESSAGE },
    temperature: 0.35,
    maxOutputTokens: 650,
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

  if (authContext) {
    await authContext.supabase.from("chat_messages").insert({
      user_id: authContext.userId,
      role: "assistant",
      content: aiResult.data.message,
      metadata: {
        usedFallback: aiResult.usedFallback,
        aiErrorCode: aiResult.error?.code ?? null,
      },
    });
  }

  const response: ChatApiResponse = {
    reply: aiResult.data.message,
    message: aiResult.data.message,
    usedFallback: aiResult.usedFallback,
  };

  return NextResponse.json(response);
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
