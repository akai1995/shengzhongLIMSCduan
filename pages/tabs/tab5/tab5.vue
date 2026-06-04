<template>
	<z-paging
		ref="paging" class="tab5Page" :paging-style="{ backgroundColor: '#F7F8FA' }" v-model="dataList" @query="queryList"
		:fixed="true" :auto="false" :refresher-enabled="false" :auto-show-back-to-top="true" :auto-scroll-to-top-when-reload="false"
		:loading-more-enabled="false" :show-refresher-when-reload="false" hide-empty-view
	>
		<view slot="top" style="position: relative; box-sizing: border-box;">
			<image class="home-bg" :src="`${$staticPath}imgs/userBg.png`" />
			<u-navbar title="我的" :fixed="false" bgColor="transparent"><view class="u-nav-slot" slot="left"></view></u-navbar>

			<view class="user-card">
				<view class="avatar-wrap">
					<view class="avatar">👤</view>
					<view class="vip-badge">VIP</view>
				</view>
				<view class="user-info">
					<text class="user-name">{{ userName }}</text>
					<text class="user-role">高级研究员</text>
				</view>
				<view class="edit-btn" @click="editProfile">编辑 ›</view>
			</view>

			<view class="user-stats">
				<view class="user-stat-item" @click="viewAchievements">
					<text class="stat-num">12</text>
					<text class="stat-text">项目成果</text>
				</view>
				<view class="user-stat-item" @click="viewCollect">
					<text class="stat-num">28</text>
					<text class="stat-text">收藏</text>
				</view>
				<view class="user-stat-item" @click="viewFollow">
					<text class="stat-num">156</text>
					<text class="stat-text">关注</text>
				</view>
				<view class="user-stat-item" @click="viewFans">
					<text class="stat-num">89</text>
					<text class="stat-text">粉丝</text>
				</view>
			</view>
		</view>

		<view class="content">
			<view class="menu-section">
				<view class="menu-group">
					<view class="menu-item" v-for="item in messageMenu" :key="item.name" @click="goToPage(item)">
						<view class="menu-icon">{{ item.icon }}</view>
						<text class="menu-name">{{ item.name }}</text>
						<view v-if="item.badge" class="menu-badge">{{ item.badge }}</view>
						<text class="menu-arrow">›</text>
					</view>
				</view>

				<view class="menu-group">
					<view class="menu-item" v-for="item in studyMenu" :key="item.name" @click="goToPage(item)">
						<view class="menu-icon">{{ item.icon }}</view>
						<text class="menu-name">{{ item.name }}</text>
						<view v-if="item.badge" class="menu-badge">{{ item.badge }}</view>
						<text class="menu-arrow">›</text>
					</view>
				</view>

				<view class="menu-group">
					<view class="menu-item" v-for="item in workMenu" :key="item.name" @click="goToPage(item)">
						<view class="menu-icon">{{ item.icon }}</view>
						<text class="menu-name">{{ item.name }}</text>
						<text class="menu-arrow">›</text>
					</view>
				</view>

				<view class="menu-group">
					<view class="menu-item" v-for="item in settingMenu" :key="item.name" @click="goToPage(item)">
						<view class="menu-icon">{{ item.icon }}</view>
						<text class="menu-name">{{ item.name }}</text>
						<text class="menu-arrow">›</text>
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
			userName: '尊敬的用户',
			messageMenu: [
				{ name: '消息中心', icon: '💬', badge: '3', path: '' },
				{ name: '系统通知', icon: '📢', badge: '1', path: '' }
			],
			studyMenu: [
				{ name: '在线学习', icon: '📚', badge: '', path: '' },
				{ name: '考试中心', icon: '✏️', badge: '2', path: '' },
				{ name: '培训记录', icon: '📝', badge: '', path: '' }
			],
			workMenu: [
				{ name: '考勤打卡', icon: '⏰', badge: '', path: '' },
				{ name: '我的预约', icon: '📅', badge: '', path: '/sub-pack/tab5/reserve/reserve' },
				{ name: '待签署', icon: '✍️', badge: '', path: '/sub-pack/tab5/sign-doc/sign-doc' },
				{ name: '联系客服', icon: '💁', badge: '', path: '' }
			],
			settingMenu: [
				{ name: '账号设置', icon: '🔧', path: '' },
				{ name: '隐私设置', icon: '🔒', path: '' },
				{ name: '关于我们', icon: 'ℹ️', path: '' },
				{ name: '退出登录', icon: '🚪', path: '' }
			]
		};
	},
	onLoad() {
	},
	methods: {
		queryList(pageNo, pageSize) {
			this.$refs.paging.endRefresh();
			uni.hideLoading();
		},
		editProfile() {
			uni.showToast({ title: '编辑个人信息', icon: 'none' });
		},
		viewAchievements() {
			uni.showToast({ title: '查看项目成果', icon: 'none' });
		},
		viewCollect() {
			uni.showToast({ title: '查看收藏', icon: 'none' });
		},
		viewFollow() {
			uni.showToast({ title: '查看关注', icon: 'none' });
		},
		viewFans() {
			uni.showToast({ title: '查看粉丝', icon: 'none' });
		},
		goToPage(item) {
			if (item.name === '退出登录') {
				uni.showModal({
					title: '提示',
					content: '确定要退出登录吗？',
					success: (res) => {
						if (res.confirm) {
							uni.showToast({ title: '已退出登录', icon: 'none' });
						}
					}
				});
				return;
			}
			if (item.path) {
				if (!this.checkUserInfo()) { return }
				this.$ut.jump(item.path);
			} else {
				uni.showToast({ title: `${item.name}`, icon: 'none' });
			}
		}
	}
};
</script>

