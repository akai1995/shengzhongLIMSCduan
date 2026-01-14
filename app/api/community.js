import request from '@/providers/request'

// 发布社区新闻
export function publish(data) {
    return request({
        'url': '/community/communityNews/publish',
        'method': 'post',
        data
    })
}
// 检查图片敏感
export function checkImg(url) {
    return request({
        'url': '/community/communityNews/checkImgUrl?imgUrl=' + url,
        'method': 'get',
    })
}
// 根据条件分类分页查询社区新闻
export function newsPage(data) {
    return request({
        'url': '/community/communityNews/newsPage',
        'method': 'post',
        data
    })
}
// 查询栏目列表
export function searchLink() {
    return request({
        'url': '/community/communityLink/list',
        'method': 'get',
    })
}
// 根据id查询详情
export function getDetail(id) {
    return request({
        'url': '/community/communityNews/'+id,
        'method': 'get',
    })
}
// 收藏/取消收藏
export function collect(params) {
    return request({
        'url': '/community/communityCollect/collect',
        'method': 'post',
        params
    })
}
// 点赞/取消点赞
export function like(params) {
    return request({
        'url': '/community/communityLike/like',
        'method': 'post',
        params
    })
}
// 关注/取消关注
export function concern(params) {
    return request({
        'url': '/community/communityConcern/concern',
        'method': 'post',
        params
    })
}
// 获取关注/粉丝数量
export function getConcernCount(params) {
    return request({
        'url': '/community/communityConcern/getConcernCount',
        'method': 'post',
        params
    })
}
// 获取关注列表/粉丝列表
export function selectConcernList(params) {
    return request({
        'url': '/community/communityConcern/select',
        'method': 'post',
        params
    })
}
// 获取关注人发送新闻动态列表
export function concernPage(data) {
    return request({
        'url': '/community/communityConcern/concernPage',
        'method': 'post',
        data
    })
}
// 获取关注列表/粉丝ID列表
export function selectConcernIds(params) {
    return request({
        'url': '/community/communityConcern/selectIds',
        'method': 'post',
        params
    })
}
// 获取关注人发送新闻动态列表
export function concernPeoplePage(data) {
    return request({
        'url': '/community/communityConcern/concernPeoplePage',
        'method': 'post',
        data
    })
}
// 获取我收藏的社区新闻
export function collectPage(data) {
    return request({
        'url': '/community/communityCollect/collectPage',
        'method': 'post',
        data
    })
}
// 获取用户信息（包括点赞数、粉丝数、关注数）
export function getUserInformation(id) {
    return request({
        'url': '/community/communityNews/getUser/'+id,
        'method': 'get'
    })
}
// 获取评论列表
export function getCommentList(data) {
    return request({
        'url': '/community/communityComment/commentPage',
        'method': 'post',
        data
    })
}
// 新增评论
export function addNewsComment(data) {
    return request({
        'url': '/community/communityComment/add',
        'method': 'post',
        data
    })
}
// 全文检索
export function searchKeyWord(params) {
    return request({
        'url': '/community/communityNews/searchKeyWord',
        'method': 'post',
        params
    })
}
// 删除社区新闻
export function deleteCircle(ids) {
    return request({
        'url': '/community/communityNews/remove/'+ ids,
        'method': 'delete',
    })
}
// 分享
export function shareCommunityNews(id) {
    return request({
        'url': '/community/communityNews/shareNews/'+ id,
        'method': 'get',
    })
}
// 删除评论
export function deleteCommentById(id) {
    return request({
        'url': '/community/communityComment/remove/'+ id,
        'method': 'get',
    })
}