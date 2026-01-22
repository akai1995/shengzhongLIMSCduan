<template>
	<view class="page">
		<!-- 预览图片 -->
		<swiper class="swiper" style="width:100%;height:calc(100vh - 44px);margin:0 auto;" v-if="[1,'1'].includes(fileType)">
			<swiper-item v-for="(item,idx) in imageList" :key="`key_${idx}`">
				<image :src="item" style="width:100%;height:100%;" mode="aspectFit" />
			</swiper-item>
		</swiper>
		<!-- 预览文件 -->
		<web-view :webview-styles="webviewStyles" :src="src" v-if="[2,'2'].includes(fileType)" />
		<!-- 预览视频 -->
		<view class="video-detail-page" v-if="[3,'3'].includes(fileType)"><view class="video-box"><video :src="fileUrl" controls /></view></view>
	</view>
</template>

<script>
export default {
	name: 'ss-preview',
	props: {
		fileUrl: { type: String, default: '' },
		/* 1.预览图片; 2.预览文件; 3.预览视频 */
		fileType: { type: String, default: '' },
		/* 预览图片; 可以预览多张 */
		imageList:{ type: Array, default:()=>{ return [] } },
	},
	data() {
		return { webviewStyles: { progress: { color: '#FF3333' } }, src: '' };
	},
	watch: {
		fileType: {
			deep: true, immediate: true,
			handler: (value) => {
					if (value === '2') { /* 预览文档 */
					// #ifdef APP-PLUS || H5
					this.previewPdf(this.fileUrl)
					// #endif
					// #ifdef MP-WEIXIN
					this.previewWechat(this.fileUrl)
					// #endif
				}
			}
		}
	},
	methods: {
		//微信小程序预览文档,可预览.doc,.docx,.xls,.xlsx,.pdf等文件
		previewWechat(urlPdf) {
			uni.showLoading({ title: '正在加载中...', mask: true })
			uni.downloadFile({
				url: urlPdf,
				success: (res) => {
					const filePath = res.tempFilePath;
					uni.openDocument({
						filePath: filePath, showMenu: true,
						success: (res) => {
							console.log('打开文档成功');
							uni.hideLoading()
						},
					});
				},
				complete: (r) => {
					uni.hideLoading()
				}
			});
		},
		//APP，H5预览文档图片和视频，微信小程序预览图片和视频
		previewPdf(value) {
			this.src = `/hybrid/html/pdf-reader/index.html?file=${encodeURIComponent(value)}`;		
		},
	}
}
</script>

<style lang="scss" scoped>
	.page {
		height: 100%;

		.video-detail-page {
			width: 100%;

			uni-video {
				width: 100%;
			}

			video {
				width: 100%;
			}
		}
	}
</style>
