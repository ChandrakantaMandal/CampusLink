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
      ...(process.env.DATABASE_URL
        ? {}
        : {
            DATABASE_URL:
              "postgresql://postgres:password@localhost:5432/CampusLink?schema=public",
          }),
      ...(process.env.REDIS_URL ? {} : { REDIS_URL: "redis://localhost:6379" }),
      ...(process.env.AI_SERVICE_URL
        ? {}
        : { AI_SERVICE_URL: "http://localhost:8000" }),
    },

    testTimeout: 30000,

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
