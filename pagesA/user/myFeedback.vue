<template>
	<view>
		<ut-nav src="/pages/user/user" title="我的反馈" border></ut-nav>
		<view class="head">
			<view class="ut-padding">
				<view class="width btn" @click="$ut.jump('/pagesA/user/myFeedback-new?type=createNew')">
					<view class="m-r1">
						<u-icon name="file-text-fill" color="#3B7EFFFF" size="18"></u-icon>
					</view>
					<text>新建反馈</text>
				</view>
			</view>
			<ut-tabs :tabList="tabList" :current="current" @onItem="onItem"></ut-tabs>
		</view>

		<view class="content">
			<view class="list" v-for="(item,index) in list" :key="index">
				<view @click="checkDetails(item)">
					<view class="title ellipsis">{{item.title}}</view>
					<view class="tabs" v-if="item.status == 1">已回复</view>
					<view class="tabs red" v-if="item.status ==0">未回复</view>
					<view class="vice m-t2 ellipsis">{{item.problem}}</view>
					<view class="flex m-t2">
						<view class="label">反馈人：{{item.userName}}</view>
						<view class="label">反馈时间：{{item.createTime | formatDate}} </view>
					</view>
				</view>
				<view v-if="current == 1">
					<u-collapse :border='false'>
						<u-collapse-item title="查看回复内容" @click.stop>
							<text class="recover"><text class="text">
									回复：</text>{{item.replyContent}}</text>
						</u-collapse-item>
					</u-collapse>
				</view>
			</view>

			<ut-nodata v-if="list.length == 0"></ut-nodata>
		</view>
	</view>
</template>

<script>
	import {
		getFeedbackList
	}
	from "@/api/personalCenter/personalCenter"
	export default {
		filters: {
			formatDate: function(item) {
				const date = new Date(item);
				const year = date.getFullYear();
				const month = date.getMonth() + 1; // 月份从0开始，所以需要加1
				const day = date.getDate();
				return year + "-" + month.toString().padStart(2, '0') + '-' + day.toString().padStart(2, '0');
			}
		},
		data() {
			return {
				tabList: [{
					name: '已回复',
					id: 1
				}, {
					name: '未回复',
					id: 0
				}],
				current: 1,
				list: [],
				userId: this.$store.getters.userId
			};
		},
		onLoad() {
			uni.$on('refresh:feedback', () => {
				this.getData()
				this.current = 0
			})
			this.getData();
		},
		onUnload() {
			uni.$off('refresh:feedback')
		},
		methods: {
			checkDetails(item) {
				this.$ut.jump('/pagesA/user/myFeedback-new?type=checkDetail&id=' + item.id)
			},
			getData() {
				getFeedbackList(this.userId, this.current).then(res => {
					this.list = res.data;
				})
			},
			onItem(e, index) {
				this.current = e.id
				this.getData();
			},
		}
	}
</script>

<style lang="less">
	.head {
		width: 100%;
		height: 260rpx;
		background: #fff;

		.btn {
			width: 100%;
			height: 120rpx;
			border-radius: 20rpx;
			background: #E8F1F8FF;
			display: flex;
			align-items: center;
			justify-content: center;
			font-size: 28rpx;
			color: #3B7EFFFF;
			font-weight: 400;
		}
	}

	.list {
		width: 100%;
		min-height: 200rpx;
		border-radius: 20rpx;
		background: #fff;
		margin-bottom: 30rpx;
		padding: 30rpx 20rpx;
		box-sizing: border-box;
		position: relative;

		.title {
			width: 80%;
			font-size: 30rpx;
			font-weight: 600;
			color: #000;
		}

		.tabs {
			position: absolute;
			top: 30rpx;
			right: 20rpx;
			font-size: 24rpx;
			color: #00C777FF;
			background: #00C7771A;
			border-radius: 10rpx;
			padding: 5rpx 15rpx;
			box-sizing: border-box;
		}

		.red {
			color: #FD5454FF !important;
			background: #FD54541A !important;
		}

		.vice {
			color: #666;
			font-size: 24rpx;
		}

		.label {
			width: 40%;
			color: #C6C6C6FF;
			font-size: 24rpx;
		}
	}

	.recover {
		background: #F8F8F8FF;
		border-radius: 10rpx;
		font-size: 24rpx;
		color: #222222FF;
		padding: 20rpx;
		box-sizing: border-box;

		.text {
			color: #3B7EFF;
		}
	}

	/deep/ .u-cell__body {
		padding: 10rpx 0 !important;
	}
</style>