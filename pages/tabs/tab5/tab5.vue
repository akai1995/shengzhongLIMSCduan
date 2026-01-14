<style lang="less" scoped>
@import './asserts/tab5.less';
</style>

<template>
	<view class="user">
		<image class="detail-bg" :src="$staticPath+'device-appointment/Bg.png'" />
		<view class="detail-head" :style="{ height: headInfo.headHeight }">
			<view class="detail-title" :style="{ marginTop: headInfo.titleTop }">我的</view>
		</view>

		<view class="detail-info">
			<view class="detail-info-icon">
				<image class="detail-info-img" :src="$staticPath+'device-appointment/image 28.png'" />
			</view>
			<view class="detail-info-message">
				<view class="detail-info-message-name">{{ userName }}</view>
				<view class="detail-info-message-sub">欢迎使用设备智约助手</view>
			</view>
		</view>

		<view class="detail-card">
			<view v-for="menu,idx in menuList" :key="idx" class="detail-card-item" @click="onJump(menu)">
				<view class="detail-card-item-icon">
					<image class="detail-card-item-img" :src="menu.icon" />
				</view>
				<view class="detail-card-item-text">{{menu.name}}</view>
				<view class="detail-card-item-arror">
					<image class="detail-card-item-arror-img" :src="$staticPath+'device-appointment/icon-arrow-right.png'" />
				</view>
			</view>
		</view>

		<ut-bottomNav :value="1"></ut-bottomNav>
	</view>
</template>

<script>

export default {
	data() {
		return {
			headInfo: { headHeight: '0px', titleTop: '0px', listHeight: '0px' },
			userName: '尊敬的用户',
            menuList: [
                {
                    name:'我的预约', path: '/sub-pack/tab5/reserve/reserve',
                    icon: this.$staticPath+'device-appointment/Frame.png'
                },
                {
                    name:'联系客服', path: '',
                    icon: this.$staticPath+'device-appointment/service.png'
                },
            ]
		};
	},
	onLoad() {
		this.getHeadInfo()
		this.checkUserInfo()
	},
	methods: {
		getHeadInfo() {
			// #ifdef MP-WEIXIN
			const popInfo = uni.getMenuButtonBoundingClientRect()
			this.headInfo.headHeight = `${popInfo.height}px`
			this.headInfo.titleTop = `${popInfo.top}px`
			this.headInfo.listHeight = `calc(100vh - ${popInfo.top + popInfo.height + 155}px)`
			// #endif
		},
		checkUserInfo() {
			const id = this.$store.getters.userId
			console.log(this.$store.getters);
			if (!id) {
				this.$ut.jump("/project-pages/login/login");
				return false;
			}
            return true;
		},
		onJump(item) {
            if (item.path) {
                this.checkUserInfo()
			    this.$ut.jump(item.path);
            } else {
			    uni.showToast({ title: "敬请期待", icon: "none", });
            }
		}
	},
};
</script>
