<template>
	<view class="wrapper">
		<ut-nav title="病情详情" border></ut-nav>
		<view class="d-flex js-b-c hd-tit">
			<view class="desc-text">{{ itemInfo.status !== '9' ? '咨询中...' : '咨询已结束' }}</view>
			<u-tag v-if="itemInfo.status !== '9'" text="结束问诊" color="#FD5454" bgColor="#FFEEEE"
				borderColor="#FFEEEE"></u-tag>
		</view>
		<scroll-view class="page-content" scroll-with-animation scroll-y @scrolltoupper="scrolltoupper"
			:scroll-into-view="scrollInto">
			<view class="chat-room">
				<template v-if="showtop">
					<view class="card-item" style="margin: 12rpx 32rpx 60rpx;">
						<view class="d-flex js-b-c">
							<view class="">
								<text class="m-r2 font1">{{ itemInfo.name || '匿名' }}</text>
								<text class="m-r2 font2">{{ mapGender[itemInfo.gender] }}</text>
								<text class="font2">{{ itemInfo.age }}岁</text>
							</view>
							<view class="font4">{{ itemInfo.lastChatTime | ddfilter }}</view>
						</view>
						<u-line margin="18rpx 0"></u-line>
						<view v-if="isZk" class="desc-text ellipsis2 pd-tb-16">
							病情描述：{{ itemInfo.description }}</view>
						<view v-if="isZk" class="card-btm">
							<ut-imgs :imgs="itemInfo.imgs"></ut-imgs>
						</view>
						<view class="d-flex jc-c-c zhankai" @click="openZk" hover-class="zhankai-hover">
							{{ isZk ? '收起' : '展开' }}<u-icon color="#666" size="32rpx" :name="isZkIcon"></u-icon>
						</view>
					</view>
					<!-- 绑定信息的类容 -->
					<template v-for="(item, index) in contentList">
						<chatItem :key="index" :type="item.type" :direction="item.direction" :color="item.color"
							:headImg="item.headImg" :info="item.data"></chatItem>
					</template>
				</template>
				<!--及时聊天的信息-->
				<template v-for="(item, index) in newList">
					<chatItem :key="index" :type="item.type" :direction="item.direction" :color="item.color"
						:headImg="item.headImg" :info="item.data"></chatItem>
				</template>

			</view>
			<view id="btmview"></view>
		</scroll-view>
		<view class="send-blcok safe-area-inset-bottom">
			<view v-if="itemInfo.status !== '9'" class="d-flex js-b-c">
				<u-input v-model="sendText" confirmType="send" :disabled="disabled" border="no" adjustPosition
					shape="circle" fontSize="24rpx" placeholderStyle="color: #999;" customStyle="background: #F2F2F2;"
					color="#222" :placeholder="placeholder" @confirm="send" auto-height type="textarea" />
				<view @click="send" class="btn-scearch d-flex jc-c ai-c" :class="{ disabled: !sendText }">发送
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import chatItem from '@/pagesC/components/chat-item/chat-item.vue'
	import {
		mapGetters,
		mapState
	} from 'vuex'
	import WKSDK, {
		Channel
	} from 'wukongimjssdk'
	import {
		pageAskApi,
		getItemById
	} from '@/api/chat'
	import storage from '@/utils/storage'
	import constant from '@/utils/constant'
	import {
		getToken
	} from '@/utils/auth'
	import {
		MessageTextCustom
	} from '@/imUtil/imUtils'
	import {
		loadHisMsg
	} from '@/api/imApi.js'
	let ecl = null

	export default {
		components: {
			chatItem
		},
		data() {
			return {
				disabled: false,
				sendText: '',
				scrollInto: '',
				isZk: false,
				itemInfo: {},
				status: '1',
				mapGender: {
					1: '男',
					0: '女',
				},
				isZkIcon: 'arrow-down',
				contentList: [],
				placeholder: '输入您的回答',
				newList: [],
				channel: {
					channelID: '',
					channelType: 2,
				},
				token: '',
				userid: '',
				avatarMap: {
					br: '',
					dm: ''
				},
				end_message_seq: 0,
				start_message_seq: 0,
				limit: 30,
				showtop: false
			}
		},
		filters: {
			ddfilter(old_date) {
				var subtime = (new Date().getTime() - new Date(old_date).getTime()) / 1000; //计算时间差,并将毫秒转化为秒
				var days = parseInt(subtime / 86400); //天  24*60*60*1000
				var hours = parseInt(subtime / 3600) - 24 * days; //小时  60*60  总小时数-过去小时数=现在小时数
				var mins = parseInt(subtime % 3600 / 60); //分钟 - (day*24)  以60秒为一整份  取余 剩下秒数 秒数/60就是分钟数
				return '已等待' + (days ? days + "天" : '') + (hours ? hours + "小时" : '') + mins + "分钟";
			}
		},
		computed: {
			...mapGetters(['avatar'])
		},
		onLoad(options) {
			ecl = this.getOpenerEventChannel()
			const {
				id
			} = options
			this.channel.channelID = id
			const userid = storage.get(constant.userId)
			const token = getToken()
			this.userid = userid
			this.token = token
			this.initPage()
		},
		methods: {
			async initPage() {
				this.getItem()
			},
			async getItem() {
				uni.showLoading({
					title: '加载中...'
				})
				const res = await getItemById(this.channel.channelID)
				uni.hideLoading()
				console.log(res);
				this.itemInfo = {
					...res.data
				}
				let avatarMap = {}
				res.data.memberList.forEach(({
					uid,
					avatar
				}) => {
					if (uid == this.userid) {
						avatarMap.br = avatar
					} else {
						avatarMap.dm = avatar
					}
				})
				this.initContent()
				this.getMsgList(true)
				if (this.itemInfo.status === '9') {
					this.disabled = true
				} else {
					this.connectSocket()
				}
			},
			scrolltoupper() {
				if (this.showtop) {
					return
				}
				this.getMsgList()
			},
			async getMsgList(mode = false) {
				const {
					channel
				} = this
				const params = {
					channel_type: this.channel.channelType,
					channel_id: this.channel.channelID,
					limit: this.limit,
					pull_mode: 0,
					end_message_seq: this.end_message_seq,
					start_message_seq: this.start_message_seq
				};
				const res = await loadHisMsg(params)
				const {
					messages,
					more,
				} = res.data
				const nlist = messages.map(({
					from_uid,
					content
				}) => ({
					type: 'content',
					direction: from_uid === this.userid ? 'right' : 'left',
					headImg: content.avatar,
					data: {
						content: content.text
					}
				}))
				if (nlist.length) {
					this.end_message_seq = +messages[0].message_seq - this.limit > 0 ? +messages[0].message_seq - this
						.limit : 0
					this.start_message_seq = +messages[0].message_seq - 1
					this.newList = [...nlist, ...this.newList]
				}
				if (!this.start_message_seq) {
					this.showtop = true
				}
				if (mode) {
					this.scrollBottom(1000)
				}
			},
			openZk() {
				this.isZk = !this.isZk
				this.isZkIcon = this.isZk ? 'arrow-up' : 'arrow-down'
			},
			// 创建会话
			connectSocket() {
				const {
					token,
					userid
				} = this
				if (token && userid) {
					this.initIm(token, userid)
				} else {
					WKSDK.shared().disconnect()
				}
			},
			initIm(token, userid) {
				WKSDK.shared().config.uid = userid
				WKSDK.shared().config.token = token
				WKSDK.shared().connect()
				// 监听会话
				this.messageListener()
			},
			// 关闭websocket【离开这个页面的时候执行关闭】
			closeSocket() {
				WKSDK.shared().disconnect()
			},
			sendSocketTask(msg) {
				let textmsg = new MessageTextCustom(msg, this.avatar);
				WKSDK.shared().chatManager.send(textmsg, new Channel(this.channel.channelID, this.channel.channelType))
			},
			messageListener() {
				WKSDK.shared().chatManager.addMessageListener((msg) => {
					console.log(msg);
					const {
						content,
						fromUID
					} = msg
					const direction = fromUID === this.userid ? 'right' : 'left'
					this.newList.push({
						type: 'content',
						direction,
						headImg: content.avatar,
						data: {
							content: content.text
						}
					})
					this.scrollBottom()
				})
			},
			send() {
				if (this.disabled || !this.sendText) return
				this.sendSocketTask(this.sendText)
				this.sendText = ''
			},
			async initContent() {
				const {
					itemInfo,
					mapGender,
					avatarMap
				} = this
				console.log(itemInfo, '-----');
				this.contentList = [{
						type: 'content',
						direction: 'right',
						headImg: avatarMap.br,
						data: {
							content: '您好，我是张三医生的助手。需要了解您的情况辅助医生诊断'
						}
					},
					{
						type: 'content',
						direction: 'right',
						headImg: avatarMap.br,
						data: {
							content: '获取用户信息的引导语。针对肿瘤患者的，以及需要医生提供什么样的帮助'
						}
					},
					{
						type: 'centerContent',
						data: {
							content: '信息仅医生可见，平台将严格保密，请放心咨询'
						}
					},
					{
						type: 'timeDate',
						data: {
							content: itemInfo.lastChatTime
						}
					},
					{
						type: 'content',
						direction: 'left',
						headImg: avatarMap.dm,
						data: {
							content: itemInfo.description
						}
					},
					{
						type: 'content',
						direction: 'right',
						headImg: avatarMap.br,
						data: {
							content: '请问您的性别是？'
						}
					},
					{
						type: 'content',
						direction: 'left',
						headImg: avatarMap.dm,
						data: {
							content: mapGender[itemInfo.gender]
						}
					},
					{
						type: 'content',
						direction: 'right',
						headImg: avatarMap.br,
						data: {
							content: '请问您的年龄是？'
						}
					},
					{
						type: 'content',
						direction: 'left',
						headImg: avatarMap.dm,
						data: {
							content: itemInfo.age + '岁'
						}
					}
				]
				if (itemInfo.imgs) {
					const urls = itemInfo.imgs.split(',')
					for (var i = 0; i < urls.length; i++) {
						this.contentList.push({
							type: 'img',
							direction: 'left',
							headImg: avatarMap.dm,
							data: {
								content: urls[i]
							}
						})
					}
				}
			},
			scrollBottom(time = 300) {
				this.scrollInto = ''
				setTimeout(() => {
					this.scrollInto = 'btmview'
				}, time)
			}
		}
	}
