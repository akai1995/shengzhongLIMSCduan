<template>
	<view>
		<z-paging ref="paging" v-model="dataList" @query="queryList">
			<template #top>
				<ut-nav title="样本送检"  border></ut-nav>
				<view class="content" style="padding-bottom: 0;">
					<view class="scan" @click="onScan()">
						<u-icon name="scan" color="#3B7EFF" size="22"></u-icon>
						<view class="m-l2">扫码送检</view>
					</view>
				</view>
			</template>
			<view class="content" :class="isCheck?'p-t':''" >
				<view class="flex j-c width">
					<view class="sample">送检样本</view>
					<view class="icon-box " @click="showCheck">
						<u-icon name="pushpin" color="#3B7EFFFF" size="20"></u-icon>
						<text class="text width">批量送检</text>
					</view>
				</view>
				<u-checkbox-group shape="circle" v-model="checkboxArr" @change="checkboxChange">
					<view class="list m-t3" v-for="item in dataList" :key="item.id">

							<view class="checkbox" v-if="isCheck == true">
								<u-checkbox :name="item.id"></u-checkbox>
							</view>
							<view class="flex j-c">
								<view class="title">{{item.fdSampleCode}}</view>
							</view>
							<view class="view m-t1">
								<view class="item">检测项目：{{item.fdProjectName}}</view>
								<view class="item">采样时间：{{$ut.strSlice(item.fdSampleTime)}}</view>
								<view class="item flex">
									<view style="width: 40%;">姓名：{{item.fdName}}</view>
									<view>性别：{{item.fdSex}} 年龄：{{item.fdAge}}</view>
								</view>
								<view class="item">送检医院：{{item.hospital}}</view>
								<view class="item">样本编码：{{item.fdSamplesCode}}</view>

								<view class="comfirm" @click="sendSample(item.id)">确认送检</view>
							</view>
					</view>
				</u-checkbox-group>
			</view>
			<view class="bottom" v-if="isCheck == true">
				<view class="btn back1" @click="showCheck">取消</view>
				<view class="btn back2" @click="batchSendSample">批量送检（{{checkboxArr.length}}）</view>
			</view>
		</z-paging>
	</view>
</template>

<script>
	import {
		listByDoctor,
		updateSample,
		batchSendSample,
		getSampleByQRCode
	} from '@/api/sample.js'
	export default {
		data() {
			return {
				isCheck: false,
				checkboxArr: [],
				dataList: [],
			};
		},
		methods: {
			queryList(pageNo,pageSize){
				uni.showLoading()
				let params = {
					pageNum: pageNo,
					pageSize: pageSize,
					sendStatus: 0
				}
				listByDoctor(params).then(res=>{
					uni.hideLoading()
					if (res.code == 200) {
						this.$refs.paging.complete(res.data.records);
					} else if (res.code == 500) {
						this.$ut.showText(res.msg)
					}
				})
			},
			checkboxChange(e) {
				console.log('e', e)
			},
			showCheck(){
				this.isCheck = !this.isCheck
				this.checkboxArr = []
			},
			// 单个送检
			sendSample(id) {
				let params = {
					ids: id
				}
				uni.showLoading()
				batchSendSample(params).then(res=>{
					uni.hideLoading()
					if (res.code == 200) {
						this.$refs.paging.reload()
					} else if (res.code == 500) {
						this.$ut.showText(res.msg)
					}
				})
			},
			// 批量送检
			batchSendSample() {
				let params = {
					ids: this.checkboxArr.join(',')
				}
				uni.showLoading()
				batchSendSample(params).then(res => {
					uni.hideLoading()
					if (res.code == 200) {
						this.$refs.paging.reload()
					}  else if (res.code == 500) {
						this.$ut.showText(res.msg)
					}
				})
			},
			//扫码
			onScan(){
				uni.scanCode({
					success(res) {
						console.log('res',res.result)
						let params = {
							fdApplyCode: res.result
						}
						uni.showLoading()
						getSampleByQRCode(params).then(res=>{
							uni.hideLoading()
							if (res.code == 200) {
								console.log(res)
								uni.navigateTo({
									url: "/pages/sample/scanDetails?id="+res.data[0].id
								})
							}  else if (res.code == 500) {
								this.$ut.showText(res.msg)
							}
						})
					}
				})
			}
		}
	}
</script>

<style lang="less" scoped>
	/deep/ .u-checkbox-group {
		display: block !important;
	}
	page{
		background: #fff !important;
	}
	.scan {
		width: 100%;
		height: 100rpx;
		border-radius: 20rpx;
		background: #E8F1F8FF;
		display: flex;
		align-items: center;
		justify-content: center;
		color: #3B7EFFFF;
		font-size: 28rpx;
	}

	.sample {
		color: #3B7EFFFF;
		font-size: 32rpx;
		font-weight: 500;
		position: relative;

		&::after {
			content: '';
			width: 40rpx;
			height: 6rpx;
			border-radius: 6rpx;
			background: #3B7EFFFF;
			position: absolute;
			left: 50%;
			bottom: -20rpx;
			transform: translateX(-50%);
		}
	}

	.icon-box {
		width: 80rpx;
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		color: #999;
		font-size: 20rpx;
		text-align: right;
	}



	.list {
		padding-bottom: 30rpx;
		box-sizing: border-box;
		border-bottom: 1rpx solid #E7E7E7FF;
		position: relative;

		&:last-child {
			border-bottom: none;
		}

		.checkbox {
			position: absolute;
			top: 30rpx;
			right: 30rpx;
			z-index: 9;
		}

		.title {
			font-size: 32rpx;
			font-weight: 500;
		}

		.tag {
			font-size: 24rpx;
			padding: 5rpx 15rpx;
			border-radius: 10rpx;
		}

		.view {
			position: relative;

			.item {
				font-size: 24rpx;
				color: #999;
				line-height: 2;
			}

			.comfirm {
				position: absolute;
				bottom: 0;
				right: 0;
				padding: 5rpx 30rpx;
				display: flex;
				align-items: center;
				justify-content: center;
				color: #fff;
				background: linear-gradient(135deg, #00DEFF 0%, #0C5FFF 100%);
				border-radius: 80rpx;
				font-weight: 500;
				font-size: 24rpx;
				letter-spacing: 2rpx;
			}
		}
	}

	.bottom {
		position: fixed;
		left: 0;
		bottom: 0;
		z-index: 9;
		width: 100%;
		height: 120rpx;
		background: #fff;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0 30rpx;
		box-sizing: border-box;
	}

	.btn {
		width: 320rpx;
		height: 80rpx;
		border-radius: 80rpx;
		font-size: 36rpx;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.back1 {
		color: #3B7EFFFF;
		background: #063F961A;
	}

	.back2 {
		color: #fff;
		background: linear-gradient(135deg, #00DEFF 0%, #0C5FFF 100%);
	}

	.p-t{
		padding-bottom: 120rpx;
	}
</style>