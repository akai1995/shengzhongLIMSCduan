<template>
	<view>
		<z-paging ref="paging" v-model="listData" @query="queryList">
			<template #top>
				<ut-nav title="我的医生" border></ut-nav>
			</template>
			<view class="content">
				<view class="list ">
					<block v-for="(item,index) in listData" :key="index">
						<view class="list-item ut-view">
							<view class="avatar">
								<u-avatar :src="item.headImg" size="100rpx"></u-avatar>
							</view>
							<view class="text-box">
								<view class="one">
									<view class="name">{{ item.name }}</view>
									<view class="text">{{ item.level }}</view>
									<view class="text">{{ item.lable }}</view>
								</view>
								<view class="one m-t2">
									<u-tag text="三甲" size="mini" :icon="icon" plain></u-tag>
									<view class="yy">{{ item.fdMedicalName }}</view>
								</view>
								<view class="span m-t1 ellipsis2">擅长：{{ item.classification }}</view>
								<view class="span m-t2">最近服务时间：{{ 'dadada' }}</view>
								<view class="btn-box m-t2">
									<view class="btn" @click="routeDetail(item)">在线问诊</view>
								</view>
							</view>
						</view>
					</block>
				</view>
			</view>
		</z-paging>
	</view>
</template>

<script>
	import {
		getZjListApi1
	} from '../../api/chat';
	export default {
		data() {
			return {
				icon:'https://genepiapi.ypzlfx.com/file/genepi/2023/11/20/viJafsIMIXkA73c2a80b68df31d0d0530e72926de14a_20231120111723A422.png',
				listData: [],
			}
		},
		onLoad() {
			
		},
		methods: {
			queryList(pageNo, pageSize) {
				this.getZjList(pageNo, pageSize)
			},
			onDelete(){
				let this_ = this;
				uni.showModal({
				  title: "提示",
				  content: "确定是否删除这条数据",
				  cancelText: "取消",
				  confirmText: "确定",
				  confirmColor: "#fa3534",
				  success: function (res) {
				    if (res.confirm) {
				      
				      
				    } else if (res.cancel) {
				      console.log("用户点击取消");
				    }
				  },
				});
			},
			async getZjList(pageNo, pageSize) {
				const params = {
					pageNum: pageNo,
					pageSize: pageSize,
					ask: '1'
				}
				uni.showLoading({
					title: '加载中...',
					mask: true
				})
				const res = await getZjListApi1(params)
				console.log(res, '推荐医生列表');
			    uni.hideLoading()
				if (!res || res.code !== 200) return
				this.$refs.paging.complete(res.data);
			},
			routeDetail (item) {
				let that = this
				uni.navigateTo({
					url: '/pagesC/chat/chat',
					events: {
						change () {
							that.$refs.paging.reload();
						}
					},
					success: (res) => {
						res.eventChannel.emit('info', { ...item })
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.list{
		&-item{
			width: 100%;
			display: flex;
			margin-bottom: 30rpx;
			padding-bottom: 30rpx;
			&:last-child{
				margin-bottom: 0;
				border: none;
			}
			.avatar{
				width: 125rpx;
			}
			
			.text-box{
				width: calc(100% - 125rpx);
				.one{
					display: flex;
					.name{
						font-size: 28rpx;
						color: #222;
						font-weight: 600;
						line-height: 1.2;
					}
					.text{
						margin-left: 15rpx;
						font-size: 24rpx;
						color: #222;
						font-weight: 400;
					}
					.yy{
						font-size: 28rpx;
						color: #666;
						margin-left: 15rpx;
					}
				}
				.span{
					font-size: 24rpx;
					color: #999;
				}
			}
		}
	}
	.btn-box{
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: flex-end;
		
		.btn{
			margin-left: 25rpx;
			padding: 10rpx 15rpx;
			border: 2rpx solid #3B7EFFFF;
			color: #3B7EFFFF;
			font-size: 22rpx;
			border-radius: 60rpx;
			background: #3B7EFF1A;
		}
		
		.btn1{
			margin-left: 25rpx;
			padding: 10rpx 30rpx;
			border: 2rpx solid #DADADAFF;
			color: #999;
			font-size: 22rpx;
			border-radius: 60rpx;
		}
	}
</style>