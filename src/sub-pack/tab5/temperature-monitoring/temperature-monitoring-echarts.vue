<template>
	<z-paging
		ref="paging" class="temperature" :paging-style="{ backgroundColor: 'white' }"
		v-model="dataList" @query="queryList":fixed="true" :auto="false" :auto-show-back-to-top="true" :enable-back-to-top="true" :show-refresher-when-reload="true"
        :safe-area-inset-bottom="true" empty-view-text="暂无数据" :loading-more-no-more-text="`已加载完，共${totalCount}条记录`" :auto-scroll-to-top-when-reload="false"
		:loading-more-enabled="false" hide-empty-view
	>
        <view slot="top">
		<u-navbar title="温度监控" :fixed="false" background="transparent" :leftIcon="$leftIcon" @leftClick="onBack" />
		</view>
		<ut-components ref="utComponents" />
		<view class="echartsBox">
			<!-- <u-scroll-list :indicator="false"> -->
				<!-- :style="echartsStyle" -->
				<view class="infoBox" >
					<view class="echartArea">
						<e-chart ref="eChartsRef" :option="echartsOptions" width="100%" :canvasId="'e-chartsSnId'" />
					</view>
				</view>
			<!-- </u-scroll-list> -->
		</view>
    </z-paging>
</template>

