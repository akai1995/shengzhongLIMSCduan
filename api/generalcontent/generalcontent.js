import request from '@/utils/request'
import { methods } from '../../uni_modules/uview-ui/libs/mixin/mixin'

//新闻栏目列表
export function getNewsLink(type){
	return request({
		url: '/generalcontent/newslink/linkList/'+type,
		method: 'get'
	})
}

//根据类别查询新闻列表
export function getNewsList(data){
	return request({
		url: '/generalcontent/newscenter/newscenter/getNewsListByType',
		method: 'post',
		data:data
	})
}
//检测项目列表
export function getTestProjectList(data){
	return request({
		url: '/generalcontent/testproject/testproject/getTestList',
		method: 'post',
		data:data
	})
}

//根据id获取新闻详情
export function getNewsListDetailById(id){
	return request({
		url: '/generalcontent/newscenter/newscenter/getNewsDetailById',
		method: 'get',
		params:{id}
	})
}

//根据id获取检测项目详情
export function getTestProjectDetailById(id){
	return request({
		url: '/generalcontent/testproject/testproject/testListDetailById',
		method: 'get',
		params:{id}
	})
}

//评论评价列表
export function commentList(newsId){
	return request({
		url: '/generalcontent/newscenter/newscenter/commentList',
		method: 'get',
		params: {newsId}
	})
}

//新增评论评价
export function addNewsComment(newsComment){
	return request({
		url: '/generalcontent/newscenter/newscenter/addNewsComment',
		method: 'post',
		data: newsComment
	})
}

//根据id删除评论及子评论
export function deleteCommentById(id){
	return request({
		url: '/generalcontent/newscenter/newscenter/deleteCommentById',
		method: 'delete',
		params: {id}
	})
}

//评论点赞及取消点赞
export function commentLike(data){
	return request({
		url: '/generalcontent/newscenter/newscenter/commentLike',
		method: 'post',
		data: data
	})
}

//新闻收藏
export function newsCollect(data){
	return request({
		url: '/generalcontent/newscenter/newscenter/newsCollect',
		method: 'post',
		data: data
	})
}

//新闻点赞及取消点赞
export function newsLike(data){
	return request({
		url: '/generalcontent/newscenter/newscenter/newsLike',
		method: 'post',
		data: data
	})
}

//获取新闻点赞数
export function getLikeNum(newsId,userId){
	return request({
		url: '/generalcontent/newscenter/newscenter/getLikeNum',
		method: 'get',
		params: {newsId,userId}
	})
}

//新闻分享
export function newsShare(data){
	return request({
		url: '/generalcontent/newscenter/newscenter/addNewsShare',
		method: 'post',
		data: data
	})
}
