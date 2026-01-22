// #ifdef MP-WEIXIN
const accountInfo = wx.getAccountInfoSync();
var envWx = accountInfo.miniProgram.envVersion;
// #endif
// #ifdef H5
var envWx = 'release';
// #endif
let filePath = '192.168.0.151:9889'
// #ifdef MP-WEIXIN
if (envWx === 'develop') { /* 开发 */
	// filePath = '192.168.112.29:9083'
} 
else if (envWx === 'release') { /* 生产 */
	filePath = '192.168.0.151:9889';
} 
else {
	filePath = '192.168.0.151:9889';
}
// #endif
console.log('envVersion', filePath);

export default {
   onlineFilePath: `http://${filePath}/eai-lims/sys/common/static/`,
   staticPath: 'https://genepiapi.ypzlfx.com/file/eai/temp/',
   AES_KEY:'yinpecloudgenepi', IV: 'yinpecloudgenepi',
   publicKey:'yinpecloudgenepi', privateKey: 'yinpecloudgenepi',
   // 高德key，请不要使用本人的这个key用于生产环境
   GAODE_KEY: '48e30049122fc8432b1c5bf43e86d398',
	// 应用信息
	appInfo: {
		// 应用名称
		name: 'e-AI',
		// 应用版本
		version: '2.26.0122',
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
	},
   vuex: {
      sex: 'vuex_sex',
      avatar: 'vuex_avatar',
      name: 'vuex_name',
      roles: 'vuex_roles',
      permissions: 'vuex_permissions',
      userId: 'vuex_userid',
      user: 'vuex_user',
      idcard: 'vuex_idcard',
      userType: 'vuex_type',
      orgid: 'vuex_orgid',
      tips: 'isTips',
      cancerUser: 'cancerUser',
      pickerLabel: 'pickerLabel',
   },
 }