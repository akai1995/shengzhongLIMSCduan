<template>
	<z-paging 
        ref="paging" class="reserve" :paging-style="{ backgroundColor: '#F7F8FA' }" v-model="dataList" @query="queryList"
        :fixed="true" :auto="false" :auto-show-back-to-top="true" :enable-back-to-top="true" :show-refresher-when-reload="true"
        :auto-scroll-to-top-when-reload="false" :auto-clean-list-when-reload="true" :safe-area-inset-bottom="true"
        empty-view-text="暂无数据" :loading-more-no-more-text="`已加载完，共${totalCount}条记录`"
    >
		<ut-nav slot="top" title="我的预约" @onBack="handleGoUser" border></ut-nav>
        <view class="reserve-list">
            <u-skeleton v-if="!firstLoaded&&dataList.length==0" rows="15" title loading />
            <project-reserve-item v-for="item,idx in dataList" :key="item.id" :item="item" :hideLine="dataList.length-1==idx" />
        </view>
    </z-paging>
</template>

<script>
import { getReserveList } from '@/app/api/device/index.js'

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
			this.$refs.paging && this.$refs.paging.refresh();
		}, 250);
	},
    methods: {
		queryList(pageNo, pageSize) {
			this.queryParameter.pageNo = pageNo
			this.queryParameter.pageSize = pageSize
			getReserveList(this.queryParameter).then((resp) => {
				this.totalCount = resp&&resp.result?resp.result.total : 0 
				this.$refs.paging.complete(resp&&resp.result?resp.result.records:false)
			}).catch(()=>{
				this.$refs.paging.complete(false)
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
<style lang="scss" scoped>
.reserve {
	width: 100%;
	box-sizing: border-box;
	background-color: #fff;
	.reserve-list {
		width: 100%;
		box-sizing: border-box;
		padding: 20rpx;
		height: 90vh;
		overflow-y: auto;
	}
}
</style>
