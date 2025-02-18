<template>
	<view>
		<ut-nav title="扫码识别" border></ut-nav>
		<view class="content">
			<view class="h1">{{data.fdSampleCode}}</view>
			<view class="name m-t2">检测项目：{{data.fdProjectName}}</view>
			<view class="item">姓名：{{data.fdName}}</view>
			<view class="item">性别：{{data.fdSex}}</view>
			<view class="item">年龄：{{data.fdAge}}</view>
			<view class="item">采样时间：{{$ut.strSlice(data.fdSampleTime)}}</view>
			<view class="item">送检医院：{{data.hospital}}</view>
			<view class="item">样本编码：{{data.fdSamplesCode}}</view>
			
			<view class="flex j-c width m-t6" v-if="data.receiveFlag==0">
				<view class="cancel" @click="cancel">取消</view>
				<view class="confirm" @click="accept">确认{{data.sendStatus === 1? '接收' : '送检'}}</view>
			</view>
		</view>
	</view>
</template>
<script>
	import {
		sampleDetalis,
		batchReceiveSample,
		batchSendSample
	}  from '@/api/sample.js';
	export default {
		data() {
			return {
				data: {}
			};
		},
		onLoad(optins) {
			if(optins.id){
				this.init(optins.id)
			}
		},
		methods:{
			init(id){
				uni.showLoading()
				sampleDetalis(id).then(res=>{
					uni.hideLoading()
					if(res.code == 200){
						console.log(res.data)
						this.data = res.data
					} else if (res.code == 500) {
						this.$ut.showText(res.msg)
					}
				})
			},
			accept() {
				uni.showLoading()
				let params = {
					ids: this.data.id
				}
				if(this.data.sendStatus ===1) {
					batchReceiveSample(params).then(res=>{
						uni.hideLoading()
						if (res.code == 200) {
							uni.navigateTo({url: '/pages/sample/receive'})
						} else if (res.code == 500) {
							this.$ut.showText(res.msg)
						}
					})
				} else {
					batchSendSample(params).then(res=>{
						uni.hideLoading()
						if (res.code == 200) {
							uni.navigateTo({url: '/pages/sample/inspect'})
						} else if (res.code == 500) {
							this.$ut.showText(res.msg)
						}
					})
				}

			},
			cancel() {
				uni.navigateBack()
			}
		}
	}
</script>

<style lang="less">
page{
	background: #fff;
}
.name{
	font-size: 24rpx;
	color: #666;
	line-height: 2;
}
.item{
	font-size: 24rpx;
	color: #999;
	line-height: 2;
}

.cancel{
	width: 320rpx;
	height: 80rpx;
	border-radius: 80rpx;
	background: linear-gradient(135deg, #F4F4F4 0%, #D3D3D3 100%);
	display: flex;
	align-items: center;
	justify-content: center;
	color: #999;
	font-size: 36rpx;
	letter-spacing: 2rpx;
	
}
.confirm{
	width: 320rpx;
	height: 80rpx;
	border-radius: 80rpx;
	background: linear-gradient(135deg, #00DEFF 0%, #0C5FFF 100%);
	display: flex;
	align-items: center;
	justify-content: center;
	color: #fff;
	font-size: 36rpx;
	letter-spacing: 2rpx;
}
</style>
