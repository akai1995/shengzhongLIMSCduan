<template>
	<u-tabbar :value="value" :border="true" activeColor="#3B7EFFFF">
		<!-- <u-tabbar-item v-for="menu,idx in menuList" :key="idx" :text="menu.name" @click="onJump(menu.path, idx)">
			<image class="nav-img" slot="inactive-icon" :src="menu.inactive"></image>
			<image class="nav-img" slot="active-icon" :src="menu.active"></image>
		</u-tabbar-item> -->
		<u-tabbar-item text="首页" @click="onJump('/pages/launch/launch', 0)">
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
// const tab1_1 = require('@/static/nav/nav1-1.png');
// const tab1_2 = require('@/static/nav/nav1-2.png');
// const tab5_1 = require('@/static/nav/nav5-1.png');
// const tab5_2 = require('@/static/nav/nav5-2.png');
export default {
	name: 'ut-bottom-nav',
	props:['value'],
	props: {
		value: {
			type: Number,
			default: 0
		},
	},
	data() {
		return {
			// menuList: [
			// 	{
			// 		name: '首页',
			// 		path: '/pages/launch/launch',
			// 		inactive: tab1_1, active: tab1_2
			// 	},
			// 	{
			// 		name: '我的',
			// 		path: '/pages/tabs/tab5/tab5',
			// 		inactive: tab5_1, active: tab5_2
			// 	}
			// ]
		};
	},
	methods: {
		onJump(path, idx) {
			if (this.value === idx) return
			this.$eUni.redirectTo({ url: path })
		}
	}
}
</script>

<style lang="less" scoped>
.nav-img {
	width: 50rpx;
	height: 50rpx;
}
</style>