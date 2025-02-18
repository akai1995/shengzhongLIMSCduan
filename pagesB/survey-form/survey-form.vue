<template>
	<view class="wrapper">
		<ut-nav title="调查表" border></ut-nav>
		<view class="pd-32">
			<view class="h1" style="padding-bottom: 10rpx;">癌症核心知识知晓率调查表</view>
			<view class="blue">{{ mapType[current] }}</view>
		</view>
		<scroll-view class="page-content" scroll-y="true" scroll-with-animation :scroll-into-view="intoview">
			<view class="content" id="contentview">
				<u-form ref="uForm" :rules="rules" :model="model" labelPosition="top" labelWidth="100%">
					<template v-for="(pitem, pindex) in list">
						<template v-if="current === pindex">
							<template v-for="(item, index) in pitem">
								<view :id="'xxxx' + item.id">
									<u-form-item :label="item.content" :prop="item.id">
										<questions :value="model[item.id]" :info="item"
											@change="changeModel($event, item.id)">
										</questions>
									</u-form-item>
								</view>
							</template>
						</template>
					</template>
				</u-form>
				<u-form ref="uFormA" :model="form" :rules="rulesA" labelPosition="left" labelWidth="100%">
					<template v-if="current === 3">
						<view id="gender">
							<u-form-item label="性别:" labelWidth="140rpx" prop="gender" labelPosition="left"
								borderBottom>
								<questions :value="form.gender"
									:info="{ type: '3', options: [ { label: '男', value: '男' }, { label: '女', value: '女' }  ]}"
									@change="changeForm($event, 'gender')">
								</questions>
								<!-- <u-icon slot="right" name="arrow-right"></u-icon> -->
							</u-form-item>
						</view>
						<view id="birth">
							<u-form-item label="出生年月:" labelWidth="140rpx" prop="birth" labelPosition="left"
								borderBottom>
								<questions :value="form.birth" @change="changeForm($event, 'birth')"
									:info="{ type: 'date', placeholder: '请选择出生年月'  }">
								</questions>
								<u-icon slot="right" name="arrow-right"></u-icon>
							</u-form-item>
						</view>
						<view id="nation">
							<u-form-item label="您的民族:" labelWidth="140rpx" prop="nation" labelPosition="left"
								borderBottom>
								<questions :value="form.nation" @change="changeForm($event, 'nation')"
									:info="{ type: 'field', range: dict.type.ethnic_dictionary,  placeholder: '请选择您的民族'  }">
								</questions>
								<u-icon slot="right" name="arrow-right"></u-icon>
							</u-form-item>
						</view>
						<view id="marriage">
							<u-form-item label="婚姻情况:" labelWidth="140rpx" prop="marriage" labelPosition="left"
								borderBottom>
								<questions :value="form.marriage" @change="changeForm($event, 'marriage')"
									:info="{ type: 'field', range: dict.type.sys_marriage,  placeholder: '请选择婚姻情况'  }">
								</questions>
								<u-icon slot="right" name="arrow-right"></u-icon>
							</u-form-item>
						</view>
						<view id="education">
							<u-form-item label="文化程度:" labelWidth="140rpx" prop="education" labelPosition="left"
								borderBottom>
								<questions :value="form.education" @change="changeForm($event, 'education')"
									:info="{ type: 'field', range: dict.type.sys_education,  placeholder: '请选择文化程度'  }">
								</questions>
								<u-icon slot="right" name="arrow-right"></u-icon>
							</u-form-item>
						</view>
						<view id="job">
							<u-form-item label="职业:" labelWidth="140rpx" prop="job" labelPosition="left" borderBottom>
								<questions :value="form.job" @change="changeForm($event, 'job')"
									:info="{ type: 'field', range: dict.type.sys_job, input: 'textarea',  placeholder: '请选择文化程度'  }">
								</questions>
								<u-icon slot="right" name="arrow-right"></u-icon>
							</u-form-item>
						</view>
						<view id="familyNumber">
							<u-form-item label="家庭人口:" labelWidth="140rpx" prop="familyNumber" labelPosition="left"
								borderBottom>
								<view class="flex">
									<questions class="flex1" :value="form.familyNumber"
										@change="changeForm($event, 'familyNumber')"
										:info="{ type: 'input', inputType: 'number',  placeholder: '请填写家庭人口数量'  }">
									</questions>
									<text>人</text>
								</view>
							</u-form-item>
						</view>
						<view id="yearIncome">
							<u-form-item label="家庭年收入:" labelWidth="170rpx" prop="yearIncome" labelPosition="left"
								borderBottom>
								<view class="flex">
									<questions class="flex1" :value="form.yearIncome"
										@change="changeForm($event, 'yearIncome')"
										:info="{ type: 'input', inputType: 'digit', placeholder: '请填写过去一年家庭年收入'  }">
									</questions>
									<text>元</text>
								</view>
							</u-form-item>
						</view>
						<view id="familyCancerHistory">
							<u-form-item label="您的家人中（奶奶爷爷、姥姥姥爷、父母、兄弟姐妹），有人患癌症吗？" labelWidth="100%"
								prop="familyCancerHistory" labelPosition="top" borderBottom>
								<questions class="flex1" :value="form.familyCancerHistory"
									@change="changeForm($event, 'familyCancerHistory')"
									:info="{ type: '3',  options: [ { label: '是', value: '是' }, { label: '否', value: '否' }, { label: '不知道', value: '不知道' }   ]}">
								</questions>
							</u-form-item>
						</view>
						<view id="smokeHistory">
							<u-form-item label="您吸烟吗？" labelWidth="100%" prop="smokeHistory" labelPosition="top"
								borderBottom>
								<questions class="flex1" :value="form.smokeHistory"
									@change="changeForm($event, 'smokeHistory')"
									:info="{ type: '1',  options: smokeHistoryOptions }">
								</questions>
							</u-form-item>
						</view>
						<view v-if="form.smokeHistory == '每天吸'" id="smokePerDay">
							<u-form-item label="每天吸烟:" labelWidth="140rpx" prop="smokePerDay" labelPosition="left"
								borderBottom>
								<view class="flex">
									<questions class="flex1" :value="form.smokePerDay"
										@change="changeForm($event, 'smokePerDay')"
										:info="{ type: 'input', inputType: 'number',  placeholder: '请填写每天吸烟支数'  }">
									</questions>
									<text>支</text>
								</view>
							</u-form-item>
						</view>
						<view v-if="form.smokeHistory == '吸，但不是每天'" id="smokePerWeek">
							<u-form-item label="每周吸烟:" labelWidth="140rpx" prop="smokePerWeek" labelPosition="left"
								borderBottom>
								<view class="flex">
									<questions class="flex1" :value="form.smokePerWeek"
										@change="changeForm($event, 'smokePerWeek')"
										:info="{ type: 'input', inputType: 'number',  placeholder: '请填写每天吸烟支数'  }">
									</questions>
									<text>支</text>
								</view>
							</u-form-item>
						</view>
						<view id="height">
							<u-form-item label="身高:" labelWidth="140rpx" prop="height" labelPosition="left"
								borderBottom>
								<view class="flex">
									<questions class="flex1" :value="form.height" @change="changeForm($event, 'height')"
										:info="{ type: 'input', inputType: 'number',  placeholder: '请填写您的身高'  }">
									</questions>
									<text>厘米</text>
								</view>
							</u-form-item>
						</view>
						<view id="weight">
							<u-form-item label="体重:" labelWidth="140rpx" prop="weight" labelPosition="left"
								borderBottom>
								<view class="flex">
									<questions class="flex1" :value="form.weight" @change="changeForm($event, 'weight')"
										:info="{ type: 'input', inputType: 'digit',  placeholder: '请填写您的体重'  }">
									</questions>
									<text>公斤</text>
								</view>
							</u-form-item>
						</view>
						<view id="residence">
							<u-form-item label="您的户口类型是？" labelWidth="100%" prop="residence" labelPosition="top"
								borderBottom>
								<questions class="flex1" :value="form.residence"
									@change="changeForm($event, 'residence')"
									:info="{ type: '3',  options: [ { label: '农业户口', value: '农业户口' }, { label: '非农业户口/城镇户口', value: '非农业户口/城镇户口' } ]}">
								</questions>
							</u-form-item>
						</view>
						<view id="healthyStatus">
							<u-form-item label="在过去一年里，您认为自己的健康状况？" labelWidth="100%" prop="healthyStatus"
								labelPosition="top" borderBottom>
								<questions class="flex1" :value="form.healthyStatus"
									@change="changeForm($event, 'healthyStatus')"
									:info="{ type: '1',  options: healthyOptions }">
								</questions>
							</u-form-item>
						</view>
					</template>
				</u-form>
			</view>
		</scroll-view>
		<view v-if="!msg" class="btm-wrap clearfix">
			<view v-if="current > 0" @click="prev" class="pull-left btn-box btn-def" duration="200"
				hover-class="def-hover">上一步
			</view>
			<view v-if="current < 3" @click="next" class="pull-right btn-box btn-pim" hover-class="pim-hover">下一步</view>
			<view v-if="current == 3" @click="save" class="pull-right btn-box btn-pim" hover-class="pim-hover">提交问卷
			</view>
		</view>
	</view>
