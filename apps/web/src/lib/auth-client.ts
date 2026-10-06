import { createAuthClient } from "better-auth/react";
import { inferAdditionalFields } from "better-auth/client/plugins";

function getServerUrl(url?: string): string {
  const processEnv = (
    globalThis as {
      process?: { env?: Record<string, string | undefined> };
    }
  ).process?.env;

  if (typeof window === "undefined" && processEnv?.SERVER_URL) {
    return processEnv.SERVER_URL.replace(/\/+$/, "");
  }

  const rawUrl =
    url || processEnv?.NEXT_PUBLIC_SERVER_URL || "http://localhost:3000";

  return rawUrl.replace(/\/+$/, "");
}

const serverUrl = getServerUrl(process.env.NEXT_PUBLIC_SERVER_URL);

export const authClient = createAuthClient({
  baseURL: new URL("/api/auth", serverUrl).toString(),

  plugins: [
    inferAdditionalFields({
      user: {
        role: {
          type: "string",
        },
      },
    }),
  ],
});
