<template>
	<view class="page">
		<view style="padding: 30rpx; box-sizing: border-box">
			<u-navbar title=" " :placeholder="true" :safeAreaInsetTop="true" bgColor="#C7D9FD" leftIconColor="#303133">
				<view class="u-nav-slot" slot="left">
					<u--image :src="logo" height="60rpx" width="416rpx" mode="widthFix"></u--image>
				</view>
			</u-navbar>
			<view class="search">
				<view class="left">
					<u-search
						placeholder="搜索肿瘤科普知识"
						shape="square"
						placeholderColor="#d9d9d9"
						:showAction="false"
						bgColor="#ffffff"
						v-model="keyword"
						disabled
						@click="$ut.jump('/pagesB/search/search')"
					></u-search>
				</view>
				<view class="right" @click="jumpMessage">
					<view class="icon-box">
						<!-- <u-icon name="chat" color="#2979ff" size="22"></u-icon> -->
						<u--image src="/static/index/message.png" height="48rpx" width="48rpx"></u--image>
					</view>
					<text class="text width">消息</text>
				</view>
				<!-- <view class="right" @click="scanCode">
					<view class="icon-box">
						<u-icon name="scan" color="#2979ff" size="25"></u-icon>
					</view>
					<text class="text width">扫一扫</text>
				</view> -->
			</view>
			<view class="menu-box m-t3">
				<view class="menu-a" @click="$ut.jump('/pagesA/signin/signin')">
					<view class="title">肿瘤分子检测</view>
					<view class="vice">快速登记 样本全程跟踪</view>
					<view class="look">我要检测</view>
					<image
						class="img"
						src="https://genepiapi.ypzlfx.com/file/genepi/2023/12/07/dlcOTuiADvXm0561969c4cc56d2c35a2787432ea0599_20231207165504A975.png"
						mode=""
					></image>
				</view>
				<!-- <view class="menu-a" @click="$ut.jump('/pages/report/report')"
					style="background: linear-gradient(180deg, #EAE9FF 0%, #FFFFFF 100%);">
					<view class="title">查看电子报告</view>
					<view class="vice">实时查看检测全流程</view>
					<view class="look1">邮寄纸质报告</view>
					<image class="img" style="width: 140rpx;height: 135rpx;" src="https://genepiapi.ypzlfx.com/file/genepi/2023/12/07/DVnmFen6Whcl0aabe6396a56f4936c540487020bd086_20231207165521A976.png"
						mode=""></image>
				</view> -->
				<!-- <view class="menu-a" @click="handleScreenClick" style="background: linear-gradient(180deg, #eae9ff 0%, #ffffff 100%)">
					<view class="title">两癌早筛</view>
					<view class="vice">云南省中医医院预控严筛</view>
					<view class="look1">我要早筛</view>
					<image
						class="img"
						style="width: 140rpx; height: 135rpx"
						src="https://genepiapi.ypzlfx.com/file/genepi/2023/12/07/DVnmFen6Whcl0aabe6396a56f4936c540487020bd086_20231207165521A976.png"
						mode=""
					></image>
				</view> -->
			</view>

			<view
				class="top-tips"
				:style="{ top: tipsHeight.height + tipsHeight.top + 10 + 'px' }"
				v-if="isTips === 'tips'"
				@click="showPopup = true"
			>
				<view class="flex"
					>点击 <image :src="img1" class="dian" mode=""></image> 添加我的小程序
					<image :src="img2" class="icon-img" mode=""></image> 使用更方便
				</view>
				<view @click.stop="onTips()">
					<u-icon name="close" color="#fff" size="28rpx"></u-icon>
				</view>
			</view>

			<!-- alert -->
			<view class="notification m-t3" v-if="false">
				<view>您有 3 份样本正在寄送中~</view>
				<view class="btn">点击查看 <u-icon name="arrow-right" color="#fff" size="22rpx"></u-icon> </view>
			</view>

			<view class="notification m-t3" style="background: #e5fff5ff" v-if="false">
				<view style="color: #00c777ff">您有 3 份样本正在检测~</view>
				<view class="btn" style="background: #00c777ff">点击查看 <u-icon name="arrow-right" color="#fff" size="22rpx"></u-icon> </view>
			</view>

			<view class="swiper m-t3">
				<u-swiper :list="swiper" @change="(e) => (current = e.current)" @click="swiperJump" :autoplay="true" :loop="true" circular>
					<view slot="indicator" class="indicator">
						<view
							class="indicator__dot"
							v-for="(item, index) in swiper"
							:key="index"
							:class="[index === current && 'indicator__dot--active']"
						></view>
					</view>
				</u-swiper>
			</view>
			<view class="menu-box1 m-t3">
				<view class="menu-item" @click="$ut.jump('/pagesA/drug/drug')">
					<image class="img" src="@/static/public/menu3.png" mode=""></image>
					<text class="name">用药助手</text>
				</view>
				<view class="menu-item" @click="$ut.jump('/pagesA/index/class/card')">
					<image class="img" src="@/static/public/menu4.png" mode=""></image>
					<text class="name">检测项目</text>
				</view>
				<view class="menu-item" @click="$ut.jump('/pagesB/cancer-premature-aging/list/list')">
					<image class="img" src="@/static/public/menu2.png" mode=""></image>
					<text class="name">肿瘤早筛</text>
				</view>
				<view class="menu-item" @click="$ut.jump('/pages/report/report')">
					<image class="img" src="@/static/public/dianzibaogao.png" mode=""></image>
					<text class="name">电子报告</text>
				</view>
				<!-- <view class="menu-item" >
					<image class="img" src="@/static/public/menu0.png" mode=""></image>
					<text class="name">在线问诊</text>
				</view> -->
			</view>

			<view v-if="envWx !== 'release'" class="m-t3">
				<ut-expert-list :list="expertList" :head="true"></ut-expert-list>
			</view>

			<view class="m-t3 ut-view">
				<view class="width flex j-c" @click="$ut.jump('/pagesA/index/news/news?type=2')">
					<view class="h1">肿瘤知识科普</view>
					<view class="vice1 flex"><text class="m-r1">更多</text> <u-icon name="arrow-right" color="#999" size="24rpx"></u-icon></view>
				</view>
				<ut-new :list="newData" @onClick="onClick"></ut-new>
			</view>
			<ut-bottomNav :value="0"></ut-bottomNav>
		</view>

		<u-popup :show="showPopup" mode="bottom" closeable round="25rpx" @close="showPopup = false">
			<view class="tips-box">
				<view class="h1">如何添加我的小程序</view>
				<view class="overflow m-t2">
					<view class="item m-t2"> <text style="color: #3b7eff">01.</text> 点击右上 [・・・] 更多按钮</view>
					<view class="item-img m-t2">
						<image class="img" :src="tipsImg3" mode=""></image>
					</view>
					<view class="item m-t2"> <text style="color: #3b7eff">02.</text> 选择弹层内 [・・・] 更多按钮</view>
					<view class="item-img m-t2">
						<image class="img" :src="tipsImg2" mode=""></image>
					</view>
					<view class="item m-t2"> <text style="color: #3b7eff">03.</text> 微信首页下拉，可快速找到 [ 分子诊断区域平台 ] 小程序</view>
					<view class="item-img m-t2">
						<image class="img" :src="tipsImg1" mode=""></image>
					</view>
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
import { getList } from "@/api/medicalInstitution/hospital.js";
import { getList1 } from "@/api/expert/information.js";
import { getNewsList } from "@/api/generalcontent/generalcontent.js";
import { swiperList } from "@/api/index.js";
import { mapGetters } from "vuex";
import { getZjListApi } from "../../api/chat";
import { envWx } from "@/config";
import { check } from "@/api/book.js";
import { getInfoByToken } from "@/api/personalCenter/personalCenter";
export default {
	data() {
		return {
			envWx: "release",
			keyword: "",
			current: 0,
			logo: "https://genepiapi.ypzlfx.com/file/genepi/2023/12/07/U5gFdYHpS0aRde080d36af056f00c408e49870a5b6f4_20231207165852A977.png",
			/* logo: "https://genepiapi.ypzlfx.com/file/genepi/2024/05/29/logo_20240529.png", */
			newsParams: {
				isAsc: "desc",
				orderByColumn: "create_time",
				pageNum: 1,
				pageSize: 6,
				reasonable: true,
				type: 0,
				port: 2,
				userId: this.$store.getters.userId,
			},
			information: {
				pageNum: 1,
				pageSize: 3,
			},
			swiper: [],
			listTitle: [
				{
					id: 1,
					title: "医疗机构",
				},
				{
					id: 2,
					title: "专家列表",
				},
			],
			newData: [],
			listData: [],
			listData1: [],
			expertList: [], // 推荐医生列表
			img1: "https://genepiapi.ypzlfx.com/file/genepi/2023/11/14/Fill 43@2x_20231114141733A302.png",
			img2: "https://genepiapi.ypzlfx.com/file/genepi/2023/11/14/Union@2x_20231114141737A303.png",
			showPopup: false,
			tipsImg1: "https://genepiapi.ypzlfx.com/file/genepi/2023/11/14/Group 770@2x_20231114113803A299.png",
			tipsImg2: "https://genepiapi.ypzlfx.com/file/genepi/2023/11/14/Mask group@2x (1)_20231114113809A300.png",
			tipsImg3: "https://genepiapi.ypzlfx.com/file/genepi/2023/11/14/Group 769@2x_20231114113812A301.png",
			tipsHeight: uni.getMenuButtonBoundingClientRect(), //右侧胶囊详细信息
		};
	},
	onLoad() {
		/* this.getZjList(); */
		this.getNewsLists();
		// this.getList();
		this.getSwiper();
		this.checkIsAddedToMyMiniProgram();
	},
	onShow() {
		this.keyword = "";
	},
	computed: {
		...mapGetters(["isTips"]),
	},
	methods: {
		checkIsAddedToMyMiniProgram() {
			try {
				wx.checkIsAddedToMyMiniProgram({
					success: (res) => {
						if (res.added) {
							this.$store.commit("SET_TIPS", "no");
						} else if (this.isTips !== "no") {
							this.$store.commit("SET_TIPS", "tips");
						}
					},
					fail: () => {
						this.isTips = true;
					},
				});
			} catch (error) {
				console.log("error: ", error);
			}
		},

		showToast() {
			uni.showToast({
				title: "功能研发中，敬请期待",
				icon: "none",
			});
		},

		getSwiper() {
			swiperList({
				applicationRange: 2,
			}).then((res) => {
				if (res.code == 200) {
					this.swiper = res.data;
				}
			});
		},
		onClick(item) {
			uni.navigateTo({
				url: "/pagesA/index/news/news-detalis?id=" + item.id,
			});
		},
		doSearch() {
			let url = "/pagesA/index/news/news-list?keyWord=" + this.keyword;
			//页面跳转并传递参数
			uni.navigateTo({
				url: url,
			});
		},
		getList() {
			/** 查询医院信息 */
			getList(this.information.pageNum, this.information.pageSize, this.keyword).then((res) => {
				this.listData = res.data;
			});
			getList1(this.information.pageNum, this.information.pageSize, this.keyword).then((res) => {
				this.listData1 = res.data;
			});
		},
		getNewsLists() {
			getNewsList(this.newsParams).then((res) => {
				if (res.code == 200) {
					this.newData = res.data.records;
				}
			});
		},
		swiperJump(index) {
			let id = this.swiper[index].linkUrl;
			if (id && id != "10000") {
				uni.navigateTo({
					url: "/pagesA/index/news/news-detalis?id=" + id,
				});
			}

			if (id == "10000") {
				uni.navigateTo({
					url: "/pagesC/cancer-screening/add-person/add-person",
				});
			}
		},
		jumpMessage() {
			if (!this.$store.getters.userId) {
				uni.showToast({
					title: "亲，请先登录！！",
					icon: "none",
				});
				return;
			}
			uni.navigateTo({
				url: "/pagesA/user/message?type=0",
			});
		},
		onTips() {
			this.$store.commit("SET_TIPS", "no");
		},
		async getZjList() {
			const params = {
				pageNum: 1,
				pageSize: 4,
				recommend: "1",
			};
			const res = await getZjListApi(params);
			if (!res || res.code !== 200) return;
			this.expertList = [...res.data];
		},
		handleScreenClick() {
			getInfoByToken().then((res) => {
				if (res.code == 200) {
					const pushArr = {
						openId: res.user.openId,
						questionId: "1797445758753525762",
					};
					check(pushArr).then((res) => {
						if (res.code == 200) {
							if (res.data) {
								if (res.data.result) {
									uni.setStorageSync("questionState", true);
								} else {
									uni.setStorageSync("questionState", false);
								}
								uni.setStorageSync("userInfo", res.data.id);
								this.$ut.jump("/pagesC/screening/question");
							} else {
								uni.setStorageSync("questionState", false);
								this.$ut.jump("/pagesC/screening/screening");
							}
						}
					});
				}
			});
		},
	},
};
</script>

