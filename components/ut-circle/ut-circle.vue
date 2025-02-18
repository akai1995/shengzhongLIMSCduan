<template>
	<view class="ut-view">
		<view @click="jump">
			<view class="up">
				<view class="up-left">
					<image class="img" :src='(data && data.userAvatar) || ""'></image>
					<view class="text">
						<view class="name">{{data.userName||''}}</view>
						<view class="vice">
							<text>{{data.linkName||''}}</text>
							<text>{{ $ut.strSlice(createTime) ||''}}</text>
							<text>{{data.newsLocation||''}}</text>
						</view>
					</view>
				</view>
				<view class="tag-box" v-if="!isMySelf && !isSearch">
					<!-- <u-tag text="关注" size="mini" icon="plus" plain shape="circle" @click.stop="onConcern(0)" v-if="!data.isConcern"></u-tag> -->
					<!-- <u-tag text="已关注" size="mini" icon="checkbox-mark" plain shape="circle" @click="onConcern(1)" borderColor="#1E0B29" color="#1E0B29" v-else></u-tag> -->
					<view class="tags1" @click.stop="onConcern(0)" v-if="!data.isConcern">
						<u-icon name="plus" color="#3B7EFFFF" size="28rpx"></u-icon>
						<text>关注</text>
					</view>
					<view class="tags"  @click.stop="onConcern(1)" v-else>
						<u-icon name="checkmark" color="#DADADA" size="28rpx"></u-icon>
						<text>已关注</text>
					</view>
				</view>
			</view>
			<view class="title ellipsis2">{{data.newsTitle}}</view>
			<view class="cont ellipsis2">{{formattedData(data.newsContent)}}</view>
			<view class="img-box">
				<block v-for="(item, index) in data.imageList" :key="index">
					<image :class="imgClass" :src="item" mode="aspectFill"></image>
				</block>
			</view>
		</view>
		<view class="bottom" v-if="!isSearch">
			<view>阅读 {{data.readNum}}</view>
			<view class="icon-box">
				<!--<view @click="deleteCircle(data.id)" v-if="isMySelf">
					<u-icon name="trash" color="#999" size="20"></u-icon>
				</view>-->
				<view class=" box" @click="onLike(0)">
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
					<u-icon name="share-square" color="#999" size="20"></u-icon>
					<text class="num">{{shareNum||0}}</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		collect,
		like,
		concern,
		selectConcernIds,
		deleteCircle,
		shareCommunityNews
	} from "@/api/community.js";
	export default {
		name:"ut-circle",
		props:['data', 'isSearch'],
		data() {
			return {
				showLike: this.data.isLike,
				likeNum: this.data.likeNum,
				shareNum: this.data.shareNum,
				showCollect: this.data.isCollect,
				collectNum: this.data.collectNum,
				concernList: []
			};
		},
		computed: {
			isMySelf() {
				return this.data.userId === this.$store.getters.userId
			},
			imgClass() {
				return this.data.imageList.length == 3 ? 'three' : this.data.imageList.length == 2 ? 'two' : 'one'
			},
			createTime() {
				return uni.$u.timeFormat(this.data.createTime, 'yyyy-mm-dd hh:ss')
			}
		},
		methods: {
			jump() {
				uni.navigateTo({
					url:'/pagesB/community/details?id='+this.data.id
				})
			},
			onLike(type) {
				var params = {
					typeId: this.data.id,
					type: type // 0-新闻点赞,1-评论点赞
				}
				like(params).then(res=>{
					if (res.code==200) {
						this.showLike = !this.showLike
						this.likeNum = res.data.likeNum
					}
				})
			},
			onCollect() {
				var params = {
					newsId: this.data.id
				}
				collect(params).then(res=>{
					if (res.code==200) {
						this.showCollect = !this.showCollect
						this.collectNum = res.data.collectNum
					}
				})
			},
			//分享
			onShareAppMessage() {
				shareCommunityNews(this.id).then(res=>{
					if(res.code == 200){
						this.shareNum ++
					}
				})
				return {
					title: this.newsData.title,
					path: '/pagesB/community/details?id='+this.id
				}

			},
			onConcern(type) {
				var params = {
					concernId: this.data.userId
				}
				var that = this;
				if (type==1) {
					uni.showModal({
						title: '取消关注',
						content: '您是否不再关注该用户？',
						cancelText: '取消',
						confirmText: '确认',
						confirmColor: '#3B7EFFFF',
						success: function(res) {
							if (res.confirm) {
								concern(params).then(res=>{
									if (res.code==200) {
										that.$emit('onConcern', that.data.userId)
									}
								})
							}
						}
					})
				} else {
					concern(params).then(res=>{
						if (res.code==200) {
							that.$emit('onConcern', that.data.userId)
						}
					})
				}
			},
			getConcernList() {
				var params = {
					userId: this.$store.getters.userId,
					type: "user_concern:"
				}
				selectConcernIds(params).then(res=>{
					if (res.code==200) {
						this.concernList = res.data
					}
				})
			},
			deleteCircle(id) {
				deleteCircle(id).then(res=>{
					if (res.code==200) {
						this.$emit('deleteCircle')
					}
				})
			},
			formattedData(txt){
			    return txt.replace(/<(\/)?p>/g, '\n');
			},
		}
	}
