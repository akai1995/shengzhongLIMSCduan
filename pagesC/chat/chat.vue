<template>
	<view>
		<view class="wrapper">
			<ut-nav title="在线问医生" border></ut-nav>
			<view class="d-flex js-b-c top-block">
				<view class="font-zw">您正在发起图文咨询服务…</view>
				<view class="nav-brumb flex">
					<view class="font-zw">描述问题></view>
					<view class="font-zw-h">等待回复</view>
				</view>
			</view>
			<scroll-view scroll-y="true" class="page-content" @scrolltoupper="scrolltoupper" scroll-with-animation
				:scroll-into-view="scrollInto">
				<view class="chat-room">
					<template v-if="showtop">
						<template v-for="(item, index) in contentList">
							<chatItem :type="item.type" :info="item.data" :direction="item.direction" @route="routeEdit"
								:form="form" :headImg="item.headImg" :key="index" @change="changeForm">
							</chatItem>
						</template>
					</template>

					<template v-for="(item, index) in newList">
						<chatItem :key="index" :type="item.type" :direction="item.direction" :color="item.color"
							:headImg="item.headImg" :info="item.data"></chatItem>
					</template>
					<view v-if="myOff" style="padding: 32rpx;">
						<ut-official></ut-official>
					</view>
				</view>
				<view id="btmview"></view>
			</scroll-view>
			<view class="send-blcok safe-area-inset-bottom">
				<template v-if="!status">
					<view class="d-flex js-b-c">
						<u-input v-model="description" confirmType="send" :disabled="disabled" border="no"
							adjustPosition shape="circle" fontSize="24rpx" placeholderStyle="color: #999;"
							customStyle="background: #F2F2F2;" color="#222" :placeholder="placeholder" @confirm="send"
							auto-height type="textarea" />
						<view @click="send" class="btn-scearch d-flex jc-c ai-c" :class="{ disabled: !description }">发送
						</view>
					</view>
					<view class="send-btm flex">
						<view class="btn-tag flex" @click="$ut.jump('/pagesC/consult/consult')"><u--image src="/static/images/icon_wdzx.png" width="32rpx"
								height="32rpx"></u--image>曾经问过</view>
						<view v-if="bltp" @click="uploadBltp" class="btn-uploud">
							<!-- <view @click="uploadBltp" class="btn-uploud"> -->
							<view class="tit0">上传病例图片</view>
							<view class="tit1">最多可上传3张</view>
						</view>
					</view>
				</template>
				<template v-if="status && status === '1'">
					<view class="d-flex js-b-c">
						<u-input v-model="sendText" confirmType="send" :disabled="disabled" border="no" adjustPosition
							shape="circle" fontSize="24rpx" placeholderStyle="color: #999;"
							customStyle="background: #F2F2F2;" color="#222" :placeholder="placeholder" @confirm="sendFn"
							auto-height type="textarea" />
						<view @click="sendFn" class="btn-scearch d-flex jc-c ai-c" :class="{ disabled: !sendText }">发送
						</view>
					</view>
					<view class="send-btm flex">
						<view class="btn-tag flex" @click="$ut.jump('/pagesC/consult/consult')"><u--image src="/static/images/icon_wdzx.png" width="32rpx"
								height="32rpx"></u--image>曾经问过</view>
						<view class="btn-tag flex"><u--image src="/static/images/icon_sctp.png" width="32rpx"
								height="32rpx"></u--image>上传图片</view>
					</view>
				</template>
			</view>
		</view>
		<u-picker :show="showAge" ref="uPicker" :columns="columnsAge" defaultIndex="33" keyName="label"
			@confirm="confirmAge" confirmColor="#3B7EFF" title="选择年龄"></u-picker>
	</view>
</template>

