<template>
	<view>
		<ut-nav border></ut-nav>
		<view class="page">
			<scroll-view class="view" scroll-y :scroll-into-view="scrollId" :style="{'top':systemInfomations }">
				<view v-for="(item,index) in chatList" :key="index" :id="'scrollView'+ index" class="view-item">
					<view class="item flex_col" :class=" item.type == 1 ? 'push':'pull' ">
						<image :src="item.userImg" mode="aspectFill" class="pic"></image>
						<view class="content">{{item.content}}</view>
					</view>
				</view>
			</scroll-view>
			<view class="bottom">
				<input class="input" type="text" v-model="message" placeholder="请输入~">
				<view class="btn">
					<u-button style="width: 100rpx" type="primary" size="mini" text="发送" @click="send"></u-button>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		getUserMessage,
		getMessageSon,
		updateMessageSon,
		getUserInformation
	} from '@/api/system/user.js'
	import baseUrl from '@/config.js'
	export default {
		data() {
			return {
				message: '',
				chatList: [],
				scrollId: 'scrollView0',
				contentId: '',
				socketTask: null,
				// 确保websocket是打开状态
				is_open_socket: false,
				fromId: '', //接收人id
				fromName: '', //接收人name
				fromImg: '', //接收人img

				timeout: 1000 * 30,
				timeoutObj: null,
				
				msgId:'', //是否已读id
				
				systemInfomations:uni.getSystemInfoSync().statusBarHeight + 44 +'px',
				
			};
		},
		onLoad(optins) {
			if (optins.senderId) {
				this.getMessage(optins.senderId)
				this.fromId = optins.senderId
				this.fromName = optins.fromName
				this.contentId = this.$store.getters.userId + '-' + optins.senderId
			}
			this.connectSocketInit()
			// this.getHeadImg()
		
		},
		methods: {
			getMessage(id) {
				getUserMessage({
					senderId: id,
					receiverId:this.$store.getters.userId
				}).then(res => {
					if (res.code == 200) {
						// if(res.data.messageSon.length == 0){
						// 	return
						// } 
						this.msgId = res.data.messageMain.id
						this.read()
						res.data.messageSon.forEach(item => {
							if (this.$store.getters.userId == item.userId) {
								this.$set(item, 'type', 1)
							} else {
								this.$set(item, 'type', 2)
							}
							this.chatList.push(item)
							console.log('list',this.chatList)
							this.scrollId = 'scrollView' + (this.chatList.length - 1)
						})
					}
				})
			},
			read() {
				let params = {
					msgId: this.msgId,
					userId: this.$store.getters.userId
				}
				updateMessageSon(params).then(res => {})
			},
			send() {
				if (this.message.length == 0) {
					this.$ut.showText('内容不能为空')
					return
				}
				this.chatList.push({
					type: 1,
					userImg: this.$store.getters.avatar,
					content: this.message
				})
				this.scrollId = 'scrollView' + (this.chatList.length - 1)
				// console.log('send:', this.message)
				// console.log('list:', this.chatList)
				this.clickRequest()
				this.message = null
			},
			connectSocketInit() {
				let that = this
				// 创建一个this.socketTask对象【发送、接收、关闭socket都由这个对象操作】
				this.socketTask = uni.connectSocket({
					// 【非常重要】必须确保你的服务器是成功的,如果是手机测试千万别使用ws://127.0.0.1:9099【特别容易犯的错误】
					url: baseUrl.wsUrl+"/ws/websocket/" + this.contentId,
					success(data) {
						console.log("websocket连接成功", data);
						that.open() //1、判断是否打开连接
						that.scoketMessage(); //2、判断websocket服务器是否返回信息
						that.TimeOut(); //3、websocket超时操作
					},
				});

				// 消息的发送和接收必须在正常连接打开中,才能发送或接收【否则会失败】
				this.socketTask.onOpen((res) => {
					console.log("WebSocket连接正常打开中...！");
					this.is_open_socket = true;
					// 注：只有连接正常打开中 ，才能正常成功发送消息
					// 注：只有连接正常打开中 ，才能正常收到消息
					this.socketTask.onMessage((res) => {
						if(res.data == 'PING_SUCCESS'){
							return
						}
						let data = JSON.parse(res.data)
						// console.log("收到服务器内容：" + res.data);
						if (data.connectId) {
							this.chatList.push({
								type: 2,
								content: data.message,
								userImg: this.fromImg || 'https://genepiapi.ypzlfx.com/file/genepi/2023/07/20/OxbWNs6SoNLF1129151bdb41b25719e93409dc3a1f5b_20230720170831A016.jpg'
							})
						}
					});
				})
				// 这里仅是事件监听【如果socket关闭了会执行】
				this.socketTask.onClose(() => {
					console.log("已经被关闭了")
				})
			},
			// 关闭websocket【离开这个页面的时候执行关闭】
			closeSocket() {
				this.socketTask.close({
					success(res) {
						this.is_open_socket = false;
						console.log("关闭成功", res)
					},
					fail(err) {
						console.log("关闭失败", err)
					}
				})
			},
			clickRequest(e) {
				let params = {
					connectId: this.fromId + '-' + this.$store.getters.userId,
					fromName: this.$store.getters.name,
					fromId: this.$store.getters.userId,
					toName: this.fromName,
					toId: this.fromId,
					message: this.message
				}
				if (this.is_open_socket) {
					// websocket的服务器的原理是:发送一次消息,同时返回一组数据【否则服务器会进去死循环崩溃】
					if (e == 'PING') {
						this.socketTask.send({
							data: 'PING',
							async success() {
								console.log("** PING **");
							},
						});
					}else{
						this.socketTask.send({
							data: JSON.stringify(params),
							// data:this.message,
							async success() {
								console.log("** 消息发送成功 **");
							},
						});
					}
					
				}
			},

			getHeadImg() {
				getUserInformation(this.fromId).then(res => {
					if (res.code == 200) {
						console.log('=====', res.data)
						this.fromImg = res.data.avatar
					}
				})
			},

			//连接成功
			open() {
				let that = this;
				uni.onSocketOpen((res) => {
					console.log("WebSocket连接成功....");
					that.reset(); //连接成功之后做两秒的一次连接(心跳机制)
				});
			},
			//服务器返回信息
			scoketMessage() {
				let that = this;
				uni.onSocketMessage(function(res) {
					//获取服务器返回内容，并获取当前时间戳以作服务器超时判断
					console.log("收到服务器内容：" + res.data);
					that.serveTime = new Date().getTime();
					//以下可以写服务器返回之后具体操作

				});
			},
			//超时响应
			TimeOut() {
				let that = this;
				setInterval(function() {
					let times = new Date().getTime();
					if (times - that.serveTime > 2000) {
						//以下做超时后的操作
					}
				}, 500);
			},
			// 连接失败
			error() {
				let that = this;
				uni.onSocketError(function(res) {
					console.log("WebSocket连接打开失败，请检查！");
					that.initScokets(); //连接失败之后，重新向服务器发起连接
				});
			},
			// 心跳响应
			reset() {
				let that = this;
				clearInterval(that.timeoutObj);
				that.timeoutObj = setInterval(function() {
					//做一个判断：在没有获取某个值货值其他需求下，做个无响应的websocket连接。否则就做一个有响应的连接
					uni.$on("screenObj", (res) => {
						that.transferValue = res;
						console.log(that.transferValue);
					});
					if (
						that.transferValue == {} ||
						that.transferValue == undefined ||
						that.transferValue == null
					) {
						that.clickRequest('PING');
					} else {
						uni.sendSocketMessage({
							data: `{"event":"pushStatus","tpid":"${that.transferValue.tipId}"}`, //data值根据实际需求赋值
							success: (res) => {
								console.log("正在发送....");
							},
							fail: (err) => {
								console.log("发送失败,重新连接....");
								that.initScokets();
							},
						});
					}

					// 结束同屏
					uni.$on("cancelsObj", (res) => {
						that.consoleValue = res;
						console.log(that.consoleValue);
						if (
							that.consoleValue !== {} ||
							that.consoleValue !== undefined ||
							that.consoleValue !== null
						) {
							that.clickRequest();
						}
					});
				}, this.timeout);
			},

		}
	}
