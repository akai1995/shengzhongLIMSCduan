<template>
	<z-paging
		ref="paging" class="tab5Page" :paging-style="{ backgroundColor: '#F7F8FA' }" v-model="dataList" @query="queryList"
		:fixed="true" :auto="false" :refresher-enabled="false" :auto-show-back-to-top="true" :auto-scroll-to-top-when-reload="false"
		:loading-more-enabled="false" :show-refresher-when-reload="false" hide-empty-view
	>
		<view slot="top" style="position: relative; box-sizing: border-box;">
			<image class="home-bg" :src="`${$staticPath}imgs/userBg.png`" />
			<!-- <view class="detail-head" :style="{ height: headInfo.headHeight }"><view class="detail-title" :style="{ marginTop: headInfo.titleTop }">我的</view></view> -->
			<u-navbar title="我的" :fixed="false" bgColor="transparent"><view class="u-nav-slot" slot="left"></view></u-navbar>
		</view>

		<view class="">
			<view class="detail-info">
				<view class="detail-info-icon"><image class="detail-info-img" :src="`${$staticPath}imgs/default_head.png`" /></view>
				<view class="detail-info-message">
					<view class="detail-info-message-name">{{ userName }}</view>
					<view class="detail-info-message-sub">欢迎使用设备智约助手</view>
				</view>
			</view>
			<view class="menuBox">
				<view
					v-for="(menu,idx) in menuList" :key="idx" class="menuItem"
					:class="{'pubBotLine': idx < menuList.length - 1 }" @click="onJump(menu)"
				>
					<view class="menuItemIcon"><u-icon :name="menu.icon" size="36rpx" /></view>
					<view class="menuItemText">{{menu.name}}</view>
					<view class="menuItemArror"><u-icon name="arrow-right" size="32rpx" /></view>
				</view>
			</view>
		</view>
		<ut-bottomNav slot="bottom" :value="1" />
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
                // {
                //     name:'我的预约', path: '/sub-pack/tab5/reserve/reserve',
                //     icon: `${this.$staticPath}imgs/icon-reserver.png`
                // },
                // {
                //     name:'我的待签署', path: '/sub-pack/tab5/sign-doc/sign-doc',
                //     icon: `${this.$staticPath}imgs/icon-reserver.png`
                // },
                {
                    name:'联系客服', path: '',
                    icon: `${this.$staticPath}imgs/icon-service.png`
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
			this.headInfo.headHeight = `${popInfo.height}px`; this.headInfo.titleTop = `${popInfo.top}px`
			this.headInfo.listHeight = `calc(100vh - ${popInfo.top + popInfo.height + 155}px)`
			// #endif
		},
		onJump(item) {
            if (item.path) {
            	if (!this.checkUserInfo()){ return }
			    this.$ut.jump(item.path);
            } else {
			    // uni.showToast({ title: "敬请期待", icon: "none", });
            }
		}
	},
};
</script>
<style lang="scss" scoped>
.tab5Page {
	position: relative;
	width: 100%;
	min-height: 100vh;
	overflow: hidden;
	box-sizing: border-box;
	background-color: #fff;
	.home-bg {
		position: absolute;
		width: 100%;
		height: auto;
		aspect-ratio: 2.435/1;
		top: 0; left: 0;right: 0;
	}
}
.detail-bg {
	position: absolute;
	width: 100%;
	height: auto;
	aspect-ratio: 1.13/1;
	top: 0;
	left: 0;
}

.detail-head {
	position: relative;
	width: 100%;

	.detail-title {
		position: relative;
		width: 100%;
		text-align: center;
		line-height: 64rpx;
		font-weight: 500;
		font-size: 34rpx;
		color: #000000;
		text-align: center;
	}
}
.detail-info {
	position: relative;
	width: 100%;
	padding: 0 40rpx;
	box-sizing: border-box;
	display: flex;
	align-items: center;
	margin-top: 70rpx;
	.detail-info-icon {
		position: relative;
		width: 55px;
		height: 55px;
		background-color: #fff;
		border-radius: 50%;
		overflow: hidden;
		.detail-info-img {
			position: relative;
			width: 100%;
			height: 100%;
			display: block;
		}
	}
	.detail-info-message {
		position: relative;
		margin-right: auto;
		padding-left: 20rpx;
		box-sizing: border-box;
		.detail-info-message-name {
			position: relative;
			width: 100%;
			font-weight: 500;
			font-size: 48rpx;
			color: #000000;
			line-height: 56rpx;
		}
		.detail-info-message-sub {
			position: relative;
			width: 100%;
			font-weight: 400;
			font-size: 28rpx;
			color: #7a7171;
			line-height: 32rpx;
			margin-top: 10rpx;
		}
	}
}
.menuBox {
	width: calc(100% - 80rpx);
	border-radius: 20rpx 20rpx;
	margin: 40rpx;
	padding: 20rpx 40rpx;
	box-sizing: border-box;
	background-color: #fff;
	margin-top: 60rpx;
	.menuItem {
		position: relative;
		padding: 10rpx 48rpx;
		width: 100%;
		box-sizing: border-box;
		line-height: 50rpx;
		.menuItemIcon {
			position: absolute;
			top: 50%;
			left: 0;
			transform: translateY(-50%);
		}
		.menuItemText {
			color: #000000;
			font-weight: 400;
			font-size: 28rpx;
			line-height: 50rpx;
		}
		.menuItemArror {
			position: absolute;
			top: 50%;
			right: 0;
			transform: translateY(-50%);
		}
	}
}
</style>