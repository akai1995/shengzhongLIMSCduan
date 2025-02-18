<template>
	<!-- <view class="mg-32 official-box">
		<view class="pb-20 flex">
			<u--image
				src="https://genepiapi.ypzlfx.com/file/genepi/2023/11/24/lii9hF3kaoiU2ff26fc53211885ec506abf1ffc0544d_20231124142456A410.png"
				width="32rpx" height="32rpx" mode="widthFix"></u--image>
			<view class="h1" style="padding-left: 20rpx;">关注【基因派】微信公众号</view>
		</view>
		<view class="hs-bg">
			<view class="flex desc-gz"><u--image
					src="https://genepiapi.ypzlfx.com/file/genepi/2023/11/24/XhCsnHfEyDGdcae563422b8783105f39fe142ddc9944_20231124142417A409.png"
					width="32rpx" height="32rpx" mode="widthFix"></u--image> <text
					style="padding-left: 16rpx;">账号动态，实时提醒</text> </view>
			<view class="flex desc-gz"><u--image
					src="https://genepiapi.ypzlfx.com/file/genepi/2023/11/24/XhCsnHfEyDGdcae563422b8783105f39fe142ddc9944_20231124142417A409.png"
					width="32rpx" height="32rpx" mode="widthFix"></u--image> <text
					style="padding-left: 16rpx;">权威专家，健康科普</text> </view>
		</view>
		<view @click="route" class="btn-bim d-flex jc-c ai-c mt-32 mb-32">立即关注</view>
	</view> -->
</template>

<script>
	export default {
		methods: {
			route() {
                uni.navigateTo({
                	url: '/pagesC/follow/follow'
                })
			}
		}
	}
</script>

<style scoped lang="scss">
	.pb-20 {
		padding-bottom: 20rpx;
	}

	.mr-32 {
		margin-right: 32rpx;
	}

	.official-box {
		padding: 24rpx 32rpx;
		border-radius: 12rpx;
		background-color: #fff;

		.hs-bg {
			padding: 10rpx 32rpx;
			background-color: #F2F2F2;
		}

		.desc-gz {
			padding: 6rpx 0;
			font-size: 32rpx;
			color: #666;
		}
	}

	.btn-bim {
		height: 72rpx;
		font-size: 28rpx;
		font-weight: 500;
		color: #fff;
		background: linear-gradient(135deg, #00DEFF 0%, #0C5FFF 100%);
		border-radius: 80rpx;
	}

	.mt-32 {
		margin-top: 32rpx;
	}

	.mb-32 {
		margin-bottom: 32rpx;
	}

	.gz-btm-text {
		font-size: 24rpx;
		color: #222;
	}
</style>