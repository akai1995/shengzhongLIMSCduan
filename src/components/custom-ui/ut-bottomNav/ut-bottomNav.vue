<template>
	<u-tabbar :value="value" :border="true" activeColor="#3B7EFFFF">
		<u-tabbar-item text="首页" @click="onJump('/pages/tabs/tab1/tab1', 0)">
			<image class="nav-img" slot="inactive-icon" src="@/static/nav/nav1-1.png"></image>
			<image class="nav-img" slot="active-icon" src="@/static/nav/nav1-2.png"></image>
		</u-tabbar-item>

		<u-tabbar-item text="我的" @click="onJump('/pages/tabs/tab5/tab5', 1)">
			<image class="nav-img" slot="inactive-icon" src="@/static/nav/nav5-1.png"></image>
			<image class="nav-img" slot="active-icon" src="@/static/nav/nav5-2.png"></image>
		</u-tabbar-item>
	</u-tabbar>
</template>

<script>
export default {
	name: 'ut-bottom-nav',
	props: { value: { type: Number, default: 0 }, }, data() { return { } },
	methods: {
		onJump(path, idx) { if (this.value === idx) { return } if (idx!=0) { if (!this.checkUserInfo()){ return } } this.$eUni.redirectTo({ url: path }) }
	}
}
</script>

<style lang="scss" scoped>
.nav-img {
	width: 50rpx;
	height: 50rpx;
}
</style>