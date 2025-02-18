<template>
	<view class="u-content">
		<ut-nav src="/pagesA/user/operationManual" title="操作手册" border></ut-nav>
		<!-- <u-parse :content="content"></u-parse> -->
		<rich-text :nodes="content"></rich-text>
	</view>
</template>

<script>
	import {
		getOperationManualType
	} from "@/api/personalCenter/operationManual"
	export default {
		data() {
			return {
				content: ''
			}
		},
		onLoad(options) {
			if(options.type){
				this.getData(options.type);
			}
			
		},
		
		methods: {
			getData(type) {
				getOperationManualType(type).then(res => {
					let content = res.data.content;
					this.content = content.replace(/<img/gi,'<img style="max-width:100%;height:auto;margin-top:20rpx;display:block"')
				});
			},

		}
	}
</script>

<style lang="scss">
	.u-content {
		padding: 24rpx;
		// font-size: 32rpx;
		color: $u-content-color;
		line-height: 1.6;
	}
	
	.ql-align-center{
		margin: 20rpx 0;
	}
</style>