export const DOMParser = globalThis.DOMParser;
export function assertEquals(a, b) {
	if (a !== b) throw Error(`不通过：\n${a}\n↕️\n${b}`);
}
export function importString(source) {
	return import(`data:text/javascript,${encodeURIComponent(source)}`);
}