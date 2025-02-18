<template>
	<view class="steps-block">
		<u--image width="572rpx" height="26rpx" :src="iconList[current]" mode="widthFix"></u--image>
		<!-- 		<u--image src="https://genepiapi.ypzlfx.com/file/genepi/2023/11/24/Idzc86Qc22ab92513b81c82fd6764cc698647794cb73_20231124112122A404.png"></u--image>
		<u--image src="https://genepiapi.ypzlfx.com/file/genepi/2023/11/24/NqAwJZKrkEZS3b0be3f8927a30daf6beb30f5ffe9d8b_20231124112122A405.png"></u--image>
		<u--image src="https://genepiapi.ypzlfx.com/file/genepi/2023/11/24/hUuY3wZhVEAb2e7abe1a33bd677b0a9bf83117d4bf30_20231124112225A406.png"></u--image>
		<u--image src="https://genepiapi.ypzlfx.com/file/genepi/2023/11/24/NVfZgSqBv69o3fd87de0c407d1477b6369f665ef0924_20231124112225A407.png"></u--image> -->
		<view class="steps-text">
			<template v-for="(item, index) in textInfo">
				<view class="text-item" :class="{ active: current > index }" :key="index">{{ item.label }}</view>
			</template>
		</view>

	</view>
</template>

<script>
	export default {
		props: {
			textInfo: {
				type: Array,
				default: [{
						label: '样本质控'
					},
					{
						label: '流程质控'
					},
					{
						label: '结果质控'
					},
					{
						label: '报告质控'
					},
				]
			},
			current: {
				type: Number,
				default: 0
			}
		},
		watch: {

		},
		data() {
			return {
				iconList: [
					'https://genepiapi.ypzlfx.com/file/genepi/2023/11/24/PUpE8qzjcyEge56f7df9afa834c31060eefba11b85e5_20231124112122A403.png',
					'https://genepiapi.ypzlfx.com/file/genepi/2023/11/24/NVfZgSqBv69o3fd87de0c407d1477b6369f665ef0924_20231124112225A407.png',
					'https://genepiapi.ypzlfx.com/file/genepi/2023/11/24/Idzc86Qc22ab92513b81c82fd6764cc698647794cb73_20231124112122A404.png',
					'https://genepiapi.ypzlfx.com/file/genepi/2023/11/24/NqAwJZKrkEZS3b0be3f8927a30daf6beb30f5ffe9d8b_20231124112122A405.png',
					'https://genepiapi.ypzlfx.com/file/genepi/2023/11/24/hUuY3wZhVEAb2e7abe1a33bd677b0a9bf83117d4bf30_20231124112225A406.png',
				],
			}
		},
		methods: {

		}
	}
</script>

<style lang="scss" scoped>
	.steps-block {
		display: flex;
		flex-direction: column;
		align-items: center;
		position: relative;
		padding: 20rpx 0;
	}

	.steps-text {
		display: flex;
		justify-content: space-between;
		width: 655rpx;
	}

	.text-item {
		padding-top: 10rpx;
		width: 106rpx;
		text-align: center;
		font-size: 26rpx;
		color: #979797;

		&.active {
			color: #5178FF;
		}
	}
</style>