<template>
	<!-- <view class="wrapper">
		<ut-nav title="关注公众号" border></ut-nav>
		<scroll-view class="page-content" scroll-with-animation scroll-y>
			<view style="padding: 32rpx 32rpx 70rpx;">
				<view class="h1">关注【基因派】公众号，医生消息实时提醒</view>
				<view class="qr-code-wrap d-flex flex-clm jc-c ai-c">
					<u--image
						src="https://genepiapi.ypzlfx.com/file/genepi/2023/11/21/k563Eivbf7QQb0c8ffb2dbed85a2710b4f0a2f875083_20231121155635A106.png"
						width="305rpx" height="44rpx"></u--image>
					<view class="h1" style="margin: 56rpx 0 32rpx;">关注【基因派】微信公众号</view>
					<view class="qr-code d-flex jc-c-c">
						<image src="https://genepiapi.ypzlfx.com/file/genepi/2023/11/24/Mhi5KtquvaxNe6c420779b1c75c8a460d9a4e597722a_20231124144137A411.jpg" show-menu-by-longpress mode="scaleToFill" style="width: 320rpx; height: 320rpx;"></image>
					</view>
					<view class="h2" style="padding-top: 32rpx;">长按识别，关注【基因派】公众号</view>
				</view>
			</view>
		</scroll-view>
	</view> -->
</template>

<script>
	export default {
		data() {
			return {

			}
		},
		methods: {

		}
	}
</script>

<style lang="scss">
	.wrapper {
		height: 100vh;
		display: flex;
		flex-direction: column;
	}

	.page-content {
		flex: 1;
		overflow: hidden;
	}

	.qr-code-wrap {
		margin-top: 24rpx;
		padding: 64rpx;
		border-radius: 12rpx;
		background-color: #fff;
	}

	.qr-code {
		width: 340rpx;
		height: 340rpx;
		background: #fff;
		border-radius: 8rpx;
		box-shadow: 0rpx 8rpx 20rpx 0rpx rgba(17, 93, 167, 0.2);
	}
</style>