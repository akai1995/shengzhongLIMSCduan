
// #ifdef MP-WEIXIN
const accountInfo = wx.getAccountInfoSync();
var envWx = accountInfo.miniProgram.envVersion;
// #endif
// #ifdef H5
var envWx = 'release';
// #endif
console.log(envWx)
// 应用全局配置
let baseUrl = 'http://192.168.0.151:9083/eai-lims';
let wsUrl = '';
if (envWx === 'develop') {
	//开发
	// baseUrl = 'https://genepiapi.ypzlfx.com/test-api'
	/* baseUrl = 'https://genepiapi.ypzlfx.com/test-api' */
	baseUrl = 'http://192.168.0.151:9083/eai-lims'
	 wsUrl = 'ws://192.168.0.154:5200' 
	// baseUrl = 'https://device.ypzlfx.com/klg-lims';
	// wsUrl = 'wss://api.ypzlfx.com/prod-api';
} else if (envWx === 'release') {
	//生产
	baseUrl = 'https://eai.ypzlfx.com/eai-lims';
	wsUrl = 'wss://api.ypzlfx.com/prod-api';
} else {
	baseUrl = 'https://genepiapi.ypzlfx.com/test-api';
	wsUrl = 'wss://genepiapi.ypzlfx.com/prod-api';
}
// 使用ES模块语法导出配置
export default {
	envWx,
	// baseUrl: 'https://vue.ruoyi.vip/prod-api',
	baseUrl,
	wsUrl,
	// 应用信息
	appInfo: {
		// 应用名称
		name: 'eAI',
		// 应用版本
		version: '2.26.0116',
		// 应用logo
		logo: '/static/logo.png',
		// 官方网站
		site_url: 'http://ruoyi.vip',
		// 政策协议
		agreements: [
			{
				title: '隐私政策',
				url: 'https://ruoyi.vip/protocol.html',
			},
			{
				title: '用户服务协议',
				url: 'https://ruoyi.vip/protocol.html',
			}
		]
	}
}
