<style lang="scss" scoped>
@import './asserts/ocr-recognition.scss';
</style>

<template>
    <view>
        <ut-cropper 
            v-if="fileValue" :choosable="false" :width="1200" :height="1600" 
            :src="fileValue" @close="onCropperClose" @crop="onCrop"
        >
            <view class="slotCropper">可拖动边线裁剪识别区域</view>
        </ut-cropper>
        <ocr-result v-if="fileValue&&info.detail" :info="info" @close="onResultClose" />
        <ocr-result-log v-if="showOcrResultLog" @close="onOcrResultLogClose" />
        <z-paging 
            ref="paging" v-show="!!!fileValue&&!showOcrResultLog" class="page" :paging-style="{ backgroundColor: '#F7F8FA' }" v-model="dataList" @query="queryList"
            :fixed="true" :auto="false" :refresher-enabled="false" :auto-show-back-to-top="true" :auto-scroll-to-top-when-reload="false"
            :loading-more-enabled="false" :show-refresher-when-reload="false" hide-empty-view
        >
            <view slot="top">
                <u-navbar 
                    title="图文识别" :fixed="false" background="transparent" color="#000" left-icon-color="#000"
                    @leftClick="onBack"
                />
            </view>
            <view class="content">
                <view class="tipBox">
                    <view class="tipTitle">上传图片</view>
                    <view class="tipTitle">帮您<text class="tipBb">OCR智能识别提取文字</text></view>
                    <view class="subTip">您可以上传需要识别的图片，我们将为您智能识别提取文字信息~</view>
                    <view class="imgBox">
                        <view class="scanBox">
                            <image :src="`${$staticPath}temp/imgs/ocr-icon.png`" />
                        </view>
                        <view class="scanTip">请上传图文清晰的图片</view>
                    </view>
                </view>
            </view>
            <view slot="bottom" class="pubBotBtn pubTopLine">            
                <view class="wrap">
                    <view class="btn icon-history" @click="onOcrResultLogShow()">
                        <u-icon :name="`${$staticPath}temp/imgs/icon-history.png`" size="45rpx" />
                    </view>
                </view>
                <view class="wrap">
                    <view class="btn" @click="onChoose('album')">
                        <u-button type="primary" size="small" text="相册上传" />
                    </view>
                    <view class="btn" @click="onChoose('camera')">
                        <u-button type="primary" size="small" text="拍照上传" />
                    </view>
                </view>
            </view>
        </z-paging>
    </view>
</template>

<script>
import { chooseFile } from './utils'
import ocrResult from './ocr-result.vue'
import ocrResultLog from './ocr-result-log.vue'
export default {
    components: {
        'ocr-result': ocrResult,
        'ocr-result-log': ocrResultLog
    },
	data() {
		return {
			dataList: [], firstLoaded: false,
            fileList: [], fileValue: '', info: {
                imgPath: '', content: ''
            },
            showOcrResultLog: false,
		};
	},
	mounted() {
		setTimeout(() => {
		    this.$refs.paging && this.$refs.paging.refresh();
		}, 250);
	},
	methods: {
        onOcrResultLogShow() {
            this.showOcrResultLog = true
        },
        onOcrResultLogClose() {
            this.showOcrResultLog = false
        },
		queryList(pageNo, pageSize) {
			this.$refs.paging.endRefresh()
            // this.$refs.paging.complete()
            // this.firstLoaded = true;
            uni.hideLoading();
		},
        onChoose(sourceType){
            chooseFile(
                Object.assign({
                    accept: 'media',
                    multiple: false,
                    capture: [sourceType],
                    compressed: true,
                    maxDuration: 60,
                    sizeType: uni.$u.props.upload.sizeType,
                    camera: 'back',
                }, {
                    maxCount: 1,
                })
            )
            .then((res) => {
                console.log('res[0]', res[0])
                this.fileList = res
                this.fileValue = res[0].tempFilePath || 'https://ask.dcloud.net.cn/uploads/avatar/001/67/43/81_avatar_max.jpg'
            })
            .catch((error) => {
                this.$emit('error', error);
            });
        },
        onCropperClose() {
            this.fileList = []
            this.fileValue = ''
            this.info = {
                imgPath: '',
                content: ''
            }
        },
        onCrop(e) {
            // uni.previewImage({
            //     urls: [e.tempFilePath],
            //     current: 0
            // });
            uni.showLoading({ title: '识别中...', mask: true });
            this.info = {
                imgPath: e.tempFilePath,
                content: '主要发现 /n 右肺上叶检测到一个最大直径约15mm的实性肺结节，形态学特征提示需关注。'
            }
            console.log('this.info', this.info)
            uni.hideLoading()
        },
        onResultClose() {
            this.info = {
                imgPath: '',
                content: ''
            }
        }
	},
};
</script>