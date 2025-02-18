<template>
	<view>
		<u-loading-page :loading="loading"></u-loading-page>
		<view class="wrapper">
			<ut-nav title="癌症风险评估" border iconName="close"></ut-nav>
			<view style="padding: 36rpx">
				<view class="flex j-c">
					<view class="h2">{{ title }}</view>
					<view class="rt-text"><text class="cur-num">{{ curIndex + 1 }}</text>/{{ questionCount }}</view>
				</view>
				<view class="sub-tt">请根据实际情况，选择最符合的一项</view>
			</view>
			<view class="ct-content">
				<swiper class="swiper-box relative" :current="curIndex" height="100%">
					<swiper-item v-for="(item, index) in list" @touchmove.stop="catchTouchMove">
						<ChoiceAsk v-show="curIndex === index" :key="item.id" @change="changeAsk"
							:value="valueList[index]" :title="item.content" :askList="item.options" :c-type="item.type">
						</ChoiceAsk>
					</swiper-item>

				</swiper>
				<!-- 		<template v-for="(item, index) in list">
					<ChoiceAsk v-show="curIndex === index" :key="item.id" @change="changeAsk" :value="valueList[index]"
						:title="item.content" :askList="item.options" :c-type="item.type">
					</ChoiceAsk>
				</template> -->
			</view>
			<view class="btm-wrap clearfix">
				<view v-if="curIndex > 0" @click="prev" class="pull-left btn-box btn-def" duration="200" hover-class="def-hover">上一题
				</view>
				<view v-if="curIndex < questionCount - 1" @click="next" class="pull-right btn-box btn-pim"
					hover-class="pim-hover" :class="{ dis: !valueList[curIndex] }">下一题</view>
				<view v-if="curIndex === questionCount - 1" @click="save" class="pull-right btn-box btn-pim"
					:class="{ dis: !valueList[curIndex] }" hover-class="pim-hover">完成测试</view>
			</view>
		</view>
	</view>
</template>
<script>
	import ChoiceAsk from '@/pagesB/components/choice-ask/choice-ask'
	import {
		askList,
		submit
	} from '@/api/cancer-premature-aging'
	export default {
		components: {
			ChoiceAsk
		},
		data() {
			return {
				id: '',
				questionCount: '',
				title: '',
				list: [],
				valueList: [],
				curIndex: 0,
				curValue: '',
				showAsk: false,
				loading: true,
				type: ''
			}
		},
		onLoad(options) {
			const {
				id,
				questionCount,
				title,
				type
			} = options
			this.id = id
			this.questionCount = questionCount
			this.title = title
			this.type = type
			this.getList()
			this.initValue()
		},
		methods: {
			changeAsk(value) {
				const {
					curIndex,
					questionCount
				} = this
				this.$set(this.valueList, curIndex, value)
				if (curIndex < questionCount - 1) {
					setTimeout(() => {
						this.next()
					}, 300)
				}
			},
			catchTouchMove() {
				return
			},
			async getList(isNew) {
				const {
					id
				} = this
				const res = await askList(id)
				if (!res || res.code !== 200) return
				const {
					data
				} = res
				console.log(data);
				this.list = data
				this.loading = false
			},
			initValue() {
				let valueList = []
				for (let i = 0; i < this.questionCount; i++) {
					valueList.push('')
				}
				this.valueList = valueList
				this.showAsk = true
			},
			next() {
				if (!this.valueList[this.curIndex]) {
					return
				}
				this.curIndex++
			},
			prev() {
				this.curIndex--
			},
			async save() {
				const {
					valueList,
					list,
					type,
					id,
					curIndex
				} = this
				if (!valueList[curIndex]) {
					return
				}
				const userAnswer = valueList.map((item, i) => ({
					questionId: list[i].id,
					userAnswer: item
				}))
				const params = {
					paperId: id,
					userAnswer
				}
				const that = this
				uni.showLoading({
					title: '正在加载...',
					mask: true
				})
				const res = await submit(params)
				console.log(res)
				uni.hideLoading()
				if (!res || res.code !== 200) return
				if (type == 'xd') {
					const {
						levelRes
					} = res.data
					const eventChannel = this.getOpenerEventChannel();
					eventChannel.emit('init', levelRes);
					uni.navigateBack()
				} else {
					uni.navigateTo({
						url: '/pagesB/cancer-premature-aging/result/result',
						events: {
							initCs() {
								that.curIndex = 0
								that.initValue()
							}
						},
						success(resq) {
							resq.eventChannel.emit('info', res.data)
						}
					})
				}

			}
		}
	}
</script>

<style scoped lang="scss">
	.h2{
		color: #000;
		font-weight: bold;
	}
	.wrapper {
		display: flex;
		flex-direction: column;
		height: 100vh;
	}

	.rt-text {
		font-size: 28rpx;
		color: #666;
	}

	.sub-tt {
		font-size: 22rpx;
		color: #999;
	}

	.ct-content {
		position: relative;
		flex: 1;
		overflow: hidden;
		margin: 0 32rpx;
		padding: 32rpx 32rpx 100rpx;

		&::before {
			content: '';
			position: absolute;
			z-index: 2;
			top: 0;
			left: 0;
			right: 0;
			bottom: 100rpx;
			background-color: #fff;
			box-shadow: 0rpx 8rpx 20rpx 0rpx rgba(153, 153, 153, 0.1);
			border-radius: 20rpx;
		}

		&::after {
			content: '';
			position: absolute;
			bottom: 60rpx;
			left: 20rpx;
			right: 20rpx;
			height: 100rpx;
			border-radius: 20rpx;
			background-color: #E3EAF6;
			z-index: 1;
		}
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

	.cur-num {
		font-size: 32rpx;
		color: #3B7EFF;
	}

	.pim-hover {
		opacity: .8;
	}

	.relative {
		position: relative;
	}

	.swiper-box {
		height: 100%;
		z-index: 1000;
	}
</style>