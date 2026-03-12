import { getRealTimeCurve } from '@/app/api/index'
export default {
	filters: { toFixdNum (value, num) { if (+value) { return +(+value.toFixed(num)) } return 0; } },
    data() {
		// 模拟大量数据（50个类目）
		const xAxisData = [];
		const seriesData = [];
		for (let i = 0; i < 7; i++) {
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
				id: '', deviceName: '', sn: '', currentTemperature: '',
				temperatureHigh: '', temperatureLow: '',
				tenantIds: '', timeCode: '', type: '',
				// '1':高温预警，'2':低温预警，null：正常
				warning: '', detailType: '1',
			},
			echartsOptions: {
				grid: { x: 50, y: 10, x2: 20, y2: 30 },
				// tooltip: { trigger: 'axis', position: (pt) => ([pt[0], '30%']) },
				// dataZoom: [ { type: 'inside', start: 0, end: 20	}, { start: 0, end: 20	} ],
				// xAxis: {
				// 	type: 'category', data: xAxisData,
				// 	axisLabel: {
				// 		formatter: (value) => {
				// 			const timeParts = value.split(':');
				// 			const prefix = `${timeParts[0]}:`;
				// 			const minute = timeParts[1];
				// 			const suffix = `:${timeParts[2]}`;
				// 			return `{prefixStyle|${prefix}}{minuteStyle|${minute}}{suffixStyle|${suffix}}`;
				// 		},
				// 		interval: 0, rotate: 300, fontSize: 12,
				// 		rich: {
				// 			prefixStyle: { color: '#333', fontSize: 12 },
				// 			minuteStyle: { color: '#ff4400', fontSize: 14, fontWeight: 'bold' },
				// 			suffixStyle: { color: '#333', fontSize: 12 }
				// 		}
				// 	},
				// 	// 🌟 X轴刻度线强化配置（核心）
				// 	axisTick: {
				// 		...axisCommonStyle, // 继承统一样式
				// 		show: true,         // 强制显示刻度线
				// 		interval: 0,        // 每个类目都显示刻度（关键）
				// 		length: 8,          // 刻度线长度（加长，更明显）
				// 		alignWithLabel: true // 刻度线和标签对齐（避免偏移）
				// 	},
				// 	// X轴轴线
				// 	axisLine: axisCommonStyle,
				// 	boundaryGap: [0.05, 0.10],
				// 	interval: 0
				// },
				// yAxis: {
				// 	type: 'value',
				// 	axisLabel: { 
				// 		formatter: '{value}℃',
				// 		margin: 10 // 标签和轴线的距离
				// 	},
				// 	splitLine: {
				// 		show: true,
				// 		lineStyle: { color: '#F1F1F1' }
				// 	},
				// 	// Y轴刻度线
				// 	axisTick: {
				// 		...axisCommonStyle,
				// 		show: true,
				// 		interval: 0,
				// 		length: 8 // 和X轴刻度线长度一致
				// 	},
				// 	// Y轴轴线
				// 	axisLine: axisCommonStyle
				// },
				// series: {
				// 	data: seriesData, type: 'line', showBackground: false,
				// 	backgroundStyle: { color: '#3b7eff' },
					
				// 	// 🌟 核心纯配置：开启选中模式
				// 	selectedMode: 'single', // 单选模式（multiple为多选）

				// 	// 🌟 选中状态样式（纯配置）
				// 	select: {
				// 		itemStyle: {
				// 		color: '#ffffff',       // 选中填充色
				// 		borderColor: '#ff0000', // 选中边框色
				// 		borderWidth: 3,         // 选中边框宽度
				// 		shadowBlur: 10, shadowColor: 'rgba(255,0,0,0.5)'
				// 		}
				// 	},

				// 	// 默认状态样式
				// 	itemStyle: { color: '#3b7eff', borderColor: '#3b7eff', borderWidth: 1 },

				// 	// 禁用悬浮高亮，只保留选中高亮
				// 	// emphasis: { disabled: true }
				// }
				tooltip: { trigger: 'item' },
				xAxis: {
					type: 'category',
					data: xAxisData,
					axisLabel: {
						formatter: '{value}',
						// interval: 0, rotate: 45, fontSize: 12
					},
					// // 关键1：控制类目轴刻度间距（影响横向占位）
					// axisTick: {
					// 	interval: 0, // 每个类目都显示刻度（基础）
					// 	length: 5 // 刻度线长度，不影响占位但影响视觉
					// },
					// // 关键2：控制X轴两边留白（影响整体横向紧凑度）
					// boundaryGap: [0.05, 0.05], // [左留白, 右留白]，0则无留白（更紧凑）
					// // 关键3：强制设置X轴刻度间隔（控制横向密度）
					// // interval: 0 // 0表示显示所有刻度，数值越大间隔越宽
				},
				yAxis: {
					type: 'value',
					axisLabel: {
						formatter: '{value}℃'
					},
					splitLine: {
						show: true,
						lineStyle: {
							color: '#F1F1F1'
						}
					}
				},
				color: '#EE7B4E',
				series: {
					data: seriesData,
					type: 'line',
					showBackground: true,
					backgroundStyle: {
						color: '#0D70F3'
					}
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
				if (_self.$refs.eChartsRef) {
					_self.$refs.eChartsRef.init(_self.echartsOptions);
				}
				if (options.sn) { _self.getDetail(options.sn) }
			}, 1250) 
		})
	},
	methods: {
		checkRed(temp) { return temp > this.info.temperatureHigh },
		checkBlue(temp) { return temp < this.info.temperatureLow },
		onInitChart(rows) {
			const _self = this
			if (_self.$refs.eChartsRef) {
				setTimeout(() => {
					console.log('_self.$refs.eChartsRef:::', _self.echartsOptions, _self.$refs.eChartsRef)
					_self.$refs.eChartsRef.init(_self.echartsOptions);
					setTimeout(() => {
						_self.$nextTick(async () => {
							if (rows.length > 0) {
								const items = rows.slice(0, 30)
								_self.echartsOptions.xAxis.data = items.map(r=>r.date);
								_self.echartsOptions.series.data = items.map(r=>r.temperature);
							}
							console.log('_self.$refs:::', await _self.$refs.eChartsRef)
							_self.$refs.eChartsRef.setOption(_self.echartsOptions);
						})
					}, 1560);
				}, 1060);
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
	},
}