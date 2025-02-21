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
					<u--input placeholder="请输入关键词" suffixIcon="search"
						suffixIconStyle="font-size: 22px;color: #909399"></u--input>
				</view>
			</view>
			<scroll-view class="home-list" @scrolltolower="lowerBottom" :scroll-y="true"
				:style="{ height: headInfo.listHeight }">
				<view class="home-item" v-for="item in 10">
					<view class="home-item-content">
						<view class="home-item-content-pic">
							<img class="home-item-content-img"
								src="https://genepiapi.ypzlfx.com/file/device-appointment/image.png" />
						</view>
						<view class="home-item-content-info">
							<view class="home-item-content-info-title">设备名称设备名称设备名称设备名称设备名称设备名称设备名称设备名称</view>
							<view class="home-item-content-info-text">
								<view class="home-item-content-info-text-item">设备编号82734982375234</view>
								<view class="home-item-content-info-text-item">设备地址设备地址设备地址设备地址设备地址设备地址设备地址设备地址设备地址
								</view>
							</view>
						</view>
					</view>
					<view class="home-item-condition">
						<view class="home-item-condition-head">
							<view class="home-item-condition-head-state">
								<view class="home-item-condition-head-state-item">
									<view class="no-reserve-icon"></view>
									<view class="no-reserve-text">不可约</view>
								</view>
								<view class="home-item-condition-head-state-item">
									<view class="reserve-icon"></view>
									<view class="reserve-text">可约</view>
								</view>
							</view>
							<view class="home-item-condition-head-des">{{ item % 3 == 1 ? '使用中 丨 16:00结束' : '空闲' }}
							</view>
						</view>

						<view class="home-item-condition-time">
							<view class="home-item-condition-time-item" v-for="(items, indexs) in 24" :key="items">
								<view
									:class="indexs % 3 == 1 ? 'home-item-condition-time-item-block-curr' : 'home-item-condition-time-item-block'">
								</view>
								<view class="home-item-condition-time-item-num">{{ indexs }}</view>
							</view>
						</view>

						<view class="home-item-condition-button">
							<view class="home-item-condition-button-block" @click="handleGoDetail(item)">
								<u-button type="primary" size="small" :disabled="item % 3 == 1">去预约</u-button>
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

export default {
	data() {
		return {
			headInfo: { headHeight: '0px', titleTop: '0px', listHeight: '0px' }
		};
	},
	onLoad() {
		this.getHeadInfo()
		this.checkUserInfo()
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
		lowerBottom() {
			uni.showToast({ title: "到底啦！！！", icon: "none", });
		},
		handleGoDetail(id) {
			this.$ut.jump("/pages/detail/index");
		}
	},
};
</script>
