import request from '@/utils/request'


// 查询专家留言
export function getList(pageNum,pageSize) {
  return request({
    url: '/generalcontent/expertLeave/getList',
    method: 'get',
    params: {pageNum,pageSize}
  })
}


// 添加专家留言
export function insert(expert) {
  return request({
    url: '/generalcontent/expertLeave/add',
    method: 'post',
    data: expert
  })
}
// 修改专家留言
export function edit(expert) {
  return request({
    url: '/generalcontent/expertLeave/edit',
    method: 'put',
    data: expert
  })
}
// 删除专家留言
export function del(id) {
  return request({
    url: '/generalcontent/expertLeave/remove',
    method: 'get',
    params: {id}
  })
}
