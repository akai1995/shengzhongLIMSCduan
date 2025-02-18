<template>
	<view>
		<lEchart ref="chart"></lEchart>
	</view>
</template>

<script>
	import lEchart from "@/pagesC/components/lime-echart/components/l-echart/l-echart.vue"
	import * as echarts from "@/pagesC/components/lime-echart/static/echarts.min.js"
	export default {
		components: {
			lEchart
		},
		props: {
			chartType: {
				type: String,
				default: '0'
			},
			chartData: {
				type: Array,
				default: []
			},
			title: {
				type: String,
				default: '送检科室'
			}
		},
		watch: {
			'chartData': {
				immediate: true,
				handler: function(ov) {
					if (ov) {
						setTimeout(() => {
							this.init()
						}, 1000)
					}
				},

			}
		},
		data() {
			return {
				isEmpty: false
			};
		},
		onLoad() {

		},
		methods: {
			init() {
				switch (this.chartType) {
					case '0':
						this.initChart0()
						break;
					case '1':
						this.initChart1()
						break;
					case '2':
						this.initChart2()
						break;
					case '3':
						this.initChart3()
						break;

				}
			},
			initChart0() {
				const colorBy = ['#3B7EFF', '#59D9A4', '#FF9900']
				const list = [...this.chartData].reverse()
				const dataTit = list.map(({ year, jan, feb, mar, apr, may, jun, jul, aug, sep, oct, nov, dec }, index) => ({
					name: year + '年',
					textStyle: {
						rich: {
							b: {
								color: colorBy[index],
							},
					
						}
					},
					total: jan + feb + mar+ apr+ may+ jun+ jul+ aug+ sep+ oct+ nov+ dec
				}))
				const seriesData = list.map(({ year, jan, feb, mar, apr, may, jun, jul, aug, sep, oct, nov, dec }, index) => ({
					
							name: year + '年',
							type: 'line',
							showSymbol: false,
							areaStyle: index ? null : { //区域样式
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
							lineStyle: {
								color: colorBy[index]
							},
							data: [jan, feb, mar, apr, may, jun, jul, aug, sep, oct, nov, dec],
						
				}))
				this.$refs.chart.init(echarts, chart => {
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
							formatter: function(ov, ob) {
								const total = dataTit.find(({
									name
								}) => name == ov).total
								return `${ov}\n{b|${total}}`
							},
							data: [...dataTit]
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
						series: [...seriesData]
					}
					chart.setOption(option);
				})
			},
			initChart1() {
				const colorBy = ['#5178FF', '#59D9A4', '#FF9900', '#B590FA', '#FF8884']
				const list = [...this.chartData].reverse()
				const dataTit = list.map(({
					bloodNumber,
					fecesNumber,
					otherNumber,
					sectionNumber,
					tissueNumber,
					year
				}, index) => ({
					name: year + '年',
					textStyle: {
						rich: {
							b: {
								color: colorBy[index]
							}
						}
					},
					total: bloodNumber + fecesNumber + otherNumber + sectionNumber + tissueNumber
				}))
				const seriesData = list.map(({
					bloodNumber,
					fecesNumber,
					otherNumber,
					sectionNumber,
					tissueNumber,
					year
				}, index) => ({
					name: year + '年',
					barWidth: 6,
					type: 'bar',
					barGap: '50%',
					itemStyle: {
						borderRadius: 6,
						color: colorBy[index]
					},
					stackStrategy: 'all',
					showSymbol: false,
					data: [sectionNumber, bloodNumber, fecesNumber, tissueNumber, otherNumber]
				}))
				this.$refs.chart.init(echarts, chart => {
					const option = {
						tooltip: {
							trigger: 'axis',
							axisPointer: {
								type: 'shadow'
							},
							confine: true
						},
						legend: {
							left: 'top',
							icon: "circle",
							itemWidth: 6,
							itemHeight: 6,
							formatter: function(ov, ob) {
								const total = dataTit.find(({
									name
								}) => name == ov).total
								return `${ov}\n{b|${total}}`
							},
							data: dataTit
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
						series: seriesData
					}
					chart.setOption(option);
				})
			},
			initChart2() {
				const list = this.chartData
				const colorBy = ['#FF8884', '#FF9900', '#5178FF', '#59D9A4', '#B590FA']
				const data = list.map(({
					name,
					amount
				}, index) => ({
					name: name,
					value: amount,
					itemStyle: {
						color: colorBy[index]
					}
				}))
				const total = list.length ? list[0].totalAmount : 0
				this.$refs.chart.init(echarts, chart => {
					const option = {
						tooltip: {
							trigger: 'item'
						},
						legend: {
							bottom: 20,
							itemWidth: 10,
							itemHeight: 10
						},
						series: [{
								name: this.title,
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

								emphasis: {
									disabled: true
								},
								labelLine: {
									show: false,
									length: 10,
									length2: 0
								},
								data
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
										formatter: `{label|${this.title}}\n{total|${total}}`,
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
			initChart3() {
				const list = this.chartData
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
			}
		}
	}
</script>

<style>
</style>