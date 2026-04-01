import { ApiHttpError, apiPost } from "../api";
import {
  LlmApiError,
  LlmInvalidJsonError,
  type LlmRequestPayload,
  type LlmServiceOptions,
} from "./llmService";

const DEFAULT_GEMINI_MODEL = "gemini-2.0-flash";
const DEFAULT_GEMINI_BASE_URL =
  "https://generativelanguage.googleapis.com/v1beta/models";

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
    throw new LlmInvalidJsonError("Gemini returned invalid JSON.", text);
  }
}

function extractGeminiTextResponse(payload: unknown): string {
  if (!payload || typeof payload !== "object") {
    throw new LlmApiError("Gemini response payload is invalid.");
  }

  const data = payload as {
    candidates?: Array<{
      content?: {
        parts?: Array<{ text?: string }>;
      };
    }>;
  };

  const text = data.candidates?.[0]?.content?.parts?.find(
    (part) => typeof part.text === "string",
  )?.text;

  if (!text) {
    throw new LlmApiError("Gemini response does not contain text output.");
  }

  return text;
}

export async function callGeminiService<T>(
  payload: LlmRequestPayload,
  options?: LlmServiceOptions,
): Promise<T> {
  const model = import.meta.env.VITE_GEMINI_MODEL ?? DEFAULT_GEMINI_MODEL;
  const baseUrl =
    import.meta.env.VITE_GEMINI_BASE_URL ?? DEFAULT_GEMINI_BASE_URL;
  const endpoint = options?.endpoint ?? `${baseUrl}/${model}:generateContent`;
  const apiKey = options?.apiKey ?? import.meta.env.VITE_GEMINI_API_KEY;
  const timeoutMs = options?.timeoutMs ?? 30000;

  if (!apiKey) {
    throw new LlmApiError("Missing VITE_GEMINI_API_KEY for Gemini API call.");
  }

  const promptText = `${payload.prompt}\n\nUser input:\n${payload.userInput}\n\nReturn valid JSON only.`;

  try {
    const response = await apiPost<unknown>(
      endpoint,
      {
        contents: [
          {
            role: "user",
            parts: [{ text: promptText }],
          },
        ],
        generationConfig: {
          responseMimeType: "application/json",
        },
      },
      {
        timeoutMs,
        params: { key: apiKey },
      },
    );

    const modelText = extractGeminiTextResponse(response);
    return parseJsonResponse<T>(modelText);
  } catch (error) {
    if (error instanceof LlmInvalidJsonError) {
      throw error;
    }

    if (error instanceof ApiHttpError) {
      throw new LlmApiError(
        error.message ?? "Failed to call Gemini API.",
        error.status,
        error.details,
      );
    }

    throw new LlmApiError("Unexpected error while calling Gemini API.");
  }
}
