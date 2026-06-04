<template>
	<z-paging
		ref="paging" class="tab4Page" :paging-style="{ backgroundColor: '#F7F8FA' }" v-model="dataList" @query="queryList"
		:fixed="true" :auto="false" :refresher-enabled="false" :auto-show-back-to-top="true" :auto-scroll-to-top-when-reload="false"
		:loading-more-enabled="false" :show-refresher-when-reload="false" hide-empty-view
	>
		<view slot="top" style="position: relative; box-sizing: border-box;">
			<image class="home-bg" :src="`${$staticPath}imgs/userBg.png`" />
			<u-navbar title="物联监控" :fixed="false" bgColor="transparent"><view class="u-nav-slot" slot="left"></view></u-navbar>

			<view class="content">
				<view class="stats-row">
					<view class="stat-card temp">
						<view class="stat-icon">🌡</view>
						<view class="stat-info">
							<text class="stat-value">{{ currentTemp }}°C</text>
							<text class="stat-label">当前温度</text>
						</view>
						<view :class="['stat-status', tempStatus]">{{ tempStatusText }}</view>
					</view>
					<view class="stat-card humidity">
						<view class="stat-icon">💧</view>
						<view class="stat-info">
							<text class="stat-value">{{ currentHumidity }}%</text>
							<text class="stat-label">当前湿度</text>
						</view>
						<view :class="['stat-status', humidityStatus]">{{ humidityStatusText }}</view>
					</view>
				</view>

				<view class="chart-section">
					<view class="section-header">
						<text class="section-title">温湿度趋势</text>
						<view class="chart-tabs">
							<view :class="['chart-tab', { active: chartPeriod === 'day' }]" @click="chartPeriod = 'day'">今日</view>
							<view :class="['chart-tab', { active: chartPeriod === 'week' }]" @click="chartPeriod = 'week'">本周</view>
							<view :class="['chart-tab', { active: chartPeriod === 'month' }]" @click="chartPeriod = 'month'">本月</view>
						</view>
					</view>
					<view class="chart-placeholder">
						<view class="chart-skeleton">
							<view class="skeleton-line" v-for="i in 7" :key="i" :style="{ height: getRandomHeight(i) + 'rpx' }"></view>
						</view>
						<text class="chart-text">温湿度趋势图表</text>
					</view>
				</view>

				<view class="section">
					<view class="section-header">
						<text class="section-title">设备状态</text>
						<view class="section-more" @click="viewMoreDevices">查看全部</view>
					</view>
					<view class="device-list">
						<view v-for="device in deviceList" :key="device.id" :class="['device-card', device.status]">
							<view class="device-icon">{{ device.icon }}</view>
							<view class="device-info">
								<text class="device-name">{{ device.name }}</text>
								<text class="device-location">{{ device.location }}</text>
							</view>
							<view :class="['device-status', device.status]">
								<view class="status-dot"></view>
								{{ device.statusText }}
							</view>
						</view>
					</view>
				</view>

				<view class="section">
					<view class="section-header">
						<text class="section-title">报警记录</text>
						<view class="alarm-count" v-if="alarmCount > 0">{{ alarmCount }}</view>
					</view>
					<view class="alarm-list">
						<view v-for="alarm in alarmList" :key="alarm.id" :class="['alarm-item', alarm.level]">
							<view class="alarm-icon">{{ getAlarmIcon(alarm.level) }}</view>
							<view class="alarm-content">
								<text class="alarm-title">{{ alarm.title }}</text>
								<text class="alarm-time">{{ alarm.time }}</text>
							</view>
							<view class="alarm-action" @click="handleAlarm(alarm)">处理</view>
						</view>
					</view>
				</view>
			</view>
		</view>
	</z-paging>
</template>

<script>
export default {
	data() {
		return {
			dataList: [],
			currentTemp: 24.5,
			currentHumidity: 62,
			tempStatus: 'normal',
			humidityStatus: 'normal',
			chartPeriod: 'day',
			alarmCount: 2,
			randomHeights: [60, 80, 55, 90, 70, 85, 65],
			deviceList: [
				{ id: 1, name: '培养箱A1', icon: '🧪', location: '实验室B区-102', status: 'running', statusText: '运行中' },
				{ id: 2, name: '超低温冰箱', icon: '❄', location: '实验室C区-201', status: 'running', statusText: '运行中' },
				{ id: 3, name: '离心机X2', icon: '⚙', location: '实验室A区-305', status: 'warning', statusText: '需维护' },
				{ id: 4, name: '灭菌锅', icon: '🔥', location: '实验室D区-101', status: 'offline', statusText: '离线' }
			],
			alarmList: [
				{ id: 1, title: '培养箱A1温度异常', time: '10分钟前', level: 'high' },
				{ id: 2, title: '离心机X2维护提醒', time: '30分钟前', level: 'medium' },
				{ id: 3, title: '超低温冰箱电量预警', time: '1小时前', level: 'low' }
			]
		};
	},
	computed: {
		tempStatusText() {
			if (this.tempStatus === 'normal') return '正常';
			if (this.tempStatus === 'warning') return '偏高';
			return '异常';
		},
		humidityStatusText() {
			if (this.humidityStatus === 'normal') return '正常';
			return '偏高';
		}
	},
	methods: {
		queryList(pageNo, pageSize) {
			this.$refs.paging.endRefresh();
		},
		getRandomHeight(index) {
			return this.randomHeights[index - 1] || 60;
		},
		getAlarmIcon(level) {
			if (level === 'high') return '🚨';
			if (level === 'medium') return '⚠';
			return 'ℹ';
		},
		viewMoreDevices() {
			uni.showToast({ title: '查看全部设备', icon: 'none' });
		},
		handleAlarm(alarm) {
			uni.showToast({ title: `处理报警: ${alarm.title}`, icon: 'none' });
		}
	}
};
</script>

