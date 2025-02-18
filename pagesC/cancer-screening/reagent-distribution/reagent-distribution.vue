<template>
	<view>
		<z-paging ref="paging" v-model="dataList" @query="queryList">
			<template #top>
				<ut-nav title="试剂发放" border></ut-nav>
				<view class="d-flex js-b-c" style="padding: 20rpx 30rpx;">
					<view @click="showTime = true" class="base-font flex" style="padding: 10rpx 0;"
						hover-class="active-hover"> <text v-if="startDate && endDate"
							class="m-r1 blue">{{ startDate }}~{{endDate}}</text><text class="m-r1" v-else>时间筛选</text>
						<image class="f-jt" mode="aspectFill" src="@/static/images/f-arrow-d.png"></image>
					</view>
					<view class="font-desc">共计 <text class="blue">{{ total }}条</text> 数据</view>
				</view>
			</template>
			<view class="content">
				<template v-for="(item, index) in dataList">
					<view class="base-block mb-30" :key="item.id">
						<view class="base-font">
							<text class="m-r3">姓名：{{ item.name }}</text>
							<text class="m-r3">性别：{{ dict.label.sys_user_sex[item.gender] }}</text>
						</view>
						<view class="font-qs pd-sx-10">发放时间：{{ item.createTime }}</view>
						<view class="d-flex js-end">
							<view class="m-r2 tag-plain-boder" @click="detele(item.id)" style="width: 120rpx;">删除</view>
							<view class="tag-plain"
								@click="routePush({ url: '/pagesC/cancer-screening/scan-distribution/scan-distribution?dtl=1&uuid=' + item.userid })">
								查看详情</view>
						</view>
					</view>
				</template>
			</view>
			<template #bottom>
				<view style="padding: 60rpx 32rpx;">
					<view class="btn-bim" @click="scan">扫码发放</view>
				</view>
			</template>
		</z-paging>
		<ut-range-time :show.sync="showTime" :startDate="startDate" :endDate="endDate"
			@change="changeTime"></ut-range-time>
	</view>
</template>

<script>
	import {
		deleteKit,
		pageUserKit
	} from '@/api/cancer-screening';
    import { mapGetters } from 'vuex'
	export default {
		dicts: ['sys_user_sex'],
		data() {
			return {
				dataList: [],
				startDate: '',
				endDate: '',
				showTime: false,
				total: 0,
				mapDenger: {
					0: '男',
					1: '女'
				},
			};
		},
		computed: {
			...mapGetters(['userId'])
		},
		methods: {
			queryList(pageNo, pageSize) {
				this.getList(pageNo, pageSize)
			},
			async getList(pageNo, pageSize) {
				const {
					startDate,
					endDate
				} = this
				const params = {
					pageNum: pageNo,
					pageSize: pageSize,
					startDate,
					endDate,
					expertid: this.userId
				}
				uni.showLoading({
					title: '加载中...',
					mask: true
				})
				const res = await pageUserKit(params)
				uni.hideLoading()
				if (!res || res.code !== 200) return
				this.total = res.total
				this.$refs.paging.complete(res.data);
			},
			shuaxin () {
				this.$refs.paging.reload();
			},
			scan() {
				let that = this
				uni.scanCode({
					onlyFromCamera: true,
					scanType: ['qrCode'],
					success(res) {
						const {
							errMsg,
							result
						} = res
						if (errMsg == 'scanCode:ok') {
							uni.navigateTo({
								url: '/pagesC/cancer-screening/scan-distribution/scan-distribution?uuid=' +
									result,
								events: {
									change() {
										that.shuaxin();
									}
								}
							})
						}
					}
				})
			},
			changeTime(event) {
				console.log(event);
				const {
					endDate,
					startDate
				} = event
				this.startDate = startDate
				this.endDate = endDate
				this.$refs.paging.reload();
			},
			detele(id) {
				let that = this
				uni.showModal({
					title: '删除提示',
					content: '您确定要删除该条信息么？',
					success(res) {
						if (res.confirm) {
							that.deteleItem(id)
						}
					}
				})
			},
			async deteleItem(id) {
				const params = {
					kitId: id
				}
				uni.showLoading({
					title: '正在删除',
					mask: true
				})
				const res = await deleteKit(params)
				uni.hideLoading()
				if (!res || res.code !== 200) return
				uni.showToast({
					title: '删除成功',
					icon: 'none'
				})
				this.$refs.paging.reload();
			}
		}
	}
</script>

<style lang="scss">
	.pd-sx-10 {
		padding: 10rpx 0;
	}
	.mb-30 {
		margin-bottom: 30rpx;
	}
</style>