<template>
	<view>
		<z-paging ref="paging" v-model="list" @query="queryList">
			<template #top>
				<ut-nav title="报告列表" border url="/pages/index/index"></ut-nav>
				<view class="top_container">
					<view class="btn-box">
						<u-tabs :list="tabList" is-scroll='false' @click="tabsItem" :activeStyle="{
					color: '#3B7EFF',
					fontWeight: 'bold',
					transform: 'scale(1.05)'
					}" :inactiveStyle="{
					        fontSize: '28rpx',
					        transform: 'scale(1)'
					        }"></u-tabs>
					</view>
					<view class="add_report" @click="$ut.jump('/pages/report/addReport')">添加报告</view>
				</view>
			</template>

			<view class="content">
				<!-- <u-action-sheet :actions="tabList" @select="selectClick" :closeOnClickOverlay="true"
					:safeAreaInsetBottom="true" :closeOnClickAction="true" @close="isShow = false" cancelText="取消"
					:show="isShow"></u-action-sheet> -->
				<view>
					<view class="list" v-for="item in list" :key="item.id">
						<view class="title">检测项目： {{item.projectName || ''}}</view>
						<!-- <image class="ok" src="@/static/images/ok.png" mode=""
							v-if='item.reportStatus=="4"||item.reportStatus=="5"'></image>
						<image class="ok" src="@/static/images/undo.png" mode="" v-else-if='item.reportStatus=="0"'>
						</image>
						<image class="ok" src="@/static/images/processing.png" mode="" v-else></image> -->
						<view class="info">
							<view class="t">姓名：{{item.fdName}}</view>
							<view class="t">性别：{{item.sex}}</view>
							<!-- <view class="t">年龄：{{item.age}}岁</view> -->
						</view>
						<view class="text j-c">
							<view class="label">样本编码：{{item.fdReportCode}}</view>
						</view>
						<view class="text j-c">
							<view class="label">检测医院：{{item.hospital}}</view>
							<!-- <view class="get" v-if='item.reportStatus=="4"'>获取报告</view> -->
						</view>
						<view class="text j-c">
							<view class="label">申请时间：{{item.registerDate}}</view>
						</view>
						<view class="text j-c">
							<view class="label">检测状态：{{state[item.reportStatus]}}</view>
						</view>
						<view class='reportDatil' @click="jumpPdf(item)"><text>查看报告</text></view>
						
						<!-- <view @click.stop="jumpDetails(item)">
							<view class="abc">
								<view class="tag" v-if="item.reportStatus>=4&&(item.analysisStatus == 0 || item.analysisStatus == null)">解读报告</view>
								<view class="tags" v-if="item.analysisStatus == 1">查看解读详情</view>
							</view>
						</view> -->
						<!-- <view class="m-t2 width">
							<scroll-view class="scroll" scroll-x>
								<u-steps :current="item.reportStatus==4?5:item.reportStatus"
									activeIcon="checkmark-circle-fill" inactiveIcon="minus-circle">
									<u-steps-item title="样本送检"></u-steps-item>
									<u-steps-item title="样本质控"></u-steps-item>
									<u-steps-item title="流程质控"></u-steps-item>
									<u-steps-item title="结果质控"></u-steps-item>
									<u-steps-item title="报告质控"></u-steps-item>
									<u-steps-item title="检测完成"></u-steps-item>
								</u-steps>
							</scroll-view>
						</view> -->


					</view>
				</view>
			</view>

			<!-- <template #bottom>
				<view class="box">
					<view class="button" @click="isShow = true">报告自助查询</view>
				</view>
			</template> -->
		</z-paging>
	</view>
</template>

