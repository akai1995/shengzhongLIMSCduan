<template>
	<view>
		<z-paging ref="paging" v-model="dataList" @query="queryList">
			<template #top>
				<ut-nav title="样本接收"  border></ut-nav>
				<view class="content">
						<view class="scan" @click="onScan()">
							<u-icon name="scan" color="#3B7EFF" size="22"></u-icon>
							<view class="m-l2">扫码接收</view>
						</view>
				</view>
				
				<ut-tabs :tabList="tabList" :current="current" @onItem="onItem"></ut-tabs>
			</template>
			<view class="content">
				<view class="m-t3">
					<view class="list m-t3" v-for="item in dataList" :key="item.id" @click="jump(item)">
						<view class="flex j-c">
							<view class="title">{{item.fdSampleCode}}</view>
							<view class="tag red" v-if="item.receiveFlag == 0">待接收</view>
							<view class="tag green" v-if="item.receiveFlag != 0">已接收</view>
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

							<view class="comfirm" v-if="item.receiveFlag==0" @click="accept(item)">确认接收</view>
						</view>
					</view>
				</view>
			</view>
		</z-paging>
	</view>
</template>

<script>
	import {
		listByDoctor,
		batchReceiveSample,
		getSampleByQRCode
	} from '@/api/sample.js'

	export default {
		data() {
			return {
				tabList: [{
					name: '全部',
					id : 2
				}, {
					name: '待接收',
					id: 0
				}, {
					name: '已接收',
					id: 1
				}],
				current: 2,
				dataList: [],

			};
		},
		methods: {
			queryList(pageNo,pageSize){
				uni.showLoading()
				let params = {
					pageNum: pageNo,
					pageSize: pageSize,
					sendStatus: 1
				}
				if (this.current != 2) {
					params.receiveFlag = this.current
				}
				listByDoctor(params).then(res=>{
					uni.hideLoading()
					if (res.code == 200) {
						this.$refs.paging.complete(res.data.records);
					}  else if (res.code == 500) {
						this.$ut.showText(res.msg)
					}
				})
			},
			onItem(e, index) {
				this.current = e.id
				this.$refs.paging.reload();
			},
			accept(item) {
				let params = {
					ids: item.id
				}
				uni.showLoading()
				batchReceiveSample(params).then(res=>{
					uni.hideLoading()
					if (res.code == 200) {
						this.$refs.paging.reload()
					} else if (res.code == 500) {
						this.$ut.showText(res.msg)
					}
				})
			},
			jump(item) {
				uni.navigateTo({
					url: "/pages/sample/scanDetails?id="+item.id
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
		},
	}
</script>

<style lang="less">
	page {
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

	.m-l2 {
		margin-left: 20rpx;
	}

	.list {
		padding-bottom: 30rpx;
		box-sizing: border-box;
		border-bottom: 1rpx solid #E7E7E7FF;
		&:last-of-type{
			border-bottom: none;
		}
		.title {
			font-size: 32rpx;
			font-weight: 600;
		}

		.tag {
			font-size: 24rpx;
			padding: 5rpx 15rpx;
			border-radius: 10rpx;
		}
		.view{
			position: relative;
			.item{
				font-size: 24rpx;
				color: #999;
				line-height: 2;
			}
			.comfirm{
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

	.red {
		color: #FD5454FF;
		background: #FD54541A;
	}
	.green{
		color: #00C777FF;
		background: #00C7771A;
	}
</style>