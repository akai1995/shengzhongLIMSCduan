<style lang="less" scoped>
@import './asserts/sign-doc.less';
</style>

<template>
	<z-paging ref="zPagingRef" class="page" :paging-style="{backgroundColor: 'white'}" v-model="dataList" @query="queryList" :fixed="true" :auto="false" :auto-show-back-to-top="true" :enable-back-to-top="true" :show-refresher-when-reload="true" :auto-scroll-to-top-when-reload="false" :auto-clean-list-when-reload="true" :safe-area-inset-bottom="true" empty-view-text="暂无数据">
		<view slot="top" style="position: relative; box-sizing: border-box;">
			<image class="home-bg" :src="$staticPath+'device-appointment/image 39.png'" />
			<!-- <view class="home-head" :style="{ height: headInfo.headHeight }">
				<view class="home-title" :style="{ marginTop: headInfo.titleTop }">待签署文件</view>
			</view> -->
			<u-navbar title="待签署文件" bgColor="transparent" :fixed="false"><view class="u-nav-slot" slot="left"></view></u-navbar>
			<view class="home-search">
				<u--input border="surround" placeholder="请输入关键词" suffixIcon="search" suffixIconStyle="color: #909399" @change="handleSearch" />
			</view>
		</view>
		<view class="home-content">
			<view class="luBox">
            	<u-skeleton v-if="!firstLoaded&&dataList.length === 0" rows="10" title loading />
      			<project-sign-doc-item v-for="item,idx in dataList" :key="item.id" :item="item" :hideLine="dataList.length-1==idx" />
			</view>
		</view>
		<ut-bottomNav slot="bottom" :value="0"></ut-bottomNav>
	</z-paging>
</template>

<script>
// 注意：这里需要替换为实际的API调用
import { getSignFileList } from '@/app/api/signPaper/index.js'

export default {
	data() {
		return {
			headInfo: { headHeight: '0px', titleTop: '0px', listHeight: '0px' },
			queryParameter: { pageNo: 1, pageSize: 10, signUserId: "" },
			dataList: [], totalCount: 0, firstLoaded: false
		};
	},
	onShow() {
		this.getHeadInfo()
	},
	mounted() {
		setTimeout(() => {
		this.$refs.zPagingRef && this.$refs.zPagingRef.refresh();
		}, 250);
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
		checkUserInfo() {
			const id = this.$store.getters.userId
			if (!id) {
				this.$ut.jump("/project-pages/login/login");
				return;
			}
		},
		queryList(pageNo, pageSize) {
			// this.$refs.zPagingRef.endRefresh()
			this.queryParameter.pageNo = pageNo
			this.queryParameter.pageSize = pageSize
			const type = pageNo>1 ? 'search': ''
			getSignFileList(this.queryParameter).then((resp) => {
				this.totalCount = resp.result.total
				this.$refs.zPagingRef.complete(resp.result.records)
			}).catch(()=>{
				this.$refs.zPagingRef.complete(false)
			}).finally(()=>{
				this.firstLoaded = true;
				uni.hideLoading();
			});
		},
		handleSearch(e) {
			const searchData = e
			this.queryParameter.keyword = searchData
			this.$refs.zPagingRef && this.$refs.zPagingRef.refresh();
		},
		handleGoSign(id) {
			this.checkUserInfo()
			this.$ut.jump(`/pages/tabs/tab1/doc-sign?id=${id}&showSign=true`);
		}
	},
};
</script>