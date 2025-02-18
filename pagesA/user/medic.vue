<template>
	<view>
		<ut-nav title="医生权限申请" border back @onBack="onBack"></ut-nav>

		<view class="content">
			<u--form :model="form" :rules="rules" ref="uForm" labelWidth="180rpx">
				<u-form-item label="头像" borderBottom v-if="false">
					<u-upload :fileList="fileList" @afterRead="afterRead" @delete="deletePic" :maxCount="1"></u-upload>
				</u-form-item>
				<u-form-item label="医院机构" prop="orgId" borderBottom @click="orgShow = true" required>
					<u-input border="none" readonly v-model="form.fdMedicalName" placeholder="请选择" />
					<u-picker :show="orgShow" :columns="hospitalList" keyName="orgName" @confirm="orgConfirm"
						@cancel="orgShow = false"></u-picker>
				</u-form-item>
				<u-form-item label="姓名" prop="name" borderBottom required>
					<u--input v-model="form.name" border="none" placeholder="请输入"></u--input>
				</u-form-item>
				<!-- <u-form-item label="职称" @click="isLevel = true" borderBottom prop="level" required>
					<u-input border="none" readonly v-model="form.level" placeholder="请选择" />
					<u-picker :show="isLevel" :columns="levelList" @confirm="confirmLevel"
						@cancel="isLevel = false"></u-picker>
				</u-form-item> -->
				<u-form-item label="科室" borderBottom>
					<!-- <u-input border="none" readonly v-model="form.lable" placeholder="请选择" />
					<u-picker :show="isLabel" :columns="tagList" @confirm="confirmLable"
						@cancel="isLabel = false"></u-picker> -->
					<u--input v-model="form.lable" border="none" placeholder="请输入"></u--input>
				</u-form-item>
				<!-- <u-form-item label="执业证编号" prop="code" borderBottom>
					<u--input v-model="form.code" border="none" placeholder="请输入"></u--input>
				</u-form-item> -->
				<!-- <u-form-item label="擅长" borderBottom>
					<u-checkbox-group v-model="form.classVal" shape="square">
						<u-checkbox :customStyle="{marginRight: '16px'}" v-for="(item, index) in classList" :key="index"
							:label="item.dictLabel" :name="item.dictValue">
						</u-checkbox>
					</u-checkbox-group>
				</u-form-item> -->
				<u-form-item label="简介" prop="speciality" @click="jump()">
					<u--textarea border="none" v-model="form.speciality" readonly autoHeight
						placeholder="请输入简介,最长200个汉字"></u--textarea>
				</u-form-item>
			</u--form>

			<view class="m-t4">
				<view class="btn" @click="submit()" v-if="form.orgId && form.name">完成</view>
				<view v-else class="btn" style="background: #9e9e9e91;">完成</view>
			</view>
		</view>
	</view>
</template>

