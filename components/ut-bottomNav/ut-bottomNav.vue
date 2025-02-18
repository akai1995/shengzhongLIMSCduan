<template>
	<view>
		<template v-if="type * 1">
			<u-tabbar :value="value" :border="true" activeColor="#3B7EFFFF">
				<u-tabbar-item text="首页" @click="jump('/pages/index/index',0)">
					<image class="nav-img" slot="inactive-icon" src="@/static/index/home.png"></image>
					<image class="nav-img" slot="active-icon" src="@/static/index/home-fell.png"></image>
				</u-tabbar-item>
				<!-- <u-tabbar-item text="肿瘤社区" badge="0 " @click="jump('/pages/community/community',1)">
					<image class="nav-img" slot="inactive-icon" src="@/static/index/community.png"></image>
					<image class="nav-img" slot="active-icon" src="@/static/index/community-fell.png"></image>
				</u-tabbar-item> -->
				<u-tabbar-item text="我的" @click="jump('/pages/user/user',2)">
					<image class="nav-img" slot="inactive-icon" src="@/static/index/user.png"></image>
					<image class="nav-img" slot="active-icon" src="@/static/index/user-fell.png"></image>
				</u-tabbar-item>
			</u-tabbar>
		</template>
		<template v-else>
			<u-tabbar :value="value" :border="true" activeColor="#3B7EFFFF">
				<u-tabbar-item text="首页" @click="jump('/pagesC/doctor-index/doctor-index',0)">
					<image class="nav-img" slot="inactive-icon" src="@/static/index/home.png"></image>
					<image class="nav-img" slot="active-icon" src="@/static/index/home-fell.png"></image>
				</u-tabbar-item>
				<u-tabbar-item text="我的" @click="jump('/pagesC/setting/setting',1)">
					<image class="nav-img" slot="inactive-icon" src="@/static/index/user.png"></image>
					<image class="nav-img" slot="active-icon" src="@/static/index/user-fell.png"></image>
				</u-tabbar-item>
			</u-tabbar>
		</template>
	</view>
</template>

<script>
	export default {
		name: "bottomNav",
		props: {
			value: {
				type: Number,
				default: 0
			},
			type: {
				type: String,
				default: '1'
			}
		},
		data() {
			return {

			};
		},
		methods: {
			jump(url, val) {
				if (this.value === val) {
					return
				}
				uni.redirectTo({
					url: url
				})
			}
		}
	}
</script>

<style lang="less">
	.nav-img {
		width: 48rpx;
		height: 48rpx;
	}
</style>