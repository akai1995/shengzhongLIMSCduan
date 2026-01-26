<template>
	<view class="loginPage">
		<ut-components ref="utComponents" />
		<view class="login">
			<!-- <view class="title">微信登录</view> -->
			<!-- #ifdef MP-WEIXIN -->
			<button open-type="getPhoneNumber" size="mini" class="btn" v-if="checked.length>0" @getphonenumber="getPhoneNumber">
				<!-- <u-icon name="weixin-fill" color="#fff" size="40rpx"></u-icon> -->
				<text style="margin: 0 10rpx;">手机号快捷登录</text>
			</button>
			<button size="mini" class="btn" style="background:#82848a;" v-if="checked.length == 0" @click="onSubmit()">
				<!-- <u-icon name="weixin-fill" color="#fff" size="40rpx"></u-icon> -->
				<text style="margin: 0 10rpx;">手机号快捷登录</text>
			</button>
			<!-- #endif -->
			 
			<!-- #ifdef H5 -->
			<button size="mini" class="btn" v-if="checked.length>0" @click="showTips(`请到小程序里面操作`)">手机号快捷登录</button>
			<button size="mini" class="btn" style="background:#82848a;" v-if="checked.length == 0" @click="showTips(`请到小程序里面操作`)">手机号快捷登录</button>
			<!-- #endif -->
		</view>
		<view class="clause">
			<u-checkbox-group v-model="checked"><u-checkbox name="ok" shape="circle" activeColor="#3B7EFFFF" /></u-checkbox-group>
			<text class="grey">已仔细阅读并同意</text>
			<text class="blue" @click="$ut.jump('/sub-pack/project-pages/article-detail/article-detail?type=1&name=服务条款')">《服务条款》</text>
			<text class="blue" @click="$ut.jump('/sub-pack/project-pages/article-detail/article-detail?type=2&name=隐私协议')">《隐私协议》</text>
		</view>

		<view class="other grey" v-if="false">
			<text @click="onSwitch('2')">短信登录</text>
			<text class="silod" @click="onSwitch('3')">注册新账号</text>
			<text @click="onSwitch('1')">账号登录</text>
		</view>
	</view>
</template>

