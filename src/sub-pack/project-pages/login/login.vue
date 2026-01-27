<template>
	<z-paging
		ref="paging" class="loginPage" :paging-style="{ backgroundColor: 'white' }" v-model="dataList" @query="queryList"
		:fixed="true" :auto="false" :refresher-enabled="false" :auto-show-back-to-top="true" :auto-scroll-to-top-when-reload="false"
		:loading-more-enabled="false" :show-refresher-when-reload="false" hide-empty-view
	>
        <view slot="top"><u-navbar title="登录" :fixed="false" leftIcon="close" bgColor="transparent" @leftClick="onBack" /></view>
		<!-- <view class="back" @click="onBack()" v-if="false"><u-icon name="arrow-left" color="#333" bold size="36rpx" /></view> -->
		<!-- #ifdef MP-WEIXIN -->
		<view class="head">
			<image class="logo" :src="`${$staticPath}imgs/logo.png`" mode="" />
		</view>
		<loginWeixin @onSwitch="onSwitch"></loginWeixin>
		<!-- #endif -->
		<!-- #ifdef H5 -->
		<view class="head" style="height: 36vh;">
			<image class="logo" :src="`${$staticPath}imgs/logo.png`" mode="" />
		</view>
		<loginAccount v-if="type == 1" @onSwitch="onSwitch"></loginAccount>
		<loginCode v-if="type == 2" @onSwitch="onSwitch"></loginCode>
		<loginSign1 v-if="type == 3" @onSwitch="onSwitch"></loginSign1>
		<loginSign2 v-if="type == 4" @onSwitch="onSwitch"></loginSign2>
		<!-- #endif -->
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
		mounted() {
			// #ifdef H5
			this.type = 1
			// #endif
		},
		methods: {
			queryList(pageNo, pageSize) { this.$refs.paging.endRefresh(); uni.hideLoading(); },
			onSwitch(val) { this.type = val },
			onBack() {this.$eUni.navBack() }
		}
	}
</script>

<style lang="scss" scoped>
	.loginPage{
		@include background-image('imgs/loginBg.png');
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
