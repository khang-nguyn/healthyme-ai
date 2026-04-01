import { ApiHttpError, apiPost } from "../api";
import {
  LlmApiError,
  LlmInvalidJsonError,
  type LlmRequestPayload,
  type LlmServiceOptions,
} from "./llmService";

const DEFAULT_OPENAI_MODEL = "gpt-4o-mini";
const DEFAULT_OPENAI_URL = "https://api.openai.com/v1/chat/completions";

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
    throw new LlmInvalidJsonError("OpenAI returned invalid JSON.", text);
  }
}

function extractOpenAiTextResponse(payload: unknown): string {
  if (!payload || typeof payload !== "object") {
    throw new LlmApiError("OpenAI response payload is invalid.");
  }

  const data = payload as {
    choices?: Array<{
      message?: {
        content?: string;
      };
    }>;
  };

  const text = data.choices?.[0]?.message?.content;
  if (!text || typeof text !== "string") {
    throw new LlmApiError("OpenAI response does not contain text output.");
  }

  return text;
}

export async function callOpenAiService<T>(
  payload: LlmRequestPayload,
  options?: LlmServiceOptions,
): Promise<T> {
  const endpoint =
    options?.endpoint ??
    import.meta.env.VITE_OPENAI_API_URL ??
    DEFAULT_OPENAI_URL;
  const apiKey = options?.apiKey ?? import.meta.env.VITE_OPENAI_API_KEY;
  const model = import.meta.env.VITE_OPENAI_MODEL ?? DEFAULT_OPENAI_MODEL;
  const timeoutMs = options?.timeoutMs ?? 30000;

  if (!apiKey) {
    throw new LlmApiError("Missing VITE_OPENAI_API_KEY for OpenAI API call.");
  }

  const promptText = `${payload.prompt}\n\nUser input:\n${payload.userInput}\n\nReturn valid JSON only.`;

  try {
    const response = await apiPost<unknown>(
      endpoint,
      {
        model,
        messages: [
          {
            role: "user",
            content: promptText,
          },
        ],
        response_format: {
          type: "json_object",
        },
      },
      {
        timeoutMs,
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
      },
    );

    const modelText = extractOpenAiTextResponse(response);
    return parseJsonResponse<T>(modelText);
  } catch (error) {
    if (error instanceof LlmInvalidJsonError) {
      throw error;
    }

    if (error instanceof ApiHttpError) {
      throw new LlmApiError(
        error.message ?? "Failed to call OpenAI API.",
        error.status,
        error.details,
      );
    }

    throw new LlmApiError("Unexpected error while calling OpenAI API.");
  }
}
