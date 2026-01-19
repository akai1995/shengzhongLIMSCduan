import service from '@/app/app.http';

/** 分页查询*/
export function getOperationManualList(pageNum,pageSize) {
  return service.get({ url:'/personalcenter/operationManual/list', params:{ pageNum, pageSize } })
}


/** 通过id查询 */
export function getOperationManualId(id) {
  return service.get({ url:'/personalcenter/operationManual/selectId/'+id })
}

export function getOperationManualType(type) {
  return service.get({ url:'/personalcenter/operationManual/selectType', params:{ type } })
}