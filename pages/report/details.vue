<template>
	<view>
		<ut-nav title="报告解读详情" border></ut-nav>
		<view class="content">
			<view class="flex j-c">
				<view class="title">{{data.applyTitle}}</view>
				<view class="tag green" v-if="data.status == 1">已解读</view>
				<view class="tag red" v-if="data.status == 0">未解读</view>
			</view>
			
			<view class="suggest m-t2" v-if="data.analysisContent">
				<view class="title">诊断建议</view>
				<view class="text m-t2">{{data.status == 0 ? '' : data.analysisContent}}</view>
				<view class="flex j-c m-t2">
					<view class="label">解读医生：{{data.doctor}}</view>
					<view class="label">解读时间：{{data.analysisTime}}</view>
				</view>
			</view>
			
			<view class="list m-t4">
				<view class="m-t2" v-if="data.name">姓名：{{data.name}}</view>
				<view class="m-t2" v-if="data.gender">性别：{{data.gender}}</view>
				<view class="m-t2" v-if="data.age">年龄：{{data.age}}</view>
				<view class="m-t2" v-if="data.inspectionHospital">检测单位：{{data.inspectionHospital}}</view>
				<view class="m-t2" v-if="data.inspectionTime">检测时间：{{data.inspectionTime}}</view>
				<view class="m-t2" v-if="data.diagnosisDisease">确诊疾病：{{data.diagnosisDisease}}</view>
				<view class="m-t2" v-if="data.reportResult">检测结果：{{data.reportResult}}</view>
				<view class="suggest m-t2" v-if="data.mutationGenes">
					<view class="title">突变基因</view>
					<ul class="text m-t2">
					    <li class="m-t2" v-for="gene in data.mutationGenes" :key="gene">{{ gene }}</li>
					</ul>
				</view>
				
			</view>
			
			<view class="m-t3" v-if="medicineList.length">
				<view class="title">药品推荐</view>
				<view class="m-t2">
					<ut-drugs :list="medicineList"></ut-drugs>
				</view>
			</view>
				
				<view class="m-t3" v-for="(item,index) in imgList" :key="index">
					<image class="width" @click="lookImg(index)" :src="item" mode="widthFix"></image>
				</view>
				<!-- <image src="" mode="https://cdn.zhoukaiwen.com/kevin.pdf"></image> -->
				<!-- <web-view style="width: 100%;height: 500rpx;" src=" "></web-view> -->
		</view>
	</view>
</template>

<script>
	import {reportAnalysisDetalis} from '@/api/report.js'
	export default {
		data() {
			return {
				data:{},
				imgList:'',
				medicineList:[]
			};
		},
		onLoad(optins) {
			if(optins.id){
				this.init(optins.id)
			}
		},
		methods:{
			init(id){
				reportAnalysisDetalis(id).then(res=>{
					if(res.code == 200){
						this.data = res.data
						this.medicineList =res.data.drugList
						this.imgList = res.data.reportUrl.split(',')
					}
				})
			},
			lookImg(index){
				uni.previewImage({
					urls:this.imgList,
					current:index
				})
			}
		}
	}
</script>

<style lang="less">
	page{
		background: #fff;
	}
	.tag{
		font-size: 24rpx;
		font-weight: 400;
		padding: 5rpx 15rpx;
		border-radius: 10rpx;
		display: inline-block;
	}
	.green{
		color: #00C777FF;
		background: #00C7771A;
	}
	.red{
		color: #FD5454FF;
		background: #FD54541A;
	}
	.title{
		color: #000;
		font-size: 32rpx;
		font-weight: 600;
	}
	.suggest{
		width: 100%;
		min-height: 300rpx;
		border-radius: 10rpx;
		background: #3B7EFF1A;
		padding: 30rpx;
		box-sizing: border-box;
		.title{
			font-size: 28rpx;
			font-weight: 400;
		}
		.text{
			width: 100%;
			min-height: 160rpx;
			border-radius: 6rpx;
			background: #fff;
			color: #0C5FFFFF;
			font-size: 28rpx;
			font-weight: 400;
			line-height: 1.6;
			padding: 20rpx;
			box-sizing: border-box;
		}
		.label{
			color: #999;
			font-size: 24rpx;
			font-size: 400;
		}
	}
	
	.list{
		font-size: 28rpx;
		font-weight: 500;
		color: #222;
	}
	
	
</style>
