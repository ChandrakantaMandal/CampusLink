import { defineConfig } from "tsdown";

export default defineConfig({
  entry: "./src/index.ts",
  format: "esm",
  outDir: "./dist",
  clean: true,
  deps: {
    alwaysBundle: [/@CampusLink\/.*/],
  },
  external: ["bcrypt", "node-gyp-build"],
});
