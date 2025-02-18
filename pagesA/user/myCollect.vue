<template>
	<view>
		<z-paging ref="paging" v-model="list" @query="queryList">
			<template #top>
				<ut-nav title="我的收藏" border></ut-nav>
				<view class="content">
					<u-search placeholder="搜索" :showAction='false' bgColor='#F6FBFFFF' v-model="keyword"
						@change="select()"></u-search>
				</view>
			</template>
			<view class="content">
				<utSilder :list="list" @onClick="onClick"></utSilder>
			</view>
		</z-paging>
	</view>
</template>

<script>
	import {
		getCollectList,
		getEditList
	} from '@/api/personalCenter/personalCenter.js'
	import utSilder from "../component/ut-slider/ut-slider.vue"
	export default {
		data() {
			return {
				list: [],
				keyword: '',
				userId: '',
			};
		},
		components:{utSilder},
		created() {
			this.userId = this.$store.getters.userId
			// this.getIdList();

		},
		methods: {
			queryList(){
				getCollectList(this.userId, this.keyword).then(res => {
					// this.list = res.data;
					this.$refs.paging.complete(res.data);
				});
			},
			onClick(item) {
				uni.navigateTo({
					url: '/pagesA/index/news/news-detalis?id=' + item.id
				});
			},
			select(e) {
				this.keyword = e;
				this.$refs.paging.reload();
			},
			getIdList() {
				getCollectList(this.userId, this.keyword).then(res => {
					this.list = res.data;
				});
			},

		}


	}
</script>

<style lang="less">
	page {
		background: #fff;
	}
</style>