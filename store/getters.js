const getters = {
	token: state => state.user.token,
	orgId: state => state.user.orgId,
	avatar: state => state.user.avatar,
	name: state => state.user.name,
	roles: state => state.user.roles,
	permissions: state => state.user.permissions,
	idcard: state => state.user.idcard,
	userId: state => state.user.userid,
	sex: state => state.user.sex,
	dict: state => state.dict.dict,
	userType: state => state.user.userType,
}
export default getters