<template>
	<view>
		<ut-nav title="修改登录密码" border></ut-nav>
		<u-navbar title="修改登录密码" :placeholder="true" border  v-if="false">
			<view class="u-nav-slot" slot="left">
				<u-icon name="arrow-left" @click="onBack" size="19"></u-icon>
				<u-line direction="column" :hairline="false" length="16" margin="0 8px"></u-line>
				<u-icon name="home" size="20" @click="onHome"></u-icon>
			</view>
		</u-navbar>
		
		<view class="content" v-show="sequence == '1'">
			<view class="tips" style="color: #5178FF;">设置新密码，不能与旧密码相同</view>
			<view class="m-t3">
				<u--form labelPosition="left" :model="formData" ref="uForm"  labelWidth="150rpx">
					<u-form-item label="手机号" prop="phone"  borderBottom>
						<u--input v-model="phone" border="none" readonly placeholder="请输入手机号"></u--input>
					</u-form-item>
					<u-form-item label="验证码" prop="code" disabled borderBottom>
						<u-input v-model="formData.code" border="none" maxlength="6" placeholder="请输入验证码">
							<template slot="suffix">
								<u-button v-if="isShow" type="primary" size="mini" :plain="true" text="发送验证码"
									@click="sendCode"></u-button>
								<view class="code" v-if="!isShow">{{count}} 秒后重新发送</view>
							</template>
						</u-input>
					</u-form-item>
					<u-form-item label="密码" prop="pass" borderBottom>
						<u-input v-model="formData.pass" border="none" clearable :password="isEye" placeholder="请输入密码">
							<template slot="suffix">
								<view v-if="formData.pass.length>0" @click="isEye = !isEye">
									<u-icon v-if="isEye" name="eye-fill"></u-icon>
									<u-icon v-else name="eye"></u-icon>
								</view>
							</template>
						</u-input>
					</u-form-item>
					<u-form-item label="确认新密码" prop="passOk" borderBottom>
						<u-input v-model="formData.passOk" border="none" clearable :password="isEye1"
							placeholder="请再次输入新密码">
							<template slot="suffix">
								<view v-if="formData.passOk.length > 0" @click="isEye1 = !isEye1">
									<u-icon v-if="isEye1" name="eye-fill"></u-icon>
									<u-icon v-else name="eye"></u-icon>
								</view>
							</template>
						</u-input>
					</u-form-item>
				</u--form>
				<view class="btn m-t6" @click="confirm">确定</view>
			</view>
		</view>
		<view class="content" v-if="sequence == '2'">
			<view class="icon-box">
				<view class="icon">
					<u-icon name="checkbox-mark" color="#fff" size="120rpx"></u-icon>
				</view>
			</view class='fontContent'>
			<view class="subTip">
				<text>密码修改成功</text>
			</view>
			<view class="m-t3">
				<ut-official></ut-official>
			</view>
			<view class="btn-back m-t6" @click="onHome">返回用户中心</view>
		</view>
	</view>
</template>

<script>
	import {
		getWxInfo,
		editPassWord
	} from '@/api/login'
	import {
		sendPwdChageCode,
		resetpwd
	} from "@/api/system/user.js"
	export default {
		data() {
			return {
				sequence: '1',
				phone: '',
				isShow: true,
				count: "",
				timer: null,
				formData: {
					pass: '',
					passOk: '',
					code: '',
				},
				isEye: true,
				isEye1: true,
				rules: {
					code:[{required: true,message: '请输入验证码',trigger: 'blur'}],
					pass: [{
							required: true,
							message: '请输入密码',
							trigger: 'blur',
						},
						{
							min: 6,
							message: '密码长度不能低于6位',
							trigger: 'blur'
						}
					],
					passOk: [{
						required: true,
						message: '请输入密码',
						trigger: 'blur',
					}, {
						asyncValidator: (rules, value, callback) => {
							if (value != this.formData.pass) {
								callback(new Error('两次密码校验不一致'))
							}
						},
						message: '两次密码校验不一致',
						trigger: 'blur',
					}]
				}
			}
		},
		onLoad() {
			this.getPersonalInfo()
		},
		onReady() {
			//onReady 为uni-app支持的生命周期之一
			this.$refs.uForm.setRules(this.rules)
		},
		methods: {
			getPersonalInfo() {
				let id = this.$store.getters.userId;
				getWxInfo(id).then(res => {
					this.phone = res.user.telephone
				})
			},
			sendCode() {
				let num = 60;
				sendPwdChageCode(this.phone).then((res) => {
					if (res.code == 200) {
						if (!this.timer) {
							this.count = num;
							this.isShow = false;
							this.timer = setInterval(() => {
								if (this.count > 0 && this.count <= num) {
									this.count--;
								} else {
									this.isShow = true;
									clearInterval(this.timer);
									this.timer = null;
								}
							}, 1000);
						}
					}
				});
			},
			onBack () {
				uni.navigateBack({
					delta: 1
				})
			},
			onHome () {
				uni.redirectTo({
					url: '/pagesC/doctor-index/doctor-index'
				})
			},
			next() {
				this.sequence++
			},
			confirm() {
				this.$refs.uForm.validate().then(res => {
					let params = {
						code:this.formData.code,
						phone:this.phone,
						pwd:this.formData.passOk
					}
					resetpwd(params).then(res=>{
						if(res.code == 200){
							this.$ut.showText('修改成功')
							this.sequence++
							// setTimeout(()=>{
							// 	uni.redirectTo({
							// 		url: '/pages/user/user'
							// 	})
							// },1500)
						}else if(res.code == 500){
							this.sequence--
						}
					})
				
				})
			}
		}
	}
</script>

<style lang="less">
	page {
		background: #fff;
	}

	.u-nav-slot {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		border-width: 1rpx;
		border-radius: 200rpx;
		border-color: #dadbde;
		padding: 6rpx 14rpx;
		opacity: 0.8;
	}

	.tips {
		font-size: 24rpx;
		color: #000;
		line-height: 1.5;
	}

	.code-box {
		width: 100%;
		height: 110rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		border-top: 1rpx solid #0000001A;
		border-bottom: 1rpx solid #0000001A;
		font-size: 30rpx;
		color: #000;

		.code {
			font-size: 24rpx;
			color: #000;
		}
	}

	.btn {
		height: 80rpx;
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

	.back {
		background: rgba(81, 120, 255, 0.5) !important;
	}

	.icon-box {
		display: flex;
		align-items: center;
		justify-content: center;
		margin-top: 70rpx;

		.icon {
			width: 160rpx;
			height: 160rpx;
			background: #00C777;
			border-radius: 50%;
			display: flex;
			align-items: center;
			justify-content: center;
		}
	}

	.fontContent {
		// width: 658rpx;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	.subTip {
		font-size: 36rpx;
		font-weight: 600;
		letter-spacing: 2rpx;
		line-height: 42rpx;
		color: #000;
		display: flex;
		justify-content: center;
		align-items: center;
		margin-top: 32rpx;
	}

	.btn-back {
		width: 100%;
		height: 80rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		border: 1rpx solid #5178FFFF;
		border-radius: 80rpx;
		color: #0C5FFF;
		font-size: 36rpx;
		font-weight: bold;
		letter-spacing: 2rpx;
	}
</style>