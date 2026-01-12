<style lang="less" scoped>
@import './asserts/index.less';
</style>

<template>
	<view class="user">
		<img class="detail-bg" src="https://genepiapi.ypzlfx.com/file/device-appointment/Bg.png" />

		<view class="detail-head" :style="{ height: headInfo.headHeight }">
			<view class="detail-title" :style="{ marginTop: headInfo.titleTop }">我的</view>
		</view>

		<view class="detail-info">
			<view class="detail-info-icon">
				<img class="detail-info-img" src="https://genepiapi.ypzlfx.com/file/device-appointment/image 28.png" />
			</view>
			<view class="detail-info-message">
				<view class="detail-info-message-name">{{ userName }}</view>
				<view class="detail-info-message-sub">欢迎使用设备智约助手</view>
			</view>
		</view>

		<view class="detail-card">
			<view class="detail-card-item" @click="handleGoReserve">
				<view class="detail-card-item-icon">
					<img class="detail-card-item-img"
						src="https://genepiapi.ypzlfx.com/file/device-appointment/Frame.png" />
				</view>
				<view class="detail-card-item-text">我的预约</view>
				<view class="detail-card-item-arror">
					<img class="detail-card-item-arror-img"
						src="https://genepiapi.ypzlfx.com/file/device-appointment/icon-arrow-right.png" />
				</view>
			</view>

			<view class="detail-card-item" @click="handleExpectClick">
				<view class="detail-card-item-icon">
					<img class="detail-card-item-img"
						src="https://genepiapi.ypzlfx.com/file/device-appointment/service.png" />
				</view>
				<view class="detail-card-item-text">联系客服</view>
				<view class="detail-card-item-arror">
					<img class="detail-card-item-arror-img"
						src="https://genepiapi.ypzlfx.com/file/device-appointment/icon-arrow-right.png" />
				</view>
			</view>
		</view>

		<ut-bottomNav :value="1"></ut-bottomNav>
	</view>
</template>

<script>

export default {
	data() {
		return {
			headInfo: { headHeight: '0px', titleTop: '0px', listHeight: '0px' },
			userName: '尊敬的用户'
		};
	},
	onLoad() {
		this.getHeadInfo()
		this.checkUserInfo()
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
			console.log(this.$store.getters);
			if (!id) {
				this.$ut.jump("/pages/login/login");
				return;
			}
		},
		handleExpectClick() {
			uni.showToast({ title: "敬请期待", icon: "none", });
		},
		handleGoReserve() {
			this.$ut.jump("/pages/reserve/index");
		}
	},
};
</script>
