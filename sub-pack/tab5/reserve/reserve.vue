<style lang="less" scoped>
@import './asserts/reserve.less';
</style>

<template>
	<z-paging ref="zPagingRef" class="reserve" :paging-style="{backgroundColor: 'white'}" v-model="dataList" @query="queryList" :fixed="true" :auto="false" :auto-show-back-to-top="true" :enable-back-to-top="true" :show-refresher-when-reload="true" :auto-scroll-to-top-when-reload="false" :auto-clean-list-when-reload="true" :safe-area-inset-bottom="true" empty-view-text="暂无数据">
		<ut-nav slot="top" title="我的预约" @onBack="handleGoUser" border></ut-nav>
        <view class="reserve-list">
            <u-skeleton v-if="!firstLoaded&&dataList.length === 0" rows="15" title loading />
            <project-reserve-item v-for="item,idx in dataList" :key="item.id" :item="item" :hideLine="dataList.length-1==idx" />
        </view>
    </z-paging>
</template>

<script>
import { getReserveList } from '@/api/device/index.js'

export default {
    data() {
        return {
            queryParameter: { pageNo: 1, pageSize: 10 },
			dataList:[], totalCount:0, firstLoaded: false
        };
    },
    onLoad() {
        this.getReserveList()
    },
	mounted() {
		setTimeout(() => {
		this.$refs.zPagingRef && this.$refs.zPagingRef.refresh();
		}, 250);
	},
    methods: {
		queryList(pageNo, pageSize) {
			this.queryParameter.pageNo = pageNo
			this.queryParameter.pageSize = pageSize
			getReserveList(this.queryParameter).then((resp) => {
				this.totalCount = resp.result.total
				this.$refs.zPagingRef.complete(resp.result.records)
			}).catch(()=>{
				this.$refs.zPagingRef.complete(false)
			}).finally(()=>{
				this.firstLoaded = true;
				uni.hideLoading();
			});
		},
        handleGoUser() {
            this.$ut.jump(`/pages/tabs/tab5/tab5`);
        },
        handleGoDetail(id) {
            this.$ut.jump(`/sub-pack/tab5/reserve/detail?id=${id}`);
        },
    },
};
</script>
