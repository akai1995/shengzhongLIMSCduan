<template>
	<view>
		<z-paging ref="paging">
			<template #top>
				<ut-nav title="基因派" iconName="home" back @onBack="onBack" border></ut-nav>
			</template>
			<view class="relative">
				<image
					class="banner"
					src="https://genepiapi.ypzlfx.com/file/genepi/2023/12/05/gWkWfwnPbMuia420246743916c7bd98cc2922970ddf0_20231205164541A951.png"
					mode="aspectFill"
				></image>
				<view class="banner-box">
					<view class="bnr-font">结直肠肿瘤风险评估</view>
					<view class="bnr-mfont">完善个人信息</view>
				</view>
				<view class="form-block">
					<u--form labelPosition="left" :model="model" ref="uForm" labelWidth="70" :labelStyle="{ lineHeight: 2 }">
						<u-form-item label="姓名" prop="name" borderBottom>
							<u--input v-model="model.name" placeholder="请填写姓名" maxlength="10" border="none"></u--input>
						</u-form-item>
						<u-form-item label="性别" prop="gender" borderBottom>
							<u-radio-group
								class="radio-block"
								v-model="model.gender"
								activeColor="#3B7EFF"
								labelSize="28rpx"
								labelColor="#333"
								placement="row"
							>
								<template v-for="(item, index) in dict.type.sys_gender">
									<u-radio
										shape="circle"
										:customStyle="{ marginRight: '30rpx' }"
										:key="index"
										:label="item.label"
										:name="item.value"
									></u-radio>
								</template>
							</u-radio-group>
						</u-form-item>
						<u-form-item label="身份证号" prop="idcard" borderBottom>
							<u--input v-model="model.idcard" maxlength="18" placeholder="请填写身份证号" type="idcard" border="none"></u--input>
						</u-form-item>
<!-- 						<u-form-item label="手机号" prop="phone" borderBottom>
							<u--input v-model="model.phone" maxlength="11" type="number" placeholder="请输入手机号" border="none"></u--input>
						</u-form-item> -->
						<u-form-item
							label="所在单位"
							prop="cpy"
							borderBottom
							@click="
								showDepartment = true;
								handleDepartmentTitleClick();
								hideKeyboard();
							"
						>
							<u--textarea v-model="model.cpy" disabled placeholder="请选择所在单位" autoHeight border="none"></u--textarea>
							<u-icon slot="right" name="arrow-right"></u-icon>
						</u-form-item>
						<u-form-item label="所在科室" prop="office" borderBottom>
							<u--input v-model="model.office" placeholder="请输入所在科室" border="none"></u--input>
						</u-form-item>
						<u-form-item
							label="所在区域"
							prop="adcdCode"
							@click="
								showPicker = true;
								hideKeyboard();
							"
						>
							<u--textarea v-model="model.adcdName" disabled placeholder="请选择所在区域" autoHeight border="none"></u--textarea>
							<u-icon slot="right" name="arrow-right"></u-icon>
						</u-form-item>
					</u--form>
				</view>
			</view>
			<template v-if="!msg" #bottom>
				<view style="padding: 60rpx 32rpx">
					<view class="flex" style="padding: 10rpx">
						<u-checkbox-group>
							<u-checkbox :checked="model.tys" @change="changeCk" shape="circle"></u-checkbox>
						</u-checkbox-group>
						<view @click="setTys" style="font-size: 24rpx; color: #999; line-height: 2"
							>已仔细阅读并同意
							<text class="click-color" @click="routePush({ url: '/pagesC/letter/letter' })">《知情同意书》</text></view
						>
					</view>
					<view class="btn-bim" @click="submitForm">下一步</view>
				</view>
			</template>
		</z-paging>
		<ut-range-time :show.sync="showTime" :startDate="startDate" :endDate="endDate"></ut-range-time>
		<ut-picker-data :value="model.adcdCode" isRange rangeCode="532500" @change="changeAdc" :show.sync="showPicker"></ut-picker-data>

		<u-popup :show="showDepartment" @close="departmentClose" closeable :round="10" zIndex="100000">
			<view class="department-title h1">所在单位选择</view>
			<scroll-view scroll-y="true" class="department-content" scroll-with-animation :scroll-into-view="intoview">
				<view class="d-flex wrap name-box">
					<template v-for="(item, index) in titleList">
						<view :class="index >= 2 ? 'li' : 'li disabled'" @click="handleDepartmentTitleClick"
							>{{ item }}<u-icon name="arrow-right" v-if="index < 2"></u-icon
						></view>
					</template>
				</view>
				<view class="department-area" v-if="!isDepartment">
					<view class="department-list">
						<view class="department-item d-flex js-b-c" v-for="item in areaList" @click="handleDepartmentAreaCurr(item)">
							<view>{{ item.name }}</view>
						</view>
					</view>
				</view>
				<view class="department-search-box" v-if="isDepartment">
					<view v-if="departmentData.length>0">
						<view class="department-search" >
							<u--input
								placeholder="请输入所在单位"
								border="surround"
								v-model="searchDepartmentInput"
								@change="changeDepartment"
							></u--input>
						</view>
						<view class="department-list">
							<view
								class="department-item d-flex js-b-c"
								v-for="(item, index) in searchDepartmentData"
								@click="handleDepartmentCurr(index)"
							>
								<view>{{ item }}</view>
								<u-icon v-if="index == currDepartment" name="checkmark" color="#3B7EFF" size="36rpx"></u-icon>
							</view>
						</view>
					</view>
					<view class="department-no-data" v-if="departmentData.length==0">暂无数据</view>
				</view>
			</scroll-view>
			<view class="d-flex js-b-c" style="padding: 20rpx">
				<view @click="departmentClose" class="btn-btm btn-qs">取消</view>
				<view @click="departmentSubmit" class="btn-btm btn-ss">确定</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
