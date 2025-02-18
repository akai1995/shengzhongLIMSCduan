<template>
	<view class="">
		<z-paging ref="paging" v-model="dataList" @query="queryList">
			<template #top>
				<u-navbar title="送检物流" :placeholder="true" border>
					<view class="u-nav-slot" slot="left">
						<u-icon name="arrow-left" @click="onBack" size="19"></u-icon>
						<u-line direction="column" :hairline="false" length="16" margin="0 8px"></u-line>
						<u-icon name="home" size="20" @click="onHome"></u-icon>
					</view>
				</u-navbar>
				<view class="">
					<u-tabs :list="tabs" :current="current" @click="tabClick"></u-tabs>
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

			<view class="content" v-if="total" style="padding: 1rpx 1rpx 70rpx;">
				<template v-for="(item, index) in dataList">
					<view class="sub-card" @click="routeDetail(item)">
						<view class="text-gray">送检编码：{{item.orderSn }}</view>
						<view v-for="(sitem, i) in item.applyList" class="d-flex">
							<view class="desc-text pr-20">姓名：{{ sitem.fdName }}</view>
							<view class="desc-text pr-20">性别：{{ sitem.fdSex }}</view>
							<view class="desc-text pr-20">年龄：{{ sitem.fdAge }}岁</view>
						</view>
						<view class="d-flex js-b-c stps">
							<view class="d-flex flex-clm jc-c-c">
								<view class="text-back">{{ item.sendOrg }}</view>
								<view class="text-gray">{{ mapCitys[item.sendOrgCity] }}</view>
							</view>
							<view class="d-flex flex-clm jc-c-c">
								<view class="font-im" style="padding-bottom: 10rpx;">{{ statusMap[item.status] }}</view>
								<image style="width: 100rpx; height: 20rpx;"
									src="https://genepiapi.ypzlfx.com/file/genepi/2023/11/24/I1BTGjtML0Xwa4702d8c72ceb2512bf94ee039cefc2d_20231124182321A413.png"
									mode="widthFix"></image>
							</view>
							<view class="d-flex flex-clm jc-c-c">
								<view class="text-back">{{ item.receiveOrg }}</view>
								<view class="text-gray">{{ mapCitys[item.receiveOrgCity] }}</view>
							</view>
						</view>
						<view class="d-flex js-b-c">
							<view class="text-gray">共{{ item.sampleCount }}份样本</view>
							<view class="d-flex">
								<u-tag v-if="orgId !== '12530000431201824Q'" @click="routeDetail(item)" text="送检详情"
									borderColor="#5178FF" color="#5178FF" plain bgColor="#ECF3FF"
									shape="circle"></u-tag>
								<view style="padding-left: 16rpx;">
									<u-tag @click.stop="route(item)" text="查看物流" borderColor="#5178FF" color="#5178FF"
										plain bgColor="#ECF3FF" shape="circle"> </u-tag>
								</view>
								<view style="padding-left: 16rpx;">
									<u-tag @click="showIs(item.id)"
										v-if="item.status === '3' && orgId === '12530000431201824Q'" text="确认接收"
										style="margin-left: 12rpx;" color="#fff" bgColor="#5178FF"
										shape="circle"></u-tag>
								</view>
							</view>
						</view>
					</view>
				</template>
			</view>
			<!-- <u-modal :show="isShow" @confirm="confirm" title="提示" content="是否确定接收样本?" @cancel="isShow = false"
				showCancelButton></u-modal> -->
		</z-paging>
		<ut-range-time ref="rangeTime" :show.sync="showTime" :startDate="startDate" :endDate="endDate"
			@change="changeTime"></ut-range-time>
	</view>
</template>

<script>
	import {
		sendOrderList,
		receiveOrder
	} from '@/api/order'
	import {
		mapGetters
	} from 'vuex'
	import {
		getDicts
	} from '../../api/expert/data'
	export default {
		data() {
			return {
				mapCitys: {},
				total: 0,
				current: 0,
				status: '',
				isShow: false,
				startDate: '',
				endDate: '',
				showTime: false,
				dataList: [],
				statusMap: {
					1: '待取件',
					2: '待取件',
					3: '运送中',
					4: '已送达',
					5: '已送达',
				},
				tabs: [{
						name: '全部',
						id: ''
					},
					{
						name: '待接收',
						id: '3'
					},
					{
						name: '已接收',
						id: '4'
					}
				]
			}
		},
		computed: {
			...mapGetters(['orgId']),
		},
		onLoad(options) {
			if (options.status) {
				this.current = options.status === '3' ? 1 : 0
				this.status = options.status
			}
			if (options.timeType) {
				this.setDate(options.timeType)
			}
			this.getDict()
		},
		methods: {
			setDate (timeType) {
				setTimeout(() => {
					this.$refs.rangeTime.open()
					this.startDate = this.$refs.rangeTime.mapRange[timeType].start
					this.endDate = this.$refs.rangeTime.mapRange[timeType].end
					this.$refs.paging.reload();
				}, 500)
			},
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
			tabClick(event) {
				console.log(event);
				const {
					id
				} = event
				this.status = id
				this.$refs.paging.reload();
			},
			queryList(pageNo, pageSize) {
				this.sendOrderListFn(pageNo, pageSize)
			},
			async sendOrderListFn(pageNo, pageSize) {
				const params = {
					pageNum: pageNo,
					pageSize: pageSize,
					status: this.status,
					startTime: this.startDate,
					endTime: this.endDate,
				}
				uni.showLoading({
					title: '加载中...',
					mask: true
				})
				const res = await sendOrderList(params)
				uni.hideLoading()
				if (!res || res.code !== 200) return
				this.total = res.data.total
				this.$refs.paging.complete([...res.data.records]);
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
			routeDetail(item) {
				let that = this
				uni.navigateTo({
					url: '/pagesC/submission/submission-detail?id=' + item.id,
					events: {
						change() {
							that.$refs.paging.reload();
						}
					}
				})
			},
			async confirm(id) {
				uni.showLoading({
					title: '提交中',
					mask: true
				})
				const res = await receiveOrder(id)
				uni.hideLoading()
				if (res.code == 200) {
					this.isShow = false;
					this.$ut.showText("接收成功");
					this.$refs.paging.reload();
				}
			},
			async getDict() {
				const res = await getDicts('city')
				console.log(res);
				if (!res || res.code !== 200) return
				const mapCitys = {}
				res.data.forEach(({
					dictValue,
					dictLabel
				}) => {
					mapCitys[dictValue] = dictLabel
				})
				this.mapCitys = mapCitys
			}

		}
	}
</script>

<style lang="scss">
	@import './sub-card.scss'
</style>