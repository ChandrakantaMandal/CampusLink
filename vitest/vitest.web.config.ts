import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";
import path from "node:path";

const configDir = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(configDir, "..");

export default defineConfig({
  root: projectRoot,

  test: {
    name: "web",
    globals: true,
    environment: "jsdom",

    include: ["apps/web/tests/**/*.test.ts", "apps/web/tests/**/*.test.tsx"],

    coverage: {
      provider: "v8",
      reporter: ["text", "html", "lcov"],
      reportsDirectory: "./coverage/web",
    },
  },
});
