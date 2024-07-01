// Copyright (C) 2024, Nuklai. All rights reserved.
// See the file LICENSE for licensing terms.

import { build } from "esbuild";
import path from "path";
import { fileURLToPath } from "url";
import alias from "esbuild-plugin-alias";
import { NodeModulesPolyfillPlugin } from "@esbuild-plugins/node-modules-polyfill";

// Convert import.meta.url to __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const commonOptions = {
  entryPoints: ["./src/index.ts"],
  bundle: true,
  sourcemap: true,
  target: "esnext",
  define: {
    "process.env.NODE_ENV": JSON.stringify("production")
  },
  inject: ["./polyfills.js"],
  outdir: "dist"
};

const builds = [
  {
    ...commonOptions,
    platform: "browser",
    format: "esm",
    entryNames: "[name].esm",
    plugins: [
      alias({
        crypto: path.resolve(
          __dirname,
          "node_modules/crypto-browserify/index.js"
        ),
        stream: path.resolve(
          __dirname,
          "node_modules/stream-browserify/index.js"
        ),
        buffer: path.resolve(__dirname, "node_modules/buffer/index.js"),
        zlib: path.resolve(__dirname, "node_modules/browserify-zlib/index.js"),
        util: path.resolve(__dirname, "node_modules/util/util.js"),
        process: path.resolve(__dirname, "node_modules/process/browser.js"),
        events: path.resolve(__dirname, "node_modules/events/events.js")
      }),
      NodeModulesPolyfillPlugin()
    ]
  },
  {
    ...commonOptions,
    platform: "node",
    format: "cjs",
    entryNames: "[name].cjs"
  }
];

Promise.all(builds.map(build)).catch(() => process.exit(1));
