import constant from '@/app/app.constant'

// #ifdef MP-WEIXIN
const accountInfo = wx.getAccountInfoSync();
var envWx = accountInfo.miniProgram.envVersion;
// #endif
// #ifdef H5
var envWx = 'release';
// #endif
console.log(envWx)
// 应用全局配置
let baseUrl = 'http://eai.natapp1.cc/eai-lims';
let wsUrl = '';
// #ifdef MP-WEIXIN
if (envWx === 'develop') { /** 开发 */
	// baseUrl = 'https://genepiapi.ypzlfx.com/test-api' */
	// baseUrl = 'http://192.168.112.29:9083/eai-lims'
	wsUrl = 'ws://192.168.0.154:5200'
} else if (envWx === 'release') { /** 生产 */
	baseUrl = 'http://eai.natapp1.cc/eai-lims';
	wsUrl = 'wss://api.ypzlfx.com/prod-api';
} else {
	baseUrl = 'http://eai.natapp1.cc/eai-lims';
	wsUrl = 'wss://genepiapi.ypzlfx.com/prod-api';
}
// #endif


// 使用ES模块语法导出配置
export default {
	envWx, baseUrl, wsUrl,
	// 应用信息
	appInfo: constant.appInfo
}