<script>
	import chatItem from '@/pagesC/components/chat-item/chat-item.vue'
	import {
		createConsultationApi,
		pageAskApi,
		getItemById
	}
	from '../../api/chat'
	import config from '@/config'
	import upload from '../../utils/upload'
	import WKSDK, {
		Channel
	}
	from 'wukongimjssdk'
	import storage from '@/utils/storage'
	import constant from '@/utils/constant'
	import {
		getToken
	}
	from '@/utils/auth'
	import {
		MessageTextCustom
	}
	from '@/imUtil/imUtils'
	import {
		loadHisMsg
	}
	from '@/api/imApi.js'
	const baseUrl = config.baseUrl
	let ecl = null
	import {
		mapGetters
	}
	from 'vuex'
	export default {
		components: {
			chatItem
		},
		data() {
			return {
				contentList: [],
				newList: [],
				form: {
					name: '匿名'
				},
				steps: 0,
				scrollInto: '',
				description: '',
				disabled: false,
				placeholder: '请尽量详细描述，有助于医生回复',
				genderMap: {
					1: '男',
					0: '女'
				},
				isMap: {
					1: '是',
					0: '否'
				},
				showAge: false,
				columnsAge: [],
				info: '',
				myOff: false, // 我的关注
				bltp: false,
				status: '',
				channel: {
					channelID: '',
					channelType: 2,
				},
				token: '',
				userid: '',
				avatarMap: {},
				itemInfo: null,
				sendText: '',
				end_message_seq: 0,
				start_message_seq: 0,
				limit: 30,
				showtop: false
			}
		},
		computed: {
			...mapGetters(['avatar'])
		},
		onLoad(options) {
			ecl = this.getOpenerEventChannel()
			ecl.on('info', (info) => {
				this.info = info
				const {
					id
				} = options
				this.channel.channelID = id || ''
				const userid = storage.get(constant.userId)
				const token = getToken()
				this.userid = userid
				this.token = token
				this.initPage()
				this.setColumnsAge()
			})
		},
		methods: {
			async initPage() {
				if (this.channel.channelID) {
					this.getItem()
				} else {
					this.initCreate()
				}
			},
			async initCreate() {
				this.contentList = [{
						type: 'card',
						data: this.info
					},
					{
						type: 'content',
						direction: 'left',
						headImg: this.info.headImg,
						data: {
							content: '您好，我是张三医生的助手。需要了解您的情况辅助医生诊断'
						}
					},
					{
						type: 'content',
						direction: 'left',
						headImg: this.info.headImg,
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
				]
				this.showtop = true
			},
			async getItem() {
				uni.showLoading({
					title: '加载中...'
				})
				const res = await getItemById(this.channel.channelID)
				uni.hideLoading()
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
				this.status = this.itemInfo.status
				if (this.itemInfo.status === '9') {
					this.disabled = true
				} else {
					this.connectSocket()
				}
			},
			async initContent() {
				const {
					itemInfo,
					genderMap,
					avatarMap
				} = this
				this.contentList = [{
						type: 'card',
						data: this.info
					},
					{
						type: 'content',
						direction: 'left',
						headImg: avatarMap.dm,
						data: {
							content: '您好，我是张三医生的助手。需要了解您的情况辅助医生诊断'
						}
					},
					{
						type: 'content',
						direction: 'left',
						headImg: avatarMap.dm,
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
						direction: 'right',
						headImg: avatarMap.br,
						data: {
							content: itemInfo.description
						}
					},
					{
						type: 'content',
						direction: 'left',
						headImg: avatarMap.dm,
						data: {
							content: '请问您的性别是？'
						}
					},
					{
						type: 'content',
						direction: 'right',
						headImg: avatarMap.br,
						data: {
							content: genderMap[itemInfo.gender]
						}
					},
					{
						type: 'content',
						direction: 'left',
						headImg: avatarMap.dm,
						data: {
							content: '请问您的年龄是？'
						}
					},
					{
						type: 'content',
						direction: 'right',
						headImg: avatarMap.br,
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
							direction: 'right',
							headImg: avatarMap.br,
							data: {
								content: urls[i]
							}
						})
					}
				}
				if (this.status == '0') {
					this.contentList.push({
						type: 'centerContent',
						data: {
							content: '请耐心等待医生的回复'
						}
					}, )
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
				console.log(this.channel)
				console.log(textmsg)
				WKSDK.shared().chatManager.send(textmsg, this.channel)
			},
			sendFn() {
				if (this.disabled || !this.sendText) return
				this.sendSocketTask(this.sendText)
				this.sendText = ''
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
						direction: direction,
						headImg: content.avatar,
						data: {
							content: content.text
						}
					})
					this.status = '1'
					this.disabled = false
					this.scrollBottom()
				})
			},
			routeEdit(event) {
				if (event == 'edit') {
					let that = this
					uni.navigateTo({
						url: '/pagesC/change-advice/change-advice',
						events: {
							change(form) {
								that.form = form
							}
						},
						success(res) {
							console.log(that.contentId);
							res.eventChannel.emit('form', {
								...that.form
							})
						}
					})
				}
			},
			setColumnsAge() {
				let columnsAge = [
					[]
				]
				for (let i = 1; i < 120; i++) {
					columnsAge[0].push({
						label: i + '岁',
						id: i
					})
				}
				console.log(columnsAge);
				this.columnsAge = columnsAge
			},
			scrollBottom(time = 300) {
				console.log('滚动到底');
				this.scrollInto = ''
				setTimeout(() => {
					this.scrollInto = 'btmview'
				}, time)
			},
			send() {
				if (this.description) {
					this.form.description = this.description
					this.contentList.push({
						type: 'content',
						direction: 'right',
						headImg: this.avatar,
						data: {
							content: this.description
						}
					})
					this.contentList.push({
						type: 'leftContentXb',
						data: {
							field: 'gender'
						}
					})
					this.description = ''
					this.disabled = true
					this.scrollBottom()
				}
			},
			changeForm(event) {
				console.log(event);
				const {
					field,
					value
				} = event
				this.form[field] = value
				if (field == 'gender') {
					this.contentList.push({
						type: 'content',
						direction: 'right',
						headImg: this.avatar,
						data: {
							content: this.genderMap[value]
						}
					})
					this.scrollBottom()
					setTimeout(() => {
						this.contentList.push({
							type: 'content',
							direction: 'left',
							headImg: this.info.headImg,
							data: {
								content: '请问您的年龄是？'
							}
						})
						this.scrollBottom()
						setTimeout(() => {
							this.showAge = true
						}, 500)
					}, 500)
				}
				if (field == 'isImg') {
					this.contentList.push({
						type: 'content',
						direction: 'right',
						headImg: this.avatar,
						data: {
							content: this.isMap[value]
						}
					})
					if (+value) {
						this.bltp = true
					} else {
						this.submitConsult()
						this.myOff = true
					}
				}
			},
			confirmAge(event) {
				console.log(event);
				const {
					value
				} = event
				this.form.age = value[0].id
				this.showAge = false
				this.contentList.push({
					type: 'content',
					direction: 'right',
					headImg: this.avatar,
					data: {
						content: value[0].label
					}
				})
				this.contentList.push({
					type: "leftContentZP",
					headImg: this.info.headImg,
					data: {
						field: 'isImg',
					}
				})
				this.scrollBottom()
			},
			async uploadBltp() {
				const files = await uni.chooseImage({
					count: 3
				})
				console.log(files);
				const tempFilePaths = files[1].tempFilePaths
				const promises = tempFilePaths.map(filePath => upload({
					filePath,
					url: '/file/upload'
				}))
				Promise.all(promises).then(res => {
					console.log(res);
					const isflag = res.some(({
						code
					}) => code !== 200)
					if (isflag) return
					const urls = res.map(({
						data
					}) => data.url)
					urls.forEach(item => {
						this.contentList.push({
							direction: 'right',
							headImg: this.avatar,
							type: 'img',
							data: {
								content: item
							}
						})
					})
					this.bltp = false
					this.form.imgs = urls.join(',')
					this.scrollBottom()
					this.submitConsult()
					this.myOff = true
				})
			},
			async submitConsult() {
				const {
					age,
					gender,
					imgs,
					description
				} = this.form
				const params = {
					age,
					imgs,
					description,
					gender: gender,
					expertId: this.info.id
				}
				const res = await createConsultationApi(params)
				if (!res || res.code !== 200) return
				this.status = res.data.status
				this.form.id = res.data.id
				this.channel.channelID = res.data.id
				this.steps = 3
				this.contentList.push({
					type: 'leftContentXG',
				})
				this.contentList.push({
					type: 'centerContent',
					data: {
						content: '医生将稍后给出回复',
						color: '#3B7EFF'
					}
				})
				this.scrollBottom()
				this.connectSocket()
			}
		},
		onUnload() {
			this.closeSocket()
		}
	}