import { getScreeningUserInfo,getScreeningCompanyList } from "@/api/cancer-screening";
import { areaList } from "@/utils/area.js";

export default {
	dicts: ["sys_gender"],
	data() {
		return {
			msg: false,
			showPicker: false,
			range: [],
			showDepartment: false,
			currDepartment: null,
			searchDepartmentInput: null,
			titleList: ["云南省", "红河哈尼族彝族自治州"],
			areaList: [],
			isDepartment: false,
			rules: {
				name: [
					{
						required: true,
						message: "请输入姓名",
					},
				],
				gender: [
					{
						required: true,
						message: "请选择性别",
					},
				],
				cpy:[
					{
						required: true,
						message: "请选择单位",
					},
				],

				idcard: [
					{
						required: true,
						message: "请输入身份证号码",
					},
					{
						// 自定义验证函数，见上说明
						validator: (rule, value, callback) => {
							// 上面有说，返回true表示校验通过，返回false表示不通过
							// uni.$u.test.mobile()就是返回true或者false的
							return uni.$u.test.idCard(value);
						},
						message: "身份证号码不正确",
					},
				],
				phone: [
					{
						required: true,
						message: "请输入手机号码",
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
					},
				],
				adcdCode: [
					{
						required: true,
						message: "请选择所在区域",
					},
					{
						// 自定义验证函数，见上说明
						validator: (rule, value, callback) => {
							return value.includes("5325") && value !== "532500";
						},
						message: "请选择红河州范围的地区",
						// 触发器可以同时用blur和change
					},
				],
			},
			model: {
				tys: false,
				name: "",
				gender: "",
				idcard: "",
				phone: "",
				office: "",
				cpy: "",
				adcdCode: "532500",
			},
			departmentData: [],
			searchDepartmentData: [],
		};
	},
	onReady() {
		this.$refs.uForm.setRules(this.rules);
		const { county_list } = areaList;
		for (let key in county_list) {
			if (key.startsWith("5325")) {
				this.areaList.push({ code: key, name: county_list[key] });
			}
		}
	},
	onShow() {
		if (!this.token) {
			uni.navigateTo({
				url: "/pages/login/login",
			});
		} else {
			this.getSelfUser();
		}
	},
	onLoad() {
		// const curTime = new Date().getTime()
		// const newRime = new Date(2024, 1, 1, 0, 0, 0).getTime()
		// if (curTime < newRime) {
		// 	uni.showModal({
		// 		title: '提示',
		// 		content: '尊敬的用户，红河州结直肠癌早筛功能为2024年1月1日开放。',
		// 		showCancel: false
		// 	})
		// 	this.msg = true
		// }
	},
	computed: {
		...mapGetters(["token"]),
	},
	methods: {
		changeCk(event) {
			this.model.tys = event;
		},
		setTys() {
			this.model.tys = !this.model.tys;
		},
		hideKeyboard() {
			uni.hideKeyboard();
		},
		async getSelfUser() {
			if (this.msg) return;
			const res = await getScreeningUserInfo();
			if (!res || res.code !== 200) return;
			if (res.data && res.data.idcard) {
				uni.redirectTo({
					url: "/pagesC/cancer-screening/result/result",
				});
			}
		},
		changeAdc(event) {
			const { value, label } = event;
			this.model.adcdCode = value;
			this.model.adcdName = label;
		},
		submitForm() {
			let that = this;
			this.$refs.uForm
				.validate()
				.then((res) => {
					if (res) {
						if (!that.model.tys) {
							uni.showToast({
								icon: "none",
								title: "请勾选知情同意书",
							});
							return;
						}
						uni.navigateTo({
							url: "/pagesC/cancer-screening/risk/risk",
							events: {
								setModelForm(model) {
									that.model = model;
								},
							},
							success(res) {
								res.eventChannel.emit("model", that.model);
							},
						});
					}
				})
				.catch((err) => {
					console.log(err);
				});
		},
		onBack() {
			console.log();
			uni.redirectTo({
				url: "/pages/index/index",
			});
		},
		handleDepartmentCurr(index) {
			this.currDepartment = index;
		},
		departmentClose() {
			this.currDepartment = null;
			this.showDepartment = false;
			this.searchDepartmentInput = null;
			this.searchDepartmentData = this.departmentData;
		},
		handleDepartmentTitleClick() {
			if (this.titleList.length != 2) {
				const arr = JSON.parse(JSON.stringify(this.titleList));
				arr.pop();
				this.titleList = arr;
			}

			this.currDepartment = null;
			this.searchDepartmentInput = null;
			this.searchDepartmentData = [];
			this.departmentData=[]
			this.isDepartment = false;
		},
		handleDepartmentAreaCurr(item) {
			const arr = JSON.parse(JSON.stringify(this.titleList));
			arr[2] = item.name;
			this.titleList = arr;
			this.isDepartment = true;
			this.getCompanyList(item.code)
			
		},
		changeDepartment(value) {
			this.currDepartment = null;
			const result = [];
			for (let i = 0; i < this.departmentData.length; i++) {
				if (this.departmentData[i].includes(value)) {
					result.push(this.departmentData[i]);
				}
			}
			this.searchDepartmentData = result;
		},
		departmentSubmit() {
			this.model.cpy = this.searchDepartmentData[this.currDepartment];
			this.departmentClose();
		},
		async getCompanyList(cityCode) {
			const res = await getScreeningCompanyList(cityCode)
			// console.log(res);
			if (!res || res.code !== 200) return
			const {
				records
			} = res.data
			if(res.data.length>0){
				this.departmentData=res.data.map(item=>item.companyName)
				this.searchDepartmentData=res.data.map(item=>item.companyName)
			}
		},
	},
};
</script>

