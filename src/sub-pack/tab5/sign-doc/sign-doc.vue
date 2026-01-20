<template>
	<z-paging 
		ref="paging" class="page" :paging-style="{ backgroundColor: 'white' }" v-model="dataList" @query="queryList"
		:fixed="true" :auto="false" :auto-show-back-to-top="true" :enable-back-to-top="true" :show-refresher-when-reload="true"
		:auto-scroll-to-top-when-reload="false" :auto-clean-list-when-reload="true" :safe-area-inset-bottom="true"
		empty-view-text="暂无数据" :loading-more-no-more-text="`已加载完，共${totalCount}条记录`"
	>
		<view slot="top" style="position: relative; box-sizing: border-box;">
			<image class="home-bg" :src="`${$staticPath}temp/imgs/top_bg.png`" />
			<!-- <view class="home-head" :style="{ height: headInfo.headHeight }"><view class="home-title" :style="{ marginTop: headInfo.titleTop }">待签署文件</view></view> -->
			<u-navbar title="我的待签署" :fixed="false" bgColor="transparent" @leftClick="onBack" />
			<view class="home-search">
				<u--input border="surround" placeholder="请输入文件名称" suffixIcon="search" suffixIconStyle="color: #909399" customStyle="background-color: white;" @change="onSearch" />
			</view>
		</view>
		<view class="home-content">
			<!-- <project-home-card /> -->
			<view class="luBox">
				<view class="luTitle">待签署文件列表</view>
            	<u-skeleton v-if="!firstLoaded&&dataList.length==0" rows="8" title loading />
      			<project-sign-doc-item v-for="item,idx in dataList" :key="item.id" :item="item" :hideLine="dataList.length-1==idx" />
			</view>
		</view>
	</z-paging>
</template>

<script>
// 注意：这里需要替换为实际的API调用
import { getSignFileList } from '@/app/api/signPaper/index.js'

export default {
	data() {
		return {
			headInfo: { headHeight: '0px', titleTop: '0px', listHeight: '0px' },
			queryParams: { pageNo: 1, pageSize: 10, signUserId: "" },
			dataList: [], totalCount: 0, firstLoaded: false
		};
	},
	onShow() {
		this.getHeadInfo()
	},
	mounted() {
		setTimeout(() => {
			this.$refs.paging && this.$refs.paging.refresh();
		}, 250);
	},
	methods: {
		getHeadInfo() {
			// #ifdef MP-WEIXIN
			// const popInfo = uni.getMenuButtonBoundingClientRect()
			// this.headInfo.headHeight = `${popInfo.height}px`
			// this.headInfo.titleTop = `${popInfo.top}px`
			// this.headInfo.listHeight = `calc(100vh - ${popInfo.top + popInfo.height + 155}px)`
			// #endif
		},
		queryList(pageNo, pageSize) {
			// this.$refs.paging.endRefresh()
			this.queryParams.pageNo = pageNo
			this.queryParams.pageSize = pageSize
			const type = pageNo>1 ? 'search': ''
			getSignFileList(this.queryParams).then((resp) => {
				this.totalCount = resp&&resp.result?resp.result.total : 0 
				this.$refs.paging.complete(resp&&resp.result?resp.result.records:false)
			}).catch(()=>{
				this.$refs.paging.complete(false)
			}).finally(()=>{
				setTimeout(()=>{ this.firstLoaded = true; }, 1750)
				uni.hideLoading();
			});
		},
		onSearch(e) {
			const searchData = e
			this.queryParams.keyword = searchData
			this.$refs.paging && this.$refs.paging.refresh();
		},
		handleGoSign(id) {
            if (!this.checkUserInfo()){ return }
			this.$ut.jump(`/pages/tabs/tab1/doc-sign?id=${id}&showSign=true`);
		}
	},
};
</script>
<style lang="scss" scoped>
.page {
	box-sizing: border-box;
}

	.home-bg {
		position: absolute;
		width: 100%;
		height: auto;
		aspect-ratio: 2.435/1;
		top: 0; left: 0;right: 0;
	}

	.home-head {
		position: relative;
		width: 100%;

		.home-title {
			width: 100%;
			line-height: 32rpx;
			font-weight: 500;
			font-size: 32rpx;
			color: #000000;
			text-align: center;
		}
	}

	.home-search {
		position: relative;
		width: 100%;
		padding: 20rpx 32rpx;
		margin: 0 auto;
		box-sizing: border-box;
	}

	.home-content {
		background-color: #fff;
		padding: 32rpx 32rpx 0;
		.luBox {
			width: 100%;
			margin-top: 20rpx;
			box-sizing: border-box;
			.luTitle{
				font-weight: bold;
				color: #222;
				font-size: 34rpx;
				line-height: 70rpx;
			}
		}
	}
</style>
