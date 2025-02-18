<template>
	<view>
		<z-paging ref="paging" v-model="newData" @query="queryList">
			<template #top>
				<ut-nav title="肿瘤知识科普" border></ut-nav>
				<view class="tabs">
					<u-tabs :list="tabList" @click="onItem">
						<view slot="right" class="slot" @tap="$u.toast('插槽被点击')" v-if="false">
							<u-icon name="search" color="#3B7EFFFF" size="21" bold></u-icon>
						</view>
					</u-tabs>
				</view>
			</template>
			<view class="content">
				<view class="ut-view" v-if="newData || newData.length>0">
					<ut-new :list="newData" :isPlay="type == 6" @onClick="onClick"></ut-new>
				</view>
			</view>
		</z-paging>

	</view>
</template>

<script>
	import {
		getNewsLink,
		getNewsList,
		getTestProjectList
	} from '@/api/generalcontent/generalcontent.js';

	export default {
		data() {
			return {
				type: 0,
				tabList: [],
				newData: [],
				pageNum: 1,
				pageSize: 10,
				newsType:null,
				url:'/pages/index/index',
			};
		},
		onLoad(options) {
			if(options.type){
				this.newsType = options.type
			}
			if(this.newsType == 1){
				// this.url = '/pages/index/indexA'
			}
			this.getLinkLists();
			// this.getNewsLists();
		},
		methods: {
			queryList(pageNo, pageSize) {
				if (this.type != '检测项目') {
					let params = {
						isAsc: 'desc',
						orderByColumn: 'create_time',
						pageNum: pageNo,
						pageSize: pageSize,
						type: this.type,
						port:this.newsType,
						userId:this.$store.getters.userId
					}
					if(this.newsType == 1){
						params.code = 'kydt'
					}
					getNewsList(params).then(res => {
						if (res.code == 200) {
							this.$refs.paging.complete(res.data.records);
						}
					})
				} else {
					let params = {
						isAsc: 'desc',
						orderByColumn: 'create_time',
						pageNum: pageNo,
						pageSize: pageSize,
					}
					getTestProjectList(params).then(res => {
						if (res.code == 200) {
							this.$refs.paging.complete(res.data.records);
						}
					})
				}

			},
			onItem(item) {
				console.log('item', item)
				this.type = item.id
				let name = item.name
				this.$refs.paging.reload();

			},
			onClick(item) {
				let id = item.id
				let type = this.type
				let title = item.title
				let readCount = item.readCount
				console.log('--',this.type)
				if(this.type == '6'){
					this.$ut.jump('/pagesA/index/news/video-details?id=' + id + '&type=' + type + '&title=' + title)
				}else{
					this.$ut.jump('/pagesA/index/news/news-detalis?id=' + id + '&title=' + title)
				}
			},
			getTestProjectLists() {
				getTestProjectList().then(res => {
					console.log("projectList:", res)
					if (res.code == 200) {
						this.newData = res.rows
					}
				})
			},
			getNewsLists() {
				getNewsList(this.type).then(res => {
					console.log("newsList:", res)
					if (res.code == 200) {
						this.newData = res.rows
					}
				})
			},
			getLinkLists() {
				getNewsLink(this.newsType).then(res => {
					console.log('res:', res)
					let data = res.data;
					let list = [];
					list.push({
						id: 0,
						name: '推荐'
					})
					for (let s of data) {
						list.push(s)
					}
					console.log("list:", list)
					this.tabList = list;
				})
			}
		}
	}
</script>

<style lang="less" scoped>
	.tabs {
		background: #fff;

		.slot {
			width: 60rpx;
			display: flex;
			align-items: center;
			justify-content: center;
		}
	}
</style>