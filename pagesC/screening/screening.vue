<template>
	<view>
		<u-navbar title="基因派" :leftIconColor="leftIconColor" :placeholder="true" :border="border">
			<view class="u-nav-slot" slot="left">
				<u-icon name="home" size="20" @click="leftClick"></u-icon>
			</view>
		</u-navbar>
		<view class="screen-content">
			<view class="screen-bg">
				<img class="screen-img" src="https://genepiapi.ypzlfx.com/file/genepi/2024/06/05/screenbg.png" />
			</view>
			<view class="screen-info">
				<view class="screen-card">
					<view class="screen-item">
						<view class="screen-key">姓名</view>
						<view class="screen-value">
							<u-input v-model="firstPage.name" border="surround" placeholder="请填写姓名" />
						</view>
					</view>
					<view class="screen-item">
						<view class="screen-key">身份证号</view>
						<view class="screen-value">
							<u-input v-model="firstPage.code" border="surround" placeholder="请填写身份证号" />
						</view>
					</view>
					<view class="screen-item">
						<view class="screen-key">民族</view>
						<view class="screen-value">
							<view
								:class="firstPage.famouClan.value == '' ? 'screen-value-select-placeholder' : 'screen-value-select'"
								@click="firstPage.famouClan.visible = true"
							>
								{{ firstPage.famouClan.value == "" ? "请选择名族" : firstPage.famouClan.value }}
								<view class="screen-value-select-icon"><u-icon name="arrow-right" color="#c0c4cc"></u-icon></view>
							</view>
							<u-picker
								:show="firstPage.famouClan.visible"
								@cancel="firstPage.famouClan.visible = false"
								@confirm="handleChangeFamouClan"
								:columns="firstPage.famouClan.list"
							></u-picker>
						</view>
					</view>
					<view class="screen-item">
						<view class="screen-key">职业</view>
						<view class="screen-value">
							<u-input v-model="firstPage.job" border="surround" placeholder="请输入职业" />
						</view>
					</view>
					<view class="screen-item">
						<view class="screen-key">居住环境</view>
						<view class="screen-value">
							<u-input v-model="firstPage.live" border="surround" placeholder="请输入居住环境" />
						</view>
					</view>
					<view class="screen-item">
						<view class="screen-key">特殊饮食</view>
						<view class="screen-value">
							<u-input v-model="firstPage.eat" border="surround" placeholder="请输入特殊饮食" />
						</view>
					</view>
					<view class="screen-item">
						<view class="screen-key">体重（kg）</view>
						<view class="screen-value">
							<u-input v-model="firstPage.weight" border="surround" placeholder="请输入体重" />
						</view>
					</view>
					<view class="screen-item">
						<view class="screen-key">身高（cm）</view>
						<view class="screen-value">
							<u-input v-model="firstPage.height" border="surround" placeholder="请输入身高" />
						</view>
					</view>
					<view class="screen-item">
						<view class="screen-key">家庭年收入范围（元）</view>
						<view class="screen-value flex">
							<u-input v-model="firstPage.incomeStar" border="surround" placeholder="最低收入" />
							<view style="padding: 0 10px">至</view>
							<u-input v-model="firstPage.incomeEnd" border="surround" placeholder="最高收入" />
						</view>
					</view>
					<view class="screen-item">
						<view class="screen-key">学历</view>
						<view class="screen-value">
							<view
								:class="firstPage.educational.value == '' ? 'screen-value-select-placeholder' : 'screen-value-select'"
								@click="firstPage.educational.visible = true"
							>
								{{ firstPage.educational.value == "" ? "请选择学历" : firstPage.educational.value }}
								<view class="screen-value-select-icon"><u-icon name="arrow-right" color="#c0c4cc"></u-icon></view>
							</view>
							<u-picker
								:show="firstPage.educational.visible"
								@cancel="firstPage.educational.visible = false"
								@confirm="handleChangeEducational"
								:columns="firstPage.educational.list"
							></u-picker>
						</view>
					</view>
					<view class="screen-item">
						<view class="screen-key">既往是否做过宫颈癌筛查</view>
						<view class="screen-value">
							<u-radio-group v-model="firstPage.cervicalCancer" placement="row" :size="22" @change="handleCervicalCancerChange">
								<u-radio label="是" name="是" :customStyle="{ marginRight: '20px' }"></u-radio>
								<u-radio label="否" name="否"></u-radio>
							</u-radio-group>
						</view>
					</view>
					<view class="screen-item" v-if="firstPage.cervicalCancer == '是'">
						<view class="screen-key">哪一年做了宫颈癌筛查</view>
						<view class="screen-value">
							<u-input v-model="firstPage.cervicalCancerYear" border="surround" placeholder="请输入哪一年做了宫颈癌筛查" />
						</view>
					</view>
					<view class="screen-item" v-if="firstPage.cervicalCancer == '是'">
						<view class="screen-key">宫颈癌筛查结果</view>
						<view class="screen-value">
							<u-input v-model="firstPage.cervicalCancerResult" border="surround" placeholder="请输入宫颈癌筛查结果" />
						</view>
					</view>
					<view class="screen-item">
						<view class="screen-key">既往是否接种过HPV疫苗</view>
						<view class="screen-value">
							<u-radio-group v-model="firstPage.hpv" placement="row" :size="22" @change="handleHpvChange">
								<u-radio label="是" name="是" :customStyle="{ marginRight: '20px' }"></u-radio>
								<u-radio label="否" name="否"></u-radio>
							</u-radio-group>
						</view>
					</view>
					<view class="screen-item" v-if="firstPage.hpv == '是'">
						<view class="screen-key">哪一年接种过HPV疫苗</view>
						<view class="screen-value">
							<u-input v-model="firstPage.hpvYear" border="surround" placeholder="请输入哪一年接种过HPV疫苗" />
						</view>
					</view>
					<view class="screen-item">
						<view class="screen-key">接种疫苗不良反应</view>
						<view class="screen-value">
							<u-radio-group v-model="firstPage.vaccine" placement="row" :size="22">
								<u-radio label="是" name="是" :customStyle="{ marginRight: '20px' }"></u-radio>
								<u-radio label="否" name="否"></u-radio>
							</u-radio-group>
						</view>
					</view>
					<view class="screen-item">
						<view class="screen-key">怀孕/分娩（含流产）次数</view>
						<view class="screen-value">
							<u-input v-model="firstPage.abortion" border="surround" placeholder="请输入怀孕/分娩（含流产）次数" />
						</view>
					</view>
					<view class="screen-item">
						<view class="screen-key">末次月经时间</view>
						<view class="screen-value">
							<u-input v-model="firstPage.menstruation" border="surround" placeholder="请输入末次月经时间" />
						</view>
					</view>
					<view class="screen-item">
						<view class="screen-key">是否绝经</view>
						<view class="screen-value">
							<u-radio-group v-model="firstPage.menopause" placement="row" :size="22" @change="handleMenopauseChange">
								<u-radio label="是" name="是" :customStyle="{ marginRight: '20px' }"></u-radio>
								<u-radio label="否" name="否"></u-radio>
							</u-radio-group>
						</view>
					</view>
					<view class="screen-item" v-if="firstPage.menopause == '是'">
						<view class="screen-key">哪一年开始绝经</view>
						<view class="screen-value">
							<u-input v-model="firstPage.menopauseYear" border="surround" placeholder="请输入哪一年开始绝经" />
						</view>
					</view>
					<view class="screen-item">
						<view class="screen-key">既往是否有妇科手术史</view>
						<view class="screen-value">
							<u-radio-group v-model="firstPage.operation" placement="row" :size="22">
								<u-radio label="是" name="是" :customStyle="{ marginRight: '20px' }"></u-radio>
								<u-radio label="否" name="否"></u-radio>
							</u-radio-group>
						</view>
					</view>
					<view class="screen-item">
						<view class="screen-key">抽烟</view>
						<view class="screen-value">
							<u-radio-group v-model="firstPage.smoke" placement="row" :size="22">
								<u-radio label="是" name="是" :customStyle="{ marginRight: '20px' }"></u-radio>
								<u-radio label="否" name="否"></u-radio>
							</u-radio-group>
						</view>
					</view>
					<view class="screen-item">
						<view class="screen-key">喝酒</view>
						<view class="screen-value">
							<u-radio-group v-model="firstPage.drink" placement="row" :size="22">
								<u-radio label="是" name="是" :customStyle="{ marginRight: '20px' }"></u-radio>
								<u-radio label="否" name="否"></u-radio>
							</u-radio-group>
						</view>
					</view>
					<view class="screen-item">
						<view class="screen-key">经常熬夜</view>
						<view class="screen-value">
							<u-radio-group v-model="firstPage.night" placement="row" :size="22">
								<u-radio label="是" name="是" :customStyle="{ marginRight: '20px' }"></u-radio>
								<u-radio label="否" name="否"></u-radio>
							</u-radio-group>
						</view>
					</view>
					<view class="screen-item">
						<view class="screen-key">口服避孕药</view>
						<view class="screen-value">
							<u-radio-group v-model="firstPage.birthControlPills" placement="row" :size="22">
								<u-radio label="是" name="是" :customStyle="{ marginRight: '20px' }"></u-radio>
								<u-radio label="否" name="否"></u-radio>
							</u-radio-group>
						</view>
					</view>
				</view>

				<view>
					<view class="screen-read">
						<view class="screen-read-check" @click="read = !read">
							<view v-if="!read" class="screen-read-check-curr"></view>
							<u-icon v-if="read" name="checkmark-circle-fill" :size="24" color="#2979FF"></u-icon>
						</view>
						<view class="screen-read-read-text">
							已仔细阅读并同意<span @click="$ut.jump('/pagesC/screening/book')" style="color: #2979ff">《知情同意书》</span>
						</view>
					</view>
				</view>

				<view class="submit" @click="handleNext">下一步</view>

				<view style="height: 30px"></view>
			</view>
		</view>
	</view>
