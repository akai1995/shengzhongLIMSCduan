import hljs from 'highlight.js'; import MarkdownIt from 'markdown-it';
// 还使用了以下插件
import MarkdownItSub from 'markdown-it-sub'; import MarkdownItSup from 'markdown-it-sup'; import MarkdownItFootnote from 'markdown-it-footnote'; import MarkdownItDeflist from 'markdown-it-deflist'; import MarkdownItAbbr from 'markdown-it-abbr';
import MarkdownItIns from 'markdown-it-ins'; import MarkdownItMark from 'markdown-it-mark'; import MarkdownItContainer from 'markdown-it-container'; import MarkdownItAnchor from 'markdown-it-anchor'; import MarkdownItToc from 'markdown-it-toc';
import MarkdownItAttrs from 'markdown-it-attrs'; import MarkdownItCheckbox from 'markdown-it-checkbox'; import { guid } from '@/providers/index'
export const md = new MarkdownIt({
	html: true, linkify: true, typographer: true,
	highlight: (str, lang) => {
		const codeId = guid(); let html = ``; if (str.indexOf('yingpe-System') > -1) { html = ''; } else { html = `<button style="margin-buttom:10px" class="copy-btn" type="button" onclick='window.copyCode("code-id-${codeId}")'>复制</button>`; }; const linesLength = str.split(/\n/).length - 1; let linesNum = '<span aria-hidden="true" class="line-numbers-rows">'; for (let index = 0; index < linesLength; index++) { linesNum = linesNum + '<span></span>'; }; linesNum += '</span>';
		if (lang && hljs.getLanguage(lang)) {
			try {
				if (linesLength) { html += '<b class="name">' + lang + '</b>'; }; const preCode = hljs.highlight(lang, str, true).value; html = html + preCode;
				return `<pre class="hljs"><code id="code-id-${codeId}" class="language-${lang}">${html}</code>${linesNum}</pre><textarea style="padding:4px 8px;position: absolute;top: -9999px;left: -9999px;z-index: -9999;" id="copy-${codeId}">${str.replace(/<\/textarea>/g, '&lt;/textarea>')}</textarea>`;
			} catch (error) { console.log(error); }
		}

		const preCode = md.utils ? md.utils.escapeHtml(str) : ''; html = html + preCode;
		return `<pre class="hljs"><code id="code-id-${codeId}" class="language-${lang}">${html}</code>${linesNum}</pre><textarea style="position: absolute;top: -9999px;left: -9999px;z-index: -9999;" id="copy${codeId}">${str.replace(/<\/textarea>/g, '&lt;/textarea>')}</textarea>`;

		// const linesLength = str.split(/\n/).length - 1; let linesNum = '<span aria-hidden="true" class="line-numbers-rows">'; for (let index = 0; index < linesLength; index++) { linesNum += '<span></span>'; }; linesNum += '</span>';
		// if (lang && hljs.getLanguage(lang)) {
		// 	try {
		// 		if (linesLength) { html += '<b class="name">' + lang + '</b>'; }; const codeElement = document.createElement('code'); codeElement.className = `language-${lang}`; codeElement.textContent = str; hljs.highlightElement(codeElement); html += codeElement.outerHTML;
		// 		return `<pre class="hljs"><code id="code-id-${codeId}" class="language-${lang}">${html}</code>${linesNum}</pre<textarea style="padding:4px 8px;position: absolute;top: -9999px;left: -9999px;z-index: -9999;" id="copy-${codeId}">${str.replace(/<\/textarea>/g, '&lt;/textarea>')}</textarea>`;
		// 	} catch (error) { console.log(error); }
		// } else { const preCode = md.utils.escapeHtml(str); html += preCode; }
		// return `<pre class="hljs"><code id="code-id-${codeId}" class="language-${lang}">${html}</code>${linesNum}</pre><textarea style="position: absolute;top: -9999px;left: -9999px;z-index: -9999;" id="copy${codeId}">${str.replace(/<\/textarea>/g, '&lt;/textarea>')}</textarea>`;
	}
});

export const initMd = (md) => {
	md.use(MarkdownItAbbr); md.use(MarkdownItDeflist); md.use(MarkdownItFootnote); md.use(MarkdownItSub); md.use(MarkdownItSup); md.use(MarkdownItIns); md.use(MarkdownItMark); md.use(MarkdownItContainer); md.use(MarkdownItAnchor); md.use(MarkdownItAttrs); md.use(MarkdownItToc); md.use(MarkdownItCheckbox);
	md.inline.ruler.after('emphasis', 'test_inline', (state) => {
		const findL = '{{'; const findR = '}}'; const posStart = state.pos; const posAvailable = () => state.pos < state.posMax; const posRecovery = () => (state.pos = posStart); const srcPos = (length) => state.src.slice(state.pos, state.pos + (length || state.posMax));
		if (findL === srcPos(findL.length)) { let found = false; state.pos += findL.length; while (posAvailable()) { if (findR === srcPos(findR.length)) { found = true; state.pos += findR.length; break; }; state.pos += 1; } posRecovery(); return false; }
		return false;
	});
	return md;
};

export const mdRenderHtml = (content, useMarkdown) => { try { /* const useMarkdown = initMd(md); */ return useMarkdown.render(content); } catch (e) { console.log(e); return ''; } };
