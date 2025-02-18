<template>
	<view class="wrapper">
		<u-navbar title="个人资料" :placeholder="true" border>
			<view class="u-nav-slot" slot="left">
				<u-icon name="arrow-left" @click="onBack" size="19"></u-icon>
				<u-line direction="column" :hairline="false" length="16" margin="0 8px"></u-line>
				<u-icon name="home" size="20" @click="onHome"></u-icon>
			</view>
		</u-navbar>
		<scroll-view class="page-content" scroll-with-animation scroll-y>
			<view class="desc-row d-flex js-b-c" @click="">
				<view class="desc-text">头像</view>
				<view class="flex">
					<view class="pr-32"><u--image :src="userInfo.headImg" radius="12rpx" width="84rpx" height="84rpx"></u--image></view>
					<u-icon name="arrow-right" color="#999" size="40rpx"></u-icon>
				</view>
				<button class="primary" plain open-type="chooseAvatar" @chooseavatar="onChooseAvatar"></button>
			</view>
			<view class="desc-row d-flex js-b-c" @click="isSex = true">
				<view class="desc-text">性别</view>
				<view class="flex">
					<view class="desc-text pr-32">{{ userInfo.sex }}</view>
					<u-icon name="arrow-right" color="#999" size="40rpx"></u-icon>
				</view>
			</view>
			<u-picker :show="isSex" :columns="sexList" @confirm="confirmSex"
				@cancel="isSex = false"></u-picker>
			<view class="desc-row d-flex js-b-c" @click="isLevel = true">
				<view class="desc-text">职称</view>
				<view class="flex">
					<view class="desc-text pr-32">{{ userInfo.level }}</view>
					<u-icon name="arrow-right" color="#999" size="40rpx"></u-icon>
				</view>
			</view>
			<u-picker :show="isLevel" :columns="levelList" @confirm="confirmLevel"
				@cancel="isLevel = false"></u-picker>
			<view class="desc-row d-flex js-b-c">
				<view class="desc-text">所在医院</view>
				<view class="flex">
					<view class="desc-text pr-32">{{ userInfo.fdMedicalName }}</view>
					<!-- <u-icon name="arrow-right" color="#999" size="40rpx"></u-icon> -->
				</view>
			</view>
			<view class="desc-row d-flex js-b-c" @click="isLabel = true">
				<view class="desc-text">所在科室</view>
				<view class="flex">
					<view v-if="userInfo.lable" class="desc-text pr-32">{{ userInfo.lable }}</view>
					<view v-else class="desc-plr pr-32">未选择</view>
					<u-icon name="arrow-right" color="#999" size="40rpx"></u-icon>
				</view>
			</view>
			<u-picker :show="isLabel" :columns="tagList" @confirm="confirmLable"
				@cancel="isLabel = false"></u-picker>
			<view class="desc-row d-flex js-b-c wrap">
				<view class="desc-text">擅长</view>
				<view class="m-t2">
					<u-checkbox-group v-model="classVal" shape="square" @change="checkConfirm">
						<u-checkbox :customStyle="{marginRight: '16px'}" v-for="(item, index) in classList" :key="index"
							:label="item.dictLabel" :name="item.dictValue">
						</u-checkbox>
					</u-checkbox-group>
				</view>
			</view>

		</scroll-view>
	</view>
</template>
	
<script>
	import {
		mapGetters
	} from 'vuex'
	import {
		baseUrl
	} from "@/config";
	import {getMyInfo,dict,editExpoert} from "@/api/system/user.js"
	export default {
		data() {
			return {
				userInfo:{},
				sexList:[],
				levelList:[],
				classList:[],
				tagList:[],
				isSex:false,
				isLevel:false,
				isLabel:false,
				classVal:[]
			}
		},
		computed: {
			...mapGetters(['avatar'])
		},
		onLoad() {
			this.init()
			this.getDict()
		},
		methods: {
			init(){
				getMyInfo().then(res=>{
					if(res.code == 200){
						this.userInfo = res.data
						this.classVal = res.data.speciality.split(',')
					}
				})
			},
			getDict() {
				dict('sys_user_sex').then(res => {
					let list = []
					res.data.forEach(item => {
						list.push(item.dictLabel)
					})
					this.sexList.push(list)
				})
				//职称列表
				dict('exper_level').then(res => {
					let list = []
					res.data.forEach(item => {
						list.push(item.dictValue)
					})
					this.levelList.push(list)
				})
				//科室列表
				dict('exper_classification').then(res => {
					res.data.forEach(item => {
						if (item.dictValue != '全部') {
							this.classList.push(item)
						}
					})
				})
				//擅长列表
				dict('exper_lable').then(res => {
					let list = []
					res.data.forEach(item => {
						list.push(item.dictLabel)
					})
					this.tagList.push(list)
					// console.log('tag',this.tagList)
				})
			},
			onChooseAvatar(e) {
				this.headImg = e.detail.avatarUrl
				uni.uploadFile({
					url: baseUrl + '/file/upload',
					filePath: this.headImg,
					name: 'file',
					success: ress => {
						let result = JSON.parse(ress.data)
						editExpoert({headImg: result.data.url})
						this.userInfo.headImg = result.data.url
						
						this.$store.commit('SET_AVATAR',result.data.url)
					},
				})
			},
			confirmSex(e){
				this.userInfo.sex = e.value[0]
				editExpoert({sex:e.value[0]})
				this.isSex = false
			},
			//职称
			confirmLevel(e){
				this.userInfo.level = e.value[0]
				editExpoert({level:e.value[0]})
				this.isLevel = false
			},
			//科室
			confirmLable(e){
				this.userInfo.lable = e.value[0]
				editExpoert({lable:e.value[0]})
				this.isLabel = false
			},
			checkConfirm(e){
				let valArr = e.join(',')
				editExpoert({speciality:valArr})
			},
			onBack () {
				uni.navigateBack({
					delta: 1
				})
			},
			onHome () {
				uni.redirectTo({
					url: '/pagesC/doctor-index/doctor-index'
				})
			}
		}
	}
</script>
<style scoped lang="scss">
	.primary{
		position: absolute;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		z-index: 9;
		border: none;
	}
	.wrap{
		flex-wrap: wrap;
	}
	/deep/.u-checkbox-group {
		flex-wrap: wrap;
	}
	
	/deep/.u-checkbox {
		margin-bottom: 10rpx;
	}
</style>
<style lang="scss">
	@import '../setting/setting.scss'
	
</style>
