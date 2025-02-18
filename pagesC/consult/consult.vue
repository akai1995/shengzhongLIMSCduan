<template>
	<view>
		<z-paging ref="paging" v-model="listData" @query="queryList">
			<template #top>
				<ut-nav title="我的咨询" border></ut-nav>
				<u-tabs :list="navList" @click="onItem"></u-tabs>
			</template>
			<view class="content">
				<block v-for="(item,index) in listData" :key="item.id">
					<view class="ut-view m-t3">
						<view class="top">
							<view>{{ item.lastChatTime }}</view>
							<view :class="{ green: item.status == '1' || item.status == '0' }">{{ statusMap[item.status] }}</view>
						</view>

						<view class="text ellipsis2">{{ item.description }}</view>

						<view class="tabs-box m-t2">
							<view class="tab">{{ item.name || '匿名' }}</view>
							<view class="tab">{{ item.age }}岁</view>
							<view class="tab">{{ item.gender * 1 ? '男' : '女' }}</view>
						</view>

						<view class="yy m-t2">
							<view class="span flex">
								<u-avatar size="32rpx" :src="item.expert.headImg"></u-avatar>
								<text style="margin-left: 10rpx;">{{ item.expert.name || '-' }}</text>
							</view>
							<view class="span">{{ item.expert.level || '' }}</view>
							<view class="span">{{ item.expert.fdMeadicalName || '' }}</view>
						</view>

						<view class="btn-box m-t2">
							<view class="btn" @click="routeDetail(item, 'eidt')">查看对话</view>
							<view class="btn" @click="routeDetail(item, 'add')">再次咨询</view>
						</view>
					</view>
				</block>
			</view>
		</z-paging>
	</view>
</template>

<script>
	import {
		pageConsultationApi
	} from '../../api/chat'
	export default {
		data() {
			return {
				dataList: [],
				id: '',
				listData: [],
				status: '',
				navList: [{
					name: '全部',
					id: ''
				}, {
					name: '进行中',
					id: '8'
				}, {
					name: '已完成',
					id: '9'
				}],
				statusMap: {
					0: '进行中',
					1: '进行中',
					9: '已完成'
				}
			}
		},
		onLoad() {

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
				const res = await pageConsultationApi(params)
				uni.hideLoading()
				if (!res || res.code !== 200) return
				this.$refs.paging.complete(res.data);
			},
			routeDetail (item, type) {
				let that = this
                let url = ''
				if (type == 'eidt') {
					url = '/pagesC/chat/chat?id=' + item.id
				} else {
					url = '/pagesC/chat/chat'
				}
				uni.navigateTo({
					url,
					events: {
						change () {
							that.$refs.paging.reload();
						}
					},
					success: (res) => {
						res.eventChannel.emit('info', { ...item.expert })
					}
				})
			}
		}
	}
</script>

<style scoped lang="scss">
	.ut-view {
		&:first-child {
			margin-top: 0;
		}
	}

	.top {
		display: flex;
		align-items: center;
		justify-content: space-between;
		font-size: 24rpx;
		color: #999;
		padding-bottom: 20rpx;
		border-bottom: 2rpx solid #0000001A;
	}

	.text {
		color: #000;
		font-size: 24rpx;
		line-height: 1.5;
		margin-top: 25rpx;
	}

	.tabs-box {
		display: flex;
		align-items: center;
		font-size: 22rpx;
		color: #666;

		.tab {
			min-width: 100rpx;
			text-align: center;
			position: relative;

			&:first-child {
				text-align: left;
			}

			&::after {
				content: '';
				width: 1rpx;
				height: 100%;
				background: #0000001A;
				position: absolute;
				top: 0;
				right: 0rpx;
			}

			&:last-child::after {
				width: 0;
			}
		}
	}

	.yy {
		display: flex;
		align-items: center;
		width: 100%;
		height: 45rpx;
		border-radius: 6rpx;
		background: #F8F8F8FF;
		padding: 0 20rpx;
		box-sizing: border-box;
		color: #666;
		font-size: 22rpx;

		.span {
			padding: 0 25rpx;
			position: relative;

			&:first-child {
				padding: 0;
				min-width: 120rpx;
			}

			&::after {
				content: '';
				width: 1rpx;
				height: 100%;
				background: #0000001A;
				position: absolute;
				top: 0;
				right: 0rpx;
			}

			&:last-child::after {
				width: 0;
			}
		}
	}

	.btn-box {
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: flex-end;

		.btn {
			margin-left: 25rpx;
			padding: 10rpx 15rpx;
			border: 2rpx solid #3B7EFFFF;
			color: #3B7EFFFF;
			font-size: 22rpx;
			border-radius: 60rpx;
		}
	}

	.color {
		color: #00C777FF;
	}
	.green {
		color: #00C777;
	}
</style>