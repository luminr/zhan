/// <reference lib="dom" />
/// <reference lib="dom.iterable" />

import { importString } from "../源.ts";
import { 做片段, 做超文本, 断定模块类型 } from "./器.js";

/**
 * @param {import("./簇.ts").配置} 配置
 * @returns {Required<import("./簇.ts").配置>}
 */
const 抄写配置 = (
	{
		关键字 = "站",
		前端报错 = true,
		替换迭代 = true,
		定位,
		前端报错模板 = (错误信息) =>
			/* html */ `<span style="text-decoration: wavy underline tomato;">zhan: ${错误信息}</span>`,
	},
) => ({ 关键字, 前端报错, 替换迭代, 定位, 前端报错模板 });

const DOCTYPE = `<!DOCTYPE html>`;
/** @param {import("./簇.ts").建站模块} 模块*/
const 是文档吗 = (模块) => 模块.媒体类型 === "text/html" && 模块.内容.startsWith(DOCTYPE);
/**
 * @param {import("./簇.ts").建站模块} 模块
 * @param {import("./簇.ts").配置} 用户配置
 * @returns {Promise<string>}
 */
export async function 编纂超文本(模块, 用户配置) {
	const 运行时缓存 = new Map();
	const 配置 = 抄写配置(用户配置);
	const 是文档 = 是文档吗(模块);
	const 文档范围 = 是文档 ? (new DOMParser()).parseFromString(模块.内容, "text/html") : 做片段(模块);
	const 文档 = await 元素编纂(文档范围, 配置, 运行时缓存);
	文档.querySelectorAll(全选择器(配置.关键字)).forEach((元素) => 元素.remove());
	return (是文档 ? DOCTYPE : "") + 做超文本([...文档.childNodes]);
}

const 编纂中 = Symbol();
/**
 * @param {string} 模块地址
 * @param {Required<import("./簇.ts").配置>} 配置
 * @param {Map<string,DocumentFragment|编纂中>} 运行时缓存
 * @returns {Promise<DocumentFragment|undefined>}
 */
async function 读取模块(模块地址, 配置, 运行时缓存) {
	if (运行时缓存.has(模块地址)) {
		const 缓存结果 = 运行时缓存.get(模块地址);
		if (缓存结果 === 编纂中) throw new Error(`${模块地址} 检测到了循环嵌套`);
		if (缓存结果 !== undefined) return 缓存结果;
	} else {
		运行时缓存.set(模块地址, 编纂中);
		const 模块 = await 配置.定位(模块地址);
		return 做片段(模块);
	}
}

/**
 * @param {string} 关键字
 */
const 全选择器 = (关键字) =>
	[
		"",
		"src",
		"type",
	].map((t) => `[${关键字}${t ? "\\:" : ""}${t}]`)
		.join(", ");

/** @typedef {Document| DocumentFragment} 片段 */

/**
 * @param {片段} 文档范围
 * @param {Required<import("./簇.ts").配置>} 配置
 * @param {Map<string,DocumentFragment>} 运行时缓存
 * @returns {Promise<片段>}
 */
async function 元素编纂(文档范围, 配置, 运行时缓存) {
	for (const 元素 of 文档范围.querySelectorAll(全选择器(配置.关键字))) {
		try {
			const 模块地址 = 元素.getAttribute(`${配置.关键字}:src`);
			const 模块类型 = 元素.getAttribute(`${配置.关键字}:type`);
			const 模块标签 = 元素.tagName.toLowerCase();

			if ((模块标签 === "script") && (模块类型 === "module")) {
				const 模块内容 = 模块地址 ? 断定模块类型(await 配置.定位(模块地址), "text/javascript").内容 : 元素.innerHTML;
				const 脚本 = `export default async ({document}) => {${模块内容}};`;
				const { default: 脚本模块 } = await importString(脚本);
				await 脚本模块({ document: 元素.getRootNode() });
			} else if (模块地址) {
				const 保留祖元素 = 模块标签 !== "slot";
				const 插入元素 = await 元素替换({ 祖元素: 元素, 模块地址, 运行时缓存 }, 配置);
				if (保留祖元素) {
					元素.append(插入元素);
					元素.removeAttribute(`${配置.关键字}:src`);
				} else 元素.replaceWith(插入元素);
			}
		} catch (错误) {
			if (配置.前端报错) {
				const 模板 = 元素.ownerDocument.createElement("template");
				模板.innerHTML = 配置.前端报错模板(错误.message);
				元素.before(模板.content);
			}
			console.warn(错误);
		}
	}
	return 文档范围;
}

/**
 * @param {{祖元素: Element, 模块地址:string, 运行时缓存: Map<string,DocumentFragment>}} 资料
 * @param {Required<import("./簇.ts").配置>} 配置
 */
async function 元素替换({ 祖元素, 模块地址, 运行时缓存 }, 配置) {
	const 替换结果 = await 读取模块(模块地址, 配置, 运行时缓存);
	if (!替换结果) throw new Error(`${模块地址} 读取不到模块`);
	const 嗣元素 = 配置.替换迭代 ? await 元素编纂(替换结果, 配置, 运行时缓存) : 替换结果;
	const 复制内容 = /** @type {?} */ (嗣元素.cloneNode(true));
	运行时缓存.set(模块地址, 复制内容);

	for (const 坑 of 嗣元素.querySelectorAll(`slot`)) {
		const 插槽名称 = 坑.getAttribute(`name`);
		const 萝卜 = 找萝卜(祖元素, 插槽名称);
		if (萝卜) 坑.replaceWith(萝卜);
		else 坑.replaceWith(...坑.childNodes);
	}
	return 嗣元素;
}

/** @type {(祖元素: Element,槽名: string|null) => DocumentFragment | undefined} */
const 找萝卜 = (祖元素, 槽名) => {
	const 萝卜元素 = (() => {
		if (槽名 === null) {
			const 无名萝卜节点 = [...祖元素.childNodes];
			return 无名萝卜节点.filter((节点) =>
				!(节点.nodeType === 1 && /** @type {Element} */ (节点).hasAttribute("slot"))
			);
		}
		const 记名萝卜元素 = 祖元素.querySelectorAll(`[slot="${槽名}"]`);
		记名萝卜元素.forEach((e) => e.removeAttribute("slot"));
		return [...记名萝卜元素];
	})();
	if (萝卜元素.length !== 0) {
		const 片段 = 祖元素.ownerDocument.createDocumentFragment();
		片段.append(...萝卜元素);
		return 片段;
	}
};