<style lang="scss" scoped>
.tab5Page {
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
	.user-card {
		position: relative;
		display: flex;
		align-items: center;
		padding: 32rpx;
		.avatar-wrap {
			position: relative;
			margin-right: 20rpx;
			.avatar {
				width: 120rpx;
				height: 120rpx;
				border-radius: 50%;
				background: linear-gradient(135deg, #3B7EFFFF, #69C0FF);
				display: flex;
				align-items: center;
				justify-content: center;
				font-size: 56rpx;
			}
			.vip-badge {
				position: absolute;
				bottom: -4rpx;
				left: 50%;
				transform: translateX(-50%);
				background: linear-gradient(135deg, #FFD700, #FFA500);
				color: #fff;
				font-size: 18rpx;
				padding: 2rpx 12rpx;
				border-radius: 12rpx;
			}
		}
		.user-info {
			flex: 1;
			.user-name {
				display: block;
				font-size: 36rpx;
				font-weight: bold;
				color: #fff;
				margin-bottom: 8rpx;
			}
			.user-role {
				font-size: 24rpx;
				color: rgba(255,255,255,0.8);
			}
		}
		.edit-btn {
			font-size: 26rpx;
			color: rgba(255,255,255,0.9);
		}
	}
	.user-stats {
		display: flex;
		background: rgba(255,255,255,0.95);
		margin: 0 32rpx;
		border-radius: 16rpx;
		padding: 24rpx 0;
		.user-stat-item {
			flex: 1;
			text-align: center;
			.stat-num {
				display: block;
				font-size: 36rpx;
				font-weight: bold;
				color: #333;
				margin-bottom: 8rpx;
			}
			.stat-text {
				font-size: 24rpx;
				color: #999;
			}
		}
	}
	.content {
		position: relative;
		background: #fff;
		border-radius: 24rpx 24rpx 0 0;
		margin-top: 20rpx;
		padding: 32rpx;
	}
	.menu-section {
		.menu-group {
			background: #fff;
			border-radius: 16rpx;
			padding: 8rpx 0;
			margin-bottom: 20rpx;
			box-shadow: 0 2rpx 12rpx rgba(0,0,0,0.04);
			.menu-item {
				display: flex;
				align-items: center;
				padding: 24rpx 24rpx;
				position: relative;
				&:active {
					background: #FAFAFA;
				}
				.menu-icon {
					font-size: 36rpx;
					margin-right: 20rpx;
				}
				.menu-name {
					flex: 1;
					font-size: 28rpx;
					color: #333;
				}
				.menu-badge {
					background: #FF4D4F;
					color: #fff;
					font-size: 22rpx;
					padding: 2rpx 12rpx;
					border-radius: 20rpx;
					margin-right: 12rpx;
				}
				.menu-arrow {
					font-size: 32rpx;
					color: #ccc;
				}
			}
		}
	}
}
</style>
