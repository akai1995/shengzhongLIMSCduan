<style lang="less" scoped>
@import './asserts/index.less';
</style>

<template>
	<view class="page">
		<img class="home-bg" src="https://genepiapi.ypzlfx.com/file/device-appointment/image 39.png" />

		<view class="home-head" :style="{ height: headInfo.headHeight }">
			<view class="home-title" :style="{ marginTop: headInfo.titleTop }">实验易约</view>
		</view>

		<view class="home-content">
			<view class="home-search">
				<view class="home-search-input">
					<u--input placeholder="请输入关键词" suffixIcon="search" @change="handleSearch"
						suffixIconStyle="font-size: 22px;color: #909399"></u--input>
				</view>
			</view>
			<scroll-view class="home-list" @scrolltolower="lowerBottom" :scroll-y="true"
				:style="{ height: headInfo.listHeight }">
				<view class="home-item" v-for="(item, index) in listData.list" :key="item.id">
					<view class="home-item-content">
						<view class="home-item-content-pic">
							<img class="home-item-content-img"
								:src="item.deviceImg ? item.deviceImg : 'https://genepiapi.ypzlfx.com/file/device-appointment/image.png'" />
						</view>
						<view class="home-item-content-info">
							<view class="home-item-content-info-title">{{ item.deviceName }}</view>
							<view class="home-item-content-info-text">
								<view class="home-item-content-info-text-item">设备编号{{ item.deviceCode }}</view>
								<view class="home-item-content-info-text-item">设备价格{{ item.priceDesc }}</view>
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

		<ut-bottomNav :value="0"></ut-bottomNav>
	</view>
</template>

<script>
import { getDeviceList } from '@/api/device/index.js'

export default {
	data() {
		return {
			headInfo: { headHeight: '0px', titleTop: '0px', listHeight: '0px' },
			queryParameter: { pageNo: 1, pageSize: 10, deviceName: "" },
			listData: { list: [], total: 0 },
		};
	},
	onShow() {
		this.getHeadInfo()
		this.getDeviceList()
	},
	methods: {
		getHeadInfo() {
			const popInfo = uni.getMenuButtonBoundingClientRect()
			this.headInfo.headHeight = `${popInfo.height}px`
			this.headInfo.titleTop = `${popInfo.top}px`
			this.headInfo.listHeight = `calc(100vh - ${popInfo.top + popInfo.height + 155}px)`
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
					this.listData.list.push(...resp.result.records);
					this.listData.total = resp.result.total
					uni.stopPullDownRefresh();
				} else {
					this.listData.list = resp.result.records
					this.listData.total = resp.result.total
				}

			});
		},
		lowerBottom() {
			if (this.queryParameter.pageNo * this.queryParameter.pageSize < this.listData.total) {
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
			this.listData.list = []
			this.getDeviceList()
		},
		handleGoDetail(id, deviceId) {
			this.checkUserInfo()
			this.$ut.jump(`/pages/detail/index?instrumentId=${id}&deviceId=${deviceId}`);
		}
	},
};
</script>
