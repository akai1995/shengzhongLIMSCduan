import service from '@/app/app.http';

export function getDeviceList(params) {
	return service.get({ url: '/appDevice/storageInstrumentReserve/deviceList', params });
}

export function deviceSubmit(data) {
	return service.post({ url: '/appDevice/storageInstrumentReserve/appDeviceReserveSubmit', data });
}

export function deviceDetail(id) {
	return service.get({ url: '/appDevice/storageInstrumentReserve/deviceDetailById?instrumentId=' + id });
}

export function reserveDetail(id) {
	return service.get({ url: '/appDevice/storageInstrumentReserve/queryById?id=' + id });
}

export function getReserveList(params) {
	return service.get({ url: '/appDevice/storageInstrumentReserve/reserveList', params });
}

export function getAllDayReserve(params) {
	return service.get({ url: '/appDevice/storageInstrumentReserve/getDeviceReserveTimeV2List', params });
}

export function getRejectDes(id) {
	return service.get({ url: '/appDevice/storageInstrumentReserve/queryRejectComment?id=' + id });
}

export function openDevice(id) {
	return service.get({ url: '/appDevice/storageInstrumentReserve/powerOn?id=' + id });
}

export function closeDevice(id) {
	return service.get({ url: '/appDevice/storageInstrumentReserve/powerOff?id=' + id });
}

export function getGroup() {
	return service.get({ url: '/appDevice/storageInstrumentReserve/getParentProjectList' });
}

export function getTeacher(id) {
	return service.get({ url: '/appDevice/storageInstrumentReserve/getProjectDetList?pid=' + id });
}

export function cancelReserve(data) {
	return service.post({ url: '/appDevice/storageInstrumentReserve/reserveCancel', data });
}
