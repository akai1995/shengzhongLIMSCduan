
import { getToken, setToken, removeToken, setStorageOrgId } from '@/providers/auth';
import { login, wxLogin, logout, getInfo, getWxInfo } from '@/app/api/login';
import { getInfoByToken } from '@/app/api/personalCenter/personalCenter';
import storage from '@/providers/utilities/storage';
import wsUtil from '@/providers/utilities/wsUtil';
import AppConfig from '@/app/app.constant';
import config from '@/app/app.config';

const baseUrl = config.baseUrl;

const user = {
	state: {
		orgId: storage.get(AppConfig.vuex.orgid),
		token: getToken(), sex: storage.get(AppConfig.vuex.sex),
		name: storage.get(AppConfig.vuex.name),
		avatar: storage.get(AppConfig.vuex.avatar),
		roles: storage.get(AppConfig.vuex.roles),
		permissions: storage.get(AppConfig.vuex.permissions),
		userid: storage.get(AppConfig.vuex.userId),
		idcard: storage.get(AppConfig.vuex.idcard),
		userType: storage.get(AppConfig.vuex.type),
		socket: null,
	},
	getters: {
		socket: (state) => {
			return state.socket;
		},
	},
	mutations: {
		createSocket(state, uid) {
			if (state.socket != null && state.socket.is_open_socket) return;
			const url = `${AppConfig.webSocketBaseUrl}/aiws?uid=${uid}`;
			state.socket = new wsUtil(url, 6);
		},
		sendSocketMessage(state, msg) {
			state.socket?.send(msg);
		},
		SET_TOKEN: (state, token) => {
			state.token = token;
		},
		SET_NAME: (state, name) => {
			state.name = name;
			storage.set(AppConfig.vuex.name, name);
		},
		SET_SEX: (state, sex) => {
			state.sex = sex;
			storage.set(AppConfig.vuex.sex, sex);
		},
		SET_AVATAR: (state, avatar) => {
			state.avatar = avatar;
			storage.set(AppConfig.vuex.avatar, avatar);
		},
		SET_ROLES: (state, roles) => {
			state.roles = roles;
			storage.set(AppConfig.vuex.roles, roles);
		},
		SET_PERMISSIONS: (state, permissions) => {
			state.permissions = permissions;
			storage.set(AppConfig.vuex.permissions, permissions);
		},
		SET_USER_ID: (state, id) => {
			state.userid = id;
			storage.set(AppConfig.vuex.userId, id);
		},
		SET_IDCARD: (state, idcard) => {
			state.idcard = idcard;
			storage.set(AppConfig.vuex.idcard, idcard);
		},
		SET_USER_TYPE: (state, type) => {
			state.userType = type;
			storage.set(AppConfig.vuex.userType, type);
		},
		SET_ORG_ID: (state, orgid) => {
			state.orgid = orgid;
			storage.set(AppConfig.vuex.orgid, orgid);
		},
	},

	actions: {
		// 微信登录
		WxLogin({ commit }, wxUserInfo) {
			const code = wxUserInfo.code;
			const phoneCode = wxUserInfo.phoneCode;
			return new Promise((resolve, reject) => {
				wxLogin(code, phoneCode)
					.then((res) => {
						setToken(res.data.access_token);
						commit('SET_TOKEN', res.data.access_token);
						commit('SET_USER_ID', res.data.user_id);
						getInfoByToken().then((res) => {
							setStorageOrgId(res.orgId);
							commit('SET_ORG_ID', res.orgId);
						});
						resolve();
					})
					.catch((error) => {
						reject(error);
					});
			});
		},

		// 登录
		Login({ commit }, userInfo) {
			const username = userInfo.username.trim();
			const password = userInfo.password;
			const code = userInfo.code;
			const uuid = userInfo.uuid;
			return new Promise((resolve, reject) => {
				login(username, password, code, uuid)
					.then((res) => {
						setToken(res.data.access_token);
						commit('SET_TOKEN', res.data.access_token);
						resolve();
					})
					.catch((error) => {
						reject(error);
					});
			});
		},

		// 获取用户信息
		GetInfo({ commit, state }) {
			return new Promise((resolve, reject) => {
				getInfo()
					.then((res) => {
						const user = res.user;
						const avatar =
							user == null || user.avatar == '' || user.avatar == null
								? `${this.$staticPath}imgs/default_head.png`
								: user.avatar;
						const username = user == null || user.userName == '' || user.userName == null ? '' : user.userName;
						if (res.roles && res.roles.length > 0) {
							commit('SET_ROLES', res.roles);
							commit('SET_PERMISSIONS', res.permissions);
						} else {
							commit('SET_ROLES', ['ROLE_DEFAULT']);
						}
						commit('SET_NAME', username);
						commit('SET_AVATAR', avatar);
						commit('SET_SEX', user.sex);
						commit('SET_ORG_ID', user.orgId);
						resolve(res);
					})
					.catch((error) => {
						reject(error);
					});
			});
		},

		//获取微信用户信息
		GetWxInfo({ commit }) {
			return new Promise((resolve, reject) => {
				getInfoByToken()
					.then((res) => {
						const user = res.user;
						const avatar =
							user == null || user.avatar == '' || user.avatar == null
								? `${this.$staticPath}imgs/default_head.png`
								: user.avatar;
						const username = user == null || user.username == '' || user.username == null ? '' : user.userName;
						const idcard = user == null || user.idcard == '' || user.idcard == null ? '' : user.idcard;
						const name = user == null || user.name == '' || user.name == null ? '' : user.name;
						if (res.roles && res.roles.length > 0) {
							commit('SET_ROLES', res.roles);
						} else {
							commit('SET_ROLES', ['ROLE_DEFAULT']);
						}
						commit('SET_NAME', name);
						commit('SET_SEX', user.sex);
						commit('SET_IDCARD', idcard);
						commit('SET_AVATAR', avatar);
						commit('SET_USER_TYPE', user.role);
						commit('SET_ORG_ID', user.orgId);
						resolve(res);
					})
					.catch((error) => {
						reject(error);
					});
			});
		},

		// 退出系统
		LogOut({ commit, state }) {
			return new Promise((resolve, reject) => {
				logout(state.token)
					.then(() => {
						commit('SET_TOKEN', '');
						commit('SET_ROLES', []);
						commit('SET_PERMISSIONS', []);
						removeToken();
						storage.clean();
						resolve();
					})
					.catch((error) => {
						reject(error);
					});
			});
		},
		WxLogOut({ commit, state }) {
			return new Promise((resolve, reject) => {
				logout(state.token)
					.then(() => {
						commit('SET_TOKEN', '');
						commit('SET_ROLES', []);
						commit('SET_PERMISSIONS', []);
						commit('SET_USER_ID', '');
						commit('SET_AVATAR', '');
						commit('SET_NAME', '');
						commit('SET_IDCARD', '');
						commit('SET_ORG_ID', '');
						removeToken();
						storage.clean();
						resolve();
					})
					.catch((error) => {
						reject(error);
					});
			});
		},
	},
};

export default user;
