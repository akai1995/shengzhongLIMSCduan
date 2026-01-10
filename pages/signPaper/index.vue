<style lang="less" scoped>
@import './asserts/index.less';
</style>

<template>
	<view class="page">
		<img class="home-bg" src="https://genepiapi.ypzlfx.com/file/device-appointment/image 39.png" />

		<view class="home-head" :style="{ height: headInfo.headHeight }">
			<view class="home-title" :style="{ marginTop: headInfo.titleTop }">待签署文件</view>
		</view>

		<view class="home-content">
			<view class="home-search">
				<view class="home-search-input">
					<u--input placeholder="请输入关键词" suffixIcon="search" @change="handleSearch"
						suffixIconStyle="font-size: 22px;color: #909399"></u--input>
				</view>
			</view>
			<scroll-view class="home-list" @scrolltolower="lowerBottom" :scroll-y="true"
				:style="{ height: headInfo.listHeight }">
				<view class="home-item" v-for="(item, index) in listData.list" :key="item.id">
					<view class="home-item-content">
						<view class="home-item-content-info">
							<view class="home-item-content-info-title">{{ item.signFileName }}</view>
							<view class="home-item-content-info-text">
								<view class="home-item-content-info-text-item">发起人: {{ item.createBy }}</view>
								<view class="home-item-content-info-text-item">发起时间: {{ item.createTime }}</view>
							</view>
						</view>
					</view>
					<view class="home-item-condition">
						<view class="home-item-condition-button">
							<view class="home-item-condition-button-block" @click="handleGoSign(item.id)">
								<u-button type="primary" size="small">去签署</u-button>
							</view>
						</view>
					</view>
				</view>
			</scroll-view>
		</view>

		<ut-bottomNav :value="0"></ut-bottomNav>
	</view>
</template>

<script>
// 注意：这里需要替换为实际的API调用
import { getSignFileList } from '@/api/signPaper/index.js'

export default {
	data() {
		return {
			headInfo: { headHeight: '0px', titleTop: '0px', listHeight: '0px' },
			queryParameter: { pageNo: 1, pageSize: 10, signUserId: "" },
			listData: { list: [], total: 0 },
		};
	},
	onShow() {
		this.getHeadInfo()
		this.getSignFileList()
	},
	methods: {
		getHeadInfo() {
			const popInfo = uni.getMenuButtonBoundingClientRect()
			this.headInfo.headHeight = `${popInfo.height}px`
			this.headInfo.titleTop = `${popInfo.top}px`
			this.headInfo.listHeight = `calc(100vh - ${popInfo.top + popInfo.height + 155}px)`
		},
		checkUserInfo() {
			const id = this.$store.getters.userId
			if (!id) {
				this.$ut.jump("/pages/login/login");
				return;
			}
		},
		getSignFileList(type) {
			this.queryParameter.signUserId=this.$store.getters.userId
			// 实际API调用示例
			getSignFileList(this.queryParameter).then((resp) => {
				if (type && type == "search") {
					this.listData.list.push(...resp.result.records);
					this.listData.total = resp.result.total
					uni.stopPullDownRefresh();
				} else {
							this.listData.list = resp.result.records
					this.listData.total = resp.result.total
				}
			});
		},
		lowerBottom() {
			if (this.queryParameter.pageNo * this.queryParameter.pageSize < this.listData.total) {
				this.queryParameter.pageNo += 1;
				this.getSignFileList("search")
			} else {
				uni.showToast({ title: "已经到底啦！！！", icon: "none", });
			}

		},
		onPullDownRefresh() {
			this.getSignFileList()
		},
		handleSearch(e) {
			const searchData = e
			this.queryParameter.keyword = searchData
			this.queryParameter.pageNo = 1
			this.listData.list = []
			this.getSignFileList()
		},
		handleGoSign(id) {
				this.checkUserInfo()
				this.$ut.jump(`/pages/signPaper/am-sign-input/am-sign-input?id=${id}&showSign=true`);
			}
	},
};
</script>