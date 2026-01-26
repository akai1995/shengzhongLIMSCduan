// import hljs from '@/static/temp/js/highlight.min.js'; // https://highlightjs.org/
// import MarkdownIt from '@/static/temp/js/markdown-it.min.js';
// // 还使用了以下插件
// import MarkdownItSub from '@/static/temp/js/markdown-it-sub.min.js';
// import MarkdownItSup from '@/static/temp/js/markdown-it-sup.min.js';
// import MarkdownItFootnote from '@/static/temp/js/markdown-it-footnote.min.js';
// import MarkdownItDeflist from '@/static/temp/js/markdown-it-deflist.min.js';
// import MarkdownItAbbr from '@/static/temp/js/markdown-it-abbr.min.js';
// import MarkdownItIns from '@/static/temp/js/markdown-it-ins.min.js';
// import MarkdownItMark from '@/static/temp/js/markdown-it-mark.min.js';
// import MarkdownItContainer from '@/static/temp/js/markdown-it-container.min.js';
// import MarkdownItAnchor from '@/static/temp/js/markdown-it-anchor.min.js';
// import MarkdownItToc from '@/static/temp/js/markdown-it-toc.js';
// import MarkdownItAttrs from '@/static/temp/js/markdown-it-attrs.min.js';
// import MarkdownItCheckbox from '@/static/temp/js/markdown-it-checkbox.min.js';

// import AppConfig from '@/app/app.constant'
// const $staticPath = AppConfig.staticPath

import hljs from 'highlight.js'; // https://highlightjs.org/
import MarkdownIt from 'markdown-it';
// 还使用了以下插件
import MarkdownItSub from 'markdown-it-sub';
import MarkdownItSup from 'markdown-it-sup';
import MarkdownItFootnote from 'markdown-it-footnote';
import MarkdownItDeflist from 'markdown-it-deflist';
import MarkdownItAbbr from 'markdown-it-abbr';
import MarkdownItIns from 'markdown-it-ins';
import MarkdownItMark from 'markdown-it-mark';
import MarkdownItContainer from 'markdown-it-container';
import MarkdownItAnchor from 'markdown-it-anchor';
import MarkdownItToc from 'markdown-it-toc';
import MarkdownItAttrs from 'markdown-it-attrs';
import MarkdownItCheckbox from 'markdown-it-checkbox';

import { guid } from '@/providers/index'

/**
 *
 */
