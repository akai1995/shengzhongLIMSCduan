import request from "@/utils/request";

export function getInfo() {
	return request({
		url: "/hospitalrelated/questionnaire/1797445758753525762",
		method: "get",
	});
}

export function check(params) {
	return request({
		url: `/hospitalrelated/carcinoma/${params.questionId}/${params.openId}`,
		method: "get",
	});
}

export function submitInfo(params) {
	return request({
		url: `/hospitalrelated/carcinoma`,
		method: "post",
		data: params,
	});
}


export function submitQuestion(params) {
	return request({
		url: `/hospitalrelated/carcinoma/answerRecord`,
		method: "post",
		data: params,
	});
}