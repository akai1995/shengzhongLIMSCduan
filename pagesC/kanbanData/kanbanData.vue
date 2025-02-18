<template>
	<view class="safe-area-inset-bottom" style="background-color: #fff;">
		<ut-nav title="科研数据" border></ut-nav>
		<view class="content">
			<view class="h1" style="padding-bottom: 30rpx;">{{ orgId !== '12530000431201824Q' ? '送检数据统计' : '检测数量统计' }}</view>
			<Chart chartType="0" :chartData="chart1"></Chart>
			<u-gap height="20rpx" marginTop="32rpx" marginBottom="32rpx" bgColor="#F8F8F8"></u-gap>
			<view class="h1" style="padding-bottom: 30rpx;">样本统计</view>
			<Chart chartType="1" :chartData="chart2"></Chart>
			<u-gap height="20rpx" marginTop="32rpx" marginBottom="32rpx" bgColor="#F8F8F8"></u-gap>
			<view class="flex j-c">
				<view class="h1">癌肿排行</view>
			</view>
			<view class="echart m-t3">
				<template v-for="(item, index) in chart3">
					<view :key="index" class="m-t3">
						<view class="label-box">
							<view class="flex">
								<image v-if="index < 3" class="top-img" :src="iconTop['top' + index]" mode=""></image>
								{{ item.cancerType }}
							</view>
							<view :style="{ color: colorBy[index] }">{{ item.amount }}</view>
						</view>
						<view class="m-t1">
							<u-line-progress :percentage="(percentage | item.amount)" :activeColor="colorBy[index]"
								:showText="false" height="24rpx"></u-line-progress>
						</view>
					</view>
				</template>
			</view>
			<u-gap height="20rpx" marginTop="32rpx" marginBottom="32rpx" bgColor="#F8F8F8"></u-gap>
			<view class="flex j-c">
				<view class="h1">{{ orgId == '12530000431201824Q' ? '送检医院' : '送检科室' }}top5</view>
				<view class="flex-c">
					<block v-for="(item,index) in typeList" :key="index">
						<view @click="onItem(item.id,'active1')" class="span" :class="active1 == item.id?'active':''">
							{{item.label}}
						</view>
					</block>
				</view>
			</view>
			<Chart chart-type="2" :chart-data="chart4" :title="orgId == '12530000431201824Q' ? '送检医院' : '送检科室'"></Chart>
			<u-gap height="20rpx" marginTop="32rpx" marginBottom="32rpx" bgColor="#F8F8F8"></u-gap>
			<view class="flex j-c">
				<view class="h1">检测项目top10</view>
				<view class="flex-c">
					<block v-for="(item,index) in typeList" :key="index">
						<view class="span" :class="active2 == item.id?'active':''" @click="onItem(item.id, 'active2')">
							{{item.label}}
						</view>
					</block>
				</view>
			</view>
			<Chart chart-type="3" :chartData="chart5"></Chart>
		</view>
	</view>
</template>

