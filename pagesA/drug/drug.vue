<template>
	<view @click="close">
		<view class="head-bj">
			<ut-nav title="用药助手" leftIconColor="#fff" bgColor="transparent" :border="false"></ut-nav>
			<view class="search" @onClick="doSearch()">
				<view class="left">
					<u-search placeholder="请输入疾病、药品名称" :showAction='false' v-model="keyWord" @clickIcon="doSearch()"
						@search="doSearch()" @custom="doSearch()" @blur="blur"></u-search>
				</view>
			</view> 
			<view class="tabs-box">
				<u-tabs :list="navList" @click="onNavItem" lineColor="#fff" :activeStyle="{ color: '#fff' }"
					:inactiveStyle="{color: '#fff'}"></u-tabs>
			</view>
			<view class="flex down">
				<view class="m-r2">
					<zb-popover placement="bottom-start" :options="actions" ref="Popover1" 	@select="onSelect" @handleClick="close('1')">
						<view class="label">{{label1 || '是否医保'}} <u-icon name="arrow-down" bold size="28rpx" color="#666"></u-icon> </view>		
					</zb-popover>
				</view>	
				<view class="m-r2">
					<zb-popover placement="bottom-start" :options="actions1" ref="Popover2" @select="onSelect1" @handleClick="close('2')">
						<view class="label">{{label2 || '处方类型'}} <u-icon name="arrow-down" bold size="28rpx" color="#666"></u-icon></view>		
					</zb-popover>
				</view>
				<view class="m-r2">
					<zb-popover placement="bottom-start" :options="actions2" ref="Popover3" @select="onSelect2" @handleClick="close('3')">
						<view class="label">{{label3 || '药品类型'}} <u-icon name="arrow-down" bold size="28rpx" color="#666"></u-icon></view>		
					</zb-popover>
				</view>
			</view>
		</view>
		<view class="position">
			<scroll-view scroll-y class="scroll" :refresher-triggered="triggered" refresher-enabled @scrolltolower="loadUp()" @refresherrefresh="refresherrefresh">
				<view class="ut-view" style="padding: 0;">
					<!-- <ut-drug :list="drugList" @onClick="drugView"></ut-drug> -->
					<drugList :list="drugList" @onClick="drugView"></drugList>
				</view>
			</scroll-view>
		</view>
		<ut-nodata v-if="drugList && drugList.length == 0" class="no-data"> </ut-nodata>
		
	</view>
</template>