<style lang="scss" scoped>
.tab4Page {
	position: relative;
	min-height: 100vh;
	background-color: #F7F8FA;
	.home-bg {
		position: absolute;
		width: 100%;
		height: auto;
		aspect-ratio: 2.435/1;
		top: 0; left: 0; right: 0;
	}
	.content {
		position: relative;
		background: #fff;
		border-radius: 24rpx 24rpx 0 0;
		margin-top: 20rpx;
		padding: 32rpx;
	}
	.stats-row {
		display: flex;
		gap: 20rpx;
		margin-bottom: 32rpx;
	}
	.stat-card {
		flex: 1;
		display: flex;
		align-items: center;
		padding: 24rpx;
		border-radius: 16rpx;
		position: relative;
	}
	.stat-card.temp { background: linear-gradient(135deg, #FF6B6B, #FFE66D); }
	.stat-card.humidity { background: linear-gradient(135deg, #4ECDC4, #44A08D); }
	.stat-icon {
		font-size: 48rpx;
		margin-right: 16rpx;
	}
	.stat-info {
		flex: 1;
	}
	.stat-value {
		display: block;
		font-size: 36rpx;
		font-weight: bold;
		color: #fff;
	}
	.stat-label {
		font-size: 22rpx;
		color: rgba(255,255,255,0.8);
	}
	.stat-status {
		font-size: 22rpx;
		padding: 4rpx 12rpx;
		border-radius: 16rpx;
		background: rgba(255,255,255,0.3);
		color: #fff;
	}
	.chart-section {
		background: #F7F8FA;
		border-radius: 16rpx;
		padding: 24rpx;
		margin-bottom: 32rpx;
	}
	.section-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 24rpx;
	}
	.section-title {
		font-size: 30rpx;
		font-weight: bold;
		color: #333;
	}
	.chart-tabs {
		display: flex;
		gap: 8rpx;
	}
	.chart-tab {
		font-size: 24rpx;
		padding: 8rpx 16rpx;
		border-radius: 20rpx;
		color: #999;
		background: #fff;
	}
	.chart-tab.active {
		background: #3B7EFFFF;
		color: #fff;
	}
	.chart-placeholder {
		height: 280rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		background: #fff;
		border-radius: 12rpx;
	}
	.chart-skeleton {
		display: flex;
		align-items: flex-end;
		height: 160rpx;
		gap: 24rpx;
		margin-bottom: 16rpx;
	}
	.skeleton-line {
		width: 32rpx;
		background: linear-gradient(90deg, #E8F4FD, #3B7EFFFF);
		border-radius: 16rpx;
	}
	.chart-text {
		font-size: 24rpx;
		color: #999;
	}
	.section {
		margin-bottom: 32rpx;
	}
	.section-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 20rpx;
	}
	.section-title {
		font-size: 30rpx;
		font-weight: bold;
		color: #333;
	}
	.section-more {
		font-size: 24rpx;
		color: #3B7EFFFF;
	}
	.alarm-count {
		background: #FF4D4F;
		color: #fff;
		font-size: 22rpx;
		padding: 4rpx 14rpx;
		border-radius: 20rpx;
	}
	.device-list {
	}
	.device-card {
		display: flex;
		align-items: center;
		padding: 20rpx;
		border-radius: 12rpx;
		margin-bottom: 12rpx;
	}
	.device-card.running { background: #F6FFED; }
	.device-card.warning { background: #FFF7E6; }
	.device-card.offline { background: #F5F5F5; }
	.device-icon {
		font-size: 40rpx;
		margin-right: 16rpx;
	}
	.device-info {
		flex: 1;
	}
	.device-name {
		display: block;
		font-size: 28rpx;
		color: #333;
		margin-bottom: 4rpx;
	}
	.device-location {
		font-size: 22rpx;
		color: #999;
	}
	.device-status {
		display: flex;
		align-items: center;
		gap: 8rpx;
		font-size: 24rpx;
	}
	.status-dot {
		width: 12rpx;
		height: 12rpx;
		border-radius: 50%;
	}
	.device-status.running {
		color: #52C41A;
		.status-dot { background: #52C41A; }
	}
	.device-status.warning {
		color: #FA8C16;
		.status-dot { background: #FA8C16; }
	}
	.device-status.offline {
		color: #999;
		.status-dot { background: #999; }
	}
	.alarm-list {
	}
	.alarm-item {
		display: flex;
		align-items: center;
		padding: 20rpx;
		border-radius: 12rpx;
		margin-bottom: 12rpx;
	}
	.alarm-item.high { background: #FFF1F0; border-left: 6rpx solid #FF4D4F; }
	.alarm-item.medium { background: #FFF7E6; border-left: 6rpx solid #FA8C16; }
	.alarm-item.low { background: #F6FFED; border-left: 6rpx solid #52C41A; }
	.alarm-icon {
		font-size: 32rpx;
		margin-right: 16rpx;
	}
	.alarm-content {
		flex: 1;
	}
	.alarm-title {
		display: block;
		font-size: 28rpx;
		color: #333;
		margin-bottom: 4rpx;
	}
	.alarm-time {
		font-size: 22rpx;
		color: #999;
	}
	.alarm-action {
		font-size: 24rpx;
		color: #3B7EFFFF;
		padding: 8rpx 16rpx;
		background: rgba(59,126,255,0.1);
		border-radius: 20rpx;
	}
}
</style>