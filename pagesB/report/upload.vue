<template>
	<view>
		<z-paging ref="paging" v-model="dataList" @query="queryList">
			<template #top>
				<ut-nav title="选择我的报告单"></ut-nav>
			</template>
			<view class="content" >
				<view class="list" v-for="item in dataList" :key="item.id" @click="onItem(item)">
					<view class="title">{{item.projectName}}</view>
					<view class="info">
						<view class="t">姓名：{{item.fdName == null? '' : item.fdName}}</view>
						<view class="t">性别：{{item.sex  == null? '未知' : item.sex}}</view>
						<view class="t">年龄：{{item.age  == null? '' : item.age}}岁</view>
					</view>
					<view class="text m-t2">
						<view class="label">检测时间：{{$ut.strSlice(item.inspectionTime) == undefined ? '' : $ut.strSlice(item.inspectionTime)}}</view>
						<view class="label">申请编号：{{item.fdApplyCode == null? '' : item.fdApplyCode}}</view>
					</view>
					<view class="text m-t2">
						<view class="label">检测医院：{{item.hospital  == null? '' : item.hospital}}</view>
					</view>

					<view class="radio" :class="active == item.id?'active':''"></view>
					<view class="radio-icon">
						<u-icon name="checkbox-mark" color="#fff" size="24"></u-icon>
					</view>
				</view>
				<view class="button m-t6" @click="jump()" v-if="dataList.length > 0">确认选择</view>
			</view>
		</z-paging>

	</view>
</template>

<script>
	import {
		checkedAuthList
	} from '@/api/report.js'
	export default {
		data() {
			return {
				active: '',
				dataList: [],
				item:{},
				pageNum: 1,
				pageSize: 10
			};
		},
		methods: {
			queryList() {
				let params = {
					pageNum: this.pageNum,
					pageSize: this.pageSize
				}
				uni.showLoading()
				checkedAuthList(params).then(res => {
					uni.hideLoading()
					this.$refs.paging.complete(res.data.records)
				})
			},
			onItem(item) {
				this.active = item.id
				this.item = item
			},
			jump() {
				let item =  encodeURIComponent(JSON.stringify(this.form))
				if(this.active){
					// 获取所有页面栈实例列表
					let pages = getCurrentPages();  
					
					// 当前页页面实例
					let nowPage = pages[ pages.length - 1]; 
					 
					// 上一页页面实例
					let prevPage = pages[ pages.length - 2 ];  
					
					// 修改上一页data里面的times参数值为100
					prevPage.$vm.form = this.item; 
					
					uni.navigateBack()
				}else{
					this.$ut.showText('请选择检测报告')
				}
				
			}
		}
	}
</script>

<style lang="less">
	.list {
		width: 100%;
		min-height: 210rpx;
		background: #fff;
		border-radius: 20rpx;
		padding: 30rpx 20rpx;
		box-sizing: border-box;
		position: relative;
		margin-bottom: 30rpx;
		overflow: hidden;

		.title {
			width: 100%;
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
			font-size: 30rpx;
			line-height: 1.8;
			font-weight: 600;
			color: #000;
			letter-spacing: 1rpx;
		}

		.tag {
			position: absolute;
			top: 30rpx;
			right: 20rpx;
			font-size: 24rpx;
			font-weight: 400;
			padding: 5rpx 15rpx;
			border-radius: 10rpx;
		}

		.info {
			display: flex;
			align-items: center;
			color: #666;
			font-size: 24rpx;
			line-height: 1.5;
			font-weight: 400;

			.t {
				margin-right: 20rpx;
			}
		}

		.text {
			font-size: 24rpx;
			color: #c6c6c6;
			font-weight: 400;
			display: flex;
			align-items: center;

			.label {
				margin-right: 20rpx;
			}
		}

		.radio {
			position: absolute;
			right: 0;
			bottom: 0;
			// background: #DADADAFF;
			border-width: 40rpx;
			border-style: solid;
			border-color: transparent #DADADAFF #DADADAFF transparent;
			z-index: 1;
		}

		.radio-icon {
			position: absolute;
			right: 0;
			bottom: 0;
			z-index: 2;
		}
	}

	.active {
		border-color: transparent #3B7EFFFF #3B7EFFFF transparent !important;
	}

	.button {
		// position: fixed;
		// left: 70rpx;
		// right: 70rpx;
		// bottom: 65rpx;
		height: 80rpx;
		border-radius: 80rpx;
		background: linear-gradient(135deg, #00DEFF 0%, #0C5FFF 100%);
		display: flex;
		align-items: center;
		justify-content: center;
		color: #fff;
		font-size: 36rpx;
		font-weight: 500;
		letter-spacing: 2rpx;
	}
</style>