import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";
import path from "node:path";

const configDir = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(configDir, "..");

export default defineConfig({
  root: projectRoot,

  test: {
    name: "server",
    globals: true,
    environment: "node",

    env: {
      NODE_ENV: "test",
    },

    include: ["apps/server/tests/**/*.test.ts"],

    fileParallelism: false,

    coverage: {
      provider: "v8",
      reporter: ["text", "html", "lcov"],
      reportsDirectory: "./coverage/server",
    },
  },

  envDir: path.resolve(projectRoot, "apps/server"),
});