<style lang="less" scoped>
.vice1 {
	font-size: 24rpx;
	color: #666;
	line-height: 1.8;
}

page {
	// background: linear-gradient(0deg, rgba(115, 192, 255, 0) 0%, #5CB4FC 100%);
	// background:  -webkit-linear-gradient(top, #3c9cff1a,#3c9cff80 ,#5CB4FC);
	/* background: rgba(255, 255, 255, 0.2); */
}

.page {
	width: 100%;
	min-height: 100vh;
	background: linear-gradient(180deg, #c7d9fd 10%, #ffffff 57%);
	border-radius: 0rpx 0rpx 0rpx 0rpx;
	opacity: 1;
	position: relative;
}

.search {
	width: 100%;
	height: 68rpx;
	display: flex;
	align-items: center;
	justify-content: space-between;

	.left {
		width: 85%;
		background: #ffffff;
		border-radius: 10rpx 10rpx 10rpx 10rpx;
		opacity: 1;
		border: 2rpx solid #3b7eff;
	}

	.right {
		width: 10%;
		text-align: center;
		position: relative;

		.icon-box {
			width: 100%;
			display: flex;
			justify-content: center;
		}

		.chat {
			width: 48rpx;
			height: 48rpx;
			margin-top: -10rpx;
		}

		.text {
			white-space: nowrap;
			color: #3b7eff;
			font-size: 24rpx;
		}
	}
}

::v-deep .u-swiper {
	overflow: initial;
}

.indicator {
	display: flex;
	justify-content: center;
	position: absolute;
	bottom: -48rpx;
	left: 50%;
	transform: translateX(-50%);

	&__dot {
		height: 12rpx;
		width: 12rpx;
		border-radius: 50%;
		background-color: #3b7eff33;
		margin: 0 10rpx;
		transition: background-color 0.3s;

		&--active {
			width: 32rpx;
			height: 10rpx;
			background-color: #3b7effff;
			border-radius: 10rpx;
		}
	}
}

.menu-box {
	display: flex;
	align-items: center;
	align-content: space-between;
	justify-content: space-between;

	.menu-a {
		width: 100%;
		height: 180rpx;
		border-radius: 20rpx;
		box-shadow: 0rpx 8rpx 20rpx 0rpx rgba(153, 153, 153, 0.1);
		background: linear-gradient(180deg, #e9f1ff 0%, #ffffff 100%);
		padding: 20rpx 25rpx;
		box-sizing: border-box;
		position: relative;

		.title {
			font-size: 34rpx;
			font-weight: 500;
			line-height: 40rpx;
		}

		.vice {
			color: #666666ff;
			font-size: 24rpx;
			line-height: 40rpx;
		}

		.look {
			margin-top: 10rpx;
			padding: 5rpx 20rpx;
			border-radius: 60rpx;
			border: 2rpx solid #3b7effff;
			font-size: 28rpx;
			color: #3b7eff;
			display: inline-block;
		}

		.look1 {
			margin-top: 10rpx;
			padding: 5rpx 20rpx;
			border-radius: 60rpx;
			background: linear-gradient(90deg, #a49ffd60 0%, rgba(164, 159, 253, 0) 100%);
			font-size: 28rpx;
			color: #7972ff;
			display: inline-block;
		}

		.img {
			position: absolute;
			bottom: 0rpx;
			right: 50rpx;
			width: 110rpx;
			height: 140rpx;
		}
	}
}

.menu-box1 {
	display: flex;
	align-items: space-around;
	justify-content: space-around;

	.menu-item {
		flex: 1;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		min-height: 96rpx;
		text-align: center;

		.img {
			width: 96rpx;
			height: 96rpx;
		}

		.name {
			padding-top: 8rpx;
			font-size: 24rpx;
			color: #444;
			white-space: nowrap;
		}
	}
}

.regist {
	background: linear-gradient(136deg, #ecfff3 0%, #ffffff 100%);
	box-shadow: 0rpx 8rpx 20rpx 0rpx rgba(153, 153, 153, 0.1);
	border-radius: 20rpx 20rpx 20rpx 20rpx;
	opacity: 1;
}

.reservation {
	background: linear-gradient(136deg, #d0e3ff 0%, #ffffff 100%);
	box-shadow: 0rpx 8rpx 20rpx 0rpx rgba(153, 153, 153, 0.1);
	border-radius: 20rpx 20rpx 20rpx 20rpx;
	opacity: 1;
}

.wechat {
	background: linear-gradient(136deg, #fff8e9 0%, #ffffff 100%);
	box-shadow: 0rpx 8rpx 20rpx 0rpx rgba(153, 153, 153, 0.1);
	border-radius: 20rpx 20rpx 20rpx 20rpx;
	opacity: 1;
}

.card {
	display: flex;
	align-items: center;
	justify-content: space-around;

	&-item {
		width: 216rpx;
		height: 160rpx;
		border-radius: 20rpx;
		position: relative;
		overflow: hidden;
		box-sizing: border-box;
		text-align: center;

		.bg-img {
			position: absolute;
			left: 0;
			top: 0;
			width: 100%;
			height: 100%;
			z-index: 0;
		}

		.icon-img {
			width: 70rpx;
			height: 70rpx;
			position: absolute;
			top: 25%;
			right: 35%;
			transform: translateY(-50%);
			z-index: 1;
		}

		.title {
			position: relative;
			z-index: 1;
			top: 50%;
			font-size: 25rpx;
			font-weight: 500;
			-webkit-background-clip: text;
		}

		.mas {
			position: relative;
			z-index: 1;
			top: 52%;
			font-size: 20rpx;
			line-height: 1.5;
			transform-origin: left;
			font-family: Source Han Sans CN-Normal, Source Han Sans CN;
			font-weight: 400;
			-webkit-background-clip: text;
		}
	}
}

.notification {
	width: 100%;
	height: 100rpx;
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 0 30rpx;
	box-sizing: border-box;
	font-size: 28rpx;
	color: #ff9900ff;
	background: #fff8edff;
	border-radius: 25rpx;

	.btn {
		display: flex;
		align-items: center;
		padding: 7rpx 20rpx;
		border-radius: 12rpx;
		background: #ff9900ff;
		color: #fff;
		font-size: 24rpx;
	}
}

.top-tips {
	height: 85rpx;
	background: rgba(0, 0, 0, 0.8);
	border-radius: 6rpx;
	position: fixed;
	top: 140rpx;
	left: 30rpx;
	right: 30rpx;
	z-index: 100;
	padding: 20rpx;
	box-sizing: border-box;
	display: flex;
	align-items: center;
	justify-content: space-between;
	font-size: 24rpx;
	color: #fff;

	.dian {
		width: 40rpx;
		height: 15rpx;
		margin: 0 10rpx;
	}

	.icon-img {
		width: 40rpx;
		height: 40rpx;
		margin: 0 10rpx;
	}

	&::after {
		content: "";
		width: 0;
		height: 0;
		border-top: 20rpx solid transparent;
		border-right: 20rpx solid transparent;
		border-bottom: 20rpx solid rgba(0, 0, 0, 0.8);
		border-left: 20rpx solid transparent;
		position: absolute;
		top: -38rpx;
		right: 90rpx;
	}
}

.tips-box {
	width: 100%;
	height: 60vh;
	padding: 30rpx;
	box-sizing: border-box;

	.h1 {
		text-align: center;
	}

	.overflow {
		height: calc(100% - 60rpx);
		overflow-y: scroll;

		.item {
			font-size: 28rpx;
			color: #000;
			display: flex;
		}

		.item-img {
			width: 100%;
			height: 360rpx;
			display: flex;
			align-items: center;
			justify-content: center;

			.img {
				width: 400rpx;
				height: 320rpx;
			}
		}
	}
}
</style>

