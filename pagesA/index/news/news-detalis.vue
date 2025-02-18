<template>
	<view>
		<ut-nav title="新闻中心" border back @leftClick="leftClick"></ut-nav>

		<view class="content" style="padding-bottom: 90rpx;">
			<view class="h1 ">{{newsData.title}}</view>
			<view class="vice flex j-c m-t2">
				<view>{{newsData.createTime}}</view>
				<view class="flex" v-if="newsData.readCount">
					<view class="m-r1">
						<u-icon name="eye" color="#C6C6C6" size="12"></u-icon>
					</view>
					{{newsData.readCount}}
				</view>
			</view>

			<view class="details m-t3">
				<rich-text class="rich" space='nbsp' :nodes="content"></rich-text>
			</view>

			<!--评论开始-->
			<!-- <view>
				<hb-comment ref="hbComment" :deleteTip="'确认删除？'" :cmData="commentData" :ncData="ncData">
					
				</hb-comment>
			</view> -->
			<!--评论结束-->
		</view>
		<view class="bottom" @click.stop>
			<!-- <view class="input">
				<input placeholder="发表评论~"/>
			</view> -->
			<view class="icon-box">
				<view class="box">
					<button open-type="share" class="share-btn">
						<u-icon name="share-square" color="#999" size="20"></u-icon>
						<text class="num">{{shareCount}}</text>
					</button>
				</view>
				<view class=" box" @click="onLike">
					<u-icon name="heart" color="#999" size="20" v-if="!showLike"></u-icon>
					<u-icon name="heart-fill" color="#FC0000FF" size="20" v-else></u-icon>
					<text class="num">{{newsLikeNum}}</text>
				</view>
				<view class=" box" @click="onCollect">
					<u-icon name="star" color="#999" size="20" v-if="!showCollect"></u-icon>
					<u-icon name="star-fill" color="#FFA800FF" size="20" v-else></u-icon>
					<text class="num" v-if="collectList">{{collectList.length || 0}}</text>
				</view>

			</view>
		</view>
	</view>
</template>

