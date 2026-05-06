import { AiError, toAiError } from "./errors";
import { parseJsonResponse, validateJsonResponse, type JsonObject, type JsonValidator } from "./json";

type AiMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

type JsonSchemaFormat = {
  name: string;
  schema: JsonObject;
  description?: string;
  strict?: boolean;
};

type JsonModelCallOptions<T> = {
  messages: AiMessage[];
  validate: JsonValidator<T>;
  fallback?: T | ((error: AiError) => T);
  model?: string;
  temperature?: number;
  maxOutputTokens?: number;
  jsonSchema?: JsonSchemaFormat;
};

export type JsonModelCallResult<T> = {
  data: T;
  usedFallback: boolean;
  error: AiError | null;
};

const GEMINI_API_BASE_URL = "https://generativelanguage.googleapis.com/v1beta";
const DEFAULT_MODEL = "gemini-2.5-flash";
const FALLBACK_MODELS = ["gemini-2.0-flash", "gemini-flash-latest"];
const REQUEST_TIMEOUT_MS = 15000;

export async function callJsonModel<T>(options: JsonModelCallOptions<T>): Promise<JsonModelCallResult<T>> {
  assertServerOnly();

  try {
    const data = await requestValidatedJson(options);
    return { data, usedFallback: false, error: null };
  } catch (firstError) {
    const retryableError = toAiError(firstError);

    if (retryableError.code === "AI_INVALID_JSON" || retryableError.code === "AI_VALIDATION_FAILED") {
      try {
        const data = await requestValidatedJson({
          ...options,
          messages: withJsonRepairInstruction(options.messages),
        });

        return { data, usedFallback: false, error: null };
      } catch (secondError) {
        return resolveFallback(options.fallback, toAiError(secondError));
      }
    }

    return resolveFallback(options.fallback, retryableError);
  }
}

async function requestValidatedJson<T>(options: JsonModelCallOptions<T>): Promise<T> {
  const apiKey = getGoogleAiApiKey();

  if (!apiKey) {
    throw new AiError("AI_MISSING_API_KEY", "GEMINI_API_KEY or GOOGLE_API_KEY is not configured.");
  }

  const models = getModelCandidates(options.model);
  let lastError: AiError | null = null;

  for (const model of models) {
    try {
      return await requestGeminiJson(options, apiKey, model);
    } catch (error) {
      const aiError = toAiError(error);
      lastError = aiError;

      if (!isModelFallbackError(aiError)) {
        throw aiError;
      }
    }
  }

  throw lastError ?? new AiError("AI_REQUEST_FAILED", "The AI request could not be completed.");
}

async function requestGeminiJson<T>(options: JsonModelCallOptions<T>, apiKey: string, model: string): Promise<T> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  const response = await fetch(`${GEMINI_API_BASE_URL}/models/${model}:generateContent`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-goog-api-key": apiKey,
    },
    signal: controller.signal,
    body: JSON.stringify({
      systemInstruction: buildSystemInstruction(options.messages),
      contents: toGeminiContents(options.messages),
      generationConfig: {
        temperature: options.temperature ?? 0.2,
        maxOutputTokens: options.maxOutputTokens ?? 900,
        responseMimeType: "application/json",
        ...(options.jsonSchema ? { responseSchema: toGeminiResponseSchema(options.jsonSchema.schema) } : {}),
      },
    }),
  }).finally(() => clearTimeout(timeout));

  if (!response.ok) {
    const errorText = await response.text().catch(() => "");
    throw new AiError(
      "AI_REQUEST_FAILED",
      `Gemini request failed with status ${response.status}.`,
      { status: response.status, model, errorText },
    );
  }

  const payload = (await response.json()) as unknown;
  const text = extractResponseText(payload);
  const json = parseJsonResponse(text);

  return validateJsonResponse(json, options.validate);
}

function getModelCandidates(requestedModel?: string): string[] {
  const preferredModel = cleanEnvValue(requestedModel) ?? cleanEnvValue(process.env.GEMINI_MODEL) ?? DEFAULT_MODEL;
  return Array.from(new Set([preferredModel, ...FALLBACK_MODELS]));
}

function getGoogleAiApiKey(): string | null {
  return cleanEnvValue(process.env.GEMINI_API_KEY) ?? cleanEnvValue(process.env.GOOGLE_API_KEY);
}

function cleanEnvValue(value: string | undefined): string | null {
  const cleaned = value?.trim().replace(/^['"]|['"]$/g, "");
  return cleaned ? cleaned : null;
}

function isModelFallbackError(error: AiError): boolean {
  if (error.code !== "AI_REQUEST_FAILED" || !isRecord(error.cause)) {
    return false;
  }

  return error.cause.status === 404;
}

function toGeminiResponseSchema(schema: JsonObject): JsonObject {
  return stripUnsupportedSchemaFields(schema) as JsonObject;
}

function stripUnsupportedSchemaFields(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(stripUnsupportedSchemaFields);
  }

  if (!isRecord(value)) {
    return value;
  }

  return Object.fromEntries(
    Object.entries(value)
      .filter(([key, entry]) => entry !== undefined && key !== "additionalProperties" && key !== "strict")
      .map(([key, entry]) => [key, stripUnsupportedSchemaFields(entry)]),
  );
}

function resolveFallback<T>(fallback: JsonModelCallOptions<T>["fallback"], error: AiError): JsonModelCallResult<T> {
  if (fallback === undefined) {
    throw error;
  }

  return {
    data: typeof fallback === "function" ? (fallback as (error: AiError) => T)(error) : fallback,
    usedFallback: true,
    error,
  };
}

function assertServerOnly() {
  if ("window" in globalThis) {
    throw new AiError("AI_CLIENT_SIDE_USAGE", "AI helpers can only run on the server.");
  }
}

function withJsonRepairInstruction(messages: AiMessage[]): AiMessage[] {
  return [
    {
      role: "system",
      content:
        "Return only valid JSON that matches the requested schema. Do not include Markdown, comments, prose, or code fences.",
    },
    ...messages,
  ];
}

function buildSystemInstruction(messages: AiMessage[]) {
  const systemText = messages
    .filter((message) => message.role === "system")
    .map((message) => message.content)
    .join("\n\n");

  if (!systemText) {
    return undefined;
  }

  return {
    parts: [{ text: systemText }],
  };
}

function toGeminiContents(messages: AiMessage[]) {
  const contents = messages
    .filter((message) => message.role !== "system")
    .map((message) => ({
      role: message.role === "assistant" ? "model" : "user",
      parts: [{ text: message.content }],
    }));

  if (contents.length > 0) {
    return contents;
  }

  return [
    {
      role: "user",
      parts: [{ text: "Return valid JSON only." }],
    },
  ];
}

function extractResponseText(payload: unknown): string {
  if (isRecord(payload) && Array.isArray(payload.candidates)) {
    const text = payload.candidates
      .flatMap((candidate) => {
        if (!isRecord(candidate) || !isRecord(candidate.content) || !Array.isArray(candidate.content.parts)) {
          return [];
        }

        return candidate.content.parts;
      })
      .map((part) => (isRecord(part) && typeof part.text === "string" ? part.text : ""))
      .join("");

    if (text) {
      return text;
    }
  }

  throw new AiError("AI_INVALID_JSON", "The Gemini response did not contain JSON text.");
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}
