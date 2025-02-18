<template>
	<view>
		<z-paging ref="paging" v-model="followList" @query="queryList">
			<template #top>
				<ut-nav title="我的粉丝" border></ut-nav>
				<view class="ut-padding">
					<view class="flex j-c m-t2">
						<view class="face">我的粉丝（{{(followList && followList.length) ||0}}）</view>
						<view class="weight flex">
							<dropdown :list="dropdown" :label="label" @onClick="dropDown"></dropdown>
						</view>
					</view>
				</view>
				
			</template>
			
			<view class="content">
				<view class="list width" v-for="(item,index) in followList" :key="index">
					<view class="left">
						<image class="img" :src="item.avatar || ''" mode=""></image>
						<view class="text">
							<view class="width name">{{item.name}}</view>
							<view class="width ip">IP:云南</view>
						</view>
					</view>
					<view class="right" v-if="isMyself">
						<view class="tag" @click="onConcern(item)" v-if="item.together">相互关注</view>
						<view class="tags" @click="onConcern(item)" v-else>回关</view>
					</view>
				</view>
			</view>
		</z-paging>
	</view>
</template>

<script>
	import {
		concernPeoplePage,
		concern,
	} from "@/api/community.js";
	export default {
		data() {
			return {
				keyword:'',
				followList:[],// 粉丝列表
				userId:'',
				isMyself: false,
				dropdown:[{label:'综合排序',id:'0'},{label:'最近关注',id:'1'},{label:'最早关注',id:'2'}],
				label:'综合排序'
			};
		},
		onLoad(options) {
			if(options.userId){
				this.userId = options.userId
			}else{
				this.userId = this.$store.getters.userId
			}
			this.isMyself = this.userId == this.$store.getters.userId
		},
		methods:{
			queryList(pageNo,pageSize){
				var params = {
					pageNum: pageNo,
					pageSize: pageSize,
					userId: this.userId,
					type: "user_follow:",
					isAsc: this.label == '最早关注'  ? 'asc' : 'desc'
				}
				concernPeoplePage(params).then(res=>{
					if (res.code==200) {
						this.followList = res.data
					}
				})
			},
			dropDown(e){
				console.log('e',e)
				this.label = e.label
				this.$refs.paging.reload()
			},
			onConcern(item) {
				var params = {
					concernId: item.id
				}
				var that = this;
				if (item.together) {
					uni.showModal({
						title: '取消关注',
						content: '您是否不再关注该用户？',
						cancelText: '取消',
						confirmText: '确认',
						confirmColor: '#3B7EFFFF',
						success: function(res) {
							if (res.confirm) {
								concern(params).then(res=>{
									if (res.code==200) {
										that.$ut.showText('取关成功')
										that.$set(item, "together", false)
									}
								})
							}
						}
					})
				} else {
					concern(params).then(res=>{
						if (res.code==200) {
							that.$ut.showText('回关成功');
							that.$set(item, "together", true)
						}
					})
				}
			},
		}
	}
</script>

<style lang="less">
page{
	background: #fff;
}

.face{
	color: #666;
	font-size: 24rpx;
	font-weight: 400;
}
.weight{
	color: #000;
	font-size: 24rpx;
}
.list{
	display: flex;
	align-items: center;
	margin-bottom: 30rpx;
	.left{
		width: 80%;
		display: flex;
		.img{
			width: 100rpx;
			height: 100rpx;
			border-radius: 50%;
			flex-shrink: 0;
		}
		.text{
			display: flex;
			flex-wrap: wrap;
			align-content: space-between;
			margin-left: 20rpx;
			.name{
				font-size: 28rpx;
				font-weight: 500;
				color: #222;
			}
			.ip{
				font-size: 24rpx;
				color: #666;
				font-weight: 400;
			}
		}
	}
	.right{
		width: 20%;
		display: flex;
		justify-content: flex-end;
	}
}
.tag{
	color: #999;
	font-size: 22rpx;
	background: #f8f8f8;
	border-radius: 10rpx;
	padding: 5rpx 15rpx;
}
.tags{
	color: #3B7EFFFF;
	font-size: 22rpx;
	border:1rpx solid #3B7EFFFF;
	border-radius: 10rpx;
	padding: 5rpx 15rpx;
}
</style>
