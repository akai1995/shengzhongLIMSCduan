import service from '@/app/app.http';

// 发布社区新闻
export function publish(data) {
    return service.post({ url: '/community/communityNews/publish', data })
}
// 检查图片敏感
export function checkImg(url) {
    return service.get({ url: '/community/communityNews/checkImgUrl?imgUrl=' + url, })
}
// 根据条件分类分页查询社区新闻
export function newsPage(data) {
    return service.post({ url: '/community/communityNews/newsPage', data })
}
// 查询栏目列表
export function searchLink() {
    return service.get({ url: '/community/communityLink/list', })
}
// 根据id查询详情
export function getDetail(id) {
    return service.get({ url: '/community/communityNews/'+id, })
}
// 收藏/取消收藏
export function collect(params) {
    return service.post({ url: '/community/communityCollect/collect', params })
}
// 点赞/取消点赞
export function like(params) {
    return service.post({ url: '/community/communityLike/like', params })
}
// 关注/取消关注
export function concern(params) {
    return service.post({ url: '/community/communityConcern/concern', params })
}
// 获取关注/粉丝数量
export function getConcernCount(params) {
    return service.post({ url: '/community/communityConcern/getConcernCount', params })
}
// 获取关注列表/粉丝列表
export function selectConcernList(params) {
    return service.post({ url: '/community/communityConcern/select', params })
}
// 获取关注人发送新闻动态列表
export function concernPage(data) {
    return service.post({ url: '/community/communityConcern/concernPage', data })
}
// 获取关注列表/粉丝ID列表
export function selectConcernIds(params) {
    return service.post({ url: '/community/communityConcern/selectIds', params })
}
// 获取关注人发送新闻动态列表
export function concernPeoplePage(data) {
    return service.post({ url: '/community/communityConcern/concernPeoplePage', data })
}
// 获取我收藏的社区新闻
export function collectPage(data) {
    return service.post({ url: '/community/communityCollect/collectPage', data })
}
// 获取用户信息（包括点赞数、粉丝数、关注数）
export function getUserInformation(id) {
    return service.get({ url: '/community/communityNews/getUser/'+id })
}
// 获取评论列表
export function getCommentList(data) {
    return service.post({ url: '/community/communityComment/commentPage', data })
}
// 新增评论
export function addNewsComment(data) {
    return service.post({ url: '/community/communityComment/add', data })
}
// 全文检索
export function searchKeyWord(params) {
    return service.post({ url: '/community/communityNews/searchKeyWord', params })
}
// 删除社区新闻
export function deleteCircle(ids) {
    return service.del({ url: '/community/communityNews/remove/'+ ids })
}
// 分享
export function shareCommunityNews(id) {
    return service.get({ url: '/community/communityNews/shareNews/'+ id })
}
// 删除评论
export function deleteCommentById(id) {
    return service.get({ url: '/community/communityComment/remove/'+ id })
}