</template>

<script>
import { getInfo, submitInfo } from "@/api/book.js";
import { getInfoByToken } from "@/api/personalCenter/personalCenter";

export default {
	data() {
		return {
			openId: null,
			firstPage: {
				name: "",
				famouClan: {
					value: "",
					visible: false,
					list: [["汉族", "彝族", "回族", "哈尼族", "苗族", "壮族", "傈僳族", "蒙古族", "傣族", "其它"]],
				},
				job: "",
				live: "",
				eat: "",
				weight: "",
				height: "",
				incomeStar: "",
				incomeEnd: "",
				educational: {
					value: "",
					visible: false,
					list: [["小学", "初中", "高中", "大专及以上"]],
				},
				cervicalCancer: null,
				cervicalCancerYear: null,
				cervicalCancerResult: null,
				hpv: null,
				hpvYear: null,
				vaccine: null,
				abortion: "",
				menstruation: "",
				menopause: null,
				menopauseYear: null,
				operation: null,
				smoke: null,
				drink: null,
				night: null,
				birthControlPills: null,
			},
			read: false,
			resData: null,
		};
	},
	onShow() {
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
		handleCervicalCancerChange(e) {
			if (e == "否") {
				this.firstPage.cervicalCancerYear = null;
				this.firstPage.cervicalCancerResult = null;
			}
		},
		handleHpvChange(e) {
			console.log(e);
			if (e == "否") {
				this.firstPage.hpvYear = null;
			}
		},
		handleMenopauseChange(e) {
			console.log(e);
			if (e == "否") {
				this.firstPage.menopauseYear = null;
			}
		},
		isNotEmpty(value) {
			return value !== "" && value !== null && value !== undefined;
		},
		isAllValuesNotEmpty(obj) {
			for (const key in obj) {
				if (key != "cervicalCancerYear" && key != "cervicalCancerResult" && key != "hpvYear" && key != "menopauseYear") {
					if (obj.hasOwnProperty(key)) {
						const value = obj[key];
						// 如果值是对象，则检查特定属性
						if (typeof value === "object" && value !== null) {
							if (!this.isNotEmpty(value.value)) {
								return false;
							}
						} else {
							// 如果值是一级属性，则检查是否为空
							if (!this.isNotEmpty(value)) {
								return false;
							}
						}
					}
				}
			}
			return true;
		},
		leftClick() {
			uni.reLaunch({
				url: "/pages/index/index",
			});
		},
		handleChangeFamouClan(e) {
			this.firstPage.famouClan.value = e.value[0];
			this.firstPage.famouClan.visible = false;
		},
		handleChangeEducational(e) {
			this.firstPage.educational.value = e.value[0];
			this.firstPage.educational.visible = false;
		},
		handleNext() {
			if (!this.isAllValuesNotEmpty(this.firstPage)) {
				uni.showToast({
					title: "请填写个人信息",
					icon: "none",
				});
				return;
			}

			const isPic = uni.getStorageSync("signPic");
			if (!isPic) {
				uni.showToast({
					title: "请阅读《知情同意书》并签字",
					icon: "none",
				});
				return;
			}
			if (!this.read) {
				uni.showToast({
					title: "请勾选已阅读《知情同意书》",
					icon: "none",
				});
				return;
			}

			const pushArr = {
				wxOpenId: this.openId, //微信id
				questionnaireId: "1797445758753525762", //问卷id
				name: this.firstPage.name, //姓名
				idCard: this.firstPage.code, //身份证号
				nation: this.firstPage.famouClan.value, //民族
				occupation: this.firstPage.job, //职业
				residentialEnvironment: this.firstPage.live, //居住环境
				specialDiet: this.firstPage.eat, //特殊饮食
				weight: parseInt(this.firstPage.weight), //体重
				height: parseInt(this.firstPage.height), //身高
				annualIncome: `${this.firstPage.incomeStar}-${this.firstPage.incomeEnd}`, //家庭年收入范围
				educational: this.firstPage.educational.value, //学     历
				cervicalCarcinoma: this.firstPage.cervicalCancer, //既往是否做过宫颈癌筛查
				cervicalCarcinomaDesc: this.firstPage.cervicalCancerResult, //宫颈癌筛查结果 选泽是 以后填写的内容
				cervicalCarcinomaYear: this.firstPage.cervicalCancerYear, //宫颈癌筛查年份 选泽是 以后填写的内容
				hpvVaccine: this.firstPage.hpv, //既往是否接种过HPV疫苗
				hpvVaccineDesc: this.firstPage.hpvYear, //接种过HPV疫苗时长
				vaccinationReactions: this.firstPage.vaccine, //接种疫苗不良反应
				childbirth: this.firstPage.abortion, //怀孕/分娩
				menstruationLastDate: this.firstPage.menstruation, //末次月经时间
				menopause: this.firstPage.menopause, //是否经绝
				menopauseDesc: this.firstPage.menopauseYear, //绝经时长
				gynecologicalSurgery: this.firstPage.operation, //既往是否有妇科手术史
				smoking: this.firstPage.smoke, //抽烟
				drink: this.firstPage.drink, //喝酒
				stayingUpLate: this.firstPage.night, //经常熬夜
				contraceptive: this.firstPage.birthControlPills, //口服避孕药
				informedConsentForm: this.resData.informedConsentForm, //知情同意书
				signature: isPic, //签名base64
			};

			submitInfo(pushArr).then((res) => {
				if (res.code == 200) {
					uni.removeStorageSync("signPic");
					uni.setStorageSync("userInfo", res.data.id);
					this.$ut.jump("/pagesC/screening/question");
				}
			});
		},
	},
};
</script>

