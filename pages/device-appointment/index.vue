<style lang="less" scoped>
@import './asserts/index.less';
</style>

<template>
	<z-paging ref="zPagingRef" class="page" v-model="dataList" @query="queryList" :fixed="true" :auto="true" :auto-show-back-to-top="true" :enable-back-to-top="true" :show-refresher-when-reload="true" :auto-scroll-to-top-when-reload="false" :auto-clean-list-when-reload="true" :safe-area-inset-bottom="true" empty-view-text="暂无数据">
		<view slot="top" class="">
			<img class="home-bg" src="https://genepiapi.ypzlfx.com/file/device-appointment/image 39.png" />
			<view class="home-head" :style="{ height: headInfo.headHeight }">
				<view class="home-title" :style="{ marginTop: headInfo.titleTop }">实验预约</view>
			</view>
			<view class="home-search">
				<view class="home-search-input">
					<u--input border="surround" placeholder="请输入关键词" suffixIcon="search" @change="handleSearch"
						suffixIconStyle="font-size: 22px;color: #909399"></u--input>
				</view>
			</view>
		</view>
		<view class="home-content">
			<view class="f1">
				<view class="f1Card">
					<view class="f1CardInfo">
						<view class="f1CardTitle"></view>
						<view class="f1CardSubTitle"></view>
					</view>
					<view class="f1CardIcon">
						<u-icon name="" />
					</view>
				</view>
				<view class="f1Card">
					<view class="f1CardInfo">
						<view class="f1CardTitle"></view>
						<view class="f1CardSubTitle"></view>
					</view>
					<view class="f1CardIcon">
						<u-icon name="" />
					</view>
				</view>
			</view>
			<scroll-view class="home-list" @scrolltolower="lowerBottom" :scroll-y="true" :style="{ height: headInfo.listHeight }">
				<view class="home-item" v-for="(item, index) in dataList" :key="item.id">
					<view class="home-item-content">
						<view class="home-item-content-pic">
							<img class="home-item-content-img"
								:src="item.deviceImg ? item.deviceImg : 'https://genepiapi.ypzlfx.com/file/device-appointment/image.png'" />
						</view>
						<view class="home-item-content-info">
							<view class="home-item-content-info-title">{{ item.deviceName }}</view>
							<view class="home-item-content-info-text">
								<view class="home-item-content-info-text-item">设备编号{{ item.deviceCode }}</view>
								<view class="home-item-content-info-text-item">收费标准{{ item.priceDesc }}</view>
								<view class="home-item-content-info-text-item">
									{{ item.deviceAddress || "暂无设备地址" }}
								</view>
							</view>
						</view>
					</view>
					<view class="home-item-condition">
						<view class="home-item-condition-button">
							<view class="home-item-condition-button-block"
								@click="handleGoDetail(item.id, item.deviceId)">
								<u-button type="primary" size="small">去预约</u-button>
							</view>

						</view>
					</view>
				</view>
			</scroll-view>
		</view>

		<!-- <ut-bottomNav :value="0"></ut-bottomNav> -->
	</z-paging>
	</view>
</template>

<script>
import { getDeviceList } from '@/api/device/index.js'

export default {
	data() {
		return {
			headInfo: { headHeight: '0px', titleTop: '0px', listHeight: '0px' },
			queryParameter: { pageNo: 1, pageSize: 10, deviceName: "" },
			dataList: [], 
			totalCount: 0
		};
	},
	onShow() {
		this.getHeadInfo()
		// this.getDeviceList()
	},
	methods: {
		queryList(pageNo, pageSize) {
			this.$refs.zPagingRef.endRefresh()
			this.queryParameter.pageNo = pageNo
			this.queryParameter.pageSize = pageSize
			const type = pageNo>1 ? 'search': ''
			getDeviceList(this.queryParameter).then((resp) => {
				this.totalCount = resp.result.total
				this.$refs.zPagingRef.complete(resp.result.records)
			});
		},
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
				this.$ut.jump("/pages/login/login");
				return;
			}

		},
		getDeviceList(type) {
			getDeviceList(this.queryParameter).then((resp) => {
				if (type && type == "search") {
					this.dataList.list.push(...resp.result.records);
					this.dataList.total = resp.result.total
					uni.stopPullDownRefresh();
				} else {
					this.dataList.list = resp.result.records
					this.dataList.total = resp.result.total
				}

			});
		},
		lowerBottom() {
			if (this.queryParameter.pageNo * this.queryParameter.pageSize < this.dataList.total) {
				this.queryParameter.pageNo += 1;
				this.getDeviceList("search")
			} else {
				uni.showToast({ title: "已经到底啦！！！", icon: "none", });
			}

		},
		onPullDownRefresh() {
			this.getDeviceList()
		},
		handleSearch(e) {
			const searchData = e
			this.queryParameter.deviceName = searchData
			this.queryParameter.pageNo = 1
			this.dataList.list = []
			this.getDeviceList()
		},
		handleGoDetail(id, deviceId) {
			this.checkUserInfo()
			this.$ut.jump(`/pages/detail/index?instrumentId=${id}&deviceId=${deviceId}`);
		}
	},
};
</script>
