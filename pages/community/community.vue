<template>
	<view>
		<z-paging-swiper>
			<template #top>
				<u-navbar title="肿瘤社区" :placeholder="true">
					<view class="nav-left" slot="left">
						<u-icon name="search" color="#000" size="28" @click="$ut.jump('/pagesB/community/search')"></u-icon>
						<u-icon name="plus-circle-fill" color="#3B7EFF" size="24"  @click="$ut.jump('/pagesB/community/publish')"></u-icon>
					</view>
				</u-navbar>
				<ut-tabs :tabList="tabTitle" :current='tabsIndex' @onItem="onItem"></ut-tabs>
				<z-tabs ref="tabs" :list="tabList" :current="current" @change="tabsChange" tab-width="120" bar-height="0"/>
			</template>
			<swiper class="swiper" :current="current" @transition="swiperTransition" @animationfinish="swiperAnimationfinish">
				<swiper-item class="swiper-item" v-for="(item, index) in tabList" :key="index">
					<!-- 这里的swiper-list-item为demo中为演示用定义的组件，列表及分页代码在swiper-list-item组件内 -->
					<!-- 请注意，swiper-list-item非z-paging，在自己的项目中必须自己创建，若未创建则会报组件不存在的错误 -->
					<!-- <swiper-list-item :tabIndex="index" :currentIndex="current"></swiper-list-item> -->
						<block v-for="u in circleList" :key="u.id">
							<ut-circle :data="u" @onConcern="onConcern" @deleteCircle="deleteCircle"></ut-circle>
						</block>
					<ut-nodata v-if="circleList.length==0"></ut-nodata>
				</swiper-item>
			</swiper>
			<template #bottom>
				<ut-bottomNav :value="1"></ut-bottomNav>
			</template>
		</z-paging-swiper>
	</view>
	
</template>

<script>
	import {
		newsPage,
		searchLink
	} from "@/api/community.js";

	export default {
		data() {
			return {
				pageNo: 1,
				pageSize: 10,
				total: null,
				tabsIndex:1,
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
				current:0,
				tabList:[],
				circleList:[]
			};
		},
		onLoad() {
			// 获取栏目信息列表
			this.getLinkLists()
			
			uni.$on('refreshCommunityNews',()=>{
				this.getNewsLists()
			})
		},
		watch: {
			tabList: {
				immediate: true,
				handler() {
					this.getNewsLists()
				}
			},
		},
		methods: {
			onItem(e,index){
				this.tabsIndex = index
				if(e.id == 0){
					uni.redirectTo({
						url:'/pages/community/follow'
					})
				}else if(e.id == 2){
					uni.redirectTo({
						url:'/pages/community/community-my'
					})
				}
			},
			onConcern(userId) {
				this.circleList.forEach(item=>{
					if (item.userId === userId) {
						this.$set(item, 'isConcern', !item.isConcern)
					}
				})
			},
			tabsChange(index){
				this.current = index;
				this.getNewsLists();
			},
			//swiper滑动中
			swiperTransition(e) {
				this.$refs.tabs.setDx(e.detail.dx);
			},
			//swiper滑动结束
			swiperAnimationfinish(e) {
				this.current = e.detail.current;
				this.$refs.tabs.unlockDx();
				this.getNewsLists()
			},
			loadUp() {
				if (this.pageNo * this.pageSize < this.total) {
					this.pageNo++
					this.getNewsLists()
				}
			},
			getLinkLists() {
				searchLink().then(res=>{
					this.tabList = res.data
					this.tabList.unshift({
						name: '推荐'
					})
				})
			},
			getNewsLists() {
				if (this.tabList.length == 0) {
					return
				}
				var data = {
					isAsc: 'desc',
					orderByColumn: 'create_time',
					pageNum: this.pageNo,
					pageSize: this.pageSize,
					newsState: 1 // 0未审核 1审核通过 2审核未通过
				}
				if (this.tabList[this.current].id) { // 栏目文章
					data.linkId = this.tabList[this.current].id // 栏目id
				} else { // 推荐
					data.isSuggest = 1
				}
				uni.showLoading()
				newsPage(data).then(res => {
					if (res.code == 200) {
						let data = res.data
						this.total = data.recordCount
						if(data.records){
							var newList = data.records
							if (this.pageNo == 1) {
								this.circleList = newList
							} else {
								this.circleList = this.circleList.concat(newList)
							}
						}
						uni.hideLoading()
					}
				})
			},
			deleteCircle() {
				this.getNewsLists()
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
	.swiper{
		height: 100%;
	}
	.swiper-item{
		padding: 0 30rpx;
		box-sizing: border-box;
		overflow-y: auto;
		padding-bottom: 20rpx;
	}
</style>