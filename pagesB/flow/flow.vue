<template>
	<view>
		<z-paging ref="paging" v-model="dataList" @query="queryList">
			<template #top>
				<ut-nav title="全流程质控" border></ut-nav>
				<view class="content" >
					<u-search :showAction='false' bgColor="#fff" v-model="keyword"
						placeholder="搜索患者姓名、检测项目类型等"></u-search>
				</view>
			</template>

			<view class="content" style="padding-top: 0;">
				<block>
					<view class="time flex">
						<text class="m-r1">2023年7月</text>
						 <u-icon name="arrow-down" color="#3B7EFF" size="30rpx"></u-icon>
					</view>
					<view class="list m-t3" v-for="(item,index) in dataList" :key="index" @click="$ut.jump('/pagesB/flow-details')">
						<view class="top">
							<view class="left"> <text class="max">{{item.num}}</text>日</view>
							<view class="right flex" @click.stop="collaose(item)">
								<text class="m-r1">{{item.isChil?'收起':'展开'}}</text>
								<u-icon :name="item.isChil?'arrow-up':'arrow-down'" color="#3B7EFF" size="30rpx"></u-icon>
							</view>
						</view>
						<view class="down">
							<view class="down-item">检测人数：xxx人</view>
							<view class="down-item">院内检测：XXX份</view>
							<view class="down-item">外送检测：xxx份</view>
						</view>
						<view class="box" v-if="item.isChil">
							<view class="child" v-for="(ut,index_) in item.chil" :key="index_">
								<view class="info">
									<view style="width: 40%;">患者姓名：{{ut.name}}</view>
									<view style="width: 30%;">性别：男</view>
									<view style="width: 30%;">年龄：39</view>
								</view>
								<view class="info">
									<view>检测项目：XXXXXXX</view>
								</view>
								<view class="info">
									<view>检测时间：2023-07-16 11:12:30</view>
								</view>
								<scroll-view class="scroll m-t2" scroll-x>
									<u-steps :current="ut.current" activeIcon="checkmark-circle-fill"	inactiveIcon="minus-circle">
										<u-steps-item title="样本送检"></u-steps-item>
										<u-steps-item title="样本质控"></u-steps-item>
										<u-steps-item title="流程质控"></u-steps-item>
										<u-steps-item title="结果质控"></u-steps-item>
										<u-steps-item title="报告质控"></u-steps-item>
										<u-steps-item title="检测完成"></u-steps-item>
									</u-steps>
								</scroll-view>
							</view>
						</view>
					</view>
				</block>
			</view>
		</z-paging>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				dataList: [],
				keyword: '',
			};
		},
		methods: {
			queryList(pageNo, pageSize) {
				this.$refs.paging.complete([{
					num: '16',
					isChil:true,
					chil: [{name:'张三',current:1},{name:'李斯',current:5}]
				}, {
					num: '15',
					isChil:false,
					chil: [{name:'王五',current:3}]
				}, {
					num: '14',
					isChil:false,
					chil: []
				}]);
			},
			collaose(item){
				// console.log('**',item);
				item.isChil = !item.isChil
			}
		}
	}
</script>

<style lang="less" scoped>
	.time {
		font-size: 28rpx;
		font-weight: 600;
		color: #3B7EFF;
		letter-spacing: 1rpx;
	}

	.list {
		width: 100%;
		min-height: 220rpx;
		border-radius: 20rpx;
		overflow: hidden;
		
		.top {
			width: 100%;
			display: flex;
			align-items: center;
			justify-content: space-between;
			color: #3B7EFF;
			background: #EBF2FFFF;
			padding:  30rpx 30rpx 0 30rpx;
			box-sizing: border-box;
			.left {
				font-size: 30rpx;
				display: flex;
				align-items: baseline;

				.max {
					font-size: 72rpx;
					margin-right: 5rpx;
				}
			}
		}

		.down {
			width: 100%;
			display: flex;
			flex-wrap: wrap;
			background: #EBF2FFFF;
			padding: 0 30rpx 30rpx 30rpx;
			box-sizing: border-box;
			&-item {
				width: 50%;
				color: #333;
				font-size: 24rpx;
				font-weight: 500;
				line-height: 1.5;
			}
		}
		.box{
			padding: 0rpx 30rpx 0 30rpx;
			box-sizing: border-box;
			background: #fff;
			.child{
				width: 100%;
				min-height: 270rpx;
				padding-top: 30rpx;
				box-sizing: border-box;
				border-bottom: 2rpx solid #E7E7E7FF;
				&:last-child{
					border-bottom: none;
				}
				.info{
					display: flex;
					align-items: center;
					color: #999;
					font-size: 24rpx;
					line-height: 1.5;
				}
			}
		}
		
	}
	
	.scroll {
		display: inline-flex;
		white-space: nowrap;
	}
</style>