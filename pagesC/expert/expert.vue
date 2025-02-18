<template>
	<view>
		<z-paging ref="paging" v-model="dataList" @query="queryList">
			<template #top>
				<ut-nav title="肿瘤医生服务"  border></ut-nav>
				<view class="head">
					<view class="params" @click="isShow1 = true">
						<text class="label">{{label1 || '科室'}}</text>
						<u-icon name="arrow-down" bold size="28rpx" color="#666"></u-icon>
					</view>
					<view class="params" @click="isShow2 = true">
						<text class="label">{{label2 || '疾病'}}</text>
						<u-icon name="arrow-down" bold size="28rpx" color="#666"></u-icon>
					</view>

				</view>
			</template>

			<view v-if="dataList.length" class="content">
				<ut-expert-list :list="dataList"></ut-expert-list>
			</view>

		</z-paging>
		<u-picker :show="isShow1" :columns="columns1" keyName="dictLabel" @cancel="isShow1 = false"
			@confirm="confirm1"></u-picker>
		<u-picker :show="isShow2" :columns="columns2" keyName="dictLabel" @cancel="isShow2 = false"
			@confirm="confirm2"></u-picker>
	</view>
</template>

<script>
	import {
		getZjListApi
	} from '../../api/chat';
	import {
		getDicts
	} from '../../api/expert/data';
	export default {
		data() {
			return {
				dataList: [],
				label1: '',
				label2: '',
				isShow1: false,
				isShow2: false,
				columns1: [],
				columns2: [],
			};
		},
		onLoad() {
			this.getDict()
		},
		methods: {
			queryList(pageNo, pageSize) {
				this.getZjList(pageNo, pageSize)
			},
			confirm1(e) {
				this.label1 = e.value[0].dictValue
				this.isShow1 = false
				this.$refs.paging.reload();
			},
			confirm2(e) {
				this.label2 = e.value[0].dictValue
				this.isShow2 = false
				this.$refs.paging.reload();
			},
			async getZjList(pageNo, pageSize) {
				const params = {
					pageNum: pageNo,
					pageSize: pageSize,
					classification: this.label2 == '全部' ? '' : this.label2,
					lable: this.label1 == '全部' ? '' : this.label1,
				}
				uni.showLoading({
					title: '加载中...',
					mask: true
				})
				const res = await getZjListApi(params)
                uni.hideLoading()
				if (!res || res.code !== 200) return
				this.$refs.paging.complete(res.data);
			},
			async getDict() {
				const mapType = ['exper_lable', 'exper_classification']
				const promises = mapType.map(function(type) {
					return getDicts(type);
				});

				Promise.all(promises).then((dicts) => {
					let columns1 = [];
					let columns2 = [];
					columns1 = dicts[0] && dicts[0].data
					columns2 = dicts[1] && dicts[1].data
					this.columns1 = [[{ dictLabel: '全部', dictValue: '全部' },...columns1]]
					this.columns2 = [columns2]
				})
			},
			
			leftClick(){
				console.log('===')
				uni.navigateTo({
					url:"/pages/index/index"
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.head {
		width: 100%;
		height: 100rpx;
		padding: 0 50rpx;
		box-sizing: border-box;
		display: flex;
		align-items: center;

		.params {
			display: flex;
			font-size: 28rpx;
			color: #000;
			margin-right: 60rpx;

			.label {
				margin-right: 20rpx;
			}
		}
	}

	.content {
		padding: 0 30rpx;
	}
</style>