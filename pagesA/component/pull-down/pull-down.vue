<template>
	<view class="down-box" :class="isShow?'active':''" @click="isShow = !isShow">
		<view class="label" >{{label}}</view>
		
		<view class="pull-box">
			<view class="pull-item" v-for="(item,index) in valList" :key="index">{{item.label}}</view>
		</view>
	</view>
</template>

<script>
	export default{
		props:{
			label:{
				type:String,
				default:''
			},
			valList:{
				type:Array,
				default:()=>[]
			}
		},
		data(){
			return {
				isShow:false,
			}
		}
	}
</script>

<style scoped lang="less">
	.down-box{
		height: 35rpx;
		position: relative;
		padding: 10rpx 20rpx;
		border-radius: 100rpx;
		background: rgba(255,255,255,0.5);
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 24rpx;
		color: #666;
	}
	
	.pull-box{
		position: absolute;
		right: 0;
		left: 0;
		bottom: -220rpx;
		z-index: 99;
		min-width: 180rpx;
		background: #fff;
		text-align: center;
		padding: 20rpx 10rpx;
		box-sizing: border-box;
		border-radius: 20rpx;
		box-shadow: 0rpx 4rpx 8rpx 0rpx rgba(59,126,255,0.3);
		.pull-item{
			line-height: 1.5;
			font-size: 28rpx;
			color: #000;
		}
	}
	
	.active{
		background: #fff !important;
		color: #3B7EFF !important;
	}
</style>