</script>

<style lang="less">
	.ut-view{
		margin-top: 20rpx;
		.up{
			display: flex;
			justify-content: space-between;
			position: relative;
			.up-left{
				width: 80%;
				display: flex;
				align-items: center;
				.img{
					width: 50rpx;
					height: 50rpx;
					border-radius: 50%;
					flex-shrink: 0;
				}
				.text{
					margin-left: 20rpx;
					.name{
						font-size: 28rpx;
						color: #666;
					}
					.vice{
						font-size: 20rpx;
						color: #999;
						
						text{
							margin-right: 5rpx;
						}
					}
				}
			}
			.tag-box{
				position: absolute;
				top: 0rpx;
				right: 0rpx;
				z-index: 9;
			}
		}
		.title{
			font-size: 28rpx;
			color: #000;
			font-weight: 600;
			margin-top: 10rpx;
		}
		.cont{
			margin-top: 10rpx;
			font-size: 26rpx;
			color: #999;
		}
		.img-box{
			width: 100%;
			height: 200rpx;
			margin-top: 15rpx;
			display: flex;
			align-items: center;
			justify-content: space-between;
			.one{
				width: 100%;
				height: 100%;
				border-radius: 10rpx;
			}
			.two{
				width: calc(50% - 8rpx);
				height: 100%;
				border-radius: 10rpx;
			}
			.three{
				width: calc(33% - 8rpx);
				height: 100%;
				border-radius: 10rpx;
			}
		}
		.bottom{
			margin-top: 15rpx;
			display: flex;
			align-items: center;
			justify-content: space-between;
			color: #999;
			font-size: 24rpx;
			.icon-box{
				width: 50%;
				display: flex;
				justify-content: flex-end;
				.box{
					flex: 1;
					display: flex;
					align-items: center;
					justify-content: flex-end;
					.num{
						margin-left: 5rpx;
					}
				}
			}
		}
	}
	
	.tags{
		font-size: 24rpx;
		border: 1rpx solid #DADADA;
		color: #DADADA;
		padding: 5rpx 15rpx;
		display: flex;
		align-items: center;
		border-radius: 50rpx;
		white-space: nowrap;
	}
	.tags1{
		font-size: 24rpx;
		border: 1rpx solid #3B7EFFFF;
		color: #3B7EFFFF;
		padding: 5rpx 15rpx;
		display: flex;
		align-items: center;
		border-radius: 50rpx;
		white-space: nowrap;
	}
	
	/deep/.u-icon__icon{
		font-size: 24rpx !important;
	}

	/deep/ .u-icon__primary {
		color: #333 !important;
	}
</style>