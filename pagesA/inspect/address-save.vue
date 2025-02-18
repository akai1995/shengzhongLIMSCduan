<template>
	<view>
		<ut-nav :title="type==1?'修改地址':'新增地址'" border></ut-nav>

		<view class="content">
			<view class="toContent" v-if="type==0">
				<view class="blueTitle">示例: 基因派，136xxxx0000，云南省昆明市官渡区某小区</view>
				<view class="ut-view">
					<u--textarea v-model="copy" border="none" placeholder="请粘贴或输入文本，点击“识别”自动识别姓名、电话和地址"></u--textarea>
					<view class="tag" :class="copy.length > 0 ? 'back1' : 'back2'" @click="pasteContent()">识别</view>
				</view>
			</view>

			<view class="from m-t2">
				<u--form :model="form" labelWidth="150rpx" ref="uForm">
					<u-form-item label="姓名" prop="name">
						<u--input v-model="form.name" border="none" placeholder="请输入"></u--input>
					</u-form-item>
					<u-form-item label="手机号" prop="phoneNumber">
						<u--input v-model="form.phoneNumber" border="none" placeholder="请输入"></u--input>
					</u-form-item>
					<u-form-item label="省市区" prop="city" @click="showNativeSelect = true">
						<u--input v-model="form.city" border="none" placeholder="请选择" readonly></u--input>
						<u-icon slot="right" name="arrow-down"></u-icon>
						<address-picker :show="showNativeSelect" @confirm="confirmAddress"
							@cancel="showNativeSelect = false" :addressData="defaultNative" :closeOnClickOverlay="true"
							@close="showNativeSelect = false"></address-picker>
					</u-form-item>
					<u-form-item label="详细地址" prop="address">
						<u--input v-model="form.address" border="none" placeholder="请输入"></u--input>
					</u-form-item>
					<u-form-item>
						<u-checkbox-group>
							<u-checkbox :value="value" shape="circle" :checked="isAllChecked" @change="allChoose"
								class="allCheck" /><text>设为默认地址</text>
						</u-checkbox-group>
					</u-form-item>
				</u--form>
			</view>
		</view>

		<view class="bottom-box">
			<view class="btn2" @click="submit">保存</view>
		</view>
	</view>
</template>

