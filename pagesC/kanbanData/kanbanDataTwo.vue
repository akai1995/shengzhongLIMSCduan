<template>
	<view style="background-color: #fff;">
		<ut-nav title="数据看板" border></ut-nav>
		<view class="head">
			<view class="h1" style="padding-bottom: 30rpx;">送检统计</view>
			<l-echart ref="chart1"></l-echart>
			<u-gap height="20rpx" marginTop="32rpx" marginBottom="32rpx" bgColor="#F8F8F8"></u-gap>
			<view class="h1" style="padding-bottom: 30rpx;">样本统计</view>
			<l-echart ref="chart2"></l-echart>
			<u-gap height="20rpx" marginTop="32rpx" marginBottom="32rpx" bgColor="#F8F8F8"></u-gap>
			<view class="flex j-c">
				<view class="h1">本院送检科室top5</view>
				<view class="flex-c">
					<block v-for="(item,index) in typeList1" :key="index">
						<view class="span" :class="active1 == item.id?'active':''" @click="onItem1(item)">{{item.label}}
						</view>
					</block>
				</view>
			</view>
			<view class="echart m-t3" v-if="active1 == 'year'">
				<view class="m-t3" v-if="inspectYear[0]">
					<view class="label-box">
						<view class="flex">
							<image class="top-img" :src="top1" mode=""></image> {{inspectYear[0].department}}
						</view>
						<view style="color: #FDB141;">{{inspectYear[0].departmentCount}}</view>
					</view>
					<view class="m-t1">
						<u-line-progress :percentage="inspectYear[0].percentage" activeColor="#FDB141" :showText="false"
							height="24rpx"></u-line-progress>
					</view>
				</view>
				<view class="m-t3" v-if="inspectYear[1]">
					<view class="label-box">
						<view class="flex">
							<image class="top-img" :src="top2" mode=""></image>{{inspectYear[1].department}}
						</view>
						<view style="color: #99A0B1;">{{inspectYear[1].departmentCount}}</view>
					</view>
					<view class="m-t1">
						<u-line-progress :percentage="inspectYear[1].percentage" activeColor="#99A0B1" :showText="false"
							height="24rpx"></u-line-progress>
					</view>
				</view>
				<view class="m-t3" v-if="inspectYear[2]">
					<view class="label-box">
						<view class="flex">
							<image class="top-img" :src="top3" mode=""></image>{{inspectYear[2].department}}
						</view>
						<view style="color: #DDA07F;">{{inspectYear[2].departmentCount}}</view>
					</view>
					<view class="m-t1">
						<u-line-progress :percentage="inspectYear[2].percentage" activeColor="#DDA07F" :showText="false"
							height="24rpx"></u-line-progress>
					</view>
				</view>
				<view class="m-t3" v-if="inspectYear[3]">
					<view class="label-box">
						<view>{{inspectYear[3].department}}</view>
						<view style="color: #5178FF;">{{inspectYear[3].departmentCount}}</view>
					</view>
					<view class="m-t1">
						<u-line-progress :percentage="inspectYear[3].percentage" activeColor="#5178FF" :showText="false"
							height="24rpx"></u-line-progress>
					</view>
				</view>
				<view class="m-t3" v-if="inspectYear[4]">
					<view class="label-box">
						<view>{{inspectYear[4].department}}</view>
						<view style="color: #5178FF;">{{inspectYear[4].departmentCount}}</view>
					</view>
					<view class="m-t1">
						<u-line-progress :percentage="inspectYear[4].percentage" activeColor="#5178FF" :showText="false"
							height="24rpx"></u-line-progress>
					</view>
				</view>
			</view>
			<view class="echart m-t3" v-if="active1 == 'month'">
				<view class="m-t3" v-if="inspectMonth[0]">
					<view class="label-box">
						<view class="flex">
							<image class="top-img" :src="top1" mode=""></image> {{inspectMonth[0].department}}
						</view>
						<view style="color: #FDB141;">{{inspectMonth[0].departmentCount}}</view>
					</view>
					<view class="m-t1">
						<u-line-progress :percentage="inspectMonth[0].percentage" activeColor="#FDB141"
							:showText="false" height="24rpx"></u-line-progress>
					</view>
				</view>
				<view class="m-t3" v-if="inspectMonth[1]">
					<view class="label-box">
						<view class="flex">
							<image class="top-img" :src="top2" mode=""></image>{{inspectMonth[1].department}}
						</view>
						<view style="color: #99A0B1;">{{inspectMonth[1].departmentCount}}</view>
					</view>
					<view class="m-t1">
						<u-line-progress :percentage="inspectMonth[1].percentage" activeColor="#99A0B1"
							:showText="false" height="24rpx"></u-line-progress>
					</view>
				</view>
				<view class="m-t3" v-if="inspectMonth[2]">
					<view class="label-box">
						<view class="flex">
							<image class="top-img" :src="top3" mode=""></image>{{inspectMonth[2].department}}
						</view>
						<view style="color: #DDA07F;">{{inspectMonth[2].departmentCount}}</view>
					</view>
					<view class="m-t1">
						<u-line-progress :percentage="inspectMonth[2].percentage" activeColor="#DDA07F"
							:showText="false" height="24rpx"></u-line-progress>
					</view>
				</view>
				<view class="m-t3" v-if="inspectMonth[3]">
					<view class="label-box">
						<view>{{inspectMonth[3].department}}</view>
						<view style="color: #5178FF;">{{inspectMonth[3].departmentCount}}</view>
					</view>
					<view class="m-t1">
						<u-line-progress :percentage="inspectMonth[3].percentage" activeColor="#5178FF"
							:showText="false" height="24rpx"></u-line-progress>
					</view>
				</view>
				<view class="m-t3" v-if="inspectMonth[4]">
					<view class="label-box">
						<view>{{inspectMonth[4].department}}</view>
						<view style="color: #5178FF;">{{inspectMonth[4].departmentCount}}</view>
					</view>
					<view class="m-t1">
						<u-line-progress :percentage="inspectMonth[4].percentage" activeColor="#5178FF"
							:showText="false" height="24rpx"></u-line-progress>
					</view>
				</view>
			</view>
			<view class="echart m-t3" v-if="active1 == 'lastMonth'">
				<view class="m-t3" v-if="inspectLastMonth[0]">
					<view class="label-box">
						<view class="flex">
							<image class="top-img" :src="top1" mode=""></image> {{inspectLastMonth[0].department}}
						</view>
						<view style="color: #FDB141;">{{inspectLastMonth[0].departmentCount}}</view>
					</view>
					<view class="m-t1">
						<u-line-progress :percentage="inspectLastMonth[0].percentage" activeColor="#FDB141"
							:showText="false" height="24rpx"></u-line-progress>
					</view>
				</view>
				<view class="m-t3" v-if="inspectLastMonth[1]">
					<view class="label-box">
						<view class="flex">
							<image class="top-img" :src="top2" mode=""></image>{{inspectLastMonth[1].department}}
						</view>
						<view style="color: #99A0B1;">{{inspectLastMonth[1].departmentCount}}</view>
					</view>
					<view class="m-t1">
						<u-line-progress :percentage="inspectLastMonth[1].percentage" activeColor="#99A0B1"
							:showText="false" height="24rpx"></u-line-progress>
					</view>
				</view>
				<view class="m-t3" v-if="inspectLastMonth[2]">
					<view class="label-box">
						<view class="flex">
							<image class="top-img" :src="top3" mode=""></image>{{inspectLastMonth[2].department}}
						</view>
						<view style="color: #DDA07F;">{{inspectLastMonth[2].departmentCount}}</view>
					</view>
					<view class="m-t1">
						<u-line-progress :percentage="inspectLastMonth[2].percentage" activeColor="#DDA07F"
							:showText="false" height="24rpx"></u-line-progress>
					</view>
				</view>
				<view class="m-t3" v-if="inspectLastMonth[3]">
					<view class="label-box">
						<view>{{inspectLastMonth[3].department}}</view>
						<view style="color: #5178FF;">{{inspectLastMonth[3].departmentCount}}</view>
					</view>
					<view class="m-t1">
						<u-line-progress :percentage="inspectLastMonth[3].percentage" activeColor="#5178FF"
							:showText="false" height="24rpx"></u-line-progress>
					</view>
				</view>
				<view class="m-t3" v-if="inspectLastMonth[4]">
					<view class="label-box">
						<view>{{inspectLastMonth[4].department}}</view>
						<view style="color: #5178FF;">{{inspectLastMonth[4].departmentCount}}</view>
					</view>
					<view class="m-t1">
						<u-line-progress :percentage="inspectLastMonth[4].percentage" activeColor="#5178FF"
							:showText="false" height="24rpx"></u-line-progress>
					</view>
				</view>
			</view>
			
			<view class="flex j-c">
				<view class="h1">送检科室top5</view>
				<view class="flex-c">
					<block v-for="(item,index) in typeList1" :key="index">
						<view class="span" :class="active1 == item.id?'active':''" @click="onItem1(item)">{{item.label}}
						</view>
					</block>
				</view>
			</view>
			<l-echart ref="chart3"></l-echart>
			
			<view class="flex j-c">
				<view class="h1">检测项目top10</view>
				<view class="flex-c">
					<block v-for="(item,index) in typeList2" :key="index">
						<view class="span" :class="active2 == item.id?'active':''" @click="onItem2(item)">{{item.label}}
						</view>
					</block>
				</view>
			</view>
			<view class="echart m-t3">
				<l-echart ref="chart"></l-echart>
			</view>
		</view>

		<view class="box m-t2">

		</view>
	</view>
