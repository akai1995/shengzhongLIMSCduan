<template>
	<view class="wrapper">
		<ut-nav title="修改咨询信息" border></ut-nav>
		<scroll-view class="page-content" scroll-with-animation scroll-y>
			<view style="padding: 32rpx 32rpx 70rpx;">
				<view class="h2" style="padding-bottom: 32rpx;">咨询人</view>
				<view class="from-block">
					<u--form labelPosition="left" :model="form" :rules="rules" ref="uForm">
						<!-- 	<u-form-item label="姓名" prop="form.name" borderBottom ref="item1">
							<u--input v-model="form.name" fontSize="28rpx" color="#333" border="none"></u--input>
						</u-form-item> -->
						<u-form-item label="性别" prop="form.gender" borderBottom ref="item1">
							<u-radio-group class="radio-block" v-model="form.gender" activeColor="#3B7EFF"
								labelSize="28rpx" labelColor="#333" placement="row">
								<u-radio shape="circle" :customStyle="{marginRight: '30rpx'}" label="男" name="1"></u-radio>
								<u-radio shape="circle" :customStyle="{marginRight: '30rpx'}" label="女" name="0"></u-radio>
							</u-radio-group>
						</u-form-item>
						<u-form-item label="年龄" prop="form.age" borderBottom @click="showAge = true;"
							ref="item1">
							<u--input v-model="form.ageName" disabled disabledColor="#ffffff" placeholder="请选择年龄"
								border="none"></u--input>
							<u-icon slot="right" name="arrow-right"></u-icon>
						</u-form-item>
						<u-form-item label="病情描述" prop="form.description" labelPosition="top" borderBottom
							labelWidth="200rpx">
							<view style="padding-top: 24rpx;">
								<u--textarea class="def-textarea" fontSize="28rpx" color="#333"
									v-model="form.description" maxlength="500" placeholder="请输入内容" count></u--textarea>
							</view>
						</u-form-item>
						<u-form-item label="上传历史报告或检查图片(选填)" prop="form.imgs" labelPosition="top" labelWidth="100%">
							<view class="form-file-msg">最多可上传<text class="base-font-color">3张</text> 每张图片大小不超过<text
									class="base-font-color">10M</text></view>
							<upload multiple :maxCount="3" :value="form.imgs" @change="changeImgs"></upload>
						</u-form-item>
					</u--form>
					<view style="padding: 60rpx 32rpx;">
						<view class="btn-bim" @click="submitForm">确定</view>
						<u-picker :show="showAge" ref="uPicker" :columns="columnsAge" defaultIndex="33" keyName="label"
							@confirm="confirmAge" confirmColor="#3B7EFF" title="选择年龄"></u-picker>
					</view>
				</view>
			</view>
		</scroll-view>
	</view>
</template>

<script>
	import upload from '@/pagesC/components/upload/upload.vue'
	import {
		editConsultationApi
	} from '../../api/chat'
	let ecl = null
	export default {
		components: {
			upload
		},
		data() {
			return {
				form: {
					description: ''
				},
				rules: {},
				fileList: [],
				columnsAge: [],
				showAge: false
			}
		},
		onLoad() {
			ecl = this.getOpenerEventChannel()
			this.setColumnsAge()
			ecl.on('form', (form) => {
				console.log(form);
				const {
					age
				} = form
				this.form = {
					...form,
					ageName: age + '岁'
				}
			})
		},
		methods: {
			setColumnsAge() {
				let columnsAge = [
					[]
				]
				for (let i = 1; i < 120; i++) {
					columnsAge[0].push({
						label: i + '岁',
						id: i
					})
				}
				console.log(columnsAge);
				this.columnsAge = columnsAge
			},
			async submitForm() {
				const params = {
					...this.form
				}
				uni.showLoading({
					title: '正在修改',
					mask: true
				})
				const res = await editConsultationApi(params)
				uni.hideLoading()
				if (!res || res.code !==200) return
				ecl.emit('change', { ...this.form })
				uni.navigateBack({
					delta: 1
				})
			},
			confirmAge(event) {
				console.log(event);
				const {
					value
				} = event
				this.form.age = value[0].id
				this.form.ageName = value[0].id + '岁'
				this.showAge = false
			},
			changeImgs (event) {
				console.log(event);
				this.form.imgs = event
			}
		}
	}
</script>

<style lang="scss">
	.wrapper {
		height: 100vh;
		display: flex;
		flex-direction: column;
	}

	.page-content {
		flex: 1;
		overflow: hidden;
	}

	.from-block {
		padding: 4rpx 32rpx 32rpx;
		border-radius: 20rpx;
		background-color: #fff;
	}

	.u-textarea {
		background-color: #F8F8F8 !important;
	}

	.u-textarea__count {
		background-color: #F8F8F8 !important;
	}

	.form-file-msg {
		color: #999;
		font-size: 24rpx;
	}

	.btn-bim {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 80rpx;
		font-size: 36rpx;
		color: #fff;
		font-weight: 500;
		background: linear-gradient(135deg, #00DEFF 0%, #0C5FFF 100%);
		border-radius: 80rpx;
	}
</style>