/**
 * @param {({[index in "outerHTML"|"nodeValue"]?:string|null})[]} 节点
 */
export function 做超文本(节点) {
	return 节点.map(
		(node) =>
			(node.outerHTML ?? node.nodeValue ?? "")
				.trim(),
	).join("")
		.replace(/\s+/g, " ");
}

/**
 * @param {import("./簇.ts").建站模块} 模块
 * @returns {DocumentFragment}
 */
export function 做片段(模块) {
	const 原稿 = 模块.内容;
	const 隔离原稿 = `<template>${原稿}</template>`;
	const 文档 = (new DOMParser()).parseFromString(隔离原稿, "text/html");
	const 模板元素 = 文档.querySelector("template");
	if (!模板元素) throw new Error(`无法解析模块内容`);
	return 模板元素.content;
}

/**
 * @template {import("./簇.ts").建站模块["媒体类型"]} T
 * @param {import("./簇.ts").建站模块} 模块
 * @param {T} 期待媒体类型
 */
export function 断定模块类型(模块, 期待媒体类型) {
	if (模块.媒体类型 !== 期待媒体类型) throw new Error(`${模块.谓} 媒体类型不是 ${期待媒体类型}`);
	return /** @type {Extract<import("./簇.ts").建站模块, {媒体类型: T}>} */ (模块);
}
