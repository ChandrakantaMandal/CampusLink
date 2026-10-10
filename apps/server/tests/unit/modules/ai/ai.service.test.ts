import { describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({ writes: [] as unknown[], execute: vi.fn(), fallback: vi.fn() }));

vi.mock("../../../../src/env.server", () => ({ ENV: { GOOGLE_GENERATIVE_AI_API_KEY: "" } }));
vi.mock("../../../../src/modules/ai/ai.knowledge", () => ({ UNIVERSAL_SYSTEM_PROMPT: "system", generateSmartPlacementResponse: mocks.fallback }));
vi.mock("@ai-sdk/google", () => ({ createGoogleGenerativeAI: vi.fn() }));
vi.mock("ai", () => ({
  convertToModelMessages: vi.fn(),
  createUIMessageStream: vi.fn(({ execute }) => {
    const writes: unknown[] = [];
    const completion = execute({ writer: { write: (chunk: unknown) => writes.push(chunk) } });
    mocks.writes = writes;
    mocks.execute = vi.fn(() => completion);
    return { completion, writes };
  }),
  streamText: vi.fn(),
  toUIMessageStream: vi.fn(),
}));

import { streamChatResponse } from "../../../../src/modules/ai/ai.service";

describe("streamChatResponse", () => {
  it("uses the local fallback when no Gemini key is configured", async () => {
    delete process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    mocks.fallback.mockReturnValue("Local fallback reply");
    const stream = streamChatResponse([{ role: "user", parts: [{ type: "text", text: "How do I prepare?" }] }] as never) as unknown as { completion: Promise<void>; writes: unknown[] };
    await stream.completion;
    expect(mocks.fallback).toHaveBeenCalledWith("How do I prepare?");
    expect(stream.writes).toContainEqual(expect.objectContaining({ type: "text-delta", delta: "Local fallback reply" }));
  });
});
