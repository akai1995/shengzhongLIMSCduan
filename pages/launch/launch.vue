<style lang="less" scoped>
@import './asserts/launch.less';
</style>

<template>
	<z-paging 
        ref="zPagingRef" class="launch" :paging-style="{backgroundColor: 'white'}" v-model="dataList" @query="queryList"
        :fixed="true" :auto="false" :refresher-enabled="false" :auto-show-back-to-top="true" :auto-scroll-to-top-when-reload="false"
        :loading-more-enabled="false" :show-refresher-when-reload="false" hide-empty-view
    >
		<view slot="top" style="height: 280rpx;position: relative; box-sizing: border-box;">
			<img class="launch-bg" :src="$staticPath+'device-appointment/image 39.png'" />
			<!-- <view class="launch-head" :style="{ height: headInfo.headHeight }"><view class="launch-title" :style="{ marginTop: headInfo.titleTop }">eAI</view></view> -->
			<u-navbar title="e-AI" :fixed="false" bgColor="transparent"><view class="u-nav-slot" slot="left"></view></u-navbar>
		</view>
		<view class="launch-content">
			<view class="launch-welcome">欢迎使用eAI系统</view>
			<view class="launch-description">请选择您需要的服务</view>
			<view class="launch-buttons">
				<button class="launch-button" @click="onHome('device-apply')">设备预约</button>
				<button class="launch-button" @click="onHome('sign-doc')">待签署文件</button>
			</view>
		</view>
		<view slot="bottom" class="launch-footer">© 2026 eAI All Rights Reserved</view>
	</z-paging>
</template>

<script>
export default {
	data() {
		return {
			dataList: [], totalCount: 0, firstLoaded: false,
			headInfo: { headHeight: '0px', titleTop: '0px', listHeight: '0px' },
			listData: { list: [], total: 0 },
		};
	},
	onShow() {
		this.getHeadInfo()
	},
	methods: {
		queryList(pageNo, pageSize) {
			this.$refs.zPagingRef.endRefresh()
            uni.hideLoading();
		},
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
