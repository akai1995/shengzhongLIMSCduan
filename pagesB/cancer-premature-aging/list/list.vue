<template>
	<view>
		<view class="wrapper">
			<ut-nav title="癌症风险自测"  border></ut-nav>
			<view style="padding: 32rpx 32rpx 16rpx;">
				<u-search placeholder="输入自测癌种名称" :showAction='false' bgColor='#F8F8F8' @change="search" @search="search"
					v-model="keyword" @clickIcon="search"></u-search>
			</view>
			<scroll-view class="page-content" scroll-y refresher-enabled :refresher-triggered="triggered" @scrolltolower="scrolltolower" @refresherrefresh="refresh" scroll-with-animation>
				<view style="padding: 0 32rpx 60rpx;">
					<template v-for="(item, index) in list">
						<view class="card-item" @click="router(item)" :key="item.id" hover-class="active-hover">
							<u-image width="206rpx" height="142rpx" radius="8rpx" lazyLoad :src="item.cover"></u-image>
							<view class="item-ctview">
								<view class="tit h2 ellipsis">{{ item.title || '-' }}</view>
								<view class="ctt ellipsis">{{ item.subTitle || '' }}</view>
								<view class="h5">共{{ item.questionCount }}题<text
										class="pd-wt">|</text>约{{ item.timeSpend }}分钟</view>
							</view>
						</view>
					</template>
					<u-loadmore v-if="loading" line status="loading" />
					<u-loadmore v-if="pageJson.pages && pageJson.pages == pageJson.pageNum" line status="nomore" />
					<ut-nodata v-if="!loading && list && list.length == 0" class="no-data"> </ut-nodata>
				</view>
			</scroll-view>
		</view>
		<u-modal :show="showText" title="癌症风险先导评测" :title-style="titleStyle" :content-style="contentStyle"
			confirm-text="去自测" show-cancel-button confirm-color="#3B7EFF" cancel-text="取消"
			content="若您不知道具体需要自测哪种癌症，可以先做一个先导测评" @cancel="cancelMd" @confirm="confirmMd"></u-modal>
	</view>
</template>

<script>
	import {
		list
	} from '@/api/cancer-premature-aging'
import { data } from '../../../uni_modules/uview-ui/libs/mixin/mixin'
	export default {
		data() {
			return {
				showText: false,
				keyword: '',
				list: [],
				dataList: [],
				contentStyle: {
					color: '#666'
				},
				titleStyle: {
					color: '#222',
					fontSize: '34rpx'
				},
				pageJson: {
					pageNum: 1,
					pageSize: 100,
					pages: 100
				},
				triggered: false,
				loading: false,
				isYc: false,
				xdQuestionCount: '',
				xdId: ''
			}
		},
		onLoad() {
			this.getList(true)
		},
		methods: {
			cancelMd() {
				this.showText = false
			},
			confirmMd() {
				this.showText = false
				const { dataList } = this
				let that = this
				uni.navigateTo({
					url: `/pagesB/cancer-premature-aging/questionnaire/questionnaire?id=${this.xdId}&questionCount=${this.xdQuestionCount}&title=先导问题&type=xd`,
					events: {
						init (levelRes) {
							if (!levelRes || !levelRes.length) return
							let dataArr = levelRes.map(({ level }) => level);
							that.list = dataList.filter(({ type }) => dataArr.includes(type))
							that.dataList = dataList.filter(({ type }) => dataArr.includes(type))
						}
					}
				})
			},
			async getList(isNew) {
				const {
					pageJson
				} = this
				const params = {
					pageNum: isNew ? 1 : pageJson.pageNum,
					pageSize: pageJson.pageSize
				}
				this.status = 'loading'
				this.loading = true
				this.isYc = false
				const res = await list(params).catch(() => {
					this.triggered = false
					this.loading = false
				})
				this.triggered = false
				this.loading = false
				if (!res || res.code !== 200) {
					this.status = ''
					return
				}
				const {
					current,
					data,
					pages,
					total
				} = res
				this.pageJson.pages = pages
				this.list = data
				// this.showText = true
				this.dataList = data
			},
			async search() {
				const dataList = [...this.dataList];
				const {
					keyword
				} = this
				this.list = dataList.filter(({ title, subTitle }) => (title && title.includes(keyword)) || (subTitle && subTitle.includes(keyword)))
			},
			router (item) {
				const { id, questionCount, title } = item
				if (!questionCount) {
					uni.showToast({
						title: '暂无风险评估测题',
						icon: 'none'
					})
					return
				}
				uni.navigateTo({
					url: `/pagesB/cancer-premature-aging/questionnaire/questionnaire?id=${id}&questionCount=${questionCount}&title=${title}`
				})
				
			},
			refresh () {
				this.triggered = true
				this.getList(true)
			},
			scrolltolower () {
				const { pageJson } = this
				if (pageJson.pageNum < pageJson.pages) {
					this.pageJson.pageNum++
					this.getList(false)
				} else {
					return
				}
			}
		}
	}
</script>

<style lang="scss">
	.wrapper {
		display: flex;
		flex-direction: column;
		height: 100vh;
		background-color: #fff;
	}

	.page-content {
		flex: 1;
		overflow: hidden;
	}

	.active-hover {
		background-color: #f4f4f4;
		border-radius: 8rpx;
	}

	.card-item {
		display: flex;
		padding: 32rpx 0;
		border-bottom: 1rpx solid rgba(0, 0, 0, 0.1);

		.item-ctview {
			flex: 1;
			overflow: hidden;
			display: flex;
			flex-direction: column;
			padding: 0 20rpx;
		}

		.ctt {
			flex: 1;
			font-size: 24rpx;
			color: #666;
		}

		.pd-wt {
			padding: 0 26rpx;
		}
	}
</style>