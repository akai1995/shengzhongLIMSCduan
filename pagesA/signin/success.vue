<template>
	<view>
		<ut-nav title="检测登记" border url="/pages/index/index"></ut-nav>
		<view class="ut-padding">
			<view class="icon-box">
				<view class="icon">
					<u-icon name="checkbox-mark" color="#fff" size="120rpx"></u-icon>
				</view>		
			</view>
			<view class="font">请在首页的“<text class="colorGreen">电子报告</text>”中查看检测进度及结果</view>
			
			<view class="m-t3">
				<ut-official></ut-official>
			</view>
			
			<view class="btn-box">
				<text class="btn" @click="$ut.jump('/pages/index/index')">返回首页</text>
			</view>
			
			<view class="m-t6 ut-view">
				<view class="h1 width" @click="$ut.jump('/pagesA/index/news/news?type=2')">信息精选</view>
				<ut-new :list="newData" @onClick="onClick"></ut-new>
			</view>
		</view>
	</view>
</template>

<script>
	import {getNewsList} from '@/api/generalcontent/generalcontent.js'
	export default {
		components:{
			
		},
		data() {
			return {
				newData: [],
				newsParams: {
					"isAsc": "desc",
					"orderByColumn": "create_time",
					"pageNum": 1,
					"pageSize": 6,
					"reasonable": true,
					"type": 0,
					port: 2,
					userId: this.$store.getters.userId
				},
			}
		},
		onLoad(options){
			this.getNewsLists()
		},
		methods: {
			getNewsLists() {
				getNewsList(this.newsParams).then(res => {
					console.log("newsList:", res)
					if (res.code == 200) {
						this.newData = res.data.records
					}
				})
			},
			onClick(item) {
				uni.navigateTo({
					url: '/pagesA/index/news/news-detalis?id=' + item.id
				});
			},
	},
// 	onUnload: function() {
// 		uni.navigateTo({
//     url: '/pages/index/index'
//   })
// }
	}
</script>

<style lang="scss">
	page{
		background: #F8F8F8;
	}
	.icon-box{
		display: flex;
		align-items: center;
		justify-content: center;
		margin-top: 70rpx;
		.icon{
			width: 160rpx;
			height: 160rpx;
			background: #00C777;
			border-radius: 50%;
			display: flex;
			align-items: center;
			justify-content: center;
		}
	}
	.font{
		width: 100%;
		text-align: center;
		font-size: 28rpx;
		color: #333;
		margin-top: 50rpx;
	}
	.btn-box{
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-top: 48rpx;
		box-sizing: border-box;
		.btn{
			height: 80rpx;
			box-sizing: border-box;
			padding: 14rpx 88rpx;
			background: rgba(0, 199, 119, 0.10);
			color: #00C777;
			font-size: 36rpx;
			border-radius: 80rpx;
			font-weight: 500;
			
		}
	}
	.colorGreen{
		color: #00C777;
	}
</style>