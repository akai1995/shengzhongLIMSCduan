<template>
	<view class="new">
		<view class="new-list" v-for="(item,index) in list" :key="index" @tap="onClick(item)">
			<view class="img" v-if="false">
				<image v-if="item.infoType=='drug'"
					:src="item.imageCode == null || item.imageCode ==''? 'https://genepiapi.ypzlfx.com/file/genepi/2023/07/06/drug3.jpg':item.imageCode" mode=""></image>
				<image v-if="item.infoType=='news'"
					:src="item.imageCode == null || item.imageCode =='' ? 'https://genepiapi.ypzlfx.com/file/genepi/2023/07/06/news1.jpg':item.imageCode" mode=""></image>
				<view class="play" v-if="isPlay">
					<u-icon name="play-circle" color="#fff" size="28"></u-icon>
				</view>
			</view>
			<view class="view">
				<view class="title" v-html="item.title"></view>
				<view class="text" v-html="item.headline"></view>
				<view class="tag">
					<view v-if="item.infoType=='news'" class="flex">
						{{item.newsType}}
					</view>
					<!-- <view v-if="item.infotype=='news'" class="flex" style="margin-left: -40rpx;">
						<u-icon name="eye" color="#A8A8A8FF" size="9"></u-icon>
						{{item.readcount}}
					</view> -->
					<view v-if="item.infoType=='drug'">{{item.author == null ?'':item.author}}</view>
					<view v-if="item.infoType=='news'">{{dateFormat(item.createTime)}}</view>

				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: "ut-new",
		props: ['list', 'isPlay'],
		data() {
			return {

			};
		},
		methods: {
			onClick(item) {
				console.log(item)
				this.$emit('onClick', item)
			},
			dateFormat(time) {
				let date = new Date(time);
				let year = date.getFullYear();
				// 在日期格式中，月份是从0开始的，因此要加0，使用三元表达式在小于10的前面加0，以达到格式统一  如 09:11:05
				let month = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
				let day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
				let hours = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
				let minutes = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
				let seconds = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
				// 拼接
				// return year + "-" + month + "-" + day + " " + hours + ":" + minutes + ":" + seconds;
				return year + "-" + month + "-" + day;
			},
		}
	}
</script>

<style lang="less">
	.new {
		width: 100%;
		height: auto;
		background: #fff;
		border-radius: 20rpx;
		padding-bottom: 0rpx;

		&-list {
			margin-bottom: 25rpx;
			display: flex;
			
			.img {
				width: 200rpx;
				height: 140rpx;
				flex-shrink: 0;
				position: relative;

				image {
					width: 100%;
					height: 100%;
				}

				.play {
					position: absolute;
					z-index: 0;
					left: 0;
					top: 0;
					width: 100%;
					height: 100%;
					display: flex;
					align-items: center;
					justify-content: center;
					background: rgba(0, 0, 0, 0.1);
				}

			}

			.view {
				// width: calc(100% - 220rpx);
				width: 100%;
				margin-left: 20rpx;
				display: flex;
				flex-wrap: wrap;
				align-items: center;
				align-content: space-between;

				.title {
					color: #222;
					font-size: 28rpx;
					overflow: hidden;
					overflow: hidden;
					text-overflow: ellipsis;
					display: -webkit-box;
					-webkit-box-orient: vertical;
					-webkit-line-clamp: 1;
					font-weight: 600;
				}

				.text {
					color: #666;
					font-size: 24rpx;
					width: 100%;
					overflow: hidden;
					text-overflow: ellipsis;
					display: -webkit-box;
					-webkit-box-orient: vertical;
					-webkit-line-clamp: 2;
				}

				.tag {
					width: 100%;
					display: flex;
					justify-content: space-between;
					color: #C6C6C6FF;
					font-size: 20rpx;
				}
			}
		}
	}
</style>