import { z } from "zod";
import dedent from "dedent";
import shadcnDocs from "../../utils/shadcn-docs";

declare const AI: {
  chatCompletions(options: {
    model: string;
    messages: Array<{ role: string; content: string }>;
    stream?: boolean;
  }): Promise<ReadableStream>;
};

export async function onRequest({ request, env }: any) {
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

  request.headers.delete("accept-encoding");

  try {
    // Input validation
    const json = await request.json();
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
    const fullMessages = [
      {
        role: "system" as const,
        content: systemPrompt + "\n\nPlease ONLY return code, NO backticks or language names.",
      },
      ...messages,
    ];

    // Use OpenAI API if DEEPSEEK_API_KEY is set, otherwise use Edge AI
    if (env.DEEPSEEK_API_KEY) {
      return handleOpenAI(env.DEEPSEEK_API_KEY, fullMessages);
    } else {
      return handleEdgeAI(fullMessages);
    }
  } catch (err: any) {
    console.error("API error:", err);
    const errorMessage = err?.message || err?.toString() || "Unknown error";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { 
        status: 503,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      },
    );
  }
}

// Handle OpenAI/DeepSeek API using native fetch
async function handleOpenAI(apiKey: string, messages: Array<{ role: string; content: string }>) {
  const response = await fetch("https://api.deepseek.com/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "deepseek-chat",
      messages,
      stream: true,
    }),
  });

  if (!response.ok || !response.body) {
    const error = await response.text();
    throw new Error(`DeepSeek API error: ${error}`);
  }

  // Parse SSE stream and extract content (same as Edge AI)
  let buffer = "";
  const transformStream = new TransformStream({
    transform(chunk, controller) {
      buffer += new TextDecoder().decode(chunk);
      const lines = buffer.split("\n");
      buffer = lines.pop() || "";
      for (const line of lines) {
        if (line.startsWith("data: ")) {
          const data = line.slice(6).trim();
          if (data === "[DONE]") continue;
          try {
            const json = JSON.parse(data);
            const content = json.choices?.[0]?.delta?.content || "";
            if (content) {
              controller.enqueue(new TextEncoder().encode(content));
            }
          } catch {}
        }
      }
    },
    flush(controller) {
      if (buffer.startsWith("data: ")) {
        const data = buffer.slice(6).trim();
        if (data && data !== "[DONE]") {
          try {
            const json = JSON.parse(data);
            const content = json.choices?.[0]?.delta?.content || "";
            if (content) {
              controller.enqueue(new TextEncoder().encode(content));
            }
          } catch {}
        }
      }
    }
  });

  return new Response(response.body.pipeThrough(transformStream), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
      "Access-Control-Allow-Origin": "*",
    },
  });
}

// Handle Edge AI
async function handleEdgeAI(messages: Array<{ role: string; content: string }>) {
  const response = await AI.chatCompletions({
    model: "@tx/deepseek-ai/deepseek-v3-0324",
    messages,
    stream: true,
  });

  // Parse SSE stream and extract content
  let buffer = "";
  const transformStream = new TransformStream({
    transform(chunk, controller) {
      buffer += new TextDecoder().decode(chunk);
      const lines = buffer.split("\n");
      buffer = lines.pop() || "";
      for (const line of lines) {
        if (line.startsWith("data: ")) {
          const data = line.slice(6).trim();
          if (data === "[DONE]") continue;
          try {
            const json = JSON.parse(data);
            const content = json.choices?.[0]?.delta?.content || "";
            if (content) {
              controller.enqueue(new TextEncoder().encode(content));
            }
          } catch {}
        }
      }
    },
    flush(controller) {
      if (buffer.startsWith("data: ")) {
        const data = buffer.slice(6).trim();
        if (data && data !== "[DONE]") {
          try {
            const json = JSON.parse(data);
            const content = json.choices?.[0]?.delta?.content || "";
            if (content) {
              controller.enqueue(new TextEncoder().encode(content));
            }
          } catch {}
        }
      }
    }
  });

  return new Response(response.pipeThrough(transformStream), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
      "Access-Control-Allow-Origin": "*",
    },
  });
}

function getSystemPrompt(shadcn: boolean) {
  let systemPrompt = `You are an expert frontend React/TypeScript engineer. Follow these rules strictly:

CRITICAL RULES:
- Return ONLY valid, compilable code - no syntax errors allowed
- Return ONLY code, no explanations, no markdown, no backticks
- Use default export for the component
- Keep code concise and minimal
- Double-check all syntax before returning

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