</script>

<style lang="less">
	.page {
		width: 100%;
		min-height: 100vh;
		background: linear-gradient(20deg, rgba(115, 192, 255, 0) 0%, #5CB4FC 100%);
	}

	.view-item:first-of-type{
		padding-top: 20rpx;
	}
	.view-item:last-of-type{
		padding-bottom: 20rpx;
	}
	.view {
		background: rgba(255, 255, 255, 0.2);
		width: 100%;
		// height: calc(100vh - 110rpx);
		position: fixed;
		left: 0;
		right: 0;
		bottom: 100rpx;
	}

	.item {
		display: flex;
		align-items: center;
		margin-bottom: 20rpx;
		padding: 0 30rpx;
		box-sizing: border-box;
		margin-top: 10rpx;

		.pic {
			width: 92rpx;
			height: 92rpx;
			border-radius: 50%;
			flex-shrink: 0;
		}

		.content {
			padding: 20rpx;
			border-radius: 4px;
			max-width: 500rpx;
			word-break: break-all;
			line-height: 52rpx;
			position: relative;
		}
	}

	/* 收到的消息 */
	&.pull {
		.content {
			margin-left: 32rpx;
			background-color: #fff;

			&::after {
				content: '';
				display: block;
				width: 0;
				height: 0;
				border-top: 16rpx solid transparent;
				border-bottom: 16rpx solid transparent;
				border-right: 20rpx solid #fff;
				position: absolute;
				top: 30rpx;
				left: -18rpx;
			}
		}
	}

	/* 发出的消息 */
	&.push {
		/* 主轴为水平方向，起点在右端。使不修改DOM结构，也能改变元素排列顺序 */
		flex-direction: row-reverse;

		.content {
			margin-right: 32rpx;
			background-color: #a0e959;

			&::after {
				content: '';
				display: block;
				width: 0;
				height: 0;
				border-top: 16rpx solid transparent;
				border-bottom: 16rpx solid transparent;
				border-left: 20rpx solid #a0e959;
				position: absolute;
				top: 30rpx;
				right: -18rpx;
			}
		}
	}

	.bottom {
		position: fixed;
		left: 0;
		bottom: 0;
		z-index: 9;
		width: 100%;
		height: 100rpx;
		background: #fff;
		padding: 20rpx 30rpx;
		box-sizing: border-box;
		display: flex;
		align-items: center;
		justify-content: space-between;

		.input {
			width: 80%;
			height: 100%;
			border: none;
			border-radius: 60rpx;
			background: #F2F2F2FF;
			padding: 0 50rpx;
			box-sizing: border-box;
		}

		.btn {
			display: flex;
			justify-content: flex-end;
		}
	}
</style>