import { z } from "zod";
import dedent from "dedent";
import shadcnDocs from "../../utils/shadcn-docs";
import OpenAI from "openai";

export async function onRequest({ request, params, env }: any) {
  if (request.method === "OPTIONS") {
    return new Response(null, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Max-Age": "86400",
      },
    });
  }
  try {
    if (!env.DEEPSEEK_API_KEY) {
      return new Response(
        "Environment configuration is missing. Please set up the necessary environment variables in your EdgeOne Pages project settings.",
        { status: 200 },
      );
    }

    request.headers.delete("accept-encoding");
    // Input validation
    const json = await request.clone().json();
    const result = z
      .object({
        model: z.string(),
        shadcn: z.boolean().default(false),
        messages: z.array(
          z.object({
            role: z.enum(["user", "assistant"]),
            content: z.string(),
          }),
        ),
      })
      .safeParse(json);

    if (!result.success) {
      return new Response(result.error.message, { status: 422 });
    }

    const { messages, shadcn } = result.data;
    const systemPrompt = getSystemPrompt(shadcn);

    // Initialize OpenAI client
    const openai = new OpenAI({
      apiKey: env.DEEPSEEK_API_KEY,
      baseURL: "https://api.deepseek.com",
    });

    // Create chat completion stream
    const stream = await openai.chat.completions.create({
      model: "deepseek-chat",
      messages: [
        {
          role: "system",
          content:
            systemPrompt +
            "\n\nPlease ONLY return code, NO backticks or language names.",
        },
        ...messages,
      ],
      stream: true,
      max_tokens: 8192,
    });

    // Create response stream
    const responseStream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();

        try {
          for await (const chunk of stream) {
            const text = chunk.choices[0]?.delta?.content || "";
            if (text) {
              controller.enqueue(encoder.encode(text));
            }
          }
          controller.close();
        } catch (error) {
          console.error("Stream error:", error);
          // Don't call controller.error(), just close to let frontend keep received content
          controller.close();
        }
      },
    });

    return new Response(responseStream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (err: any) {
    console.error("API error:", err);
    const errorMessage = err?.message || err?.toString() || "Unknown error";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { 
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      },
    );
  }
}

function getSystemPrompt(shadcn: boolean) {
  let systemPrompt = `You are an expert frontend React/TypeScript engineer. Follow these rules strictly:

CRITICAL RULES:
- Return ONLY code, no explanations, no markdown, no backticks
- Use default export for the component
- Keep code concise and minimal - avoid unnecessary comments, verbose variable names, or redundant code
- Combine related state into objects when possible
- Use short but meaningful variable names

TECHNICAL REQUIREMENTS:
- Import React hooks directly: import { useState } from "react"
- Use Tailwind CSS for styling (no arbitrary values like h-[600px])
- Make components interactive with proper state management
- No required props - component must work standalone

LIBRARIES AVAILABLE:
- recharts: Only for charts/dashboards (import { LineChart, XAxis, ... } from "recharts")
- For placeholder images: <div className="w-16 h-16 bg-gray-200 border-2 border-dashed rounded-xl" />
`;

  if (shadcn) {
    systemPrompt += `
SHADCN COMPONENTS AVAILABLE:
${shadcnDocs
  .map(
    (component) => `<${component.name}>
Import: ${component.importDocs}
Usage: ${component.usageDocs}
</${component.name}>`
  )
  .join("\n")}

Use these components when appropriate.
`;
  }

  systemPrompt += `
NO OTHER LIBRARIES (zod, hookform, etc.) ARE AVAILABLE.
`;

  return dedent(systemPrompt);
}
