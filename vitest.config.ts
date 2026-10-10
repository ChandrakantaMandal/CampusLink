import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,

    projects: [
      "./vitest/vitest.server.config.ts",
      "./vitest/vitest.web.config.ts",
      "./vitest/vitest.auth.config.ts",
      "./vitest/vitest.db.config.ts",
    ],
  },
});
