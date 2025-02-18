<template>
	<view class="wrapper relative">
		<view class="banner-bg"></view>
		<u-navbar :safeAreaInsetTop="true" placeholder bgColor="rgba(0,0,0,0)" :border="false">
			<view class="u-nav-slot" slot="left">
				<u--image :src="logo" height="60rpx" width="416rpx"></u--image>
			</view>
		</u-navbar>
		<scroll-view class="page-content" scroll-y="true" scroll-with-animation>
			<view class="head-block d-flex js-b-c">
				<view class="d-flex" @click="$ut.jump('/pagesC/person-info/person-info')">
					<u--image :src="userInfo.headImg || default_img" width="84rpx" height="84rpx"
						shape="circle"></u--image>
					<view class="hd-info" v-if="userInfo.orgId!='12532500G86417697A'">
						<view class="flex"> <text class="nm-text m-r1"
								v-if="userInfo">{{ userInfo.name }}</text>
							<u--image
								src="https://genepiapi.ypzlfx.com/file/genepi/2023/11/22/iShC4iMXB95hc93de8908a8287855c3695050fa0845a_20231122103950A175.png"
								height="36rpx" width="36rpx"></u--image>
						</view>
						<view class="snm-text">{{ userInfo.fdMedicalName }}</view>
					</view>
					<view class="hd-info" v-if="userInfo.orgId=='12532500G86417697A'">
						<view class="flex"> <text class="nm-text m-r1"
								v-if="userInfo">{{ userInfo.name }}</text>
						</view>
					</view>
					
					
				</view>
				<view @click="route('index')" class="flex btn-swt">
					<u--image width="32rpx" height="32rpx"
						src="https://genepiapi.ypzlfx.com/file/genepi/2023/11/21/hkGYw4kO2GNlfb54c012bc4f09f297133eeac01cd7b7_20231121114950A053.png"></u--image>
					<view class="swt-text">切换普通用户</view>
				</view>
			</view>
			<view v-if="userInfo.orgId !== '12530000431201824Q' && isRole(['jzdoctor'])" class="songjian-block">
				<view class="d-flex js-b-c tj-al">
					<view class="tit-idx">送检量</view>
				</view>
				<view class="tj-bnr-block d-flex wrap">
					<template v-for="(item, index) in songjianNum">
						<view :key="index" @click="routePush({ url: '/pagesC/submission/submission?status=' + item.status + '&timeType='+ item.timeType })" class="bnr-item d-flex flex-clm  jc-c ai-c">
							<view class="number">{{ songjianData[item.type].value }}</view>
							<view class="v-text">{{ item.label }}</view>
						</view>
					</template>
				</view>
			</view>
			<view v-if="userInfo.orgId === '12530000431201824Q'" class="songjian-block">
				<view class="d-flex js-b-c tj-al">
					<view class="tit-idx">外院送检量</view>
				</view>
				<view class="tj-bnr-block d-flex wrap">
					<template v-for="(item, index) in jsyyjslNum">
						<view :key="index" @click="routePush({ url: '/pagesC/submission/submission?status=' + item.status + '&timeType='+ item.timeType })" class="bnr-item d-flex flex-clm  jc-c ai-c">
							<view class="number">{{ jsyyjsl[item.type].value }}</view>
							<view class="v-text">{{ item.label }}</view>
						</view>
					</template>
				</view>
			</view>
			<view class="idx-block safe-area-inset-bottom">
				<block v-if="isRole(['jzdoctor'])">
					<view class="h1">我的送检</view>
					<view class="songjian-nav d-flex wrap">
						<template v-for="(item, index) in userSj">
							<view class="item-nav" :key="index"
								@click="$ut.jump('/pagesC/reportList/reportList?id='+item.id+'&key='+item.key)">
								<view class="item-inner d-flex flex-clm jc-c ai-c" hover-class="songjian-hover">
									<u--image :src="item.icon" mode="widthFix" width="76rpx" height="76rpx"></u--image>
									<view class="nav-text">{{ item.label }} <text class="base-font-color"
											v-if="sjData[item.numField].value">{{ item.numField ? '('+ sjData[item.numField].value +')' : '' }}</text>
									</view>
								</view>
							</view>
						</template>
					</view>
				</block>
				<view class="notice-blcok flex" v-if="false">
					<u--image width="66rpx" height="36rpx"
						src="https://genepiapi.ypzlfx.com/file/genepi/2023/11/24/YFGHdFuFms1cf14a163f5a15040b3c45d82a98f05bd7_20231124094938A354.png"
						mode="widthFix"></u--image>
					<u-notice-bar :text="text1" color="#262728" fontSize="28rpx" icon=" " direction="column"
						bgColor="none" url="/pages/componentsB/tag/tag"></u-notice-bar>
					<view class="rt-text">08月18日</view>
				</view>
				<view class="h1">常用工具</view>
				<view class="songjian-nav d-flex wrap">
					<view class="item-nav" @click="$ut.jump('/pagesC/submission/submission?status=3')"
						v-if="userInfo.orgId == '12530000431201824Q'">
						<view class="item-inner d-flex flex-clm jc-c ai-c" hover-class="songjian-hover">
							<u--image
								src="https://genepiapi.ypzlfx.com/file/genepi/2023/11/24/Frame@2x (4)_20231124085528A353.png"
								mode="widthFix" width="76rpx" height="76rpx"></u--image>
							<view class="nav-text">待接收</view>
						</view>
					</view>
					<template v-for="(item, index) in toolList">
						<view v-if="isRole(item.role) || !item.role" class="item-nav" :key="index" @click="toolRoute(item)">
							<view class="item-inner relative d-flex flex-clm jc-c ai-c" hover-class="songjian-hover">
								<u--image :src="item.icon" mode="widthFix" width="76rpx" height="76rpx"></u--image>
								<view class="nav-text">{{ item.label }}</view>
								<image v-if="item.fun == 'tips'" class="kfz" src="https://genepiapi.ypzlfx.com/file/genepi/2023/12/08/uGqNv361ZJg3c53a72b7d1e32a4ecfaa0492d5641419_20231208112629A450.png" mode="widthFix"></image>
							</view>
						</view>
					</template>
				</view>
				<view class="d-flex js-b-c">
					<view class="h1">科研动态</view>
					<view @click="$ut.jump('/pagesA/index/news/news?type=1')" class="h2 flex" style="color: #999;">更多
						<u-icon name="arrow-right" color="#999" size="24rpx"></u-icon>
					</view>
				</view>
				<template v-for="(item, index) in cardList">
					<view class="img-text-card d-flex" hover-class="active-hover"
						@click="$ut.jump('/pagesA/index/news/news-detalis?id='+item.id)">
						<view>
							<u--image :src="item.titlePicture" width="206rpx" height="142rpx" radius="8rpx"
								lazyLoad></u--image>
						</view>
						<view class="item-ctview">
							<view class="tit h2 ellipsis">{{ item.title || '-' }}</view>
							<view class="ctt ellipsis">{{ item.txtContent || '' }}</view>
							<view class="h5">{{ item.createTime }}</view>
						</view>
					</view>
				</template>
			</view>

		</scroll-view>
		<ut-bottomNav :value="0" type="0"></ut-bottomNav>
	</view>
