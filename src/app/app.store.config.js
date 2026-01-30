const StoreConfigs = {
	/**
	 * 缓存键值
	 */
	cacheKeys: {
		cancerUser: 'app.eai.cancerUser',
		pickerLabel: 'app.eai.pickerLabel',
		currentUser: 'app.eai.currentUser',
        phoneType: 'app.eai.phoneType',
        wxRegisterParams: 'app.eai.wxRegisterParams',
		socket: 'app.eai.socket',
        token: 'app.eai.token',
        userType: 'app.eai.type',
        tips: 'app.eai.isTips',
	},

	/**
	 * vuex的mutations和actions
	 */
	vuex: {
		cancersModule: { mutations: { }, actions: { } },
		dictModule: { mutations: { }, actions: { } },
		equipmentModule: { mutations: { }, actions: { } },
		userModule: {
			mutations: {
				updateCurrentUser: 'updateCurrentUser',
				saveRegisterCodeParam: 'saveRegisterCodeParam',
				savePhoneType: 'savePhoneType',
				updateFirstLoginPageShowed: 'updateFirstLoginPageShowed',
				createSocket: 'createSocket',
				sendSocketMessage: 'sendSocketMessage',
			},
			actions: {
				updateCurrentUserAction: 'updateCurrentUserAction'
			}
		}
	}
}


export default StoreConfigs;