import request from '@/utils/request'

// 列表
export function list(data) {
  return request({
    url: '/hospitalrelated/testpaper/pagePaperVO',
    method: 'post',
	data
  })
}
// 题目列表
export function askList(id) {
  return request({
    url: `/hospitalrelated/testquestion/listByPaperId/${id}`,
    method: 'post',
  })
}
// 提交问卷
export function submit (data) {
	return request({
	  url: '/hospitalrelated/testresult/submit',
	  method: 'post',
		data
	})
}
// 提交反馈
export function feedback (data) {
	return request({
	  url: '/hospitalrelated/testresult/feedback',
	  method: 'post',
		data
	})
}