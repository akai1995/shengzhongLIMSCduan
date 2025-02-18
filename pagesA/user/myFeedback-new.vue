<template>
	<view>
		<ut-nav :title="title" border></ut-nav>
		<view class="content">
			<u--form :model="form" ref="form" :rules="rules" labelWidth='150rpx' labelPosition="left">
				<u-form-item label="类型" prop="type" borderBottom @click="showType = (type=='createNew')" required>
					<u-input v-model="form.type" readonly border="none" placeholder="请选择" />
					<u-icon slot="right" name="arrow-right"></u-icon>
					<u-picker :show="showType" :columns="typeList" :closeOnClickOverlay="true" @confirm="okType"
						@cancel="showType = false" @close="showType = false"></u-picker>
				</u-form-item>
				<u-form-item label="紧急程度" prop="urgency" borderBottom @click="show = (type=='createNew')" required>
					<u-input v-model="form.urgency" readonly border="none" />
					<u-icon slot="right" name="arrow-right"></u-icon>
					<u-picker :show="show" :columns="columns" closeOnClickOverlay @confirm="confirm"
						@cancel="show = false" @close="show = false"></u-picker>
				</u-form-item>
				<u-form-item label="联系电话" prop="telephone" borderBottom required>
					<u-input v-model="form.telephone" border="none" :disabled="type!='createNew'" />
				</u-form-item>
				<u-form-item label="标题" prop="title" required> </u-form-item>
				<u--textarea v-model="form.title" border="none" :disabled="type!='createNew'"></u--textarea>
				<u-form-item label="问题描述" prop="problem" required> </u-form-item>
				<u--textarea v-model="form.problem" border="none" :disabled="type!='createNew'"></u--textarea>
				<u-form-item label="图片"> </u-form-item>
				<view class="image-box">
					<u-upload :fileList="fileList" @afterRead="afterRead" @delete="deletePic" multiple :maxCount="3"
						:disabled="type!='createNew'" uploadIcon=' '>
						<view class="upload" v-if="fileList.length == 0">
							<u-icon name="camera" color="#999" size="28"></u-icon>
							<text>上传图片（非必选）</text>
						</view>
					</u-upload>
				</view>
			</u--form>

			<view class="button" @click="subimt" v-if="type=='createNew'">确认提交</view>
		</view>


	</view>
</template>

<script>
	import {
		addFeedback,
		getFeedbackList,
		getFeedbackDetail
	}
	from "@/api/personalCenter/personalCenter"
	import {
		baseUrl
	}
	from "@/config";
	import { data } from "../../uni_modules/uview-ui/libs/mixin/mixin";
	export default {
		data() {
			return {
				title: '新建反馈',
				type: '',
				form: {
					type: '',
					urgency: '',
					telephone: '',
					title: '',
					problem: '',
					img: '',
					userId: this.$store.getters.userId,
					status: 0
				},
				status: 0,
				rules: {
					'type': {
						type: 'string',
						required: true,
						message: '请选择类型',
						trigger: ['change']
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
					'title': {
						type: 'string',
						required: true,
						message: '请输入标题',
						trigger: ['change']
					},
					'problem': {
						type: 'string',
						required: true,
						message: '请输入描述',
						trigger: ['change']
					},
					'urgency': {
						type: 'string',
						required: true,
						message: '请选择紧急程度',
						trigger: ['change']
					},
				},
				fileList: [],
				showType: false,
				typeList: [
					['建议', '投诉', '其它']
				],
				show: false,
				columns: [
					['一般', '较重', '严重', '特别严重']
				]
			};
		},
		onReady() {
			//如果需要兼容微信小程序，并且校验规则中含有方法等，只能通过setRules方法设置规则。
			this.$refs.form.setRules(this.rules)
		},
		onLoad(e) {
			if (e.type == 'checkDetail') {
				this.title = '查看详情'
				this.type = 'checkDetail'
				getFeedbackDetail(e.id).then(res => {
					this.form = res.data
					this.fileList.push({ type: 'image', url: res.data.img })
				})
			}
			if (e.type == 'createNew') {
				this.title = '新建反馈'
				this.type = 'createNew'
			}
		},
		methods: {
			subimt() {
				this.$refs.form.validate().then(valid => {
					addFeedback(this.form).then(res => {
						uni.$emit("refresh:feedback")
						uni.navigateBack()
					}).catch(e => {

					});

				})
			},
			getData() {
				getFeedbackList(this.userId, this.status).then(res => {
					this.list = res.data;
				})
			},
			okType(e) {
				this.form.type = e.value[0]
				this.showType = false
			},
			confirm(e) {
				this.form.urgency = e.value[0]
				this.show = false
			},
			deletePic(event) {
				this.fileList.splice(event.index, 1)
			},
			async afterRead(event) {
				let lists = [].concat(event.file)
				let fileListLen = this.fileList.length
				lists.map((item) => {
					this.fileList.push({
						...item,
						// status: 'uploading',
						// message: '上传中'
					})
				})
				for (let i = 0; i < lists.length; i++) {
					const result = await this.uploadFilePromise(lists[i].url)
					let item = this.fileList[fileListLen]
					this.fileList.splice(fileListLen, 1, Object.assign(item, {
						status: 'success',
						message: '',
						url: result
					}))
					fileListLen++
				}
			},
			uploadFilePromise(url) {
				return new Promise((resolve, reject) => {
					let a = uni.uploadFile({
						url: baseUrl + '/file/upload', // 仅为示例，非真实的接口地址
						filePath: url,
						name: 'file',
						formData: {
							user: 'test'
						},

						success: (res) => {
							let result = JSON.parse(res.data)
							this.form.img = result.data.url;
						}
					});
				})

			}
		}
	}
</script>

<style lang="scss">
	page {
		background: #fff;
	}

	.button {
		margin-top: 30rpx;
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

	/deep/.u-textarea {
		background-color: #F8F8F8FF !important;
		border-radius: 10rpx;
	}

	.image-box {
		width: 100%;
		min-height: 120rpx;
		background: #F8F8F8FF;
		border-radius: 10rpx;
		display: flex;
		align-items: center;
	}

	.upload {
		width: 680rpx;
		height: 100rpx;
		background: #F8F8F8FF;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 24rpx;
		color: #c6c6c6;
	}

	/deep/ .u-upload {
		padding: 20rpx;
	}

	/deep/ .u-upload__wrap__preview {
		margin: 0 10rpx 0 0 !important;
	}
</style>