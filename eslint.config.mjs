import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // QA scratch: headless Chrome profiles and screenshots (gitignored).
    ".qa/**",
  ]),
  // Node CommonJS tooling (tools/release/*.cjs, 2026-11-15): `require` is how a .cjs file imports — the rule is for the ES-module code
  { files: ["**/*.cjs"], rules: { "@typescript-eslint/no-require-imports": "off" } },
]);

export default eslintConfig;
