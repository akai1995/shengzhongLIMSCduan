<template>
	<view>
		<view class="login">
			<view class="title">短信登录</view>
			<u--form :model="form" ref="uForm">
				<u-form-item class="form-item" labelWidth="60" label="手机号">
					<u-input class="input" v-model="form.phone" maxlength='11' type="number" placeholder="请输入账号" />
				</u-form-item>
				<u-form-item label="验证码" labelWidth="60">
					<u-input class="input" v-model="form.code" type="number" placeholder="请输入登录密码" >
						<template slot="suffix">
							<u-tag text="发送验证码" plain size="mini"></u-tag>
						</template>
					</u-input>
				</u-form-item>
			</u--form>
		</view>
		<view class="clause">
			<u-checkbox-group v-model="checked">
				<u-checkbox name="ok" shape="circle" activeColor="#3B7EFFFF"></u-checkbox>
			</u-checkbox-group>
			<text class="grey">已仔细阅读并同意</text>
			<text class="blue">《基因派平台服务协议》</text>
			<text class="blue">《知情同意》</text>
		</view>

		<view class="btn">登录</view>

		<view class="other grey">
			<text @click="onSwitch('0')">微信登录</text>
			<text class="silod" @click="onSwitch('3')">注册新账号</text>
			<text @click="onSwitch('1')">账号登录</text>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				form:{
					phone:'',
					code:''
				},
				checked: []
			};
		},
		methods: {
			onSwitch(val) {
				this.$emit('onSwitch', val)
			}
		}
	}
</script>

<style lang="less">
	.login {
		width: 90%;
		min-height: 270rpx;
		background: #fff;
		border-radius: 20rpx;
		margin: auto;
		margin-top: -140rpx;
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
		margin-top: 20rpx;
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
		border: none !important;
	}
	.tag{
		color: #3B7EFFFF;
		font-size: 28rpx;
	}
</style>