</script>

<style lang="scss">
	.wrapper {
		height: 100vh;
		display: flex;
		flex-direction: column;
	}

	.top-block {
		padding: 22rpx 32rpx;
		background-color: #fff;
		border-bottom: 1rpx solid rgba(0, 0, 0, 0.1);
	}

	.chat-room {
		padding: 1rpx;
	}

	.page-content {
		flex: 1;
		overflow: hidden;
		background: linear-gradient(to bottom, #DAE7FF 2%, #EFF3FB 100%);
	}

	.font-zw {
		font-size: 24rpx;
		color: #666;
	}

	.font-zw-h {
		font-size: 24rpx;
		color: #222;
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

	.send-btm {
		padding: 32rpx 0;
	}

	.btn-tag {
		padding: 10rpx 24rpx;
		font-size: 24rpx;
		color: #3B7EFF;
		margin-right: 16rpx;
		background-color: #EBF2FF;
		border-radius: 60rpx;
	}

	.pb-32 {
		padding-bottom: 18rpx;
	}

	.official-box {
		padding: 24rpx 32rpx;
		border-radius: 12rpx;
		background-color: #fff;

		.hs-bg {
			padding: 10rpx 32rpx;
			background-color: #F2F2F2;
		}

		.desc-gz {
			padding: 6rpx 0;
			font-size: 32rpx;
			color: #666;
		}
	}

	.btn-bim {
		height: 72rpx;
		font-size: 28rpx;
		font-weight: 500;
		color: #fff;
		background: linear-gradient(135deg, #00DEFF 0%, #0C5FFF 100%);
		border-radius: 80rpx;
	}

	.mt-32 {
		margin-top: 32rpx;
	}

	.mb-32 {
		margin-bottom: 32rpx;
	}

	.gz-btm-text {
		font-size: 24rpx;
		color: #222;
	}

	#btmview {
		height: 10rpx;
	}

	.btn-uploud {
		width: 216rpx;
		height: 68rpx;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		background-color: #3B7EFF;
		border-radius: 12rpx;

		.tit0 {
			color: #fff;
			font-size: 24rpx;
		}

		.tit1 {
			font-size: 20rpx;
			color: rgba(255, 255, 255, 0.5);
		}
	}
</style>