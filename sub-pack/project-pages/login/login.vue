<template>
	<view>
		<!-- <u-navbar title="基因派" bgColor="transparent"></u-navbar> -->
		<view class="back" @click="onBack()" v-if="false">
			<u-icon name="arrow-left" color="#333" bold size="36rpx"></u-icon>
		</view>
		<view class="head">
			<image class="bj" :src="$staticPath+'genepi/2023/10/09/DAJ5MHL8CYNAca022cbbb5c4b7be3404a9677f33b21b_20231009160014A043.png'" mode=""></image>
			<image class="logo" :src="$staticPath+'genepi/2023/07/20/IdA7Zi0YbLEe7620eae879d9bd21424cbeb1caa71bad_20230720164648A005.png'" mode=""></image>
		</view>
		<view>
			<loginWeixin v-if="type == 0" @onSwitch="onSwitch"></loginWeixin>
			<loginAccount v-if="type == 1" @onSwitch="onSwitch"></loginAccount>
			<loginCode v-if="type == 2" @onSwitch="onSwitch"></loginCode>
			<loginSign1 v-if="type == 3" @onSwitch="onSwitch"></loginSign1>
			<loginSign2 v-if="type == 4" @onSwitch="onSwitch"></loginSign2>
		</view>
	</view>
</template>

<script>
	import loginWeixin from './module/loginWeixin.vue'
	import loginAccount from './module/loginAccount.vue'
	import loginCode from './module/loginCode.vue'
	import loginSign1 from './module/sign1.vue'
	import loginSign2 from './module/sign2.vue'
	export default {
		components:{
			loginWeixin,
			loginAccount,
			loginCode,
			loginSign1,
			loginSign2
		},
		data() {
			return {
				type:'',
				checked:''
			};
		},
		methods:{
			onSwitch(val){
				this.type =val
			},
			onBack(){
				// this.$eUni.reLaunch({url:'/pages/launch/launch'})
				this.$eUni.navBack()
			}
		}
	}
</script>

<style lang="less">
	.head{
		width: 100%;
		height: 50vh;
		position: relative;
		.logo{
			width: 200rpx;
			height: 200rpx;
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-50%,-50%);
			z-index: 9;
		}
		.bj{
			position: absolute;
			left: 0;
			top: 0;
			width: 100%;
			height: 180%;
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
