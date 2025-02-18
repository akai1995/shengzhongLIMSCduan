<template>
	<z-paging ref="paging">
		<template #top>
			<u-navbar title="基因派" :placeholder="true" border>
				<view class="u-nav-slot" slot="left">
					<u-icon name="arrow-left" @click="onBack" size="19"></u-icon>
					<u-line direction="column" :hairline="false" length="16" margin="0 8px"></u-line>
					<u-icon name="home" size="20" @click="onHome"></u-icon>
				</view>
			</u-navbar>
		</template>
		<view class="content">
			<view class="d-flex flex-clm jc-c-c" style="padding-top: 30rpx;">
				<view class="icon">
					<u-icon name="checkbox-mark" color="#fff" size="120rpx"></u-icon>
				</view>
				<view class="h1" style="font-size: 36rpx; padding: 32rpx 0 48rpx;">提交成功</view>
				<view class="h2" style="color: #666;">医生会在 <text style="color: #00C777;">1-3个工作日</text> 内，为您核实检测结果
				</view>
			</view>
			<view style="padding-top: 40rpx; ">
				<ut-official></ut-official>
			</view>
		</view>
	</z-paging>
</template>

<script>
	export default {
		components: {

		},
		data() {
			return {

			};
		},
		methods: {
			onBack() {
				uni.navigateBack({
					delta: 1
				})
			},
			onHome() {
				uni.redirectTo({
					url: '/pages/index/index'
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
	.icon {
		width: 160rpx;
		height: 160rpx;
		background: #00C777;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.u-nav-slot {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		border-width: 1rpx;
		border-radius: 200rpx;
		border-color: #dadbde;
		padding: 6rpx 14rpx;
		opacity: 0.8;
	}
</style>