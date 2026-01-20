<style lang="scss" scoped>
@import './asserts/launch.scss';
</style>

<template>
	<view class="page">
		<image class="home-bg" :src="`${$staticPath}temp/imgs/top_bg.png`" />
		<view class="home-head" :style="{ height: headInfo.headHeight }">
			<view class="home-title" :style="{ marginTop: headInfo.titleTop }">eAI</view>
		</view>

		<view class="home-content">
			<view class="home-welcome">欢迎使用eAI系统</view>
			<view class="home-description">请选择您需要的服务</view>
			<view class="home-buttons">
				<button class="home-button" @click="onHome('device-apply')">设备预约</button>
				<button class="home-button" @click="onHome('sign-doc')">待签署文件</button>
			</view>
			<view class="home-footer">© 2026 eAI All Rights Reserved</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			headInfo: { headHeight: '0px', titleTop: '0px', listHeight: '0px' },
			queryParams: { pageNo: 1, pageSize: 10, deviceName: "" },
			listData: { list: [], total: 0 },
		};
	},
	onShow() {
		this.getHeadInfo()
	},
	methods: {
		getHeadInfo() {
			// #ifdef MP-WEIXIN
			const popInfo = uni.getMenuButtonBoundingClientRect()
			this.headInfo.headHeight = `${popInfo.height}px`
			this.headInfo.titleTop = `${popInfo.top}px`
			this.headInfo.listHeight = `calc(100vh - ${popInfo.top + popInfo.height + 155}px)`
			// #endif
		},
		onHome(name) {
			if (name=='sign-doc'){
				this.checkUserInfo()
			}
			this.$ut.jump('/pages/tabs/tab1/'+name) 
		}
	},
};
</script>