<style lang="scss" scoped>
.banner {
	position: absolute;
	width: 750rpx;
	left: 0;
	top: 0;
	right: 0;
	height: 380rpx;
}

.form-block {
	position: relative;
	margin: 32rpx;
	padding: 10rpx 32rpx;
	border-radius: 20rpx;
	background-color: #fff;
	z-index: 10;
}
/deep/.u-textarea--disabled {
	background-color: #fff !important;
}
.banner-box {
	position: relative;
	z-index: 10;
	padding: 72rpx 74rpx;
}

/deep/.u-form-item__body {
	padding: 13px 0 !important;
}

.bnr-font {
	padding-bottom: 14rpx;
	font-size: 48rpx;
	font-family: PangMenZhengDao, PangMenZhengDao;
	font-weight: 400;
	color: #3b7eff;
	line-height: 56rpx;
}

.bnr-mfont {
	width: 402rpx;
	height: 64rpx;
	padding-left: 32rpx;
	line-height: 64rpx;
	font-size: 30rpx;
	font-family: Source Han Sans CN, Source Han Sans CN;
	font-weight: 500;
	color: #3b7eff;
	background: linear-gradient(90deg, #c5d7fc 0%, rgba(59, 126, 255, 0) 73%);
	border-radius: 60rpx;
}

.plchder {
	color: #c0c4cc;
}
.department-title {
	position: relative;
	box-sizing: border-box;
	width: 100%;
	text-align: center;
	padding: 32rpx;
}
.department-content {
	position: relative;
	box-sizing: border-box;
	width: 100%;
	padding: 10px;
	.name-box {
		padding: 0 10rpx;
	}
	.department-search-box,
	.department-area {
		position: relative;
		width: 100%;
		box-sizing: border-box;
		margin-top: 15rpx;
		.department-search {
			position: relative;
			box-sizing: border-box;
			width: 100%;
			margin-bottom: 10px;
		}
		.department-list {
			position: relative;
			box-sizing: border-box;
			width: 100%;
			height: 30vh;
			overflow-y: auto;
			.department-item {
				position: relative;
				box-sizing: border-box;
				width: 100%;
				padding: 20rpx;
				background-color: #f7f7f7;
				margin: 4rpx 0;
			}
		}
		.department-no-data {
			position: relative;
			box-sizing: border-box;
			width: 100%;
			height: 30vh;
			display: flex;
			align-items: center;
			justify-content: center;
			font-size: 1rem;
			font-weight: bold;
		}
	}
}
.btn-btm {
	display: flex;
	justify-content: center;
	align-items: center;
	width: 45%;
	height: 80rpx;
	font-size: 36rpx;
	font-weight: 500;
	border-radius: 80rpx;
}
.btn-qs {
	color: #5178ff;
	background: rgba(81, 120, 255, 0.1);
}

.btn-ss {
	color: #fff;
	background-color: #5178ff;
}

.li {
	padding: 10rpx;
	font-size: 30rpx;
	display: flex;
	color: #333;
	align-items: center;
	&.disabled {
		color: #999;
	}
	&.active {
		color: #5178ff;
	}
}
</style>

