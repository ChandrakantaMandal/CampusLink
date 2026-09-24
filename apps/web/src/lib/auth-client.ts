import { createAuthClient } from "better-auth/react";

function getServerUrl(url?: string) {
  const processEnv = (
    globalThis as {
      process?: { env?: Record<string, string | undefined> };
    }
  ).process?.env;
  if (typeof window === "undefined" && processEnv?.SERVER_URL) {
    return processEnv.SERVER_URL.endsWith("/")
      ? processEnv.SERVER_URL.slice(0, -1)
      : processEnv.SERVER_URL;
  }

  const rawUrl = url || processEnv?.NEXT_PUBLIC_SERVER_URL || "http://localhost:3000";
  return rawUrl.endsWith("/") ? rawUrl.slice(0, -1) : rawUrl;
}

const serverUrl = getServerUrl(process.env.NEXT_PUBLIC_SERVER_URL);

export const authClient = createAuthClient({
  baseURL: new URL("/api/auth", serverUrl).toString(),
});