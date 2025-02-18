<template>
	<view>
		<z-paging ref="paging" v-model="messageList" @query="queryList">
			<template #top>
				<ut-nav title="消息" :url="back" border></ut-nav>
				<view class="menu-box">
					<view class="menu-item" v-for="(item,index) in menuList" :key="index" @click="onItem(item)">
						<view class="badge">
							<u-badge max="99" :value="item.num"></u-badge>
						</view>
						<image class="img" :src="item.img"></image>
						<text class="name">{{item.name}}</text>
					</view>
				</view>
			</template>
			<view class="content">
				<view class="list">
					<view class="list-item" v-for="(item,index) in messageList" :key="index" @click="jump(item)">
						<image class="img" :src="getHeadImg(item)" mode=""></image>
						<view class="text">
							<view class="flex j-c" style="width: 100%;">
								<view class="h2">{{getName(item)}}</view>
								<view class="h5">{{item.contentTime}}</view>
							</view>
							<view class="flex j-c" style="width: 100%;">
								<view class="t">{{item.userName}}：{{item.content}}</view>
								<view><u-badge max="99" :value="item.number"></u-badge></view>
							</view>
						</view>
					</view>

				</view>
			</view>

		</z-paging>
	</view>
</template>

<script>
	import {getUserMessageList} from '@/api/system/user.js'
	export default {
		data() {
			return {
				back:'/pages/user/user',
				type:null,
				menuList:[{
					name:'我的报告',
					type:1,
					img:'/static/user/message_icon1.png',
					num:0
				},{
					name:'我的社区',
					type:2,
					img:'/static/user/message_icon2.png',
					num:0
				},{
					name:'我的咨询',
					type:3,
					img:'/static/user/message_icon3.png',
					num:0
				},{
					name:'遗传筛查',
					type:4,
					img:'/static/user/message_icon4.png',
					num:0
				},],
				messageList:[],
			};
		},
		
		onLoad(options) {
			if(options.type == 1){
				this.back = "/pages/user/userA"
			}
		},
		methods: {
			queryList(pageNo,pageSize){
				uni.showLoading()
				let params = {
					isAsc:'desc',
					orderByColumn:'create_time',
					pageNum:pageNo,
					pageSize:pageSize,
					reasonable:true,
					type:this.type,
					userId:this.$store.getters.userId
				}
				getUserMessageList(params).then(res=>{
					uni.hideLoading()
					if (res.code == 200) {
						this.$refs.paging.complete(res.data.records);
					}
				}).catch(err=>{
					uni.hideLoading()
				})
			},
			getHeadImg(item){
				let userId = this.$store.getters.userId 
				if(userId == item.receiverId){
					return item.senderImg || 'https://genepiapi.ypzlfx.com/file/genepi/2023/07/20/OxbWNs6SoNLF1129151bdb41b25719e93409dc3a1f5b_20230720170831A016.jpg'
				}else if(userId == item.senderId){
					return item.receiverImg || 'https://genepiapi.ypzlfx.com/file/genepi/2023/07/20/OxbWNs6SoNLF1129151bdb41b25719e93409dc3a1f5b_20230720170831A016.jpg'
				}
			},
			getName(item){
				let userId = this.$store.getters.userId
				if(userId == item.receiverId){
					return item.senderUserName
				}else if(userId == item.senderId){
					return item.receiverUserName
				}
			},
			onItem(item){
				this.type = item.type,
				this.$refs.paging.reload();
			},
			jump(item){
				let userId = this.$store.getters.userId
				let fromId = ''
				let formName = this.getName(item)
				if(userId == item.receiverId){
					fromId = item.senderId
				}else if(userId == item.senderId){
					fromId = item.receiverId
				}
				if(item.type == 3){
					uni.navigateTo({
						url:'/pagesA/user/chat?id='+item.id + '&fromId='+fromId + '&formName='+formName
					})
				}
			}
		}
	}
</script>

<style lang="less">
	page {
		background: #fff;
	}

	.menu-box {
		width: 90%;
		height: 210rpx;
		margin: auto;
		background: #fff;
		padding: 30rpx;
		box-sizing: border-box;
		display: flex;
		align-items: center;
		justify-content: space-between;

		.menu-item {
			width: 100rpx;
			min-height: 100rpx;
			text-align: center;
			position: relative;

			.badge {
				position: absolute;
				top: 0;
				right: 0;
				z-index: 1;
			}

			.img {
				width: 100rpx;
				height: 100rpx;
			}

			.name {
				margin-top: 10rpx;
				color: #000;
				font-size: 24rpx;
				font-weight: 400;
			}
		}
	}

	.list {
		margin-bottom: 20rpx;
		&-item {
			display: flex;
			align-items: center;
			justify-content: space-between;
			width: 100%;
			height: 120rpx;
			margin-bottom: 40rpx;

			.img {
				width: 100rpx;
				height: 100rpx;
				border-radius: 50%;
				flex-shrink: 0;
			}

			.text {
				width: calc(100% - 120rpx);
				height: 100%;
				border-bottom: 2rpx solid #DADADAFF;
				display: flex;
				flex-wrap: wrap;
				align-content: center;

				.t {
					color: #666;
					font-size: 24rpx;
				}
			}
		}
	}
</style>