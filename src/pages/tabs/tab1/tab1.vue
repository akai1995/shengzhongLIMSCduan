<template>
	<z-paging
		ref="paging" class="tab1Page" :paging-style="{ backgroundColor: '#F7F8FA' }" v-model="dataList" @query="queryList"
		:fixed="true" :auto="false" :refresher-enabled="false" :auto-show-back-to-top="true" :auto-scroll-to-top-when-reload="false"
		:loading-more-enabled="false" :show-refresher-when-reload="false" hide-empty-view
	>
		<view slot="top" style="position: relative; box-sizing: border-box;">
			<image class="home-bg" :src="`${$staticPath}imgs/userBg.png`" />
			<u-navbar title="工作台" :fixed="false" bgColor="transparent"><view class="u-nav-slot" slot="left"></view></u-navbar>

			<view class="content">
				<view class="todo-cards">
					<view class="todo-card" @click="goToTodoList">
						<view class="todo-icon">📋</view>
						<view class="todo-info">
							<text class="todo-count">{{ todoStats.approval }}</text>
							<text class="todo-label">待审批</text>
						</view>
						<view class="todo-arrow">›</view>
					</view>
					<view class="todo-card" @click="goToWarningList">
						<view class="todo-icon">⚠</view>
						<view class="todo-info">
							<text class="todo-count">{{ todoStats.warning }}</text>
							<text class="todo-label">待处理预警</text>
						</view>
						<view class="todo-arrow">›</view>
					</view>
					<view class="todo-card" @click="goToStudyList">
						<view class="todo-icon">📚</view>
						<view class="todo-info">
							<text class="todo-count">{{ todoStats.study }}</text>
							<text class="todo-label">待学习/考试</text>
						</view>
						<view class="todo-arrow">›</view>
					</view>
				</view>

				<view class="stats-card">
					<view class="stats-header">
						<text class="stats-title">统计概览</text>
					</view>
					<view class="stats-grid">
						<view class="stat-item" v-for="stat in statsList" :key="stat.name">
							<text class="stat-value">{{ stat.value }}</text>
							<text class="stat-label">{{ stat.name }}</text>
						</view>
					</view>
				</view>

				<view class="quick-actions">
					<view class="action-header">
						<text class="action-title">快捷入口</text>
					</view>
					<view class="action-grid">
						<view class="action-item" v-for="action in quickActions" :key="action.name" @click="doAction(action)">
							<view :class="['action-icon', action.iconClass]">{{ action.icon }}</view>
							<text class="action-name">{{ action.name }}</text>
						</view>
					</view>
				</view>

				<view class="news-section">
					<view class="news-header">
						<text class="news-title">动态信息</text>
						<view class="news-more" @click="viewMoreNews">更多 ›</view>
					</view>
					<view class="news-list">
						<view class="news-item" v-for="news in newsList" :key="news.id" @click="viewNews(news)">
							<view :class="['news-tag', news.type]">{{ news.tag }}</view>
							<view class="news-content">
								<text class="news-title-text">{{ news.title }}</text>
								<text class="news-time">{{ news.time }}</text>
							</view>
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
			todoStats: {
				approval: 3,
				warning: 2,
				study: 1
			},
			statsList: [
				{ name: '设备总数', value: '156' },
				{ name: '耗材库存', value: '2,340' },
				{ name: '在研项目', value: '28' },
				{ name: '本月预警', value: '12' }
			],
			quickActions: [
				{ name: '扫码入库', icon: '📷', iconClass: 'icon-scan' },
				{ name: '新建项目', icon: '➕', iconClass: 'icon-project' },
				{ name: '快速审批', icon: '✓', iconClass: 'icon-approval' },
				{ name: '设备预约', icon: '📅', iconClass: 'icon-reserve' },
				{ name: '领取耗材', icon: '📦', iconClass: 'icon-supplies' },
				{ name: 'AI生成记录', icon: '🤖', iconClass: 'icon-ai' }
			],
			newsList: [
				{ id: 1, title: '关于开展2024年度安全检查的通知', tag: '系统公告', type: 'notice', time: '10分钟前' },
				{ id: 2, title: '培养箱A1温度异常预警，请及时处理', tag: '预警', type: 'warning', time: '30分钟前' },
				{ id: 3, title: '张三的设备采购申请已通过审批', tag: '审批动态', type: 'approval', time: '1小时前' },
				{ id: 4, title: 'PCR试剂盒库存不足预警', tag: '预警', type: 'warning', time: '2小时前' },
				{ id: 5, title: '实验室安全培训通知', tag: '系统公告', type: 'notice', time: '3小时前' }
			]
		};
	},
	onShow() {},
	onLoad() {},
	mounted() {},
	methods: {
		queryList(pageNo, pageSize) {
			this.$refs.paging.endRefresh();
		},
		goToTodoList() {
			uni.showToast({ title: '查看待办列表', icon: 'none' });
		},
		goToWarningList() {
			uni.showToast({ title: '查看预警列表', icon: 'none' });
		},
		goToStudyList() {
			uni.showToast({ title: '查看学习/考试', icon: 'none' });
		},
		doAction(action) {
			uni.showToast({ title: `${action.name}功能`, icon: 'none' });
		},
		viewMoreNews() {
			uni.showToast({ title: '查看更多动态', icon: 'none' });
		},
		viewNews(news) {
			uni.showToast({ title: `查看: ${news.title}`, icon: 'none' });
		}
	}
}
</script>

