<template>
	<z-paging
		ref="paging" class="temperature" :paging-style="{ backgroundColor: '#F7F8FA' }"
		v-model="dataList" @query="queryList":fixed="true" :auto="false" :auto-show-back-to-top="true" :enable-back-to-top="true" :show-refresher-when-reload="true"
        :safe-area-inset-bottom="true" empty-view-text="暂无数据" :loading-more-no-more-text="`已加载完，共${totalCount}条记录`" :auto-scroll-to-top-when-reload="false"
		:loading-more-enabled="false" hide-empty-view
	>
        <view slot="top">
			<u-navbar title="温度监控详情" :fixed="false" background="transparent" :leftIcon="$leftIcon" @leftClick="onBack" />
		</view>
		<ut-components ref="utComponents" />
        <view class="temperatureDetail">
			<view class="temperature-monitoring-item">
				<view class="item-name">
					{{info.deviceName||'-'}}
				</view>
				<view class="item-sn">
					<text>设备SN：</text>{{info.sn||'-'}}
				</view>
				<view class="item-sn">
					<text>预警范围：</text>{{ warnTip }}
				</view>
			</view>
            <view class="temperatureLogWrap">
				<view class="temperatureHead">
					温度记录
					<view class="btnBox" @click="onToggle()">
						{{ showType=='list'?'列表':'曲线图' }}显示
						<u-icon style="margin-left: 12rpx;" :name="`${$staticPath}imgs/icon-toggle.png`" size="24rpx" />
					</view>
				</view>
				<u-skeleton v-if="!firstLoaded&&dataList.length==0" rows="8" title loading />
				<view class="temperatureLogBox" v-show="showType=='list'">
					<view
						class="temperatureLogItem"
						v-for="item,idx in dataList" :key="idx"
						:class="{
							'blue': checkBlue(item.temperature),
							'red': checkRed(item.temperature)
						}"
					>
						{{item.date}}
						<view class="temperature">{{item.temperature}}℃</view>
					</view>
				</view>
				<view class="infoBox" v-show="showType == 'echarts'" @click.stop="onEchartsClick()">
					<view class="echartArea">
						<e-chart ref="eChartsRef" :option="echartsOptions" width="100%" :canvasId="'e-chartsSnId'" />
					</view>
				</view>
            </view>
        </view>
    </z-paging>
</template>

<script>
import { getRealTimeCurve } from '@/app/api/index'
function objToStr(obj) {
  let str = "";
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      str += `${key}=${obj[key]}&`;
    }
  }
  // 去掉最后一个 &
  return str.slice(0, -1);
}
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
	mounted() {
		const _self = this
		setTimeout(async () => { 
			_self.$refs.eChartsRef.init(_self.echartsOptions);
		}, 250) 
	},
    methods: {
		checkRed(temp) { return temp > this.info.temperatureHigh },
		checkBlue(temp) { return temp < this.info.temperatureLow },
		onEchartsClick() {
			const itemStr = objToStr({...this.info,detailType:'2'})
			console.log('onEchartsClick', itemStr)
            if (!this.checkUserInfo()){ return }
            this.$ut.jump(`/sub-pack/tab5/temperature-monitoring/temperature-monitoring-echarts?${itemStr}`); 
		},
		onInitChart(rows) {
			const _self = this
			setTimeout(() => {
				console.log('onInitChart', rows)
				if (_self.$refs.eChartsRef) {
					console.log('_self.$refs.eChartsRef:::', _self.echartsOptions, _self.$refs.eChartsRef)
					_self.$refs.eChartsRef.init(_self.echartsOptions);
					setTimeout(async () => {
						if (rows&&rows.length > 0) {
							const items = rows.length>16?rows.slice(0, 16):rows
							_self.echartsOptions.xAxis.data = items.map(r=>r.date);
							_self.echartsOptions.series.data = items.map(r=>r.temperature);
						}
						console.log('_self.$refs:::', await _self.$refs.eChartsRef)
						_self.$refs.eChartsRef.setOption(_self.echartsOptions);
					}, 1560);
				}
			}, 1060);
		},
		onToggle() {
			const _self = this
			_self.showType = _self.showType=='list'?'echarts':'list'
			if (_self.showType=='echarts'){
				_self.onInitChart(this.dataList)
			}
		},
		getDetail() {
			const _self = this
			uni.showLoading({ title: '加载中...', mask: true })
			getRealTimeCurve(_self.sn).then((resp) => {
				if (resp.data) {
					const { dateList, temperatureList } = resp.data;
					const rows = dateList.map((date, idx) => ({ date, temperature: temperatureList[idx] }))
					console.log('_self.info boo::',_self.info,_self.detailType==2&&rows.length > 0)
					if (_self.detailType==2&&rows.length > 0) { _self.onInitChart(rows) }
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

.temperatureDetail {
	padding: 32rpx;
	.temperature-monitoring-item {
		background-color: white;
		width: 100%;
		padding: 32rpx;
		border-radius: 12rpx;
		position: relative;
		overflow: hidden;
		margin-bottom: 32rpx;
		.item-name {
			font-size: 32rpx;
			color: #222222;
			line-height: 50rpx;
			font-size: bold;
			margin-bottom: 8rpx;
		}
		.item-sn {
			font-size: 28rpx;
			color: #4B4B4E;
			line-height: 40rpx;
			margin-bottom: 10rpx;
			&:last-child{
				margin-bottom: 24rpx;
			}
			text{
				font-size: bold;
			}
		}
	}
	.temperatureLogWrap{
		background-color: white;
		border-radius: 12rpx;
		padding: 38rpx 32rpx;
		min-height: 50vh;
		.temperatureHead{
			padding: 8rpx 232rpx 8rpx 8rpx;
			position: relative;
			margin-bottom: 24rpx;
			height: 60rpx;
			line-height: 60rpx;
			font-size: 32rpx;
			color: #222;
			.btnBox {
				position: absolute;
				top: 50%;
				right: 0;
				transform: translateY(-50%);
				display: inline-flex;
				padding: 0 24rpx;
				font-size: 24rpx;
				border-radius: 56rpx;
				height: 56rpx;
				line-height: 56rpx;
				border: 1rpx solid #E6E9F1;
			}
		}
		.temperatureLogBox{
			.temperatureLogItem{
				background-color: #F0F2F7;
				border-radius: 12rpx;
				font-size: 28rpx;
				color: #222222;
				line-height: 40rpx;
				position: relative;
				padding: 16rpx 24rpx;
				margin-bottom: 24rpx;
				&:last-child{
					margin-bottom: 0;
				}
				&.blue{
					.temperature{
						color: #0D70F3;
					}
				}
				&.red{
					.temperature{
						color: #E72929;
					}
				}
				.temperature{
					position: absolute;
					right: 20rpx;
					top: 50%;
					transform: translateY(-50%);
					font-weight: bold;
				}
			}
		}
		
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
}
</style>