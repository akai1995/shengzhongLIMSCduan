<template>
	<view>
		<ut-nav title="选择地址" border></ut-nav>

		<view class="content">
			<u-checkbox-group  shape="circle" v-model="checkbox">
				<block v-for="(item,index) in dataList" :key="index">
					<view class="view" @click="onActive(item)">
						<view class="title">
							<view class="icon">{{item.suName}}</view>
							<view class="m-r1">{{item.name}}</view>
							<view>{{item.phoneNumber}}</view>
						</view>
						<view class="tag" v-if="item.defaultSendAddress == 0">
							<u-tag text="默认寄件" plain size="mini" type="warning"></u-tag>
						</view>
						<view class="tag" v-if="item.defaultAddress == 0">
							<u-tag text="默认收件" plain size="mini" type="success"></u-tag>
						</view>
						<view class="check" v-if="isDelete">
							<u-checkbox :name="item.id"></u-checkbox>
						</view>
						<view class="text">{{item.address}}</view>
						<view class="edit" @click.stop="$ut.jump('/pagesA/inspect/address-save?id='+item.id+'&type=1')">
							<u-icon name="edit-pen" color="#999" size="38rpx"></u-icon>
						</view>
					</view>
				</block>
			</u-checkbox-group>
		</view>
		
		<ut-nodata v-if="dataList.length == 0"></ut-nodata>

		<view class="bottom-box">
			<block v-if="!isDelete">
				<view class="btn1" @click="isDelete = true">批量删除</view>
				<view class="btn2"  @click.stop="$ut.jump('/pagesA/inspect/address-save?type=0')">新建地址</view>
			</block>
			<block v-if="isDelete">
				<view class="btn1" @click="onDelete">取消</view>
				<view class="btn2" @click="remove">确认删除  <text v-if="checkbox.length>0">({{checkbox.length}})</text> </view>
			</block>
		</view>
	</view>
</template>

<script>
	import {
		updateInspectionAddress,
		deleteInspectionAddress,
		getAddres
	} from "@/api/hospitalrelated/hospitalrelated"
	export default {
		data() {
			return {
				userId:this.$store.getters.userId,
				dataList:[],
				isShow:0,
				defaultAddress:'',
				checkbox:[],
				isDelete:false,
				suName:'',
				type:'',
			};
		},
		onLoad(optins) {
			this.type=optins.type;
		},
		onShow() {
			this.getAddress()
		},
		methods:{
			onDelete(){
				this.isDelete = false
				this.checkbox = []
			},
			onActive(item,index){
				if(!this.isDelete){
					// 获取所有页面栈实例列表
					let pages = getCurrentPages();  
					
					// 当前页页面实例
					let nowPage = pages[ pages.length - 1]; 
					 
					// 上一页页面实例
					let prevPage = pages[ pages.length - 2 ];  
					
					// 修改上一页data里面的subForm参数
					
					if(this.type==0){
						let mailAddress= item.name+' '+item.phoneNumber+'\n'+item.address;
						prevPage.$vm.subForm.mailAddress = mailAddress; 
					}else{
						let reachAddress= item.name+' '+item.phoneNumber+'\n'+item.address;
						prevPage.$vm.subForm.reachAddress = reachAddress; 
					}
					
					uni.navigateBack()
				}else{
					let item_ = this.checkbox.findIndex((u) => u == item.id)
					if(item_ == -1){
						this.checkbox.push(item.id)
					}else{
						this.checkbox.splice(this.checkbox.indexOf(item.id),1)
					}
				}
				
			},
			getAddress(){
				getAddres(this.userId).then(res=>{
					this.dataList=res.data;
					if(this.dataList.length!=0){
					for (var i = 0; i < res.data.length; i++) {
						
							this.suName=res.data[i].name.slice(0, 1);
							var name=res.data[i]
							name['suName']=this.suName
						}
						
						
					}
				})
			},
			remove(){
				let ids=this.checkbox.toString()
				deleteInspectionAddress(ids).then(res=>{
					if(res.code==200){
						this.getAddress();
						this.isDelete = false;
						this.checkbox=[];
					}
					
				})
			}
		}
	}
</script>

<style lang="less">
.view{
	width: 100%;
	min-height: 140rpx;
	border-radius: 20rpx;
	background: #fff;
	padding: 30rpx;
	box-sizing: border-box;
	margin-bottom: 20rpx;
	position: relative;

	.tag{
		position: absolute;
		top: 15rpx;
		right: 30rpx;
	}

	.edit{
		position: absolute;
		right: 30rpx;
		top: 60%;
		transform: translateY(-40%);
		z-index: 9;
	}

	.check{
		position: absolute;
		left: 30rpx;
		top: 60%;
		transform: translateY(-40%);
	}
}
.title{
	display: flex;
	align-items: center;
	font-size: 28rpx;
	font-weight: 600;
	color: #333;
	.icon{
		width: 35rpx;
		height: 35rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		background: #3B7EFFFF;
		color: #fff;
		font-size: 24rpx;
		margin-right: 15rpx;
	}
}
.text{
	width: 80%;
	margin: auto;
	margin-top: 10rpx;
	font-size: 24rpx;
	color: #999;
	line-height: 1.4;
}

.bottom-box{
	width: 100%;
	height: 120rpx;
	display: flex;
	align-items: center;
	justify-content: space-around;
	box-shadow: 0rpx -8rpx 20rpx 0rpx rgba(6,63,150,0.1);
	position: fixed;
	left: 0;
	bottom: 0;
	z-index: 10;
	.btn1{
		width: 320rpx;
		height: 80rpx;
		border-radius: 80rpx;
		background: #3B7EFF1A;
		font-size: 36rpx;
		color: #3B7EFFFF;
		display: flex;
		align-items: center;
		justify-content: center;
		letter-spacing: 2rpx;

	}
	.btn2{
		width: 320rpx;
		height: 80rpx;
		border-radius: 80rpx;
		background: linear-gradient(135deg, #3B7EFF 0%, #0C5FFF 100%);
		font-size: 36rpx;
		color: #fff;
		display: flex;
		align-items: center;
		justify-content: center;
		letter-spacing: 2rpx;
	}
}

/deep/ .u-checkbox-group {
		display: block !important;
	}
</style>
