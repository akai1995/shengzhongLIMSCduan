import request from "@/utils/request";

export function getSignFileList(queryParameter) {
	return request({
		url: "/appDevice/storageInstrumentReserve/getSignList",
		method: "get",
		params: queryParameter,
	});
}


export function appSignDataSubmit(data) {
	return request({
		url: "/appDevice/storageInstrumentReserve/appSignDataSubmit",
		method: "post",
		data: data,
	});
}


