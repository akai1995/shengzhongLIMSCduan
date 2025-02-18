<template>
	<view>
		<z-paging ref="paging" v-model="dataList" @query="queryList">
			<template #top>
				<ut-nav title="Ta 主页" border></ut-nav>
			</template>
			<view class="view">
				<view class="up">
					<view class="user">
						<image class="img"
							:src='(userInfo&&userInfo.userAvatar)||"" '>
						</image>
						<view class="name">{{(userInfo&&userInfo.userName)||''}}</view>
					</view>
					<view>
						<view class="btn m-r2" @click.stop="concern(userInfo)" v-if="userInfo.concernFlag" style="color: #999;border: 2rpx solid #999">已关注</view>
						<view class="btn m-r2" @click.stop="concern(userInfo)" v-else>+ 关注</view>
						<view class="btn" @click="jumpConsult"> 发私信</view>
					</view>
				</view>
				<view class="flex m-t2 font">
<!--					<view style="width: 20%;">昵称：{{userInfo.nickName}}</view>
					<u-line direction="col" color="#999" length="30rpx"></u-line>-->
					<view style="text-align: center;"> {{userInfo.userSex}}</view>
					<!-- <u-line direction="col" color="#999" length="30rpx"></u-line> -->
					<view style="width: 30%;text-align: center;">IP属地：云南</view>
				</view>
				<view class="m-t2 font">生动有趣的个性签名个容易受到关注</view>
				<view class="flex m-t2">
					<view class="flex" style="width: 30%;">
						<view class="h1 m-r1">{{userInfo.likeNum||0}}</view>
						<view class="font">获赞</view>
					</view>
					<view class="flex" style="width: 30%;" @click="$ut.jump('/pagesA/user/myFollow?userId='+ userInfo.userId)">
						<view class="h1 m-r1">{{userInfo.concernNum}}</view>
						<view class="font">关注</view>
					</view>
					<view class="flex" style="width: 30%;" @click="$ut.jump('/pagesA/user/myVermicelli?userId='+ userInfo.userId)">
						<view class="h1 m-r1">{{userInfo.fansNum}}</view>
						<view v-if="showW">w</view>
						<view class="font">粉丝</view>
					</view>
				</view>
			</view>
			
			<view class="content" style="padding-top: 10rpx;">
				<u-tabs :list="tabList" @click="click"></u-tabs>
				<block v-for="(u,index_) in dataList" :key="index_">
					<ut-circle :data="u" @onConcern="onConcern"></ut-circle>
				</block>
			</view>
			
		</z-paging>
	</view>
</template>

<script>
	import {
		newsPage,
		collectPage,
		getUserInformation,
		concern
	}
	from "@/api/community.js";
	export default {
		data() {
			return {
				tabsIndex: 2,
				tabTitle: [{
					name: '关注',
					id: 0
				}, {
					name: '发现',
					id: 1
				}, {
					name: '我的社区',
					id: 2
				}],
				dataList: [],
				tabList: [{ name: '帖子' }, { name: '我的收藏' }],
				userId: null,
				userInfo: null,
				isConcern: false,
				showW: false,
				currentTabName: '帖子'
			};
		},
		onLoad(options) {
			this.userId = options.id
			// 获取用户信息
			this.getUser()
			//this.getCount()
			
			uni.$on('refreshCommunityNews',()=>{
				this.queryList(1,10)
			})
		},
		methods: {
			queryList(pageNo, pageSize) {
				uni.showLoading()
				let params = {
					isAsc: 'desc',
					orderByColumn: 'create_time',
					pageNum: pageNo,
					pageSize: pageSize,
					userId: this.userId
				}
				if (this.currentTabName == '帖子') {
					newsPage(params).then(res => {
						uni.hideLoading()
						if (res.code == 200) {
							this.$refs.paging.complete(res.data.records);
						}
					}).catch(err => {
						uni.hideLoading()
					})
				}
				else {
					collectPage(params).then(res => {
						uni.hideLoading()
						if (res.code == 200) {
							this.$refs.paging.complete(res.data.records);
						}
					}).catch(err => {
						uni.hideLoading()
					})
				}

			},
			getUser() {
				getUserInformation(this.userId).then(res => {
					if (res.code == 200) {
						console.log('=====', res.data)
						this.userInfo = res.data
					}
				})
			},
			onItem(e, index) {
				this.tabsIndex = index
				if (e.id == 1) {
					uni.redirectTo({
						url: '/pages/community/community'
					})
				}
				else if (e.id == 0) {
					uni.redirectTo({
						url: '/pages/community/follow'
					})
				}
			},
			click(item) {
				if (item.name == '我的收藏') {
					this.currentTabName = '我的收藏'
				}
				else {
					this.currentTabName = '帖子'
				}
				this.$refs.paging.reload();
			},
			onConcern(userId) {
				this.circleList.forEach(item=>{
					if (item.userId === userId) {
						this.$set(item, 'isConcern', !item.isConcern)
					}
				})
			},
			//私信
			jumpConsult(){
				uni.navigateTo({
					url:'/pagesA/expert/consult?senderId='+ this.userInfo.userId +'&fromName='+this.userInfo.userName,
				})
			},
			concern(userInfo) {
				var params = {
					concernId: userInfo.userId
				}
				var that = this;
				if (userInfo.concernFlag) {
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
										that.$set(userInfo, 'concernFlag', !userInfo.concernFlag)
										that.$refs.paging.reload()
									}
								})
							}
						}
					})
				} else {
					concern(params).then(res=>{
						if (res.code==200) {
							that.$set(userInfo, 'concernFlag', !userInfo.concernFlag)
							that.$refs.paging.reload()
						}
					})
				}
			}
		}
	}
</script>

<style lang="less">
	.nav-left {
		display: flex;
		align-items: center;

		/deep/ .u-icon {
			margin-left: 10rpx;
		}
	}

	.view {
		width: 100%;
		background: #fff;
		padding: 30rpx;
		box-sizing: border-box;
		position: relative;

		.up {
			display: flex;
			justify-content: space-between;

			.user {
				.img {
					width: 100rpx;
					height: 100rpx;
					border-radius: 50%;
				}

				.name {
					color: #222;
					font-size: 36rpx;
					font-weight: 500;
				}
			}

			.btn {
				display: inline-table;
				font-size: 24rpx;
				color: #3B7EFFFF;
				padding: 10rpx 20rpx;
				border-radius: 60rpx;
				border: 2rpx solid #3B7EFF;
			}
		}
	}

	.font {
		font-size: 24rpx;
		color: #999;
	}

	.fixed {
		position: fixed;
		right: 30rpx;
		bottom: 33%;
		z-index: 10;
		width: 120rpx;
		height: 120rpx;
		border-radius: 50%;
		background: linear-gradient(135deg, #00DEFF 0%, #0C5FFF 100%);
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: center;
		color: #fff;
		font-size: 18rpx;

		.span {
			position: absolute;
			bottom: 10%;
		}
	}
</style>