
import storage, { addCache, getCache, delCache, getToken, setToken, delToken } from '@/providers/storage';
import { getWxCode, refreshSelfInfo, wxCodeLogin } from '@/providers/index';
import { logout, getInfo } from '@/app/api/login';
import wsUtil from '@/providers/utilities/wsUtil';
import StoreConfigs from '@/app/app.store.config';
import AppConfig from '@/app/app.constant';

const default_user = {
	id:'', openId:'', unionId:'', user_id:'', orgId:'',
	name:'', username:'', nickName:'', avatar:'', birthday:'', sex:'', telephone:'',
	address:'', idcard:'', job:'', admin:'', motto:'', nation:'',
	nativePlace:'', password:'', role:'', roles:'', status:'',
	isLogined: false, access_token:'', expiredTime:'', expired_in:'',
}

const user = {
	state: {
		phoneType: 0,
		wxRegisterParams: { code: '', phoneCode: '', scene: '' },
		currentUser: null, currentDoctor: null,
		socket: null, token: getToken(),
		userType: storage.get(StoreConfigs.cacheKeys.type),
	},
	mutations: {
		savePhoneType(state, pt) { state.phoneType = pt; }, saveRegisterCodeParam(state, code) { state.wxRegisterParams.code = code; },
		updateCurrentUser(state, us) {
			state.currentUser = us
			if (us&&us.access_token) { setToken(us.access_token) }
			else { delToken() }
		},
		updateCurrentDoctor: (state, doctor) => {
			state.currentDoctor = doctor;
		},
		createSocket(state, uid) {
			if (state.socket != null && state.socket.is_open_socket) { return }
			const url = `${AppConfig.webSocketBaseUrl}/aiws?uid=${uid}`;
			/* state.socket = new wsUtil(url, 6) */
		},
		sendSocketMessage(state, msg) { state.socket?.send(msg) },
		SET_TOKEN: (state, token) => {
			state.token = token;
			if (token) { setToken(token); addCache(StoreConfigs.cacheKeys.token, token); }
			else { delToken(); delCache(StoreConfigs.cacheKeys.token); }
		},
	},
	actions: {
		updateCurrentUserAction(context) {
			/* 从缓存还原用户 */
			getCache(StoreConfigs.cacheKeys.currentUser).then((res) => {
				if (res.code === 200) { const us = res.data; console.log('用户缓存信息', us);
					if ((us.hasOwnProperty('isLogined')&&!us.isLogined) || !us.openId) {
						context.commit(StoreConfigs.vuex.userModule.mutations.updateCurrentUser, null);
						return;
					}
					if (us.access_token) { setToken(us.access_token) };
					context.commit(StoreConfigs.vuex.userModule.mutations.updateCurrentUser, { ...us, isLogined: true });
					if (us.id || us.user_id) context.commit(StoreConfigs.vuex.userModule.mutations.createSocket, us.id || us.user_id);
					attemptLoginUser(context, us)
				}
			});
		},
		/* 退出系统 */
		LogOut({ state }) {
			return new Promise((resolve) => {
				logout(state.token).then(() => {
					delCache(StoreConfigs.cacheKeys.currentUser);
					delToken(); storage.clean(); resolve({ code: 200, massage: '' });
				}).catch((error) => { resolve( { code: 500, massage: error }) })
			})
		},
	}
}

export default user;

/**
 * 尝试登录用户
 * @param ctx
 * @param us
 * @returns
 */
const attemptLoginUser = (ctx, us) => {
	console.log('用户不存在，微信端获取code进行登录:');
	// #ifdef MP-WEIXIN
	getWxCode().then((res) => {
		if (res.code !== 200) {
			console.log('微信登录获取code失败：', res);
			ctx.commit(StoreConfigs.vuex.userModule.mutations.updateCurrentUser, null);
			return;
		}
		console.log('微信登录获取code：', res);
		// wxCodeLogin(res.wxcode, false)		
		refreshSelfInfo()
	});
	// #endif
};