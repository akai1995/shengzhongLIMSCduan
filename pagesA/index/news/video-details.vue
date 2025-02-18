<template>
	<view>
		<ut-nav title="新闻中心" border></ut-nav>
		<view class="content">
			<video class="video" v-if="newsData.videoUrl !=null" :src="newsData.videoUrl"></video>

			<!-- <view class="title">{{topTitle}}</view> -->
			<view class="title ">{{newsData.title}}</view>
			<view class="flex j-c">
				<view class="font">
					<text class="m-r2">{{newsData.createTime}}</text>
					<text class="m-r2" v-if="newsData.readCount">阅读量 {{newsData.readCount}}</text>
				</view>
				<!-- <view class="flex">
					<u-tag size="mini" icon="volume-fill"></u-tag>
					<text class="font1">转音频</text>
				</view> -->
			</view>
			<view class="details m-t3">
				<!-- <view class="details m-t3" v-html="content"></view> -->
				<rich-text class="rich" :nodes="content"></rich-text>
			</view>

		</view>
		<view>
			<!-- <u-sticky offsetTop='90'> -->
				<ut-tabs :tabList="tabList" @onItem="onItem"></ut-tabs>
			<!-- </u-sticky> -->

			<view class="tab-box">
				<view v-if="current == 0">
					<utVideo :list="listData"></utVideo>
				</view>
				<view v-if="current == 1">
					<hb-comment ref="hbComment" :deleteTip="'确认删除？'" :cmData="commentData" :ncData="ncData"
						v-if="commentData"></hb-comment>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		getNewsList,
		getTestProjectList,
		getNewsListDetailById,
		getTestProjectDetailById,
		commentList,
	} from '@/api/generalcontent/generalcontent.js'
	import hbComment from '../../component/hb-comment/hb-comment.vue'
	import utVideo from "../../component/ut-video/ut-video.vue"
	export default {
		components:{
			hbComment,utVideo
		},
		data() {
			return {
				id: 0,
				newsData: null,
				content: null,
				type: null,
				topTitle: null,
				topTime: null,
				topContent: null,
				topVideo: null,
				videoUrl: null,
				current: 0,
				tabList: [{
					name: '推荐'
				}, {
					name: '评论'
				}],

				listData: [],
				commentData: {},
				readNumer: 0,
				commentList: [],
				ncData:{
					newsId:null,
					title:null,
				}
			}
		},
		onLoad(option) {
			this.id = option.id
			this.type = option.type
			
			this.ncData.newsId = option.id
			this.ncData.title = option.title
			if (this.type == "检测项目") {
				this.getTestProjectDetail();
				this.getTestProjectLists();
			} else {
				this.getNewsDetail();
			}
		},
		methods: {
			onItem(item, index) {
				this.current = index
				if (item.name == "评论") {
					this.getCommentLists();
					this.commentData = {
						"readNumer": this.readNumer,
						"commentSize": this.commentList.length,
						"comment": this.getTree(this.commentList)
					}
				}
			},
			//检测项目列表
			getTestProjectLists() {
				let params = {
					isAsc: 'desc',
					orderByColumn: 'create_time',
					pageNum: 1,
					pageSize: 10,
				}
				getTestProjectList(params).then(res => {
					if (res.code == 200) {
						this.listData = res.data.records
					}
				})
			},
			//新闻列表
			getNewsLists() {
				let params = {
					isAsc: 'desc',
					orderByColumn: 'create_time',
					pageNum: 1,
					pageSize: 10,
					type: this.type
				}
				getNewsList(params).then(res => {
					if (res.code == 200) {
						this.listData = res.data.records
					}
				})
			},
			//获取新闻详情
			getNewsDetail() {
				getNewsListDetailById(this.id).then(res => {
					this.newsData = res.data
					this.content = this.newsData.htmlContent.replace(/\<img/gi, '<img style="width:100%;height:auto" ')
					this.getNewsLists();
					this.getCommentLists();
					/* this.topTitle = data[0].title;
					this.topTime = data[0].createTime;
					this.topContent = data[0].htmlContent;
					this.topVideo = data[0].videoUrl;
					this.readNumer = data[0].readCount; */
				})
			},
			//获取检测项目详情
			getTestProjectDetail() {
				getTestProjectDetailById(this.id).then(res => {
					if (res.code == 200) {
						let data = res.data;
						this.newsData = data
						console.log(this.newsData)
						this.content = data.clinicalValue.replace(/\<img/gi, '<img style="width:100%;height:auto" ');
						this.getCommentLists();
						/* this.topTitle = data.title;
						this.topTime = data.createTime;

						this.topContent = data.clinicalValue; */
					}

				})
			},
			//评论评价列表
			getCommentLists() {
				commentList(this.id).then(res => {
					console.log("comment:",res)
					if (res.code == 200) {
						this.commentList = res.data
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
			}
		}
	}
</script>

<style lang="less" scoped>
	.content {
		background: #fff;
	}

	.video {
		width: 100%;
		height: 430rpx;
		margin-bottom: 40rpx;
	}

	.title {
		color: #000;
		font-size: 32rpx;
		font-weight: 600;
		letter-spacing: 2rpx;
		line-height: 2;
	}

	.font {
		color: #999;
		font-size: 24rpx;
	}

	.font1 {
		color: #3B7EFFFF;
		font-size: 24rpx;
		margin-left: 20rpx;
	}

	.details {
		color: #333;
		font-size: 28rpx;
	}

	.tab-box {
		width: 100%;
		height: auto;
		box-sizing: border-box;
		padding: 30rpx;
	}

	/deep/ .rich img {
		width: 100%;
	}
</style>