<script>
	import { getExpert } from '@/app/api/system/user'
	import { registerIm } from '@/app/api/imApi'
	import { getToken } from '@/providers/auth'
	export default {
		data() { return { checked: [], wxLoginForm: {}, telCode: '' } },
		methods: {
			onSwitch(val) { this.$emit('onSwitch', val) },
			onSubmit() {
				if (this.checked.length === 0) {
					this.wxHandleLogin()
				} else {
					uni.showModal({
						title: '提示',
						content: '阅读并同意《服务条款》和《隐私协议》',
						showCancel: true,
						success: ({ confirm, cancel }) => {
							if (confirm) {
								this.checked = ['ok'];
								this.wxHandleLogin()
							}
						}
					})
				}
			},
			getPhoneNumber(e) { if (e.detail.errMsg == "getPhoneNumber:ok") { this.telCode = e.detail.code; this.wxHandleLogin() } },
			async wxHandleLogin() {
				uni.getProvider({ service: 'oauth',
					success: (res) => {
						console.log(res);
						if (~res.provider.indexOf("weixin")) {
							//登录
							uni.login({ provider: 'weixin',
								success: (loginRes) => {
									console.log("获取登录信息", loginRes);
									//设置凭证
									this.wxLoginForm.code = loginRes.code;
									//向后端发起请求
									this.sendWxLoginFormToLocalService()
								}
							})
						}
					}
				})
			},

			sendWxLoginFormToLocalService() {
				// console.log("向后端发起请求" + this.wxLoginForm);
				let params = { code: this.wxLoginForm.code, phoneCode: this.telCode }
				uni.showLoading({})
				this.$store.dispatch('WxLogin', params).then(() => {
					uni.hideLoading(); console.log("登录成功")
					// this.$modal.closeLoading(); this.distingUser()
					// return
					this.loginSuccess()

				}).catch(() => {
					uni.hideLoading()
					console.log("微信登录失败，请重新登录！")
					// this.$modal.msgError("微信登录失败，请重新登录！");
				})
			},
			// 登录成功后，处理函数
			loginSuccess(result) {
				// 公众号
				const signin = uni.getStorageSync('signin')
				const report = uni.getStorageSync('report')
				const orderReceive = uni.getStorageSync('orderReceive')
				// 设置用户信息
				this.$store.dispatch('GetWxInfo').then(res => {
					//TODO
					let id = this.$store.getters.userId; let token = getToken();
					// registerIm().then(res=>{
					// 	if(res.code==200){
					// 		// 单机模式可以直接设置地址
					// 		WKSDK.shared().config.addr = 'ws://43.228.79.53:5200'; // 默认端口为5200
					// 		// 认证信息
					// 		WKSDK.shared().config.uid = id; // 用户uid（需要在悟空通讯端注册过）
					// 		WKSDK.shared().config.token = token; // 用户token （需要在悟空通讯端注册过）
					// 		WKSDK.shared().connectManager.connect();
					// 	}
					// })

					uni.showToast({ title: '授权登录成功', icon: 'none' })
					let pages = getCurrentPages()
					const pagesNum = pages.filter(({ route }) => route === 'project-pages/login/login').length
					this.$eUni.navBack({ delta: pagesNum }); uni.removeStorageSync('orderReceive')
					uni.removeStorageSync('signin'); uni.removeStorageSync('report')
					// console.log(this.$store.getters.userType);
					// if (this.$store.getters.userType == 1) {
					// 	if (orderReceive) { this.$eUni.reLaunch({ url: '/pagesB/order/orderReceive' }) } 
					//  else { this.$eUni.reLaunch({ url: '/pagesC/doctor-index/doctor-index' }) }
					// } else {
					// 	// if (signin) { this.$eUni.reLaunch({ url: '/pagesA/signin/signin' }) }
					// 	// else if (report) { this.$eUni.reLaunch({ url: '/pages/report/report' }) } 
					//  // else { this.$eUni.reLaunch({ url: '/pages/launch/launch' }) }
					// 	uni.removeStorageSync('signin'); uni.removeStorageSync('report')
					// }
					uni.$emit('refresh')
				})
			},

			//区分用户
			// distingUser(){
			// 	let userId = this.$store.getters.userId
			// 	getExpert(userId).then(res=>{
			// 		if(res.data){
			// 			this.$store.commit('SET_USER_TYPE',res.data.expertState)
			// 			console.log('userType',this.$store.getters.userType)
			// 		}
			// 	})
			// }

		}
	}
</script>

<style lang="scss" scoped>
	.loginPage{
		.login {
			margin-top: -140rpx !important;
			position: relative;
			border-radius: 20rpx;
			min-height: 160rpx;
			width: 90%; margin: auto;
			z-index: 1; padding: 40rpx;
			// background: #fff;
			box-sizing: border-box;
			.title {
				font-size: 48rpx;
				font-weight: bold;
				letter-spacing: 2rpx;
			}

			.btn {
				// margin-top: 40rpx;
				width: 100%; height: 80rpx;
				background: linear-gradient(135deg, #00DEFF 0%, #0C5FFF 100%);
				border-radius: 80rpx; display: flex;
				align-items: center; justify-content: center;
				color: #fff; font-size: 36rpx;
				font-weight: bold;
				letter-spacing: 2rpx;
			}
		}

		.clause {
			margin-top: 20rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			font-size: 24rpx;
		}

		.other {
			margin-top: 60rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			font-size: 24rpx;

			text {
				margin: 0 40rpx;
			}

			.silod {
				padding: 0 39rpx; margin: 0;
				box-sizing: border-box;
				border-left: 1rpx solid #D9D9D9FF;
				border-right: 1rpx solid #D9D9D9FF;
			}
		}
	}
</style>