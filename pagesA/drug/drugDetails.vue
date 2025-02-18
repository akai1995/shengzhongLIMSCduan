<template>
	<view>
		<ut-nav :title="title" border></ut-nav>
		
		<view class="content">
			<view class="h1">{{drugInfo.drugName}}</view>
			<view class="note m-t2">
				<text style="color: #3B7EFF;">注</text>
				: 本网站任何关于药品使用的建议仅供参考，不能替代医嘱
			</view>
			
			<u-read-more showHeight="180rpx" :toggle="true" ref="uReadMore">
				<view class="describe m-t2">
					<u-parse :content="drugInfo.drugDescription" @load="load"></u-parse>
				</view>
			</u-read-more>
			
			<!-- <view class="flex m-t2">
				<view class="ut-tag" v-if="drugInfo.drugType">{{drugInfo.drugType}}</view>
			</view> -->
			<view class="type-box m-t2">
				<view class="typeitem">
					<view class="t">处方类型</view>
					<view class="s ">{{drugInfo.prescriptionType || ''}}</view>
				</view>
				<view class="typeitem">
					<view class="t">医保类型</view>
					<view class="s ">{{drugInfo.medicalInsuranceType || ''}}</view>
				</view>
				<view class="typeitem">
					<view class="t">药品类型</view>
					<view class="s ">{{drugInfo.drugType || ''}}</view>
				</view>
				<view class="typeitem" style="flex: 1.5;">
					<view class="t">参考价格</view>
					<view class="s" style="color: #3B7EFF;">{{drugInfo.referencePrice || ''}}</view>
				</view>
			</view>
			
			<view class="m-t3" v-if="drugInfo.drugComponent">
				<view class="h1">成分</view>
				<view class="describe m-t2">{{drugInfo.drugComponent}}</view>
			</view>
			<view class="m-t3" v-if="drugInfo.indications">
				<view class="h1">适应病症</view>
				<view class="describe m-t2">{{drugInfo.indications}}</view>
			</view>
			<view class="m-t3" v-if="drugInfo.note">
				<view class="h1">注意事项</view>
				<view class="describe m-t2">{{drugInfo.note}}</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {getById} from '@/api/generalcontent/drugSearch.js'
	export default {
		data() {
			return {
				title:'特泊替尼',
				id:'',
				drugInfo:{},
			};
		},
		onLoad(options) {
			if(options.title){
				this.title = options.title
			}
			if(options.id){
				this.id = options.id
				this.getInfo()
			}
		},
		methods: {
			getInfo(){
				uni.showLoading()
				getById(this.id).then(res =>{
					uni.hideLoading()
					if(res.code == 200){
						this.drugInfo = res.data
						// console.log('--',this.drugInfo)
					}
				})
			},
			load(){
				this.$refs.uReadMore.init();
			}
		}
	}
</script>

<style lang="scss">
	page{
		background: #fff !important;
	}
	.note{
		padding: 10rpx 20rpx;
		background: #F8F8F8FF;
		font-size: 22rpx;
		color: #999;
		border-radius: 10rpx;
	}
	.describe{
		color: #666;
		font-size: 24rpx;
		line-height: 1.5;
	}
	
	.ut-tag{
		padding: 5rpx 10rpx;
		border-radius: 5rpx;
		border: 2rpx solid #DADADA;
		font-size: 24rpx;
		color: #999;
	}
	
	.type-box{
		width: 100%;
		height: 150rpx;
		border-radius: 10rpx;
		background: #f8f8f8;
		display: flex;
		align-items: center;
		padding: 30rpx 0;
		box-sizing: border-box;
		.typeitem{
			flex: 1;
			height: 100%;
			border-right: 1rpx solid #D9D9D9;
			display: flex;
			flex-wrap: wrap;
			justify-content: center;
			align-items: center;
			align-content: space-between;
			&:last-of-type{
				border-right: none;
			}
			.t{
				width: 100%;
				text-align: center;
				color: #666;
				font-size: 24rpx;
			}
			.s{
				color: #000;
				font-size: 26rpx;
				font-weight: 500;
				text-align: center;
			}
		}
	}
</style>