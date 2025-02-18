<template>
	<view>
		<z-paging ref="paging" v-model="dataList" @query="queryList">
			<template #top>
				<u-navbar title="健康社区" :placeholder="true">
					<view class="nav-left" slot="left">
						<u-icon name="search" color="#000" size="28"
							@click="$ut.jump('/pagesB/community/search')"></u-icon>
						<u-icon name="plus-circle-fill" color="#3B7EFF" size="24"
							@click="$ut.jump('/pagesB/community/publish')"></u-icon>
					</view>
				</u-navbar>
				<ut-tabs :tabList="tabTitle" :current='tabsIndex' @onItem="onItem"></ut-tabs>
			</template>
			<view class="view m-t2">
				<view class="up">
					<view class="user">
						<image class="img"
							:src='(userInfo&&userInfo.userAvatar)||"" '>
						</image>
						<view class="name">{{(userInfo&&userInfo.userName)||''}}</view>
					</view>
					<!--<view class="btn">编辑资料</view>-->
				</view>
				<view class="flex m-t2 font">
<!--					<view style="width: 20%;">昵称：{{userInfo.nickName}}</view>
					<u-line direction="col" color="#999" length="30rpx"></u-line>-->
					<view style="text-align: center;"> {{userInfo.userSex}}</view>
					<u-line direction="col" color="#999" length="30rpx"></u-line>
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

			<view class="fixed" @click="$ut.jump('/pagesB/community/publish')">
				<u-icon name="camera-fill" color="#fff" size="36"></u-icon>
				<view class="span">发布</view>
			</view>

			<view class="content" style="padding-top: 10rpx;">
				<u-tabs :list="tabList" @click="click"></u-tabs>
				<block v-for="(u,index_) in dataList" :key="index_">
					<ut-circle :data="u" @onConcern="onConcern" @deleteCircle="deleteCircle"></ut-circle>
				</block>
			</view>
			<template #bottom>
				<ut-bottomNav :value="1"></ut-bottomNav>
			</template>
		</z-paging>
	</view>
</template>

<script>
	import {
		newsPage,
		collectPage,
		getConcernCount,
		getUserInformation
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
				showW: false,
				currentTabName: '帖子'
			};
		},
		onLoad(options) {
			this.userId = options.id == null ? this.$store.getters.userId : options.id
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
			deleteCircle() {
				this.$refs.paging.reload()
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