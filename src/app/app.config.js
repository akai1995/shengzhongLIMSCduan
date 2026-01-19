
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
// #ifdef MP-WEIXIN
if (envWx === 'develop') { /** 开发 */
	// baseUrl = 'https://genepiapi.ypzlfx.com/test-api' */
	baseUrl = 'http://192.168.0.151:9083/eai-lims'
	wsUrl = 'ws://192.168.0.154:5200'
} else if (envWx === 'release') { /** 生产 */
	baseUrl = 'https://eai.ypzlfx.com/eai-lims';
	wsUrl = 'wss://api.ypzlfx.com/prod-api';
} else {
	baseUrl = 'https://genepiapi.ypzlfx.com/test-api';
	wsUrl = 'wss://genepiapi.ypzlfx.com/prod-api';
}
// #endif

import constant from '@/app/app.constant'

// 使用ES模块语法导出配置
export default {
	envWx, baseUrl, wsUrl,
	// 应用信息
	appInfo: constant.appInfo
}
