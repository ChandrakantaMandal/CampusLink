import { pipeUIMessageStreamToResponse, type UIMessage } from "ai";
import type { Request, Response } from "express";
import { streamChatResponse } from "./ai.service";

/**
 * Controller for handling AI chat stream requests
 */
export async function chatStreamController(req: Request, res: Response) {
  const { messages = [], apiKey: bodyApiKey } = (req.body || {}) as {
    messages: UIMessage[];
    apiKey?: string;
  };

  const headerApiKey = req.headers["x-gemini-api-key"] as string | undefined;
  const customApiKey = headerApiKey || bodyApiKey;

  const stream = streamChatResponse(messages, customApiKey);

  pipeUIMessageStreamToResponse({
    response: res,
    stream,
  });
}
