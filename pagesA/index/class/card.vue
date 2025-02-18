<template>
	<view>
		<z-paging ref="paging" v-model="listData" @query="queryList">
			<template #top>
				<ut-nav title="检测项目" border></ut-nav>
				<u-tabs :list="navList" :current="current" :activeStyle="{color:'#3B7EFF'}" lineColor="#3B7EFF"  @click="onItem"></u-tabs>
				<!-- :activeStyle="{color:'#3B7EFF'}" -->
			</template>
			<view class="content">
				<view class="card" v-for="(item,index) in listData">
					<view class="title">{{item.title}}</view>
					<view class="item m-t2">
						<view class="label">临床价值</view>
						<view class="text">{{item.clinicalValue}}</view>
					</view>
				
					<view class="item m-t2">
						<view class="label">技术平台</view>
						<view class="text">{{item.technicalPlatform}}</view>
					</view>
				
					<view class="item m-t2">
						<view class="label">样品类型</view>
						<view class="text">{{item.sampleType}}</view>
					</view>
				
					<view class="item m-t2" @click="lookImg(item.geneImg)" v-if="item.geneImg">
						<view class="label">包含基因</view>
						<view class="text" style="color: #3B7EFF;">点击查看</view>
					</view>
				</view>
			</view>
		</z-paging>
	</view>
</template>

<script>
	import {
		getDicts
	} from '@/api/expert/data.js'
	import { pageProject } from "@/api/generalcontent/drugSearch.js"
	export default {
		data() {
			return {
				id: '',
				listData: [],
				navList: [{name:'全部',id:''}],
				current:0,
			}
		},
		onLoad(options) {
			if (options.id) {
				this.id = options.id
			}
			this.getNav()
		},
		methods: {
			queryList(pageNo, pageSize) {
				let params = {
					isAsc: 'desc',
					id: this.id,
					pageNum: pageNo,
					pageSize: pageSize,
				}
				pageProject(params).then(res => {
					if (res.code == 200) {
						this.$refs.paging.complete(res.data);
					}
				})
			},
			getNav() {
				getDicts('test_item').then(res => {
					if (res.code == 200) {
						res.data.forEach(item => {
							this.navList.push({
								name: item.dictLabel,
								id: item.dictValue
							})
						})

					}
				})
			},
			lookImg(arr) {
				let list = JSON.parse(arr)
				let list_ = []
				list.forEach(item => {
					list_.push('https://genepiapi.ypzlfx.com/gzh' + item.url)
				})

				uni.previewImage({
					urls: list_,
				})
			},
			onItem(item,index) {
				this.current = item.index
				this.id = item.id
				this.$refs.paging.reload()
			}
		}
	}
</script>

<style scoped lang="scss">
	.fixed {
		position: fixed;
		left: 0;
		right: 0;
		height: 90rpx;
		z-index: 10;
		background: #fff;
	}

	.card {
		width: 100%;
		min-height: 100rpx;
		border-radius: 10rpx;
		background: #eee;
		padding: 20rpx 0;
		box-sizing: border-box;
		margin-bottom: 20rpx;

		.title {
			font-size: 30rpx;
			font-weight: 600;
			position: relative;
			padding-left: 20rpx;

			&::after {
				content: '';
				position: absolute;
				left: 0;
				top: 50%;
				transform: translateY(-50%);
				width: 10rpx;
				height: 30rpx;
				border-radius: 0 5rpx 5rpx 0;
				background: #3B7EFF;
			}
		}

		.item {
			padding: 0 20rpx;
			box-sizing: border-box;
			width: 100%;
			display: flex;

			.label {
				width: 120rpx;
				font-size: 24rpx;
				color: #666;
			}

			.text {
				width: calc(100% - 140rpx);
				color: #222;
				font-size: 26rpx;
			}
		}
	}
	
	/deep/ .u-tabs__wrapper__nav__line{
		height: 10rpx !important;
		border-radius: 0 0 20rpx 20rpx !important;
	}
	/deep/ .u-tabs__wrapper__nav__item__text{
		height: auto !important;
	}
</style>