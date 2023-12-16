/// <reference lib="dom" />
/// <reference lib="dom.iterable" />

import { dynamicImport, importString } from "../源.ts";
import { DOCTYPE, 做片段, 做超文本, 断定模块类型 } from "./器.js";

/**
 * @param {import("./簇.ts").建站模块} 模块
 * @param {import("./簇.ts").配置} 用户配置
 */
export function 编纂超文本(模块, 用户配置) {
	const 小编 = new 编辑部(用户配置);
	return 小编.开始(模块);
}
class 编辑部 {
	/** @type {Required<import("./簇.ts").配置>} */
	#配置;
	/** @param {import("./簇.ts").配置} 用户配置 */
	constructor({
		关键字 = "站",
		替换迭代上限 = 100,
		定位,
		前端报错模板 = (错误信息) =>
			/* html */ `<span style="text-decoration: wavy underline tomato;">zhan: ${错误信息}</span>`,
		脚本工具箱 = {},
		要前端报错 = true,
		要包括头部 = true,
		要渲染脚本 = true,
	}) {
		this.#配置 = { 关键字, 要前端报错, 替换迭代上限, 定位, 前端报错模板, 脚本工具箱, 要包括头部, 要渲染脚本 };
		this.#剩余迭代次数 = this.#配置.替换迭代上限;
	}
	/** @param {import("./簇.ts").建站模块} 模块 */
	async 开始(模块) {
		const 文档范围 = this.#配置.要包括头部 ? (new DOMParser()).parseFromString(模块.内容, "text/html") : 做片段(模块);
		if (typeof 文档范围 === "string") {
			return { 超文本: 文档范围, 错误集: this.#错误集, 运行时缓存: this.#运行时缓存 };
		}
		await this.#一环(文档范围);
		文档范围.querySelectorAll(this.#全选择器).forEach((元素) => 元素.remove());
		const 超文本 = (this.#配置.要包括头部 ? DOCTYPE : "") + 做超文本([...文档范围.childNodes]);
		return { 超文本, 错误集: this.#错误集, 运行时缓存: this.#运行时缓存 };
	}
	/** @type { Map<string, 片段| string |编纂中>} */
	#运行时缓存 = new Map();
	/** @type {Error[]}} */
	#错误集 = [];
	/**
	 * @param {string} 模块地址
	 * @returns {Promise<片段| string>}
	 */
	async #读取(模块地址) {
		if (this.#运行时缓存.has(模块地址)) {
			const 缓存结果 = this.#运行时缓存.get(模块地址);
			if (缓存结果 === 编纂中) throw new Error(`${模块地址} 检测到了循环嵌套`);
			if (缓存结果 !== undefined) return 缓存结果;
		}
		this.#运行时缓存.set(模块地址, 编纂中);
		const 模块 = await this.#配置.定位(模块地址);
		return 做片段(模块);
	}
	#剩余迭代次数;
	get #全选择器() {
		return ["", "src", "type"]
			.map((t) => `[${this.#配置.关键字}${t ? "\\:" : ""}${t}]`)
			.join(", ");
	}
	/**
	 * @param {片段} 文档范围
	 * @returns {Promise<片段>}
	 */
	async #一环(文档范围) {
		for (const 元素 of 文档范围.querySelectorAll(this.#全选择器)) {
			try {
				const 模块地址 = 元素.getAttribute(`${this.#配置.关键字}:src`);
				const 模块类型 = 元素.getAttribute(`${this.#配置.关键字}:type`);
				const 模块标签 = 元素.tagName.toLowerCase();
				if ((this.#配置.要渲染脚本) && (模块标签 === "script") && (模块类型 === "module")) {
					await this.#脚本({ 元素, 模块地址 });
				} else if (模块地址) {
					await this.#替换({ 元素, 模块地址, 模块标签 });
				}
			} catch (错误) {
				if (this.#配置.要前端报错) {
					const 模板 = 元素.ownerDocument.createElement("template");
					模板.innerHTML = this.#配置.前端报错模板(错误.message);
					元素.before(模板.content);
					this.#错误集.push(错误);
				} else throw 错误;
			}
		}
		return 文档范围;
	}
	/** @param {{元素: Element, 模块地址:string|null}} 资料  */
	async #脚本({ 元素, 模块地址 }) {
		const 模块内容 = 模块地址 ? 断定模块类型(await this.#配置.定位(模块地址), "text/javascript").内容 : 元素.innerHTML;
		const 脚本 = 模块内容;
		await importString(脚本, {
			parameters: {
				document: 元素.getRootNode(),
				Zhan: this.#配置.脚本工具箱,
				dynamicImport,
			},
		});
	}
	/** @param {{元素: Element, 模块地址:string, 模块标签:string}} 资料  */
	async #替换({ 元素, 模块地址, 模块标签 }) {
		const 保留祖元素 = 模块标签 !== "slot";
		const 插入元素 = await this.#填充({ 祖元素: 元素, 模块地址 });
		if (保留祖元素) {
			元素.append(插入元素);
			元素.removeAttribute(`${this.#配置.关键字}:src`);
		} else if (typeof 插入元素 === "string" || 插入元素.nodeName === "#document-fragment") {
			元素.replaceWith(插入元素);
		} else {
			元素.ownerDocument.documentElement.replaceWith(/** @type Document */ (插入元素).documentElement);
		}
	}
	/** @param {{祖元素: Element, 模块地址:string}} 资料  */
	async #填充({ 祖元素, 模块地址 }) {
		const 替换结果 = await this.#读取(模块地址);
		if (!替换结果) throw new Error(`${模块地址} 读取不到模块`);
		if (typeof 替换结果 === "string") return 替换结果;
		const 嗣元素 = (this.#剩余迭代次数 > 0) ? (--this.#剩余迭代次数, await this.#一环(替换结果)) : 替换结果;
		const 复制内容 = /** @type {片段} */ (嗣元素.cloneNode(true));
		this.#运行时缓存.set(模块地址, 复制内容);
		if (祖元素.tagName.toLowerCase() !== "template" && 祖元素.getAttribute("shadowrootmode") !== "open") {
			for (const 坑 of 嗣元素.querySelectorAll(`slot`)) {
				const 插槽名称 = 坑.getAttribute(`name`);
				const 萝卜 = 找萝卜(祖元素, 插槽名称);
				if (萝卜) 坑.replaceWith(萝卜);
				else 坑.replaceWith(...坑.childNodes);
			}
		}
		return 嗣元素;
	}
}
const 编纂中 = Symbol();
/** @typedef {Document| DocumentFragment } 片段 */
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