export const md = new MarkdownIt({
	html: true, linkify: true,
	typographer: true,
	highlight: (str, lang) => {
		// 当前时间加随机数生成唯一的id标识
		const codeId = guid();
		// 复制功能主要使用的是 clipboard.js
		let html = ``;
		if (str.indexOf('yingpe-System') > -1) {
			html = '';
		} else {
			html = `<button style="margin-buttom:10px" class="copy-btn" type="button" onclick='window.copyCode("code-id-${codeId}")'>复制</button>`;
		}
		const linesLength = str.split(/\n/).length - 1;
		// 生成行号
		let linesNum = '<span aria-hidden="true" class="line-numbers-rows">';
		for (let index = 0; index < linesLength; index++) {
			linesNum = linesNum + '<span></span>';
		}
		linesNum += '</span>';
		if (lang && hljs.getLanguage(lang)) {
			try {
				// highlight.js 高亮代码
				if (linesLength) {
					html += '<b class="name">' + lang + '</b>';
				}
				const preCode = hljs.highlight(lang, str, true).value;
				html = html + preCode;
				// 将代码包裹在 textarea 中
				return `<pre class="hljs"><code id="code-id-${codeId}" class="language-${lang}">${html}</code>${linesNum}</pre><textarea style="padding:4px 8px;position: absolute;top: -9999px;left: -9999px;z-index: -9999;" id="copy-${codeId}">${str.replace(/<\/textarea>/g, '&lt;/textarea>')}</textarea>`;
			} catch (error) {
				console.log(error);
			}
		}

		const preCode = md.utils ? md.utils.escapeHtml(str) : '';
		html = html + preCode;
		// 将代码包裹在 textarea 中
		return `<pre class="hljs"><code id="code-id-${codeId}" class="language-${lang}">${html}</code>${linesNum}</pre><textarea style="position: absolute;top: -9999px;left: -9999px;z-index: -9999;" id="copy${codeId}">${str.replace(/<\/textarea>/g, '&lt;/textarea>')}</textarea>`;

		// const linesLength = str.split(/\n/).length - 1;
		// // 假设 html 已经被定义
		// let linesNum = '<span aria-hidden="true" class="line-numbers-rows">';
		// for (let index = 0; index < linesLength; index++) {
		// 	linesNum += '<span></span>';
		// }
		// linesNum += '</span>';
		// if (lang && hljs.getLanguage(lang)) {
		// 	try {
		// 		// highlight.js 高亮代码
		// 		if (linesLength) {
		// 			html += '<b class="name">' + lang + '</b>';
		// 		}
		// 		// 创建一个新的 DOM 元素来存储高亮的代码
		// 		const codeElement = document.createElement('code');
		// 		codeElement.className = `language-${lang}`;
		// 		codeElement.textContent = str;
		// 		// 使用 hljs.highlightElement 方法高亮代码
		// 		hljs.highlightElement(codeElement);
		// 		// 将高亮后的代码添加到 html 中
		// 		html += codeElement.outerHTML;
		// 		// 将代码包裹在 textarea 中以便复制
		// 		return `<pre class="hljs"><code id="code-id-${codeId}" class="language-${lang}">${html}</code>${linesNum}</pre<textarea style="padding:4px 8px;position: absolute;top: -9999px;left: -9999px;z-index: -9999;" id="copy-${codeId}">${str.replace(/<\/textarea>/g, '&lt;/textarea>')}</textarea>`;
		// 	} catch (error) {
		// 		console.log(error);
		// 	}
		// } else {
		// 	// 如果没有对应的语言或者 highlight.js 不支持该语言，使用 md.utils.escapeHtml 转义代码字符串
		// 	const preCode = md.utils.escapeHtml(str);
		// 	html += preCode;
		// }
		// // 将代码包裹在 textarea 中
		// return `<pre class="hljs"><code id="code-id-${codeId}" class="language-${lang}">${html}</code>${linesNum}</pre><textarea style="position: absolute;top: -9999px;left: -9999px;z-index: -9999;" id="copy${codeId}">${str.replace(/<\/textarea>/g, '&lt;/textarea>')}</textarea>`;
	}
});

/**
 *
 * @param md
 * @returns
 */
export const initMd = (md) => {
	md.use(MarkdownItAbbr);
	md.use(MarkdownItDeflist);
	md.use(MarkdownItFootnote);
	md.use(MarkdownItSub);
	md.use(MarkdownItSup);
	md.use(MarkdownItIns);
	md.use(MarkdownItMark);
	md.use(MarkdownItContainer);
	md.use(MarkdownItAnchor);
	md.use(MarkdownItAttrs);
	md.use(MarkdownItToc);
	md.use(MarkdownItCheckbox);

	md.inline.ruler.after('emphasis', 'test_inline', (state) => {
		const findL = '{{';
		const findR = '}}';
		const posStart = state.pos; // 起点
		const posAvailable = () => state.pos < state.posMax;
		const posRecovery = () => (state.pos = posStart);
		const srcPos = (length) => state.src.slice(state.pos, state.pos + (length || state.posMax));

		if (findL === srcPos(findL.length)) {
			let found = false;
			state.pos += findL.length;
			while (posAvailable()) {
				if (findR === srcPos(findR.length)) {
					found = true;
					state.pos += findR.length;
					break;
				}
				state.pos += 1;
			}
			posRecovery();
			return false;
		}
		return false;
	});
	return md;
};

/**
 *
 * @param options
 * @param content
 * @param key
 * @param millisecond
 * @returns
 */
export const mdRenderHtml = (content, useMarkdown) => {
	try {
		// const useMarkdown = initMd(md);
		return useMarkdown.render(content);
	} catch (e) {
		console.log(e);
		return '';
	}
};
