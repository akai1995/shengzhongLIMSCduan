import request from '@/utils/request'


// 查询专家关注
export function getList(pageNum,pageSize) {
  return request({
    url: '/generalcontent/expertInterest/getList',
    method: 'get',
    params: {pageNum,pageSize}
  })
}


// 添加专家关注
export function insert(expert) {
  return request({
    url: '/generalcontent/expertInterest/add',
    method: 'post',
    data: expert
  })
}
// 修改专家关注
export function edit(expert) {
  return request({
    url: '/generalcontent/expertInterest/edit',
    method: 'put',
    data: expert
  })
}
// 删除专家关注
export function del(id) {
  return request({
    url: '/generalcontent/expertInterest/remove',
    method: 'get',
    params: {id}
  })
}
