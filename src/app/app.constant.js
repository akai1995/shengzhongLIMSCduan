// #ifdef H5
var envWx = 'release';
// #endif
var baseUrl = 'http://192.168.0.151:9083/eai-lims';
var wsUrl = 'wss://api.ypzlfx.com/prod-api';
var filePath = '192.168.0.151:9889';
// #ifdef MP-WEIXIN
try {
//   const systemInfo = uni.getSystemInfoSync();
//   console.log('systemInfo：', systemInfo); // getSystemInfoSync
//   console.log('systemInfo：', systemInfo.model); // 手机型号
//   console.log('systemInfo：', systemInfo.system); // 操作系统版本
//   console.log('systemInfo：', systemInfo.platform); // 客户端平台
} catch (err) {
//   console.error(err);
}
const { miniProgram } = uni.getAccountInfoSync();
// console.log('miniProgram：', miniProgram);
const { appId, envVersion, version } = miniProgram;
// console.log('miniProgram：', { appId, envVersion, version });
const envWx = envVersion;

// console.log(envWx)
if (envWx === 'develop') { /* 开发 */
	// baseUrl = 'http://192.168.112.29:9083/eai-lims';
	// wsUrl = 'ws://192.168.0.154:5200';
	/* filePath = '192.168.112.29:9083' */
} 
else if (envWx === 'release') { /* 生产 */
	baseUrl = 'http://eai.natapp1.cc/eai-lims';
	wsUrl = 'wss://api.ypzlfx.com/prod-api';
	filePath = '192.168.0.151:9889';
} 
else {
	baseUrl = 'http://eai.natapp1.cc/eai-lims';
	wsUrl = 'wss://genepiapi.ypzlfx.com/prod-api';
	filePath = '192.168.0.151:9889';
}
// #endif

export default {
	envWx, baseUrl, wsUrl, currentPages: getCurrentPages(),
	leftIcon: getCurrentPages().length > 1 ? 'home' : uni.$u.props.navbar.leftIcon,
	onlineFilePath: `http://${filePath}/eai-lims/sys/common/static/`,
	staticPath: 'https://genepiapi.ypzlfx.com/file/eai/temp/',
	AES_KEY:'yinpecloudgenepi', IV: 'yinpecloudgenepi',
	publicKey:'yinpecloudgenepi', privateKey: 'yinpecloudgenepi',
	/* 高德key，请不要使用本人的这个key用于生产环境 */
	GAODE_KEY: '48e30049122fc8432b1c5bf43e86d398',
	/* 发送语音时探测录音的音量阈值 0-100 */ VOICE_THRESHOLD: 6,
	/* 最小录音时长阈值 */ minSpeechDurationThreshold: 1500,
	/* 录音文件类型 */ audioType: 'wav',
	/* 录音采样率 */ audioSampleRate: 48000,
	/* 录音比特率 */ audioBitRate: 16,
	/* 音频流发送时间间隔 */ audioSendServerInterval: 300,
	/* 语音实时发送 */ useRealTimeSend: true,
	/* wss:// */ webSocketBaseUrl: wsUrl,
	/* 应用信息 */
	appInfo: {
		/* 应用名称 */ name: 'E-AI',
		/* 应用版本 */ version: '2.26.0122',
		/* 应用logo */ logo: '/static/logo.png',
		/* 官方网站 */ site_url: 'http://ruoyi.vip',
		/* 政策协议 */
		agreements: [
			{ title: '隐私政策', url: 'https://ruoyi.vip/protocol.html'	},
			{ title: '用户服务协议', url: 'https://ruoyi.vip/protocol.html'	}
		]
	}
 }