<script>
import {
	nosocomiumlist,
	dict,
	expertAdd,
	getExpert,
	expertEdit
} from '@/api/system/user.js'
import {
	baseUrl
} from '@/config.js'
export default {
	data() {
		return {
			edit: false,
			form: {
				headImg: '',
				fdMedicalName: '',
				code: '',
				orgId: '',
				name: '',
				level: '',
				classification: '',
				lable: '',
				speciality: '',
				lableVal: [],
				classVal: [],
			},
			rules: {
				orgId: [{
					required: true,
					message: '请选择医院机构',
					trigger: ['change', 'blur']
				}],
				name: [{
					required: true,
					message: '请输入姓名',
					trigger: ['change', 'blur']
				}, {
					required: true,
					min: 1,
					max: 30,
					message: "姓名长度不能超过30个字符",
					trigger: ["change", "blur"],
				},],
				/* level: [{
					required: true,
					message: '请选择职称',
					trigger: ['change', 'blur']
				}], */
				/* code: [{
						// required: true,
						message: '请输入执业证编号',
						trigger: ['change', 'blur']
					},
					{
						validator: (rule, value, callback) => {
							// 上面有说，返回true表示校验通过，返回false表示不通过
							// uni.$u.test.mobile()就是返回true或者false的
							return !uni.$u.test.chinese(value);
						},
						message: '只允许输入数字、字母，最多允许输入40位',
					}, {
						// required: true,
						min: 1,
						max: 40,
						message: "执业证编号长度不能超过40个字符",
						trigger: ["change", "blur"],
					},
				] */
			},
			lableVal: [],
			classVal: [],
			hospitalList: [],
			fileList: [],
			levelList: [],
			classList: [],
			tagList: [],
			orgShow: false,
			isLevel: false,
			isLabel: false,
		};
	},
	onReady() {
		//onReady 为uni-app支持的生命周期之一
		this.$refs.uForm.setRules(this.rules)
	},

	onLoad(options) {
		this.getHospital()
		this.getDict()
		// this.getExperts()
	},

	methods: {
		submit() {
			const that = this
			that.$refs.uForm.validate().then(valid => {
				if (valid) {
					uni.showModal({
						title: "提交后将无法修改，请确认后提交",
						className: 'my-modal',
						confirmText: '提交',
						success(res) {
							if (res.confirm) {
								if (!that.edit) {
									that.form.classification = that.form.classVal.join(',')

									that.form.userId = that.$store.getters.userId
									that.form.expertResult = 0
									// console.log('form', that.form)
									// return
									const {
										classVal,
										...realForm
									} = that.form;
									expertAdd(realForm).then(res => {
										if (res.code == 200) {
											console.log('提交成功')
											that.$ut.jump('/pagesA/user/success')
											// uni.reLaunch({
											// 	url: '/pages/user/success'
											// })
										}
									})
								}
							}
						}
					})
				} else {
					console.log("表单验证不通过");
					that.$message.error("请正确填写表单");
				}
			})
		},

		getHospital() {
			nosocomiumlist().then(res => {
				if (res.code == 200) {
					this.hospitalList.push(res.data)
				}
			})
		},
		getDict() {
			//专家级别
			dict('exper_level').then(res => {
				let list = []
				res.data.forEach(item => {
					list.push(item.dictValue)
				})
				this.levelList.push(list)
			})
			//专家分类
			dict('exper_classification').then(res => {
				res.data.forEach(item => {
					if (item.dictValue != '全部') {
						this.classList.push(item)
					}
				})
			})
			//专家标签
			dict('exper_lable').then(res => {
				let list = []
				res.data.forEach(item => {
					list.push(item.dictLabel)
				})
				this.tagList.push(list)
				// console.log('tag',this.tagList)
			})
		},
		// 删除图片
		deletePic(event) {
			this.fileList.splice(event.index, 1)
		},
		// 新增图片
		afterRead(event) {
			console.log('e', event)
			// this.fileList.push(event.file.url)
			let lists = [].concat(event.file)
			let fileListLen = this.fileList.length
			lists.map((item) => {
				this.fileList.push({
					...item,
				})
			})
			this.uploadFilePromise()
		},
		uploadFilePromise() {
			let a = uni.uploadFile({
				url: baseUrl + '/file/upload', // 仅为示例，非真实的接口地址
				filePath: this.fileList[0].url,
				name: 'file',
				formData: {
					user: 'test'
				},
				success: (res) => {
					let result = JSON.parse(res.data)
					console.log('res', result.data.url)
					// this.form.img=result.data.url;
					this.form.headImg = result.data.url
				}
			});
		},


		onBack() {
			uni.showModal({
				content: '是否返回首页?',
				confirmText: '确定返回',
				confirmColor: '#999',
				cancelColor: '#00aaff',
				success: function (res) {
					if (res.confirm) {
						uni.reLaunch({
							url: '/pages/user/user'
						})
					}

				},
			})
		},

		orgConfirm(e) {
			this.form.orgId = e.value[0].orgId
			this.form.fdMedicalName = e.value[0].orgName
			this.orgShow = false
		},
		confirmLevel(e) {
			this.form.level = e.value[0]
			// this.$refs.form.validateField('level')
			this.isLevel = false
		},
		confirmLable(e) {
			this.form.lable = e.value[0]
			this.isLabel = false
		},

		jump() {
			uni.navigateTo({
				url: '/pagesA/textArea/textArea?text=' + this.form.speciality
			})
		}
	}
}
</script>

<style lang="less">
page {
	background-color: #fff;

}

.content {
	padding: 0 32rpx 32rpx 32rpx;
}


.btn {
	width: 100%;
	height: 80rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	border-radius: 80rpx;
	background: linear-gradient(135deg, #00DEFF 0%, #0C5FFF 100%);
	color: #fff;
	font-size: 36rpx;
	font-weight: 600;
	letter-spacing: 5rpx;
}

/deep/.u-checkbox-group {
	flex-wrap: wrap;
}

/deep/.u-checkbox {
	margin-bottom: 10rpx;
}
</style>