<template>
	<view class="new">
		<view class="new-list" v-for="(item,index) in list" :key="index" @tap="onClick(item)">
			<view class="img">
				<image :src="item.imageCode == null || item.imageCode ==''? 'https://genepiapi.ypzlfx.com/file/genepi/2023/07/06/drug3.jpg':item.imageCode" mode=""></image>
			</view>
			<view class="view">
				<view class="title" v-html="item.drugName"></view>
				<view class="text">{{item.targetGene + ' | ' + item.mutationTypeKey + ' | ' + item.mutationTypeValue}}</view>
				<view class="tag">
					<view>{{item.drugType == null ?'':item.drugType}}</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: "ut-new",
		props: ['list', 'isPlay'],
		data() {
			return {

			};
		},
		methods: {
			onClick(item) {
				console.log(item)
				this.$emit('onClick', item)
			},
		}
	}
</script>

<style lang="less">
	.new {
		width: 100%;
		height: auto;
		background: #fff;
		border-radius: 20rpx;
		padding-bottom: 0rpx;

		&-list {
			margin-bottom: 25rpx;
			display: flex;
			
			.img {
				width: 200rpx;
				height: 140rpx;
				flex-shrink: 0;
				position: relative;

				image {
					width: 100%;
					height: 100%;
				}

				.play {
					position: absolute;
					z-index: 0;
					left: 0;
					top: 0;
					width: 100%;
					height: 100%;
					display: flex;
					align-items: center;
					justify-content: center;
					background: rgba(0, 0, 0, 0.1);
				}

			}

			.view {
				width: calc(100% - 220rpx);
				margin-left: 20rpx;
				display: flex;
				flex-wrap: wrap;
				align-items: center;
				align-content: space-between;

				.title {
					color: #222;
					font-size: 28rpx;
					overflow: hidden;
					overflow: hidden;
					text-overflow: ellipsis;
					display: -webkit-box;
					-webkit-box-orient: vertical;
					-webkit-line-clamp: 1;
					font-weight: 500;
				}

				.text {
					color: #666;
					font-size: 24rpx;
					width: 100%;
					overflow: hidden;
					text-overflow: ellipsis;
					display: -webkit-box;
					-webkit-box-orient: vertical;
					-webkit-line-clamp: 2;
				}

				.tag {
					width: 100%;
					display: flex;
					justify-content: space-between;
					color: #C6C6C6FF;
					font-size: 20rpx;
				}
			}
		}
	}
</style>