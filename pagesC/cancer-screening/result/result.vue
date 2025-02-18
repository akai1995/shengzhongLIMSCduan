<template>
	<view>
		<z-paging ref="paging">
			<template #top>
				<ut-nav title="基因派" iconName="home" back @onBack="onBack" border></ut-nav>
			</template>
			<view class="content">
				<view class="d-flex ai-c" style="padding-bottom: 32rpx;">
					<view class="d-flex jc-c-c"><u-avatar size="100rpx"></u-avatar></view>
					<view style="padding: 0 20rpx;">
						<view class="tit">{{ cancerUser.name }}</view>
						<view class="sfz">{{ cancerUser.idcard }}</view>
					</view>
				</view>
				<view class="base-block">
					<view class="flex" style="padding-bottom: 32rpx;">
						<view class="h1 m-r2">评估结果</view>
						<view class="status" :style="{ color: colorBy[cancerUser.evalueRes] }">
							{{ mapStatus[cancerUser.evalueRes] }}
						</view>
					</view>
					<view class="font-desc" style="font-size: 28rpx; line-height: 1.8;">
						<view class="base-font-color" style="padding-bottom: 10rpx;">免费领取【粪便隐血检测】试剂盒，精准筛查</view>
						<!-- <view style="font-size: 26rpx;">领取单位：各单位联络人处；</view> -->
						<view style="font-size: 26rpx;">领取地址：各单位联络人处；</view>
						<view style="font-size: 26rpx;">领取时间：工作日（周一至周五）早上8:00-12:00；下午14:00-17:00；</view>
					</view>
					<view class="d-flex jc-c-c" style="padding: 46rpx;">
						<view class="code-box d-flex jc-c-c">
							<uqrcode ref="qr" canvas-id="qr" :value="cancerUser.userid" :size="qrcodeSize">
							</uqrcode>
						</view>
					</view>
					<view class="btn-base-bim"
						@click="routePush({ url: '/pagesC/cancer-screening/up-risk/up-risk' })">
						上传检测结果</view>
					<view @click="routeSm" class="font-desc base-font-color text-center" style="padding: 10rpx;">试剂盒使用说明</view>
					<!-- <template v-if="cancerUser.evalueRes * 1"></template>
					<template v-else>
						<view class="font-desc" style="font-size: 28rpx;">
							建议每年一次免疫化学法粪便隐血检测初筛，若初筛结果为阳性，则考虑进行多靶点粪便DNA检测，若出现阳性，建议肠镜检查。
						</view>
					</template> -->
				</view>
				<view style="padding-top: 40rpx;">
					<ut-official></ut-official>
				</view>
			</view>
		</z-paging>
	</view>
</template>

<script>
	import {
		mapGetters,
		mapMutations
	} from 'vuex'
	import {
		getScreeningUserInfo
	} from '@/api/cancer-screening';
	import uqrcode from '@/pagesC/sub_nui_modules/Sansnn-uQRCode/components/uqrcode/uqrcode';
	export default {
		components: {
			uqrcode
		},
		data() {
			return {
				mapStatus: ['低风险', '高风险'],
				colorBy: ['#00C777', '#FF5252'],
				qrcodeText: 'eoruw20230528',
				// 二维码尺寸
				qrcodeSize: 150,

				// 最终生成的二维码图片
				qrcodeSrc: '',
				cancerUser: {}
			};
		},

		onLoad() {
			this.getSelfUser()
		},
		methods: {
			onBack() {
				console.log();
				uni.redirectTo({
					url: '/pages/index/index'
				})
			},
			async getSelfUser() {
				const res = await getScreeningUserInfo()
				if (!res || res.code !== 200) return
				this.cancerUser = res.data
			},
			routeSm () {
				uni.navigateTo({
					url: '/pagesC/img-title/img-title',
					success(res) {
						res.eventChannel.emit('info', { title: '试剂盒使用说明', src: 'https://genepiapi.ypzlfx.com/file/genepi/2023/12/11/vLnME1Xpe38Scc8e429b45f2571516c4fb1f2c033b6e_20231211154754A155.jpg' })
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.tit {
		padding-bottom: 10rpx;
		font-size: 28rpx;
		font-weight: 500;
		color: #000;
	}

	.sfz {
		font-size: 24rpx;
		color: #999;
	}

	.status {
		font-weight: 500;
		font-size: 48rpx;

		&.status0 {
			color: #00C777;
		}

		&.status1 {
			color: #FF5252;
		}
	}

	.code-box {
		width: 170px;
		height: 170px;
		border-radius: 8rpx;
		box-shadow: 0rpx -8rpx 20rpx 0rpx rgba(6, 63, 150, 0.1);
	}

	.btn-base-bim {
		line-height: 72rpx;
		text-align: center;
		background-color: #3B7EFF;
		color: #fff;
		font-size: 30rpx;
		border-radius: 80rpx;
	}
</style>