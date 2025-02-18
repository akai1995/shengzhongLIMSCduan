import request from "@/utils/request";

/** 分页查询*/
export function getOperationManualList(pageNum,pageSize) {
  return request({
    url:'/personalcenter/operationManual/list',
    method:'get',
    params:{pageNum,pageSize}
  })

}


/** 通过id查询 */
export function getOperationManualId(id) {
  return request({
    url:'/personalcenter/operationManual/selectId/'+id,
    method:'get',

  })

}

export function getOperationManualType(type) {
  return request({
    url:'/personalcenter/operationManual/selectType',
    method:'get',
	params:{type}
  })

}