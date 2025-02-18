<template>
	<view class="imgs-block d-flex wrap">
		<template v-for="(src, index) in urls">
			<view style="margin: 8rpx;" :key="index">
				<u--image :showLoading="true" @click="look(index)" radius="18rpx" :src="src" :width="width"
					:height="height"></u--image>
			</view>
		</template>
		<view class="view-box" :style="{ width }"></view>
		<view class="view-box" :style="{ width }"></view>
	</view>
</template>
<script>
	export default {
		name: "ut-imgs",
		props: {
			imgs: {
				type: String,
				default: ''
			},
			width: {
				type: String,
				default: '200rpx'
			},
			height: {
				type: String,
				default: '200rpx'
			},
		},
		watch: {
			'imgs': {
				immediate: true,
				handler(news) {
					if (news) {
						this.urls = news.split(',')
					}
				}
			}

		},
		data() {
			return {
				urls: []
			};
		},
		methods: {
			look(current) {
				uni.previewImage({
					urls: this.urls,
					current
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.imgs-block {
		margin-left: -8rpx;
		margin-right: -8rpx;
		justify-content: space-between;
	}

	.view-box {
		height: 1rpx;
	}
</style>