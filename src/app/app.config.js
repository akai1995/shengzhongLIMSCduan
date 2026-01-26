import AppConfig from '@/app/app.constant'

// 使用ES模块语法导出配置
export default {
	envWx: AppConfig.envWx,
	baseUrl: AppConfig.baseUrl,
	wsUrl: AppConfig.wsUrl,
	/* 应用信息 */
	appInfo: AppConfig.appInfo,
}
