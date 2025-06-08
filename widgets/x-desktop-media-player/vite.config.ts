/// <reference lib="deno.ns" />
import { defineConfig } from "vite";
import deno from "@deno/vite-plugin";
import { svelte } from "@sveltejs/vite-plugin-svelte";

const isProduction = !Deno.args.includes("--dev");

// https://vite.dev/config/
export default defineConfig({
  plugins: [deno(), svelte()],
  build: {
    minify: isProduction,
    sourcemap: !isProduction,
    target: "esnext",
    rollupOptions: {
      input: "./src/main.ts",
      output: {
        // export to ./dist/index.js
        format: "esm",
        dir: "./dist",
        entryFileNames: "index.js",
        assetFileNames: "index.[ext]",
      },
    },
  },
});
