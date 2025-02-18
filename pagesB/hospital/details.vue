<template>
	<view>
		<ut-nav title="医疗简介" border></ut-nav>
		<view class="content">
			<view class="flex j-c-c">
				<image class="headImg width" v-if="headImg" :src="headImg" mode=""></image>
			</view>
			<view class="m-t3 title">{{title}}</view>
			<view class="m-t3">
				<rich-text class="rich"  :nodes="nodes"></rich-text>
			</view>
		</view>
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				title:'',
				headImg:'',
				nodes:''
			};
		},
		onLoad(e) {
			this.headImg=e.headImg;
			this.nodes=e.biography;
			this.title = e.title
		}
	
	}
</script>

<style lang="less">
	page{
		background: #fff;
	}
	.title{
		color: #222;
		font-size: 32rpx;
		font-weight: 600;
		letter-spacing: 2rpx;
	}
	/deep/ .rich{
		color: #222;
		font-size: 24rpx;
		line-height: 1.8;
		font-weight: 400;
	}
</style>
