<template>
	<view>
		<ut-nav title="肿瘤分子检测" border></ut-nav>
	
		<view class="ut-padding">
			<view class="menu" style="background: #ECFFF3FF;" @click="$ut.jump('/pagesA/signin/signin')">
				<view class="label" style="color: #32D760FF;">
					<image class="icon-img" :src="bjImg" mode=""></image>
					<view>检测登记</view>
				</view>
				<u-icon name="arrow-right" color="#32D760FF" size="36rpx"></u-icon>
			</view>
			
			<view class="menu m-t3" style="background: #FFF5E3FF;" v-if="false">
				<view class="label" style="color: #FFA800FF;">
					<image class="icon-img" :src="bjImg2" mode=""></image>
					<view>物流详情</view>
				</view>
				<u-icon name="arrow-right" color="FFA800FF" size="36rpx"></u-icon>
			</view>
			
			<view class="menu m-t3" style="background: #E3EEFFFF;" @click="$ut.jump('/pages/report/report')">
				<view class="label" style="color: #3B7EFFFF;">
					<image class="icon-img" :src="bjImg1" mode=""></image>
					<view>检测详情</view>
				</view>
				<u-icon name="arrow-right" color="#3B7EFFFF" size="36rpx"></u-icon>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				bjImg:'https://genepiapi.ypzlfx.com/file/genepi/2023/10/10/JS3bP4eIjwBQ9edae89697c1f0e274701bd15ccac1aa_20231010105112A044.png',
				bjImg1:'https://genepiapi.ypzlfx.com/file/genepi/2023/10/10/RV6bbW793NUvcbfdb018ab684ad354fbfaf6f844075d_20231010105216A045.png',
				bjImg2:'https://genepiapi.ypzlfx.com/file/genepi/2023/10/10/WUS0pSlZ8Bqcc7374328c6f4fea5fa6d6e46b0b42e61_20231010105312A046.png'
			}
		},
		methods: {
			
		}
	}
</script>

<style lang="scss">
	page{
		background: #fff;
	}
	.menu{
		width: 100%;
		height: 160rpx;
		border-radius: 20rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 30rpx;
		box-sizing: border-box;
		
		.label{
			display: flex;
			align-items: center;
			font-size: 36rpx;
			.icon-img{
				width: 60rpx;
				height: 60rpx;
				margin-right: 20rpx;
			}
		}
	}
</style>
