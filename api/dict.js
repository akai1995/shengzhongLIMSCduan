import service from '@/app/app.api';

/* 查询字典类型列表 */ export function listType(query) { return service.get({ url: '/system/dict/type/list', params: query }) }
/* 查询字典类型详细 */ export function getType(dictId) { return service.get({ url: `/system/dict/type/${dictId}` }) }
/* 新增字典类型 */ export function addType(data) { return service.post({ url: '/system/dict/type', data }) }
/* 修改字典类型 */ export function updateType(data) { return service.put({ url: '/system/dict/type', data }) }
/* 删除字典类型 */ export function delType(dictId) { return service.del({ url: `/system/dict/type/${dictId}` }) }
/* 刷新字典缓存 */ export function refreshCache() { return service.del({ url: '/system/dict/type/refreshCache' }) }
/* 获取字典选择框列表 */ export function optionselect() { return service.get({ url: '/system/dict/type/optionselect', }) }


/* 查询字典数据列表 */ export function listData(params) { return service.get({ url: '/system/dict/data/list', params }) }
/* 查询字典数据详细 */ export function getData(dictCode) { return service.get({ url: `/system/dict/data/${dictCode}` }) }
/* 根据字典类型查询字典数据信息 */ export function getDictByType(dictType) { return service.get({ url: `/system/dict/data/type/${dictType}` }) }
/* 删除字典数据 */ export function delData(dictCode) { return service.del({ url: `/system/dict/data/${dictCode}` }) }
/* 新增字典数据 */ export function addData(data) { return service.post({ url: '/system/dict/data', data }) }
/* 修改字典数据 */ export function updateData(data) { return service.put({ url: '/system/dict/data', data }) }