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
						<view class="text">欢迎使用</view>
					</view>
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

				<u-cell icon="setting-fill" title="系统版本" @click="$ut.showText()">
					<image slot="icon" class="icon-img" src="@/static/user/icon5.png" mode=""></image>
					<u-icon slot="right-icon" size="30rpx" name="arrow-right"></u-icon>
				</u-cell>

			</u-cell-group>
		</view>

		<view class="bottom m-t4" @click="logout">退出登录</view>

		<ut-bottomNav :value="1"></ut-bottomNav>
	</view>
</template>

<script>
import { envWx } from "@/config";
import { mapGetters } from 'vuex'
import store from "@/store";
import { getExpert } from "@/api/system/user.js";
import { authWebLoginApi } from "@/api/login.js";

export default {
	data() {
		return {
			envWx: 'release',
			user: {
				nickName: "",
			},
			userType: "",
			noavater: 'https://genepiapi.ypzlfx.com/file/genepi/2023/07/20/OxbWNs6SoNLF1129151bdb41b25719e93409dc3a1f5b_20230720170831A016.jpg'
		};
	},
	computed: {
		...mapGetters(['avatar', 'userId'])
	},
	onLoad() {
		if (this.userId) {

		}
	},
	methods: {
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


		jump(url) {
			uni.navigateTo({
				url: url,
			});
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