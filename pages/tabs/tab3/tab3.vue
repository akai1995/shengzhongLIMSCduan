<template>
	<z-paging
		ref="paging" class="tab3Page" :paging-style="{ backgroundColor: '#F7F8FA' }" v-model="dataList" @query="queryList"
		:fixed="true" :auto="false" :refresher-enabled="false" :auto-show-back-to-top="true" :auto-scroll-to-top-when-reload="false"
		:loading-more-enabled="false" :show-refresher-when-reload="false" hide-empty-view
	>
		<view slot="top" style="position: relative; box-sizing: border-box;">
			<image class="home-bg" :src="`${$staticPath}imgs/userBg.png`" />
			<u-navbar title="实验室" :fixed="false" bgColor="transparent"><view class="u-nav-slot" slot="left"></view></u-navbar>

			<view class="content">
				<view class="grid-menu">
					<view v-for="item in menuItems" :key="item.id" class="menu-item" @click="goToModule(item)">
						<view :class="['menu-icon', item.iconClass]">
							<text>{{ item.icon }}</text>
						</view>
						<text class="menu-name">{{ item.name }}</text>
						<view v-if="item.badge" class="menu-badge">{{ item.badge }}</view>
					</view>
				</view>

				<view class="section">
					<view class="section-header">
						<text class="section-title">设备预约</text>
						<view class="section-more" @click="viewMore('equipment')">更多</view>
					</view>
					<view class="calendar-view">
						<view class="calendar-header">
							<view class="calendar-nav" @click="prevWeek">‹</view>
							<text class="calendar-title">{{ weekRange }}</text>
							<view class="calendar-nav" @click="nextWeek">›</view>
						</view>
						<view class="calendar-days">
							<view v-for="day in weekDays" :key="day.date" :class="['day-item', { active: day.isToday, selected: day.selected }]" @click="selectDay(day)">
								<text class="day-name">{{ day.name }}</text>
								<text class="day-date">{{ day.date }}</text>
								<view v-if="day.hasBooking" class="day-dot"></view>
							</view>
						</view>
					</view>
				</view>

				<view class="section">
					<view class="section-header">
						<text class="section-title">库存预警</text>
						<view class="section-more" @click="viewMore('stock')">查看全部</view>
					</view>
					<view class="warning-list">
						<view v-for="item in warningList" :key="item.id" :class="['warning-item', item.type]">
							<view class="warning-icon">{{ item.type === 'low' ? '!' : '⚠' }}</view>
							<view class="warning-content">
								<text class="warning-title">{{ item.name }}</text>
								<text class="warning-desc">{{ item.desc }}</text>
							</view>
							<view class="warning-action" @click="handleWarning(item)">处理</view>
						</view>
					</view>
				</view>

				<view class="section">
					<view class="section-header">
						<text class="section-title">今日维护</text>
						<view class="section-more" @click="viewMore('maintenance')">全部</view>
					</view>
					<view class="maintenance-list">
						<view v-for="item in maintenanceList" :key="item.id" class="maintenance-item">
							<view class="maintenance-info">
								<text class="maintenance-name">{{ item.name }}</text>
								<text class="maintenance-time">{{ item.time }}</text>
							</view>
							<view :class="['maintenance-status', item.status]">{{ item.statusText }}</view>
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
			menuItems: [
				{ id: 1, name: '设备', icon: '⚙', iconClass: 'icon-equipment', badge: '3' },
				{ id: 2, name: '耗材', icon: '📦', iconClass: 'icon-supplies', badge: '' },
				{ id: 3, name: '危化品', icon: '🧪', iconClass: 'icon-chemical', badge: '2' },
				{ id: 4, name: '实验记录', icon: '📝', iconClass: 'icon-record', badge: '' },
				{ id: 5, name: '废弃物', icon: '🗑', iconClass: 'icon-waste', badge: '' },
				{ id: 6, name: '安全准入', icon: '🔒', iconClass: 'icon-safety', badge: '' }
			],
			weekDays: [
				{ name: '周一', date: '15', isToday: false, selected: false, hasBooking: true },
				{ name: '周二', date: '16', isToday: false, selected: false, hasBooking: false },
				{ name: '周三', date: '17', isToday: true, selected: true, hasBooking: true },
				{ name: '周四', date: '18', isToday: false, selected: false, hasBooking: true },
				{ name: '周五', date: '19', isToday: false, selected: false, hasBooking: false },
				{ name: '周六', date: '20', isToday: false, selected: false, hasBooking: false },
				{ name: '周日', date: '21', isToday: false, selected: false, hasBooking: false }
			],
			warningList: [
				{ id: 1, name: '移液器吸头', desc: '库存不足，剩余50个', type: 'low' },
				{ id: 2, name: '乙醇试剂', desc: '即将过期，有效期至2024-02-01', type: 'expire' },
				{ id: 3, name: 'PCR管', desc: '库存不足，剩余100个', type: 'low' }
			],
			maintenanceList: [
				{ id: 1, name: '高效液相色谱仪', time: '09:00', status: 'pending', statusText: '待维护' },
				{ id: 2, name: '离心机', time: '14:00', status: 'pending', statusText: '待维护' },
				{ id: 3, name: '超净工作台', time: '16:00', status: 'completed', statusText: '已完成' }
			]
		};
	},
	computed: {
		weekRange() {
			return '1月15日 - 1月21日';
		}
	},
	methods: {
		queryList(pageNo, pageSize) {
			this.$refs.paging.endRefresh();
		},
		goToModule(item) {
			uni.showToast({ title: `进入${item.name}模块`, icon: 'none' });
		},
		prevWeek() {
			uni.showToast({ title: '上一周', icon: 'none' });
		},
		nextWeek() {
			uni.showToast({ title: '下一周', icon: 'none' });
		},
		selectDay(day) {
			uni.showToast({ title: `选择${day.name} ${day.date}日`, icon: 'none' });
		},
		viewMore(type) {
			uni.showToast({ title: `查看更多${type}`, icon: 'none' });
		},
		handleWarning(item) {
			uni.showToast({ title: `处理${item.name}`, icon: 'none' });
		}
	}
};
</script>