<style lang="scss" scoped>
.tab1Page {
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
	.todo-cards {
		display: flex;
		gap: 16rpx;
		margin-bottom: 24rpx;
	}
	.todo-card {
		flex: 1;
		display: flex;
		align-items: center;
		padding: 20rpx;
		background: #fff;
		border-radius: 16rpx;
		box-shadow: 0 2rpx 12rpx rgba(0,0,0,0.06);
	}
	.todo-icon {
		font-size: 36rpx;
		margin-right: 12rpx;
	}
	.todo-info {
		flex: 1;
	}
	.todo-count {
		display: block;
		font-size: 36rpx;
		font-weight: bold;
		color: #3B7EFFFF;
	}
	.todo-label {
		font-size: 22rpx;
		color: #999;
	}
	.todo-arrow {
		font-size: 32rpx;
		color: #ccc;
	}
	.stats-card {
		background: linear-gradient(135deg, #3B7EFFFF, #69C0FF);
		border-radius: 16rpx;
		padding: 24rpx;
		margin-bottom: 24rpx;
	}
	.stats-header {
		margin-bottom: 20rpx;
	}
	.stats-title {
		font-size: 28rpx;
		font-weight: 500;
		color: rgba(255,255,255,0.8);
	}
	.stats-grid {
		display: flex;
	}
	.stat-item {
		flex: 1;
		text-align: center;
	}
	.stat-value {
		display: block;
		font-size: 36rpx;
		font-weight: bold;
		color: #fff;
		margin-bottom: 6rpx;
	}
	.stat-label {
		font-size: 22rpx;
		color: rgba(255,255,255,0.8);
	}
	.quick-actions {
		margin-bottom: 24rpx;
	}
	.action-header {
		margin-bottom: 20rpx;
	}
	.action-title {
		font-size: 30rpx;
		font-weight: bold;
		color: #333;
	}
	.action-grid {
		display: flex;
		flex-wrap: wrap;
		gap: 20rpx;
	}
	.action-item {
		flex: 0 0 calc(33.33% - 14rpx);
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 24rpx 0;
		background: #F7F8FA;
		border-radius: 16rpx;
	}
	.action-icon {
		width: 80rpx;
		height: 80rpx;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 36rpx;
		margin-bottom: 12rpx;
	}
	.action-icon.icon-scan { background: linear-gradient(135deg, #667EEA, #764BA2); }
	.action-icon.icon-project { background: linear-gradient(135deg, #F093FB, #F5576C); }
	.action-icon.icon-approval { background: linear-gradient(135deg, #43E97B, #38F9D7); }
	.action-icon.icon-reserve { background: linear-gradient(135deg, #4FACFE, #00F2FE); }
	.action-icon.icon-supplies { background: linear-gradient(135deg, #FA709A, #FEE140); }
	.action-icon.icon-ai { background: linear-gradient(135deg, #A8EDEA, #FED6E3); }
	.action-name {
		font-size: 24rpx;
		color: #333;
	}
	.news-section {
	}
	.news-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 16rpx;
	}
	.news-title {
		font-size: 30rpx;
		font-weight: bold;
		color: #333;
	}
	.news-more {
		font-size: 24rpx;
		color: #999;
	}
	.news-list {
	}
	.news-item {
		display: flex;
		align-items: center;
		padding: 20rpx;
		border-radius: 12rpx;
		margin-bottom: 12rpx;
		background: #FAFAFA;
	}
	.news-item:active {
		background: #F0F0F0;
	}
	.news-tag {
		font-size: 20rpx;
		padding: 4rpx 12rpx;
		border-radius: 12rpx;
		margin-right: 16rpx;
	}
	.news-tag.notice { background: #E6F7FF; color: #1890FF; }
	.news-tag.warning { background: #FFF7E6; color: #FA8C16; }
	.news-tag.approval { background: #F6FFED; color: #52C41A; }
	.news-content {
		flex: 1;
	}
	.news-title-text {
		display: block;
		font-size: 26rpx;
		color: #333;
		margin-bottom: 4rpx;
	}
	.news-time {
		font-size: 22rpx;
		color: #999;
	}
}
</style>