<style lang="less" scoped>
@import './asserts/index.less';
</style>

<template>
	<view class="page">
		<img class="home-bg" src="https://genepiapi.ypzlfx.com/file/device-appointment/image 39.png" />

		<view class="home-head" :style="{ height: headInfo.headHeight }">
			<view class="home-title" :style="{ marginTop: headInfo.titleTop }">eAI</view>
		</view>

		<view class="home-content">
			<view class="home-welcome">欢迎使用eAI系统</view>
			<view class="home-description">请选择您需要的服务</view>
			<view class="home-buttons">
				<button class="home-button" @click="navigateToDeviceAppointment">设备预约</button>
				<button class="home-button" @click="navigateToSignDocuments">待签署文件</button>
			</view>
			<view class="home-footer">© 2026 eAI All Rights Reserved</view>
		</view>

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
			navigateToDeviceAppointment() {
				this.$ut.jump("/pages/device-appointment/index");
			},
			navigateToSignDocuments() {
				this.$ut.jump("/pages/signPaper/index");
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
