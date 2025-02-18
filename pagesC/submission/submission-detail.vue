<template>
	<view class="wrapper">
		<u-navbar title="送检详情" :placeholder="true" border>
			<view class="u-nav-slot" slot="left">
				<u-icon name="arrow-left" @click="onBack" size="19"></u-icon>
				<u-line direction="column" :hairline="false" length="16" margin="0 8px"></u-line>
				<u-icon name="home" size="20" @click="onHome"></u-icon>
			</view>
		</u-navbar>
		<scroll-view class="page-content" scroll-with-animation scroll-y>
			<view style="padding: 1rpx 1rpx 70rpx;">
				<view class="sub-card d-flex">
					<view class="d-flex js-c-c" style="padding: 10rpx 0;">
						<!-- <u--image width="24rpx" height="152rpx" src="https://genepiapi.ypzlfx.com/file/genepi/2023/11/22/7tJ5g7y6K5TJ07c33bd599b79fd6f89a1531483f2685_20231122112111A180.png"></u--image> -->
						<u--image width="24rpx" height="152rpx"
							src="https://genepiapi.ypzlfx.com/file/genepi/2023/11/22/jfI61Id7XGGL6732b138be4deff3097ece86d1ac4adf_20231122112213A181.png"></u--image>
					</view>
					<view class="card-info pl-24 d-flex flex-clm js-b">
						<view>
							<view class="d-flex js-b-c pb-10">
								<view class="status-text">{{ statusMap[sendOrder.status] }}</view>
							</view>
							<view v-if="sendOrder.status == '1'" class="sub-text">待揽件 {{ sendOrder.sendOrg }}</view>
							<view v-if="sendOrder.status == '2'" class="sub-text">已揽件 {{ sendOrder.sendOrg }}</view>
							<view v-if="sendOrder.status == '3'" class="sub-text">已离开{{ sendOrder.sendOrg }}</view>
							<view v-if="sendOrder.status == '4'" class="sub-text">{{ sendOrder.sendOrg }}</view>
							<view v-if="sendOrder.status == '5'" class="sub-text">{{ sendOrder.sendOrg }}</view>
						</view>
						<view class="btm-text">送至 <text class="black">{{ sendOrder.receiveOrg }}</text> </view>
					</view>
				</view>
				<view class="sub-card">
					<view class="yp-list">
						<view v-for="(item, index) in sendSampleList" :key="index" class="lt-item d-flex wrap">
							<view class="desc-info">姓名：<text class="black">{{ item.orderInfo.geneApply.fdName }}</text>
							</view>
							<view class="desc-info">性别：<text class="black">{{ item.orderInfo.geneApply.fdSex }}</text>
							</view>
							<view class="desc-info">年龄：<text class="black">{{ item.orderInfo.geneApply.fdAge }}岁</text>
							</view>
							<view class="desc-info">样本：<text
									class="black">{{ item.orderInfo.geneSample.fdSampleCode }}</text></view>
						</view>
					</view>
					<view class="desc-info">送检编码：{{ sendOrder.orderSn }}</view>
					<view v-if="sendOrder.aptmtStart" class="desc-info">申请时间：{{ sendOrder.aptmtStart }}</view>
					<view v-if="sendOrder.receiveTime" class="desc-info">送达时间：{{ sendOrder.receiveTime }}</view>
					<!-- <view class="desc-info">完成时间：2023-10-12 12:26</view> -->
				</view>
				<view v-if="sendOrder.status * 1 === 3 || orgId === '12530000431201824Q'"
					style="padding: 32rpx 60rpx 60rpx;">
					<view class="btn-bim" @click="showIs(id)">确认接收</view>
					<u-modal :show="isShow" @confirm="confirm" title="提示" content="是否确定接收样本?" @cancel="isShow = false"
						showCancelButton></u-modal>
				</view>
			</view>
		</scroll-view>
	</view>
</template>

<script>
	import {
		sample,
		receiveOrder
	} from '@/api/order.js'
	import {
		mapGetters
	} from 'vuex'
	export default {
		data() {
			return {
				isShow: false,
				orderLogList: '',
				sendOrder: '',
				sendSampleList: '',
				statusMap: {
					1: '待取件',
					2: '待取件',
					3: '运送中',
					4: '已送达',
					5: '已送达',
				}
			}
		},
		onLoad(options) {
			this.detail(options.id)
			this.id = options.id
		},
		...mapGetters(['orgId']),
		methods: {
			showIs(id) {
				let that = this
				uni.showModal({
					title: '提示',
					content: '是否确定接收样本?',
					success(res) {
						if (res.confirm) {
							that.confirm(id)
						}
					}
				})
			},
			onBack() {
				uni.navigateBack({
					delta: 1
				})
			},
			onHome() {
				uni.redirectTo({
					url: '/pagesC/doctor-index/doctor-index'
				})
			},
			route(item) {
				uni.navigateTo({
					url: '/pagesC/physical/physical?id=' + item.id,
				})
			},
			async detail(id) {
				uni.showLoading({
					title: '加载中',
					mask: true
				})
				const res = await sample(id)
				uni.hideLoading()
				if (!res || res.code !== 200) return
				this.orderLogList = res.data.orderLogList
				this.sendOrder = res.data.sendOrder
				this.sendSampleList = res.data.sendSampleList
			},
			async confirm() {
				uni.showLoading({
					title: '提交中',
					mask: true
				})
				const res = await receiveOrder(this.info.id)
				uni.hideLoading()
				if (res.code == 200) {
					this.isShow = false;
					this.$ut.showText("接收成功");
					const eventChannel = this.getOpenerEventChannel()
					eventChannel.emit('change');
					uni.navigateBack({
						delta: 1
					})
				}
			},
		}
	}
</script>

<style lang="scss">
	@import './sub-card.scss';

	.btn-bim {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 80rpx;
		font-size: 36rpx;
		color: #fff;
		font-weight: 500;
		background: linear-gradient(135deg, #00DEFF 0%, #0C5FFF 100%);
		border-radius: 80rpx;
	}
</style>