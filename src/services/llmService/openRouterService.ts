import { OpenRouter } from "@openrouter/sdk";
import {
  LlmApiError,
  LlmInvalidJsonError,
  type LlmRequestPayload,
  type LlmServiceOptions,
} from "./llmService";

const DEFAULT_OPENROUTER_MODEL = "openai/gpt-5.2";
const DEFAULT_SITE_URL = "http://localhost:5173";
const DEFAULT_SITE_NAME = "HealthyMe AI";

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
    throw new LlmInvalidJsonError("OpenRouter returned invalid JSON.", text);
  }
}

function extractOpenRouterTextResponse(payload: unknown): string {
  if (!payload || typeof payload !== "object") {
    throw new LlmApiError("OpenRouter response payload is invalid.");
  }

  const data = payload as {
    choices?: Array<{
      message?: {
        content?: unknown;
      };
    }>;
  };

  const content = data.choices?.[0]?.message?.content;

  if (typeof content === "string" && content.trim()) {
    return content;
  }

  if (Array.isArray(content)) {
    const text = content
      .map((part) => {
        if (typeof part === "string") {
          return part;
        }

        if (part && typeof part === "object" && "text" in part) {
          const textPart = (part as { text?: unknown }).text;
          return typeof textPart === "string" ? textPart : "";
        }

        return "";
      })
      .join("")
      .trim();

    if (text) {
      return text;
    }
  }

  throw new LlmApiError("OpenRouter response does not contain text output.");
}

export async function callOpenRouterService<T>(
  payload: LlmRequestPayload,
  options?: LlmServiceOptions,
): Promise<T> {
  const apiKey = options?.apiKey ?? import.meta.env.VITE_OPENROUTER_API_KEY;
  const model =
    import.meta.env.VITE_OPENROUTER_MODEL ?? DEFAULT_OPENROUTER_MODEL;
  if (!apiKey) {
    throw new LlmApiError(
      "Missing VITE_OPENROUTER_API_KEY for OpenRouter API call.",
    );
  }

  const openRouter = new OpenRouter({
    apiKey,
  });

  const promptText = `${payload.prompt}\n\nUser input:\n${payload.userInput}\n\nReturn valid JSON only.`;

  try {
    const completion = await openRouter.chat.send({
      model,
      messages: [
        {
          role: "user",
          content: promptText,
        },
      ],
      stream: false,
    });

    const modelText = extractOpenRouterTextResponse(completion);
    return parseJsonResponse<T>(modelText);
  } catch (error) {
    if (error instanceof LlmInvalidJsonError) {
      throw error;
    }

    const sdkError = error as {
      message?: string;
      status?: number;
      error?: { message?: string };
    };

    throw new LlmApiError(
      sdkError.error?.message ??
        sdkError.message ??
        "Failed to call OpenRouter API.",
      sdkError.status,
      error,
    );
  }
}
