import {
  buildCoachPrompt,
  buildProducerPrompt,
  buildScamPrompt,
  CoachAiPayload,
  DEFAULT_AI_MODEL,
  ProducerAiPayload,
  ScamAiPayload,
} from "@/lib/ai";

export const runtime = "nodejs";

type Mode = "coach" | "scam" | "producer";

type RequestBody = {
  mode?: Mode;
  apiKey?: string;
  model?: string;
  payload?: unknown;
};

const modeConfigs = {
  coach: {
    instructions:
      "You are AltinOtesi AI Koc. Reply in Turkish. Teach financial concepts simply. Never recommend a specific investment product, security, token, or buy/sell action. Never promise returns. Keep the answer concrete and short. Always return valid JSON.",
    schema: {
      type: "object",
      additionalProperties: false,
      properties: {
        answer: { type: "string" },
        followUps: {
          type: "array",
          minItems: 2,
          maxItems: 3,
          items: { type: "string" },
        },
        caution: { type: "string" },
      },
      required: ["answer", "followUps", "caution"],
    },
    buildInput: (payload: CoachAiPayload) => buildCoachPrompt(payload),
  },
  scam: {
    instructions:
      "You are AltinOtesi Scam Shield explanation layer. Reply in Turkish. Do not change or debate the rule-based risk score. Explain the warning signs grounded only in the provided analysis. Give practical next steps. Never tell the user to invest or to trust a message. Always return valid JSON.",
    schema: {
      type: "object",
      additionalProperties: false,
      properties: {
        explanation: { type: "string" },
        nextSteps: {
          type: "array",
          minItems: 3,
          maxItems: 4,
          items: { type: "string" },
        },
        safeReply: { type: "string" },
      },
      required: ["explanation", "nextSteps", "safeReply"],
    },
    buildInput: (payload: ScamAiPayload) => buildScamPrompt(payload),
  },
  producer: {
    instructions:
      "You are AltinOtesi's budget coach for women earning from home production. Reply in Turkish. Focus on profit visibility, cost pressure, savings rhythm, and budget discipline. Do not give tax, legal, or investment advice. Never promise sales growth. Always return valid JSON.",
    schema: {
      type: "object",
      additionalProperties: false,
      properties: {
        summary: { type: "string" },
        actions: {
          type: "array",
          minItems: 3,
          maxItems: 4,
          items: { type: "string" },
        },
        budgetFocus: { type: "string" },
        nextQuestion: { type: "string" },
      },
      required: ["summary", "actions", "budgetFocus", "nextQuestion"],
    },
    buildInput: (payload: ProducerAiPayload) => buildProducerPrompt(payload),
  },
} as const;

function isMode(value: unknown): value is Mode {
  return value === "coach" || value === "scam" || value === "producer";
}

function extractOutputText(data: any) {
  if (typeof data?.output_text === "string" && data.output_text.trim()) {
    return data.output_text.trim();
  }

  const pieces =
    data?.output?.flatMap((item: any) =>
      Array.isArray(item?.content)
        ? item.content
            .map((part: any) => (typeof part?.text === "string" ? part.text : ""))
            .filter(Boolean)
        : [],
    ) ?? [];

  return pieces.join("\n").trim();
}

function parseStructuredJson<T>(raw: string): T {
  try {
    return JSON.parse(raw) as T;
  } catch {
    const start = raw.indexOf("{");
    const end = raw.lastIndexOf("}");

    if (start >= 0 && end > start) {
      return JSON.parse(raw.slice(start, end + 1)) as T;
    }

    throw new Error("Model yaniti parse edilemedi.");
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as RequestBody;

    if (!isMode(body.mode)) {
      return Response.json({ error: "Gecersiz AI modu." }, { status: 400 });
    }

    if (!body.apiKey?.trim()) {
      return Response.json({ error: "API key eksik." }, { status: 400 });
    }

    const config = modeConfigs[body.mode];

    const upstream = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${body.apiKey.trim()}`,
      },
      body: JSON.stringify({
        model: body.model?.trim() || DEFAULT_AI_MODEL,
        store: false,
        max_output_tokens: 700,
        instructions: config.instructions,
        input: config.buildInput(body.payload as never),
        text: {
          format: {
            type: "json_schema",
            name: `altin_otesi_${body.mode}`,
            strict: true,
            schema: config.schema,
          },
        },
      }),
      cache: "no-store",
    });

    const data = await upstream.json();

    if (!upstream.ok) {
      return Response.json(
        {
          error:
            data?.error?.message ??
            "OpenAI istegi basarisiz oldu. API key ve model ayarini kontrol et.",
        },
        { status: upstream.status },
      );
    }

    const outputText = extractOutputText(data);

    if (!outputText) {
      return Response.json({ error: "Model bos yanit dondu." }, { status: 502 });
    }

    const result = parseStructuredJson(outputText);
    return Response.json({ result });
  } catch (error) {
    return Response.json(
      {
        error:
          error instanceof Error ? error.message : "AI istegi sirasinda beklenmeyen hata.",
      },
      { status: 500 },
    );
  }
}
