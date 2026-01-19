import service from '@/app/app.http';

// 查询家庭成员数量
export function getRelationCount() {
	return service.get({ url: '/personalcenter/userRelationship/getRelationCount' });
}

// 编辑个人资料
export function updateUserInfo(data) {
	return service.post({ url: '/personalcenter/userInformation/updateUserInfo', data });
}

// 查询家庭成员列表
export function getFamilyListByUserId(userId) {
	return service.get({ url: '/personalcenter/userRelationship/userRelationshipList/' + userId });
}

// 添加家庭成员信息
export function addFamilyMember(data, userId) {
	return service.post({ url: '/personalcenter/userRelationship/addUserRelationship/' + userId, data });
}

// 删除家庭成员信息
export function deleteFamily(id) {
	return service.get({ url: '/personalcenter/userRelationship/removeUserRelationship/' + id });
}

//id查询收藏列表
export function getCollectList(userId, title) {
	return service.get({ url: '/generalcontent/newscollect/list', params: { userId, title } });
}
//取消收藏
export function getEditList(userId, newsId) {
	return service.get({ url: '/generalcontent/newscollect/edit', params: { userId, newsId } });
}

//报告解读统计
export function getExportList(userId) {
	return service.get({ url: '/hospitalrelated/reportAnalysisApply/countId', params: { userId } });
}

//查询反馈
export function getFeedbackList(userId, status) {
	return service.get({ url: '/personalcenter/feedback/list', params: { userId, status } });
}

//添加反馈
export function addFeedback(feedback) {
	return service.post({ url: '/personalcenter/feedback/add', data: feedback });
}

//查看feedback详情
export function getFeedbackDetail(id) {
	return service.get({ url: '/personalcenter/feedback/getDetail/' + id });
}

//健康档案信息
export function getUserHealthList(id) {
	return service.get({ url: '/personalcenter/userRelationship/userHealthList/' + id });
}

//健康档案_用户信息
export function getUserRelationship(id) {
	return service.get({ url: '/personalcenter/userRelationship/getUser/' + id });
}

//健康档案_患者信息
export function getRelation(id) {
	return service.get({ url: '/personalcenter/userRelationship/getRelation/' + id });
}

//患者信息新增
export function pcrInformationAdd(data) {
	return service.post({ url: '/hospitalrelated/pcrInformation/add', data: data });
}
//获取用户信息
export function getInfoByToken() {
	return service.get({ url: '/third/user/getInfoByToken' });
}

//检测数量
export function getDetectionNum() {
	return service.get({ url: '/hospitalrelated/reportInformation/getDetectionNum' });
}

//报告解读数量
export function getAnalysisCount() {
	return service.get({ url: '/hospitalrelated/reportAnalysisApply/getAnalysisCount' });
}
