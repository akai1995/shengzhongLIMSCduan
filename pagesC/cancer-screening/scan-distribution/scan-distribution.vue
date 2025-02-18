<template>
	<view>
		<z-paging ref="paging">
			<template #top>
				<ut-nav title="扫码发放" border></ut-nav>
			</template>
			<view class="content">
				<view class="d-flex js-b-c">
					<view class="h1">领取人信息</view>
					<view class="status" :class="{ checked: curInfo.existsKit }">{{ curInfo.existsKit ? '已发放' : '未发放' }}
					</view>
				</view>
				<view class="base-block" style="margin-top: 30rpx;">
					<view class="desc-item d-flex ai-c">
						<view class="desc-label">姓名</view>
						<view class="desc-value">{{ curInfo.name }}</view>
					</view>
					<view class="desc-item d-flex ai-c">
						<view class="desc-label">性别</view>
						<view class="desc-value">{{ dict.label.sys_gender[curInfo.gender] }}</view>
					</view>
					<view class="desc-item d-flex ai-c">
						<view class="desc-label">身份证号</view>
						<view class="desc-value">{{ curInfo.idcard }}</view>
					</view>
					<view class="desc-item d-flex ai-c">
						<view class="desc-label">手机号</view>
						<view class="desc-value">{{ curInfo.phone }}</view>
					</view>
					<view v-if="curInfo.cpy" class="desc-item d-flex ai-c">
						<view class="desc-label">所在单位</view>
						<view class="desc-value">{{ curInfo.cpy || '暂无' }}</view>
					</view>
					<view v-if="curInfo.office" class="desc-item d-flex ai-c">
						<view class="desc-label">所在科室</view>
						<view class="desc-value">{{ curInfo.office || '暂无' }}</view>
					</view>
					<view class="desc-item d-flex ai-c">
						<view class="desc-label">所在地区</view>
						<view class="desc-value"><ut-areaName :value="curInfo.adcdCode"></ut-areaName></view>
					</view>
					<view v-if="curInfo.existsKit" class="desc-item d-flex ai-c">
						<view class="desc-label">试剂盒编码</view>
						<view class="desc-value">{{ curInfo.kitSn || '' }}</view>
					</view>
				</view>
				<view v-if="!curInfo.existsKit" class="d-flex" style="padding: 48rpx 0;">
					<view class="h1" style="line-height: 80rpx;">试剂盒编码</view>
					<view class="flex1" style="padding-left: 36rpx;">
						<view  class="smlr-input d-flex jc-c-c" @click="scanKitid"
							style="margin-bottom: 24rpx;">扫码录入</view>
						<input class="input" v-model="kitSn" :disabled="curInfo.existsKit" type="text"
							placeholder="输入试剂盒编码">
					</view>
				</view>
			</view>
			<template v-if="dtl !== '1'" #bottom>
				<view v-if="!curInfo.existsKit" class="d-flex js-b-c" style="padding: 60rpx 32rpx;">
					<view @click="save" class="base-btn-left">保存</view>
					<view @click="saveJx" class="base-btn-right">保存并继续添加</view>
				</view>
				<view v-else style="padding: 60rpx 32rpx;">
					<view @click="jxAdd" class="btn-bim">继续添加</view>
				</view>
			</template>
		</z-paging>
	</view>
</template>

<script>
	import {
		getScreeningUserById,
		pushBoxApi
	} from '@/api/cancer-screening';
	let eventChannel = null
	export default {
		dicts: ['sys_gender'],
		data() {
			return {
				uuid: '',
				curInfo: {},
				kitid: '20231206',
				kitSn: '',
				dtl: '0'
			};
		},
		computed: {
			
		},
		onLoad(options) {
			const {
				dtl,
				uuid
			} = options
			this.uuid = uuid
			this.dtl = dtl
			this.getDetail()
			eventChannel = this.getOpenerEventChannel();
		},
		methods: {
			async getDetail() {
				console.log(this.uuid);
				uni.showLoading({
					title: '查找中...',
					mask: true
				})
				const res = await getScreeningUserById(this.uuid)
				uni.hideLoading()
				if (!res || res.code !== 200) return
				this.curInfo = res.data
			},
			scanKitid() {
				let that = this
				uni.scanCode({
					onlyFromCamera: true,
					scanType: ['barCode', 'qrCode', 'pdf417', 'datamatrix'],
					success(res) {
						console.log(res);
						const {
							errMsg,
							result
						} = res
						if (errMsg == 'scanCode:ok') {
							that.kitSn = result
						}
					}
				})
			},
			jxAdd() {
				let that = this
				uni.scanCode({
					onlyFromCamera: true,
					scanType: ['barCode', 'qrCode', 'pdf417', 'datamatrix'],
					success(res) {
						console.log(res);
						const {
							errMsg,
							result
						} = res
						if (errMsg == 'scanCode:ok') {
							that.uuid = result
							that.getDetail()
						}
					}
				})
			},
			save() {
				this.pushBox('0')
			},
			saveJx() {
				this.pushBox('1')
			},
			async pushBox(type) {
				if (!this.kitSn) {
					uni.showToast({
						title: '请扫码试剂盒编码',
						icon: 'none'
					})
					return
				}
				const params = {
					kitid: this.kitid,
					kitSn: this.kitSn,
					screenUserid: this.uuid
				}
				const res = await pushBoxApi(params)
				if (!res || res.code !== 200) return
				if (type == '0') {
					eventChannel.emit('change')
					uni.navigateBack({
						delta: 1
					})
				} else {
					this.curInfo.existsKit = '1'
					this.curInfo.kitSn = this.kitSn
					eventChannel.emit('change')
					this.jxAdd()
				}
			}
		}
	}
</script>

<style lang="scss">
	.pd-sx-10 {
		padding: 10rpx 0;
	}

	.status {
		font-weight: 500;
		font-size: 48rpx;
		color: #FF5252;

		&.checked {
			color: #00C777;
		}


	}

	.desc-item {
		padding: 20rpx 0;

		.desc-label {
			width: 24%;
			padding-right: 10rpx;
			font-size: 26rpx;
			color: #666;
			text-align: right;
		}

		.desc-value {
			flex: 1;
			word-break: break-all;
			padding-left: 10rpx;
			font-size: 30rpx;
			color: #000;
		}
	}

	.smlr-input {
		width: 100%;
		box-sizing: border-box;
		height: 80rpx;
		font-size: 28rpx;
		color: #5178FF;
		text-align: center;
		background: rgba(81, 120, 255, 0.1);
		border-radius: 12rpx;
		border: 1rpx solid #5178FF;
	}

	.smlr-plc {
		color: #5178FF;
	}

	.input {
		width: 100%;
		box-sizing: border-box;
		padding: 0 32rpx;
		height: 80rpx;
		font-size: 28rpx;
		border-radius: 12rpx;
		border: 1rpx solid rgba(0, 0, 0, 0.1)
	}
</style>