<script>
	import lEchart from "../components/lime-echart/components/l-echart/l-echart.vue"
	import * as echarts from "../components/lime-echart/static/echarts.min.js"
	import {
		getDepartmentAmount,
		getHospitalAmount,
		getProjectNameAmount,
		getSendAmount,
		getCancerTypeAmount,
		getSampleAmountForFiveYears,
		getSendAmountForThreeYears
	} from "@/api/hospitalrelated/doctorIndexStatistic.js"
	import Chart from "./chart/Chart.vue"
	import {
		mapGetters
	} from 'vuex'
	import storage from "../../utils/storage"

	export default {
		components: {
			lEchart,
			Chart
		},
		filters: {
			percentage(amount) {
				console.log(amount);
				return amount / this.chart4Total
			}
		},
		data() {
			return {
				chart1: [], // 近三年送检量统计
				chart2: [], // 样本统计
				chart3: [], // 癌种排行
				chart4: [],
				chart5: [],
				top10data: [],
				top5data: [],
				chart4Total: 0,
				typeList: [{
					id: 'year',
					label: '今年'
				}, {
					id: 'month',
					label: '本月'
				}, {
					id: 'lastMonth',
					label: '上月'
				}],
				active1: 'year',
				active2: 'year',
				title: '送检科室',
				iconTop: {
					top0: "https://genepiapi.ypzlfx.com/file/genepi/2023/11/21/top1_20231121173442A107.png",
					top1: "https://genepiapi.ypzlfx.com/file/genepi/2023/11/21/top2_20231121173544A108.png",
					top2: "https://genepiapi.ypzlfx.com/file/genepi/2023/11/21/top3_20231121173609A109.png",
				},
				colorBy: ['#FDB141', '#99A0B1', '#DDA07F', '#5178FF', ' #5178FF']
			};
		},
		computed: {
			...mapGetters(['orgId'])
		},
		onLoad() {
			setTimeout(() => {
				console.log(storage);
				console.log(this.orgId, storage.get('orgId'));
			}, 500)
			this.getSjlSn()
			this.getYbtj()
			this.getAzph()
			this.getTop5()
			this.getTop10()
		},
		methods: {
			onItem(id, field) {
				this[field] = id
				if (field == 'active2') {
					this.filterTop10()
				} else if (field == 'active1') {
					this.filterTop5()
				}
			},
			async getSjlSn() {
				const res = await getSendAmountForThreeYears()
				console.log(res);
				if (!res || res.code !== 200) return
				this.chart1 = res.data
			},
			async getAzph() {
				const res = await getCancerTypeAmount()
				console.log(res);
				if (!res || res.code !== 200) return
				this.chart3 = res.data
				this.chart4Total = res.data.reduce((curTotal, item) => curTotal + item.amount, 0)
			},
			async getYbtj() {
				const res = await getSampleAmountForFiveYears()
				console.log(res);
				if (!res || res.code !== 200) return
				this.chart2 = res.data
			},
			async getTop10() {
				const res = await getProjectNameAmount()
				console.log(res);
				if (!res || res.code !== 200) return
				this.top10data = res.data
				this.filterTop10()
			},
			async getTop5() {
				let res = '';
				if (this.orgId == '12530000431201824Q') {
					res = await getHospitalAmount()
				} else {
					res = await getDepartmentAmount()
				}
				// res = await getDepartmentAmount()
				if (!res || res.code !== 200) return
				this.top5data = res.data
				this.filterTop5()
			},
			filterTop10() {
				const {
					top10data,
					active2
				} = this
				this.chart5 = top10data.filter(({
					type
				}) => type === active2)
			},
			filterTop5() {
				const {
					top5data,
					active1
				} = this
				this.chart4 = top5data.filter(({
					type
				}) => type === active1)
				console.log(this.chart4);
			}
		}

	}
</script>

<style lang="scss">
	.p1 {
		font-size: 24rpx;
		color: #999;
	}

	.p2 {
		font-size: 48rpx;
		font-weight: bold;
		color: #333;
		line-height: 1.5;
	}

	.flex-a {
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.flex-c {
		width: 50%;
		display: flex;
		align-items: center;
		justify-content: flex-end;
	}

	.color1 {
		color: #00C777;
		margin: 0 10rpx;
	}

	.color2 {
		color: #FD5454;
		margin: 0 10rpx;
	}

	.color3 {
		color: #333;
		font-weight: bold;
		margin: 0 10rpx;
	}

	.box {
		width: 100%;
		height: auto;
		padding: 50rpx 30rpx;
		box-sizing: border-box;
		background: #fff;
	}

	.span {
		width: 100rpx;
		font-size: 24rpx;
		color: #999;
		text-align: center;
	}

	.echart {
		width: 100%;
		height: 500rpx;
	}

	.active {
		padding: 10rpx 15rpx;
		box-sizing: border-box;
		border-radius: 60rpx;
		color: #5178FF;
		border: 1rpx solid #5178FF;
	}

	/deep/ .u-line-progress {
		border-radius: 4rpx !important;
	}

	/deep/ .u-line-progress__line {
		border-radius: 4rpx !important;
	}

	/deep/ .u-line-progress__background {
		border-radius: 4rpx !important;
	}

	.label-box {
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: space-between;
		font-size: 24rpx;
		color: #333;
	}

	.top-img {
		width: 32rpx;
		height: 32rpx;
		margin-right: 5rpx;
	}
</style>