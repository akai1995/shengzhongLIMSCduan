<template>
	<u-tabbar :value="value" :border="true" activeColor="#3B7EFFFF">
		<u-tabbar-item text="设备" @click="jump('/pages/index/index', 0)">
			<image class="nav-img" slot="inactive-icon" src="@/static/index/home.png"></image>
			<image class="nav-img" slot="active-icon" src="@/static/index/home-fell.png"></image>
		</u-tabbar-item>

		<u-tabbar-item text="我的" @click="jump('/pages/user/user', 1)">
			<image class="nav-img" slot="inactive-icon" src="@/static/index/user.png"></image>
			<image class="nav-img" slot="active-icon" src="@/static/index/user-fell.png"></image>
		</u-tabbar-item>
	</u-tabbar>
</template>

<script>
export default {
	name: "bottomNav",
	props:["value"],
	props: {
		value: {
			type: Number,
			default: 0
		},
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