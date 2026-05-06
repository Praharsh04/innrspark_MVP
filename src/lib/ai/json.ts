import { AiError } from "./errors";

export type JsonPrimitive = string | number | boolean | null;
export type JsonValue = JsonPrimitive | JsonObject | JsonValue[];
export type JsonObject = { [key: string]: JsonValue | undefined };

export type JsonValidator<T> = (value: unknown) => value is T;

export function parseJsonResponse(text: string): unknown {
  try {
    return JSON.parse(stripJsonFence(text));
  } catch (error) {
    throw new AiError("AI_INVALID_JSON", "The model returned invalid JSON.", error);
  }
}

export function validateJsonResponse<T>(value: unknown, validator: JsonValidator<T>): T {
  if (!validator(value)) {
    throw new AiError("AI_VALIDATION_FAILED", "The model JSON did not match the expected shape.");
  }

  return value;
}

export function isJsonObject(value: unknown): value is JsonObject {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function stripJsonFence(text: string): string {
  const trimmed = text.trim();

  if (!trimmed.startsWith("```")) {
    return trimmed;
  }

  return trimmed
    .replace(/^```(?:json)?/i, "")
    .replace(/```$/i, "")
    .trim();
}
