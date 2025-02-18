<template>
	<view class="video-box">
		<view class="list" v-for="(item,index) in list" :key="index">
			<view class="list-item">
				<view class="image">
					<image  :src="item.titlePicture" mode=""></image>
					<view class="play"  v-if="isPlay">
						<u-icon name="play-circle" color="#fff" size="28"></u-icon>
					</view>
				</view>
				<view class="text">
					<view class="title ellipsis2">{{item.title}}</view>
					<view class="flex j-c width " >
						<view class="red">免费</view>
						<view class="flex h5" v-if="item.readCount">
							<view class="m-r1"><u-icon name="eye" color="#A8A8A8FF" size="9"></u-icon></view>
							{{item.readCount}}
						</view>
					</view>
				</view>
			</view>	
		</view>
	</view>
</template>

<script>
	export default {
		name:"ut-video",
		props:['list','isPlay'],
		data() {
			return {
				
			};
		}
	}
</script>

<style lang="less" scoped>
	.video-box{
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		
		.list{
			width: 325rpx;
			height: 360rpx;
			margin-bottom: 30rpx;
			&-item{
				background: #fff;
				.image{
					position: relative;
					width: 100%;
					height: 200rpx;
					border-radius: 10rpx 10rpx 0 0;
					overflow: hidden;
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
						background: rgba(0, 0, 0, 0.3);
					}
				}
				.text{
					width: 100%;
					padding: 20rpx;
					box-sizing: border-box;
					.title{
						color: #222;
						font-size: 28rpx;
						font-weight: 500;
						margin-bottom: 10rpx;
					}
				}
			}
		}
	}
	
	.red{
		color: #FD5454FF;
		font-size: 20rpx;
	}
</style>