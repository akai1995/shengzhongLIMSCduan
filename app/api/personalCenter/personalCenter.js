import upload from "@/providers/utilities/upload";
import request from "@/providers/request";

// 查询家庭成员数量
export function getRelationCount() {
	return request({
		url: "/personalcenter/userRelationship/getRelationCount",
		method: "get",
	});
}

// 编辑个人资料
export function updateUserInfo(userInformation) {
	return request({
		url: "/personalcenter/userInformation/updateUserInfo",
		method: "post",
		data: userInformation,
	});
}

// 查询家庭成员列表
export function getFamilyListByUserId(userId) {
	return request({
		url: "/personalcenter/userRelationship/userRelationshipList/" + userId,
		method: "get",
	});
}

// 添加家庭成员信息
export function addFamilyMember(userRelationship, userId) {
	return request({
		url: "/personalcenter/userRelationship/addUserRelationship/" + userId,
		method: "post",
		data: userRelationship,
	});
}

// 删除家庭成员信息
export function deleteFamily(id) {
	return request({
		url: "/personalcenter/userRelationship/removeUserRelationship/" + id,
		method: "get",
	});
}

//id查询收藏列表
export function getCollectList(userId, title) {
	return request({
		url: "/generalcontent/newscollect/list",
		method: "get",
		params: { userId, title },
	});
}
//取消收藏
export function getEditList(userId, newsId) {
	return request({
		url: "/generalcontent/newscollect/edit",
		method: "get",
		params: { userId, newsId },
	});
}

//报告解读统计
export function getExportList(userId) {
	return request({
		url: "/hospitalrelated/reportAnalysisApply/countId",
		method: "get",
		params: { userId },
	});
}

//查询反馈
export function getFeedbackList(userId, status) {
	return request({
		url: "/personalcenter/feedback/list",
		method: "get",
		params: { userId, status },
	});
}

//添加反馈
export function addFeedback(feedback) {
	return request({
		url: "/personalcenter/feedback/add",
		method: "post",
		data: feedback,
	});
}

//查看feedback详情
export function getFeedbackDetail(id) {
	return request({
		url: "/personalcenter/feedback/getDetail/" + id,
		method: "get",
	});
}

//健康档案信息
export function getUserHealthList(id) {
	return request({
		url: "/personalcenter/userRelationship/userHealthList/" + id,
		method: "get",
	});
}

//健康档案_用户信息
export function getUserRelationship(id) {
	return request({
		url: "/personalcenter/userRelationship/getUser/" + id,
		method: "get",
	});
}

//健康档案_患者信息
export function getRelation(id) {
	return request({
		url: "/personalcenter/userRelationship/getRelation/" + id,
		method: "get",
	});
}

//患者信息新增
export function pcrInformationAdd(data) {
	return request({
		url: "/hospitalrelated/pcrInformation/add",
		method: "post",
		data: data,
	});
}
//获取用户信息
export function getInfoByToken() {
	return request({
		url: "/third/user/getInfoByToken",
		method: "get",
	});
}

//检测数量
export function getDetectionNum() {
	return request({
		url: "/hospitalrelated/reportInformation/getDetectionNum",
		method: "get",
	});
}

//报告解读数量
export function getAnalysisCount() {
	return request({
		url: "/hospitalrelated/reportAnalysisApply/getAnalysisCount",
		method: "get",
	});
}
