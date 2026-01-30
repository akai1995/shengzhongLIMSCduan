//vue.config.js
const TransformPages = require('uni-read-pages')
const {webpack} = new TransformPages()

module.exports = {
  css: { 
    loaderOptions: 
    { 
      scss: 
      { 
        prependData: `@import "@/uni.scss"; @import '@/uni_modules/uview-ui/theme.scss'; @import '@/static/styles/mixins.scss';`, 
        sassOptions: { 
          // 完全静默所有警告 
          logger: { 
            warn: () => {}, 
            debug: () => {} 
          } 
        } 
      } 
    }
  },
  productionSourceMap: false,
  transpileDependencies: [
    'uni-simple-router','z-paging','github-markdown-css', 'highlight.js','markdown-it',
    'markdown-it-abbr','markdown-it-anchor','markdown-it-attrs','markdown-it-checkbox',
    'markdown-it-container','markdown-it-deflist','markdown-it-footnote',
    'markdown-it-ins','markdown-it-mark','markdown-it-sub','markdown-it-sup','markdown-it-toc',
    'vconsole'
  ],
  chainWebpack: (config) => {
    // 发行或运行时启用了压缩时会生效
    config.optimization.minimizer('terser').tap((args) => {
      const compress = args[0].terserOptions.compress
      // 非 App 平台移除 console 代码(包含所有 console 方法，如 log,debug,info...)
      // compress.drop_console = true
      compress.pure_funcs = [
        // '__f__', // App 平台 vue 移除日志代码
        // 'console.debug' // 可移除指定的 console 方法
        'console.warn' // 可移除指定的 console 方法
      ]
      return args;
    });
  },
	configureWebpack: {
		plugins: [
			new webpack.DefinePlugin({
				ROUTES: webpack.DefinePlugin.runtimeValue(() => {
					const tfPages = new TransformPages({
						includes: ['path', 'name', 'aliasPath']
					});
					return JSON.stringify(tfPages.routes)
				}, true )
			})
		]
	}
}
