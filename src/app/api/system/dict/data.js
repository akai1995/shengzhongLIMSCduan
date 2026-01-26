import service from '@/app/app.http';

/* 查询字典数据列表 */
export function listData(params) { return service.get({ url: '/system/dict/data/list', params }) }

/* 查询字典数据详细 */
export function getData(dictCode) { return service.get({ url: `/system/dict/data/${dictCode}` }) }

/* 根据字典类型查询字典数据信息 */
export function getDictByType(dictType) { return service.get({ url: `/system/dict/data/type/${dictType}` }) }

/* 删除字典数据 */
export function delData(dictCode) { return service.del({ url: `/system/dict/data/${dictCode}` }) }

/* 新增字典数据 */
export function addData(data) { return service.post({ url: '/system/dict/data', data }) }

/* 修改字典数据 */
export function updateData(data) { return service.put({ url: '/system/dict/data', data }) }
