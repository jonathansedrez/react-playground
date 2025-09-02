import { defineConfig } from "orval";

export default defineConfig({
  "petstore-file": {
    input: "./petstore.yaml",
    output: "./src/api/petstore.ts",
  },
});
