<template>
	<view>
		<ut-nav title="检测记录" url="/pages/report/explain"></ut-nav>
		
		<view class="content">
			<view class="list" v-for="item in list" :key="item.id">
				<view class="title">检测项目:{{item.title}}</view>
				<view class="info">
					<view class="t">姓名：{{item.name}}</view>
					<view class="t">性别：{{item.sex}}</view>
					<view class="t">年龄：{{item.age}}岁</view>
				</view>
				<view class="text m-t2 flex j-c">
					<view class="label">检测时间：{{item.time}}</view>
					<view class="label flex">
						检测结果：
						<view class="tag red" v-if="item.result == 0">未完成</view>
						<view class="tag green" v-if="item.result == 1">已完成</view>
						<view class="tag yellow" v-if="item.result == 2">监测中</view>
					</view>
				</view>
				<view class="m-t2 tag blue" v-if="item.result != 2">查看报告</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				list:[
					{
						id:'1',
						title:'BRCA1/BRCA2 基因检测报',
						name:'张*花',
						sex:'女',
						age:6,
						time:'2023-06-13',
						result:0,
					},{
						id:'2',
						title:'BRCA1/BRCA2 基因检测报',
						name:'张*花',
						sex:'女',
						age:6,
						time:'2023-06-13',
						result:1,
					},{
						id:'3',
						title:'BRCA1/BRCA2 基因检测报',
						name:'张*花',
						sex:'女',
						age:6,
						time:'2023-06-13',
						result:2,
					}
				]
			};
		}
	}
</script>

<style lang="less">
.list{
		width: 100%;
		min-height: 210rpx;
		background: #fff;
		border-radius: 20rpx;
		padding: 30rpx 20rpx;
		box-sizing: border-box;
		margin-bottom: 30rpx;
		position: relative;
		.title{
			width: 100%;
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
			font-size: 30rpx;
			line-height: 1.8;
			font-weight: 600;
			color: #000;
			letter-spacing: 1rpx;
		}
		.tag{
			font-size: 24rpx;
			font-weight: 400;
			padding: 5rpx 15rpx;
			border-radius: 10rpx;
			display: inline-block;
		}
		.info{
			display: flex;
			align-items: center;
			color: #666;
			font-size: 24rpx;
			line-height: 1.5;
			font-weight: 400;
			.t{
				margin-right: 20rpx;
			}
		}
		.text{
			font-size: 24rpx;
			color: #c6c6c6;
			font-weight: 400;
			display: flex;
			align-items: center;
			.label{
				margin-right: 20rpx;
			}
		}
	}
	
	
	.green{
		color: #00C777FF;
		background: #00C7771A;
	}
	.red{
		color: #FD5454FF;
		background: #FD54541A;
	}
	.yellow{
		color: #FF9900FF;
		background: #FF99001A;
	}
	.blue{
		color: #0C5FFFFF;
		background: #3B7EFF1A;
	}
</style>
