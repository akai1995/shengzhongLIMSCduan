<template>
	<view>
		<z-paging ref="paging" v-model="list" @query="queryList">
			<template #top>
				<u-navbar title="报告列表" :leftIconColor="leftIconColor" :placeholder="true"
					:border="border">
					<view class="u-nav-slot" slot="left">
						<u-icon name="arrow-left" size="19" @click="back"></u-icon>
						<u-line direction="column" :hairline="false" length="16" margin="0 8px"></u-line>
						<u-icon name="home" size="20"  @click="leftClick"></u-icon>
					</view>
				</u-navbar>
				<view class="fixedTop">
					<view class="top_container">
						<view class="btn-box">
							<u-tabs :list="tabList" @click="tabsItem"></u-tabs>
						</view>
						<view class="add_report" @click="$ut.jump('/pages/report/addReport')">添加报告</view>
					</view>
				</view>
			</template>
			<view class="content">
				<view v-for="item in list" :key="item.id">
					<view class="list m-t3">
						<view class="title">{{item.projectName?item.projectName:''}}</view>
						<image class="ok" src="@/static/images/ok.png" mode=""
							v-if='item.reportStatus=="4" || item.reportStatus=="5"'></image>
						<image class="ok" src="@/static/images/undo.png" mode="" v-else-if='item.reportStatus=="0"'>
						</image>
						<image class="ok" src="@/static/images/processing.png" mode="" v-else></image>
						<view class="info">
							<view class="t">姓名：{{item.fdName}}</view>
							<view class="t">性别：{{item.sex}}</view>
							<view class="t">年龄：{{item.age}}岁</view>
						</view>
						<view class="text m-t2">
							<!-- <view class="label">检测时间：{{$ut.strSlice(item.registerDate)}}</view> -->
							<view class="label">申请编码：{{item.fdApplyCode}}</view>
						</view>
						<view class="m-t2 width">
							<defSteps :current="item.reportStatus"></defSteps>
						</view>
						<view class="m-t2 u-flex">
							<view class="btn m-r2 color1" @click="details(item)">样本详情</view>
							<view class="btn m-r2 color3"  @click="jumpPdf(item)" v-if="item.reportStatus == 4 || item.reportStatus == 5">邮寄报告</view>
							<view class="btn m-r2 color2" v-else>邮寄报告</view>
							<view class="btn color3" @click="jumpPdf(item)" v-if="item.reportStatus == 4 || item.reportStatus == 5">查看报告</view>
							<view class="btn color2" v-else>查看报告</view>
						</view>
					</view>
				</view>
			</view>
		</z-paging>
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
						<view class="label">检测医院：{{dataInfo.hospital || ''}}</view>
						<view class="label">申请编码：{{dataInfo.fdApplyCode || ''}}</view>
						<!-- <view class="label">送检编码：{{dataInfo.hospital}}</view> -->
						<view class="label">申请时间：{{dataInfo.createTime || ''}}</view>
					</view>
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	import {
		selectPersonalList,
		selectApplyCode
	} from "@/api/report.js";
	import {
		showConfirm
	} from "@/utils/common";
	import defSteps from '@/components/def-steps/def-steps.vue'
	export default {
		data() {
			return {
				status: 2,
				pageNo: 1,
				realList: [],
				pageSize: 10,
				total: 0,
				list: [],
				isShow: false,
				tabList: [{
						name: "全部",
						type: 0,
					},
					{
						name: "本人",
						type: 1,
					},
					{
						name: "其他人",
						type: 2,
					},
				],
				reportType: 0,
				dataInfo:{}
			};
		},
		components:{
			defSteps
		},
		onLoad(options) {
			const report = options.report;
			uni.setStorageSync("report", report);
			this.hasReport()
		},
		methods: {
			leftClick() {
				uni.reLaunch({
					url: "/pages/index/index",
				});
			},
			back(){
				uni.navigateBack()
			},
			queryList(pageNo, pageNum) {
				uni.showLoading();
				let params = {
					isAsc: "desc",
					orderByColumn: "create_time",
					pageNum: pageNo,
					pageSize: pageNum,
					reasonable: true,
					reportType: this.reportType,
				};
				selectPersonalList(params)
					.then((res) => {
						if (res.data.current == 1) {
							setTimeout(() => {
								uni.hideLoading();
							}, 1000);
						} else {
							uni.hideLoading();
						}
						if (res.code == 200) {
							this.realList = [...this.realList, ...res.data.records];
							this.$refs.paging.complete(res.data.records);
						}
					})
					.catch((err) => {
						uni.hideLoading();
					});
			},

			async hasReport () {
				let params = {
					pageNum: 1,
					pageSize: 1,
					reasonable: true,
					reportType: 0
				}
				const res = await selectPersonalList(params)
				if (!res || res.code !== 200) return
				const { total } = res.data
				if (!total) {
					let that = this
					uni.showModal({
						title: "添加报告",
						content: "请添加检测人档案后查看报告",
						confirmText: "立即添加",
						success(res) {
							if (res.confirm) {
								uni.navigateTo({
									url: '/pages/report/addReport',
									events: {
										change () {
											that.hasReport()
										}
									}
								})
							} else if (res.cancel) {
								uni.reLaunch({
									url: "/pages/index/index",
								});
							}
						},
					});
				}
			},
			jump(item) {
				if (item.reportStatus == "4") {
					uni.navigateTo({
						url: "/pagesB/report/query?id=" + item.id,
					});
				}
				if (item.id == null) {
					uni.navigateTo({
						url: "/pagesB/report/query",
					});
				}
			},
			jumpPdf(item) {
				console.log(item, 1111);
				let jsonStr = JSON.stringify(item);
				if (!item.reportUrl) {
					uni.showToast({
						title: "检测未完成，无法查看",
						icon: "none",
					});
				} else {
					uni.navigateTo({
						url: "/pages/report/showPort?data=" + encodeURIComponent(jsonStr),
					});
				}
			},
			jumpDetails(item) {
				if (item.analysisStatus == 0 || item.analysisStatus == null) {
					uni.navigateTo({
						url: "/pages/report/explain",
					});
				} else if (item.analysisStatus == 1) {
					uni.navigateTo({
						url: "/pages/report/details?id=" + item.analysisId,
					});
				}
			},
			scanCode() {
				uni.scanCode({
					success(res) {
						// console.log('res', res.result)
						let code = res.result;
						selectApplyCode(code).then((res) => {
							if (res.code == 200) {
								let id = res.data.id;

								uni.navigateTo({
									url: "/pagesB/report/agreeBook?id=" + id + "&type=1",
								});
							} else if (res.code == 500) {
								this.$ut.showText(res.msg);
							}
						});
					},
				});
			},
			tabsItem(item) {
				// console.log('item', item);
				this.reportType = item.type;
				this.$refs.paging.reload();
			},
			close(){
				this.isShow = false
				this.dataInfo = {}
			},
			details(item){
				this.dataInfo = item
				this.isShow = true
			},
		},
		
	};