</template>

<script>
	import lEchart from "../components/lime-echart/components/l-echart/l-echart.vue"
	import * as echarts from "../components/lime-echart/static/echarts.min.js"
	import {
		getDepartmentAmount,
		getProjectNameAmount,
		getProvinceSendAmount
	} from "@/api/hospitalrelated/doctorIndexStatistic.js"
	export default {
		components: {
			lEchart
		},
		data() {
			return {
				active1: 'year',
				active2: 'year',
				typeList1: [{
					id: 'year',
					label: '今年'
				}, {
					id: 'month',
					label: '本月'
				}, {
					id: 'lastMonth',
					label: '上月'
				}],
				typeList2: [{
					id: 'year',
					label: '今年'
				}, {
					id: 'month',
					label: '本月'
				}, {
					id: 'lastMonth',
					label: '上月'
				}],
				top1: "https://genepiapi.ypzlfx.com/file/genepi/2023/11/21/top1_20231121173442A107.png",
				top2: "https://genepiapi.ypzlfx.com/file/genepi/2023/11/21/top2_20231121173544A108.png",
				top3: "https://genepiapi.ypzlfx.com/file/genepi/2023/11/21/top3_20231121173609A109.png",
				inspectYear: [],
				inspectMonth: [],
				inspectLastMonth: [],
				projectYear: [],
				projectMonth: [],
				projectLastMonth: [],
				byList: null,
				wyList: null,
				hjList: null
			};
		},
		onLoad() {
			this.chart1View()
			this.init()
			this.getTop5()
			this.getTop10()
		},
		methods: {
			chart1View() {
				this.$refs.chart1.init(echarts, chart => {
					const option = {
						tooltip: {
							trigger: 'axis',
							axisPointer: {
								type: 'shadow'
							},
							confine: true
						},
						legend: {
							itemGap: 30,
							itemStyle: {
								opacity: 0
							},
							formatter: function(ov) {
								console.log(ov);
								return `${ov}\n{b|123}`
							},
							data: [{
									name: '2023年',
									textStyle: {
										rich: {
											b: {
												color: '#3B7EFF',
											},

										}
									}
								},
								{
									name: '2022年',
									textStyle: {
										rich: {
											b: {
												color: '#59D9A4',
											},

										}
									}

								},
								{
									name: '2021年',
									textStyle: {
										rich: {
											b: {
												color: '#FF9900',
											},

										}
									}
								},
							]
						},
						grid: {
							left: 0,
							right: 0,
							bottom: 0,
							top: 40,
							containLabel: true
						},
						xAxis: [{
							type: 'category',
							axisLine: {
								lineStyle: {
									color: '#F2F2F2'
								}
							},
							axisTick: {
								alignWithLabel: true
							},
							axisLabel: {
								color: '#999',
								interval: 0
							},
							data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月',
								'12月'
							],
						}],
						yAxis: [{
							type: 'value',
							axisTick: {
								show: false
							},
							axisLine: {
								lineStyle: {
									color: '#F2F2F2'
								}
							},
							axisLabel: {
								color: '#999',

							}
						}],
						series: [{
								name: '2021年',
								type: 'line',
								showSymbol: false,
								lineStyle: {
									color: '#FF9900'
								},
								data: [300, 270, 340, 344, 300, 320, 310, 32, 332, 442, 43, 33],
							},
							{
								name: '2022年',
								type: 'line',
								lineStyle: {
									color: '#59D9A4'
								},
								showSymbol: false,
								data: [120, 102, 141, 174, 190, 250, 220, 300, 270, 340, 344, 300, ]
							},
							{
								name: '2023年',
								type: 'line',
								lineStyle: {
									color: '#3B7EFF'
								},
								areaStyle: { //区域样式
									origin: "start", //向最小值方向渐变，y轴有负值要写
									color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
											offset: 0,
											color: "#CFDAFF",
										},
										{
											offset: 1,
											color: "#FEFFFF",
										},
									]),
								},
								showSymbol: false,
								data: [41, 174, 190, 250, 220, 300, 270, 340, 120, 320, 310, 344]
							}
						]
					}
					chart.setOption(option);
				})

				this.$refs.chart2.init(echarts, chart => {
					const option = {
						tooltip: {
							trigger: 'axis',
							axisPointer: {
								type: 'shadow'
							},
							confine: true
						},
						legend: {
							icon: "circle",
							itemWidth: 6,
							itemHeight: 6,
							formatter: function(ov) {
								console.log(ov);
								return `${ov}\n{b|123}`
							},
							data: [{
									name: '2023年',
									textStyle: {
										rich: {
											b: {
												color: '#3B7EFF',
											},

										}
									}
								},
								{
									name: '2022年',
									textStyle: {
										rich: {
											b: {
												color: '#59D9A4',
											},

										}
									}

								},
								{
									name: '2021年',
									textStyle: {
										rich: {
											b: {
												color: '#FF9900',
											},

										}
									}
								},
								{
									name: '2020年',
									textStyle: {
										rich: {
											b: {
												color: '#FF9900',
											},

										}
									}
								},
								{
									name: '2019年',
									textStyle: {
										rich: {
											b: {
												color: '#FF9900',
											},

										}
									}
								}
							]
						},
						grid: {
							left: 0,
							right: 0,
							bottom: 0,
							top: 40,
							containLabel: true
						},
						xAxis: [{
							type: 'category',
							axisLine: {
								lineStyle: {
									color: '#F2F2F2'
								}
							},
							axisLabel: {
								color: '#999',
								interval: 0
							},

							data: ['石蜡块/切片', '全血', '粪便', '新鲜组织', '其他'],
						}],
						yAxis: [{
							type: 'value',
							axisTick: {
								show: false
							},
							axisLine: {
								lineStyle: {
									color: '#F2F2F2'
								}
							},
							axisLabel: {
								color: '#999'
							}
						}],
						series: [{
							name: '2023年',
							barWidth: 6,
							type: 'bar',
							barGap: '50%',
							itemStyle: {
								borderRadius: 6,
								color: '#5178FF'
							},
							stackStrategy: 'all',
							showSymbol: false,
							data: [120, 102, 141, 174, 190]
						}, {
							name: '2022年',
							barWidth: 6,
							type: 'bar',
							barGap: '50%',
							itemStyle: {
								borderRadius: 6,
								color: '#59D9A4'
							},
							stackStrategy: 'all',
							showSymbol: false,
							data: [120, 102, 141, 174, 190]
						}, {
							name: '2021年',
							type: 'bar',
							barWidth: 6,
							barGap: '50%',
							barWidth: 6,
							itemStyle: {

								borderRadius: 6,
								color: '#FF9900'
							},
							stackStrategy: 'all',
							showSymbol: false,
							data: [120, 102, 141, 174, 190]
						}, {
							name: '2020年',
							barWidth: 6,
							barGap: '50%',
							type: 'bar',
							itemStyle: {
								borderRadius: 6,
								color: '#BE9EFB'
							},
							stackStrategy: 'all',
							showSymbol: false,
							data: [120, 102, 141, 174, 190]
						}, {
							name: '2019年',
							barWidth: 6,
							barGap: '50%',
							type: 'bar',
							itemStyle: {
								borderRadius: 6,
								color: '#FF8884'
							},
							stackStrategy: 'all',
							showSymbol: false,
							data: [120, 102, 141, 174, 190]
						}, ]
					}
					chart.setOption(option);
				})
				
				this.$refs.chart3.init(echarts, chart => {
					const option = {
						tooltip: {
							trigger: 'item'
						},
						legend: {
							bottom: '0',
							itemWidth: 10,
							itemHeight: 10
						},
						series: [{
								name: 'Access From',
								type: 'pie',
								radius: ['40%', '50%'],
								center: ['50%', '40%'],
								itemStyle: {
									borderColor: '#fff',
									borderWidth: 2
								},
								label: {
									position: 'outside',
									color: 'inherit',
									distanceToLabelLine: 0,
									emphasis: {
										disabled: true
									},
									formatter: function(event) {
										return event.value
									}
								},
								labelLine: {
									show: false,
								},
								emphasis: {
									disabled: true
								},
								labelLine: {
									show: false
								},
								data: [{
										value: 1048,
										name: 'Search Engine'
									},
									{
										value: 735,
										name: 'Direct'
									},
									{
										value: 580,
										name: 'Email'
									},
									{
										value: 484,
										name: 'Union Ads'
									},
									{
										value: 300,
										name: 'Video Ads'
									}
								]
							},
							{
								name: '送检科室',
								type: 'pie',
								itemStyle: {
									color: '#EEF1FF'
								},
								radius: '35%',
								center: ['50%', '40%'],
								emphasis: {
									disabled: true
								},
								label: {
									normal: {
										position: 'center',
										show: true,
										color: '#333',
										formatter: `{label|送检科室}\n{total|13131}`,
										rich: {
											label: {
												fontSize: 14,
												color: '#666'
											},
											total: {
												fontSize: 22,
												fontWeight: 'bold',
												lineHeight: 30,
												color: '#5178FF',
											},
										}
									}

								},

								data: [3961]
							}
						]
					};
					chart.setOption(option);
				})
			
			},
			init() {
				getProvinceSendAmount().then(res => {
					if (res.code == 200) {
						this.byList = res.data[0].sendAmountList
						this.wyList = res.data[1].sendAmountList
						this.hjList = res.data[2].sendAmountList
					}
				})
			},
			getTop5() {
				getDepartmentAmount().then(res => {
					if (res.code == 200) {
						res.data.forEach(item => {
							if (item.type == 'year') {
								this.inspectYear.push(item)
							} else if (item.type == 'month') {
								this.inspectMonth.push(item)
							} else if (item.type == 'lastMonth') {
								this.inspectLastMonth.push(item)
							}
						})
					}
				})
			},
			getTop10() {
				getProjectNameAmount().then(res => {
					if (res.code == 200) {
						res.data.forEach(item => {
							if (item.type == 'year') {
								this.projectYear.push(item)
							} else if (item.type == 'month') {
								this.projectMonth.push(item)
							} else if (item.type == 'lastMonth') {
								this.projectLastMonth.push(item)
							}
						})
						this.initEcharts(this.projectYear)
					}
				})
			},
			initEcharts(list) {
				this.$refs.chart.init(echarts, chart => {
					let xData = []
					let yData = []
					list.forEach(item => {
						xData.push(item.projectName)
						yData.push(item.projectCount)
					})
					let option = {
						xAxis: {
							type: 'category',
							data: xData,
							axisLabel: {
								interval: 0,
								rotate: '270',
								formatter: function(value) {
									if (value.length > 6) {
										return `${value.slice(0, 6)}...`
									}
									return value
								}
							}
						},
						yAxis: {
							type: 'value'
						},
						series: [{
							data: yData,
							type: 'line',
							symbolSize: 8,
							label: {
								show: true, // 在折线拐点上显示数据
								fontSize: 14,
								color: "#5178FF",
								fontWeight: 500,
							},
							lineStyle: {
								normal: {
									width: 4,
									color: '#5178FFFF',
								}
							},
							areaStyle: { //区域样式
								origin: "start", //向最小值方向渐变，y轴有负值要写
								color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
										offset: 0,
										color: "#5178FFFF",
									},
									{
										offset: 1,
										color: "#5178FF00",
									},
								]),
							},

						}]
					}
					chart.setOption(option);

				});
			},
			onItem1(item) {
				this.active1 = item.id
			},
			onItem2(item) {
				if (item.id == 'year') {
					this.initEcharts(this.projectYear)
				} else if (item.id == 'month') {
					this.initEcharts(this.projectMonth)
				} else if (item.id == 'lastMonth') {
					this.initEcharts(this.projectLastMonth)
				}
				this.active2 = item.id
			},


		}


	}
