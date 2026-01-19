<template>
	<view>
		<view class="login">
			<view class="title">注册新账号</view>
			<u--form :model="form" class="m-t4" ref="uForm">
				<u-form-item class="form-item" labelWidth="80" label="国家/地区">
					<!-- <u-picker :show="show" :columns="columns"></u-picker> -->
					<view class="list">
						<view>中国+86</view>
						<view><u-icon name="arrow-right" color="#999"></u-icon></view>
					</view>
				</u-form-item>
				<u-form-item class="form-item" labelWidth="60" label="手机号">
					<u-input class="input" type="number" v-model="form.phone" placeholder="请输入账号" />
				</u-form-item>
				<u-form-item label="验证码" labelWidth="60">
					<u-input class="input" type="number" v-model="form.code" placeholder="请输入登录密码" >
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
			<text class="blue" @click="$ut.jump('/sub-pack/project-pages/article-detail/article-detail?type=1&name=基因派平台服务协议')">《基因派平台服务协议》</text>
			<text class="blue" @click="$ut.jump('/sub-pack/project-pages/article-detail/article-detail?type=2&name=知情同意')">《知情同意》</text>
		</view>

		<view class="btn" @click="onSwitch('4')">下一步</view>

		<view class="other grey">
			<text @click="onSwitch('0')">已有账号</text>
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
				columns:['中国'],
				show:false,
				
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
