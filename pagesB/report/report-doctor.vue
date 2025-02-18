<template>
	<view>
		<z-paging ref="paging" v-model="list" @query="queryList">
			<template #top>
				<ut-nav title="报告查看"></ut-nav>
				<u-search placeholder="搜索" :showAction='false' v-model="keyWord" @clickIcon="queryList"
					@search="queryList" @custom="queryList">
				</u-search>
			</template>
			<view class="list" v-for="item in list" :key="item.id" @click="jump(item)">
				<view class="content">
					<view class="title">{{item.projectName}}</view>
					<image class="ok" src="@/static/images/ok.png" mode=""
						v-if='item.reportStatus=="4" || item.reportStatus=="5"'></image>
					<image class="ok" src="@/static/images/undo.png" mode="" v-else-if='item.reportStatus=="0"'></image>
					<image class="ok" src="@/static/images/processing.png" mode="" v-else></image>
					<view class="info">
						<view class="t">姓名：{{item.fdName}}</view>
						<view class="t">性别：{{item.sex}}</view>
						<view class="t">年龄：{{item.age}}岁</view>
					</view>
					<view class="text m-t2">
						<view class="label">检测时间：{{$ut.strSlice(item.registerDate)}}</view>
						<view class="label">申请编码：{{item.fdApplyCode}}</view>
					</view>
					<view class="text m-t2">
						<view class="label">检测医院：{{item.hospital}}</view>
					</view>
					<view class="get" v-if='item.reportStatus=="已完成"'>获取报告</view>
				</view>
			</view>
		</z-paging>
		<view class="button" @click="jump">报告自助查询</view>

		<ut-nodata v-if="list.length == 0"> </ut-nodata>
	</view>
</template>

<script>
	import {
		selectHospitalReportList,
		getReportInfo
	} from '@/api/report.js'
	import {
		showConfirm,
	} from '@/utils/common'
	export default {
		data() {
			return {
				pageNum: 1,
				pageSize: 99,
				keyWord: '',
				list: []
			}
		},
		onLoad() {
			let userId = this.$store.getters.userId
			let idcard = this.$store.getters.idcard
			let name = this.$store.getters.name
			if (userId.length == 0) {
				showConfirm('请登录').then(res => {
					console.log(res, "-=")
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
		methods: {
			queryList(pageNo, pageSize) {
				var params = {
					currentPage: pageNo,
					pageSize: pageSize,
					keyWord: this.keyWord
				}
				uni.showLoading({
					title: '加载中'
				})
				selectHospitalReportList(params).then(res => {
					uni.hideLoading()
					if (res.code == 200) {
						this.$refs.paging.complete(res.data.records);
						console.log(this.list, "------------------------")
					}
				}).catch(err => {
					uni.hideLoading()
				})
			},
			jump(item) {
				console.log(item.id, "!!!!!")
				if (item.id == null) {
					uni.navigateTo({
						url: '/pagesB/report/query'
					})
				}
				if (item.reportStatus == "5" || item.reportUrl) {
					this.downReport(item.reportUrl)
				} else if (item.reportStatus == "4") {
					var params = {
						applyCode: item.fdApplyCode,
						idCard: item.fdIdcard,
						name: item.fdName,
						tel: item.tel
					}
					getReportInfo(params).then(res => {
						uni.hideLoading()
						if (res.code == 200 && res.data && res.data.reportUrl) {
							this.downReport(res.data.reportUrl)
						}
					})
				}
			},
			downReport(reportUrl) {
				uni.downloadFile({
					url: reportUrl,
					success: function(res_) {
						var filePath = res_.tempFilePath;
						uni.openDocument({
							filePath: filePath,
							showMenu: true,
							success: function() {
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
		min-height: 268rpx;
		background: #fff;
		border-radius: 20rpx;
		margin-bottom: 30rpx;
		padding: 30rpx;
		box-sizing: border-box;
		position: relative;

		.title {
			width: 100%;
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

	.button {
		position: fixed;
		left: 70rpx;
		right: 70rpx;
		bottom: 65rpx;
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
</style>