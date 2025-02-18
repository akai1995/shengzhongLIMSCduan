<template>
	<view>
		<u-navbar title="我的" :placeholder="true" leftIcon=" " bgColor="#e6f8ff"></u-navbar>
		<view class="head">
			<view class="flex j-c">
				<view class="user">
					<image class="headImg" :src="avatar || noavater" mode=""></image>
					<view class="info">
						<view class="name" v-if="user.nickName">{{ user.nickName }}</view>
						<view class="name" v-if="!user.nickName" @click="$ut.jump('/pages/login/login')">登录/注册</view>
						<view class="text" @click="jump('/pagesA/user/editMyInformation')">编辑个人资料></view>
					</view>
				</view>
				<view class="tag" @click="onCut()">
					<image class="img" src="@/static/public/user.png" mode=""></image> 我是医生
				</view>
			</view>
		</view>
		<view class="menu-box">
			<view class="menu-item" @click="jump('/pagesA/user/message?type=0')">
				<view class="badge">
					<u-badge max="99" :value="myMessageCount"></u-badge>
				</view>
				<image class="img" src="@/static/user/menu4.png"></image>
				<text class="name">我的消息</text>
			</view>
			<!-- <view class="menu-item" @click="$ut.jump('/pages/community/community-my')"> -->
			<view class="menu-item" @click="$ut.showText()" v-if="false">
				<image class="img" src="@/static/user/menu1.png"></image>
				<text class="name">我的社区</text>
			</view>
			<view class="menu-item" @click="$ut.jump('/pagesA/user/myFollow')">
				<image class="img" src="@/static/user/menu2.png"></image>
				<text class="name">我的关注</text>
			</view>
			<view class="menu-item" @click="$ut.jump('/pagesA/user/myCollect')">
				<image class="img" src="@/static/user/menu3.png"></image>
				<text class="name">我的收藏</text>
			</view>
		</view>

		<view class="view m-t3">
			<view class="title">健康档案</view>
			<view class="box m-t2">
				<view class="item" @click="$ut.jump('/pagesA/user/family')">
					<view class="label">家庭成员</view>
					<view class="num"><text>{{ relationshipNum }}</text>人</view>
				</view>
				<u-line direction="col" length="50%"></u-line>
				<view class="item" @click="$ut.jump('/pages/report/read')">
					<view class="label">报告解读</view>
					<view class="num"><text>{{ reportExplain }}</text>份</view>
				</view>
				<u-line direction="col" length="50%"></u-line>
				<view class="item" @click="$ut.jump('/pages/report/report')">
					<view class="label">检测记录</view>
					<view class="num"><text>{{ testRecord }}</text>次</view>
				</view>
			</view>
		</view>
		<view class="view" v-if="envWx !== 'release'">
			<u-cell-group>
				<u-cell icon="setting-fill" title="我的咨询" @click="$ut.jump('/pagesC/consult/consult')">
					<image slot="icon" class="icon-img" src="@/static/user/icon13.png" mode=""></image>
					<u-icon slot="right-icon" size="30rpx" name="arrow-right"></u-icon>
				</u-cell>
				<u-cell icon="setting-fill" title="我的医生" @click="$ut.jump('/pagesC/medic/medic')">
					<image slot="icon" class="icon-img" src="@/static/user/icon14.png" mode=""></image>
					<u-icon slot="right-icon" size="30rpx" name="arrow-right"></u-icon>
				</u-cell>
			</u-cell-group>
		</view>
		<view class="view">
			<view class="title">其他</view>
			<u-cell-group class="m-t2">
				<!-- <u-cell title="操作手册" @click="$ut.jump('/pagesA/user/operationManual')" name="@/static/user/icon1.png">
					<image slot="icon" class="icon-img" src="@/static/user/icon1.png" mode=""></image>
					<u-icon slot="right-icon" size="30rpx" name="arrow-right"></u-icon>
				</u-cell> -->
				<u-cell icon="setting-fill" title="反馈中心" @click="$ut.jump('/pagesA/user/myFeedback')">
					<image slot="icon" class="icon-img" src="@/static/user/icon2.png" mode=""></image>
					<u-icon slot="right-icon" size="30rpx" name="arrow-right"></u-icon>
				</u-cell>
				<!-- <u-cell icon="setting-fill" title="技术服务电话" @click="$ut.showText()">
					<image slot="icon" class="icon-img" src="@/static/user/icon3.png" mode=""></image>
					<u-icon slot="right-icon" size="30rpx" name="arrow-right"></u-icon>
				</u-cell> -->
				<u-cell icon="setting-fill" title="修改密码" @click="editPass()">
					<image slot="icon" class="icon-img" src="@/static/user/icon4.png" mode=""></image>
					<u-icon slot="right-icon" size="30rpx" name="arrow-right"></u-icon>
				</u-cell>
				<u-cell icon="setting-fill" title="系统版本" @click="$ut.showText()">
					<image slot="icon" class="icon-img" src="@/static/user/icon5.png" mode=""></image>
					<u-icon slot="right-icon" size="30rpx" name="arrow-right"></u-icon>
				</u-cell>
				<!-- v-if="userType==2" -->
				<u-cell icon="setting-fill" title="样本物流" @click="$ut.jump('/pagesB/driver/list')" v-if="driver">
					<image slot="icon" class="icon-img" src="@/static/user/icon11.png" mode=""></image>
					<u-icon slot="right-icon" size="30rpx" name="arrow-right"></u-icon>
				</u-cell>
				<u-cell icon="setting-fill" title="打印机设备" @click="$ut.jump('/pagesB/equipment/link')" v-if="false">
					<image slot="icon" class="icon-img" src="@/static/user/icon10.png" mode=""></image>
					<u-icon slot="right-icon" size="30rpx" name="arrow-right"></u-icon>
				</u-cell>
				<!-- <u-cell title="结直肠癌早筛" @click="routeDcb">
					<image slot="icon" class="icon-img"
						src="https://genepiapi.ypzlfx.com/file/genepi/2023/12/11/r7xylbwZWMog07b4f653334f42749d0326950fd3a522_20231211091942A835.png"
						mode=""></image>
				</u-cell>
				<u-cell title="癌症核心知识知晓率调查表" @click="routePush({ url: '/pagesB/survey-form/survey-form' })">
					<image slot="icon" class="icon-img"
						src="https://genepiapi.ypzlfx.com/file/genepi/2023/12/11/r7xylbwZWMog07b4f653334f42749d0326950fd3a522_20231211091942A835.png"
						mode=""></image>
				</u-cell> -->
			</u-cell-group>
		</view>

		<view class="bottom m-t4" @click="logout">退出登录</view>

		<ut-bottomNav :value="2"></ut-bottomNav>
	</view>
