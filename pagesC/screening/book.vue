<template>
	<view>
		<ut-nav title="知情同意书" border></ut-nav>
		<view class="content" style="overflow: auto; height: 88vh">
			<view v-html="resData && resData.informedConsentForm"></view>

			<view class="qm flex j-c m-t6">
				<view class="label flex">姓名： <signInput ref="sign" @signToUrl="signToUrl"></signInput> </view>
				<view class="time">时间: {{ time }}</view>
			</view>
			<!-- <view class="btn m-t6" @click="submit" v-if="params.port">查询</view> -->
			<view class="btn m-t6" @click="submitPic">确认</view>
		</view>
	</view>
</template>

<script>
import { getReportInfo, authReportInfo } from "@/api/report.js";
import signInput from "@/pagesC/components/am-sign-input/am-sign-input.vue";
import { getInfo } from "@/api/book.js";
import { getInfoByToken } from "@/api/personalCenter/personalCenter";
export default {
	components: {
		signInput,
	},
	data() {
		return {
			params: {},
			authFile: "",
			reportId: "",
			time: "",
			openId: null,
			resData: null,
		};
	},
	onLoad(options) {
		// console.log('options',options)
		// if('params' in options){
		// 	this.params =JSON.parse(decodeURIComponent(options.params))
		// }
		if (options.id) {
			this.reportId = options.id;
		}
		console.log("a", this.reportId);
		var today = new Date();
		var year = today.getFullYear();
		var month = today.getMonth() + 1;
		var day = today.getDate();
		this.time = year + "年" + month + "月" + day + "日";

		this.getData();
	},
	methods: {
		getData() {
			getInfoByToken().then((res) => {
				this.openId = res.user.openId;
				if (res.code == 200) {
					getInfo().then((res) => {
						this.resData = res.data;
					});
				}
			});
		},
		signToUrl(e) {
			console.log("e", e);
			this.authFile = e;
			if (e.error_code && e.error_code === "201") {
				uni.showToast({
					title: e.msg,
					icon: "none",
				});
				return;
			}
		},
		submit() {
			var params = {
				applyCode: this.params.fdApplyCode,
				authFile: this.authFile,
				idCard: this.params.fdIdcard,
				name: this.params.fdName,
				tel: this.params.tel,
			};
			// this.params.authFile = this.authFile
			// console.log('params+++',params)
			uni.showLoading();
			getReportInfo(params).then((res) => {
				uni.hideLoading();
				if (res.code == 200) {
					// uni.navigateTo({
					// 	url:'/pagesB/report/details-pdf?url='+res.data.reportUrl
					// })
					uni.downloadFile({
						url: res.data.reportUrl,
						success: function (res_) {
							var filePath = res_.tempFilePath;
							uni.openDocument({
								filePath: filePath,
								showMenu: true,
								success: function () {
									console.log("成功");
								},
							});
						},
					});
				}
			});
		},

		submitPic() {
			uni.setStorageSync("signPic", this.authFile);
			uni.navigateBack({
				delta: 1,
			});
		},
	},
};
</script>

<style lang="less">
page {
	background: #fff !important;
}

.content {
	.title {
		color: #222;
		font-weight: 600;
		font-size: 32rpx;
		letter-spacing: 2rpx;
	}
	.text {
		color: #222;
		font-size: 24rpx;
		line-height: 1.8;
		font-weight: 400;
	}
	.qm {
		color: #999;
		font-size: 28rpx;
		font-weight: 400;
	}
}
.flex {
	display: flex;
	align-items: flex-start;
}
.btn {
	width: 100%;
	height: 80rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	border-radius: 80rpx;
	background: linear-gradient(135deg, #00deff 0%, #0c5fff 100%);
	color: #fff;
	font-size: 36rpx;
	font-weight: 600;
	letter-spacing: 5rpx;
}
</style>