<script>
	import {
		selectPersonalList,
		selectApplyCode
	} from '@/api/report.js'
	import {
		getFamilyListByUserId
	} from '@/api/personalCenter/personalCenter.js'
	import {
		showConfirm
	} from '@/utils/common'
	export default {
		data() {
			return {
				status: 2,
				list: [],
				state:['样本送检','样本质控','流程质控','结果质控','报告质控','检测完成'],
				isShow: false,
				tabList: [{
					name: '全部',
					type: 0
				}, {
					name: '本人',
					type: 1
				}, {
					name: '其他人',
					type: 2
				}],
				reportType: 0
			}
		},
		onShow() {
			this.getFamilyList()
			this.queryList(1,10)
		},
		onLoad() {
			let userId = this.$store.getters.userId
			let idcard = this.$store.getters.idcard
			let name = this.$store.getters.name
			console.log('idcard', idcard)
			console.log('name', name)
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
		},

		methods: {
			getFamilyList() {
				let userId = this.$store.getters.userId
				getFamilyListByUserId(userId).then(res => {
					console.log(res, 4444)
					res.data.forEach(item => {
						if (item.idcard != null) {
							item.age = this.getAge(item.idcard)
							console.log(item.age, "------------------------")
						}
					})
					this.list = res.data
					let idcard = this.$store.getters.idcard
					let name = this.$store.getters.name
					if ( this.list.length === 0) {
						let that = this
						uni.showModal({
							title: '添加报告',
							content: "请添加检测人档案后查看报告",
							success(res) {
								if (res.confirm) {
									that.$ut.jump("/pages/report/addReport")
								} else if (res.cancel) {
									uni.reLaunch({
										url: '/pages/index/index'
									})
								}
							}
						})
					}
				})
			},
			getAge(identityCard) {
				let len = (identityCard + "").length;
				let strBirthday = "";
				if (len == 18) {
					//处理18位的身份证号码从号码中得到生日和性别代码
					strBirthday =
						identityCard.substr(6, 4) +
						"/" +
						identityCard.substr(10, 2) +
						"/" +
						identityCard.substr(12, 2);
				}
				if (len == 15) {
					let birthdayValue = "";
					birthdayValue = identityCard.charAt(6) + identityCard.charAt(7);
					if (parseInt(birthdayValue) < 10) {
						strBirthday =
							"20" +
							identityCard.substr(6, 2) +
							"/" +
							identityCard.substr(8, 2) +
							"/" +
							identityCard.substr(10, 2);
					} else {
						strBirthday =
							"19" +
							identityCard.substr(6, 2) +
							"/" +
							identityCard.substr(8, 2) +
							"/" +
							identityCard.substr(10, 2);
					}
				}
				let birthDate = new Date(strBirthday);
				let nowDateTime = new Date();
				let age = nowDateTime.getFullYear() - birthDate.getFullYear();
				//再考虑月、天的因素;.getMonth()获取的是从0开始的，这里进行比较，不需要加1
				if (
					nowDateTime.getMonth() < birthDate.getMonth() ||
					(nowDateTime.getMonth() == birthDate.getMonth() &&
						nowDateTime.getDate() < birthDate.getDate())
				) {
					age--;
				}
				return age;
			},
			
			queryList(pageNo, pageSize) {
				uni.showLoading()
				let params = {
					isAsc: 'desc',
					orderByColumn: 'create_time',
					pageNum: pageNo,
					pageSize: pageSize,
					reasonable: true,
					reportType: this.reportType,
					// userId: this.$store.getters.userId
				}
				selectPersonalList(params).then(res => {
					uni.hideLoading()
					if (res.code == 200) {
						console.log(res.data, "res.data")
						this.$refs.paging.complete(res.data.records);
					}
				}).catch(err => {
					uni.hideLoading()
				})
			},
			jump(item) {
				if (item.reportStatus == '4') {
					uni.navigateTo({
						url: '/pagesB/report/query?id=' + item.id
					})
				}
				if (item.id == null) {
					uni.navigateTo({
						url: '/pagesB/report/query'
					})
				}


			},
			jumpPdf(item) {
				console.log(item,1111)
					
				if(!item.reportUrl){
					uni.showToast({
					        title: '检测未完成，无法查看',
					        icon: 'none',
					      })
				}else{
				uni.navigateTo({
					url: '/pages/report/showPort'
				})	
				}
				
				// if (item.reportStatus < 3) {
				// 	return
				// }
				// let reportUrl = 'http://192.168.110.33:9300/statics/2023/07/04/file_1688435765151_20230704095605A002.pdf'
				// uni.navigateTo({
				// 	url: '/pagesB/report/details-pdf?url=' + item.reportUrl
				// })
				uni.downloadFile({
					url: item.reportUrl,
					
					success: function(res_) {
						var filePath = res_.tempFilePath;
						console.log(res_,777)
						uni.openDocument({
							filePath: filePath,
							showMenu: true,
							success: function() {
								console.log('成功')
							},
							fail: function(err) {
							        console.error('打开文件失败', err)
							      }
						})
					},
					fail: function(err) {
					        console.error('外层', err)
					      }
				})
			},
			jumpDetails(item) {
				if (item.analysisStatus == 0 || item.analysisStatus == null) {
					uni.navigateTo({
						url: '/pages/report/explain'
					})
				} else if (item.analysisStatus == 1) {
					uni.navigateTo({
						url: '/pages/report/details?id=' + item.analysisId
					})
				}

			},
			scanCode() {
				uni.scanCode({
					success(res) {
						// console.log('res', res.result)
						let code = res.result
						selectApplyCode(code).then(res => {
							if (res.code == 200) {
								let id = res.data.id

								uni.navigateTo({
									url: '/pagesB/report/agreeBook?id=' + id + '&type=1'
								})
							} else if (res.code == 500) {
								this.$ut.showText(res.msg)
							}

						})
					}
				})
			},
			tabsItem(item) {
				// console.log('item', item);
				this.reportType = item.type
				this.$refs.paging.reload();
			}
			// 之前版本 点击弹窗
			// selectClick(e) {
			// 	// console.log('==', e)
			// 	if (e.name == '扫码查询') {
			// 		uni.scanCode({
			// 			success(res) {
			// 				// console.log('res', res.result)
			// 				let code = res.result
			// 				selectApplyCode(code).then(res => {
			// 					if (res.code == 200) {
			// 						let id = res.data.id

			// 						uni.navigateTo({
			// 							url: '/pagesB/report/agreeBook?id=' + id + '&type=1'
			// 						})
			// 					} else if (res.code == 500) {
			// 						this.$ut.showText(res.msg)
			// 					}

			// 				})
			// 			}
			// 		})
			// 	} else if (e.name == '自助查询') {
			// 		uni.navigateTo({
			// 			url: '/pagesB/report/query'
			// 		})
			// 	}
			// }
		}
	}
