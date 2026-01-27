<template>
	<view>
		<view class="login">
			<view class="title">请设置账号信息</view>
			<u--form :model="form" class="m-t4" ref="uForm">
				<u-form-item class="form-item" labelWidth="80" label="名称">
					<u-input class="input" v-model="form.name" placeholder="请输入名称，建议使用姓名" />
				</u-form-item>
				<u-form-item class="form-item" labelWidth="80" label="登录密码">
					<u-input class="input" v-model="form.pass" placeholder="8-12位，数字字母组成" />
				</u-form-item>
				<u-form-item label="再次确认" labelWidth="80">
					<u-input class="input" v-model="form.passok" placeholder="请再次输入登录密码" />
				</u-form-item>
			</u--form>
		</view>
		<view class="btn" @click="onSwitch('0')">完成</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				form:{
					name:'',
					pass:'',
					passok:''
				},
				columns:['中国'],
				show:false,
				
				checked: ''
			};
		},
		methods: {
			onSwitch(val) {
				this.$emit('onSwitch', val)
			}
		}
	}
</script>

<style lang="scss">
	.login {
		width: 90%;
		min-height: 270rpx;
		background: #fff;
		border-radius: 20rpx;
		margin: auto;
		margin-top: -120rpx;
		position: relative;
		z-index: 1;
		padding: 40rpx 40rpx 20rpx 40rpx;
		box-sizing: border-box;

		.title {
			font-size: 48rpx;
			font-weight: bold;
			letter-spacing: 2rpx;
		}

	}

	.clause {
		margin: 24rpx 0 32rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 24rpx;
	}

	.other {
		margin-top: 40rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 24rpx;

		text {
			margin: 0 40rpx;
		}

		.silod {
			padding: 0 39rpx;
			margin: 0;
			box-sizing: border-box;
			border-left: 1rpx solid #D9D9D9FF;
			border-right: 1rpx solid #D9D9D9FF;
		}
	}

	.btn {
		margin: auto;
		margin-top: 40rpx;
		width: 600rpx;
		height: 80rpx;
		background: linear-gradient(135deg, #00DEFF 0%, #0C5FFF 100%);
		border-radius: 80rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		color: #fff;
		font-size: 36rpx;
		font-weight: bold;
		letter-spacing: 2rpx;
	}
	
	.form-item{
		border-bottom: 1rpx solid #DADADAFF;
	}
	.input{
		border: none;
	}
	.tag{
		color: #3B7EFFFF;
		font-size: 28rpx;
	}
	
	.list{
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
</style>
