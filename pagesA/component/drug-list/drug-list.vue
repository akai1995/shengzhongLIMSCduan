<template>
	<view class="new">
		<view class="new-list" v-for="(item,index) in list" :key="index" @tap="onClick(item)">
			<view class="view">
				<view class="flex">
					<view class="title">{{item.drugName}} | {{item.englishName}}</view>
					<!-- <view>
						<u-tag :text="getType(item.type)" plain size="mini"></u-tag>
					</view> -->
				</view>
				<view class="text ellipsis2 m-t2">{{item.drugDescription}}</view>
				<view class="m-t1" v-if="item.drugType">
					<view class="tag">{{item.drugType}}</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: ['list'],
		data() {
			return {

			};
		},
		methods: {
			onClick(item) {
				// console.log(item)
				this.$emit('onClick', item)
			},
			getType(val){
				if(val == 1){
					return '药品'
				}else if(val == 2){
					return '检测项目'
				}else if(val == 3){
					return '科普文章'
				}else{
					return '其他'
				}
			}
		}
	}
</script>

<style lang="less">
	.flex{
		display: flex;
		flex-wrap: wrap;
	}
	.new-list {
		margin-bottom: 25rpx;
		padding-bottom: 30rpx;
		border-bottom: 2rpx solid #0000001A;
		.view {
			width: 100%;
			// display: flex;
			// flex-wrap: wrap;
			// align-items: center;
			// align-content: space-between;

			.title {
				max-width: 100%;
				color: #222;
				font-size: 28rpx;
				// overflow: hidden;
				// text-overflow: ellipsis;
				// display: -webkit-box;
				// -webkit-box-orient: vertical;
				// -webkit-line-clamp: 1;
				font-weight: 600;
				margin-right: 20rpx;
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
				padding: 5rpx 10rpx;
				border-radius: 10rpx;
				border: 2rpx solid #DADADA;
				font-size: 24rpx;
				color: #999;
				display: inline;
			}
		}
	}
	.m-t1{
		margin-top: 10rpx;
	}
</style>