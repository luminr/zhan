import { DOMParser } from "npm:linkedom@0.15.4";
export { assertEquals } from "https://deno.land/std@0.204.0/assert/mod.ts";
export { dynamicImport, importString } from "https://deno.land/x/import@0.2.1/mod.ts";
// @ts-ignore polyfill
globalThis.DOMParser = DOMParser;
