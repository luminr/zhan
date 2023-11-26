import { assertEquals } from "../源.ts";
import { 编纂超文本 } from "./编纂.js";
import { 做超文本, 断定模块类型 } from "./器.js";

console.warn = () => {};
const 测试数据 = (new DOMParser()).parseFromString(
	await fetch(import.meta.resolve("./编纂.test.html")).then((响应) => 响应.text()),
	"text/html",
);

const 标签映射至媒体类型 =
	/** @type {const} */ ({ "template": "text/html", "script": "text/javascript", "style": "text/css" });

/** @type {import("./簇.ts").配置["定位"]} */
const 定位 = (谓) => {
	const 元素 = 测试数据.querySelector(`[稿~=${谓}]`);
	if (!元素) throw new Error(`${谓} 找不到模块`);

	const 媒体类型 =
		/** @type {import("./簇.ts").建站模块["媒体类型"]} */
		(元素.getAttribute("type") ??
			标签映射至媒体类型[/** @type {keyof typeof 标签映射至媒体类型} */ (元素?.tagName.toLowerCase())]);

	const 内容 = 元素.innerHTML;
	if (!内容) throw new Error(`${谓} 找不到模块`);
	return Promise.resolve({ 内容, 媒体类型, 谓 });
};

/**
 * @param {string} 入口
 * @param {Partial<import("./簇.ts").配置>} [配置]
 */
const 生成测试 = (入口, 配置) =>
	async function () {
		const 结果 = await 编纂超文本(await 定位(入口), { 定位, 包括头部: false, ...配置 });
		/** @type {HTMLTemplateElement} */
		const 期待结果元素 = /** @type {?} */ (测试数据.querySelector(`template[结果~=${入口}]`));
		const 期待结果 = 做超文本([...期待结果元素?.content.childNodes]);
		if (!期待结果) throw new Error(`${入口} 找不到期待结果`);
		assertEquals(结果.replace(/\s+/g, " "), 期待结果.replace(/\s+/g, " "));
	};

Deno.test("移除", 生成测试("移除"));
Deno.test("移除：模板", 生成测试("移除：模板", { 前端报错: false }));
Deno.test("移除：脚本", 生成测试("移除：脚本"));
Deno.test("模块：替换", 生成测试("模块：替换"));
Deno.test("模块：嵌套", 生成测试("模块：嵌套"));
Deno.test("模块：嵌套：不迭代", 生成测试("模块：嵌套：不迭代", { 替换迭代上限: 0 }));
Deno.test("模块：嵌套：锁死", 生成测试("模块：嵌套：锁死"));
Deno.test("模块：嵌套：锁死：不报错", 生成测试("模块：嵌套：锁死：不报错", { 前端报错: false }));
Deno.test("模块：嵌套：锁死：二重", 生成测试("模块：嵌套：锁死：二重"));
Deno.test("脚本：文档操作", 生成测试("脚本：文档操作"));
Deno.test("脚本：文档操作：嵌套", 生成测试("脚本：文档操作：嵌套"));
Deno.test("脚本：文档操作：外部", 生成测试("脚本：文档操作：外部"));
Deno.test("插槽：无名", 生成测试("插槽：无名"));
Deno.test("插槽：记名", 生成测试("插槽：记名"));
Deno.test("插槽：默认内容", 生成测试("插槽：默认内容"));
Deno.test("插槽：非元素内容", 生成测试("插槽：非元素内容"));
Deno.test("超文本头部", async () => {
	const 全文档 =
		`<!DOCTYPE html><html lang="zh"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Document</title></head><body></body></html>`;
	const 结果 = await 编纂超文本(
		断定模块类型({
			内容: 全文档,
			媒体类型: "text/html",
			谓: "超文本头部",
		}, "text/html"),
		{ 定位 },
	);
	assertEquals(结果, 全文档);
});
Deno.test("超文本头部：嵌套", async () => {
	const 内容 =
		`<!DOCTYPE html><html lang="zh"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Document</title></head><body><slot></slot></body></html>`;
	const 结果 = await 编纂超文本(
		断定模块类型({
			内容: `<slot 站:src="头部">测试</slot>`,
			媒体类型: "text/html",
			谓: "超文本头部",
		}, "text/html"),
		{ 定位: (谓) => Promise.resolve({ 内容, 媒体类型: "text/html", 谓 }) },
	);
	assertEquals(
		结果,
		`<!DOCTYPE html><html lang="zh"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Document</title></head><body>测试</body></html>`,
	);
});
Deno.test(
	"数据：模块",
	生成测试("数据：模块", { 定位: (谓) => Promise.resolve({ 内容: `{"a":1}`, 媒体类型: "application/json", 谓 }) }),
);

Deno.test("脚本：模块", 生成测试("脚本：模块"));
Deno.test("标下：模块", 生成测试("标下：模块"));
