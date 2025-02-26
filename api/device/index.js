import request from "@/utils/request";

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
		url: "/appDevice/storageInstrumentReserve/getDeviceReserveTimeList",
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