<script>
	import {
		getNewsListDetailById,
		newsCollect,
		newsLike,
		getLikeNum,
		newsShare,
		commentList,
	} from '@/api/generalcontent/generalcontent.js'
	import {
		ok
	} from 'assert';
	import {
		baseUrl
	} from '@/config';
	export default {
		data() {
			return {
				id: '',
				title: '',
				titlepicture: '',
				newsData: {},
				content: null,
				collectList: [],
				isCancell: true,
				newsLikeNum: 0,
				shareCount: 0,
				showLike: null,
				showCollect: null,
				commentData: {},
				ncData: {
					newsId: null,
					title: null,
				},
				commentList: [],
			};
		},
		onLoad(option) {
			this.id = option.id
			this.ncData.newsId = option.id
			this.ncData.title = option.title
			this.getNewsDetail();
			this.getLikeNums();
			this.getCommentLists();
		},
		//分享 
		onShareAppMessage() {
			let param = {
				newsId: this.id,
				title: this.title,
				userId: this.$store.getters.userId,
				userName: this.$store.getters.name,
			}
			console.log('params', param)
			newsShare(param).then(res => {
				console.log('123')
				if (res.code == 200) {
					this.shareCount++
				}
			})
			return {
				title: this.newsData.title,
				path: '/pagesA/index/news/news-detalis?id=' + this.id,
			}

		},
		methods: {
			//评论评价列表
			getCommentLists() {
				console.log("id:", this.id)
				commentList(this.id).then(res => {
					console.log("comment:", res)
					if (res.code == 200) {
						this.commentList = res.data
						this.commentData = {
							"readNumer": this.readNumer,
							"commentSize": this.commentList.length,
							"comment": this.getTree(this.commentList)
						}
					}
				})
			},
			getTree(data) {
				let result = [];
				let map = {};
				data.forEach(item => {
					console.log("---", item)
					map[item.id] = item;
				});
				data.forEach(item => {
					let parent = map[item.parentId];
					if (parent) {
						(parent.children || (parent.children = [])).push(item);
					} else {
						result.push(item);
					}
				});
				return result;
			},
			//获取新闻详情
			getNewsDetail() {
				getNewsListDetailById(this.id).then(res => {
					console.log("详情：", res)
					this.newsData = res.data
					this.title = this.newsData.title
					this.titlepicture = this.newsData.titlepicture
					this.collectList = res.data.collectList;

					var curUserId = this.$store.getters.userId;
					if (this.collectList.length > 0) {
						for (let list of this.collectList) {
							if (curUserId == list.userId) {
								this.showCollect = true
							} else {
								this.showCollect = false
							}
						}
					} else {
						this.showCollect = false
					}
					this.shareCount = res.data.shareCount;
					this.content = this.newsData.htmlContent.replace(/\<img/gi,
						'<img style="width:100%;height:auto" ')
				})
			},
			onLike() {
				var curUserId = this.$store.getters.userId;
				if ("" == curUserId) {
					uni.showToast({
						title: "亲，请先登录！！",
						icon: "none"
					})
					return
				}
				let param = {
					newsId: this.id,
					userId: curUserId,
				}
				newsLike(param).then(res => {
					if (res.code == 200) {
						uni.showToast({
							title: res.msg,
							icon: "none"
						})
						this.newsLikeNum = res.data.size
						this.showLike = res.data.isMem
					}
				})
			},
			getLikeNums() {
				var that = this
				var curUserId = this.$store.getters.userId;
				getLikeNum(this.id, curUserId).then(res => {
					if (res.code == 200) {
						that.newsLikeNum = res.data.size
						this.showLike = res.data.isMem
					}

				})
			},
			onCollect() {
				var curUserId = this.$store.getters.userId;
				if ("" == curUserId) {
					uni.showToast({
						title: "亲，请先登录！！",
						icon: "none"
					})
					return
				}
				var that = this
				console.log("收藏：", this.collectList)
				if (this.collectList.length > 0) {
					for (let list of this.collectList) {
						if (curUserId == list.userId) {
							this.isCancell = false;
						} else {
							this.isCancell = true
						}
					}
				} else {
					this.isCancell = true
				}
				let params = {
					isCancellation: this.isCancell,
					newsId: this.id,
					title: this.newsData.title,
					userId: this.$store.getters.userId,
					userName: this.$store.getters.name
				}
				// console.log('params',params)
				newsCollect(params).then(res => {
					console.log("===", res)
					if (res.code == 200) {
						uni.showToast({
							title: res.msg,
							icon: "none"
						})
						if (res.msg == "收藏成功！") {
							this.showCollect = true
						} else {
							this.showCollect = false
						}
						that.getNewsDetail();
					}
				})
			},
			leftClick() {
				uni.navigateBack({
					delta: 1
				})
			}
		}
	}
</script>

<style lang="less">
	page {
		background: #fff;
	}

	.vice {
		color: #C6C6C6FF;
		font-size: 24rpx;
	}

	.details {
		color: #333;
		font-size: 28rpx;
	}


	/deep/ .rich img {
		width: 100%;
	}

	.bottom {
		position: fixed;
		left: 0;
		bottom: 0;
		width: 100%;
		height: 90rpx;
		background: #fff;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 0 30rpx;
		box-sizing: border-box;

		.input {
			width: 50%;

			input {
				width: 100%;
				height: 60rpx;
				border-radius: 50rpx;
				border: none;
				background: #F8F8F8FF;
				padding-left: 30rpx;
				box-sizing: border-box;
				font-size: 24rpx;
			}
		}

		.icon-box {
			width: 50%;
			display: flex;
			// justify-content: flex-start;
			justify-content: center;
			font-size: 24rpx;
			padding: 0 10rpx;
			box-sizing: border-box;
			color: #999;

			.box {
				flex: 1;
				display: flex;
				align-items: center;
				position: relative;

				.num {
					margin-left: 5rpx;
				}
			}
		}
	}

	.share-btn {
		background-color: #fff;
		display: contents;

		.num {
			margin-left: 5rpx;
			font-size: 24rpx;
			color: #999;
		}

		&::after {
			border: none;
		}
	}
</style>