<template>
	<view>
		<z-paging ref="paging">
			<template #top>
				<u-navbar title="基因派" :placeholder="true" border>
					<view class="u-nav-slot" slot="left">
						<u-icon name="arrow-left" @click="onBack" size="19"></u-icon>
						<u-line direction="column" :hairline="false" length="16" margin="0 8px"></u-line>
						<u-icon name="home" size="20" @click="onHome"></u-icon>
					</view>
				</u-navbar>
			</template>
			<view class="content">
				<view class="base-block">
					<view class="h1">请选择检测结果</view>
					<view class="">
						<ridioDb :value.sync="model.userRes" :options="dict.type.sys_detection_result"></ridioDb>
					</view>
					<view class="h1" style="padding-top: 40rpx;">上传检测结果照片</view>
					<view class="flex">
						<upload multiple uploadIcon="photo-fill" :maxCount="1" width="160rpx" height="160rpx" :value="model.imgs"
							@change="changeImgs"></upload>
						<view @click="showPreviewImage('https://genepiapi.ypzlfx.com/file/genepi/2023/12/11/KoxywfGJLiZldf692f5d7d9f8ab0d7c890a16163b61d_20231211155509A156.jpg')" class="relative" style="padding: 0 8px 8px 0;">
							<u--image src="https://genepiapi.ypzlfx.com/file/genepi/2023/12/11/KoxywfGJLiZldf692f5d7d9f8ab0d7c890a16163b61d_20231211155509A156.jpg" width="160rpx" height="160rpx"></u--image>
							<view class="slt-box flex jc-c-c">示例图 <image style="width: 24rpx;height: 24rpx; margin-left: 6rpx;" src="https://genepiapi.ypzlfx.com/file/genepi/2023/12/11/kkGyWBJJmj2k168993a2d2dccd0056ca15e5d94dee42_20231211093103A836.png" mode="widthFix"></image> </view>
						</view>
					</view>
				</view>
			</view>
			<template #bottom>
				<view style="padding: 60rpx 32rpx;">
					<view class="btn-bim" @click="submitForm">提交</view>
				</view>
			</template>
		</z-paging>
	</view>
</template>

<script>
	import upload from '@/pagesC/components/upload/upload.vue';
	import {
		uploadresult
	} from '@/api/cancer-screening';
	import ridioDb from '../ridio-db/ridio-db.vue'
	export default {
		dicts: ['sys_detection_result'],
		components: {
			ridioDb,
			upload
		},
		data() {
			return {
				optionJc: [{
						label: '阴性',
						value: '0'
					},
					{
						label: '阳性',
						value: '1'
					},
					{
						label: '不清楚',
						value: '2'
					},
				],
				model: {
					kitid: '20231206',
					userRes: '',
					imgs: ''
				}
			};
		},
		methods: {
			changeImgs(event) {
				console.log(event);
				this.model.imgs = event
			},
			onBack () {
				uni.navigateBack({
					delta: 1
				})
			},
			onHome () {
				uni.redirectTo({
					url: '/pages/index/index'
				})
			},
			async submitForm() {
				uni.showLoading({
					title: '正在上传...',
					mask: true
				})
				const res = await uploadresult(this.model)
				uni.hideLoading()
				if (!res || res.code !== 200) return
				uni.redirectTo({
					url: '/pagesC/cancer-screening/succes/succes'
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
.slt-box {
	position: absolute;
	left: 0;
	right: 8px;
	bottom: 8px;
	font-size: 24rpx;
	color: #3B7EFF;
	padding: 12rpx;
	text-align: center;
	background-color: #EBF2FF;
}
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
</style>