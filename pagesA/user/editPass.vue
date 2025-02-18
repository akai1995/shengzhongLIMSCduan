<template>
	<view>
		<ut-nav title="重置密码" border></ut-nav>
		<view class="content">
			<view class="">
				<u--form labelPosition="left" :model="formData" ref="uForm" labelWidth="150rpx">
					<u-form-item label="手机号" prop="phone" borderBottom>
						<u--input v-model="formData.phone" border="none" placeholder="请输入手机号"></u--input>
					</u-form-item>
					<u-form-item label="密码" prop="pass" borderBottom>
						<u--input v-model="formData.pass" border="none" password placeholder="请输入密码"></u--input>
					</u-form-item>
					<u-form-item label="确认密码" prop="passOk" borderBottom>
						<u--input v-model="formData.passOk" border="none" password placeholder="请输入密码"></u--input>
					</u-form-item>
				</u--form>

				<view class="btn fixed" @click="save">确认</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {getWxInfo,editPassWord} from '@/api/login'
	export default {
		data() {
			const validatePhone = (rule, value, callback) => {
			      if (!value) {
			        callback(new Error('手机号不能为空'))
			      }
			      // 使用正则表达式进行验证手机号码
			      if (!/^1[3456789]\d{9}$/.test(value)) {
			        callback(new Error('手机号格式不正确'))
			      }
			      // 自定义校验规则 需要调用callback()函数！
			      callback()
			    }
			return {
				formData: {
					phone:'',
					pass: '',
					passOk: '',
				},
				rules: {
					phone:[{ required: true, validator: validatePhone, trigger: 'blur' }],
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
							}
						]
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
							this.formData.phone = res.user.telephone
						})
					},
					save() {
						this.$refs.uForm.validate().then(res => {
							let params = {
								phone:this.formData.phone,
								password:this.formData.passOk
							}
							editPassWord(params).then(res=>{
								if(res.code == 200){
									this.$ut.showText('修改成功')
									
									setTimeout(()=>{
										uni.redirectTo({
											url: '/pages/user/user'
										})
									},1500)
									
								}
							})

						})
					},

				}
		}
</script>

<style lang="less">
	page {
		background: #fff;
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
	.fixed{
		position: fixed;
		left: 30rpx;
		right: 30rpx;
		bottom: 90rpx;
	}
</style>