<style lang="scss" scoped>
.tab3Page {
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
	.grid-menu {
		display: flex;
		flex-wrap: wrap;
		gap: 24rpx;
		margin-bottom: 32rpx;
	}
	.menu-item {
		flex: 0 0 calc(33.33% - 16rpx);
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 24rpx 0;
		background: #F7F8FA;
		border-radius: 16rpx;
		position: relative;
	}
	.menu-icon {
		width: 88rpx;
		height: 88rpx;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 40rpx;
		margin-bottom: 12rpx;
	}
	.menu-icon.icon-equipment { background: linear-gradient(135deg, #667EEA, #764BA2); }
	.menu-icon.icon-supplies { background: linear-gradient(135deg, #F093FB, #F5576C); }
	.menu-icon.icon-chemical { background: linear-gradient(135deg, #4FACFE, #00F2FE); }
	.menu-icon.icon-record { background: linear-gradient(135deg, #43E97B, #38F9D7); }
	.menu-icon.icon-waste { background: linear-gradient(135deg, #FA709A, #FEE140); }
	.menu-icon.icon-safety { background: linear-gradient(135deg, #A8EDEA, #FED6E3); }
	.menu-name {
		font-size: 26rpx;
		color: #333;
	}
	.menu-badge {
		position: absolute;
		top: 8rpx;
		right: 16rpx;
		background: #FF4D4F;
		color: #fff;
		font-size: 20rpx;
		padding: 2rpx 10rpx;
		border-radius: 20rpx;
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
		font-size: 32rpx;
		font-weight: bold;
		color: #333;
	}
	.section-more {
		font-size: 26rpx;
		color: #3B7EFFFF;
	}
	.calendar-view {
		background: #F7F8FA;
		border-radius: 16rpx;
		padding: 24rpx;
	}
	.calendar-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 24rpx;
	}
	.calendar-nav {
		width: 56rpx;
		height: 56rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		background: #fff;
		border-radius: 50%;
		font-size: 32rpx;
		color: #666;
	}
	.calendar-title {
		font-size: 28rpx;
		font-weight: 500;
		color: #333;
	}
	.calendar-days {
		display: flex;
		justify-content: space-between;
	}
	.day-item {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 16rpx 8rpx;
		border-radius: 12rpx;
		position: relative;
	}
	.day-item.active .day-date {
		color: #3B7EFFFF;
		font-weight: bold;
	}
	.day-item.selected {
		background: #E6F7FF;
	}
	.day-name {
		font-size: 22rpx;
		color: #999;
		margin-bottom: 8rpx;
	}
	.day-date {
		font-size: 28rpx;
		color: #333;
	}
	.day-dot {
		position: absolute;
		bottom: 8rpx;
		width: 8rpx;
		height: 8rpx;
		background: #FF4D4F;
		border-radius: 50%;
	}
	.warning-list {
	}
	.warning-item {
		display: flex;
		align-items: center;
		padding: 20rpx;
		border-radius: 12rpx;
		margin-bottom: 12rpx;
	}
	.warning-item.low { background: #FFF7E6; }
	.warning-item.expire { background: #FFF1F0; }
	.warning-icon {
		width: 48rpx;
		height: 48rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 28rpx;
		margin-right: 16rpx;
	}
	.warning-content {
		flex: 1;
	}
	.warning-title {
		display: block;
		font-size: 28rpx;
		color: #333;
		margin-bottom: 4rpx;
	}
	.warning-desc {
		font-size: 24rpx;
		color: #999;
	}
	.warning-action {
		font-size: 24rpx;
		color: #3B7EFFFF;
		padding: 8rpx 16rpx;
		background: rgba(59,126,255,0.1);
		border-radius: 20rpx;
	}
	.maintenance-list {
	}
	.maintenance-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 20rpx 0;
		border-bottom: 1rpx solid #F0F0F0;
	}
	.maintenance-item:last-child { border-bottom: none; }
	.maintenance-info {
	}
	.maintenance-name {
		display: block;
		font-size: 28rpx;
		color: #333;
		margin-bottom: 4rpx;
	}
	.maintenance-time {
		font-size: 24rpx;
		color: #999;
	}
	.maintenance-status {
		font-size: 24rpx;
		padding: 6rpx 16rpx;
		border-radius: 20rpx;
	}
	.maintenance-status.pending { background: #FFF7E6; color: #FA8C16; }
	.maintenance-status.completed { background: #F6FFED; color: #52C41A; }
}
</style>