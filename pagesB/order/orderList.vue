<template>
	<view>
		<z-paging ref="paging" v-model="list" @query="queryList">
			<template #top>
				<ut-nav title="样本物流"></ut-nav>
				<view class="inquire">
					<view class="inquire-item" @click="show = true">
						<view class="label">状态</view>
						<u--input v-model="statusName" readonly placeholder="请选择状态"></u--input>
					</view>
					<u-picker :show="show" :columns="statusList" keyName="label" closeOnClickOverlay 
						@confirm="onStatus" @cancel="show = false"></u-picker>
				</view>
			</template>

			<view class="content">
				<view>
					<view class="list" v-for="item in list" :key="item.id" @click="jump(item)">
						<view class="text m-t2">
							<view class="label">寄送医院：<text style="font-weight: 600;font-size: 32rpx;">{{item.sendOrg}}</text></view>
						</view>
						<view class="text m-t2">
							<view class="label">接收医院：<text style="font-weight: 600;font-size: 32rpx;">{{item.receiveOrg}}</text></view>
						</view>
						<view class="text m-t2" style="margin-top: 26rpx;">
							<view class="label">申请时间：{{item.createTime}}</view>
						</view>
						<view class="text m-t2">
							<view class="label">申请单号：{{item.orderSn}}</view>
						</view>
						
						
						<view class="abc">
							<view v-if="item.status == 1">
								<u-tag text="待确认" size="mini"></u-tag>
							</view>
							<view v-if="item.status == 2">
								<u-tag text="已确认" size="mini" type="warning"></u-tag>
							</view>
							<view v-if="item.status == 3">
								<u-tag text="寄送中" size="mini" type="warning"></u-tag>
							</view>
							<view v-if="item.status == 4">
								<u-tag text="已接收" size="mini" type="success"></u-tag>
							</view>
							<view v-if="item.status == 5">
								<u-tag text="已取消" size="mini" type="error"></u-tag>
							</view>
						</view>

					</view>
				</view>
			</view>

		</z-paging>
	</view>
</template>

<script>
	import {
		sendOrderList
	} from '@/api/order.js'
	export default {
		data() {
			return {
				status: 2,
				list: [],
				status: '',
				statusName: '',
				// statusList:[['待确认','已确认','寄送中','已接收','已取消','部分接收','部分作废',]],
				statusList: [
					[{
						label: '全部',
						id: ''
					},{
						label: '待确认',
						id: 1
					}, {
						label: '已确认',
						id: 2
					}, {
						label: '寄送中',
						id: 3
					}, {
						label: '已接收',
						id: 4
					}, {
						label: '已取消',
						id: 5
					} ]
				],
				show: false,
			}
		},
		onLoad() {

		},
		onShow(){
			// this.$refs.paging.reload();
		},
		methods: {
			queryList(pageNo, pageSize) {
				uni.showLoading()
				let params = {
					isAsc: 'desc',
					orderByColumn: 'create_time',
					pageNum: pageNo,
					pageSize: pageSize,
					status: this.status
				}
				sendOrderList(params).then(res => {
					uni.hideLoading()
					if (res.code == 200) {
						console.log(res.data, "res.data")
						this.$refs.paging.complete(res.data.records);
					}
				}).catch(err => {
					uni.hideLoading()
				})
			},
			onStatus(e) {
				// console.log('e', e)
				this.status = e.value[0].id
				this.statusName = e.value[0].label
				this.$refs.paging.reload();
				this.show = false
			},
			jump(item) {
				uni.navigateTo({
					url: '/pagesB/order/orderDetails?id='+item.id
				})

			},

		}
	}
</script>

<style lang="less">
	.inquire {
		padding: 20rpx;
		box-sizing: border-box;

		&-item {
			display: flex;
			align-items: center;

			.label {
				font-size: 28rpx;
				color: #999;
				width: 100rpx;
			}
		}
	}

	.content {
		width: 90%;
		height: auto;
		margin: auto;
		padding: 30rpx;
		box-sizing: border-box;
		background: #fff;
		border-radius: 20rpx;
	}

	.list {
		width: 100%;
		min-height: 268rpx;
		margin-bottom: 30rpx;
		position: relative;
		overflow: hidden;
		border-bottom: 1rpx solid #E7E7E7;
		padding-bottom: 20rpx;
		&:last-child{
			border-bottom: none;
		}

		.title {
			width: 100%;
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
			font-size: 32rpx;
			line-height: 1.8;
			// font-weight: 600;
			color: #000;
			letter-spacing: 1rpx;
		}


		.abc {
			position: absolute;
			right: 0rpx;
			top: 20rpx;
			z-index: 10;
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
			font-size: 28rpx;
			color: #333;
			font-weight: 400;
			display: flex;
			align-items: center;

			.label {
				margin-right: 20rpx;
			}
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
</style>