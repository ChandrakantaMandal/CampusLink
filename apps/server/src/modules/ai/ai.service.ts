import { createGoogleGenerativeAI } from "@ai-sdk/google";
import {
  convertToModelMessages,
  createUIMessageStream,
  streamText,
  toUIMessageStream,
  type UIMessage,
} from "ai";
import { ENV } from "../../env.server";
import {
  UNIVERSAL_SYSTEM_PROMPT,
  generateSmartPlacementResponse,
} from "./ai.knowledge";

/**
 * Streams universal AI chat responses with graceful fallback.
 * Uses Google Gemini (gemini-3.8-flash) with custom or environment API key.
 * Can answer ANY question across all subjects, programming languages, science,
 * general knowledge, alongside placement and career prep.
 */
export function streamChatResponse(
  messages: UIMessage[],
  customApiKey?: string,
) {
  const effectiveApiKey =
    customApiKey?.trim() ||
    process.env.GOOGLE_GENERATIVE_AI_API_KEY?.trim() ||
    ENV.GOOGLE_GENERATIVE_AI_API_KEY?.trim() ||
    "";

  const lastUserMessage = [...messages]
    .reverse()
    .find((m) => m.role === "user");

  let userText = "";
  if (lastUserMessage?.parts) {
    userText = lastUserMessage.parts
      .filter((p) => p.type === "text")
      .map((p) => ("text" in p ? p.text : ""))
      .join(" ");
  }

  return createUIMessageStream({
    execute: async ({ writer }) => {
      let emittedStart = false;
      let emittedRealText = false;

      try {
        if (!effectiveApiKey) {
          throw new Error("Missing GOOGLE_GENERATIVE_AI_API_KEY");
        }

        const provider = createGoogleGenerativeAI({
          apiKey: effectiveApiKey,
        });

        // Multi-model resilience chain: prioritized active models with quota
        const CANDIDATE_MODELS = [
          "gemini-3.5-flash-lite",
          "gemini-3.8-flash",
          "gemini-3.5-flash",
          "gemini-flash-lite-latest",
        ] as const;

        const modelMessages = await convertToModelMessages(messages);
        let streamSucceeded = false;

        for (const modelName of CANDIDATE_MODELS) {
          if (streamSucceeded) break;

          try {
            const model = provider(modelName);
            const result = streamText({
              model,
              system: UNIVERSAL_SYSTEM_PROMPT,
              messages: modelMessages,
            });

            const uiStream = toUIMessageStream({ stream: result.stream });
            const reader = uiStream.getReader();

            let modelBuffer: any[] = [];
            let modelStartedStreaming = false;

            while (true) {
              const { done, value } = await reader.read();
              if (done) break;

              if (value?.type === "error") {
                throw new Error(
                  value.errorText || `Model ${modelName} stream error`,
                );
              }

              if (!modelStartedStreaming) {
                modelBuffer.push(value);
                // Check if this chunk or delta contains actual text content
                if (value?.type === "text-delta" && value.delta) {
                  modelStartedStreaming = true;
                  emittedRealText = true;
                  emittedStart = true;
                  // Flush all buffered headers and the first delta to the client
                  for (const buffered of modelBuffer) {
                    writer.write(buffered);
                  }
                  modelBuffer = [];
                }
              } else {
                writer.write(value);
              }
            }

            // If the model completed without throwing and had buffered non-error frames
            if (!modelStartedStreaming && modelBuffer.length > 0) {
              for (const buffered of modelBuffer) {
                writer.write(buffered);
              }
              modelStartedStreaming = true;
            }

            if (modelStartedStreaming) {
              streamSucceeded = true;
              break;
            }
          } catch (modelErr: any) {
            console.warn(
              `[CampusLink AI] Live model "${modelName}" failed (${modelErr?.message || modelErr}). Trying next fallback model...`,
            );

            // If real text was already delivered to client, do not restart with another model
            if (emittedRealText) {
              streamSucceeded = true;
              break;
            }
          }
        }

        if (!streamSucceeded && !emittedRealText) {
          throw new Error(
            "All live Gemini models were temporarily unavailable.",
          );
        }
      } catch (err: any) {
        console.warn(
          "[CampusLink AI] Live Gemini stream unavailable or failed. Activating Universal Smart Engine:",
          err?.message || err,
        );

        if (!emittedRealText) {
          if (!emittedStart) {
            writer.write({ type: "start" });
          }

          const partId = `part-${Date.now()}`;
          writer.write({ type: "text-start", id: partId });

          // Developer-only console log (hidden from end-users)
          console.info(
            "[CampusLink AI Dev] Running Universal Placement & Knowledge Engine.",
          );

          const smartContent = generateSmartPlacementResponse(userText);
          const chunkSize = 24; // Smooth, realistic typing stream preserving all newlines and indentation

          for (let i = 0; i < smartContent.length; i += chunkSize) {
            const chunk = smartContent.slice(i, i + chunkSize);
            writer.write({ type: "text-delta", id: partId, delta: chunk });
            await new Promise((r) => setTimeout(r, 12));
          }

          writer.write({ type: "text-end", id: partId });
          writer.write({ type: "finish" });
        }
      }
    },
  });
}
