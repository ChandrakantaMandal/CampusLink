import { NextRequest } from "next/server";

const SERVER_URL =
  process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3000";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const apiKey = req.headers.get("x-gemini-api-key");

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (apiKey) {
      headers["x-gemini-api-key"] = apiKey;
    }

    const response = await fetch(`${SERVER_URL}/api/ai/chat`, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    });

    return new Response(response.body, {
      status: response.status,
      headers: {
        "Content-Type": response.headers.get("Content-Type") || "text/plain; charset=utf-8",
        "Cache-Control": "no-cache, no-transform",
        "X-Accel-Buffering": "no",
      },
    });
  } catch (error: any) {
    console.error("[Next.js AI Proxy Error]:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Failed to forward AI request" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
