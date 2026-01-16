<style lang="scss" scoped>
@import './asserts/tab5.scss';
</style>

<template>
	<z-paging
		ref="paging" class="tab5Page" :paging-style="{backgroundColor: 'white'}" v-model="dataList" @query="queryList"
		:fixed="true" :auto="false" :refresher-enabled="false" :auto-show-back-to-top="true" :auto-scroll-to-top-when-reload="false"
		:loading-more-enabled="false" :show-refresher-when-reload="false" hide-empty-view
	>
		<view slot="top" style="position: relative; box-sizing: border-box;">
			<image class="home-bg" :src="`${$staticPath}temp/imgs/userBg.png`" />
			<!-- <view class="detail-head" :style="{ height: headInfo.headHeight }">
				<view class="detail-title" :style="{ marginTop: headInfo.titleTop }">我的</view>
			</view> -->
			<u-navbar title="我的" :fixed="false" bgColor="transparent"><view class="u-nav-slot" slot="left"></view></u-navbar>
		</view>

		<view class="">
			<view class="detail-info">
				<view class="detail-info-icon">
					<image class="detail-info-img" :src="`${$staticPath}temp/imgs/default_head.png`" />
				</view>
				<view class="detail-info-message">
					<view class="detail-info-message-name">{{ userName }}</view>
					<view class="detail-info-message-sub">欢迎使用设备智约助手</view>
				</view>
			</view>

			<view class="menuList">
				<view v-for="menu,idx in menuList" :key="idx" class="menuItem" :class="{'pubBotLine':menuList.length<idx}" @click="onJump(menu)">
					<u-icon class="menuItemIcon" :name="menu.icon" size="36rpx" />
					<view class="menuItem-text">{{menu.name}}</view>
					<u-icon class="menuItemArror" name="arrow-right" size="32rpx" />
				</view>
			</view>

		</view>

		<ut-bottomNav slot="bottom" :value="1"></ut-bottomNav>
	</z-paging>
</template>

<script>

export default {
	data() {
		return {
			dataList: [], firstLoaded: false,
			headInfo: { headHeight: '0px', titleTop: '0px', listHeight: '0px' },
			userName: '尊敬的用户',
            menuList: [
                {
                    name:'我的预约', path: '/sub-pack/tab5/reserve/reserve',
                    icon: `${this.$staticPath}temp/imgs/icon-reserve.png`
                },
                {
                    name:'联系客服', path: '',
                    icon: `${this.$staticPath}temp/imgs/icon-service.png`
                },
            ]
		};
	},
	onLoad() {
		this.getHeadInfo()
		// this.checkUserInfo()
	},
	methods: {
		queryList(pageNo, pageSize) {
			this.$refs.paging.endRefresh()
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
		onJump(item) {
            if (item.path) {
            	if (!this.checkUserInfo()){ return }
			    this.$ut.jump(item.path);
            } else {
			    uni.showToast({ title: "敬请期待", icon: "none", });
            }
		}
	},
};
</script>
