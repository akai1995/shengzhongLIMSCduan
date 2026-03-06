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
					这是设备名称（这是正常温度样式）
				</view>
				<view class="item-sn">
					设备SN：800640220648
				</view>
				<view class="item-sn">
					预警范围：0.0-35.0℃
				</view>
			</view>
            <view class="temperatureLogWrap">
				<view class="temperatureHead">
					温度记录
					<view class="btnBox">曲线图显示</view>
				</view>
         <u-scroll-list :indicator="false">
          <view class="infoBox" :style="`width:${dataList.length>5?dataList.length*60:480}rpx;`">
            <view class="echartArea">
              <echarts ref="echartsRef" :option="echartsOptions" canvasId="monthIncome" />
            </view>
          </view>
        </u-scroll-list>
				<u-skeleton v-if="!firstLoaded&&dataList.length==0" rows="8" title loading />
				<view class="temperatureLogBox">
					<view class="temperatureLogItem" v-for="item,idx in dataList" :class="['', 'blue', 'red'][Math.floor(Math.random() * 3)]">
						2026-01-01 10:00:00
						<view class="temperature">22.0℃</view>
					</view>
				</view>
            </view>
        </view>
    </z-paging>
</template>

<script>
import {  } from '@/app/api/index'
export default {
    data() {
		// 模拟大量数据（50个类目）
		const xAxisData = [];
		const seriesData = [];
		for (let i = 0; i < 50; i++) {
			xAxisData.push(`类目${i + 1}`);
			seriesData.push([12.5, 16.5, 18.5,21.5, 33.5, 23.5,21.5, 22.5, 36.5][Math.floor(Math.random() * 9)]);
		}
		return {
            queryParams: { pageNo: 1, pageSize: 10 }, dataList:[], totalCount:0,
			firstLoaded: false, temperatureId: null, info: null,
			echartsOptions: {
				grid: {
					x: 50,
					y: 10,
					x2: 20,
					y2: 30
				},
				tooltip: {
					trigger: 'item'
				},
				xAxis: {
					type: 'category',
					data: xAxisData,
					axisLabel: {
						formatter: '{value}',
						// interval: 0, rotate: 45, fontSize: 12
					},
					// 关键1：控制类目轴刻度间距（影响横向占位）
					axisTick: {
						interval: 0, // 每个类目都显示刻度（基础）
						length: 5 // 刻度线长度，不影响占位但影响视觉
					},
					// 关键2：控制X轴两边留白（影响整体横向紧凑度）
					boundaryGap: [0.05, 0.05], // [左留白, 右留白]，0则无留白（更紧凑）
					// 关键3：强制设置X轴刻度间隔（控制横向密度）
					// interval: 0 // 0表示显示所有刻度，数值越大间隔越宽
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
    // onLoad(options) { this.temperatureId = optmions.id||''; this.getDetail() },
	mounted() {
		this.$nextTick(() => {
			this.getDetail();
		})
	},
    methods: {
        handleGoBack() { this.$eUni.navBack() },
		getDetail() {
			setTimeout(() => {
				// temperatureDetail(this.temperatureId).then((resp) => {
				//     if (resp.code == 200) { this.info = resp.data;
				//         if (resp.data.deviceReserveStatus == 7) { this.getReject() }
				//         if (this.onCheckStatus() && this.checkTime()) { this.cancelReserve.button = true }
				//     }
				// });
				
          this.totalCount = 8
          const rows = Array.from({length: 17}, (_, i) => {
            // const date = new Date((new Date()).getTime() + (i * 24 * 60 * 60 * 1000))
            const date = new Date((new Date()).getTime() + ((i+2) * 60 * 1000))
            return {
              id: i+1, temperature: [12.5, 16.5, 18.5,21.5, 33.5, 23.5,21.5, 22.5, 36.5][Math.floor(Math.random() * 9)], 
              date: `${date.getFullYear() + ''}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
            }
          })
          this.$refs.paging.complete(rows)
          this.echartsOptions.xAxis.data = rows.map(r=>r.date);
          this.echartsOptions.series.data = rows.map(r=>r.temperature);
          setTimeout(() => {
            this.$refs.echartsRef.initChart(this.echartsOptions);
          }, 450);
          this.firstLoaded = true;
      }, 500);
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
			margin-bottom: 24rpx;
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
			margin-bottom: 32rpx;
			height: 56rpx;
			line-height: 56rpx;
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
			overflow: hidden;
			padding: 0;
			.echartArea {
				background: #fff;
				border-radius: 10rpx;
				overflow: hidden;
				height: 480rpx;
			}
		}
	}
}
</style>