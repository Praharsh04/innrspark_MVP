export type AiErrorCode =
  | "AI_CLIENT_SIDE_USAGE"
  | "AI_MISSING_API_KEY"
  | "AI_REQUEST_FAILED"
  | "AI_INVALID_JSON"
  | "AI_VALIDATION_FAILED";

export class AiError extends Error {
  readonly code: AiErrorCode;
  readonly cause?: unknown;

  constructor(code: AiErrorCode, message: string, cause?: unknown) {
    super(message);
    this.name = "AiError";
    this.code = code;
    this.cause = cause;
  }
}

export function toAiError(error: unknown): AiError {
  if (error instanceof AiError) {
    return error;
  }

  return new AiError("AI_REQUEST_FAILED", "The AI request could not be completed.", error);
}
