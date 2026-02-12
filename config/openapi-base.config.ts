import { defineConfig } from "@hey-api/openapi-ts";

export default defineConfig({
  input: "http://192.168.113.180:8888/openapi.json",
  output: "src/api/base",
});
