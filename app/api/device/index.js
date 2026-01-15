import request from "@/providers/http";

export function getDeviceList(queryParameter) {
	return request({
		url: "/appDevice/storageInstrumentReserve/deviceList",
		method: "get",
		params: queryParameter,
	});
}

export function deviceSubmit(data) {
	return request({
		url: "/appDevice/storageInstrumentReserve/appDeviceReserveSubmit",
		method: "post",
		data: data,
	});
}

export function deviceDetail(id) {
	return request({
		url: "/appDevice/storageInstrumentReserve/deviceDetailById?instrumentId=" + id,
		method: "get",
	});
}

export function reserveDetail(id) {
	return request({
		url: "/appDevice/storageInstrumentReserve/queryById?id=" + id,
		method: "get",
	});
}

export function getReserveList(queryParameter) {
	return request({
		url: "/appDevice/storageInstrumentReserve/reserveList",
		method: "get",
		params: queryParameter,
	});
}

export function getAllDayReserve(queryParameter) {
	return request({
		url: "/appDevice/storageInstrumentReserve/getDeviceReserveTimeV2List",
		method: "get",
		params: queryParameter,
	});
}

export function getRejectDes(id) {
	return request({
		url: "/appDevice/storageInstrumentReserve/queryRejectComment?id=" + id,
		method: "get",
	});
}

export function openDevice(id) {
	return request({
		url: "/appDevice/storageInstrumentReserve/powerOn?id=" + id,
		method: "get",
	});
}

export function closeDevice(id) {
	return request({
		url: "/appDevice/storageInstrumentReserve/powerOff?id=" + id,
		method: "get",
	});
}

export function getGroup() {
	return request({
		url: "/appDevice/storageInstrumentReserve/getParentProjectList",
		method: "get",
	});
}

export function getTeacher(id) {
	return request({
		url: "/appDevice/storageInstrumentReserve/getProjectDetList?pid=" + id,
		method: "get",
	});
}

export function cancelReserve(data) {
	return request({
		url: "/appDevice/storageInstrumentReserve/reserveCancel",
		method: "post",
		data: data,
	});
}