<script>
	import {pagevo} from '@/api/generalcontent/drugSearch.js';
	import {getDicts} from '@/api/expert/data.js'
	import drugList from "../component/drug-list/drug-list.vue"
	import zbPopover from "../component/zb-popover/zb-popover.vue"
	export default {
		data() {
			return {
				keyWord: "",
				drugList: [],
				show: true,
				pageNo: 1,
				pageSize: 10,
				total: null,
				navList: [],
				typeCode: '',
				actions:[{text:'全部',id:''}],
				actions1:[{text:'全部'}],
				actions2:[{text:'全部'}],
				medicalInsuranceType:'',
				prescriptionType:'',
				drugType:'',
				label1:'',
				label2:'',
				label3:'',
				triggered:false,
			}
		},
		components:{drugList,zbPopover},
		onLoad() {
			this.getNav()
			this.doSearch()
			
		},
		methods: {
			getNav() {
				this.navList[0] = {
					name: '全部',
					key: ''
				}
				getDicts('cancer_group').then(res => {
					if (res.code == 200) {
						res.data.forEach(item => {
							this.navList.push({
								name: item.dictLabel,
								key: item.dictValue
							})
						})
					}
				})
				getDicts('yb_type').then((res =>{
					if(res.code == 200){
						res.data.forEach(item=>{
							this.actions.push({text:item.dictLabel,id:item.dictValue})
						})
					}
				}))
				getDicts('cf_type').then((res =>{
					if(res.code == 200){
						res.data.forEach(item=>{
							this.actions1.push({text:item.dictLabel,id:item.dictValue})
						})
					}
				}))
				getDicts('drug_type').then((res =>{
					if(res.code == 200){
						res.data.forEach(item=>{
							this.actions2.push({text:item.dictLabel,id:item.dictValue})
						})
					}
				}))
			},
			
			doSearch() {
				let params = {
					pageNum: this.pageNo,
					pageSize: this.pageSize,
					keyword:this.keyWord,
					cancerGroupCode: this.typeCode,
					medicalInsuranceType:this.medicalInsuranceType,
					prescriptionType:this.prescriptionType,
					drugType:this.drugType
				}
				this.triggered = true
				pagevo(params).then(res => {
					if (res.code == 200) {
						// let  data = decrypt(res.data)
						let data = res.data
						// data=JSON.parse(data)
						this.total = res.total
						this.triggered = false
						if (data) {
							var newList = data
							if (this.pageNo == 1) {
								this.drugList = newList
							} else {
								this.drugList = this.drugList.concat(newList)
							}
						}
			
					}
				}).catch(()=>{
					this.triggered = false
				})
			},
			loadUp() {
				if (this.pageNo * this.pageSize < this.total) {
					this.pageNo++
					this.doSearch()
				}
			},
			drugView(item) {
				this.$ut.jump('/pagesA/drug/drugDetails?id=' + item.id + '&title=' + item.drugName)
			},
			onNavItem(item) {
				console.log('item',item)
				if(item.name == "全部"){
					this.reset()
				}
				this.pageNo = 1
				this.pageSize = 10
				this.typeCode = item.key
				this.doSearch()
			},
			onSelect(val) {
				// console.log('val', val)
				if(val.text == '全部'){
					this.label1 = ''
				}else{
					this.label1 = val.text
				}
				this.medicalInsuranceType = val.id
				this.doSearch()
			},
			onSelect1(val){
				if(val.text == '全部'){
					this.label2 = ''
				}else{
					this.label2 = val.text
				}
				this.prescriptionType = val.id
				this.doSearch()
			},
			onSelect2(val){
				if(val.text == '全部'){
					this.label3 = ''
				}else{
					this.label3 = val.text
				}
				this.drugType = val.id
				this.doSearch()
			},
			reset(){
				this.medicalInsuranceType = ''
				this.prescriptionType = ''
				this.drugType = ''
				this.label1 = ''
				this.label2 = ''
				this.label3 = ''
				this.keyWord = null
				this.typeCode = ''
				this.pageNo = 1
				this.pageSize = 10
			},
			close(e){
				if(e == '1'){
					this.$refs.Popover2.close()
					this.$refs.Popover3.close()
				}else if(e == '2'){
					this.$refs.Popover1.close()
					this.$refs.Popover3.close()
				}else if(e == '3'){
					this.$refs.Popover1.close()
					this.$refs.Popover2.close()
				}else{
					this.$refs.Popover1.close()
					this.$refs.Popover2.close()
					this.$refs.Popover3.close()
				}
			},
			blur(){
				 this.pageNo = 1 
				 this.doSearch()
			},
			refresherrefresh(){
				this.pageNo = 1
				this.pageSize = 10
				this.doSearch()
			}
		}
	}
</script>

<style lang="scss">
	page {
		background: #fff;
	}
	
	/deep/ .u-navbar__content__title{
		color: #fff !important;
	}
	/deep/ .u-border-bottom{
		border: none !important;
	}
	/deep/ .u-search__content{
		border-radius: 10rpx !important; 
	}
	
	.head-bj {
		width: 100%;
		height: 30vh;
		background: linear-gradient(180deg, #3B7EFF 0%, rgba(59, 126, 255, 0.5) 100%);
	
		.img-bj {
			width: 640rpx;
			height: 185rpx;
			position: absolute;
			top: 15%;
			left: 50%;
			transform: translate(-50%, -50%);
			z-index: 1;
		}
	
		.search {
			// position: absolute;
			// top:10%;
			// left: 50%;
			// transform: translate(-50%, -50%);
			// z-index: 1;
		}
	}
	
	.position {
		margin-top: -20rpx;
		border-radius: 25rpx;
		overflow: hidden;
		min-height: 600rpx;
		background: #fff;
	}
	
	.search {
		width: 85%;
		margin: 15px auto 0px auto;
		display: flex;
		align-items: center;
		justify-content: space-between;
		font-size: 30rpx;
	
		.left {
			width: 100%;
		}
	
		.right {
			width: 70rpx;
			color: #999;
			font-size: 32rpx;
		}
	}
	
	/deep/ .no-data {
		.no-data {
			top: 70%;
		}
	}
	
	.scroll {
		width: 100%;
		height: 70vh;
		padding: 30rpx 30rpx 0 30rpx;
		box-sizing: border-box;
	}
	
	.down {
		padding: 20rpx;
		box-sizing: border-box;
	}
	
	.label{
		padding: 10rpx 20rpx;
		border-radius: 100rpx;
		background: rgba(255,255,255,0.5);
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 24rpx;
		color: #666;
	}
</style>