<template>
	<view style="padding: 16rpx 0;">
		<u-upload :width="width" :height="height" :fileList="fileList" :uploadIcon="uploadIcon" :uploadText="uploadText" @afterRead="afterRead" @delete="deletePic"
			:multiple="multiple" :maxCount="maxCount"></u-upload>
	</view>
</template>

<script>
	import upload from '@/utils/upload'
	export default {
		props: {
			value: {
				type: String,
				default: ''
			},
			maxCount: {
				type: Number,
				default: 1
			},
			width: {
				type: String,
				default: '140rpx'
			},
			height: {
				type: String,
				default: '140rpx'
			},
			multiple: {
				type: Boolean,
				default: true
			},
			uploadText: {
				type: String,
				default: '上传'
			},	
			uploadIcon: {
				type: String,
				default: 'camera-fill'
			},
		},
	
		data() {
			return {
				fileList: []
			}
		},
		watch: {
			value: function (ov) {
				if (ov) {
					console.log(ov);
					const list = ov.split(',')
					this.fileList = list.map(item => ({
						url: item
					}))
				}
			}
		},
		methods: {
			// 删除图片
			deletePic(event) {
				this[`fileList${event.name}`].splice(event.index, 1)
				const imgs = this.fileList.map(({ url }) => url).join(',')
				this.$emit('change', imgs)
			},
			// 新增图片
			async afterRead(event) {
				// 当设置 multiple 为 true 时, file 为数组格式，否则为对象格式
				const files = event.file;
				const promises = files.map(({ url }) => upload({
					filePath: url,
					url: '/file/upload'
				}))
				Promise.all(promises).then(res => {
					console.log(res);
					res.forEach(({ code, data }) => {
						if (code === 200) {
							this.fileList.push(data)
						}
					})
					const imgs = this.fileList.map(({ url }) => url).join(',')
					this.$emit('change', imgs)
				})
			},
		}
	}
</script>

<style>
</style>