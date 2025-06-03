/// <reference lib="deno.ns" />
import { exists } from "jsr:@std/fs/exists";
import esbuild from "esbuild";

const isProduction = !Deno.args.includes("--dev");

// clean dist
if (await exists("./dist")) {
  await Deno.remove("./dist", { recursive: true });
}
await Deno.mkdir("./dist");

// copy files
await Deno.copyFile("./src/index.html", "./dist/index.html");
await Deno.copyFile("./src/metadata.yml", "./dist/metadata.yml");

const builder = await esbuild.context({
  entryPoints: ["./src/index.ts"],
  bundle: true,
  minify: isProduction,
  sourcemap: !isProduction,
  target: "ESNext",
  platform: "browser",
  format: "esm",
  outdir: "./dist",
  loader: {
    ".yml": "text",
  },
  jsx: "automatic", // in case you use JSX (react)
});

await builder.rebuild();
await builder.dispose();