<script>
	import nationData from "@/pagesA/component/nation.json";
	import {
		addAddress,
		getAddres,
		updateInspectionAddress,
		deleteInspectionAddress,
		selectOne,
		selectDefaultAddress,
	} from "@/api/hospitalrelated/hospitalrelated";
	import addressPicker from "../component/address-picker/address-picker.vue"
	export default {
		components: {
			addressPicker
		},
		data() {
			return {
				isAllChecked: false, //默认地址
				copy: "",
				id: "",
				userId: this.$store.getters.userId,
				type: "",
				checked: false,
				form: {
					name: "",
					phoneNumber: "",
					city: "",
					address: "",
					defaultAddress: "",
					defaultSendAddress: "",
					userId: this.$store.getters.userId,
					adcdCode: ''
				},
				defalutAddrsType: "",
				checkbox: "",
				checkboxList1: [{
						name: "收件地址",
						disabled: false,
					},
					{
						name: "寄件地址",
						disabled: false,
					},
				],
				defaultNative: [],
				showNativeSelect: false,
				rules: {
					name: [{
						required: true,
						message: "请输入姓名",
						trigger: ["change", "blur"],
					}, ],
					phoneNumber: [{
							required: true,
							message: "请输入手机号",
							trigger: ["change", "blur"],
						},
						{
							// 自定义验证函数，见上说明
							validator: (rule, value, callback) => {
								// 上面有说，返回true表示校验通过，返回false表示不通过
								// uni.$u.test.mobile()就是返回true或者false的
								return uni.$u.test.mobile(value);
							},
							message: "手机号码不正确",
							// 触发器可以同时用blur和change
							trigger: ["change", "blur"],
						},
					],
					city: [{
						required: true,
						message: "请选择城市",
						trigger: ["change", "blur"],
					}, ],
					address: [{
						required: true,
						message: "请输入详细地址",
						trigger: ["change", "blur"],
					}, ],
				},
			};
		},
		onReady() {
			//onReady 为uni-app支持的生命周期之一
			this.$refs.uForm.setRules(this.rules);
		},
		onLoad(optins) {
			this.id = optins.id;
			this.type = optins.type;
			this.initNationList();
			if (this.type == 1) {
				this.getData();
			}
		},
		methods: {
			//获取到剪切板的内容，快速识别收货地址
			pasteContent() {
				var that = this;
				if (this.copy.length == 0) {
					return;
				}
				// 获取系统剪贴板内容
				uni.getClipboardData({
					success: (res) => {
						console.log("res", res);
						const text = res.data;
						const phoneNumber = this.extractPhoneNumber(text);
						const name = this.extractName(text, phoneNumber);
						const address = this.extractAddress(text, phoneNumber);

						// 去除特殊字符和前缀标识
						const cleanedName = this.cleanText(name);
						const cleanedPhoneNumber = this.cleanText(phoneNumber);
						const cleanedAddress = this.cleanText(address);

						// 在这里可以对姓名、手机号和收货地址进行处理
						// 例如，将提取到的信息填充到表单中

						console.log("姓名:", cleanedName);
						console.log("手机号:", cleanedPhoneNumber);
						console.log("收货地址:", cleanedAddress);
						if (cleanedName != "") {
							that.form.name = cleanedName;
						}
						if (cleanedPhoneNumber != "") {
							that.form.phoneNumber = cleanedPhoneNumber;
						}
						if (cleanedAddress != "") {
							that.form.address = cleanedAddress;
						}
					},
					fail: (e) => {
						console.log(e);
						uni.showToast({
							title: "获取剪贴板内容失败",
							icon: "none",
						});
					},
				});
			},
			//1姓名 通过正则找到电话
			extractPhoneNumber(text) {
				const reg = /\d{11}/;
				const match = text.match(reg);
				const phoneNumber = match ? match[0] : "";
				return phoneNumber;
			},
			//2手机号 截取0到电话第一次出现的位置
			extractName(text, phoneNumber) {
				const index = text.indexOf(phoneNumber);
				const name = index > 0 ? text.substring(0, index).trim() : "";
				return name;
			},
			//3地址 从电话第一次出现的位置+电话长度开始截取
			extractAddress(text, phoneNumber) {
				const index = text.indexOf(phoneNumber);
				const address =
					index > 0 ? text.substring(index + phoneNumber.length + 1).trim() : "";
				return address;
			},
			// 4去除特殊字符和前缀标识
			cleanText(text) {
				const cleanedText = text.replace(/\/|姓名：|手机号：|收货地址：|详细地址：/g, "");
				return cleanedText;
			},

			confirmAddress(e) {
				(this.form.city = e.value[0] + "-" + e.value[1] + "-" + e.value[2]),
				(this.showNativeSelect = false);
				console.log(e, 444)
				this.form.adcdCode = e.areaId[2]
			},
			initNationList() {
				let result = nationData.map((t) => {
					return t.name;
				});
				this.nationList = [result];
			},
			//默认地址
			allChoose() {
				this.isAllChecked = !this.isAllChecked;
			},
			submit() {
				this.$refs.uForm.validate().then(async (res) => {
					this.isAllChecked == true ? this.form.defaultAddress = 1 : this.form.defaultAddress = 0
					uni.showLoading();

					if (this.type == 1) {
						await updateInspectionAddress({
							...this.form,
							address: this.form.city + "-" + this.form.address,
							id: this.id
						}).then((res) => {
							if ((res.code = 200)) {
								uni.$u.toast("修改成功");
								uni.navigateBack();
							} else {
								uni.$u.toast("修改失败");
							}
						});
					} else {
						await addAddress({
							...this.form,
							address: this.form.city + "-" + this.form.address
						}).then((res) => {
							if ((res.code = 200)) {
								uni.$u.toast("添加成功");
								uni.navigateBack();
							} else {
								uni.$u.toast("添加失败");
							}
						});
					}
					// const temp = this.form.address
					// this.form.address = this.form.city + "-" + this.form.address;
					uni.hideLoading();
				});
			},
			check(e) {
				this.defalutAddrsType = e;
				if (e == "收件地址") {
					this.form.defaultAddress = 0;
					this.form.defaultSendAddress = 1;
				} else {
					this.form.defaultAddress = 1;
					this.form.defaultSendAddress = 0;
				}
			},
			getData() {
				if (this.id != "") {
					selectOne(this.id).then((res) => {
						this.form.name = res.data.name;
						this.form.phoneNumber = res.data.phoneNumber;
						let index = res.data.address.lastIndexOf("-");
						this.form.address = res.data.address.slice(index + 1, res.data.address.length);
						this.form.city = res.data.address.slice(0, index);
						this.form.adcdCode = res.data.adcdCode
						res.data.defaultAddress == 1 ? this.isAllChecked = true : this.isAllChecked = false;
						// if (res.data.defaultAddress == 0) {
						//   this.checkbox = "收件地址";
						// } else if (res.data.defaultSendAddress == 0) {
						//   this.checkbox = "寄件地址";
						// }
					});
				}
			},
		},
	};
</script>

<style lang="less">
	.blueTitle {
		//   width: 686rpx;
		height: 100rpx;
		background: #3b7eff;
		border-radius: 20rpx 20rpx 0px 0px;
		font-size: 24rpx;
		display: flex;
		align-items: center;
		color: #fff;
		padding-left: 20rpx;
	}

	.toContent {
		position: relative;
		height: 260rpx;
	}

	.ut-view {
		position: absolute;
		bottom: -18rpx;
		left: 0;
		padding: 0;

		/deep/.u-textarea {
			border-radius: 20rpx !important;
		}

		.tag {
			position: absolute;
			bottom: 30rpx;
			right: 30rpx;
			padding: 10rpx 20rpx;
			font-size: 24rpx;
			color: #fff;
			border-radius: 80rpx;
			z-index: 9;
		}
	}

	.from {
		background: #fff;
		padding: 0 30rpx 30rpx 30rpx;
		box-sizing: border-box;
		border-radius: 20rpx;
	}

	.bottom-box {
		width: 100%;
		height: 120rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		box-shadow: 0rpx -8rpx 20rpx 0rpx rgba(6, 63, 150, 0.1);
		position: fixed;
		left: 0;
		bottom: 0;
		z-index: 10;

		.btn2 {
			width: 686rpx;
			height: 80rpx;
			border-radius: 80rpx;
			background: linear-gradient(135deg, #00deff 0%, #0c5fff 100%);
			font-size: 36rpx;
			color: #fff;
			display: flex;
			align-items: center;
			justify-content: center;
			letter-spacing: 2rpx;
		}
	}

	.back1 {
		background: #0c5fff;
	}

	.back2 {
		background: #3b7eff4d;
	}
</style>