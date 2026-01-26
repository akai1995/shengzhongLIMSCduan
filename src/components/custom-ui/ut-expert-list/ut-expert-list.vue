<template>
	<view class="ut-view">
		<view v-if="head" class="flex">
			<view class="h1">医生推荐</view>
			<view class="vice1 flex" @click="$ut.jump('/pagesC/expert/expert')"><text class="m-r1">更多</text><u-icon name="arrow-right" color="#999" size="24rpx"></u-icon></view>
		</view>
		
		<view class="list">
			<block v-for="(item,index) in list" :key="index">
				<view class="list-item" @click="$ut.jump('/pagesC/expert/expertDetails?id=' + item.id)">
					<view class="avatar"><u-avatar :src="item.headImg || img" size="100rpx" /></view>
					<view class="text-box">
						<view class="one">
							<view class="name">{{ item.name }}</view>
							<view class="text">{{ item.level }}</view>
							<view class="text">{{ item.lable }}</view>
						</view>
						<view class="one m-t1">
							<u-tag text="三甲" size="mini" :icon="icon" plain></u-tag>
							<view class="yy">{{ item.fdMedicalName|| '无' }}</view>
						</view>
						<view class="span m-t1 ellipsis2">擅长：{{ item.classification || '无' }}</view>
						<view class="two m-t2">
							<view class="two-t line"> 月咨询 <text class="color">{{ item.chatCount }}</text> </view>
							<view class="two-t"> 平均响应 <text class="color">{{ item.answerHour || '0' }}小时</text> </view>
							<view @click.stop="routeChat(item)" class="btn">在线咨询</view>
						</view>
					</view>
				</view>
			</block>
		</view>
	</view>
</template>

<script>
	export default {
		name: "ut-expert-list",
		props: ['list', 'head'],
		data() {
			return {
				icon:this.$staticPath+'imgs/doctor_home.png',
				src: '',
				img:this.$staticPath+'imgs/default_doctor.png'
			};
		},
		methods: {
            routeChat (item) {
				this.$eUni.navTo({
					url: '/pagesC/chat/chat',
					success(res) {
						res.eventChannel.emit('info', { ...item })
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.flex{
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 20rpx;
	}
	.vice1 {
		font-size: 24rpx;
		color: #666;
		line-height: 1.8;
	}
	.list{
		&-item{
			width: 100%;
			display: flex;
			margin-bottom: 30rpx;
			padding-bottom: 30rpx;
			border-bottom: 2rpx solid #0000001A;
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
				.two{
					display: flex;
					align-items: center;
					justify-content: space-between;
					&-t{
						font-size: 22rpx;
						color: #999;
					}
					.line{
						position: relative;
						&::after{
							content: '';
							position: absolute;
							top: 0;
							right: -30rpx;
							width: 1rpx;
							height: 100%;
							background: #0000001A;
						}
					}
					.btn{
						padding: 10rpx 16rpx;
						font-size: 22rpx;
						background-color: #3B7EFF1A;
						border: 2rpx solid #3B7EFF;
						color: #3B7EFF;
						border-radius: 100rpx;
					}
				}
			}
		}
	}
	
	.color{
		color: #3B7EFF;
		margin-left: 15rpx;
	}
</style>