</script>

<style lang="scss">
	.content {
		padding: 30rpx 32rpx 0 32rpx;
		box-sizing: border-box;
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
			font-size: 24rpx;
			font-weight: 400;
			padding: 5rpx 15rpx;
			border-radius: 10rpx;
		}
	
		.info {
			display: flex;
			align-items: center;
			color: #666;
			font-size: 24rpx;
			line-height: 1.5;
			font-weight: 400;
	
			.t {
				margin-right: 20rpx;
			}
		}
	
		.text {
			font-size: 24rpx;
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
			font-size: 24rpx;
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

	.add_report {
		margin-right: 32rpx;
		box-sizing: border-box;
		width: 116rpx;
		height: 44rpx;
		border-radius: 10rpx;
		border: 1px solid #3b7eff;
		font-weight: 400;
		color: #3b7eff;
		font-size: 22rpx;
		display: flex;
		justify-content: center;
		align-items: center;
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
			font-size: 24rpx;
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
				font-size: 24rpx;
				line-height: 1.5;
				font-weight: 400;
				
				.t {
					margin-right: 20rpx;
				}
			}
				
			.text {
				font-size: 24rpx;
				color: #c6c6c6;
				font-weight: 400;
				
				.label {
					margin-right: 20rpx;
					line-height: 2;
				}
			}
		}
	}
</style>