<script>
import { getRealTimeCurve } from '@/app/api/index'
export default {
    data() {
		// 模拟大量数据（50个类目）
		const xAxisData = [];
		const seriesData = [];
		for (let i = 0; i < 1; i++) {
			xAxisData.push(`2026-03-11 00:${i + 1}:00`);
			seriesData.push([12.5, 16.5, 18.5,21.5, 33.5, 23.5,21.5, 22.5, 36.5][Math.floor(Math.random() * 9)]);
		}
		// 统一线条样式（X/Y轴共用）
		const axisCommonStyle = {
			lineStyle: {
				color: '#ccc', // 轴线/刻度线颜色
				width: 1       // 线条宽度
			}
		};
		return {
            queryParams: { pageNo: 1, pageSize: 10 }, dataList:[], totalCount:0,
			firstLoaded: false, showType: 'list', sn: '',
			info: {
				id: '',
				deviceName: '',
				sn: '',
				currentTemperature: '',
				temperatureHigh: '',
				temperatureLow: '',
				tenantIds: '',
				timeCode: '',
				type: '',
				// '1':高温预警，'2':低温预警，null：正常
				warning: '',
			},
			echartsOptions: {
				grid: { 
					left: '2%',   // 左边距百分比，自适应
					right: '16%',
					top: '10%',
					bottom: '25%', // 底部多留空间给X轴标签
					containLabel: true // 自动包含标签，避免标签被截断
				},
				tooltip: {
					trigger: 'item',
					// trigger: 'axis', 
					// position: (pt) => ([pt[0], '50%']) 
					formatter: function(params) {
						const time = params[0].name;
						const temp = params[0].value;
						return `
						<div style="text-align: left;">
							<p>时间：${time}</p>
							<p>温度：${temp}℃</p> <!-- 这里添加 ℃ -->
						</div>
						`;
					},
				},
				// dataZoom: [ { type: 'inside', start: 0, end: 20	}, { start: 0, end: 20	} ],
				xAxis: {
					type: 'category', data: xAxisData,
					axisLabel: {
						formatter: (value) => {
							const timeParts = value.split(':');
							const prefix = `${timeParts[0]}:`;
							const minute = timeParts[1];
							const suffix = `:${timeParts[2]}`;
							return `{prefixStyle|${prefix}}{minuteStyle|${minute}}{suffixStyle|${suffix}}`;
						},
						interval: 0,
						rotate: 288, 
						fontSize: 10,
						rich: {
							prefixStyle: { color: '#333', fontSize: 10 },
							minuteStyle: { color: '#ff4400', fontSize: 11, fontWeight: 'bold' },
							suffixStyle: { color: '#333', fontSize: 10 }
						}
					},
					// 🌟 X轴刻度线强化配置（核心）
					axisTick: {
						...axisCommonStyle, // 继承统一样式
						show: true,         // 强制显示刻度线
						interval: 0,        // 每个类目都显示刻度（关键）
						length: 4,          // 刻度线长度（加长，更明显）
						alignWithLabel: true // 刻度线和标签对齐（避免偏移）
					},
					// X轴轴线
					axisLine: axisCommonStyle,
					boundaryGap: [0.05, 0.05],
					interval: 0
				},
				yAxis: {
					type: 'value',
					axisLabel: { 
						formatter: '{value}℃',
						margin: 10 // 标签和轴线的距离
					},
					splitLine: {
						show: true,
						lineStyle: { color: '#F1F1F1' }
					},
					// Y轴刻度线
					axisTick: {
						...axisCommonStyle,
						show: true,
						interval: 0,
						length: 4 // 和X轴刻度线长度一致
					},
					// Y轴轴线
					axisLine: axisCommonStyle
				},
				series: {
					data: seriesData, type: 'line', showBackground: false,
					backgroundStyle: { color: '#3b7eff' },
					
					// 🌟 核心纯配置：开启选中模式
					selectedMode: 'single', // 单选模式（multiple为多选）

					// 🌟 选中状态样式（纯配置）
					select: {
						itemStyle: {
							color: '#ffffff',       // 选中填充色
							borderColor: '#ff0000', // 选中边框色
							borderWidth: 3,         // 选中边框宽度
							shadowBlur: 10, shadowColor: 'rgba(255,0,0,0.5)'
						}
					},

					// 默认状态样式
					itemStyle: { color: '#3b7eff', borderColor: '#3b7eff', borderWidth: 1 },

					// 禁用悬浮高亮，只保留选中高亮
					emphasis: { disabled: true }
				}
			}
		}
	},
    onLoad(options) {
		const _self = this
		for (const key in options) {
			if (options.hasOwnProperty(key) && _self.info.hasOwnProperty(key)) {
				_self.info[key] = options[key];
				if (key=='currentTemperature') _self.info['currentTemperature'] = Number(_self.info.currentTemperature)
				if (key=='temperatureHigh') _self.info['temperatureHigh'] = Number(_self.info.temperatureHigh)
				if (key=='temperatureLow') _self.info['temperatureLow'] = Number(_self.info.temperatureLow)
			}
		}
		
		_self.$nextTick(() => {
			_self.sn = options.sn||'';
			setTimeout(async () => {
				if (options.sn) { _self.getDetail(options.sn) }
			}, 1050) 
		})
	},
    computed: {
        warnTip() {
            // 随机输出class，实际使用时根据温度值判断
            const { temperatureLow, temperatureHigh } = this.info
			if (['string', 'number'].includes(typeof temperatureLow))
			{
				return `${temperatureLow}~${temperatureHigh}℃`
			}
			return `${temperatureHigh}℃`
        },
        echartsStyle() {
			return `width:${this.dataList.length>5?(this.dataList.length*60):480}rpx;`
        }
    },
	mounted() {
		const _self = this
		setTimeout(async () => { 
			_self.$refs.eChartsRef.init(_self.echartsOptions);
		}, 250) 
	},
    methods: {
		onInitChart() {
			const _self = this
			if (_self.$refs.eChartsRef) _self.$refs.eChartsRef.init(_self.echartsOptions);
			setTimeout(() => { 
				_self.$nextTick(async () => {
					if (_self.dataList&&_self.dataList.length > 0) {
						const items = _self.dataList.length>16?_self.dataList.slice(0, 16):_self.dataList
						_self.echartsOptions.xAxis.data = items.map(r=>r.date);
						_self.echartsOptions.series.data = items.map(r=>r.temperature);
					}
					console.log('_self.$refs:::', await _self.$refs.eChartsRef)
					_self.$refs.eChartsRef.setOption(_self.echartsOptions);
				})
			}, 1060);
		},
		getDetail() {
			const _self = this
			uni.showLoading({ title: '加载中...', mask: true })
			getRealTimeCurve(_self.sn).then((resp) => {
				if (resp.data) {
					const { dateList, temperatureList } = resp.data;
					const rows = dateList.map((date, idx) => ({ date, temperature: temperatureList[idx] }))
					console.log('getRealTimeCurve.length:::', rows.length)
					if (rows.length > 0) { _self.onInitChart() }
					_self.$refs.paging.complete(rows)
				}
			}).catch(()=>{}).finally(()=>{
				setTimeout(()=>{ _self.firstLoaded = true; }, 1750)
				uni.hideLoading();
			})
		},
		queryList(pageNo, pageSize) {
			this.$refs.paging.endRefresh();
			this.getDetail() 
			uni.hideLoading();
		}
    }
}
</script>
<style lang="scss" scoped>

.echartsBox {
	padding: 42rpx 10rpx;
	background: #fff;
		
	.infoBox {
		background: #fff;
		border-radius: 10rpx;
		// overflow: hidden;
		padding: 0;
		.echartArea {
			background: #fff;
			border-radius: 10rpx;
			// overflow: hidden;
			height: 720rpx;
		}
	}
}
</style>