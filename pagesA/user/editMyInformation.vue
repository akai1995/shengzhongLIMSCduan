<template>
	<view class="page">
		<view class='content'>
			<ut-nav title="完善个人信息" border></ut-nav>
			<view>
				<view class=" flex j-c-c">
					<image @click="handleToAvatar" :src="headImg" class='headImg'>
					</image>
				</view>
				<button class="primary" plain open-type="chooseAvatar" @chooseavatar="onChooseAvatar">更换头像</button>

				<u--form labelPosition="left" :model="userInfo" labelWidth="150rpx" ref='userInfo'>
					<u-form-item label="昵称" prop="nickName" borderBottom>
						<input v-model="userInfo.nickName" border="none" placeholder="请填写社区昵称" type='nickname'
							@blur="blurNickName"></u--input>
					</u-form-item>
					<u-form-item label="姓名" prop="name" borderBottom required>
						<u--input v-model="userInfo.name" border="none" placeholder="请填写姓名"></u--input>
					</u-form-item>
					<u-form-item label="性别" prop="sex" borderBottom @click="showSex = true; ">
						<u--input v-model="userInfo.sex" disabled placeholder="请选择性别" border="none"></u--input>
						<u-icon slot="right" name="arrow-right"></u-icon>
					</u-form-item>
					<u-form-item label="身份证号" prop="idcard" borderBottom required>
						<u--input v-model="userInfo.idcard" border="none" placeholder="请填写身份证号"
							@blur="autoFillBirthday"></u--input>
					</u-form-item>
					<u-form-item label="联系电话" prop="telephone" borderBottom required>
						<u--input v-model="userInfo.telephone" border="none" placeholder="请填写联系电话"></u--input>
					</u-form-item>
					<u-form-item label="生日" prop="bitrhday" borderBottom @click='showBirthday=true'>
						<u--input v-model="userInfo.birthday" border="none" disabled="true"
							placeholder="请选择生日"></u--input>
						<u-icon slot="right" name="arrow-right"></u-icon>
					</u-form-item>
					<u-form-item label="籍贯" prop="nativePlace" borderBottom @click='showNativeSelect=true'>
						<u--input v-model="userInfo.nativePlace" border="none" disabled="true"
							placeholder="请选择籍贯"></u--input>
						<u-icon slot="right" name="arrow-right"></u-icon>
					</u-form-item>
					<u-form-item label="民族" prop="nation" borderBottom @click='showNationSelect=true'>
						<u--input v-model="userInfo.nation" border="none" disabled="true"
							placeholder="请填写民族"></u--input>
						<u-icon slot="right" name="arrow-right"></u-icon>
					</u-form-item>
					<u-form-item label="职业" prop="job" borderBottom>
						<u--input v-model="userInfo.job" border="none" placeholder="请填写职业"></u--input>
					</u-form-item>
				</u--form>
				<view class="button" @click="updatePersonalData">保存</view>


				<u-action-sheet :show="showSex" :actions="actions" title="请选择性别" @close="showSex = false"
					@select="sexSelect">
				</u-action-sheet>

				<u-datetime-picker :show="showBirthday" v-model="defaultTime" mode="date" @cancel='showBirthday=false'
					@confirm='confirmBirthday' :minDate="minDate" :maxDate="maxDate" :closeOnClickOverlay='true'
					@close="showBirthday=false" ref = 'birthdayPicker'></u-datetime-picker>

				<addressPicker :show='showNativeSelect' @confirm='confirmAddress' @cancel='showNativeSelect=false'
					:addressData="defaultNative" :closeOnClickOverlay='true'
					@close="showNativeSelect=false"></addressPicker>

				<u-picker :show="showNationSelect" :columns="nationList" @confirm='confirmNation'
					@cancel='showNationSelect=false' :immediateChange='true' :closeOnClickOverlay='true'
					@close="showNationSelect=false"></u-picker>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		updateUserInfo
	} from '@/api/personalCenter/personalCenter'
	import nationData from '@/pagesA/component/nation.json'
	import {
		baseUrl
	} from "@/config";
	import {
		getWxInfo
	} from '@/api/login'
	import addressPicker from "../component/address-picker/address-picker.vue"
	export default {
		components:{
			addressPicker
		},
		data() {
			return {
				nationList: [],
				showNationSelect: false,
				showNativeSelect: false,
				defaultTime: Number(new Date("1993-03-27")),
				defaultNative: [],
				minDate: '',
				maxDate: '',
				showBirthday: false,
				headImg: this.$store.getters.avatar,
				rules: {
					'name': {
						type: 'string',
						required: true,
						message: '请填写姓名',
						trigger: ['blur', 'change']
					},
					'telephone': [{
							required: true,
							message: '请输入手机号',
							trigger: ['change', 'blur'],
						},
						{
							// 自定义验证函数，见上说明
							validator: (rule, value, callback) => {
								// 上面有说，返回true表示校验通过，返回false表示不通过
								// uni.$u.test.mobile()就是返回true或者false的
								return uni.$u.test.mobile(value);
							},
							message: '手机号码不正确',
							// 触发器可以同时用blur和change
							trigger: ['change', 'blur'],
						}
					],
					'idcard': [{
							required: true,
							message: '请输入身份证号',
							trigger: ['change', 'blur'],
						},
						{
							// 自定义验证函数，见上说明
							validator: (rule, value, callback) => {
								// 上面有说，返回true表示校验通过，返回false表示不通过
								// uni.$u.test.mobile()就是返回true或者false的
								return uni.$u.test.idCard(value);
							},
							message: '身份证号码不正确',
							// 触发器可以同时用blur和change
							trigger: ['change', 'blur'],
						}
					],

				},
				actions: [{
						name: '男',
					},
					{
						name: '女',
					},
				],
				showSex: false,
				userInfo: {
					name: '',
					telephone: '',
					idcard: ''

				},


			}
		},
		onReady() {
			//onReady 为uni-app支持的生命周期之一
			this.$refs.userInfo.setRules(this.rules)
		},
		onLoad() {
			this.getPersonalInfo()
			this.minDate = new Date("1910-01-01").getTime()
			this.maxDate = new Date().getTime()
			this.initNationList()


		},
		methods: {
			autoFillBirthday(e) {
				let strBirthday = "";
				if ((e + "").length == 0) {
					return
				}
				if (e.length == 15) {
					strBirthday =
						"19" +
						e.substr(6, 2) +
						"-" +
						e.substr(8, 2) +
						"-" +
						e.substr(10, 2);
						this.userInfo.birthday=strBirthday
						this.$nextTick(()=>{
							this.$refs.birthdayPicker.innerValue=new Date(strBirthday).getTime()
						})
					
				} else if (e.length == 18) {
					strBirthday =
						e.substr(6, 4) +
						"-" +
						e.substr(10, 2) +
						"-" +
						e.substr(12, 2);
						this.userInfo.birthday=strBirthday
						this.$refs.birthdayPicker.innerValue=new Date(strBirthday).getTime()
				} else {
					return
				}


			},
			blurNickName(e) {
				this.userInfo.nickName = e.detail.value
			},

			onChooseAvatar(e) {
				this.headImg = e.detail.avatarUrl
				// uni.getFileSystemManager().readFile({
				// 	filePath: e.detail.avatarUrl,
				// 	encoding: 'base64',
				// 	success: ress => {
				// 		this.userInfo.avatar = 'data:image/png;base64,' + ress.data
				// 	}
				// })
				uni.uploadFile({
					url: baseUrl + '/file/upload',
					filePath: this.headImg,
					name: 'file',
					success: ress => {
						let result = JSON.parse(ress.data)
						this.userInfo.avatar = result.data.url
					},
				})
			},

			updatePersonalData() {
				this.$refs.userInfo.validate().then(valid => {
					updateUserInfo(this.userInfo).then(res => {
						this.$store.commit('SET_NAME', this.userInfo.name)
						this.$store.commit('SET_IDCARD', this.userInfo.idcard)
						if (this.userInfo.avatar != null) {
							this.$store.commit('SET_AVATAR', this.userInfo.avatar)
						}
						uni.redirectTo({
							url: '/pages/user/user'
						})
					})
				}).catch(err => {
					uni.$u.toast("请核对信息")
				})


			},


			initNationList() {
				let result = nationData.map(t => {
					return t.name
				})
				this.nationList = [result]

			},
			confirmNation(e) {
				this.userInfo.nation = e.value[0]
				this.showNationSelect = false
			},
			confirmAddress(e) {

				this.userInfo.nativePlace = e.value[0] + '-' + e.value[1] + '-' + e.value[2]
				this.showNativeSelect = false
			},

			confirmBirthday(e) {
				this.showBirthday = false
				const timeFormat = uni.$u.timeFormat;
				this.userInfo.birthday = timeFormat(e.value, 'yyyy-mm-dd');
			},
			sexSelect(e) {
				this.userInfo.sex = e.name
			},
			getPersonalInfo() {
				let id = this.$store.getters.userId;
				getWxInfo(id).then(res => {
					this.userInfo = res.user
					if (this.userInfo.nativePlace != null) {
						this.defaultNative = this.userInfo.nativePlace.split("-")
					}
				})
			},
		}
	}
</script>

<style scoped>
	.page {
		background: #FFFFFF;
		width: 100%;
		height: 100vh;

	}

	/deep/ .u-input {
		background-color: #FFF !important;
	}

	.headImg {
		width: 200rpx;
		height: 200rpx;
		border-radius: 50%;
		flex-shrink: 0;
	}


	.button {
		margin-top: 180rpx;
		left: 70rpx;
		right: 70rpx;
		height: 80rpx;
		border-radius: 80rpx;
		background: linear-gradient(135deg, #00DEFF 0%, #0C5FFF 100%);
		display: flex;
		align-items: center;
		justify-content: center;
		color: #FFFFFF;
		font-size: 36rpx;
		font-weight: 500;
		letter-spacing: 2rpx;
	}

	.primary {
		border: none;
		font-size: 28rpx;
		color: #3B7EFF;
	}
</style>