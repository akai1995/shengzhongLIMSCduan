<template>
	<view>
		<z-paging ref="paging">
			<template #top>
				<ut-nav title="基因派" iconName="home" back @onBack="onBack" border></ut-nav>
			</template>
			<view class="relative">
				<image class="banner"
					src="https://genepiapi.ypzlfx.com/file/genepi/2023/12/05/gWkWfwnPbMuia420246743916c7bd98cc2922970ddf0_20231205164541A951.png"
					mode="aspectFill"></image>
				<view class="banner-box">
					<view class="bnr-font">结直肠肿瘤风险评估</view>
					<view class="bnr-mfont">填写问卷</view>
				</view>
				<view class="form-block">
					<view class="font-qs">共7题，请根据实际情况作答</view>
					<u--form labelPosition="top" :model="model" :rules="rules" ref="uForm" labelWidth="100%">
						<template v-for="(item, index) in askJson">
							<u-form-item :key="index" :label="item.content" :prop="item.id">
								<ridioDb :value="model[item.id]" @change="changeDb($event, item.id)"
									:options="item.options"></ridioDb>
							</u-form-item>
						</template>
					</u--form>
				</view>
			</view>
			<template #bottom>
				<view class="d-flex js-b-c" style="padding: 60rpx 32rpx;">
					<view class="btn-prev" @click="prev">上一步</view>
					<view class="btn-next" @click="next">提交</view>
				</view>
			</template>
		</z-paging>
	</view>
</template>

<script>
	import {
		askList
	} from '@/api/cancer-premature-aging';
	import {
		screeninguserReg
	} from '@/api/cancer-screening';
	import ridioDb from '../ridio-db/ridio-db.vue'
	import {
		mapGetters,
		mapMutations
	} from 'vuex'
	let eventChannel = null
	export default {
		components: {
			ridioDb
		},
		data() {
			return {
				preModel: {},
				model: {},
				rules: [],
				askJson: []
			};
		},
		onLoad() {
			eventChannel = this.getOpenerEventChannel();
			eventChannel.on('model', (model) => {
				this.preModel = model
				this.getAskList()
			})
		},
		methods: {
			...mapMutations(['SET_CANCER_USER']),
			async getAskList() {
				uni.showLoading({
					title: '加载中',
					mask: true
				})
				const res = await askList('1732233052377104385')
				uni.hideLoading()
				if (!res || res.code !== 200) return
				let model = {}
				let rules = {}
				res.data.forEach(({
					id
				}, index) => {
					model[id] = this.preModel[id] || ''
					rules[id] = [{
						required: true,
						message: '请选择第' + (index + 1) + '题答案',
					}]
				})
				this.model = model
				this.rules = rules
				this.askJson = res.data
			},
			changeDb(event, id) {
				this.model[id] = event
			},
			async submitForm() {
				const {
					preModel,
					model
				} = this
				let evalueAnswer = []
				console.log(model);
				Object.entries(model).forEach(([key, value]) => {
					console.log(key, value);
					evalueAnswer.push({
						questionId: key,
						userAnswer: value
					})
				})
				const params = {
					...preModel,
					paperId: '1732233052377104385',
					evalueAnswer
				}
				uni.showLoading({
					title: '正在提交...',
					mask: true
				})
				const res = await screeninguserReg(params)
				uni.hideLoading()
				console.log(res);
				if (!res || res.code !== 200) return
				this.SET_CANCER_USER(res.data)
				setTimeout(() => {
					uni.redirectTo({
						url: '/pagesC/cancer-screening/result/result'
					})
				}, 500)
			},
			next() {
				let that = this
				this.$refs.uForm.validate().then(res => {
					console.log('验证通过', res);
					if (res) {
						that.submitForm()
					}
				}).catch((err) => {
					console.log(err);
				})
			},
			prev() {
				eventChannel.emit('setModelForm', {
					...this.preModel,
					...this.model
				})
				uni.navigateBack({
					delta: 1
				})
			},
			onBack () {
				console.log();
				uni.redirectTo({
					url: '/pages/index/index'
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.banner {
		position: absolute;
		width: 750rpx;
		left: 0;
		top: 0;
		right: 0;
		height: 380rpx;
	}

	.form-block {
		position: relative;
		margin: 32rpx;
		padding: 32rpx;
		border-radius: 20rpx;
		background-color: #fff;
		z-index: 10;
	}

	.banner-box {
		position: relative;
		z-index: 10;
		padding: 72rpx 74rpx;
	}

	.bnr-font {
		padding-bottom: 14rpx;
		font-size: 48rpx;
		font-family: PangMenZhengDao, PangMenZhengDao;
		font-weight: 400;
		color: #3B7EFF;
		line-height: 56rpx;
	}

	.bnr-mfont {
		width: 402rpx;
		height: 64rpx;
		padding-left: 32rpx;
		line-height: 64rpx;
		font-size: 30rpx;
		font-family: Source Han Sans CN, Source Han Sans CN;
		font-weight: 500;
		color: #3B7EFF;
		background: linear-gradient(90deg, #C5D7FC 0%, rgba(59, 126, 255, 0) 73%);
		border-radius: 60rpx;
	}
</style>