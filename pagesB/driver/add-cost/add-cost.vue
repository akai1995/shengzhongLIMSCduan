<template>
	<view class="wrapper">
		<ut-nav title="样本物流"></ut-nav>
		<view class="content">
			<u--form :model="form" ref="uForm" :rules="rules" labelWidth="180rpx">
				<u-form-item label="交通方式" prop="gender">
					<u-radio-group class="radio-block" v-model="form.transType" activeColor="#3B7EFF" labelSize="28rpx"
						labelColor="#333" placement="row">
						<template v-for="(item, index) in dict.type.traffic_way">
							<u-radio shape="circle" :customStyle="{marginRight: '30rpx'}" :key="index"
								:label="item.label" :name="item.value"></u-radio>
						</template>
					</u-radio-group>
				</u-form-item>
				<view v-if="form.transType == '1'" class="base-block" style="margin: 32rpx;">
					<u-form-item required label="油费" prop="oilFee">
						<u--input v-model="form.oilFee" placeholder="请输入油费" type="digit" border="none"></u--input>
						<text slot="right">元</text>
					</u-form-item>
					<u-form-item label="高速费" prop="toll">
						<u--input v-model="form.toll" placeholder="请输入高速过路费" type="digit" border="none"></u--input>
						<text slot="right">元</text>
					</u-form-item>
				</view>
				<view v-if="form.transType == '2'" class="base-block" style="margin: 32rpx;">
					<u-form-item required label="高铁费" prop="hightwayFee">
						<u--input v-model="form.hightwayFee" placeholder="请输入高铁费" type="digit" border="none"></u--input>
						<text slot="right">元</text>
					</u-form-item>
					<u-form-item label="打车费" prop="taxiFee">
						<u--input v-model="form.taxiFee" placeholder="请输入打车费" type="digit" border="none"></u--input>
						<text slot="right">元</text>
					</u-form-item>
				</view>
				<view class="">总费用：<text class="base-font-color">{{ allCost || 0 }}元</text> </view>
			</u--form>
			<view class="btm-wrap safe-area-inset-bottom" style="padding-top: 100rpx;">
				<view @click="save" class="btn-bim">保存</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		fillFee,
		getByOrgIdAndType
	} from '@/api/order';

	export default {
		dicts: ['traffic_way'],
		data() {
			return {
				id: '',
				form: {
					transType: '2',
					oilFee: '',
					toll: '',
					hightwayFee: '',
					subwayFee: '',
					busFee: '',
				},
				orgid: '',
				rules: {
					oilFee: {
						type: Number,
						required: true,
						message: '请输入邮费',
					},
					hightwayFee: {
						type: Number,
						required: true,
						message: '请输入高铁费',
					},


				}
			};
		},
		watch: {
			'form.transType': {
				handler: function() {
					this.initFee()
				}
			}
		},
		computed: {
			allCost() {
				const {
					transType,
					oilFee,
					toll,
					hightwayFee,
					taxiFee
				} = this.form
				if (transType === '1') {
					return +oilFee + +toll
				} else {
					return +hightwayFee + +taxiFee
				}

			}
		},
		onLoad(options) {
			this.id = options.id
			this.orgid = options.orgid
			this.initFee()
		},
		methods: {
			save() {
				this.$refs.uForm.validate().then(res => {
					this.submit()
				}).catch(errors => {
					uni.$u.toast('校验失败')
				})
				console.log(this.form);
			},
			async initFee() {
				const params = {
					orgId: this.orgid,
					transType: this.form.transType
				}
				const res = await getByOrgIdAndType(params)
				console.log(res);
				this.form = {
					...this.form,
					...res.data.feeDetail
				}
			},
			async submit() {
				const params = {
					feedetail: {
						...this.form
					},
					id: this.id,
					transType: this.form.transType
				}
				uni.showLoading({
					title: '提交中...',
					mask: true
				})
				const res = await fillFee(params)
				uni.hideLoading()
				uni.showToast({
					title: '保存成功'
				})
				this.getOpenerEventChannel().emit('someEvent')
				setTimeout(() => {
					uni.navigateBack({
						delta: 1
					})
				}, 2000)
			}
		}
	}
</script>

<style lang="scss">

</style>