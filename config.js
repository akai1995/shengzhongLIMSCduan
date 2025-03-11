const accountInfo = wx.getAccountInfoSync();
export let envWx = accountInfo.miniProgram.envVersion;
// console.log(envWx)
// 应用全局配置
envWx = "release";
let baseUrl = "https://device.ypzlfx.com/klg-lims";
let wsUrl = "";
if (envWx === "develop") {
	//开发
	// baseUrl = 'https://genepiapi.ypzlfx.com/test-api'
	/* baseUrl = 'https://genepiapi.ypzlfx.com/test-api' */
	baseUrl = 'http://192.168.0.35:9082/klg-lims'
	 wsUrl = 'ws://192.168.0.154:5200' 
	// baseUrl = "https://device.ypzlfx.com/klg-lims";
	// wsUrl = "wss://api.ypzlfx.com/prod-api";
} else if (envWx === "release") {
	//生产
	baseUrl = "https://device.ypzlfx.com/klg-lims";
	wsUrl = "wss://api.ypzlfx.com/prod-api";
} else {
	baseUrl = "https://genepiapi.ypzlfx.com/test-api";
	wsUrl = "wss://genepiapi.ypzlfx.com/prod-api";
}
module.exports = {
	envWx,
	// baseUrl: 'https://vue.ruoyi.vip/prod-api',
	baseUrl,
	// baseUrl: 'http://192.168.110.33:9999',
	wsUrl,
	// 应用信息
	appInfo: {
		// 应用名称
		name: "ruoyi-app",
		// 应用版本
		version: "1.1.0",
		// 应用logo
		logo: "/static/logo.png",
		// 官方网站
		site_url: "http://ruoyi.vip",
		// 政策协议
		agreements: [
			{
				title: "隐私政策",
				url: "https://ruoyi.vip/protocol.html",
			},
			{
				title: "用户服务协议",
				url: "https://ruoyi.vip/protocol.html",
			},
		],
	},
};
