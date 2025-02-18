<template>
	<view>
		<z-paging ref="paging" v-model="list" @query="queryList">
			<template #top>
				<ut-nav title="报告查看" url='/pages/index/indexA'></ut-nav>
				<ut-tabs :tabList="tabList" :current="current" @onItem="onItem"></ut-tabs>
			</template>
			<view class="content" style="padding-bottom: 100rpx;" v-show="current==2">
				<view class="form">
					<u-search placeholder="搜索" :showAction='false' v-model="keyWord" @clickIcon="search" @search="search" @custom="search">
					</u-search>
				</view>
				<view v-for="item in list" :key="item.id" @click="jump(item)">
					<view class="list m-t3">
						<view class="title">检测项目：{{item.projectName?item.projectName:''}}</view>
						<image class="ok" src="@/static/images/ok.png" mode="" v-if='item.reportStatus=="4" || item.reportStatus=="5"'></image>
						<image class="ok" src="@/static/images/undo.png" mode="" v-else-if='item.reportStatus=="0"'></image>
						<image class="ok" src="@/static/images/processing.png" mode="" v-else></image>
						<view class="info">
							<view class="t">姓名：{{item.fdName}}</view>
							<view class="t">性别：{{item.sex}}</view>
							<view class="t">年龄：{{item.age}}岁</view>
						</view>
						<view class="text m-t2">
							<view class="label" >检测时间：{{$ut.strSlice(item.registerDate)}}</view>
							<view class="label">申请编码：{{item.fdApplyCode}}</view>
						</view>
						<view class="text m-t2">
							<view class="label">检测医院：{{item.hospital}}</view>
						</view>
						<!-- <view class="get" v-if='item.reportStatus=="4"'>获取报告</view> -->
						<view class="m-t2 width">
						<scroll-view class="scroll" scroll-x>
							<u-steps :current="item.reportStatus>=4?5:item.reportStatus" activeIcon="checkmark-circle-fill"
									 inactiveIcon="minus-circle">
								<u-steps-item title="样本送检"></u-steps-item>
								<u-steps-item title="样本质控"></u-steps-item>
								<u-steps-item title="流程质控"></u-steps-item>
								<u-steps-item title="结果质控"></u-steps-item>
								<u-steps-item title="报告质控"></u-steps-item>
								<u-steps-item title="检测完成"></u-steps-item>
							</u-steps>
						</scroll-view>
					</view>
					</view>
					
				</view>
				<!-- <template #bottom> -->
					<view class="bottom-box">
						<view class="button" @click="jump">报告自助查询</view>
					</view>
				<!-- </template> -->
				
			</view>
			<view class="content" v-show="current==1">
				<view class="form">
					<u-search placeholder="搜索" :showAction='false' v-model="keyWord" @clickIcon="search" @search="search" @custom="search">
					</u-search>
				</view>
				<view v-for="item in list" :key="item.id">
					<view v-if="item.applyTitle" class="list m-t3" @click="onClick(item)">
						<view class="title">{{item.applyTitle?item.applyTitle:''}}</view>
						<view class="tag green" v-if="item.status == 1">已解读</view>
						<view class="tag red" v-if="item.status == 0">未解读</view>
						<view class="info">
							<view class="t">姓名：{{item.name}}</view>
							<view class="t">性别：{{item.sex}}</view>
							<view class="t">年龄：{{item.age}}岁</view>
						</view>
						<view class="text m-t2">
							<view class="label">上传时间：{{$ut.strSlice(item.reportUploadTime) }}</view>
							<view class="label" v-if="item.doctor">解读医生：{{item.doctor}}</view>
						</view>
					</view>
				</view>
			</view>
			
		</z-paging>
	</view>
</template>