</template>

<script>
	import questions from '@/pagesB/components/questions/questions.vue';
	import {
		getCancerCoreSurvey,
		submitCancerCoreResult
	} from '@/api/questions';
	import {
		mapGetters
	} from 'vuex'
	export default {
		dicts: ['ethnic_dictionary', 'sys_marriage', 'sys_education', 'sys_job'],
		components: {
			questions
		},
		data() {
			return {
				msg: false,
				isFilled: false,
				intoview: '',
				list: [
					[],
					[],
					[]
				],
				current: 0,
				model: {

				},
				form: {
					gender: '',
					birth: '',
					nation: '',
					marriage: '',
					education: '',
					job: '',
					familyNumber: '',
					yearIncome: '',
					familyCancerHistory: '',
					smokeHistory: '',
					smokePerDay: '',
					smokePerWeek: '',
					height: '',
					weight: '',
					residence: '',
					healthyStatus: '',
				},
				rules: {

				},
				mapType: ['判断题', '单选题', '多选题', '基本情况'],
				rulesA: {
					gender: [{
						type: 'string',
						required: true,
						message: '请选择性别'
					}],
					birth: [{
						type: 'string',
						required: true,
						message: '请选择出生年月'
					}],
					nation: [{
						type: 'string',
						required: true,
						message: '请选择婚姻情况'
					}],
					marriage: [{
						type: 'string',
						required: true,
						message: '请选择您的民族'
					}],
					education: [{
						type: 'string',
						required: true,
						message: '请选择文化程度'
					}],
					job: [{
						type: 'string',
						required: true,
						message: '请选择职业'
					}],
					familyNumber: [{
						type: 'number',
						required: true,
						message: '请填写家庭人口数'
					}],
					yearIncome: [{
						type: 'number',
						required: true,
						message: '请填写家庭年收入'
					}],
					familyCancerHistory: [{
						type: 'string',
						required: true,
						message: '请填写家庭患癌史'
					}],
					smokeHistory: [{
						type: 'string',
						required: true,
						message: '吸烟使'
					}],
					smokePerDay: [{
						type: 'number',
						required: true,
						message: '每天吸烟支数'
					}],
					smokePerWeek: [{
						type: 'number',
						required: true,
						message: '每周吸烟支数'
					}],
					height: [{
						type: 'number',
						required: true,
						message: '请填写身高'
					}],
					weight: [{
						type: 'number',
						required: true,
						message: '请填写体重'
					}],
					residence: [{
						type: 'string',
						required: true,
						message: '请选择户口类型'
					}],
					healthyStatus: [{
						type: 'string',
						required: true,
						message: '请选择健康状况'
					}],
				},
				healthyOptions: [{
						label: '好',
						value: '好'
					},
					{
						label: '比较好',
						value: '比较好'
					},
					{
						label: '一般',
						value: '一般'
					}, {
						label: '比较差',
						value: '比较差'
					}, {
						label: '差',
						value: '差'
					}
				],
				smokeHistoryOptions: [{
						label: '每天吸',
						value: '每天吸'
					},
					{
						label: '吸，但不是每天',
						value: '吸，但不是每天'
					},
					{
						label: '以前吸，但现在不吸',
						value: '以前吸，但现在不吸'
					},
					{
						label: '从不吸',
						value: '从不吸'
					},
				]
			};
		},
		computed: {
			...mapGetters(['token'])
		},
		watch: {
			isFilled: function(ov) {
				if (ov) {
					uni.redirectTo({
						url: '/pagesB/success/success'
					})
				}
			},
			token: function(ov) {
				if (ov) {
					this.getList()
				}
			}
		},
		onLoad() {
			this.getList()
		},
		methods: {
			prev() {
				this.current--
				this.scrollToView()
			},
			scrollToView(str = 'contentview', time = 400) {
				this.intoview = ''
				setTimeout(() => {
					this.intoview = str
				}, time)
			},
			next() {
				this.$refs.uForm.validate().then(res => {
					if (res) {
						this.current++
						this.scrollToView()
					}
				}).catch(err => {
					this.scrollToView('xxxx' + err[0].field)
				})
			},
			save() {
				this.$refs.uFormA.validate().then(res => {
					if (res) {
						this.submitFrom()
					}
				}).catch(err => {
					this.scrollToView(err[0].field)
				})
				console.log(this.form);
			},
			async submitFrom() {
				const {
					form,
					model
				} = this
				let userAnswer = []
				Object.entries(model).forEach(([key, value]) => {
					userAnswer.push({
						questionId: key,
						userAnswer: value
					})
				})
				const params = {
					cancerCorePerson: {
						...form
					},
					userAnswer
				}
				uni.showLoading({
					title: '提交中...',
					mask: true
				})
				const res = await submitCancerCoreResult(params)
				uni.hideLoading()
				if (!res || res.code !== 200) return
				uni.redirectTo({
					url: '/pagesB/success/success'
				})
			},
			changeModel(event, id) {
				this.model[id] = event
			},
			changeForm(event, id) {
				// this.form[id] = event
				this.$set(this.form, id, event)
			},
			async getList() {
				const res = await getCancerCoreSurvey()
				if (!res || res.code !== 200) return
				const {
					judgement,
					single,
					multiple,
					isFilled
				} = res.data
				if (isFilled) {
					this.isFilled = isFilled
					return
				}
				let judgementRules = {}
				this.list = [judgement.map(item => ({
					...item,
					type: '3'
				})), single, multiple]

				let rules = {}
				let model = {}
				const arr = [...judgement, ...single, ...multiple]
				arr.forEach(({
					id,
					sort
				}, index) => {
					rules[id] = [{
						type: 'string',
						required: true,
						message: '请选择第' + sort + '题答案'
					}]
					model[id] = ''
				})
				this.model = model
				this.rules = rules
			}
		}
	}
</script>

<style lang="scss" scoped>
	.pd-32 {
		padding: 32rpx;
	}

	.wrapper {
		display: flex;
		flex-direction: column;
		height: 100vh;
		background-color: #fff;
	}

	.page-content {
		flex: 1;
		overflow: hidden;
	}

	.btm-wrap {
		padding: 32rpx 32rpx 80rpx;
	}

	.btn-box {
		width: 320rpx;
		height: 78rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 36rpx;
		border-width: 1rpx;
		border-style: solid;
		border-radius: 80rpx 80rpx 80rpx 80rpx;
	}

	.btn-def {
		color: #666;
		border-color: rgba(0, 0, 0, .1);
	}

	.def-hover {
		background-color: #f4f4f4;
	}

	.btn-pim {
		color: #fff;
		background: linear-gradient(135deg, #00DEFF 0%, #0C5FFF 100%);
		border-width: 0;

		&.dis {
			background: #999;
		}
	}

	/deep/.u-textarea--disabled {
		background-color: #fff !important;
	}

	/deep/.u-textarea {
		padding: 0 !important;
	}
</style>