import config from "@/config";
import storage from "@/utils/storage";
import constant from "@/utils/constant";
import { login, wxLogin, logout, getInfo, getWxInfo } from "@/api/login";
import { getToken, setToken, removeToken, setStorageOrgId } from "@/utils/auth";
import { getInfoByToken } from "@/api/personalCenter/personalCenter";
const baseUrl = config.baseUrl;

const user = {
	state: {
		orgId: storage.get(constant.orgid),
		token: getToken(),
		sex: storage.get(constant.sex),
		name: storage.get(constant.name),
		avatar: storage.get(constant.avatar),
		roles: storage.get(constant.roles),
		permissions: storage.get(constant.permissions),
		userid: storage.get(constant.userId),
		idcard: storage.get(constant.idcard),
		userType: storage.get(constant.type),
		// orgid:storage.get(constant.orgid)
	},

	mutations: {
		SET_TOKEN: (state, token) => {
			state.token = token;
		},
		SET_NAME: (state, name) => {
			state.name = name;
			storage.set(constant.name, name);
		},
		SET_SEX: (state, sex) => {
			state.sex = sex;
			storage.set(constant.sex, sex);
		},
		SET_AVATAR: (state, avatar) => {
			state.avatar = avatar;
			storage.set(constant.avatar, avatar);
		},
		SET_ROLES: (state, roles) => {
			state.roles = roles;
			storage.set(constant.roles, roles);
		},
		SET_PERMISSIONS: (state, permissions) => {
			state.permissions = permissions;
			storage.set(constant.permissions, permissions);
		},
		SET_USER_ID: (state, id) => {
			state.userid = id;
			storage.set(constant.userId, id);
		},
		SET_IDCARD: (state, idcard) => {
			state.idcard = idcard;
			storage.set(constant.idcard, idcard);
		},
		SET_USER_TYPE: (state, type) => {
			state.userType = type;
			storage.set(constant.userType, type);
		},
		SET_ORG_ID: (state, orgid) => {
			state.orgid = orgid;
			storage.set(constant.orgid, orgid);
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
						commit("SET_TOKEN", res.data.access_token);
						commit("SET_USER_ID", res.data.user_id);
						getInfoByToken().then((res) => {
							setStorageOrgId(res.orgId);
							commit("SET_ORG_ID", res.orgId);
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
						commit("SET_TOKEN", res.data.access_token);
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
							user == null || user.avatar == "" || user.avatar == null
								? "https://genepiapi.ypzlfx.com/file/genepi/2023/07/20/OxbWNs6SoNLF1129151bdb41b25719e93409dc3a1f5b_20230720170831A016.jpg"
								: user.avatar;
						const username = user == null || user.userName == "" || user.userName == null ? "" : user.userName;
						if (res.roles && res.roles.length > 0) {
							commit("SET_ROLES", res.roles);
							commit("SET_PERMISSIONS", res.permissions);
						} else {
							commit("SET_ROLES", ["ROLE_DEFAULT"]);
						}
						commit("SET_NAME", username);
						commit("SET_AVATAR", avatar);
						commit("SET_SEX", user.sex);
						commit("SET_ORG_ID", user.orgId);
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
							user == null || user.avatar == "" || user.avatar == null
								? "https://genepiapi.ypzlfx.com/file/genepi/2023/07/20/OxbWNs6SoNLF1129151bdb41b25719e93409dc3a1f5b_20230720170831A016.jpg"
								: user.avatar;
						const username = user == null || user.username == "" || user.username == null ? "" : user.userName;
						const idcard = user == null || user.idcard == "" || user.idcard == null ? "" : user.idcard;
						const name = user == null || user.name == "" || user.name == null ? "" : user.name;
						if (res.roles && res.roles.length > 0) {
							commit("SET_ROLES", res.roles);
						} else {
							commit("SET_ROLES", ["ROLE_DEFAULT"]);
						}
						commit("SET_NAME", name);
						commit("SET_SEX", user.sex);
						commit("SET_IDCARD", idcard);
						commit("SET_AVATAR", avatar);
						commit("SET_USER_TYPE", user.role);
						commit("SET_ORG_ID", user.orgId);
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
						commit("SET_TOKEN", "");
						commit("SET_ROLES", []);
						commit("SET_PERMISSIONS", []);
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
						commit("SET_TOKEN", "");
						commit("SET_ROLES", []);
						commit("SET_PERMISSIONS", []);
						commit("SET_USER_ID", "");
						commit("SET_AVATAR", "");
						commit("SET_NAME", "");
						commit("SET_IDCARD", "");
						commit("SET_ORG_ID", "");
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