<script>
	import {
		selectReportApplyForDoctor,
		selectHospitalReportList,
		getReportInfo
	} from '@/api/report.js'
	export default {
		data() {
			return {
				tabList: [{
					name: "报告查看",
					id: 2
				},{
					name: "报告解读",
					id: 1
				},],
				current: 2,
				keyWord: '',
				reportState: null,
				list: [],
			};
		},
		onLoad() {
			this.confireUserInfo();
		},
		methods: {
			confireUserInfo() {
				let userId = this.$store.getters.userId
				let idcard = this.$store.getters.idcard
				let name = this.$store.getters.name

				if (userId.length==0) {
					showConfirm('请登录').then(res => {
						console.log(res,"-=")
						if (res.confirm) {
							uni.reLaunch({
								url: '/pages/login/login'
							})
						} else if (res.cancel) {
							uni.reLaunch({
								url: '/pages/index/index'
							})
						}
					})
					return
				}
				if (idcard.length > 0 && name.length > 0) {

				} else {
					let that = this
					uni.showModal({
						content: "尚未完善个人信息，请前往填写",
						success(res) {
							if (res.confirm) {
								that.$ut.jump("/pagesA/user/editMyInformation")
							} else if (res.cancel) {
								uni.reLaunch({
									url: '/pages/index/index'
								})
							}
						}
					})
				}
			},
			queryList(pageNo,pageSize) {
				uni.showLoading()
				let params = {
					currentPage: pageNo,
					pageSize: pageSize,
					keyWord: this.keyWord
				}
				if(this.current==1) {
					this.queryPersonalList(params);
				} else {
					params.status = this.reportState
					this.queryAllList(params);
				}
			},
			// 报告查看列表
			queryAllList(params) {
				selectHospitalReportList(params).then(res => {
					uni.hideLoading()
					if (res.code == 200) {
						this.$refs.paging.complete(res.data.records);
						console.log(this.list,"------------------------")
					}
				}).catch(err => {
					uni.hideLoading()
				})
			},
			// 报告解读列表
			queryPersonalList(params) {
				selectReportApplyForDoctor(params).then(res => {
					uni.hideLoading()
					if (res.code==200) {
						this.$refs.paging.complete(res.data.records);
					}
				}).catch(err=>{
					uni.hideLoading()
				})
			},
			search() {
				this.$refs.paging.reload();
			},
			onClick(item) {
				if (!item.status) {
					uni.navigateTo({
						url: '/pagesB/report/details-doctorAnalysis?id=' + item.id
					})
				} else {
					uni.navigateTo({
						url: '/pages/report/details?id=' + item.id
					})
				}

			},
			onItem(e, index) {
				this.current = e.id
				this.keyWord = ""
				this.$refs.paging.reload()
			},
			jump(item) {
				console.log(item.id,"!!!!!")
				if(item.id==null){
					uni.navigateTo({url: '/pagesB/report/query'})
				}
				if (item.reportStatus=="5" || item.reportUrl) {
					this.downReport(item.reportUrl)
				} else if(item.reportStatus=="4"){
					var params = {
						applyCode: item.fdApplyCode,
						idCard: item.fdIdcard,
						name: item.fdName,
						tel: item.tel
					}
					getReportInfo(params).then(res=>{
						uni.hideLoading()
						if(res.code == 200 && res.data && res.data.reportUrl){
							this.downReport(res.data.reportUrl)
						}
					})
				} else {
					uni.$u.toast('报告暂未生成')
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
			jumpPdf(item) {
				console.log('item', item)
				uni.navigateTo({
					url: '/pagesB/report/details-pdf?url=' + item.reportUrl
				})
			}
		}
	}
</script>

<style lang="less">
	.content {
		padding: 30rpx;
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
	
	.bottom-box{
		position: fixed;
		left: 0rpx;
		bottom: 0rpx;
		z-index: 9;
		width: 100%;
		height: 120rpx;
		background: #fff;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.button {
		width: 80%;
		height: 80rpx;
		border-radius: 80rpx;
		background: #3B7EFF1A;
		display: flex;
		align-items: center;
		justify-content: center;
		color: #3B7EFFFF;
		font-size: 36rpx;
		font-weight: 500;
		letter-spacing: 2rpx;
	}

	.green {
		color: #00C777FF;
		background: #00C7771A;
	}

	.red {
		color: #FD5454FF;
		background: #FD54541A;
	}
	.scroll {
		display: inline-flex;
		white-space: nowrap;
		background-color: #fff;
	}
</style>