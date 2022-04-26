// @ts-check

import pkg from "./package.json";
import path from "path";
import deepmerge from "deepmerge";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import strip from "@rollup/plugin-strip";
import typescript from "@rollup/plugin-typescript";
import cleanup from "rollup-plugin-cleanup";
import dts from "rollup-plugin-dts";
import { terser } from "rollup-plugin-terser";

const fileName = pkg.main
  .replace(/^\.\/src/, "./dist")
  .replace(/\.(mjs|[tj]sx?)$/, "");

/** @type {import("rollup").RollupOptions} */
const baseConfig = {
  input: path.join(__dirname, "./src/hamming.ts"),
};

/**
 * Specifies non-general bundle settings.
 * @param {import("rollup").RollupOptions} extraConfig - unique settings.
 * @returns {import("rollup").RollupOptions}
 */
const bundle = (extraConfig) => deepmerge(baseConfig, extraConfig);

/**
 * Transform module type to file infix.
 * @param {import("rollup").OutputOptions["format"]} infix - module import/export type.
 * @returns {string}
 */
const mapModuleToInfix = (infix) => {
  switch (infix) {
    case "cjs":
    case "esm":
    case "amd":
    case "umd":
      return `.${infix}.`;
    case "commonjs":
      return ".cjs.";
    default:
      return ".";
  }
};

/**
 * Returns files with the specified ECMA Script module type.
 * @param {string} fileName - source file.
 * @param {import("rollup").OutputOptions["format"]} format - module import/export format.
 * @returns {import("rollup").RollupOptions[]}
 */
const withConfig = (fileName, format) => {
  const infix = mapModuleToInfix(format);

  return [
    bundle({
      output: {
        file: `${fileName}.es6${infix}js`,
        name: fileName,
        format,
      },
      plugins: [
        typescript({ target: "es6" }),
        nodeResolve(),
        strip({
          include: ["src/**/*.ts"],
          sourceMap: false,
          functions: ["console.*"],
        }),
        cleanup({ extensions: ["js", "ts"] }),
      ],
    }),
    bundle({
      output: {
        file: `${fileName}.es5${infix}js`,
        name: fileName,
        format,
      },
      plugins: [
        typescript({ target: "es5" }),
        nodeResolve(),
        strip({
          include: ["src/**/*.ts"],
          sourceMap: false,
          functions: ["console.*"],
        }),
        cleanup({ extensions: ["js", "ts"] }),
      ],
    }),
    bundle({
      output: {
        file: `${fileName}.es6${infix}min.js`,
        name: fileName,
        format,
      },
      plugins: [typescript({ target: "es6" }), nodeResolve(), terser()],
    }),
    bundle({
      output: {
        file: `${fileName}.es5${infix}min.js`,
        name: fileName,
        format,
      },
      plugins: [typescript({ target: "es5" }), nodeResolve(), terser()],
    }),
  ];
};

/** @type {import("rollup").RollupOptions[]} */
const options = [
  bundle({
    output: {
      file: `${fileName}.js`,
    },
    plugins: [
      typescript(),
      nodeResolve(),
      strip({
        include: ["src/**/*.ts"],
        sourceMap: false,
        functions: ["console.*"],
      }),
      cleanup({ extensions: ["js", "ts"] }),
    ],
  }),
  bundle({
    output: {
      file: `${fileName}.min.js`,
    },
    plugins: [typescript(), nodeResolve(), terser()],
  }),
  ...withConfig(fileName, "cjs"),
  ...withConfig(fileName, "esm"),
  ...withConfig(fileName, "amd"),
  ...withConfig(fileName, "umd"),
  bundle({
    output: {
      file: `${fileName}.d.ts`,
      format: "es",
    },
    plugins: [dts()],
  }),
];

export default options;
