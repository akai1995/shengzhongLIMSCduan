import upload from '@/utils/upload'
import request from '@/utils/request'
import {encryptedData}  from '@/utils/rsa'
import { decrypt,encrypt} from "@/utils/encryp.js"

// 药品信息检索
export function searchDrug(searchParam) {
  return request({
    url: '/generalcontent/generalcontent/search/searchDrug'+searchParam,
	method: 'get',
	// encrypt(JSON.stringify(searchParam))
  })
}

// 首页全文信息检索
export function indexSearch(keyWord,currentPage,pageSize) {
  return request({
    url: '/generalcontent/generalcontent/search/list?keyWord='+keyWord+'&currentPage='+currentPage+'&pageSize='+pageSize,
    method: 'get'
  })
}

// 药品信息查询
export function getdDrugInfo(id) {
  return request({
    url: '/generalcontent/drug/drug/'+id,
    method: 'get'
  })
}

// 新闻信息查询
export function getNewsInfo(id) {
  return request({
    url: '/generalcontent/newscenter/newscenter/'+id,
    method: 'get'
  })
}

// 全局搜索
export function searchall(data) {
  return request({
    url: '/generalcontent/globalsearch/searchall',
	method: 'post',
	data:data
	// encrypt(JSON.stringify(searchParam))
  })
}

// 根据ID查询详情 药品
export function getById(id) {
  return request({
    url: '/generalcontent/zldrug/getById/'+id,
    method: 'get'
  })
}

// 分页查询肿瘤信息
export function pagevo(data) {
  return request({
    url: '/generalcontent/zldrug/pagevo',
	method: 'post',
	data:data
	// encrypt(JSON.stringify(searchParam))
  })
}

// 检测项目查询
export function pageProject(data) {
  return request({
    url: '/generalcontent/globalsearch/pageProject',
	method: 'post',
	data:data
  })
}