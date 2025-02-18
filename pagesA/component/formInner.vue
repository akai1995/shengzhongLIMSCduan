<template>
	<view >
		<view class="u-form">
			<u--form labelPosition="left" :model="form" labelWidth="150rpx" ref='form' :rules="rules" >
				<u-form-item label="医院" prop="hospitalName" borderBottom @click="test" required>
					<u--input v-model="form.hospitalName" required readonly border="none"
						placeholder="请选择"></u--input>
					<!-- <u-icon slot="right" name="arrow-right"></u-icon> -->
					<block>
						<u-picker :immediateChange="true" :show="hospitalShow" :columns="hospitalList" keyName="label" closeOnClickOverlay @confirm="hospitalOk"
							@cancel="hospitalShow = false" @close="hospitalShow = false"></u-picker>
					</block>
				</u-form-item>
				<u-form-item label="患者类型" prop="type" borderBottom @click="show = true" required>
					<u--input v-model="form.type" required readonly border="none"
						placeholder="请选择"></u--input>
					<u-icon slot="right" name="arrow-right"></u-icon>
					<u-picker :show="show" :columns="relation" closeOnClickOverlay @confirm="confirm"
						@cancel="show = false" @close="show = false"></u-picker>
				</u-form-item>
				<u-form-item label="门诊号" prop="fdPatientNo" borderBottom>
					<u--input v-model="form.fdPatientNo" border="none" placeholder="请输入"></u--input>
				</u-form-item>
				<u-form-item label="病理号" prop="fdHospital" >
					<u--input v-model="form.fdHospital" border="none" placeholder="请输入"></u--input>
				</u-form-item>
			</u--form>
		</view>
		
		<view class="out m-t3">注：平台严格保密您的个人信息</view>
		
		<view class="btn-box m-t3">
			<view class="btn bg1" @click="next(0)">上一步</view>
			<view class="btn bg2" @click="next(2)">下一步</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				orgShow:false,
				show:false,
				hospitalShow:false,
				form:{
					orgId:'12530000431201824Q',
					hospitalName:'云南省肿瘤医院',
					type:'',
					fdPatientNo:'',
					fdHospital:'',
				},
				rules:{
						'type':{
							type: 'string',
							required: true,
							message: '请选择患者类型',
							trigger: ['blur', 'change']
					},
					'hospitalName':{
							type: 'string',
							required: true,
							message: '请选择医院',
							trigger: ['blur', 'change']
						},
				},
				relation:[['门诊患者', '住院患者']],
				hospitalList:[[{label:'云南省肿瘤医院',id:'12530000431201824Q'}/* ,{label:'红河州第三人民医院',id:'12532500G86417697A'} */]]
				
			}
		},
		watch:{
			'form.orgId'(newVal,oldVal){
				if(newVal){
					console.log('orgId-')
					if(newVal == '12530000431201824Q'){
						this.form.hospitalName = '云南省肿瘤医院'
					}else if(newVal == '12532500G86417697A'){
						this.form.hospitalName = '红河州第三人民医院'
					}
				}
			}
		},
		onReady() {
			//onReady 为uni-app支持的生命周期之一
			this.$refs.form.setRules(this.rules)
		},
	methods: {
		test () {
			console.log('点击')
			this.hospitalShow = true
		},
			next(e){
				if(e===2){
					this.$refs.form.validate().then(valid => {
					  if (valid) {
					    console.log("表单验证通过");
					    this.$emit('next',e,this.form)
					  } else {
					    console.log("表单验证不通过");
					  }
					}).catch(error => {
					  console.log("表单验证出错");
					  console.log(error);
					});
				} else {
					this.$emit('next',e,this.form)
				}
				// console.log(this.form,"from")
				// this.$emit('next',e,this.form)
			},
			
			confirm(e) {
				this.form.type = e.value[0]
				this.$refs.form.validateField('type')
				this.show = false
			},
			hospitalOk(e){
				this.form.hospitalName = e.value[0].label
				this.form.orgId = e.value[0].id
				this.$refs.form.validateField('hospitalName')
				this.hospitalShow = false
			}
		}
	}
</script>

<style scoped lang="scss">
	.u-form{
		padding: 30rpx;
		box-sizing: border-box;
		background: #fff;
		border-radius: 20rpx;
	}
	.out{
		color: #FF5252FF;
		font-size: 28rpx;
	}
	.btn-box{
		width: 100%;
		height: 80rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		.btn{
			width: 320rpx;
			height: 100%;
			display: flex;
			align-items: center;
			justify-content: center;
			border-radius: 80rpx;
			font-size: 36rpx;
		}
	}
	
	.bg1{
		color: #3B7EFFFF;
		background: rgba(55, 115, 255, 0.1);
	}
	.bg2{
		color: #fff;
		background: linear-gradient(135deg, #00DEFF 0%, #0C5FFF 100%);
	}
</style>