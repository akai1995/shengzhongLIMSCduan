<template>
	<view class="new">
		<view class="new-list" v-for="(item,index) in list" :key="index" @click="onClick(item)">
			<view class="img">
				<image :src="item.titlePicture" lazy-load mode="aspectFill" />				
				<view class="play" v-if="isPlay"><u-icon name="play-circle" color="#fff" size="28" /></view>
			</view>
			<view class="view">
				<view class="title ellipsis2">{{item.title}}</view>
				<!-- <view class="text">{{item.txtContent}}</view> -->
				<view class="tag">
					<view>{{item.createTime}}</view>
					<view class="flex"  v-if="item.readCount"><view class="m-r1"><u-icon name="eye" color="#A8A8A8FF" size="9" /></view>{{item.readCount}}</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: "ut-new",
		props: ['list','isPlay'],
		data() {
			return {

			};
		},
		methods:{
			onClick(item){
				this.$emit('onClick',item)
			}
		}
	}
</script>

<style lang="scss">
	.new {
		width: 100%;
		height: auto;
		background: #fff;
		border-radius: 20rpx;

		&-list {
			margin-top: 25rpx;
			display: flex;

			.img {
				width: 200rpx;
				height: 140rpx;
				flex-shrink: 0;
				position: relative;
				image{
					width: 100%;
					height: 100%;
				}
				.play{
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
					font-weight: 500;
				}

				.text {
					color: #666;
					font-size: 24rpx;
					width: 100%;
					white-space: nowrap;
					overflow: hidden;
					text-overflow: ellipsis;
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