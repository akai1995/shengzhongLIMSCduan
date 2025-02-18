<template>
	<view>
		<ut-nav title="健康社区" border url="/pages/community/community"></ut-nav>
		<view class="content">
			<view class="title">{{data.newsTitle}}</view>
			<view class="up m-t3">
				<view class="up-left" @click="$ut.jump('/pagesB/community/taHomePages?id='+data.userId)">
					<image class="img" :src='(data && data.userAvatar) || ""'></image>
					<view class="text">
						<view class="name">{{data.userName}}</view>
						<view class="vice">{{(data && data.linkName) || ''}} | {{(data && data.createTime) || ''}}
						</view>
					</view>
				</view>
				<view v-if="data.userId!==userId">
					<u-tag text="关注" size="mini" icon="plus" plain shape="circle" @click="onConcern(0)"
						v-if="!showConcern"></u-tag>
					<!-- <u-tag text="已关注" size="mini" icon="checkbox-mark" plain shape="circle" @click="onConcern(1)" borderColor="#1E0B29" color="#1E0B29" v-else></u-tag> -->
					<view class="tags" @click.stop="onConcern(1)" v-else>
						<u-icon name="checkmark" color="#DADADA" size="28rpx"></u-icon>
						<text>已关注</text>
					</view>
				</view>
			</view>

			<view class="cont m-t4" v-html="data.newsContent"></view>
			<view class="m-t4 image-box">
				<block v-for="(item, index) in data.imageList" :key="index">
					<image class="img" :src="item" mode="aspectFill" @click="previewImgs(index)"></image>
				</block>
			</view>
			<view class="m-t4" @click="deleteCircle(data.id)" v-if="data.userId===userId">
				<u-icon name="trash" color="#999" size="20"></u-icon>
			</view>
		</view>
		<u-gap height="10" bgColor="#f8f8f8"></u-gap>
			<view class="popup">
				<view class="title width flex j-c-c m-t2">共{{ total|| 0}}条评论</view>
				<!-- <scroll-view scroll-y class="scroll" v-if="commentList && commentList.length>0" @scrolltolower="loadPaging"> -->
					<view class="scroll">
						<view class="list m-t3" v-for="(item,index) in commentList" :key="item.id">
							<view class="width flex j-c" style="align-items: flex-start;">
								<!-- 头像 -->
								<image class="avatar"
									:src="(item && item.userAvatar) || '' "
									mode="aspectFill"></image>
								<!-- 内容 -->
								<view class="cont" @click="showComment(item.id)">
									<view class="name">{{item.userName}}</view>
									<view class="text">{{item.commentContent}}</view>
									<view class="date">
										<text class="m-r1">{{item.createTime}}</text>
										<!--<text>云南</text>-->
									</view>
								</view>
								<!-- 点赞 -->
								<view class="right">
									<view class="width flex j-c-c">
										<u-icon name="thumb-up" color="#999" size="38rpx" @click="onCommentLike(item)"
											v-if="!item.isLike"></u-icon>
										<u-icon name="thumb-up-fill" color="red" size="38rpx" @click="onCommentLike(item)"
											v-else></u-icon>
									</view>
									<text class="m-t1">{{item.likeNum || 0}}</text>
									<view class="m-t1" @click="deleteComment(item.id)" v-if="item.userId===userId">
										<u-icon name="trash" color="#999" size="38rpx"></u-icon>
									</view>
								</view>
							</view>
							<view class="width" style="display: flex;" v-for="item_ in item.commentVoList" :key="item_">
								<view style="width: 10%;"></view>
								<view class="width flex j-c" style="align-items: flex-start;width: 90%;">
									<!-- 头像 -->
									<image class="avatar"
										:src="(item_ && item_.userAvatar) || '' "
										mode="aspectFill"></image>
									<!-- 内容 -->
									<view class="cont">
										<view class="name">{{item_.userName}}</view>
										<view class="text">{{item_.commentContent}}</view>
										<view class="date">
											<text class="m-r1">{{item_.createTime}}</text>
											<!--<text>云南</text>-->
										</view>
									</view>
									<!-- 点赞 -->
									<view class="right">
										<view class="width flex j-c-c">
											<u-icon name="thumb-up" color="#999" size="38rpx" @click="onCommentLike(item)"
												v-if="!item.isLike"></u-icon>
											<u-icon name="thumb-up-fill" color="red" size="38rpx" @click="onCommentLike(item)"
												v-else></u-icon>
										</view>
										<text class="m-t1">{{item.likeNum || 0}}</text>
										<view class="m-t1" @click="deleteComment(item.id)" v-if="item.userId===userId">
											<u-icon name="trash" color="#999" size="38rpx"></u-icon>
										</view>
									</view>
								</view>
							</view>
						</view>
					</view>
				<!-- </scroll-view> -->
			</view>
			<u-popup :show="show" @close="close" closeable>
				<view class="bottom flex" style="justify-content: space-between;">
					<view class="review">
						<u-input :focus="focus"  placeholder="发表评论~" v-model="commentContent" />
					</view>
					<view>
						<u-button type="primary" size="mini" text="发送" @click="send"></u-button>
					</view>
				</view>
			</u-popup>
		<view class="bottom">
			<view class="input" @click="showComment">
				<input disabled placeholder="发表评论~" />
			</view>
			<view class="icon-box">
				<view class=" box" @click="onLike">
					<u-icon name="heart" color="#999" size="20" v-if="!showLike"></u-icon>
					<u-icon name="heart-fill" color="#FC0000FF" size="20" v-else></u-icon>
					<text class="num">{{likeNum||0}}</text>
				</view>
				<view class=" box" @click="onCollect">
					<u-icon name="star" color="#999" size="20" v-if="!showCollect"></u-icon>
					<u-icon name="star-fill" color="#FFA800FF" size="20" v-else></u-icon>
					<text class="num">{{collectNum||0}}</text>
				</view>

				<view class=" box">
					<button open-type="share" class="share-btn" >
						<u-icon name="share-square" color="#999" size="20"></u-icon>
						<text class="num">{{shareNum || 0}}</text>
					</button>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		getDetail,
		getCommentList,
		collect,
		like,
		concern,
		addNewsComment,
		deleteCircle,
		shareCommunityNews,
		deleteCommentById
	} from '@/api/community.js'
	export default {
		data() {
			return {
				id: '',
				showLike: false,
				likeNum: 0,
				showCollect: false,
				collectNum: 0,
				showConcern: false,
				shareNum: 0,
				data: {},
				show: false,
				commentList: [],
				getCommentList: "",
				commentContent: "",
				userId: this.$store.getters.userId,
				commentNewsId: null,
				pageNum:1,
				pageSize:10,
				total:0,
				
				focus:false, //自动对焦
			}
		},
		//分享
		onShareAppMessage() {
			shareCommunityNews(this.id).then(res => {
				if (res.code == 200) {
					this.shareNum++
				}
			})
			return {
				title: this.newsData.title,
				path: '/pagesB/community/details?id=' + this.id
			}

		},
		onLoad(option) {
			this.id = `${option.id}`
			console.log("id", this.id)
			this.getNewsDetail();
			this.getComment()
		},
		onReachBottom(){
			this.loadPaging()
		},
		methods: {
			previewImgs(i) {
				let imgs = this.data.imageList || []
				if (!imgs) return;
				uni.previewImage({
					urls: imgs,
					current: i || 0
				})
			},
			showComment(id) {
				this.show = true
				this.focus = true
				this.commentNewsId = id
				this.getComment()
			},
			getComment() {
				let params = {
					isAsc: 'desc',
					orderByColumn: 'create_time',
					pageNum: this.pageNum,
					pageSize: this.pageSize,
					newsId: this.id
				}
				// 获取评论列表
				getCommentList(params).then(res => {
					this.total = res.data.total
					let list = res.data.records
					if(res.data){
						let arr =  res.data.records
						if (this.pageNum == 1) {
							this.commentList = arr
						} else {
							this.commentList = this.commentList.concat(arr)
						}
					}
					
				})
			},
			getNewsDetail() {
				getDetail(this.id).then(res => {
					if (res.code == 200) {
						this.data = res.data
						this.showLike = this.data.isLike
						this.likeNum = this.data.likeNum
						this.showConcern = this.data.isConcern
						this.collectNum = this.data.collectNum
						this.shareNum = this.data.shareNum
					}
				})
			},

			close() {
				this.show = false
				this.focus = false
			},

			onLike() {
				var params = {
					typeId: this.id,
					type: 0 // 0-新闻点赞,1-评论点赞
				}
				like(params).then(res => {
					if (res.code == 200) {
						this.showLike = !this.showLike
						this.likeNum = res.data.likeNum
					}
					else {
						this.$ut.showText('操作失败，请稍后重试')
					}
				})
			},
			onCommentLike(item) {
				var params = {
					typeId: item.id,
					type: 1 // 0-新闻点赞,1-评论点赞
				}
				like(params).then(res => {
					if (res.code == 200) {
						item.isLike = !item.isLike
						item.likeNum = res.data.likeNum
					}
					else {
						this.$ut.showText('操作失败，请稍后重试')
					}
				})
			},
			onCollect() {
				var params = {
					newsId: this.data.id
				}
				collect(params).then(res => {
					if (res.code == 200) {
						this.showCollect = !this.showCollect
						this.collectNum = res.data.collectNum
					}
					else {
						this.$ut.showText('操作失败，请稍后重试')
					}
				})
			},

			onConcern(type) {
				var params = {
					concernId: this.data.userId
				}
				var that = this
				if (type == 1) {
					uni.showModal({
						title: '取消关注',
						content: '您是否不再关注该用户？',
						cancelText: '取消',
						confirmText: '确认',
						confirmColor: '#3B7EFFFF',
						success: function(res) {
							if (res.confirm) {
								concern(params).then(res => {
									if (res.code == 200) {
										that.showConcern = !that.showConcern
									}
								})
							}
						}
					})
				}
				else {
					concern(params).then(res => {
						if (res.code == 200) {
							that.showConcern = !that.showConcern
						}
					})
				}
			},
			send() {
				if (!this.commentContent) {
					this.$ut.showText("评论内容不能为空！")
					return
				}
				let data = {
					newsId: this.id,
					commentContent: this.commentContent
				}
				if (this.commentNewsId) {
					data.parentId = this.commentNewsId
				}

				addNewsComment(data).then(res => {
					if (res.code == 200) {
						this.getComment();
						this.$ut.showText("评论发布成功")
						this.commentNewsId = null
						this.commentContent = ''
						this.show = false
					}
				})
			},
			deleteCircle(id) {
				var that = this
				uni.showModal({
					title: '删除提醒',
					content: '您是否确认删除该文章？',
					cancelText: '取消',
					confirmText: '删除',
					confirmColor: '#3B7EFFFF',
					success: function(res) {
						if (res.confirm) {
							deleteCircle(id).then(res => {
								if (res.code == 200) {
									that.$ut.showText('删除成功！')
									uni.$emit('refreshCommunityNews')
									uni.navigateBack()
								}
							})
						}
					}
				})

			},
			deleteComment(id) {
				deleteCommentById(id).then(res=>{
					if (res.code == 200) {
						this.getComment()
					}
				})
			},
			
			//评论分页
			loadPaging(){
				if (this.pageNum * this.pageSize < this.total) {
					this.pageNum++
					this.getComment()
				}
			},
			
		}
	}