</script>

<style lang="less">
	.content {
		padding: 32rpx;
		box-sizing: border-box;
	}
	page{
		background-color: #fff;
	}

	.list {
		box-sizing: border-box;
		width: 100%;
		min-height: 268rpx;
		background: #fff;
		// border-radius: 20rpx;
		margin-bottom: 30rpx;
		border-bottom: 2rpx solid #E7E7E7;
		padding-bottom: 30rpx;
		box-sizing: border-box;
		position: relative;
		overflow: hidden;
		

		.title {
			width: 100%;
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
			font-size: 30rpx;
			line-height: 38rpx;
			font-weight: 600;
			color: #000;
			letter-spacing: 1rpx;
			margin-bottom: 10rpx;
		}

		.ok {
			width: 120rpx;
			height: 120rpx;
			position: absolute;
			top: 20rpx;
			right: 20rpx;
			z-index: 1;
		}

		.abc {
			position: absolute;
			right: 20rpx;
			bottom: 140rpx;
			z-index: 100;

			.tag {
				font-size: 24rpx;
				border: 1rpx solid #f90;
				color: #f90;
				padding: 5rpx 15rpx;
			}

			.tags {
				font-size: 24rpx;
				border: 1rpx solid #3B7EFF;
				color: #3B7EFF;
				padding: 5rpx 15rpx;
			}
		}

		.info {
			display: flex;
			align-items: center;
			color: #666;
			font-size: 24rpx;
			line-height: 1.5;
			font-weight: 400;
			color: #999999;

			.t {
				margin-right: 30rpx;
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
				line-height: 40rpx;
			}
		}

		.get {
			// position: absolute;
			// right: 20rpx;
			// bottom: 30rpx;
			padding: 5rpx 15rpx;
			color: #3B7EFFFF;
			font-size: 24rpx;
			background: #3B7EFF1A;
			border-radius: 10rpx;
			letter-spacing: 2rpx;
		}
		.reportDatil{
			box-sizing: border-box;
			width: 160rpx;
			height: 48rpx;
			background: linear-gradient(135deg, #00DEFF 0%, #0C5FFF 100%);
			border-radius: 80rpx;
			font-size: 24rpx;
			line-height: 28rpx;
			color: #fff;
			display: flex;
			justify-content: center;
			align-items: center;
			position: absolute;
			right: 4rpx;
			bottom: 30rpx;
		}
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

	/deep/ .u-text__value {
		// font-size: 24rpx !important;
	}

	.scroll {
		display: inline-flex;
		white-space: nowrap;
	}

	.top_container {
		display: flex;
		align-items: center;
		justify-content: space-between;
		background-color: #fff;
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
		border: 1px solid #3B7EFF;
		font-weight: 400;
		color: #3B7EFF;
		font-size: 22rpx;
		display: flex;
		justify-content: center;
		align-items: center;
	}
</style>