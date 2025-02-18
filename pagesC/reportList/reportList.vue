<template>
	<view>
		<z-paging ref="paging" v-model="dataList" @query="queryList">
			<template #top>
				<ut-nav title="全部检测" border></ut-nav>
				<u-tabs v-if="!ishs" :list="navList" :current="current" @click="onItem"></u-tabs>
				<view style="padding: 30rpx 30rpx 0 30rpx;">
					<u-search placeholder="请输入姓名" v-model="keyword" bgColor="#fff" @search="search" :clearabled="false" :showAction='false'></u-search>
				</view>
				<view class="d-flex js-b-c" style="padding: 20rpx 30rpx;">
					<view @click="showTime = true" class="base-font flex" style="padding: 10rpx 0;"
						hover-class="active-hover"> <text v-if="startDate && endDate"
							class="m-r1 blue">{{ startDate }}~{{endDate}}</text><text class="m-r1" v-else>时间筛选</text>
						<image class="f-jt" mode="aspectFill" src="@/static/images/f-arrow-d.png"></image>
					</view>
					<view class="font-desc">共计 <text class="blue">{{ total }}条</text> 数据</view>
				</view>
			</template>
			<view class="content">
				<view v-for="item in dataList" :key="item.id">
					<view class="list m-t3">
						<view class="title">检测项目：{{item.projectName?item.projectName:''}}</view>
                        <template v-if="!ishs">
							<image class="ok" src="@/static/images/ok.png" mode=""
								v-if='item.reportStatus=="4" || item.reportStatus=="5"'></image>
							<image class="ok" src="@/static/images/undo.png" mode="" v-else-if='item.reportStatus=="0"'>
							</image>
							<image class="ok" src="@/static/images/processing.png" mode="" v-else></image>
						</template>
						<view class="info">
							<view class="t">姓名：{{item.fdName}}</view>
							<view class="t">性别：{{item.sex}}</view>
							<view class="t">年龄：{{item.age}}岁</view>
						</view>
						<view class="text m-t2">
							<view v-if="ishs" class="label">申请时间：{{item.registerDate}}</view>
							<view v-else class="label">申请编码：{{item.fdApplyCode}}</view>
						</view>
						<!-- <view class="text m-t2">
							<view class="label">检测医院：{{item.hospital}}</view>
						</view> -->
						<view v-if="!ishs" class="m-t2 width">
							<defSteps :current="item.reportStatus"></defSteps>
						</view>
						<view class="m-t2 u-flex">
							<view class="btn m-r2 color1" @click="details(item)">样本详情</view>
							<view class="btn color3" @click="viewReport(item)" v-if="item.reportStatus == 4 || item.reportStatus == 5">查看报告</view>
							<view class="btn color2" v-else>查看报告</view>
						</view>
					</view>
				</view>
			</view>
		</z-paging>
		</z-paging>
		<ut-range-time :show.sync="showTime" :startDate="startDate" :endDate="endDate"
			@change="changeTime"></ut-range-time>
		<u-popup :show="isShow" round="25rpx" @close="close" closeable>
			<view class="popup">
				<view class="title">样本详情</view>
				<view class="popup-box">
					<view class="h1">{{dataInfo.projectName || ''}}</view>
					<view class="info m-t2">
						<view class="t">姓名：{{dataInfo.fdName}}</view>
						<view class="t">性别：{{dataInfo.sex}}</view>
						<view class="t">年龄：{{dataInfo.age}}岁</view>
					</view>
					<view class="info">
						<view class="t">样本：{{dataInfo.pcrSample.fdSampleCode || ''}}</view>
					</view>
					<view class="text m-t2">
						<view class="label">检测医院：{{dataInfo.hospital}}</view>
						<view class="label">申请编码：{{dataInfo.fdApplyCode}}</view>
						<!-- <view class="label">送检编码：{{dataInfo.hospital}}</view> -->
						<view class="label">申请时间：{{dataInfo.createTime}}</view>
					</view>
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	import {
		selectHospitalReportList,selectPersonalDetails,getReportInfo
	} from '@/api/report.js'
	import defSteps from '@/pagesC/components/def-steps/def-steps.vue'
	export default {
		data() {
			return {
				dataList: [],
				current: '0',
				startDate: '',
				endDate: '',
				total: 0,
				navList: [{
						name: "全部",
						type: '',
						
					},
					{
						name: "待检测",
						type: 0,
					},
					{
						name: "检测中",
						type: 1,
					}, {
						name: "已完成",
						type: 2,
					},
				],
				keyWord: '',
				status:'',
				isShow:false,
				dataInfo:{},
				showTime: false,
				ishs: null
			};
		},
		components:{
			defSteps
		},
		onLoad(options) {
			if(options){
				this.status = options.id
				this.current = options.key
				this.ishs = options.ishs
			}
		},
		methods: {
			queryList(pageNo,pageSize) {
				let params = {
					currentPage: pageNo,
					pageSize: pageSize,
					keyWord: this.keyWord,
					status:this.status,
					startDate: this.startDate,
					endDate: this.endDate
				}
				uni.showLoading({
					title:'加载中。。。',
					mask: true
				})
				selectHospitalReportList(params).then(res=>{
					uni.hideLoading()
					if(res.code == 200){
						this.$refs.paging.complete(res.data.records);
						this.total = res.data.total
					}
				})
			},
			onItem(item) {
				this.status = item.type
				this.$refs.paging.reload();
			},
			search(val){
				this.current = 0
				this.keyWord = val
				this.$refs.paging.reload();
			},
			close(){
				this.isShow = false
				this.dataInfo = {}
			},
			changeTime(event) {
				console.log(event);
				const {
					endDate,
					startDate
				} = event
				this.startDate = startDate
				this.endDate = endDate
				this.$refs.paging.reload();
			},
			details(item){
				// console.log(item)
				this.dataInfo = item
				this.isShow = true
				// selectPersonalDetails(item.id).then(res=>{
				// 	if(res.code == 200){
						
				// 	}
				// })
			},
			viewReport(item){
				if(item.reportStatus=="5" || item.reportUrl){
					this.downReport(item.reportUrl)
				}else if(item.reportStatus=="4"){
					var params = {
						applyCode: item.fdApplyCode,
						idCard: item.fdIdcard,
						name: item.fdName,
						tel: item.tel
					}
					getReportInfo(params).then(res=>{
						if(res.code == 200 && res.data && res.data.reportUrl){
							this.downReport(res.data.reportUrl)
						}
					})
				}
			},
			downReport(reportUrl) {
				uni.downloadFile({
					url: reportUrl,
					success:function(res_){
						var filePath = res_.tempFilePath;
						uni.openDocument({
							filePath:filePath,
							showMenu:true,
							success:function(){
								console.log('成功')
							}
						})
					}
				})
			},
		},

	};
