<template>
	<z-paging
		ref="paging" class="tab2Page" :paging-style="{ backgroundColor: '#F7F8FA' }" v-model="dataList" @query="queryList"
		:fixed="true" :auto="false" :refresher-enabled="false" :auto-show-back-to-top="true" :auto-scroll-to-top-when-reload="false"
		:loading-more-enabled="false" :show-refresher-when-reload="false" hide-empty-view
	>
		<view slot="top" style="position: relative; box-sizing: border-box;">
			<image class="home-bg" :src="`${$staticPath}imgs/userBg.png`" />
			<u-navbar title="科研" :fixed="false" bgColor="transparent"><view class="u-nav-slot" slot="left"></view></u-navbar>

			<view class="content">
				<view class="tabs-wrap">
					<view 
						v-for="(tab, index) in tabs" 
						:key="index"
						:class="['tab-item', { active: currentTab === index }]"
						@click="currentTab = index"
					>
						{{ tab.name }}
						<view v-if="tab.badge" class="badge">{{ tab.badge }}</view>
					</view>
				</view>

				<view v-if="currentTab === 0" class="project-list">
					<view v-for="project in projectList" :key="project.id" class="project-card">
						<view class="project-header">
							<view class="project-name">{{ project.name }}</view>
							<view :class="['status', project.status]">{{ project.statusText }}</view>
						</view>
						<view class="project-info">
							<text>进度：{{ project.progress }}%</text>
							<text>成员：{{ project.members }}人</text>
						</view>
						<view class="progress-bar">
							<view class="progress-fill" :style="{ width: project.progress + '%' }"></view>
						</view>
						<view class="project-actions">
							<view class="action-btn" @click="viewProject(project)">查看进度</view>
							<view class="action-btn" @click="viewMembers(project)">查看成员</view>
							<view class="action-btn" @click="viewResults(project)">查看成果</view>
						</view>
					</view>
				</view>

				<view v-if="currentTab === 1" class="approval-list">
					<view v-for="item in approvalList" :key="item.id" class="approval-card">
						<view class="approval-header">
							<view class="approval-title">{{ item.title }}</view>
							<view :class="['approval-status', item.status]">{{ item.statusText }}</view>
						</view>
						<view class="approval-info">
							<text>申请人：{{ item.applicant }}</text>
							<text>{{ item.time }}</text>
						</view>
						<view class="approval-actions">
							<view class="action-btn approve" @click="approve(item)">同意</view>
							<view class="action-btn reject" @click="reject(item)">拒绝</view>
						</view>
					</view>
				</view>

				<view v-if="currentTab === 2" class="funds-panel">
					<view class="funds-summary">
						<view class="funds-item">
							<text class="funds-value">¥{{ formatMoney(fundsData.budget) }}</text>
							<text class="funds-label">剩余预算</text>
						</view>
						<view class="funds-item">
							<text class="funds-value">¥{{ formatMoney(fundsData.pending) }}</text>
							<text class="funds-label">待审批金额</text>
						</view>
					</view>
					<view class="funds-list">
						<view v-for="item in expenseList" :key="item.id" class="expense-item">
							<view class="expense-info">
								<text class="expense-title">{{ item.title }}</text>
								<text class="expense-time">{{ item.time }}</text>
							</view>
							<view :class="['expense-amount', item.status]">¥{{ formatMoney(item.amount) }}</view>
						</view>
					</view>
					<view class="upload-btn" @click="uploadExpense">
						<text>拍照上传凭证</text>
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
			currentTab: 0,
			tabs: [
				{ name: '我的项目', badge: '' },
				{ name: '待我审批', badge: '3' },
				{ name: '经费动态', badge: '' }
			],
			projectList: [
				{ id: 1, name: 'AI辅助药物研发项目', status: 'active', statusText: '进行中', progress: 65, members: 8 },
				{ id: 2, name: '新型材料性能研究', status: 'pending', statusText: '待审批', progress: 0, members: 5 },
				{ id: 3, name: '基因组数据分析平台', status: 'completed', statusText: '已完成', progress: 100, members: 12 }
			],
			approvalList: [
				{ id: 1, title: '设备采购申请', applicant: '张三', time: '2024-01-15', status: 'pending', statusText: '待审批' },
				{ id: 2, title: '差旅费报销', applicant: '李四', time: '2024-01-14', status: 'pending', statusText: '待审批' },
				{ id: 3, title: '外协服务合同', applicant: '王五', time: '2024-01-13', status: 'pending', statusText: '待审批' }
			],
			fundsData: { budget: 580000, pending: 45000 },
			expenseList: [
				{ id: 1, title: '设备购置费', amount: 120000, time: '2024-01-10', status: 'approved' },
				{ id: 2, title: '差旅费', amount: 8500, time: '2024-01-08', status: 'approved' },
				{ id: 3, title: '实验材料费', amount: 23000, time: '2024-01-05', status: 'pending' }
			]
		};
	},
	methods: {
		queryList(pageNo, pageSize) {
			this.$refs.paging.endRefresh();
		},
		formatMoney(val) {
			return val.toLocaleString();
		},
		viewProject(project) {
			uni.showToast({ title: `查看项目: ${project.name}`, icon: 'none' });
		},
		viewMembers(project) {
			uni.showToast({ title: `查看成员: ${project.members}人`, icon: 'none' });
		},
		viewResults(project) {
			uni.showToast({ title: `查看成果: ${project.name}`, icon: 'none' });
		},
		approve(item) {
			uni.showToast({ title: `同意: ${item.title}`, icon: 'none' });
		},
		reject(item) {
			uni.showToast({ title: `拒绝: ${item.title}`, icon: 'none' });
		},
		uploadExpense() {
			uni.showToast({ title: '拍照上传凭证', icon: 'none' });
		}
	}
};
</script>

