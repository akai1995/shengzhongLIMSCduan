<template>
	<view>
		<z-paging ref="paging" v-model="dataList" @query="queryList" safe-area-inset-bottom bg-color="#F8F8F8">
			<template #top>
				<ut-nav title="查看报告" border></ut-nav>
				<view style="padding: 30rpx 30rpx 10rpx;">
					<u-search placeholder="请输入姓名或申请编号" :showAction='false' bgColor='#fff'
						@search="search" v-model="keyword" @clickIcon="search"></u-search>
				</view>
				<view class="d-flex js-b-c" style="padding: 0 30rpx;">
					<view @click="showTime = true" class="base-font flex" style="padding: 10rpx 0;" hover-class="active-hover"> <text class="m-r1">时间筛选</text> <image class="f-jt" mode="aspectFill"
							src="@/static/images/f-arrow-d.png"></image>
					</view>
					<view class="font-desc">共计 <text class="blue">1000条</text> 数据</view>
				</view>
			</template>
			<view class="content">
                <template v-for="(item, index) in 10">
                	<view class="base-card">
						<view class="card-title" style="padding-bottom: 10rpx;">检测项目名称项目名称</view>
						<view class="font-desc pd-4">
							<text>姓名：张*花 </text>
							<text>性别：女</text>
							<text>年龄：6岁</text>
						</view>
						<view class="font-desc pd-4">送检医院：红河州人民医院</view>
						<view class="d-flex js-b-c">
							<view class="min-font">申请时间：2023/12/12</view>
							<view class="min-font">完成时间：2023/12/12</view>
						</view>
						<view class="d-flex js-end" style="padding-top: 20rpx;">
							<u-tag text="样本详情" shape="circle" plain plainFill></u-tag>
							<view style="padding-left: 10rpx;">
								<u-tag text="查看报告" shape="circle"></u-tag>
							</view>
						</view>
					</view>
                </template>
			</view>

		</z-paging>
        <ut-range-time :show.sync="showTime" :startDate.sync="startDate" :endDate.sync="endDate"></ut-range-time>
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
				keyword: '',
				startDate: '',
				endDate: '',
				showTime: false,
				dataList: []
			};
		},
		onLoad() {

		},
		methods: {
			queryList(pageNo, pageSize) {

			},
			search (event) {
				console.log(event);
			}
		}
	}
</script>

<style lang="scss" scoped>
	.f-jt {
		width: 20rpx;
		height: 20rpx;
	}
	.base-card {
		padding: 24rpx;
		margin-bottom: 30rpx;
		border-radius: 20rpx;
		background-color: #fff;
	}
	.pd-4 {
		padding: 4rpx 0;
	}
</style>