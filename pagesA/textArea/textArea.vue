<template>
	<view>
		<ut-nav title="简介" border></ut-nav>
		<u--textarea height="400rpx" v-model="value" placeholder="请输入简介,最长200个汉字" border="none" maxlength="200" count></u--textarea>
		<view class="btn-box">
			<view class="btn" @click="submit()">完成</view>
		</view>
	</view>
</template>

<script>
	export default{
		data(){
			return {
				value:'',
			}
		},
		onLoad(option) {
			if(option.text){
				this.value = option.text
			}
		},
		methods:{
			submit(){
				// 获取所有页面栈实例列表
				let pages = getCurrentPages();
				
				// 当前页页面实例
				let nowPage = pages[ pages.length - 1];
				
				// 上一页页面实例
				let prevPage = pages[ pages.length - 2 ];
				// console.log('++', prevPage.$vm.form )
				// 修改上一页data里面的times参数值为100
				prevPage.$vm.form.speciality = this.value;
				// console.log('--', prevPage.$vm.form )
				
				uni.navigateBack()
			}
		}
	}
</script>

<style lang="scss">
	.btn-box{
		position: fixed;
		bottom: 40rpx;
		left: 0;
		right: 0;
		z-index: 9;
	}
	.btn{
		width: 90%;
		height: 80rpx;
		margin: auto;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 80rpx;
		background: linear-gradient(135deg, #00DEFF 0%, #0C5FFF 100%);
		color: #fff;
		font-size: 36rpx;
		font-weight: 600;
		letter-spacing: 5rpx;
	}
</style>