<template>
	<view>
		<ut-nav title="申请医生权限" border url="/pages/index/index"></ut-nav>
		<view class="ut-padding">
			<u-steps :current="1" dot activeIcon="checkmark" activeColor='#3B7EFF'>
				<u-steps-item title="提交个人信息"></u-steps-item>
				<u-steps-item title="平台审核中"></u-steps-item>
				<u-steps-item title="开通成功"></u-steps-item>
			</u-steps>
			<view class="icon-box">
				<view class="icon">
					<u-icon name="checkbox-mark" color="#fff" size="120rpx"></u-icon>
				</view>		
			</view class='fontContent'>
			<view class="subTip"><text >提交成功，等待审核</text></view>
			<view>
			<view class="font mt48">我们会在<text class="colorGreen" style="margin: 0 2rpx;">1 ~3个工作日</text>完成审核，审核结果会以短信方式发送您。
			</view>
			<!-- <view  class="font">如果您有疑问请拨打客服电话 <text class="colorBlue">400-400-4000（工作时间：周一至周五 9：00—18：00）</text></view> -->
			</view>
			<view class="m-t3">
				<ut-official></ut-official>
			</view>
			<view class="btn-box">
				<text class="btn" @click="$ut.jump('/pages/index/index')">返回首页</text>
			</view>
			
			<!-- <view class="m-t6 ut-view">
				<view class="h1 width" @click="$ut.jump('/pagesA/index/news/news?type=2')">信息精选</view>
				<ut-new :list="newData" @onClick="onClick"></ut-new>
			</view> -->
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
		}
	}
</script>

<style lang="scss">
	/deep/.u-steps-item:nth-child(1) .u-text__value{
		color: #0C5FFF !important;
	}
	/deep/.u-steps-item:nth-child(2) .u-text__value{
		color: #0C5FFF !important;
	}
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
		font-size: 28rpx;
		color: #333;
		line-height: 50rpx;
	}
	.ut-padding{
		padding:  30rpx 46rpx;
	}
	.fontContent{
		// width: 658rpx;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}
	.mt48{
		margin-top: 40rpx;
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
			display: flex;
			align-items: center;
			justify-content: center;
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
	.colorBlue{
		color: #3B7EFF;
		font-size: 28rpx;
	}
	.subTip{
		font-size: 36rpx;
		line-height: 42rpx;
		color: #000;
		display: flex;
		justify-content: center;
		align-items: center;
		margin-top: 32rpx;
	}
	/deep/.u-steps-item__wrapper {
		background: transparent !important;
	}
</style>