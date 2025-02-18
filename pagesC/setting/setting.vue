<template>
	<view class="wrapper">
		<ut-nav iconName="home" title="设置" url="/pagesC/doctor-index/doctor-index"></ut-nav>
		<scroll-view class="page-content" scroll-with-animation scroll-y>
			<view @click="toolRoute({ url: '/pagesC/person-info/person-info' })" class="desc-row d-flex js-b-c">
				<view class="desc-text d-flex ai-c"><image class="base-icon" src="@/static/user/user_cel_icon1.png" mode=""></image> 个人资料</view>
				<u-icon name="arrow-right" color="#999" size="40rpx"></u-icon>
			</view>
			<view class="desc-row d-flex js-b-c" @click="$ut.jump('/pagesC/password/password')">
				<view class="desc-text d-flex ai-c"><image class="base-icon" src="@/static/user/user_cel_icon2.png" mode=""></image>修改登录密码</view>
				<u-icon name="arrow-right" color="#999" size="40rpx"></u-icon>
			</view>
			<view class="desc-row d-flex js-b-c" @click="$ut.jump('/pagesA/user/myFeedback')">
				<view class="desc-text d-flex ai-c"><image class="base-icon" src="@/static/user/user_cel_icon3.png" mode=""></image>意见反馈</view>
				<u-icon name="arrow-right" color="#999" size="40rpx"></u-icon>
			</view>
			<u-gap height="22rpx" bgColor="#F8F8F8"></u-gap>
			<view class="desc-row d-flex js-b-c">
				<view class="desc-text">关于我们</view>
			</view>
			<view class="desc-row d-flex js-b-c" @click="$ut.jump('/pagesA/clause/clause')">
				<view class="desc-text">服务条款</view>
			</view>
			<view class="desc-row d-flex js-b-c" @click="$ut.jump('/pagesA/clause/clause?type=2')">
				<view class="desc-text">隐私协议</view>
			</view>
			<view style="padding: 60rpx 70rpx;">
				<!-- <view class="btn-logout d-flex jc-c-c" @click="logout">退出登录</view> -->
			</view>
		</scroll-view>
		<ut-bottomNav :value="1" type="0"></ut-bottomNav>
	</view>
</template>

<script>
	import store from "@/store";
	export default {
		data() {
			return {

			}
		},
		methods: {
			leftClick(event) {
				console.log(event);
			},
			toolRoute(item) {
				const {
					url
				} = item
				if (!url) return
				uni.navigateTo({
					url
				})
			},
			onBack() {
				uni.navigateBack({
					delta: 1
				})
			},
			onHome() {
				uni.redirectTo({
					url: '/pagesC/doctor-index/doctor-index'
				})
			},
			logout() {
				uni.showModal({
					title: "退出登录",
					content: "您正在进行退出操作，是否继续？",
					cancelText: "不退出",
					confirmText: "继续退出",
					confirmColor: "#3B7EFFFF",
					success: function(res) {
						if (res.confirm) {
							store.dispatch("WxLogOut").then((res) => {
								uni.reLaunch({
									url: "/pages/index/index",
								});
							});
						} else if (res.cancel) {
							console.log("用户点击取消");
						}
					},
				});
			},
		}
	}
</script>

<style lang="scss" scoped>
	@import './setting.scss';
	.base-icon {
		width: 40rpx;
		height: 40rpx;
		margin-right: 10rpx;
	}
</style>