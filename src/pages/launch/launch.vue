<template>
	<z-paging 
        ref="paging" class="launch" :paging-style="{ backgroundColor: 'white' }" v-model="dataList" @query="queryList"
        :fixed="true" :auto="false" :refresher-enabled="false" :auto-show-back-to-top="true" :auto-scroll-to-top-when-reload="false"
        :loading-more-enabled="false" :show-refresher-when-reload="false" hide-empty-view
    >
		<view slot="top" style="height: 280rpx;position: relative; box-sizing: border-box;">
			<image class="launch-bg" :src="`${$staticPath}temp/imgs/top_bg.png`" />
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
			dataList: [], firstLoaded: false,
			headInfo: { headHeight: '0px', titleTop: '0px', listHeight: '0px' },
			listData: { list: [], total: 0 },
		};
	},
	onShow() {
		this.getHeadInfo()
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
		onHome(name) {
			if (name=='sign-doc'){
            	if (!this.checkUserInfo()){ return }
			}
			this.$ut.jump('/pages/tabs/tab1/'+name) 
		}
	},
};
</script>
<style lang="scss" scoped>
.launch {
	box-sizing: border-box;
	.launch-bg {
		position: absolute;
		width: 100%; height: auto;
		aspect-ratio: 2.435/1;
		top: 0; left: 0;
	}

	.launch-head {
		width: 100%;
		.launch-title {
			width: 100%;
			line-height: 32rpx;
			font-weight: 500;
			font-size: 32rpx;
			color: #000000;
			text-align: center;
		}
	}

	.launch-content {
		background-color: #fff;
		// padding: 32rpx;
		text-align: center;
		
		.launch-welcome {
			font-size: 48rpx;
			font-weight: 700;
			line-height: 96rpx;
			color: #303133;
		}
		
		.launch-description {
			font-size: 32rpx;
			line-height: 64rpx;
			color: #606266;
			margin-bottom: 56rpx;
		}
		
		.launch-buttons {
			align-items: center;
			display: flex;
			flex-direction: column;
			gap: 36rpx; width: 100%;
			margin: 20rpx 0;
			
			.launch-button {
				width: 80%; height: 120rpx;
				color: #fff; border: none;
				border-radius: 60rpx;
				font-size: 36rpx;
				font-weight: 600;
				line-height: 120rpx;
				text-align: center;
				box-shadow: 0 4rpx 15rpx rgba(0, 0, 0, 0.15);
				transition: all 0.3s ease;
				
				&:first-child {
					background-color: #409eff;					
					&:active { background-color: #66b1ff; }
				}
				
				&:last-child {
					background-color: #67c23a;					
					&:active { background-color: #85ce61; }
				}
			}
		}
	}
	
		
	.launch-footer {
		margin-top: auto;
		margin-bottom: 40rpx;
		font-size: 24rpx;
		color: #909399;
		text-align: center;
	}
}
</style>