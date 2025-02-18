<template>
	<view >
		<u-swipe-action>
			<u-swipe-action-item :options="options" v-for="(item, index) in list" :key="item.id" @click="bindClick($event, index)" >
				<view class="item m-t3" @click="onClick(item)">
					<image class="img" :src="item.titlePicture"></image>
					
					<view class="text">
						<view class="title width ellipsis">{{item.title}}</view>
						<view class="vice width ellipsis">{{item.txtContent}}</view>
						<view class="width flex j-c">
							<view class="vice">{{item.createTime | formatDate}}</view>
							<view class="vice flex">
								<view class="m-r1"><u-icon name="eye" color="#A8A8A8FF" size="14"></u-icon></view>
								{{item.readCount}}
							</view>
						</view>
					</view>
				</view>
			</u-swipe-action-item>
		</u-swipe-action>
	</view>
</template>

<script>
	import {getCollectList,getEditList} from '@/api/personalCenter/personalCenter.js'
	export default {
		name: "ut-slider",
		props:["list"],
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

				userId:this.$store.getters.userId,
				keyword:'',
				options: [
					{
					text: '取消',
					style: {
						backgroundColor: '#DADADAFF',
					}
				},
				{
					text: '取消收藏',
					style: {
						backgroundColor: '#FD5454FF',
						
					}
				}]
			};
		},
		methods:{
			onClick(item){
				this.$emit('onClick',item)
			},
			getIdList(){
				getCollectList(this.userId,this.keyword).then(res=>{
					this.list=res.data;
				});
			},
			bindClick(e,index){
					if(e.index==1){
						
						getEditList(this.userId,this.list[index].id).then(res=>{
							this.getIdList();
						});
					
						
				}
			}
		},
		
		
	}
</script>

<style lang="less" scoped>
	.item{
		width: 100%;
		height: 142rpx;
		display: flex;
		
		.img{
			width: 205rpx;
			height: 142rpx;
			border-radius: 8rpx;
			flex-shrink: 0;
		}
		
		.text{
			margin-left: 20rpx;
			padding-right: 10rpx;
			box-sizing: border-box;
			width: calc(100% - 225rpx);
			height: 100%;
			display: flex;
			flex-wrap: wrap;
			align-content: space-between;
			
			.title{
				color: #222;
				font-size: 28rpx;
				font-weight: 600;
			}
			
			.vice{
				font-size: 24rpx;
				color: #666;
				font-weight: 400;
			}
		}
	}
</style>