</script>

<style lang="scss">
	.head {
		width: 100%;
		min-height: 300rpx;
		padding: 30rpx 30rpx 50rpx 30rpx;
		box-sizing: border-box;
		background: #fff;

		.div-box {
			width: 100%;
			min-height: 245rpx;
			border-radius: 16rpx;
			background: #f8f8f8;

			.div {
				padding: 30rpx 0rpx;
				box-sizing: border-box;
				display: flex;
				position: relative;

				&::after {
					content: '';
					width: 90%;
					height: 1rpx;
					background: #0000001A;
					position: absolute;
					left: 50%;
					bottom: 0;
					transform: translateX(-50%);
				}

				&:last-child::after {
					height: 0;
				}

				.title-name {
					position: absolute;
					left: 0;
					top: 0;
					padding: 5rpx 15rpx;
					border-radius: 50rpx;
					background: rgba(103, 137, 255, 0.1);
					font-size: 20rpx;
					color: #6789FFFF;
					font-weight: 500;
				}

				.item {
					flex: 1;
					height: 100%;
					position: relative;
					text-align: center;

					&::after {
						content: '';
						width: 1rpx;
						height: 90%;
						background: #0000001A;
						position: absolute;
						top: 50%;
						right: 0;
						transform: translateY(-50%);
					}

					&:last-child::after {
						width: 0;
					}

				}
			}

		}
	}

	.p1 {
		font-size: 24rpx;
		color: #999;
		white-space: nowrap;
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