<template>
	<view>
		<z-paging ref="paging" v-model="list" @query="queryList()">
			<template #top>
				<ut-nav title="报告解读" url='/pages/index/index'></ut-nav>
				<ut-tabs :tabList="tabList" :current="current" @onItem="onItem"></ut-tabs>
			</template>
			<view class="content">
				<view>
					<view v-for="item in list" :key="item.id">
						<view v-if="item.applyTitle" class="list m-t3" @click="onClick(item)">
							<view class="title">{{item.applyTitle}}</view>
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
			</view>
		</z-paging>
		<view class="button" @click="$ut.jump('/pages/report/explain')">上传我的报告单</view>
	</view>
</template>

<script>
	import {
		reportAnalysislist
	} from '@/api/report.js'
	export default {
		data() {
			return {
				tabList: [{
					name: '已解读',
					id: 1,
				}, {
					name: '未解读',
					id: 0
				}],
				current: 1,
				list: []
			};
		},
		onShow() {
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
				this.queryList(1, 10)
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
				let params = {
					pageNum: pageNo,
					pageSize: pageSize,
					status: this.current,
					isAsc: 'ASC',
					orderByColumn: '',
					reasonable: true
				}
				uni.showLoading()
				reportAnalysislist(params).then(res => {
					uni.hideLoading()
					if (res.code) {
						this.$refs.paging.complete(res.data.records);
						// this.list = res.data.records
					}
				}).catch(err=>{
					uni.hideLoading()
				})
			},
			// getPage() {
			// 	let params = {
			// 		pageNum: 1,
			// 		pageSize: 10,
			// 		status: this.current,
			// 		isAsc: 'ASC',
			// 		orderByColumn: '',
			// 		reasonable: true
			// 	}
			// 	uni.showLoading()
			// 	reportAnalysislist(params).then(res => {
			// 		uni.hideLoading()
			// 		console.log('res', res)
			// 		if (res.code) {
			// 			this.list = res.data.records
			// 		}
			// 	})
			// },
			onClick(item) {
				uni.navigateTo({
					url: '/pages/report/details?id=' + item.id
				})
			},
			onItem(e, index) {
				this.current = e.id
				this.$refs.paging.reload();
			},
		}
	}
</script>

<style lang="less">
	.list {
		width: 100%;
		height: 210rpx;
		background: #fff;
		border-radius: 20rpx;
		padding: 30rpx 20rpx;
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

	.green {
		color: #00C777FF;
		background: #00C7771A;
	}

	.red {
		color: #FD5454FF;
		background: #FD54541A;
	}
</style>