</script>

<style lang="less">
	page {
		background: #fff;
	}

	.title {
		font-size: 44rpx;
		color: #000;
		font-weight: 500;
		line-height: 1.5;
	}

	.img-box {
		width: 100%;
		height: 200rpx;
		margin-top: 15rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		/*.one{*/
		/*	width: 100%;*/
		/*	height: 100%;*/
		/*	border-radius: 10rpx;*/
		/*}*/
		/*.two{*/
		/*	width: calc(50% - 8rpx);*/
		/*	height: 100%;*/
		/*	border-radius: 10rpx;*/
		/*}*/
		/*.three{*/
		/*	width: calc(33% - 8rpx);*/
		/*	height: 100%;*/
		/*	border-radius: 10rpx;*/
		/*}*/
	}

	.up {
		display: flex;
		justify-content: space-between;

		.up-left {
			display: flex;
			align-items: center;

			.img {
				width: 50rpx;
				height: 50rpx;
				border-radius: 50%;
				flex-shrink: 0;
			}

			.text {
				margin-left: 20rpx;

				.name {
					font-size: 28rpx;
					color: #666;
				}

				.vice {
					font-size: 20rpx;
					color: #999;
				}
			}
		}

		.tag {
			width: 120rpx;
			height: 50rpx;
			background: linear-gradient(306deg, #3D65ED 0%, #00FFFF 100%);
			color: #fff;
			border-radius: 60rpx;
			font-size: 24rpx;
			padding: 5rpx 20rpx;

			.span {
				margin-left: 10rpx;
			}
		}
	}

	.cont {
		font-size: 32rpx;
		line-height: 1.8;
		color: #222;
	}

	.bottom {
		box-shadow: 0rpx -8rpx 20rpx 0rpx rgba(6, 63, 150, 0.1);
		position: fixed;
		left: 0;
		bottom: 0;
		z-index: 10;
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
			justify-content: flex-end;
			font-size: 24rpx;
			padding: 0 10rpx;
			box-sizing: border-box;
			color: #999;

			.box {
				flex: 1;
				display: flex;
				align-items: center;
				justify-content: flex-end;
				position: relative;

				.num {
					margin-left: 5rpx;
				}
			}
		}
	}

	.image-box {
		display: flex;
		flex-wrap: wrap;

		.img {
			width: 32%;
			height: 200rpx;
			margin-right: 7rpx;
		}
	}

	.popup {
		width: 100%;
		height: auto;
		background: #fff;
		padding-bottom: 100rpx;
		.scroll {
			width: 100%;
			min-height: 560rpx;
			padding: 0 30rpx;
			box-sizing: border-box;

			.list {
				width: 100%;
				min-height: 100rpx;
				display: flex;
				flex-wrap: wrap;
				justify-content: space-between;

				.avatar {
					width: 70rpx;
					height: 70rpx;
					border-radius: 50%;
					flex-shrink: 0;
					background: #fff;
				}

				.cont {
					width: calc(100% - 150rpx);

					.name {
						font-size: 28rpx;
						color: #999;
					}

					.text {
						margin-top: 10rpx;
						font-size: 28rpx;
						color: #333;
						font-weight: 500;
					}

					.date {
						margin-top: 10rpx;
						font-size: 24rpx;
						color: #999;
					}
				}

				.right {
					width: 50rpx;
					text-align: center;
					font-size: 24rpx;
					color: #999;

				}
			}
		}

		
	}

	.tags {
		font-size: 24rpx;
		border: 1rpx solid #DADADA;
		color: #DADADA;
		padding: 5rpx 15rpx;
		display: flex;
		align-items: center;
		border-radius: 50rpx;
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
	
	.review {
		width: 80%;
		height: 60rpx;
		border-radius: 80rpx;
		// background: #F8F8F8FF;
		font-size: 24rpx;
		padding: 0 20rpx;
		box-sizing: border-box;
	}
	/deep/ .u-input{
		padding: 0 0 0 20rpx !important;
	}
</style>