<style scoped lang="scss">
.u-nav-slot {
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: space-between;
	border-width: 1rpx;
	border-radius: 200rpx;
	border-color: #dadbde;
	padding: 6rpx 14rpx;
	opacity: 0.8;
}

.screen-content {
	position: relative;
	width: 100%;
	.screen-bg {
		position: relative;
		width: 100%;
		aspect-ratio: 1/0.568;
		.screen-img {
			position: relative;
			width: 100%;
			height: 100%;
			display: block;
		}
	}
	.screen-card {
		position: relative;
		width: 85%;
		margin: 0px auto;
		background-color: #fff;
		border-radius: 8px;
		box-shadow: 0 0 8px #cecece;
		top: -3vh;
		padding: 1rem;
		font-size: 30rpx;
		margin-bottom: 10vh;
		.screen-item {
			position: relative;
			width: 100%;
			padding: 0.5rem;
			border-bottom: 1px solid #cecece;
			overflow: hidden;
			box-sizing: border-box;
			&:last-child {
				border-bottom: none;
			}
			.screen-key {
				position: relative;
				width: 100%;
				margin-bottom: 10px;
			}
			.screen-value {
				position: relative;
				width: 100%;
				.screen-value-select-placeholder {
					padding-top: 6px;
					padding-bottom: 6px;
					padding-left: 9px;
					padding-right: 9px;
					color: #c0c4cc;
					border: 1px solid #dadbde;
					border-radius: 4px;
					.screen-value-select-icon {
						position: absolute;
						top: 10px;
						right: 0px;
					}
				}
				.screen-value-select {
					padding-top: 6px;
					padding-bottom: 6px;
					padding-left: 9px;
					padding-right: 9px;
					color: #303133;
					border: 1px solid #dadbde;
					border-radius: 4px;
					.screen-value-select-icon {
						position: absolute;
						top: 10px;
						right: 0px;
					}
				}
			}
			.flex {
				display: flex;
				align-items: center;
				justify-content: space-between;
			}
		}
	}

	.screen-read {
		position: relative;
		width: 86%;
		margin: 0px auto;
		display: flex;
		align-items: center;
		margin-bottom: 2vh;
		.screen-read-check {
			position: relative;
			width: 20px;
			height: 20px;
			margin-right: 10px;
			.screen-read-check-curr {
				position: relative;
				width: 100%;
				height: 100%;
				display: block;
				border-radius: 50%;
				border: 1px solid #cecece;
			}
		}
		.screen-read-read-text {
			color: #9c9c9c;
			font-size: 26rpx;
		}
	}

	.submit {
		position: relative;
		width: 90%;
		margin: 0px auto;
		text-align: center;
		line-height: 72rpx;
		height: 72rpx;
		font-size: 34rpx;
		font-weight: 500;
		color: #fff;
		background: linear-gradient(135deg, #00deff 0%, #0c5fff 100%);
		border-radius: 80rpx;
	}
}
</style>
