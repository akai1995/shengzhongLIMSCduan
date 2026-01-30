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
	</view>
</template>

<script>
import { wxRegisterLogin, getWxCode } from '@/providers'
export default {
	data() { return { checked: [], wxLoginForm: {}, phoneCode: '' } },
	methods: {
		onSubmit() {
			if (this.checked.length === 0) { this.wxHandleLogin() }
			else {
				uni.showModal({
					title: '提示', content: '阅读并同意《服务条款》和《隐私协议》', showCancel: true,
					success: ({ confirm, cancel }) => { if (confirm) { this.checked = ['ok']; this.wxHandleLogin() } }
				})
			}
		},
		wxHandleLogin() {
			const _self = this;
			getWxCode().then((resp) => {
				if (resp.code==200) { _self.wxLoginForm.code = resp.wxcode; uni.showLoading({ title:'登录中...', mask: true })
					console.log({code:_self.wxLoginForm.code,phoneCode: _self.phoneCode});
					wxRegisterLogin({code:_self.wxLoginForm.code,phoneCode: _self.phoneCode}).then((res) => {
						uni.hideLoading(); console.log("获取登录用户信息", res);
						if (res.type=='success') { _self.showTips(res.tip); const pages = getCurrentPages()
							const pagesNum = pages.filter(({ route }) => route == '/sub-pack/project-pages/login/login').length
							console.info("pagesNum", pagesNum)
							_self.$eUni.navBack({ delta: pagesNum }); uni.$emit('refresh')
							// uni.removeStorageSync('orderReceive'); uni.removeStorageSync('signin'); uni.removeStorageSync('report');
						} else {
							_self.showTips(res.tip, 'error')
						}
					}).catch(() => {
						uni.hideLoading(); console.log("wxRegisterLogin error 微信登录失败，请重新登录！")
					})
				} else {
					console.log("resp.code != 200 微信登录失败，请重新登录！")
				}
			})
		},
		getPhoneNumber(event) { 
			const _self = this		
			if (event.detail) { console.log('event.detail:', event.detail); 
				const { errMsg, code, iv, encryptedData } = event.detail
				if (errMsg == "getPhoneNumber:ok") {
					_self.phoneCode = code; _self.wxHandleLogin() 
				} 
			}
		},
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