</script>

<style lang="scss">
	.content {
		padding: 0 32rpx;
		box-sizing: border-box;
	}
	.popup {
		width: 100%;
		min-height: 500rpx;
		background: #fff;
		border-radius: 24rpx 24rpx 0 0;
	
	
		.title {
			width: 100%;
			text-align: center;
			font-size: 36rpx;
			color: #000;
			margin-top: 30rpx;
		}
		.popup-box{
			padding: 30rpx;
			box-sizing: border-box;
			.info {
				display: flex;
				align-items: center;
				color: #666;
				font-size: 26rpx;
				line-height: 1.5;
				font-weight: 400;
				
				.t {
					margin-right: 20rpx;
				}
			}
				
			.text {
				font-size: 26rpx;
				color: #c6c6c6;
				font-weight: 400;
				
				.label {
					margin-right: 20rpx;
					line-height: 2;
				}
			}
		}
	}

	.list {
		width: 100%;
		min-height: 210rpx;
		background: #fff;
		border-radius: 20rpx;
		padding: 30rpx 20rpx;
		box-sizing: border-box;
		position: relative;
	
		.title {
			width: 80%;
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
			font-size: 30rpx;
			line-height: 1.8;
			font-weight: 600;
			color: #000;
			letter-spacing: 1rpx;
		}
	
		.ok {
			width: 120rpx;
			height: 120rpx;
			position: absolute;
			top: 20rpx;
			right: 20rpx;
			z-index: 1;
		}
	
		.tag {
			position: absolute;
			top: 30rpx;
			right: 20rpx;
			font-size: 26rpx;
			font-weight: 400;
			padding: 5rpx 15rpx;
			border-radius: 10rpx;
		}
	
		.info {
			display: flex;
			align-items: center;
			color: #666;
			font-size: 26rpx;
			line-height: 1.5;
			font-weight: 400;
	
			.t {
				margin-right: 20rpx;
			}
		}
	
		.text {
			font-size: 26rpx;
			color: #c6c6c6;
			font-weight: 400;
			display: flex;
			align-items: center;
	
			.label {
				margin-right: 20rpx;
			}
		}
		.get {
			position: absolute;
			right: 20rpx;
			bottom: 30rpx;
			padding: 5rpx 15rpx;
			color: #3B7EFFFF;
			font-size: 26rpx;
			background: #3B7EFF1A;
			border-radius: 10rpx;
			letter-spacing: 2rpx;
		}
	}
	
	.list:last-child {
		margin-bottom: 0 !important;
	}

	.box {
		width: 100%;
		display: flex;
		justify-content: center;
		position: fixed;
		left: 0;
		bottom: 30rpx;
		z-index: 9;
	}

	

	/deep/ .u-text__value {
		// font-size: 24rpx !important;
	}

	.scroll {
		display: inline-flex;
		white-space: nowrap;
	}

	.fixedTop {
		width: 100%;
		height: 88rpx;
	}

	.top_container {
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: space-between;
		background-color: #fff;
		position: fixed;

		z-index: 99999;
	}

	.btn-box {
		// width: 100%;
		background: #fff;
		color: #666666;
	}


	.u-nav-slot {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		border-width: 1rpx;
		border-radius: 200rpx;
		border-color: #dadbde;
		padding: 6rpx 14rpx;
		opacity: 0.8;
	}

	.nav {
		height: 88rpx;
	}
	
	.u-flex{
		display: flex;
		align-items: center;
		justify-content: flex-end;
		
		.btn{
			padding: 10rpx 20rpx;
			font-size: 22rpx;
			border-radius: 60rpx;
		}
	}
	
	.color1{
		color: #5178FFFF;
		border: 2rpx solid #5178FFFF;
		background: #3B7EFF1A;
	}
	.color2{
		color: #999;
		border: 2rpx solid #999;
		background: #9999991A;
	}
	.color3{
		color: #fff;
		background: #5178FFFF;
	}
</style>