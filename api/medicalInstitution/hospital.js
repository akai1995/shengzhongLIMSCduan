import request from '@/utils/request'


// 查询医院列表分页
export function getList(pageNum,pageSize,keyword) {
  return request({
    url: '/generalcontent/medicalInstitution/getList',
    method: 'get',
    params: {pageNum,pageSize,keyword}
  })
}

// 查询医院列表
export function List(keyword) {
  return request({
    url: '/generalcontent/medicalInstitution/list',
    method: 'get',
	params:{keyword}
  })
}