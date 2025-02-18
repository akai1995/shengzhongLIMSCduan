<template>
	<view>
		<z-paging ref="paging" v-model="dataList" @query="queryList">
			<template #top>
				<ut-nav title="搜索" border></ut-nav>
				<view class="search-box">
					<u-search placeholder="搜索"  :showAction='false' bgColor='#F8F8F8FF' v-model="keyword" @clickIcon="search" @search="search"></u-search>
				</view>
			</template>
			<view class="content">
				<view v-if="isHistory">
					<view class="m-t3 width flex j-c">
						<view class="h1">历史记录</view>
						<view>
							<u-icon name="trash" color="#000000E6" size="20" @click="cleanHistory"></u-icon>
						</view>
					</view>
					<view class="box m-t3">
						<block v-for="(item,index) in searchHistoryList" :key="index">
							<view class="tag" @click="setHistoryValue(item)">{{item}}</view>
						</block>
					</view>
				</view>
				<view>
					<drug-list :list="dataList" @onClick="onClick"></drug-list>
				</view>
			</view>
		</z-paging>

	</view>
</template>

<script>
	import {searchall} from '@/api/generalcontent/drugSearch.js';
	import drugList from '../components/drug-list/drug-list.vue'
	export default {
		data() {
			return {
				keyword:'',
				isHistory: false,
				searchHistoryList: [],
				dataList: []
			};
		},
		async onLoad() {
			let list = await uni.getStorage({
				key: 'searchList'
			});
			if (list[1].data) {
				this.searchHistoryList = JSON.parse(list[1].data);
			}
			if (this.searchHistoryList.length > 0) {
				this.isHistory = true
			} else {
				this.isHistory = false
			}
		},
		components:{
			drugList
		},
		watch: {
			searchHistoryList() {
				if (this.searchHistoryList.length) {
					this.isHistory = true
				} else {
					this.isHistory = false
				}
			}
		},
		methods: {
			search() {
				if (!this.keyword) {
					this.$ut.showText('搜索框不能为空')
					return
				}
				if (!this.searchHistoryList.includes(this.keyword)) {
					this.searchHistoryList.unshift(this.keyword);
					uni.setStorage({
						key: 'searchList',
						data: JSON.stringify(this.searchHistoryList)
					});
					if (this.searchHistoryList.length>10) { // 只保留十条搜索记录
						this.searchHistoryList.splice(this.searchHistoryList.length-1, 1);
					}
				} else {
					//有搜索记录，删除之前的旧记录，将新搜索值重新push到数组首位
					let i = this.searchHistoryList.indexOf(this.keyword);
					this.searchHistoryList.splice(i, 1);
					this.searchHistoryList.unshift(this.keyword);
					uni.setStorage({
						key: 'searchList',
						data: JSON.stringify(this.searchHistoryList)
					});
				}
				this.$refs.paging.reload()
			},
			queryList(pageNo, pageSize){
				if (!this.keyword) return
				let params = {
					pageNum:pageNo,
					pageSize:pageSize,
					keyword:this.keyword
				}
				uni.showLoading()
				searchall(params).then(res =>{
					uni.hideLoading()
					if(res.code == 200){
						this.$refs.paging.complete(res.data);
						this.isHistory = false
					}
				}).catch(err =>{
					uni.hideLoading()
				})
			},
			setHistoryValue(item) {
				this.keyword = item
				this.$refs.paging.reload()
			},
			cleanHistory() {
				uni.showModal({
					title: '提示',
					content: '是否清理全部搜索历史？该操作不可逆。',
					success: res => {
						if (res.confirm) {
							uni.removeStorage({
								key: 'searchList'
							});
							this.searchHistoryList = [];
							console.log(this.searchHistoryList)
							if (this.searchHistoryList.length > 0) {
								this.isHistory = true
							} else {
								this.isHistory = false

							}
						}
					}
				})
			},
			onClick(item){
				if(item.type == 1){
					this.$ut.jump('/pagesA/drug/drugDetails?id='+item.id+'&title='+item.title)
				}else if(item.type == 2){
					this.$ut.jump('/pagesA/index/class/card?id='+item.id)
				}else if(item.type == 3){
					this.$ut.jump('/pagesA/index/news/news-detalis?id='+item.id)
				}
			}
		}
	}
</script>

<style lang="less">
page{
	background: #fff;
}
.search-box{
	padding: 30rpx 30rpx 0 30rpx;
}
.box{
	width: 100%;
	display: flex;
	flex-wrap: wrap;
	.tag{
		padding: 10rpx 20rpx;
		border-radius: 50rpx;
		font-size: 22rpx;
		border: 1rpx solid #DADADAFF;
		color:#333;
		margin-right: 20rpx;
		margin-bottom: 20rpx;
	}
	.box-item{
		width: 50%;
		font-size: 24rpx;
		color: #333;
		margin-bottom: 20rpx;
	}
}
.vice{
	color: #999;
	font-size: 22rpx;
	margin-left: 10rpx;
}
</style>
