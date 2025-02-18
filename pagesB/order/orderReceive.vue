<template>
	<view>
		<z-paging ref="paging" v-model="dataList" @query="queryList">
			<template #top>
				<ut-nav title="样本接收" border></ut-nav>
				<view class="content">
						<view class="scan" @click="onScan()">
							<u-icon name="scan" color="#3B7EFF" size="22"></u-icon>
							<view class="m-l2">扫码接收</view>
						</view>
				</view>
				
				<ut-tabs :tabList="tabList" :current="current" @onItem="onItem"></ut-tabs>
			</template>
			<view class="content">
				<view class="m-t3">
					<view class="list" v-for="item in dataList" :key="item.id" @click="jump(item)">
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
		receiveList,orderSn
	} from '@/api/order.js'

	export default {
		data() {
			return {
				tabList: [{
					name: '待接收',
					id: 3
				}, {
					name: '已接收',
					id: 4
				}],
				current: 3,
				dataList: [],

			};
	},
	onLoad (options) {
		const orderReceive = options.orderReceive
    uni.setStorageSync('orderReceive',orderReceive)
		},
		methods: {
			queryList(pageNo,pageSize){
				uni.showLoading()
				let params = {
					isAsc: 'desc',
					orderByColumn: 'create_time',
					pageNum: pageNo,
					pageSize: pageSize,
					status: this.current
				}
				receiveList(params).then(res=>{
					uni.hideLoading()
					if (res.code == 200) {
						this.$refs.paging.complete(res.data.records);
					}  else if (res.code == 500) {
						this.$ut.showText(res.msg)
					}
				})
			},
			onItem(e, index) {
				this.current = e.id
				this.$refs.paging.reload();
			},
			
			jump(item) {
				uni.navigateTo({
					url: '/pagesB/order/orderDetails?id='+item.id+"&show=1"
				})
			},
			//扫码
			onScan(){
				uni.scanCode({
					success(res) {
						// console.log('res',res.result)
						orderSn(res.result).then(res_=>{
							if(res_.code == 200){
								uni.navigateTo({
									url: "/pagesB/order/orderDetails?id="+res.result+"&type=code"
								})
							}
						})
						
					}
				})
			}
		},
	}
</script>

<style lang="less">
	page {
		background: #fff !important;
	}

	.scan {
		width: 100%;
		height: 100rpx;
		border-radius: 20rpx;
		background: #E8F1F8FF;
		display: flex;
		align-items: center;
		justify-content: center;
		color: #3B7EFFFF;
		font-size: 28rpx;
	}

	.m-l2 {
		margin-left: 20rpx;
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
			font-weight: 600;
			color: #000;
			letter-spacing: 1rpx;
		}
	
	
		.abc {
			position: absolute;
			right: 0rpx;
			top: 20rpx;
			z-index: 10;
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

	.red {
		color: #FD5454FF;
		background: #FD54541A;
	}
	.green{
		color: #00C777FF;
		background: #00C7771A;
	}
</style>