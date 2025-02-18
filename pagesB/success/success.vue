<template>
	<z-paging ref="paging">
		<template #top>
			<ut-nav title="基因派" iconName="home" url="/pages/index/index"></ut-nav>
		</template>
		<view class="content">
			<view class="d-flex flex-clm jc-c-c" style="padding-top: 30rpx;">
				<view class="icon">
					<u-icon name="checkbox-mark" color="#fff" size="120rpx"></u-icon>
				</view>
				<view class="h1" style="font-size: 30rpx; padding: 32rpx 0 48rpx;">调查到此结束。再一次感谢您的支持与合作！</view>
				</view>
			</view>
			<view style="padding: 32rpx; ">
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
	.content {
		padding: 30rpx;
	}
</style>