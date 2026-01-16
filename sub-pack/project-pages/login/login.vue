<template>
	<z-paging
		ref="paging" class="loginPage" :paging-style="{backgroundColor: 'white'}" v-model="dataList" @query="queryList"
		:fixed="true" :auto="false" :refresher-enabled="false" :auto-show-back-to-top="true" :auto-scroll-to-top-when-reload="false"
		:loading-more-enabled="false" :show-refresher-when-reload="false" hide-empty-view
	>
		<!-- <u-navbar title="基因派" bgColor="transparent"></u-navbar> -->
        <view slot="top"><u-navbar title="登录" :fixed="false" leftIcon="close" bgColor="transparent" @leftClick="onBack" /></view>
		<!-- <view class="back" @click="onBack()" v-if="false"><u-icon name="arrow-left" color="#333" bold size="36rpx" /></view> -->
		<view class="head">
			<!-- <image class="bj" :src="$staticPath+'genepi/2023/10/09/DAJ5MHL8CYNAca022cbbb5c4b7be3404a9677f33b21b_20231009160014A043.png'" mode=""></image> -->
			<image class="logo" :src="`${$staticPath}temp/imgs/logo.png`" mode="" />
		</view>
		<template>
			<loginWeixin v-if="type == 0" @onSwitch="onSwitch"></loginWeixin>
			<loginAccount v-if="type == 1" @onSwitch="onSwitch"></loginAccount>
			<loginCode v-if="type == 2" @onSwitch="onSwitch"></loginCode>
			<loginSign1 v-if="type == 3" @onSwitch="onSwitch"></loginSign1>
			<loginSign2 v-if="type == 4" @onSwitch="onSwitch"></loginSign2>
		</template>
	</z-paging>
</template>

<script>
	import loginWeixin from './components/loginWeixin.vue'
	import loginAccount from './components/loginAccount.vue'
	import loginCode from './components/loginCode.vue'
	import loginSign1 from './components/sign1.vue'
	import loginSign2 from './components/sign2.vue'
	export default {
		components:{
			loginWeixin, loginAccount, loginCode,
			loginSign1, loginSign2
		},
		data() { return { dataList: [], firstLoaded: false,type: '', checked: '' } },
		methods: {
			queryList(pageNo, pageSize) { this.$refs.paging.endRefresh(); uni.hideLoading(); },
			onSwitch(val) { this.type = val },
			onBack() { /* this.$eUni.reLaunch({ url: '/pages/launch/launch' }) */ this.$eUni.navBack() }
		}
	}
</script>

<style lang="scss" scoped>
	.loginPage{
		@include background-image('temp/imgs/loginBg.png');
		width: 100vw; height: 100vh;
	}
	.head{
		width: 100%; height: 50vh;
		position: relative;
		.logo{
			width: 200rpx; height: 200rpx;
			position: absolute;
			top: 50%; left: 50%;
			transform: translate(-50%,-50%);
			z-index: 9;
		}
		.bj{
			position: absolute;
			left: 0; top: 0;
			width: 100%; height: 180%;
			z-index: -1;
		}
	}
	.back{
		position: fixed;
		top: 90rpx;
		left: 30rpx;
		z-index: 10;
	}
</style>
