<template>
	<view>
		<z-paging ref="paging" v-model="dataList" @query="queryList">
			<template #top>
				<u-navbar title="健康社区" :placeholder="true">
					<view class="nav-left" slot="left">
						<u-icon name="search" color="#000" size="28" @click="$ut.jump('/pagesB/community/search')"></u-icon>
						<u-icon name="plus-circle-fill" color="#3B7EFF" size="24" @click="$ut.jump('/pagesB/community/publish')"></u-icon>
					</view>
				</u-navbar>
				<ut-tabs :tabList="tabTitle" :current='tabsIndex' @onItem="onItem"></ut-tabs>
			</template>	
			<view class="content">
				<view class="width">
					<scroll-view scroll-x class="scroll">
						<view class="flex">
							<view class="scroll-item" v-for="(item,index) in concernList" :key="index">
								<view  @click="$ut.jump('/pagesB/community/taHomePages?id='+item.id)">
									<view class="img-box">
										<image class="img" :src='(item && item.avatar) || ""'></image>
									</view>
									<view class="name m-t2">{{item.name}}</view>
								</view>
							</view>
						</view>
						
					</scroll-view>
				</view>
				
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
		selectConcernList,
		concernPage
	} from "@/api/community.js";

	export default {
		data() {
			return {
				tabsIndex:0,
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
				dataList:[],
				concernList: []
			};
		},
		onLoad() {
			this.getConcernList()
			
			uni.$on('refreshCommunityNews',()=>{
				this.queryList(1,10)
			})
		},
		methods:{
			queryList(pageNo,pageSize) {
				uni.showLoading()
				this.getConcernList();
				let params = {
					isAsc: 'desc',
					orderByColumn: 'create_time',
					pageNum: pageNo,
					pageSize: pageSize,
					userId: this.$store.getters.userId
				}
				concernPage(params).then(res=>{
					uni.hideLoading()
					if (res.code == 200) {
						this.$refs.paging.complete(res.data.records);
					}
				})
			},
			getConcernList() {
				var params = {
					userId: this.$store.getters.userId,
					type: "user_concern:"
				}
				selectConcernList(params).then(res=>{
					if (res.code==200) {
						this.concernList = res.data
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
				else if (e.id == 2) {
					uni.redirectTo({
						url: '/pages/community/community-my'
					})
				}
			},
			onConcern(userId) {
				this.$refs.paging.reload();
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
	.scroll{
		width: 100%;
		height: 160rpx;
		display: inline-flex;
		white-space: nowrap;
		&-item{
			width: 100rpx;
			height: 100%;
			margin-right:40rpx;
			display: flex;
			flex-wrap: wrap;
			justify-content: center;
			.img-box{
				width: 100rpx;
				height: 100rpx;
				border: 3rpx solid #3B7EFFFF;
				border-radius: 50%;
				display: flex;
				align-items: center;
				justify-content: center;
				overflow: hidden;
				.img{
					width: 95rpx;
					height: 95rpx;
					border:3rpx solid #FFF;
				}
			}
			.name{
				width: 100%;
				text-align: center;
				color: #333;
				font-size: 24rpx;
			}
			
		}
	}
</style>
