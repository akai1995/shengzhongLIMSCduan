<template>
	<view>
		<ut-nav title="报告解读详情" border></ut-nav>
		<view class="content">
			<view class="flex j-c">
				<view class="title">{{data.applyTitle}}</view>
				<view class="tag red">未解读</view>
			</view>
			<view class="list m-t4">
				<view class="m-t2" v-if="data.inspectionHospital">检测单位：{{data.inspectionHospital}}</view>
				<view class="m-t2" v-if="data.inspectionTime">检测时间：{{data.inspectionTime}}</view>
				<view class="m-t2" v-if="data.diagnosisDisease">确诊疾病：{{data.diagnosisDisease}}</view>
				<view class="m-t2" v-if="data.reportResult">检测结果：{{data.reportResult}}</view>
			</view>
			<view class="m-t3" v-for="(item,index) in imgList" :key="index">
				<image class="width" @click="lookImg(index)" :src="item" mode="widthFix"></image>
			</view>
			<view class="suggest m-t2">
				<view class="title">诊断建议</view>
				<view class="text m-t2">
					<textarea class="textarea" style="overflow: auto" rows="5" v-model="suggest" placeholder="请输入诊断结果"
							  :adjust-position="false" :show-confirm-bar="false" @blur="blur" @focus="focusOn" :focus="focus" maxlength="150">
					</textarea>
				</view>
			</view>
		</view>
		<view>
			<view class="saveButton" @click="save">保存</view>
			<view class="submitButton" @click="submit">提交</view>
		</view>
	</view>
</template>

<script>
	import {
		reportAnalysisDetalis,
		analysis
	} from '@/api/report.js'
	export default {
		data() {
			return {
				data:{},
				imgList:'',
				suggest: '',
				focus: false, // 输入框自动聚焦
			};
		},
		onLoad(optins) {
			if(optins.id){
				this.init(optins.id)
			}
		},
		methods:{
			init(id){
				reportAnalysisDetalis(id).then(res=>{
					if(res.code == 200){
						this.data = res.data
						this.suggest = res.data.analysisContent
						this.imgList = res.data.reportUrl.split(',')
					}
				})
			},
			lookImg(index){
				uni.previewImage({
					urls:this.imgList,
					current:index
				})
			},
			blur() {
				this.focus = false;
			},
			save() {
				var params = {
					"id": this.data.id,
					"analysisContent": this.suggest,
					"status": "0"
				}
				analysis(params).then(res => {
					if (res.code == 200) {
						uni.$u.toast('保存成功')
						setTimeout(()=>{
							uni.navigateBack()
						},2000)
					} else {
						uni.$u.toast('保存失败')
					}
				})
			},
			submit() {
				var params = {
					"id": this.data.id,
					"analysisContent": this.suggest,
					"status": "1"
				}
				analysis(params).then(res => {
					if (res.code ==200) {
						this.$ut.showText('提交成功')
						setTimeout(()=>{
							uni.redirectTo({
								url: '/pagesB/report/read-doctor'
							})
						},2000)
					}

				})
			},
			focusOn() {
				this.$emit('focusOn');
			},
		}
	}
</script>

<style lang="less">
	page{
		background: #fff;
	}
	.tag{
		font-size: 24rpx;
		font-weight: 400;
		padding: 5rpx 15rpx;
		border-radius: 10rpx;
		display: inline-block;
	}
	.green{
		color: #00C777FF;
		background: #00C7771A;
	}
	.red{
		color: #FD5454FF;
		background: #FD54541A;
	}
	.title{
		color: #000;
		font-size: 32rpx;
		font-weight: 600;
	}
	.suggest{
		width: 92%;
		min-height: 200rpx;
		border-radius: 10rpx;
		background: #3B7EFF1A;
		padding: 30rpx;
		//box-sizing: border-box;
		.title{
			font-size: 28rpx;
			font-weight: 400;
		}
		.text{
			width: 100%;
			min-height: 150rpx;
			border-radius: 6rpx;
			background: #fff;
			color: #0C5FFFFF;
			font-size: 28rpx;
			font-weight: 400;
			line-height: 1.6;
			padding: 20rpx;
			box-sizing: border-box;
		}
		.label{
			color: #999;
			font-size: 24rpx;
			font-size: 400;
		}
	}
	.button {
		/*position: fixed;*/
		left: 70rpx;
		right: 70rpx;
		height: 80rpx;
		border-radius: 80rpx;
	    margin-top:5px;
		background: #3B7EFF1A;
		display: flex;
		align-items: center;
		justify-content: center;
		color: white;
		font-size: 36rpx;
		font-weight: 500;
		letter-spacing: 2rpx;
	}
	.submitButton {
		/*background: linear-gradient(135deg, #e5a7a7 0%, #ff0000 100%);*/
		width: 45%;
		height: 80rpx;
		border-radius: 80rpx;
		background: #e5a7a7;
		/*display: flex;*/
		align-items: center;
		justify-content: center;
		color: white;
		font-size: 36rpx;
		font-weight: 500;
		letter-spacing: 2rpx;
		display: inline-flex;
		margin-left: 1.5%;
	}
	.saveButton {
		/*background: linear-gradient(135deg, #00DEFF 0%, #0C5FFF 100%);*/
		width: 45%;
		height: 80rpx;
		border-radius: 80rpx;
		background: #3B7EFF1A;
		/*display: flex;*/
		align-items: center;
		justify-content: center;
		color: #3B7EFFFF;
		font-size: 36rpx;
		font-weight: 500;
		letter-spacing: 2rpx;
		display: inline-flex;
		margin-left: 4%;
		margin-right: 1.5%;
	}
	.bottom-box{
		position: fixed;
		left: 0rpx;
		bottom: 0rpx;
		z-index: 9;
		width: 100%;
		height: 120rpx;
		background: #fff;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.list{
		font-size: 28rpx;
		font-weight: 500;
		color: #222;
	}


</style>
