export function assertEquals(a, b) {
	if (a !== b) throw Error(`不通过：\n${a}\n↕️\n${b}`);
}
export async function importString(source, { parameters }) {
	const 脚本 = `export default async ({document, Zhan}) => {${source}};`;
	const 模块 = await import(`data:text/javascript,${encodeURIComponent(脚本)}`);
	return 模块.default(parameters);
}

export const dynamicImport = undefined;
