<template>
	<view>
		<z-paging ref="paging" v-model="dataList" @query="queryList">
			<template #top>
				<ut-nav title="我的咨询" border></ut-nav>
				<u-tabs :list="navList" @click="onItem"></u-tabs>
			</template>
			<view v-if="dataList.length" class="content safe-area-inset-bottom">
				<template v-for="(item, index) in dataList">
					<view class="card-item" :key="index" @click="routeDetail(item)">
						<view class="d-flex js-b-c">
							<view class="">
								<text class="m-r2 font1">{{ item.name || '匿名' }}</text>
								<text class="m-r2 font2">{{ mapGender[item.gender] }}</text>
								<text class="font2">{{ item.age }}岁</text>
							</view>
							<u-tag :text="item.lastChatTime | ddfilter" bgColor="#EEF2FF" color="#5178FF"> </u-tag>
						</view>
						<view class="desc-text ellipsis2 pd-tb-16">
							病情描述：{{ item.description }}</view>
						<view v-if="item.status === '0'" class="card-btm d-flex">
							<view class="btn-card d-flex jc-c-c border-right">
								<u-icon name="close" size="16" color="#FD5454"></u-icon>
								<text class="text">拒绝</text>
							</view>
							<view class="btn-card d-flex jc-c-c">
								<u-icon name="checkmark" size="16" color="#00C777"></u-icon>
								<text class="text color-tt">接受</text>
							</view>
						</view>
					</view>
				</template>
			</view>
		</z-paging>
	</view>
</template>

<script>
	import {
		pageAskApi
	} from '../../api/chat'
	export default {
		data() {
			return {
				navList: [{
						name: '待接诊',
						id: '0'
					},
					{
						name: '交流中',
						id: '1'
					},
					{
						name: '已完成',
						id: '9'
					},
				],
				dataList: [],
				status: '0',
				mapGender: {
					1: '男',
					0: '女',
				}
			}
		},
		filters: {
			ddfilter(old_date) {
				if (!old_date) {
					return '0'
				}
				var subtime = (new Date().getTime() - new Date(old_date).getTime()) / 1000; //计算时间差,并将毫秒转化为秒
				var days = parseInt(subtime / 86400); //天  24*60*60*1000
				var hours = parseInt(subtime / 3600) - 24 * days; //小时  60*60  总小时数-过去小时数=现在小时数
				var mins = parseInt(subtime % 3600 / 60); //分钟 - (day*24)  以60秒为一整份  取余 剩下秒数 秒数/60就是分钟数
				return '已等待' + (days ? days + "天" : '') + (hours ? hours + "小时" : '') + mins + "分钟";
			}
		},
		methods: {
			queryList(pageNo, pageSize) {
				this.getList(pageNo, pageSize)
			},
			onItem(item) {
				console.log(item);
				this.status = item.id
				this.$refs.paging.reload();
			},
			async getList(pageNo, pageSize) {
				const params = {
					pageNum: pageNo,
					pageSize,
					status: this.status
				}
				uni.showLoading({
					title: '加载中...',
					mask: true
				})
				const res = await pageAskApi(params)
				uni.hideLoading()
				if (!res || res.code !== 200) return
				this.$refs.paging.complete(res.data);
			},
			routeDetail(item) {
				let that = this
				uni.navigateTo({
					url: '/pagesC/my-consult/my-consult-detail?id=' + item.id,
					events: {
						change () {
							that.$refs.paging.reload();
						}
					}
				})
			}
		}
	}
</script>

<style scoped lang="scss">
	.card-item {
		margin-bottom: 32rpx;
		padding: 20rpx 20rpx 0;
		border-radius: 16rpx;
		background-color: #fff;
	}

	.font1 {
		font-size: 28rpx;
		color: #000;
		font-weight: 500;
	}

	.font2 {
		font-size: 24rpx;
		color: #333;
	}

	.desc-text {
		font-size: 24rpx;
		color: #666;
	}

	.pd-tb-16 {
		padding: 16rpx 0;
	}

	.btn-card {
		flex: 1;
		padding: 28rpx 0;
		font-size: 24rpx;
		border-top: 1rpx solid rgba(0, 0, 0, 0.1);

		.text {
			padding-left: 10rpx;
			color: #FD5454;
		}

		.color-tt {
			color: #00C777;
		}
	}

	.border-right {
		border-right: 1rpx solid rgba(0, 0, 0, 0.1);
	}
</style>