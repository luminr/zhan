export { 编纂超文本 } from "./编纂.js";

export type 配置 = {
	关键字?: string;
	定位: (谓: string) => Promise<建站模块>;
	前端报错模板?: (错误信息: string) => string;
	脚本工具箱?: Record<string | number | symbol, any>;
	替换迭代上限?: number;
	要前端报错?: boolean;
	要渲染脚本?: boolean;
	要包括头部?: boolean;
};

export type 建站模块 = 超文本模块 | 脚本模块 | 静态模块 | 标下模块;

export interface 模块基盘 {
	readonly 谓: string;
	readonly 内容: string;
}

export interface 超文本模块 extends 模块基盘 {
	readonly 媒体类型: "text/html";
}

export interface 脚本模块 extends 模块基盘 {
	readonly 媒体类型: "text/javascript";
}

export interface 静态模块 extends 模块基盘 {
	readonly 媒体类型: "text/css" | "application/json" | "image/svg+xml";
}

export interface 标下模块 extends 模块基盘 {
	readonly 媒体类型: "text/markdown";
}
