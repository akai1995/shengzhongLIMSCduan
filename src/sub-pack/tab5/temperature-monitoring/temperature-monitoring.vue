<template>
	<z-paging 
        ref="paging" class="temperature" :paging-style="{ backgroundColor: '#F7F8FA' }" v-model="dataList" @query="queryList"
        :fixed="true" :auto="false" :auto-show-back-to-top="true" :enable-back-to-top="true" :show-refresher-when-reload="true"
        :auto-scroll-to-top-when-reload="false" :auto-clean-list-when-reload="true" :safe-area-inset-bottom="true"
        empty-view-text="暂无数据" :loading-more-no-more-text="`已加载完，共${totalCount}条记录`"
    >
		<view slot="top" class="">
            <u-navbar title="温度监控" :fixed="false" background="transparent" :leftIcon="$leftIcon" @leftClick="onBack" />
			<u-tabs class="cusTab" :scrollable="false" :list="tabList" @click="onTabClick"></u-tabs>
            <view class="searchBox">
                <u--input
                    border="surround" v-model="queryParams.deviceName"
                    placeholder="请输入设备名称" suffixIcon="search" suffixIconStyle="color: #909399"
                    customStyle="background-color: white;" @clear="onSearch" @confirm="onSearch"
                />
            </view>
            <!-- <u-scroll-list :indicator="false" class="categoryList">
                <view v-for="(item, index) in 4" :key="index" class="category-item" :class="{ on: selCate == index }" @click="onToggle(item, index)">{{item}}</view>
            </u-scroll-list> -->
        </view>
		<u-skeleton v-if="!firstLoaded&&dataList.length==0" rows="15" title loading />
        <view class="luBox" v-else>
            <project-temperature-monitoring-item
                v-for="item,idx in dataList" :key="item.id"
                :item="item" :hideMb="dataList.length-1==idx"
            />
        </view>
    </z-paging>
</template>

<script>
import { deviceDetail, getTemperatureDevice } from '@/app/api/index'
export default {
    data() {
        return {
            tabList: [
                { name: '液氮罐', value: 'ydg' },
                { name: '冰箱', value: 'bx' }
            ],
            selCate: 0,
            queryParams: { pageNo: 1, pageSize: 10, deviceName: '', type: 'ydg' },
            dataList:[], totalCount:0, firstLoaded: false
        }
    },
	mounted() { setTimeout(() => { this.$refs.paging && this.$refs.paging.refresh(); }, 250) },
    methods: {
		queryList(pageNo, pageSize) {
			this.queryParams.pageNo = pageNo
			this.queryParams.pageSize = pageSize
            // this.totalCount = 8 
            // this.$refs.paging.complete([{},{}, {}, {}, {}, {}, {}, {}, {}, {}, {}])
            const params = {...this.queryParams,type: this.queryParams.type, deviceName: this.queryParams.deviceName }
			getTemperatureDevice(this.queryParams).then((resp) => {
				this.totalCount = resp&&resp.data?resp.data.total : 0 
				this.$refs.paging.complete(resp&&resp.data?resp.data.records:false)
			}).catch(()=>{
				this.$refs.paging.complete(false)
			}).finally(()=>{
				setTimeout(()=>{ this.firstLoaded = true; }, 1750)
				uni.hideLoading();
			});
		},
        onToggle(item, idx) {
            this.selCate = idx
        },
        onTabClick(item) {
            console.log('item::', item)
            const { name, value } = item
            this.queryParams.type = value
            setTimeout(() => { this.$refs.paging && this.$refs.paging.refresh(); }, 250)
        },
        onSearch(event) {
            console.log('search::', event)
            // this.queryParams.deviceName = event
            setTimeout(() => { this.$refs.paging && this.$refs.paging.refresh(); }, 250)
        }
    }
}
</script>
<style lang="scss" scoped>
.cusTab{
    background-color: white !important;
}
::v-deep .u-tabs {
    background-color: white !important;
}
.categoryList{
    padding: 0 24rpx;
    .category-item{
        // height: 56rpx;
        width: 100rpx;
        background: #FFFFFF;
        border-radius: 56rpx;
        border: 1rpx solid #E6E9F1;
        padding: 10rpx 32rpx;
        margin-right: 18rpx;
        &.on{
            background: #EDF5FF;
            border: 1rpx solid #0D70F3;
        }
        &.on:last-child{
            margin-right: 0;
        }
    }
}
.temperature {
	width: 100%;
	box-sizing: border-box;
	background-color: #fff;
	.luBox {
		width: 100%;
		box-sizing: border-box;
		padding: 20rpx;
	}
}
</style>