</script>

<style scoped lang="scss">
	.wrapper {
		height: 100vh;
		display: flex;
		flex-direction: column;
	}

	.page-content {
		flex: 1;
		overflow: hidden;
		background: linear-gradient(to bottom, #DAE7FF 2%, #EFF3FB 100%);
	}

	.chat-room {
		padding: 1rpx;
	}

	.card-item {
		margin-bottom: 32rpx;
		padding: 20rpx 20rpx 0;
		border-radius: 16rpx;
		background-color: #fff;
	}

	.font1 {
		font-size: 28rpx;
		color: #000;
		font-weight: 500;
	}

	.font2 {
		font-size: 24rpx;
		color: #333;
	}

	.desc-text {
		font-size: 24rpx;
		color: #666;
	}

	.pd-tb-16 {
		padding: 16rpx 0;
	}

	.font4 {
		color: #5178FF;
		font-size: 24rpx;
	}

	.btn-card {
		flex: 1;
		padding: 28rpx 0;
		font-size: 24rpx;
		border-top: 1rpx solid rgba(0, 0, 0, 0.1);

		.text {
			padding-left: 10rpx;
			color: #FD5454;
		}

		.color-tt {
			color: #00C777;
		}
	}

	.hd-tit {
		padding: 20rpx 32rpx;
	}

	.border-right {
		border-right: 1rpx solid rgba(0, 0, 0, 0.1);
	}

	#btmview {
		height: 10rpx;
	}

	.send-blcok {
		padding: 20rpx 32rpx 60rpx;
		background: #fff;
		box-shadow: 0rpx -8rpx 20rpx 0rpx rgba(6, 63, 150, 0.1)
	}

	.btn-scearch {
		margin-left: 24rpx;
		width: 120rpx;
		height: 60rpx;
		font-size: 28rpx;
		color: #fff;
		font-weight: 500;
		background: rgba(59, 126, 255, 0.5);
		border-radius: 60rpx;

		&.disabled {
			background-color: #999;
		}
	}

	.zhankai {
		padding: 16rpx;
		font-size: 28rpx;
		color: #999;
	}

	.zhankai-hover {
		background-color: #f4f4f4;
	}
</style>