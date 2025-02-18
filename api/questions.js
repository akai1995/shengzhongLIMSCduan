import request from '@/utils/request'

// 获取判断选择题目
export function getCancerCoreSurvey() {
  return request({
    'url': '/hospitalrelated/testquestion/getCancerCoreSurvey',
    'method': 'post',
  })
}
export function submitCancerCoreResult(data) {
  return request({
    'url': '/hospitalrelated/testresult/submitCancerCoreResult',
    'method': 'post',
	data
  })
}
