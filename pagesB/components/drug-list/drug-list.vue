<template>
	<view class="new">
		<view class="new-list" v-for="(item,index) in list" :key="index" @tap="onClick(item)">
			<view class="view">
				<view class="flex">
					<view class="title ellipsis">{{item.title}}</view>
					<view>
						<u-tag :text="getType(item.type)" plain size="mini"></u-tag>
					</view>
				</view>
				<view class="text ellipsis2 m-t2">{{item.description}}</view>
				<!-- <view class="tag">
					<view>{{item.drugType == null ?'':item.drugType}}</view>
				</view> -->
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
				max-width: 79%;
				color: #222;
				font-size: 28rpx;
				// overflow: hidden;
				// text-overflow: ellipsis;
				// display: -webkit-box;
				// -webkit-box-orient: vertical;
				// -webkit-line-clamp: 1;
				font-weight: 500;
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
				width: 100%;
				display: flex;
				justify-content: space-between;
				color: #C6C6C6FF;
				font-size: 20rpx;
			}
		}
	}
</style>