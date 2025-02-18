import request from '@/utils/request'


// 查询专家列表
export function getList1(pageNum,pageSize,expertState) {
  return request({
    url: '/generalcontent/expert/getList',
    method: 'get',
    params: {pageNum,pageSize,expertState}
  })
}
// 查询专家列表
export function List(keyword,classification) {
  return request({
    url: '/generalcontent/expert/list',
    method: 'get',
	params:{keyword,classification}
  })
}



