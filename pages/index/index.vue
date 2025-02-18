<template>
	<view class="page">
		<view style="padding: 30rpx; box-sizing: border-box">
			<u-navbar title=" " :placeholder="true" :safeAreaInsetTop="true" bgColor="#C7D9FD" leftIconColor="#303133">
				<view class="u-nav-slot" slot="left">
					<u--image :src="logo" height="60rpx" width="416rpx" mode="widthFix"></u--image>
				</view>
			</u-navbar>

			<ut-bottomNav :value="0"></ut-bottomNav>
		</view>


	</view>
</template>

<script>


export default {
	data() {
		return {
			envWx: "release",
			logo: "https://genepiapi.ypzlfx.com/file/genepi/2023/12/07/U5gFdYHpS0aRde080d36af056f00c408e49870a5b6f4_20231207165852A977.png",
			
		};
	},
	onLoad() {
		
	},
	methods: {
	},
};
</script>

<style lang="less" scoped>
.page {
	width: 100%;
	min-height: 100vh;
	background: linear-gradient(180deg, #c7d9fd 10%, #ffffff 57%);
	border-radius: 0rpx 0rpx 0rpx 0rpx;
	opacity: 1;
	position: relative;
}
</style>
