<template>
	<z-paging 
        ref="paging" class="reserve" :paging-style="{ backgroundColor: '#F7F8FA' }" v-model="dataList" @query="queryList"
        :fixed="true" :auto="false" :auto-show-back-to-top="true" :enable-back-to-top="true" :show-refresher-when-reload="true"
        :auto-scroll-to-top-when-reload="false" :auto-clean-list-when-reload="true" :safe-area-inset-bottom="true"
        empty-view-text="暂无数据" :loading-more-no-more-text="`已加载完，共${totalCount}条记录`"
    >
		<view slot="top" class=""><u-navbar title="我的预约" :fixed="false" background="transparent" :leftIcon="$leftIcon" @leftClick="onBack" /></view>
		<u-skeleton v-if="!firstLoaded&&dataList.length==0" rows="15" title loading />
        <view class="luBox" v-else>
            <project-reserve-item v-for="item,idx in dataList" :key="item.id" :item="item" :hideLine="dataList.length-1==idx" />
        </view>
    </z-paging>
</template>

<script>
import { getReserveList as getReserveListApi } from '@/app/api/index'
export default {
    data() {
		return {
			queryParams: { pageNo: 1, pageSize: 10 },
			dataList:[], totalCount:0, firstLoaded: false
		}
	},
    mounted() {
		setTimeout(() => {
			this.$refs.paging && this.$refs.paging.refresh();
		}, 250)
	},
    methods: {
		queryList(pageNo, pageSize) {
			this.queryParams.pageNo = pageNo
			this.queryParams.pageSize = pageSize
			getReserveListApi(this.queryParams).then((resp) => {
				this.totalCount = resp&&resp.data?resp.data.total : 0 
				this.$refs.paging.complete(resp&&resp.data?resp.data.records:false)
			}).catch(()=>{
				this.$refs.paging.complete(false)
			}).finally(()=>{
				uni.hideLoading(); setTimeout(()=>{ this.firstLoaded = true; }, 1750)
			});
		},
        handleGoUser() { this.$ut.jump(`/pages/tabs/tab5/tab5`) },
        handleGoDetail(id) { this.$ut.jump(`/sub-pack/tab5/reserve/detail?id=${id}`) },
    }
}
</script>
<style lang="scss" scoped>
.reserve {
	width: 100%;
	box-sizing: border-box;
	background-color: #fff;
	.luBox {
		width: 100%;
		box-sizing: border-box;
		padding: 32rpx;
	}
}
</style>
