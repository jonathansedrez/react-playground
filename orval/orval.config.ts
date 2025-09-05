import { defineConfig } from "orval";

export default defineConfig({
  "petstore-file": {
    input: "./src/api/petstore.yaml",
    output: {
      target: "./src/api/petstore.ts",
      baseUrl: "http://localhost:4000",
    },
  },
});
