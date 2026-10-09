import { beforeEach, describe, expect, it, vi } from "vitest";
import express from "express";
import request from "supertest";

const mocks = vi.hoisted(() => ({
  streamChatResponse: vi.fn(),
  pipeUIMessageStreamToResponse: vi.fn(({ response }: { response: { end: () => void } }) => response.end()),
}));

vi.mock("../../src/modules/ai/ai.service", () => ({ streamChatResponse: mocks.streamChatResponse }));
vi.mock("ai", () => ({ pipeUIMessageStreamToResponse: mocks.pipeUIMessageStreamToResponse }));

import aiRouter from "../../src/modules/ai/ai.routes";

const app = express();
app.use(express.json());
app.use("/api/ai", aiRouter);

describe("AI chat integration", () => {
  beforeEach(() => vi.clearAllMocks());

  it.each(["/api/ai/chat", "/api/ai"])("pipes chat response through %s", async (path) => {
    const messages = [{ role: "user", parts: [{ type: "text", text: "Help me prepare" }] }];
    const stream = { id: "stream" };
    mocks.streamChatResponse.mockReturnValue(stream);

    const response = await request(app).post(path).set("x-gemini-api-key", "header-key").send({ messages, apiKey: "body-key" });

    expect(response.status).toBe(200);
    expect(mocks.streamChatResponse).toHaveBeenCalledWith(messages, "header-key");
    expect(mocks.pipeUIMessageStreamToResponse).toHaveBeenCalledWith({ response: expect.anything(), stream });
  });

  it("accepts the API key from the request body", async () => {
    const messages = [{ role: "user", parts: [{ type: "text", text: "Hello" }] }];
    mocks.streamChatResponse.mockReturnValue({ id: "stream" });
    await request(app).post("/api/ai/chat").send({ messages, apiKey: "body-key" });
    expect(mocks.streamChatResponse).toHaveBeenCalledWith(messages, "body-key");
  });
});
