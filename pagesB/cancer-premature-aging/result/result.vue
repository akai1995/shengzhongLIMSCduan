<template>
	<view>
		<view class="wrapper">
			<u-navbar title="测试结果" @leftClick="leftClick" :bgColor="bgColor" :leftIconColor="leftIconColor"  :placeholder="true" :border="border">
			</u-navbar>
			<scroll-view class="page-content" scroll-y scroll-with-animation>
				<view class="relative" style="padding-bottom: 70rpx;">
					<u-image width="100%" height="304rpx"
						src="https://genepiapi.ypzlfx.com/file/genepi/2023/11/14/Group 802_20231114171410A314.png"></u-image>
					<view class="banner-text">
						<view class="wccs-txt">你已完成测试！</view>
						<view @click="show = true" class="flex"><u-image width="28rpx" height="28rpx"
								src="@/static/images/lint_icon.png"></u-image>
							<view class="br-text">此测试结果仅供参考，不能代替医生诊断></view>
						</view>
					</view>
					<view class="slt-content" style="margin: -108rpx 32rpx 0;">
						<view class="h1">测试结果</view>
						<view class="flex j-c" style="padding: 20rpx 0;">
							<template v-for="(item, index) in dataInfo.levelRes">
								<view v-if="item.match" class="sg-vl">{{ item.label }}</view>
							</template>
							<view @click="resetCs" class="btn-dft-cl flex j-c-c">重新测试</view>
						</view>
						<!-- <view class="p sub-text">根据《居民常见恶性肿瘤筛查和预防推荐》的建议，你属于“肺癌高风险人群”。</view> -->
						<view class="h2">【筛查建议】</view>
						<view class="p">
							<text decode>{{ dataInfo.suggest }}</text>
						</view>
						<view class="h2" style="padding-top: 20rpx;">【预防建议】</view>
						<view class="p">
							<text decode>{{ dataInfo.preventSuggest }}</text>
						</view>
					</view>
					<view class="slt-content" style="margin: 32rpx;">
						<view class="h2">本篇内容对您有帮助吗?</view>
						<view class="bz-wrap">
							<template v-for="(item, index) in bzList">
								<view @click="changeBz(item.value)" class="bz-item" :key="item.value">
									<u-image width="36rpx" height="36rpx"
										:src="item.value === bzValue ? item.icon1 : item.icon"></u-image>
									<view class="itm-text" :class="{ 'active': item.value === bzValue }">
										{{ item.label }}</view>
								</view>
							</template>
						</view>
					</view>
				</view>
			</scroll-view>
		</view>
		<u-popup :show="show" mode="bottom">
			<view class="pop-wrap">
				<view class="h1 pd-tit">温馨提示</view>
				<view class="p">
					由于疾病临床表现复杂多样，在个体上存在较大的差异，而本测试所涉及题目范围有限。因此，本测试仅用于就诊之前，基于疾病相关高危因素和症状表现，对个体进行简单的患病风险评估，并给出相关建议。 </view>
				<view class="p">本测试不能替代医生诊断疾病，如测试结果提示风险程度较高，建议尽快到医院就诊，由医生进行面诊及相关的检查来综合判断，及时明确诊断，尽早治疗，避免耽误病情。</view>
				<view @click="celcel" class="btn-light" hover-class="btn-light-hover" style="margin-top: 30rpx;">知道了
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	let eventChannel = null
	import {
		feedback
	} from '@/api/cancer-premature-aging'
	export default {
		data() {
			return {
				show: false,
				dataInfo: {},
				bzList: [{
						label: '没有',
						value: '1',
						icon: '/static/images/bq_no_icon.png',
						icon1: '/static/images/bq_no_icon1.png',
					},
					{
						label: '一般',
						value: '2',
						icon: '/static/images/bq_yb_icon.png',
						icon1: '/static/images/bq_yb_icon1.png',
					},
					{
						label: '很多',
						value: '3',
						icon: '/static/images/bq_hd_icon.png',
						icon1: '/static/images/bq_hd_icon1.png',
					},
				],
				bzValue: '',
				bgColor: '#fff',
				leftIconColor: '#303133'
			}
		},
		onLoad() {
			eventChannel = this.getOpenerEventChannel();
			eventChannel.on('info', (info) => {
				this.dataInfo = info
			})
		},
		methods: {
			celcel() {
				this.show = false
			},
			changeBz(value) {
				if (this.bzValue) {
					return
				}
				this.bzValue = value
				const { dataInfo } = this
				const params = {
					feedback: value,
					resultId: dataInfo.id
				}
				this.subFeedback(params)
			},
			resetCs () {
				eventChannel.emit('initCs')
				wx.navigateBack({
					delta: 1
				})
			},
			leftClick () {
				uni.navigateBack({
					delta:2
				})
			},
			async subFeedback (params) {
				const res = await feedback(params)
				if (!res || res.code !== 200) return
				wx.showToast({
					title: '您的反馈已收到',
					icon: 'none'
				})
			}
		}
	}
</script>

<style lang="scss">
	.wrapper {
		display: flex;
		flex-direction: column;
		height: 100vh;
	}

	.page-content {
		flex: 1;
		overflow: hidden;
	}

	.relative {
		position: relative;
	}

	.slt-content {
		position: relative;
		z-index: 5;
		padding: 32rpx;
		border-radius: 20rpx;
		background-color: #fff;
	}

	.p {
		padding: 10rpx 0;
		line-height: 1.6;
		font-size: 24rpx;
		color: #666;
	}

	.sub-text {
		padding: 10rpx 0;
		color: #222;
	}

	.sg-vl {
		font-size: 48rpx;
		color: #3B7EFF;
		font-weight: bold;
	}

	.btn-dft-cl {
		width: 192rpx;
		height: 62rpx;
		font-size: 32rpx;
		color: #3B7EFF;
		border-radius: 80rpx;
		border: 2rpx solid #3B7EFF;
	}

	.bz-wrap {
		display: flex;
		justify-content: space-around;
		flex-wrap: wrap;
	}

	.bz-item {
		width: 130rpx;
		height: 130rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
		font-size: 24rpx;
		color: #666;

		.itm-text {
			margin-top: 10rpx;

			&.active {
				color: #3B7EFF;
			}
		}
	}

	.pop-wrap {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 32rpx 32rpx 70rpx;

		.pd-tit {
			padding: 10rpx 0 22rpx;
		}
	}

	.btn-light {
		display: flex;
		justify-content: center;
		align-items: center;
		width: 100%;
		height: 80rpx;
		font-size: 36rpx;
		font-weight: 500;
		color: #3B7EFF;
		background: #E9F1FF;
		border-radius: 80rpx;
	}

	.btn-light-hover {
		background: darken(#E9F1FF, 10%);

	}

	.banner-text {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		padding: 36rpx 32rpx;

		.wccs-txt {
			padding-bottom: 16rpx;
			font-size: 44rpx;
			font-weight: 500;
			color: #fff;
			opacity: .8;
		}

		.br-text {
			font-size: 22rpx;
			color: rgba(#fff, .8);
		}
	}
</style>