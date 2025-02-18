<template>
	<view>
		<ut-nav title="送检预约" border></ut-nav>

		<view class="content">
			<view class="ut-view" >
				<view class="h1">检测样本</view>
				<view class="up m-t2">预约送检时间：{{submissionTime | formatDate}}</view>
				<view class="item m-t2" v-for="(list,index_) in historyQueryList" :key="index_">
					<image class="img" :src="list.sampleImage"></image>
					<view class="text">
						<view class="h1 ellipsis">{{list.sampleType}}</view>
						<view class="vice flex j-c">
							<view>样本数量：{{list.sampleCount}}</view>
							<view>采集时时间：{{list.collectionTime | formatDate}}</view>
						</view>
						<view class="vice">样本编码：{{list.sampleCode}}</view>
					</view>
				</view>

				<view class="h1 m-t3">备注</view>
				<view class="vice m-t2">{{remark}}</view>

				<view class="h1 m-t3">地址</view>
				<view class="flex m-t2">
					<view class="label">寄件信息：</view>
					<view class="view">{{mailAddress}}</view>
				</view>
				<view class="flex m-t2">
					<view class="label">收件信息：</view>
					<view class="view">{{reachAddress}}</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		getById
	} from "@/api/hospitalrelated/hospitalrelated"
	export default {
		filters: {
		    formatDate: function(item) {
		      const date = new Date(item);
			  const year=date.getFullYear();
		      const month = date.getMonth() + 1; // 月份从0开始，所以需要加1
		      const day = date.getDate();
		      return year+"/"+month.toString().padStart(2,'0')+'/'+day.toString().padStart(2,'0');
		    }
		  },
		data() {
			return {
				id:'',
				queryList:[],//历史查询列表
				historyQueryList:[],//历史查询样本列表
				submissionTime:'',
				remark:'',
				mailAddress:'',
				reachAddress:''
			};
		},
		onLoad(optins) {
			this.id=optins.id;
			this.getData();
		},
		methods: {
			getData(){
				getById(this.id).then(res=>{
					this.submissionTime=res.data.submissionTime;
					this.remark=res.data.remark;
					this.mailAddress=res.data.mailAddress;
					this.reachAddress=res.data.reachAddress;
					this.historyQueryList=res.data.testSample;
				});

			},
		}
	}
</script>

<style lang="less">
.ut-view{
		.up{
			font-size: 24rpx;
			color: #666;
		}
		.item{
			display: flex;
			width: 100%;

			.img{
				width: 140rpx;
				height: 140rpx;
				border-radius: 6rpx;
				flex-shrink: 0;
			}

			.text{
				margin-left: 20rpx;
				width: calc(100% - 160rpx);
			}
		}
	}

	.vice{
		margin-top: 10rpx;
		font-size: 24rpx;
		color: #666;
	}

	.flex{
		width: 100%;
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		.label{
			width: 20%;
			color: #333;
			font-size: 24rpx;
			white-space: nowrap;
		}

		.view{
			width: 70%;
			font-size: 24rpx;
			color: #999;
		}

	}
</style>