</template>

<script>
	import {
		mapGetters,
		mapMutations
	} from 'vuex'
	import {
		getNewsList
	} from '@/api/generalcontent/generalcontent.js'
	import {
		authWebLoginApi
	} from '../../api/login'
	import {
		getMySendAmount,
		getSendAmount,
		getReceiveAmountApi
	} from "@/api/hospitalrelated/doctorIndexStatistic.js"
	import {
		getMyInfo
	} from "@/api/system/user.js"
	import {
		envWx
	} from "@/config";
   import { checkRole } from '@/utils/permission'

	export default {
		data() {
			return {
				envWx,
				default_img: 'https://genepiapi.ypzlfx.com/file/genepi/2023/11/24/Mask group@2x_20231124181155A412.png',
				logo: "https://genepiapi.ypzlfx.com/file/genepi/2023/11/24/jScUJfM5Jkep05ddcbde718ca3268b49f82835575730_20231124100159A368.png",
				userInfo: {},
				songjianNum: [{
						label: '今日送检',
						type: '0',
						status: '',
						timeType: '0'
					},
					{
						label: '本月送检',
						type: '1',
						status: '',
						timeType: '2'
					},
					{
						label: '总送检',
						type: '4',
						status: '',
						timeType: ''
					}
				],
				jsyyjslNum: [{
						label: '待接收',
						type: '0',
						status: '3',
						timeType: ''
					},
					{
						label: '本月接收',
						type: '2',
						status: '',
						timeType: '2'
					},
					{
						label: '总接收',
						type: '3',
						status: '',
						timeType: ''
					}
				],
				jsyyjsl: [],
				songjianData: [],
				userSj: [{
						label: '待检测',
						numField: '0',
						id: '0',
						key: '1',
						icon: '/static/index/doctor-0001.png'
					},
					{
						label: '检测中',
						numField: '1',
						id: '1',
						key: '2',
						icon: '/static/index/doctor-0002.png'
					},
					{
						label: '已完成',
						numField: '',
						id: '2',
						key: '3',
						icon: '/static/index/doctor-0003.png'
					},
					{
						label: '全部检测',
						numField: '',
						id: '',
						key: '0',
						icon: '/static/index/doctor-0004.png'
					},
				],
				sjData: [],
				toolList: [{
						label: '送检物流',
						role: ['jzdoctor'],
						url: '/pagesC/submission/submission',
						icon: 'https://genepiapi.ypzlfx.com/file/genepi/2023/11/24/xHVhz0Gd4LHg19f175df8907f8fbd599525bd6141fa5_20231124095054A355.png'
					}, 
					{
						label: '查看报告',
						role: ['jzdoctor'],
						url: '/pagesC/reportList/reportList?id=2&key=3&ishs=1',
						icon: '/static/images/c_ckbg_icon.png'
					}, 
					{
						label: '科研数据',
						url: '/pagesC/kanbanData/kanbanData',
						icon: '/static/images/c_sjtj_icon.png'
					}, 
					// {
					// 	label: '随访管理',
					// 	fun:"tips",
					// 	icon: '/static/images/c_sfgl_icon.png'
					// },
					// {
					// 	label: '向我咨询',
					// 	show: this.envWx !== 'release',
					// 	icon: 'https://genepiapi.ypzlfx.com/file/genepi/2023/11/24/Sll65Aq2CNcK13c2337f201aab8dd2b123493636992b_20231124095123A356.png',
					// 	url: '/pagesC/my-consult/my-consult'
					// },
					// {
					// 	label: '平台客服',
					// 	show: true,
					// 	icon: 'https://genepiapi.ypzlfx.com/file/genepi/2023/11/24/y1BLBzRpmgk6d952c742e7912104d61586658be5b6e4_20231124095310A357.png',
					// 	fun:"tips"
					// },
					// {
					// 	label: '设置',
					// 	icon: 'https://genepiapi.ypzlfx.com/file/genepi/2023/11/24/vPXaugqLz9mV6b14930c0c190fa11a81cb9075ea013b_20231124095405A359.png',
					// 	url: '/pagesC/setting/setting'
					// },
					// {
					// 	label: '意见反馈',
					// 	icon: 'https://genepiapi.ypzlfx.com/file/genepi/2023/11/24/I3Uk643f2wTJ4ff633c61c6a2361b7d821ceffbea6f9_20231124095341A358.png',
					// 	url: '/pagesA/user/myFeedback'
					// },
					{
						label: '试剂盒发放',
						role: ['zsdoctor', 'goverment'],
						icon: 'https://genepiapi.ypzlfx.com/file/genepi/2023/12/07/GnwbT71ahPoH83f1878829c66a5c9017c48a3e7efdf1_20231207093141A720.png',
						url: '/pagesC/cancer-screening/reagent-distribution/reagent-distribution'
					},
					// {
					// 	label: '扫一扫',
					// 	show: true,
					// 	fun: 'authWebLogin',
					// 	icon: 'https://genepiapi.ypzlfx.com/file/genepi/2023/11/24/3dXnHWzXtiGo79b23cdb9536bd56b09978c856ebf416_20231124095428A360.png'
					// },
				],
				text1: [
					'iew UI众多组件覆盖开发过程的各个需求，组件功能丰富，多端兼容。让您快速集成，开箱即用',
					'iew UI众多组件覆盖开发过程的各个需求，组件功能丰富，多端兼容。让您快速集成，开箱即用',
					'iew UI众多组件覆盖开发过程的各个需求，组件功能丰富，多端兼容。让您快速集成，开箱即用',
				],
				cardList: []
			}
		},
		computed: {
			...mapGetters(['doctorInfo', 'avatar', 'orgId', 'roles'])
		},
		onLoad() {
			this.getNews()
			this.init()
		},
		methods: {
			isRole (role) {
				console.log(role);
				return checkRole(role)
			},
			async init() {
				const res1 = await getMyInfo()
				if (res1.code == 200) {
					this.userInfo = res1.data
					this.$store.commit('SET_ORG_ID', this.userInfo.orgId)
				}

				if (this.userInfo.orgId == '12530000431201824Q') {
					getReceiveAmountApi().then(res => {
						if (res.code == 200) {
							this.jsyyjsl = res.data
						}
					})
				} else {
					getMySendAmount().then(res => {
						if (res.code == 200) {
							this.sjData = res.data
						}
					})
					getSendAmount().then(res => {
						if (res.code == 200) {
							this.songjianData = res.data
						}
					})
				}
			},
			route(type) {
				switch (type) {
					case 'index':
						uni.redirectTo({
							url: '/pages/index/index'
						})
				}
			},
			async getNews() {
				const params = {
					pageNum: 1,
					pageSize: 6,
					type: 0,
					port: 1,
					code: 'kydt',
					userId: this.$store.getters.userId
				}
				const res = await getNewsList(params)
				// console.log(res);
				if (!res || res.code !== 200) return
				const {
					records
				} = res.data
				this.cardList = [...records]
			},
			toolRoute(item) {
				const {
					url,
					fun
				} = item
				if (url) {
					uni.navigateTo({
						url
					})
					return
				}
				if (fun) {
					this[fun]()
				}

			},
			authWebLogin() {
				let this_ = this;
				uni.scanCode({
					success(r) {
						uni.showModal({
							title: "是否登录",
							content: "您正在进行登录操作，是否继续？",
							cancelText: "取消",
							confirmText: "登录",
							confirmColor: "#3B7EFFFF",
							success: function(res) {
								if (res.confirm) {
									authWebLoginApi(r.result).then((res_) => {
										if (res_.code == 200) {
											this_.$ut.showText("登录成功");
										}
									});
								} else if (res.cancel) {
									console.log("用户点击取消");
								}
							},
						});
					},
				});
			},

			jump() {
				if (this.userInfo.orgId == '12530000431201824Q') {
					this.$ut.jump('/pagesC/kanbanData/kanbanDataTwo')
				} else {
					this.$ut.jump('/pagesC/kanbanData/kanbanData')
				}
			},

			tips() {
				this.$ut.showText("功能开发中，敬请期待~")
			}
		}
	}
