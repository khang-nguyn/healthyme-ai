import { ApiHttpError, apiPost } from "../api";

const DEFAULT_TIMEOUT_MS = 30000;

export type LlmResponseFormat = "json";

export interface LlmRequestPayload {
  prompt: string;
  userInput: string;
}

export interface LlmServiceOptions {
  endpoint?: string;
  apiKey?: string;
  timeoutMs?: number;
}

export class LlmApiError extends Error {
  readonly status?: number;
  readonly details?: unknown;

  constructor(message: string, status?: number, details?: unknown) {
    super(message);
    this.name = "LlmApiError";
    this.status = status;
    this.details = details;
  }
}

export class LlmInvalidJsonError extends Error {
  readonly rawResponse: string;

  constructor(message: string, rawResponse: string) {
    super(message);
    this.name = "LlmInvalidJsonError";
    this.rawResponse = rawResponse;
  }
}

function getServiceConfig(options?: LlmServiceOptions) {
  return {
    endpoint:
      options?.endpoint ?? import.meta.env.VITE_LLM_API_URL ?? "/api/llm",
    apiKey: options?.apiKey ?? import.meta.env.VITE_LLM_API_KEY,
    timeoutMs: options?.timeoutMs ?? DEFAULT_TIMEOUT_MS,
  };
}

function extractTextResponse(payload: unknown): string {
  if (typeof payload === "string") {
    return payload;
  }

  if (payload && typeof payload === "object") {
    const data = payload as Record<string, unknown>;

    const directText = data.response ?? data.output ?? data.text;
    if (typeof directText === "string") {
      return directText;
    }

    const choices = data.choices;
    if (Array.isArray(choices) && choices.length > 0) {
      const firstChoice = choices[0] as Record<string, unknown>;

      const message = firstChoice.message as
        | Record<string, unknown>
        | undefined;
      if (message && typeof message.content === "string") {
        return message.content;
      }

      if (typeof firstChoice.text === "string") {
        return firstChoice.text;
      }
    }
  }

  throw new LlmApiError("LLM response does not contain text output.");
}

function stripCodeFence(value: string): string {
  const trimmed = value.trim();

  if (trimmed.startsWith("```")) {
    return trimmed
      .replace(/^```(?:json)?\s*/i, "")
      .replace(/\s*```$/, "")
      .trim();
  }

  return trimmed;
}

function parseJsonResponse<T>(text: string): T {
  const cleaned = stripCodeFence(text);

  try {
    return JSON.parse(cleaned) as T;
  } catch {
    throw new LlmInvalidJsonError("LLM returned invalid JSON.", text);
  }
}

export async function callLlmApi<T>(
  payload: LlmRequestPayload,
  options?: LlmServiceOptions,
): Promise<T> {
  const { endpoint, apiKey, timeoutMs } = getServiceConfig(options);

  try {
    const response = await apiPost<unknown>(
      endpoint,
      {
        prompt: payload.prompt,
        userInput: payload.userInput,
        responseFormat: "json" as LlmResponseFormat,
      },
      {
        timeoutMs,
        headers: {
          ...(apiKey ? { Authorization: `Bearer ${apiKey}` } : {}),
        },
      },
    );

    const modelText = extractTextResponse(response);
    return parseJsonResponse<T>(modelText);
  } catch (error) {
    if (error instanceof LlmInvalidJsonError) {
      throw error;
    }

    if (error instanceof ApiHttpError) {
      throw new LlmApiError(
        error.message ?? "Failed to call LLM API.",
        error.status,
        error.details,
      );
    }

    throw new LlmApiError("Unexpected error while calling LLM API.");
  }
}
