import upload from '@/providers/upload'
import service from '@/app/app.api';

/* 用户密码重置 */ export function updateUserPwd(oldPassword, newPassword) { return service.put({ url: '/system/user/profile/updatePwd', params: { oldPassword, newPassword } }) }
/* 查询用户个人信息 */ export function getUserProfile() { return service.get({ url: '/system/user/profile', method: 'get' }) }
/* 修改用户个人信息 */ export function updateUserProfile(data) { return service.put({ url: '/system/user/profile', data }) }
/* 用户头像上传 */ export function uploadAvatar(data) { return upload({ url: '/system/user/profile/avatar', name: data.name, filePath: data.filePath }) }
/* 消息 */ export function getUserMessageList(data) { return service.post({ url: '/personalcenter/userMessage/getUserMessageList', data }) }
/* 消息 内容 */ export function getMessageSon(params) { return service.post({ url: '/personalcenter/userMessage/getMessageSon', params }) }
/* 消息 内容 */ export function updateMessageSon(params) { return service.post({ url: '/personalcenter/userMessage/updateMessageSon', params }) }
/* 根据用户id获取用户 */ export function getUserInformation(id) { return service.get({ url: `/personalcenter/userInformation/getUserInformation/${id}` }) }
/* 查询消息(专家咨询) */ export function getUserMessage(params) { return service.post({ url: '/personalcenter/userMessage/getUserMessage', params }) }
/* 查询医院机构 */ export function nosocomiumlist() { return service.get({ url: '/hospitalrelated/hosorgkey/listAll' }) }
/* 字典数据 */ export function dict(type) { return service.get({ url: `/system/dict/data/type/${type}` }) }
/* 添加专家 */ export function expertAdd(data) { return service.post({ url: '/generalcontent/expert/add', data }) }
/* 添加专家 */ export function expertEdit(data) { return service.put({ url: '/generalcontent/expert/edit', data }) }
/* 根据userId获取专家信息 */ export function getExpert(id) { return service.get({ url: `/generalcontent/expert/getExpert/${id}` }) }
/* 获取当前用户的专家信息 */ export function getMyInfo() { return service.get({ url: '/generalcontent/expert/getMyInfo' }) }
/* 医生自己修改信息 */ export function editExpoert(data) { return service.post({ url: '/generalcontent/expert/editExpoert', data }) }
/* 查询医院信息 */ export function getOrgName(id) { return service.get({ url: `/hospitalrelated/hospitalConf/getOrgName/${id}` }) }
/* 发送重置密码验证码 */ export function sendPwdChageCode(phone) { return service.get({ url: `/personalcenter/userInformation/sendPwdChageCode/${phone}` }) }
/* 重置密码 */ export function resetpwd(data) { return service.post({ url: '/personalcenter/userInformation/resetpwd', data }) }
