<template>
	<view>
		<ut-nav title="专家详情" border></ut-nav>
		<view class="content" style="padding-bottom: 120rpx;">
			<view class="rz">
				<view class="flex">
					<image class="img" :src="imgUrl" mode=""></image>
					<view class="span">已实名认证</view>
					<view class="text">执业证编号 {{ detail.code || '无' }}</view>	
				</view>	
			</view>	
			<view class="ut-view" style="margin-top: -40rpx;">
				<view class="avatar-box">
					<image class="avatar" :src="detail.headImg || img" mode=""></image>
				</view>
				<view class="h1">{{ detail.name }}</view>
				<view class="vice m-t2">
					<text class="m-r2">{{ detail.level || '' }}</text>
					<text>{{ detail.lable || '' }}</text>
				</view>
				<view class="flex m-t1">
					<u-tag text="三甲" size="mini" :icon="icon" plain></u-tag>
					<view class="yy">{{ detail.fdMedicalName || '' }}</view>
				</view>
				
				<view class="view-back m-t3">
					<text class="color">擅长：</text>
					<text class="text1">{{ detail.classification || '无' }}</text>
				</view>
				<view class="view-back m-t3">
					<u-divider text="医生简介" textColor="#3B7EFFFF" lineColor="#3B7EFFFF"></u-divider>
					<text class="text2">{{ detail.biography || '暂无简介' }}</text>
				</view>
			</view>
		</view>
		
		
		<view class="bottom safe-area-inset-bottom">
			<view v-if="!type" class="btn" @click="routeChat">免费在线问诊</view>
		</view>
	</view>
</template>

<script>
import { getZjDetailApi } from '../../api/chat';
	export default {
		data() {
			return {
				img:'https://genepiapi.ypzlfx.com/file/genepi/2023/11/24/Mask group@2x_20231124181155A412.png',
				imgUrl:'https://genepiapi.ypzlfx.com/file/genepi/2023/11/20/B6e4ADa2nJhW39b992d25026fd2d8c4b15ce881cc832_20231120111751A423.png',
				icon:'https://genepiapi.ypzlfx.com/file/genepi/2023/11/20/viJafsIMIXkA73c2a80b68df31d0d0530e72926de14a_20231120111723A422.png',
				src: 'https://genepiapi.ypzlfx.com/file/genepi/2023/10/24/%E5%9B%BE%E7%89%873_20231024093333A514.jpeg',
				zjId: '',
				detail: {},
				type: ''
			};
		},
		onLoad(options) {
			const { id, type } = options
			this.zjId = id
			this.getZjDetail()
		},
		methods:{
			async getZjDetail(){
				uni.showLoading({
					title: '加载中...',
					mask: true
				})
				const res = await getZjDetailApi(this.zjId)
				console.log(res);
				uni.hideLoading()
				if (!res || res.code !== 200) return
				this.detail = { ...res.data }
			},
			routeChat () {
				let that = this
				uni.navigateTo({
					url: '/pagesC/chat/chat',
					success(res) {
						res.eventChannel.emit('info', { ...that.detail })
					}
				})
			}
		}
		
	}
</script>

<style lang="scss" scoped>
	.rz{
		width: 100%;
		height: 120rpx;
		border-radius: 20rpx;
		background: linear-gradient(90deg, #3B7EFF45 0%, rgba(59,126,255,0) 100%);
		padding-top: 20rpx;
		padding-left: 20rpx;
		box-sizing: border-box;
		
		.img{
			width: 36rpx;
			height: 36rpx;
		}
		.span{
			font-size: 24rpx;
			font-weight: 600;
			color: #3B7EFF;
			margin-left: 10rpx;
		}
		.text{
			margin-left: 20rpx;
			color: #999;
			font-size: 24rpx;
		}
	}
	
	.ut-view{
		position: relative;
		
		.avatar-box{
			width: 180rpx;
			height: 180rpx;
			border-radius: 50%;
			position: absolute;
			right: 30rpx;
			top: -90rpx;
			z-index: 10;
			background: #fff;
			box-shadow: 0rpx 7rpx 7rpx 0rpx rgba(59,126,255,0.2);
			padding: 5rpx;
			box-sizing: border-box;
			
			.avatar{
				width: 100%;
				height: 100%;
				border-radius: 50%;
			}
			
			
		}
		.vice{
			font-size: 24rpx;
			color: #222;
		}
		.view-back{
			width: 100%;
			min-height: 100rpx;
			border-radius: 20rpx;
			padding: 20rpx;
			box-sizing: border-box;
			background: #ECF3FFFF;
		}
	}
	.yy{
		font-size: 28rpx;
		color: #666;
		margin-left: 15rpx;
	}
	.color{
		color: #0C5FFF;
	}
	.text1{
		font-size: 24rpx;
		color: #222;
		line-height: 1.2;
	}
	.text2{
		font-size: 24rpx;
		color: #666;
		line-height: 1.2;
	}
	.bottom{
		position: fixed;
		left: 0;
		bottom: 0;
		z-index: 9;
		width: 100%;
		height: 110rpx;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	
	.btn{
		width: 90%;
		height: 80rpx;
		border-radius: 80rpx;
		background: linear-gradient(135deg, #00DEFF 0%, #0C5FFF 100%);
		display: flex;
		align-items: center;
		justify-content: center;
		color: #FFFFFF;
		font-size: 36rpx;
		font-weight: 500;
		letter-spacing: 2rpx;
	}
</style>
