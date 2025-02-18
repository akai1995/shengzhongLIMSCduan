<template>
	<view>
		<z-paging ref="paging" v-model="newsList" @query="queryList">
			<template #top>
				<ut-nav title="信息检索" border></ut-nav>
				<view class="search" @onClick="doSearch()">
					<view class="left">
						<u-search placeholder="搜索" :showAction='false' v-model="keyWord" @clickIcon="doSearch()"
							@search="doSearch()" @custom="doSearch()"></u-search>
					</view>
				</view>
			</template>

			<view class="content" v-if="newsList.length != 0">
				<view class="ut-view">
					<view>
						<ut-drug :list="newsList" @onClick="newsView"></ut-drug>
					</view>
				</view>
			</view>
		</z-paging>

	</view>
</template>

<script>
	import {
		indexSearch,
		getNewsInfo,
		getdDrugInfo
	} from '@/api/generalcontent/drugSearch.js'
	export default {
		data() {
			return {
				keyWord: "",
				newsList: [],
				show: true,
			};
		},
		onLoad(param) {
			this.keyWord = param.keyWord
		},
		methods: {
			queryList(pageNo, pageSize) {
				let params = {
					// currentPage:pageNo,
					// pageSize:pageSize,
					keyWord: this.keyWord
				}
				indexSearch(this.keyWord, pageNo, pageSize).then(res => {
					if (res.code == 200) {
						this.$refs.paging.complete(res.data.recordList);
					}
				})
			},
			doSearch() {
				let keyWord = this.keyWord
				indexSearch(keyWord).then(res => {
					if (res.code == 200) {
						this.newsList = res.data.recordList
					}
				})
			},
			newsView(item) {
				let infoType = item.infoType
				if (infoType == "drug") {
					//页面跳转并传递参数
					uni.navigateTo({
						url: '/pagesA/drug/drug-info?drugId=' + item.infoId
					});
				} else if (infoType == "news") {
					//页面跳转并传递参数
					uni.navigateTo({
						url: '/pagesA/index/news/news-detalis?id=' + item.infoId + '&type=' + item.newsTypeCode
					});
				}

			}
		}
	}
</script>

<style lang="less">
	.search-txt {
		width: 100%;
		margin: 8px auto -5px auto;

		.u-page__tag-item {
			width: 85%;
			margin: 0 auto;
		}
	}

	.tabs {
		background: #fff;

		.slot {
			width: 60rpx;
			display: flex;
			align-items: center;
			justify-content: center;
		}
	}

	.search {
		width: 85%;
		margin: 15px auto 10px auto;
		display: flex;
		align-items: center;
		justify-content: space-between;
		font-size: 30rpx;

		.left {
			width: 100%;
		}

		.right {
			width: 70rpx;
			color: #999;
			font-size: 32rpx;
		}
	}
</style>