<style lang="scss" scoped>
.tab2Page {
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
	.tabs-wrap {
		display: flex;
		background: #F7F8FA;
		border-radius: 16rpx;
		padding: 8rpx;
		margin-bottom: 32rpx;
	}
	.tab-item {
		flex: 1;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 8rpx;
		height: 72rpx;
		border-radius: 12rpx;
		font-size: 28rpx;
		color: #666;
		transition: all 0.3s;
	}
	.tab-item.active {
		background: #3B7EFFFF;
		color: #fff;
	}
	.tab-item .badge {
		background: #FF4D4F;
		color: #fff;
		font-size: 20rpx;
		padding: 2rpx 12rpx;
		border-radius: 20rpx;
	}
	.project-list {
	}
	.project-card {
		background: #fff;
		border-radius: 16rpx;
		padding: 24rpx;
		margin-bottom: 24rpx;
		box-shadow: 0 2rpx 12rpx rgba(0,0,0,0.06);
	}
	.project-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 16rpx;
	}
	.project-name {
		font-size: 32rpx;
		font-weight: bold;
		color: #333;
	}
	.status {
		font-size: 24rpx;
		padding: 6rpx 16rpx;
		border-radius: 20rpx;
	}
	.status.active { background: #E6F7FF; color: #1890FF; }
	.status.pending { background: #FFF7E6; color: #FA8C16; }
	.status.completed { background: #F6FFED; color: #52C41A; }
	.project-info {
		display: flex;
		gap: 32rpx;
		margin-bottom: 16rpx;
		text {
			font-size: 26rpx;
			color: #999;
		}
	}
	.progress-bar {
		height: 12rpx;
		background: #F0F0F0;
		border-radius: 6rpx;
		margin-bottom: 20rpx;
	}
	.progress-fill {
		height: 100%;
		background: linear-gradient(90deg, #3B7EFFFF, #69C0FF);
		border-radius: 6rpx;
	}
	.project-actions {
		display: flex;
		gap: 16rpx;
	}
	.action-btn {
		flex: 1;
		height: 64rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		background: #F7F8FA;
		border-radius: 32rpx;
		font-size: 24rpx;
		color: #666;
	}
	.action-btn.approve { background: #3B7EFFFF; color: #fff; }
	.action-btn.reject { background: #F5F5F5; color: #999; }
	.approval-list {
	}
	.approval-card {
		background: #fff;
		border-radius: 16rpx;
		padding: 24rpx;
		margin-bottom: 24rpx;
		box-shadow: 0 2rpx 12rpx rgba(0,0,0,0.06);
	}
	.approval-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 12rpx;
	}
	.approval-title {
		font-size: 30rpx;
		font-weight: 500;
		color: #333;
	}
	.approval-status {
		font-size: 22rpx;
		padding: 4rpx 12rpx;
		border-radius: 16rpx;
	}
	.approval-status.pending { background: #FFF7E6; color: #FA8C16; }
	.approval-info {
		display: flex;
		justify-content: space-between;
		margin-bottom: 20rpx;
		text {
			font-size: 24rpx;
			color: #999;
		}
	}
	.approval-actions {
		display: flex;
		gap: 16rpx;
	}
	.funds-panel {
	}
	.funds-summary {
		display: flex;
		gap: 24rpx;
		margin-bottom: 32rpx;
	}
	.funds-item {
		flex: 1;
		background: linear-gradient(135deg, #3B7EFFFF, #69C0FF);
		border-radius: 16rpx;
		padding: 24rpx;
		text-align: center;
	}
	.funds-value {
		display: block;
		font-size: 36rpx;
		font-weight: bold;
		color: #fff;
		margin-bottom: 8rpx;
	}
	.funds-label {
		font-size: 24rpx;
		color: rgba(255,255,255,0.8);
	}
	.funds-list {
		margin-bottom: 24rpx;
	}
	.expense-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 20rpx 0;
		border-bottom: 1rpx solid #F0F0F0;
	}
	.expense-item:last-child { border-bottom: none; }
	.expense-info {
	}
	.expense-title {
		display: block;
		font-size: 28rpx;
		color: #333;
		margin-bottom: 6rpx;
	}
	.expense-time {
		font-size: 22rpx;
		color: #999;
	}
	.expense-amount {
		font-size: 28rpx;
		font-weight: 500;
	}
	.expense-amount.approved { color: #52C41A; }
	.expense-amount.pending { color: #FA8C16; }
	.upload-btn {
		background: #F7F8FA;
		border-radius: 16rpx;
		height: 88rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		text {
			font-size: 28rpx;
			color: #3B7EFFFF;
		}
	}
}
</style>