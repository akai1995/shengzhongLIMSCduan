<template>
	<!--  -->
    <z-paging 
        ref="paging" :paging-style="{ backgroundColor: '#F7F8FA' }" v-model="dataList" @query="queryList"
        :fixed="true" :auto="false" :refresher-enabled="false" :auto-show-back-to-top="true" :auto-scroll-to-top-when-reload="false"
        :loading-more-enabled="false" :show-refresher-when-reload="false" hide-empty-view
    >
        <view slot="top"><u-navbar  :title="param.name" :fixed="false" background="transparent" color="#000" left-icon-color="#000" @leftClick="onBack" /></view>
        <view class="pubArticleDetail">
            <view class="detail br10">
                <u-skeleton v-if="!firstLoaded" rows="18" loading animation bgColor="transparent" />
                <u-parse :html="param.content||param.name" :selectable="true" :show-with-animation="true" />
            </view>
        </view>
    </z-paging>
</template>

<script>
export default {
	data() {
        return {
            dataList: [], firstLoaded: false,
            param: { id: '', name: '', content: '' }
        }
	},
    onLoad(options) {
        console.log('onLoad：', options);
        uni.setNavigationBarTitle({ title: options.name });
        this.param = { id: '', name: options.name, content: '' }
        setTimeout(()=>{
            this.firstLoaded = true;
        }, 2750)
    },
	methods: {
		queryList(pageNo, pageSize) {
			this.$refs.paging.endRefresh()
            // this.$refs.paging.complete([])
            this.firstLoaded = true;
            uni.hideLoading();
		}
    }
}
</script>

<style scoped lang="scss">
	.pubArticleDetail {
		padding: 20rpx;
		.detail {
			background: #fff;
			padding: 25rpx 30rpx;
			color: #333;
			font-size: 28rpx;
			line-height: 58rpx;
		}
	}
</style>