</template>

<script>
import { envWx } from "@/config";
import { mapGetters, mapMutations } from 'vuex'
import store from "@/store";
import {
	getRelationCount, getDetectionNum, getAnalysisCount
} from "@/api/personalCenter/personalCenter.js";
import {
	getExpert
} from "@/api/system/user.js";
import {
	authWebLoginApi,
	getWxInfo
} from "@/api/login.js";

export default {
	data() {
		return {
			envWx: 'release',
			driver: '', //司机权限
			menuList: [{
				img: "@/static/user/icon1.png",
				title: "操作手册",
			},
			{
				img: "@/static/user/icon2.png",
				title: "反馈中心",
			},
			],
			user: {
				nickName: "",
			},
			relationshipNum: 0,
			reportExplain: 0,
			testRecord: 0,
			myMessageCount: 0,
			userType: "",
			noavater: 'https://genepiapi.ypzlfx.com/file/genepi/2023/07/20/OxbWNs6SoNLF1129151bdb41b25719e93409dc3a1f5b_20230720170831A016.jpg'
		};
	},
	computed: {
		...mapGetters(['avatar', 'userId'])
	},
	onLoad() {
		if (this.userId) {
			Promise.all([this.getPersonalInfo(), this.getRelationCount()]);
		}
		// getExpert(this.$store.getters.userId).then(res => {

		// })
		uni.$once("refresh", () => {
			this.getPersonalInfo()
			this.getRelationCount()
		})
	},
	methods: {
		...mapMutations(['SET_DOCTOR_INFO']),
		routeDcb() {
			// const curTime = new Date().getTime()
			// const newRime = new Date(2024, 1, 1, 0,0,0).getTime()
			// console.log(curTime, newRime);
			// if (curTime < newRime) {
			// uni.showModal({
			// 	title: '提示',
			// 	content: '尊敬的用户，红河州结直肠癌早筛功能为2024年1月1日开放。',
			// 	showCancel: false
			// })
			// return
			// }
			uni.navigateTo({
				url: '/pagesC/cancer-screening/add-person/add-person'
			})
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
						success: function (res) {
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
		getPersonalInfo() {
			let id = this.userId;
			getWxInfo(id).then((res) => {
				this.user = res.user;
				this.$store.commit('SET_ORG_ID', res.user.orgId)
				//司机
				this.userType = res.user.role;
				if (res.roles?.includes('driver')) {
					this.driver = 'driver';
				}
				// console.log("user", res.user.role);
			});
		},
		getRelationCount() {
			//家庭成员数量
			getRelationCount().then((res) => {
				this.relationshipNum = res.data;
			});
			//检测记录数量
			getDetectionNum().then(res => {
				this.testRecord = res.data
			})
			//检测记录
			getAnalysisCount().then(res => {
				this.reportExplain = res.data
			})
		},

		jump(url) {
			// console.log('url',url)
			uni.navigateTo({
				url: url,
			});
		},

		editPass() {
			if (this.user.telephone.length > 0) {
				this.$ut.jump("/pagesC/password/password");
			} else {
				this.$ut.showText("请完善个人信息");
			}
		},

		logout() {
			uni.showModal({
				title: "退出登录",
				content: "您正在进行退出操作，是否继续？",
				cancelText: "不退出",
				confirmText: "继续退出",
				confirmColor: "#3B7EFFFF",
				success: function (res) {
					if (res.confirm) {
						store.dispatch("WxLogOut").then((res) => {
							uni.reLaunch({
								url: "/pages/index/index",
							});
						});
					} else if (res.cancel) {
						console.log("用户点击取消");
					}
				},
			});
		},

		//切换身份
		onCut() {
			var type = null;
			var form = {};
			getExpert(this.userId).then((res) => {
				if (!res.data && this.userId) {
					uni.showModal({
						title: "您暂未开通医生权限",
						confirmText: "立即申请",
						success(res) {
							if (res.confirm) {
								uni.navigateTo({
									url: "/pagesA/user/medic",
								});
							} else if (res.cancel) {
								// uni.reLaunch({
								// 	url: '/pages/index/index'
								// })
							}
						},
					});
					return
				}
				if (res.data) {
					type = res.data.expertState;
					if (res.data) {
						form = encodeURIComponent(JSON.stringify(res.data));
					}
				}
				//医生
				if (type == 1) {
					this.SET_DOCTOR_INFO(res.data)
					uni.navigateTo({
						url: "/pagesC/doctor-index/doctor-index",
					});
				} else if (type == 0) {
					//审核中
					this.$ut.jump("/pagesA/user/success");

					// this.$ut.showText("正在审核中");
				} else {
					uni.navigateTo({
						url: "/pagesA/user/medic",
					});
				}
			});
		},
	},
};
</script>

<style lang="less">
page {
	background: #fff;
}

.head {
	width: 100%;
	height: 280rpx;
	background: linear-gradient(135deg, #00deff 0%, #0c5fff 100%);
	padding: 30rpx;
	box-sizing: border-box;

	.user {
		display: flex;

		.headImg {
			width: 100rpx;
			height: 100rpx;
			border-radius: 50%;
			flex-shrink: 0;
		}

		.info {
			padding: 10rpx 0;
			margin-left: 20rpx;

			.name {
				color: #fff;
				font-size: 28rpx;
				font-weight: 500;
				line-height: 1.2;
			}

			.text {
				margin-top: 10rpx;
				color: #ffffff99;
				font-size: 24rpx;
			}
		}
	}

	.tag {
		width: 165rpx;
		height: 60rpx;
		display: flex;
		align-items: center;
		border-radius: 10rpx;
		background: rgba(255, 255, 255, 0.1);
		font-size: 24rpx;
		color: #fff;
		padding: 10rpx;
		box-sizing: border-box;

		.img {
			width: 40rpx;
			height: 40rpx;
		}
	}
}

.menu-box {
	width: 90%;
	height: 210rpx;
	margin: auto;
	margin-top: -110rpx;
	position: relative;
	z-index: 1;
	background: #fff;
	border-radius: 20rpx;
	padding: 30rpx;
	box-sizing: border-box;
	display: flex;
	align-items: center;
	justify-content: space-between;
	box-shadow: 0rpx 8rpx 20rpx 0rpx rgba(17, 93, 167, 0.2);

	.menu-item {
		width: 100rpx;
		min-height: 100rpx;
		text-align: center;
		position: relative;

		.badge {
			position: absolute;
			top: 0;
			right: 0;
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

.view {
	padding: 30rpx;
	box-sizing: border-box;

	.title {
		font-size: 32rpx;
		color: #000;
		font-weight: 600;
		line-height: 2;
	}

	.box {
		width: 100%;
		height: 120rpx;
		background: #e8f1f8ff;
		border-radius: 20rpx;
		padding: 15rpx 60rpx;
		box-sizing: border-box;
		display: flex;
		align-items: center;
		justify-content: space-between;

		.item {
			.label {
				color: #222;
				font-size: 28rpx;
			}

			.num {
				color: #222;
				font-size: 24rpx;
				display: flex;
				align-items: baseline;
				justify-content: center;

				text {
					font-size: 40rpx;
					color: #0c5fff;
					font-weight: 600;
					margin: 0 5rpx;
				}
			}
		}
	}
}

.icon-img {
	width: 48rpx;
	height: 48rpx;
}

/deep/ .u-cell-group .u-line:first-child {
	display: none;
}

.bottom {
	width: 600rpx;
	height: 80rpx;
	border-radius: 80rpx;
	margin: auto;
	margin-bottom: 20rpx;
	background: #dadada;
	display: flex;
	align-items: center;
	justify-content: center;
	color: #fff;
	font-size: 36rpx;
	font-weight: 600;
	letter-spacing: 2rpx;
}
</style>