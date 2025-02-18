<template>
	<view>
		<ut-nav title="专家列表" border></ut-nav>
		<view style="background: #fff;">
			<u-tabs :list="listTab" :activeStyle="{color:'#3c9cff'}" @click="onItem1" @change="select"></u-tabs>
		</view>

		<view class="content">
			<u-search  :showAction='false' bgColor="#fff" v-model="keyword" placeholder="搜索" @change="getList"></u-search>
			<view class="list" v-for="item in listData" :key="item.id" @click="onItem2(item)">
				<image class="img" :src="item.headImg" mode="aspectFit"></image>
				<view class="text">
					<view class="one">
						<view>
							<view class="name m-r2">
								<text class="m-r2">{{item.name}}</text>
								<text >{{item.level}}</text>
							</view>
							<view class="m-t1">{{item.lable}}</view>
						</view>
					</view>
					<view class="two ellipsis2">{{item.speciality}}</view>
				</view>

				<view class="radio" :class="active == item.id?'active':''"></view>
				<view class="radio-icon">
					<u-icon name="checkbox-mark" color="#fff" size="24"></u-icon>
				</view>
			</view>
			<view class="button m-t6" @click="jump()" v-if="listData.length > 0">确认选择</view>
		</view>
	</view>
</template>

<script>
import { get } from 'http';
import {List} from "@/api/expert/information.js"
import {getDicts} from "@/api/expert/data.js"
	export default {
		data() {
			return {
				keyword:'',
				classification:'',
				listTab:[],
				list:{},
				listData:[],
				information: {
					type:'exper_classification',
				},
				item: {},
				active: '',
			};
		},
		onLoad() {
			this.getList();
		},
		methods:{
			getList(){
				getDicts(this.information.type).then(res=>{
					console.log(res.data.length)
					for (var i = 0; i < res.data.length; i++) {
						this.list={};
						this.$set(this.list,"name",res.data[i].dictLabel);
						this.listTab.push(this.list);
					}
					if (res.data && res.data.length>0) {
						this.classification = res.data[0].dictLabel
					}
					/** 查询专家信息 */
					List(this.keyword,this.classification).then(res => {
						this.listData = res.data;
					});
				})

			},
			select(){
				List(this.keyword,this.classification).then(res => {
				  this.listData = res.data;
				});
			},
			onItem1(item) {
				this.classification=item.name;
			},
			onItem2(item) {
				this.active = item.id
				this.item = {'doctorId': item.userId, 'doctorName': item.name}
			},
			jump() {
				let item =  encodeURIComponent(JSON.stringify(this.form))
				if(this.active){
					// 获取所有页面栈实例列表
					let pages = getCurrentPages();

					// 当前页页面实例
					let nowPage = pages[ pages.length - 1];

					// 上一页页面实例
					let prevPage = pages[ pages.length - 2 ];
					// console.log('++', prevPage.$vm.form )
					// 修改上一页data里面的times参数值为100
					prevPage.$vm.form.doctorName = this.item.doctorName;
					// console.log('--', prevPage.$vm.form )

					uni.navigateBack()
				}else{
					this.$ut.showText('请选择要申请解读的医生')
				}

			}
		}
	}
</script>

<style lang="less">
page{
	background: #f8f8f8;
}
.list{
	width: 100%;
	display: flex;
	margin-bottom: 30rpx;
	&:last-child{
		margin-bottom: 0;
	}

	.radio {
		position: absolute;
		right: 0;
		bottom: 0;
		// background: #DADADAFF;
		border-width: 40rpx;
		border-style: solid;
		border-color: transparent #DADADAFF #DADADAFF transparent;
		z-index: 1;
	}

	.radio-icon {
		position: absolute;
		right: 0;
		bottom: 0;
		z-index: 2;
	}
}
.img{
	width: 100rpx;
	height: 100rpx;
	border-radius: 50%;
	flex-shrink: 0;
}
.text{
	margin-left: 20rpx;
	width: calc(100% - 120rpx);
	.one{
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		color: #666;
		font-size: 24rpx;
		.name{
			color: #222;
			font-size: 28rpx;
		}
	}
	.two{
		width: 100%;
		color: #999;
		margin-top: 10rpx;
		font-size: 24rpx;
	}
}
.tag{
	padding: 5rpx 15rpx;
	color: #3B7EFFFF;
	font-size: 24rpx;
	background: #3B7EFF1A;
	border-radius: 10rpx;
	letter-spacing: 2rpx;
}
.m-t1{
	margin-top: 10rpx;
}
.active {
	border-color: transparent #3B7EFFFF #3B7EFFFF transparent !important;
	background: white;
}

.button {
	// position: fixed;
	// left: 70rpx;
	// right: 70rpx;
	// bottom: 65rpx;
	height: 80rpx;
	border-radius: 80rpx;
	background: linear-gradient(135deg, #00DEFF 0%, #0C5FFF 100%);
	display: flex;
	align-items: center;
	justify-content: center;
	color: #fff;
	font-size: 36rpx;
	font-weight: 500;
	letter-spacing: 2rpx;
}
</style>
