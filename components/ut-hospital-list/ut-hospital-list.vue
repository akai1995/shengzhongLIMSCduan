<template>
	<view class="">
		<view class="content-list" v-for="item in list" :key="item.id" @click="jump(item)">
			<image class="img" :src="item.headImg" mode=""></image>
			<view class="view">
				<view class="title">{{item.name}}</view>
				<view class="text">
					<view class="a">{{item.address}}</view>
					<view class="juli">3.6km</view>
				</view>
				<view class="tag">
					<view class="m-r2">
						<u-tag :text="item.level" size="mini" bgColor="#00C777FF" borderColor="#00C777FF"></u-tag>
					</view>
					<view class="m-r2">
						<u-tag text="医保" size="mini" plain type="warning"></u-tag>
					</view>
					<text>综合医院</text>
				</view>
			</view>
			
		</view>
		
	</view>
	
</template>

<script>
	export default {
		name: "hospital-list",
		props: ['list'],
		data() {
			return {
				biography:""
			};
		},
		methods:{
			jump(item){
				console.log(item)
				this.biography=item.biography;
				uni.navigateTo({
					url:'/pagesB/hospital/details?id='+item.id+'&biography='+item.biography,
					
				})
				
				
			}
		}
	}
</script>

<style lang="less">
	.content-list {
		margin-bottom: 30rpx;
		display: flex;
		&:last-child{
			margin-bottom: 0;
		}
		.img {
			width: 200rpx;
			height: 140rpx;
			flex-shrink: 0;
		}

		.view {
			width: calc(100% - 220rpx);
			margin-left: 20rpx;
			display: flex;
			flex-wrap: wrap;
			align-items: center;
			align-content: space-between;

			.title {
				width: 100%;
				color: #222;
				font-size: 28rpx;
				font-weight: 400;
				line-height: 32rpx;
			}

			.text {
				width: 100%;
				display: flex;
				align-items: center;
				justify-content: space-between;

				.a {
					width: 80%;
					font-size: 24rpx;
					color: #666;
					overflow: hidden;
					white-space: nowrap;
					text-overflow: ellipsis;
				}

				.juli {
					color: #C6C6C6FF;
					font-size: 20rpx;
				}
			}

			.tag {
				display: flex;
				align-items: center;
				color: #999;
				font-size: 22rpx;
			}
		}
	}
</style>