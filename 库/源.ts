import { DOMParser } from "npm:linkedom@0.15.4";
export { assertEquals } from "https://deno.land/std@0.204.0/assert/mod.ts";
export {
	dynamicImport,
	importString,
} from "https://raw.githubusercontent.com/luminr/import/411867570bbc4671b00e11576a0503d19c52e4a3/mod.ts";
// @ts-ignore polyfill
globalThis.DOMParser = DOMParser;
