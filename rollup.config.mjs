import typescript from "rollup-plugin-typescript2";
import dts from "rollup-plugin-dts";

export default [
  {
    input: "src/index.ts", // Entry point for your TypeScript code
    output: {
      file: "esm/index.js", // Output ESM file
      format: "esm",
    },
    plugins: [typescript()],
  },
  {
    input: "src/index.ts", // Entry point for your TypeScript code
    output: {
      file: "lib/index.js", // Output CJS file
      format: "cjs",
    },
    plugins: [typescript()],
  },
  {
    input: "src/index.ts", // Entry point for your TypeScript code
    output: [
      {
        file: "esm/index.d.ts",
        format: "esm",
      },
      {
        file: "lib/index.d.ts",
        format: "cjs",
      },
    ],
    plugins: [dts()],
  },
];
