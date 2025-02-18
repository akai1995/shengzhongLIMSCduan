import { MessageTask, TaskStatus } from 'wukongimjssdk'
import { MessageContent, MediaMessageContent, ChannelInfo, Channel } from 'wukongimjssdk'
import { MessageContentType, } from 'wukongimjssdk'
import { WKSDK, ConversationAction } from 'wukongimjssdk'
import { ConnectStatus } from 'wukongimjssdk'
import { loadHisMsg, deleteConversion } from '@/api/imApi.js'
// import { syncCmd, ackCmdApi, getChannelInfo} from '@/api/api.js'
import { Convert } from '@/imUtil/convert.ts'
import store from '@/store/index.js'
var __extends = (this && this.__extends) || (function() {
	var extendStatics = function(d, b) {
		extendStatics = Object.setPrototypeOf ||
			({ __proto__: [] } instanceof Array && function(d, b) { d.__proto__ = b; }) ||
			function(d, b) {
				for (var p in b)
					if (b.hasOwnProperty(p)) d[p] = b[p];
			};
		return extendStatics(d, b);
	};
	return function(d, b) {
		extendStatics(d, b);

		function __() { this.constructor = d; }
		d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
})();
//附件上传
var MediaMessageUploadTask = (function(_super) {
	__extends(MediaMessageUploadTask, _super);

	function MediaMessageUploadTask() {
		return _super !== null && _super.apply(this, arguments) || this;
	}
	MediaMessageUploadTask.prototype.start = async function() {
		let res = await uni.$u.http.upload(baseUrl + '/file/upload', {
			filePath: this.message.content.url,
			name: 'file',
			getTask: (task, options) => {
				this._task = task
				task.onProgressUpdate((res) => {
					var completeProgress = ((res.progress / 100) | 0);
					this._progress = completeProgress
					this.update()
				});
			}
		});
		if (res) {
			this.message.content.remoteUrl = res.url;
			this.status = TaskStatus.success
			this.update()
		}
	}
	MediaMessageUploadTask.prototype.cancel = function() {
		this.status = TaskStatus.cancel
		this.update()
		this._task.abort()
	}
	return MediaMessageUploadTask;
}(MessageTask));
export { MediaMessageUploadTask };
// 语音内容
var VoiceContent = (function(_super) {
	__extends(VoiceContent, _super);

	function VoiceContent(url, length) {
		var _this = _super.call(this) || this;
		_this.url = url;
		_this.length = length;
		return _this;
	}


	Object.defineProperty(VoiceContent.prototype, "contentType", {
		get: function() {
			return 4;
		},
		enumerable: true,
		configurable: true
	});

	Object.defineProperty(VoiceContent.prototype, "avatar", {
		get: function() {
			return this._avatar;
		},
		set: function(value) {
			this._avatar = value;
		},
		enumerable: true,
		configurable: true
	});

	Object.defineProperty(VoiceContent.prototype, "nickName", {
		get: function() {
			return this._nickName;
		},
		set: function(value) {
			this._nickName = value;
		},
		enumerable: true,
		configurable: true
	});

	VoiceContent.prototype.decodeJSON = function(content) {
		this.url = content['url']
		this.length = content['length']
		this._avatar = content['avatar']
		this._nickName = content['nickName']
		this.remoteUrl = content['remoteUrl']
	};
	VoiceContent.prototype.encodeJSON = function() {
		return {
			url: this.url || '',
			length: this.length,
			avatar: this._avatar,
			nickName: this._nickName,
			remoteUrl: this.remoteUrl,
		};
	};
	return VoiceContent;
}(MediaMessageContent))
export { VoiceContent }
// 图片内容
var ImageContent = /** @class */ (function(_super) {
	__extends(ImageContent, _super);

	function ImageContent(url, w, h) {
		var _this = _super.call(this) || this;
		_this.url = url;
		_this.w = w;
		_this.h = h;
		return _this;
	}

	Object.defineProperty(ImageContent.prototype, "contentType", {
		get: function() {
			return MessageContentType.image;
		},
		enumerable: true,
		configurable: true
	});

	Object.defineProperty(ImageContent.prototype, "avatar", {
		get: function() {
			return this._avatar;
		},
		set: function(value) {
			this._avatar = value;
		},
		enumerable: true,
		configurable: true
	});

	Object.defineProperty(ImageContent.prototype, "nickName", {
		get: function() {
			return this._nickName;
		},
		set: function(value) {
			this._nickName = value;
		},
		enumerable: true,
		configurable: true
	});

	ImageContent.prototype.decodeJSON = function(content) {
		this.url = content['url']
		this.w = content['w']
		this.h = content['h']
		this._avatar = content['avatar']
		this._nickName = content['nickName']
		this.remoteUrl = content['remoteUrl']
	};
	ImageContent.prototype.encodeJSON = function() {
		return {
			url: this.url || '',
			w: this.w,
			h: this.h,
			avatar: this._avatar,
			nickName: this._nickName,
			remoteUrl: this.remoteUrl,
		};
	};
	return ImageContent;
}(MediaMessageContent));
export { ImageContent };
//自定义文本
var MessageTextCustom = /** @class */ (function(_super) {
	__extends(MessageTextCustom, _super);

	function MessageTextCustom(text, avatar, nickName) {
		var _this = _super.call(this) || this;
		_this.text = text;
		_this.avatar = avatar;
		_this.nickName = nickName;
		return _this;
	}

	Object.defineProperty(MessageTextCustom.prototype, "contentType", {
		get: function() {
			return MessageContentType.text;
		},
		enumerable: true,
		configurable: true
	});

	MessageTextCustom.prototype.decodeJSON = function(content) {
		this.text = content['text']
		this.avatar = content['avatar']
		this.nickName = content['nickName']
	};
	MessageTextCustom.prototype.encodeJSON = function() {
		var obj = { text: this.text || '', avatar: this.avatar, nickName: this.nickName };
		return obj;
	};
	return MessageTextCustom;

}(MessageContent));

export { MessageTextCustom };

//获取某个频道的消息列表
const syncMessagesCallback = async (channel, opts) => {
	const res = await loadHisMsg({
		channel_id: channel.channelID,
		channel_type: channel.channelType,
		start_message_seq: opts.startMessageSeq,
		end_message_seq: opts.endMessageSeq,
		pull_mode: opts.pullMode,
		limit: opts.limit
	})
	const conversation = WKSDK.shared().conversationManager.findConversation(channel)
	if (conversation) {
		conversation.unread = 0
	}
	const arr = []
	let message
	for (let i = 0; i < res.messages.length; i++) {
		message = Convert.toMessage(res.messages[i]);
		arr.push(message)
	}
	// store.dispatch('updateUnreadcount', WKSDK.shared().conversationManager.getAllUnreadCount())
	return arr;
}

const syncConversationsCallback = async (filter) => {
	return []
	// let conversations = await syncConversation({
	// 	msg_count: 1,
	// 	version: 0
	// })
	// const arr = []
	// for (let i = 0; i < conversations.length; i++) {
	// 	const conversation = Convert.toConversation(conversations[i]);
	// 	await WKSDK.shared().channelManager.fetchChannelInfo(conversation.channel)
	// 	arr.push(conversation)
	// }
	// // await store.dispatch('updateConversations', arr)
	// // await store.dispatch('updateUnreadcount', WKSDK.shared().conversationManager.getAllUnreadCount())
	// return arr;
}

const channelInfoCallback = async (channel) => {
	if (channel.channelID === 'system') {
		return { title: "系统", logo: 'https://pic.616pic.com/ys_img/00/26/71/lAPhWiJDCo.jpg' }
	}
	try {
		return await getChannelInfo(channel);
	}
	catch (e) {
		return { title: "未知", logo: 'https://pic.616pic.com/ys_img/00/26/71/lAPhWiJDCo.jpg' }
	}
}
import config from "@/config.js"
const connectAddrCallback = (callback) => {
	if (WKSDK.shared().connectManager.status === ConnectStatus.Connected) {
		return;
	}
	callback(config.wsUrl)
}

const messageReadedCallback = async (channel, messages) => {
	// 未读设置未0
	console.log(channel, messages)
}
const getNote = (message) => {
	if (!message) {
		return { content: '', title: '' }
	}
	switch (message.contentType) {
		case MessageContentType.text:
			return { content: message.content.text, title: message.content.nickName };
		case MessageContentType.image:
			return { content: '[图片]', title: message.content.nickName };
		case 4:
			return { content: '[语音]', title: message.content.nickName };
		default:
			return { content: '[系统消息]', title: message.content.nickName };
	}
}
const msgNotifyListener = (msg) => {
	if (MessageContentType.cmd === msg.contentType) {
		// 命令消息单独由命令处理器处理
		return;
	}
	//#ifdef APP-NVUE
	const openConversation = WKSDK.shared().conversationManager.openConversation
	if (!openConversation || !openConversation.isEqual(WKSDK.shared().conversationManager.findConversation(msg
		.channel))) {
		const { title, content } = getNote(msg)
		uni.createPushMessage({
			title,
			content,
			cover: false,
			sound: 'system',
			fail: (e) => {
				console.log(e)
			},
			success: () => {
				plus.runtime.setBadgeNumber(WKSDK.shared().conversationManager.getAllUnreadCount(), {
					title: '社',
					content: '您有x条未读消息'
				})
			}
		})

	}
	//#endif
}
const handleFriendApply = async (msg) => {
	// store.dispatch('addNewFriendCount')
}
const handleCmd = async (msg) => {
	if (msg.contentType != MessageContentType.cmd) {
		return;
	}
	switch (msg.content.cmd) {
		case 'friend_apply':
			handleFriendApply(msg)
			break;
		case 'friend_fresh':
			//发起前端事件
			// store.dispatch('refreshFriends')
			break;
		case 'conversation_remove':
			let channelType = msg.content.param.channelType
			let channelID = msg.content.param.channelID
			WKSDK.shared().conversationManager.removeConversation(new Channel(channelID, channelType))
			break;
		case 'friend_agree':
			let channelType1 = msg.content.param.channelType
			let channelID1 = msg.content.param.channelID
			let textmsg = new MessageTextCustom('我们已经是好友了，开始聊天吧！', store.getters.avatar,
				store.getters.nickName);
			WKSDK.shared().chatManager.send(textmsg, new Channel(channelID1, channelType1));
			break;
		default:
			return;
	}
}
// const fetchCmd = async () => {
// 	try {
// 		const msgs = await syncCmd()
// 		for (let i = 0; i < msgs.length; i++) {
// 			await handleCmd(Convert.toMessage(msgs[i]))
// 		}
// 		if (msgs.length > 0) {
// 			const lastmsg = Convert.toMessage(msgs[msgs.length - 1])
// 			ackCmd(lastmsg.messageSeq)
// 		}
// 	}
// 	catch (e) {
// 		console.log(e)
// 	}
// }
// const ackCmd = async (msgseq) => {
// 	await ackCmdApi(msgseq)
// }
const cmdMsgListener = (msg) => {
	handleCmd(msg)
}
const conversationListener = async (conversation, action) => {
	// conversation：发送数据变化的最近会话对象
	// action：变化行为 add：添加 update：更新
	switch (action) {
		case ConversationAction.add:
			break;
		case ConversationAction.update:
			break;
		case ConversationAction.remove:
			await deleteConversion(conversation.channel)
			break;

	}
	// await store.dispatch('updateConversations', WKSDK.shared().conversationManager.conversations)
	// await store.dispatch('updateUnreadcount', WKSDK.shared().conversationManager.getAllUnreadCount())
}
const connectionStatusChangeListener = (status, reasonCode) => {
	if (ConnectStatus.ConnectKick === status) {
		uni.showToast({
			title: '账号已在其他设备登录'
		})
		// store.dispatch('logout')
	}
	else if (ConnectStatus.Connected === status) {
		// 连接成功
		WKSDK.shared().conversationManager.sync()
		// 同步离线命令消息
		// fetchCmd()
		// 拉取好友
		// store.dispatch('refreshFriends')
	}
}
WKSDK.shared().config.provider.messageUploadTaskCallback = (message) => {
	return new MediaMessageUploadTask(message)
}
//会话同步回调
WKSDK.shared().config.provider.syncConversationsCallback = syncConversationsCallback
//消息同步回调
WKSDK.shared().config.provider.syncMessagesCallback = syncMessagesCallback
//频道信息同步回调
WKSDK.shared().config.provider.channelInfoCallback = channelInfoCallback
//连接回调
WKSDK.shared().config.provider.connectAddrCallback = connectAddrCallback
//阅读消息回调
WKSDK.shared().config.provider.messageReadedCallback = messageReadedCallback
//断开状态改变事件
WKSDK.shared().connectManager.removeConnectStatusListener(connectionStatusChangeListener)
WKSDK.shared().connectManager.addConnectStatusListener(connectionStatusChangeListener)
//会话变动事件
// WKSDK.shared().conversationManager.removeConversationListener(conversationListener);
// WKSDK.shared().conversationManager.addConversationListener(conversationListener);
//消息事件
// WKSDK.shared().chatManager.removeMessageListener(msgNotifyListener);
// WKSDK.shared().chatManager.addMessageListener(msgNotifyListener);
//命令消息
// WKSDK.shared().chatManager.removeCMDListener(cmdMsgListener)
// WKSDK.shared().chatManager.addCMDListener(cmdMsgListener)

WKSDK.shared().register(MessageContentType.text, () => new MessageTextCustom())
WKSDK.shared().register(MessageContentType.image, () => new ImageContent())
WKSDK.shared().register(4, () => new VoiceContent())