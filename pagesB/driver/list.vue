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
					<u-picker :show="show" :columns="statusList" keyName="label" closeOnClickOverlay @confirm="onStatus"
						@cancel="show = false"></u-picker>
				</view>
			</template>

			<view class="content">
				<view v-if="list.length>0">
					<view class="base-block" style="margin-bottom: 32rpx;" v-for="item in list" :key="item.id"
						@click="jump(item)">
						<view class="d-flex ptb-8">
							<view class="flex1 d-flex ai-c">
								<text class="desc-label">寄送医院：</text>
								<text class="desc-value">{{item.sendOrg}}</text>
							</view>
							<u-tag v-if="item.status" :text="mapStatus[item.status].lb" size="mini"
								:type="mapStatus[item.status].tag" plain plainFill borderColor="transparent"></u-tag>
						</view>
						<view class="d-flex ai-c ptb-8">
							<text class="desc-label">接收医院：</text>
							<text class="desc-value">{{item.receiveOrg}}</text>
						</view>
						<view class="d-flex ai-c ptb-8">
							<text class="desc-label">申请时间：</text>
							<text class="desc-value">{{item.createTime}}</text>
						</view>
						<view class="d-flex ai-c ptb-8">
							<text class="desc-label">申请单号：</text>
							<text class="desc-value">{{item.orderSn}}</text>
						</view>
						<view class="d-flex j-end">
							<view v-if="item.feeStatus * 1" @click.stop="lookGoodsCost(item)"
								class="tag-plain-boder dis" style="width: 160rpx;">物流费用</view>
							<view v-else @click.stop="addGoodsCost(item)" class="tag-plain-boder"
								style="width: 160rpx;">物流费用</view>
						</view>
					</view>
				</view>
			</view>

		</z-paging>
		<u-popup :show="showP" @close="showP = false" closeable>
			<view v-if="showP" class="content">
				<view class="h1 text-center pd-32">物流费用</view>
				<view class="d-flex ai-c ptb-8">
					<text class="desc-label">交通方式：</text>
					<text class="desc-value">{{ dict.label.traffic_way[curInfo.transType] }}</text>
				</view>
				<template v-if="curInfo.transType == '1'">
					<view class="d-flex ai-c ptb-8">
						<text class="desc-label">油费：</text>
						<text class="desc-value">{{ curInfo.feeDetail.oilFee | toFixdNum(1) }}元</text>
					</view>
					<view class="d-flex ai-c ptb-8">
						<text class="desc-label">高速费：</text>
						<text class="desc-value">{{ curInfo.feeDetail.toll | toFixdNum(1) }}元</text>
					</view>
				</template>
				<template v-else>
					<view class="d-flex ai-c ptb-8">
						<text class="desc-label">高铁费：</text>
						<text class="desc-value">{{ curInfo.feeDetail.hightwayFee | toFixdNum(1) }}元</text>
					</view>
					<view class="d-flex ai-c ptb-8">
						<text class="desc-label">打车费：</text>
						<text class="desc-value">{{ curInfo.feeDetail.taxiFee | toFixdNum(1) }}元</text>
					</view>
				</template>
			</view>
		</u-popup>
	</view>
</template>

<script>
	import {
		sendOrderList
	} from '@/api/order.js'
	export default {
		dicts: ['traffic_way'],
		data() {
			return {
				showP: false,
				curInfo: {},
				status: 2,
				list: [],
				status: '',
				statusName: '',
				mapStatus: {
					1: {
						lb: '待确认',
						tag: 'primary'
					},
					2: {
						lb: '已确认',
						tag: 'warning'
					},
					3: {
						lb: '寄送中',
						tag: 'warning'
					},
					4: {
						lb: '已接收',
						tag: 'success'
					},
					5: {
						lb: '已完成',
						tag: 'success'
					},
				},
				statusList: [
					[{
						label: '全部',
						id: ''
					}, {
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
					}]
				],
				show: false,
			}
		},
		onLoad() {

		},
		methods: {
			lookGoodsCost(item) {
				this.showP = true
				this.curInfo = {
					...item
				}
			},
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
					url: '/pagesB/driver/details?id=' + item.id
				})
			},
			addGoodsCost(item) {
				const { id, sendOrgid } = item
				let that = this
				uni.navigateTo({
					url: `/pagesB/driver/add-cost/add-cost?id=${id}&orgid=${sendOrgid}`,
					events: {
						someEvent() {
							that.$refs.paging.reload();
						}
					}
				})
			}
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

	.desc-label {
		font-size: 28rpx;
		color: #666;
	}

	.desc-value {
		font-size: 28rpx;
		color: #000;
	}

	.ptb-8 {
		padding: 8rpx 0;
	}
</style>