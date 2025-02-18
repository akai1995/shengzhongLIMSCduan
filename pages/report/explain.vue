<template>
	<view>
		<ut-nav title="报告自助查询" border></ut-nav>

		<view class="content">
			<view class="title">基因检测报告单上传 <text>查看示例</text> </view>
			<view class="box m-t2">
				<view class="box-item" @click="openImage" v-if="false">
					<view v-if="photoBase64.length > 0" class="flex j-c-c width">
						<text class="close" @click.stop="photoBase64 = ''">
							<!-- <u-icon name="close" color="#f00" size="24"></u-icon> -->
						</text>
						<image class="img" :src='photoBase64.replace(/[\r\n]/g, "")'></image>
					</view>
					<view v-if="photoBase64.length == 0" class="flex j-c-c wrap" style="align-items: initial;">
						<u-icon name="camera" color="#999" size="60"></u-icon>
						<text class="text width">拍照/相册上传报告</text>
					</view>
				</view>
				<view class="box-item" @click="$ut.jump('/pagesB/report/upload')">
					<u-icon name="download" color="#999" size="60"></u-icon>
					<text class="text width">选择我的报告单</text>
				</view>
			</view>
			<u--form class="m-t4" v-model="form" ref="uForm" errorType="toast">
				<u-form-item v-if="false" label="解读医生" labelWidth="150rpx" borderBottom prop="doctorName" @click="$ut.jump('/pagesB/report/expert')">
					<u-input v-model="form.doctorName" required readonly border="none" placeholder="请选择" />
				</u-form-item>
				<u-form-item label="报告名称" labelWidth="150rpx" borderBottom prop="projectName">
					<u-input class="input" v-model="form.projectName"  border="none" disabled />
				</u-form-item>
				<u-form-item label="检测单位" labelWidth="150rpx" borderBottom prop="inspectionHospital">
					<u-input class="input" v-model="form.inspectionHospital"  border="none" disabled />
				</u-form-item>
				<u-form-item label="检测时间" labelWidth="150rpx" borderBottom prop="inspectionTime" @click="showBirthday = true">
					<u-input class="input" v-model="form.inspectionTime" readonly border="none" disabled />
					<u-datetime-picker :show="showBirthday" v-model="defaultTime" mode="datetime" @cancel='showBirthday=false'
						@confirm='confirmBirthday' :minDate="minDate" v-if="false"></u-datetime-picker>
				</u-form-item>
				<u-form-item label="确诊疾病" labelWidth="150rpx" borderBottom prop="diagnosisDisease">
					<u-input class="input" v-model="form.fdDiagnosis"  border="none" disabled />
				</u-form-item>
				<u-form-item label="检测结果" labelWidth="150rpx" borderBottom prop="fdDiagnosis">
					<u-input class="input" v-model="form.reportResult"  border="none" disabled />
				</u-form-item>
			</u--form>
			<view class="clause m-t4"  v-if="false">
				<u-checkbox-group class="check" v-model="checked">
					<u-checkbox name="ok" shape="circle" activeColor="#3B7EFFFF"></u-checkbox>
				</u-checkbox-group>
				<view class="text">
					<text class="grey">我确认所提交的信息准确无误，并同意将基因检测报告单进行上传，详情阅读</text>
					<text class="blue">《基因检测报告单上传知情同意书签署》</text>
					<text class="grey">并签字。</text>
				</view>
			</view>
			<view class="btn m-t4" @click="submit">确定</view>
		</view>
	</view>
</template>

<script>
	import {reportAnalysisApplyByPhoto,reportAnalysisApplyByReport} from '@/api/report.js'
	export default {
		data() {
			return {
				photoBase64:'',
				form: {},
				checked: [],
				showBirthday:false,
				minDate:'',
				defaultTime: Number(new Date("1965-01-01")),
			};
		},
		onLoad(options) {
			this.minDate = new Date("2020-01-01").getTime()
		},

		methods: {
			openImage() {
				var this_ = this
				uni.chooseImage({
					count: 1,
					sizeType: ['compressed'],
					sourceType: ['album', 'camera'],
					success: function(res) {
						// console.log('res',res)
						uni.getFileSystemManager().readFile({
							filePath:res.tempFilePaths[0],
							encoding:'base64',
							success:ress=>{
								// console.log("base64数据：",'data:image/png;base64,'+ress.data)
								this_.photoBase64 = 'data:image/png;base64,'+ress.data
							}
						})
					}
				})
			},
			confirmBirthday(e){
				console.log('e',e)
				this.showBirthday = false
				const timeFormat = uni.$u.timeFormat;
				this.form.inspectionTime = timeFormat(e.value, 'yyyy-mm-dd hh:ss');
			},
			submit() {
				uni.showLoading()
				if(this.checked.length==0){
					// this.$ut.showText('请先阅读并勾选协议')
					// return
				}
				if(this.photoBase64){
					let params = {
						diagnosisDisease:this.form.fdDiagnosis,
						inspectionHospital:this.form.inspectionHospital,
						inspectionTime:this.form.inspectionTime,
						reportResult:this.form.reportResult,
						photoBase64:[this.photoBase64],
						title:this.form.projectName,
						doctorId: this.form.doctorId,
						doctorName: this.form.doctorName
					}
					reportAnalysisApplyByPhoto(params).then(res=>{
						uni.hideLoading()
						if(res.code == 200){
							this.$ut.showText('提交成功')
							setTimeout(()=>{
								uni.navigateBack()
							},2000)
						}
					})
				}else{
					let parmas = {
						reportId:this.form.id,
						diagnosisDisease:this.form.fdDiagnosis,
						inspectionHospital:this.form.inspectionHospital,
						inspectionTime:this.form.inspectionTime,
						reportResult:this.form.reportResult,
						title:this.form.projectName,
						doctorId: this.form.doctorId,
						doctorName: this.form.doctorName
					}
					reportAnalysisApplyByReport(parmas).then(res=>{
						uni.hideLoading()
						if(res.code == 200){
							this.$ut.showText('提交成功')
							setTimeout(()=>{
								uni.navigateBack()
							},2000)
						}
					})
				}
			},
		}
	}
</script>

<style lang="less">
	page {
		background: #fff;
	}

	.title {
		color: #000;
		font-size: 34rpx;
		font-weight: 600;

		text {
			margin-left: 20rpx;
			font-size: 24rpx;
			color: #0C5FFF;
		}
	}

	.box {
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: space-between;

		&-item {
			width: 48%;
			height: 240rpx;
			background: #F8F8F8FF;
			// padding: 30rpx;
			// box-sizing: border-box;
			display: flex;
			flex-wrap: wrap;
			justify-content: center;
			position: relative;

			.text {
				color: #C6C6C6FF;
				font-size: 24rpx;
				text-align: center;
			}
			
			.img{
				width: 100%;
				height: 100%;
			}
			
			.close{
				position: absolute;
				top: 10rpx;
				right: 30rpx;
				z-index: 1;
				width: 20rpx;
				height: 20rpx;
				&::after{
					content: 'X';
					color: #f00;
					font-size: 40rpx;
				}
			}
		}
	}

	.clause {
		display: flex;
		align-items: flex-start;
		justify-content: center;
		font-size: 24rpx;

		.check {
			width: 8%;
		}

		.text {
			width: 92%;
		}
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
	
	/deep/ .u-upload__button{
		margin: 0;
	}
</style>