</script>

<style lang="scss">
	.wrapper {
		height: 100vh;
		display: flex;
		flex-direction: column;
	}

	.page-content {
		flex: 1;
		overflow: hidden;
		background: linear-gradient(to bottom, #DAE7FF 2%, #EFF3FB 100%);
	}

	.banner-bg {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		height: 694rpx;
		background: linear-gradient(135deg, #86A0FF 0%, #5178FF 67%);
		z-index: 0;
	}

	.head-block {
		padding: 24rpx 0 24rpx 32rpx;

		.hd-info {
			padding: 0 16rpx;
		}

		.nm-text {
			font-size: 32rpx;
			font-weight: 500;
			color: #fff;
		}

		.snm-text {
			line-height: 1.8;
			font-size: 24rpx;
			color: rgba(255, 255, 255, 0.8);
		}

		.btn-swt {
			padding: 10rpx 20rpx 6rpx 16rpx;
			background: #6084FF;
			border-radius: 24rpx 0rpx 0rpx 24rpx;
			border: 1rpx solid #92ABFF;
		}

		.swt-text {
			padding-left: 8rpx;
			font-size: 24rpx;
			color: #E5EEFF;
		}
	}

	.songjian-block {
		padding: 16rpx 32rpx;

		.tit-idx {
			font-weight: 500;
			font-size: 32rpx;
			color: #fff;
		}

		.tj-al {
			padding: 10rpx;
		}

		.clk-text {
			font-size: 24rpx;
			color: rgba(255, 255, 255, 0.8);
		}

		.tj-hover {
			opacity: .8;
		}

		.tj-bnr-block {
			margin-left: -32rpx;
			margin-right: -32rpx;
			padding: 8rpx 24rpx 32rpx;
			justify-content: space-between;
		}

		.bnr-item {
			width: 218rpx;
			height: 120rpx;
			background: rgba(81, 120, 255, 0.3);
			border-radius: 16rpx 16rpx 16rpx 16rpx;
			opacity: 1;
			border: 2rpx solid #8ea7ff;
			position: relative;

			&::after {
				content: '';
				position: absolute;
				left: 0;
				top: 0;
				right: 0;
				bottom: 0;
				border-image: linear-gradient(135deg, rgba(142, 167, 255, 1), rgba(81, 120, 255, 1)) 2 2;
			}


			.number {
				font-weight: bold;
				font-size: 40rpx;
				color: #fff;
			}

			.v-text {
				font-size: 24rpx;
				color: #E5EEFF;
			}
		}
	}

	.idx-block {
		padding: 48rpx 32rpx;
		border-radius: 32rpx 32rpx 0 0;
		background-color: #fff;
	}

	.songjian-nav {
		padding: 8rpx 0 32rpx;
		justify-content: flex-start;

		.item-nav {
			width: 25%;
			padding: 8rpx;
			box-sizing: border-box;
		}

		.item-inner {
			width: 100%;
			padding: 10rpx 6rpx;

		}

		.nav-text {
			padding-top: 10rpx;
			color: #262728;
			font-size: 26rpx;
		}

		.songjian-hover {
			background: #f4f4f4;
		}
	}

	.notice-blcok {
		margin: 16rpx 0 40rpx;
		padding: 14rpx 20rpx;
		background: rgba(81, 120, 255, 0.05);
		border-radius: 12rpx;

		.rt-text {
			font-size: 28rpx;
			color: #93989F;
		}
	}

	.img-text-card {
		display: flex;
		padding: 32rpx 0;
		border-bottom: 1rpx solid rgba(0, 0, 0, 0.1);

		.item-ctview {
			flex: 1;
			overflow: hidden;
			display: flex;
			flex-direction: column;
			padding: 0 20rpx;
		}

		.ctt {
			flex: 1;
			font-size: 24rpx;
			color: #666;
		}

		.pd-wt {
			padding: 0 26rpx;
		}
	}
	.kfz {
		position: absolute;
		top: 10rpx;
		right: 30rpx;
		width: 46rpx;
		height: 20rpx;
	}
</style>