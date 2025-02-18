<template>
	<view>
		<ut-nav title="报告自助查询" border></ut-nav>

		<view class="form">
			<u--form :model="form"  ref="uForm" >
				<u-form-item label="申请编码" labelWidth="150rpx" borderBottom prop="fdApplyCode">
					<u-input class="input" v-model="form.fdApplyCode" placeholder="请输入" />
				</u-form-item>
				<!-- <u-form-item label="身份证号" labelWidth="150rpx" borderBottom prop="fdIdcard">
					<u-input class="input" v-model="form.fdIdcard" type="idcard" placeholder="请输入" />
				</u-form-item>
				<u-form-item label="姓名" labelWidth="150rpx" borderBottom prop="fdName">
					<u-input class="input" v-model="form.fdName" placeholder="请输入" />
				</u-form-item>
				<u-form-item label="联系电话" labelWidth="150rpx" borderBottom prop="tel">
					<u-input class="input" v-model="form.tel" type="number" placeholder="请输入" />
				</u-form-item> -->
			</u--form>
			<view class="clause m-t4">
				<u-checkbox-group class="check" v-model="checked">
					<u-checkbox name="ok" shape="circle" activeColor="#3B7EFFFF"></u-checkbox>
				</u-checkbox-group>
				<view class="text">
					<text class="grey">我确认所提交的信息准确无误，并同意将基因检测报告单进行上传，详情阅读</text>
					<text class="blue" @click="jump()">《报告单查询知情同意书》</text>
					<text class="grey">并签字。</text>
				</view>
			</view>

			<view class="btn m-t4" @click="submit()">查询</view>
		</view>
		<u-toast ref="uToast"></u-toast>
	</view>
</template>

<script>
	import {
		selectPersonalDetails,
		selectApplyCode
	} from '@/api/report.js'
	export default {
		data() {
			return {
				form: {
					fdApplyCode:'',
					// fdIdcard:'',
					// fdName:'',
					// tel:'',
					port:2
				},
				rules: {
					fdApplyCode: [{
						required: true,
						message: '请输入申请编码',
						trigger: ['change', 'blur'],
					}],
					// fdIdcard: [{
					// 	required: true,
					// 	message: '请输入身份证号',
					// 	trigger: ['change', 'blur'],
					// }],
					// fdName: [{
					// 	required: true,
					// 	message: '请输入姓名',
					// 	trigger: ['change', 'blur'],
					// }],
					// tel: [{
					// 	required: true,
					// 	message: '请输入联系电话',
					// 	trigger: ['change', 'blur'],
					// }],
				},
				checked: [],
			};
		},
		onLoad(params) {
			// this.init(params.id)
		},
		
		methods: {
			// init(id) {
			// 	selectPersonalDetails(id).then(res => {
			// 		if (res.code == 200) {
			// 			this.form = res.data
			// 			// this.form.fdApplyCode = res.data.fdApplyCode
			// 			// this.form.fdIdcard = res.data.fdIdcard
			// 			// this.form.fdName = res.data.fdName
			// 			// this.form.tel = res.data.tel
			// 		}
			// 	})
			// },
			submit() {
				this.$refs.uForm.validate().then(res => {
					if (this.checked.length == 0) {
						uni.showToast({
							title: '请先阅读并勾选协议',
							icon: 'none'
						});
					} else {
						selectApplyCode(this.form.fdApplyCode).then(res=>{
							if(res.code == 200){
								uni.navigateTo({
									url: '/pagesB/report/agreeBook?id=' + res.data.id
								})
							}else{
								this.$ut.showText(res.msg)
							}
						})
					}
				}).catch(err => {
					console.log('err', err)
				})
			},
			jump() {
				let params = encodeURIComponent(JSON.stringify(this.form))
				// console.log('form',this.form)
				uni.navigateTo({
					url: '/pagesB/report/agreeBook?id=' + this.form.fdApplyCode
				})
			}
		},
		onReady() {
				//onReady 为uni-app支持的生命周期之一
		    	this.$refs.uForm.setRules(this.rules)
		},
	}
</script>

<style lang="less">
	page {
		background: #fff;
	}

	.form {
		padding: 30rpx;
		box-sizing: border-box;
	}

	.input {
		border: none;
	}

	.clause {
		display: flex;
		align-items: flex-start;
		justify-content: center;
		font-size: 24rpx;

		.check {
			width: 8%;
		}

		.text {
			width: 92%;
		}
	}

	.btn {
		width: 100%;
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
</style>