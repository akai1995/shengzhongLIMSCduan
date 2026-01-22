<template>
    <view>
        <ut-cropper 
            v-show="fileValue&&!info.imgPath" check-range :choosable="false" :width="1200" :height="1600" 
            :src="fileValue" @close="onCropperClose" @crop="onCropSave"
        >
            <view class="slotCropper">可拖动边线裁剪识别区域</view>
        </ut-cropper>
        <ocr-result v-if="fileValue&&info.imgPath" :info="info" @copy="onCopy" @close="onResultClose" />
        <ocr-result-log v-if="showOcrResultLog" @close="onOcrResultLogClose" />
        <z-paging 
            ref="paging" v-show="!!!fileValue&&!showOcrResultLog" class="page" :paging-style="{ backgroundColor: '#F7F8FA' }" v-model="dataList" @query="queryList"
            :fixed="true" :auto="false" :refresher-enabled="false" :auto-show-back-to-top="true" :auto-scroll-to-top-when-reload="false"
            :loading-more-enabled="false" :show-refresher-when-reload="false" hide-empty-view
        >
            <view slot="top">
                <u-navbar 
                    title="图文识别" :fixed="false" background="transparent"
                    color="#000" left-icon-color="#000" @leftClick="onBack"
                />
            </view>
            <view class="content">
                <view class="tipBox">
                    <view class="tipTitle">上传图片</view>
                    <view class="tipTitle">帮您<text class="tipBb">OCR智能识别提取文字</text></view>
                    <view class="subTip">您可以上传需要识别的图片，我们将为您智能识别提取文字信息~</view>
                    <view class="imgBox">
                        <view class="scanBox">
                            <image :src="`${$staticPath}imgs/ocr-icon.png`" />
                        </view>
                        <view class="scanTip">请上传图文清晰的图片</view>
                    </view>
                </view>
            </view>
            <view slot="bottom" class="pubBotBtn pubTopLine">            
                <view class="wrap">
                    <view class="btn icon-history" @click="onOcrResultLogShow()">
                        <u-icon :name="`${$staticPath}imgs/icon-history.png`" size="45rpx" />
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
import { ocrUploadFile, parseDoc, saveOcrInfo } from '@/app/api/common'
import { onChooseFile } from '@/providers/upload'
import ocrResultLog from './ocr-result-log.vue'
import ocrResult from './ocr-result.vue'

export default {
    components: { 'ocr-result': ocrResult, 'ocr-result-log': ocrResultLog },
	data() {
		return {
			dataList: [], firstLoaded: false, fileList: [],
            fileValue: '', info: { imgPath: '', content: '', filePath: '', title: '' },
            showOcrResultLog: false,
		};
	},
	mounted() { setTimeout(() => { this.$refs.paging && this.$refs.paging.refresh(); }, 250); },
	methods: {
        onOcrResultLogShow() { this.showOcrResultLog = true },
        onOcrResultLogClose() { this.showOcrResultLog = false },
		queryList(pageNo, pageSize) {
			this.$refs.paging.endRefresh()
		},
        onChoose(sourceType){
            const params = {
                accept: 'media', multiple: false, capture: [sourceType],
                compressed: true, maxDuration: 60, sizeType: uni.$u.props.upload.sizeType,
                camera: 'back', maxCount: 1,
            }
            onChooseFile(params).then((res) => {                
                console.log('res[0]', res[0]); this.fileList = res;
                ocrUploadFile({ filePath: res[0].thumb, formData: {
                    // biz: 'temp', file: res[0]
                }}).then((resp)=>{
                    if (resp.success) {
                        this.fileValue = `${this.$onlineFilePath}${resp.message}`
                        console.log('this.fileValue', this.fileValue)
                    } else {
                        this.showTips('上传异常', 'error');
                    }
                }).catch((error) => { 
                    console.error(error);
                    this.showTips('上传异常', 'error');
                })
            }).catch((error) => { console.error(error) });
        },
        onCropperClose() {
            this.fileList = []; this.fileValue = '';
            this.info = { title: '', imgPath: '', content: '' }
        },
        onCropSave(event) {
            console.log('onCropSave', event)
            const _self = this
            // uni.previewImage({ urls: [event.tempFilePath], current: 0 });
            uni.showLoading({ title: '识别中...', mask: true });
            ocrUploadFile({ filePath: event.url || event.tempFilePath, formData: {
                // biz: 'temp', file: event
            }}).then((resp)=>{
                console.log('onCropSave ocrUploadFile resp', resp.success, resp.message)
                if (resp.success) {
                    const cropPath = `${_self.$onlineFilePath}${resp.message}`
                    console.log('cropPath', cropPath)
                    parseDoc(resp.message).then((res)=>{
                    console.log('parseDoc res', res.success, res.data)
                    if (res.success) {
                        _self.info = Object.assign(_self.info, {...res.data,imgPath: cropPath})
                        console.log('_self.info', _self.info)
                    }
                    }).finally(()=>{
                        uni.hideLoading()
                    })
                } else {
                    _self.showTips('上传异常', 'error');
                }
            }).catch((error) => { 
                console.error(error);
                _self.showTips('上传异常', 'error');
            }).finally(() => {
                uni.hideLoading();
            });
        },
        onCopy() {
            uni.setClipboardData({
                data: this.info.content,
                success: () => { this.showTips('复制成功'); },
                fail: (err) => { this.showTips('复制失败', 'error'); }
            });
        },
        onResultClose(isAll) {
            if (isAll) {        
                uni.showLoading({ title: '保存中...', mask: true });        
                saveOcrInfo(this.info).then((res)=>{
                    console.log('saveOcrInfo', res);
                    if (res.success) {
                        this.showTips('保存成功'); this.fileValue = '';
                        this.info = { title: '', imgPath: '', filePath:'', content: '' }
                        this.showOcrResultLog = true
                    }             
                }).finally(()=>{
                    setTimeout(()=>{
                        uni.hideLoading()
                    }, 300)
                })
            }
            else {                
                this.info = { title: '', imgPath: '', filePath:'', content: '' }
            }
        }
	}
}
</script>
<style lang="scss" scoped>
.slotCropper {
	position: absolute !important;
	left: 0;
	right: 0;
	bottom: 170rpx;
	width: 100%;
	color:white;
	text-align: center;
	z-index: 999;
	font-size: 32rpx;
	font-weight: 400;
	line-height: 44rpx;
}

.content{
	padding: 32rpx;
	.tipBox {
		padding: 24rpx;
		@include background-image('imgs/ocr-bg.png');
		width: 686rpx; height: auto;
		box-sizing: border-box;
		border-radius: 12rpx;
		.tipTitle{
			font-size: 32rpx;
			line-height: 48rpx;
			font-weight: bold;
			color: #000;
			.tipBb{
				color: #0D70F3;
				margin-left: 8rpx;
			}
		}
		.subTip{
			margin: 16rpx 0;
			font-size: 24rpx;
			line-height: 34rpx;
			color: #535873;
		}
		.imgBox{
			background-color: white;
			border-radius: 24rpx;
			padding: 48rpx 48rpx;
			.scanBox {
				width: 100%;
				image {
					width: 100%;
				}
			}
			.scanTip{
				margin-top: 20rpx;
				font-size: 28rpx;
				line-height: 40rpx;
				color: #222;
				text-align: center;
			}
		}
	}
}
    
/*共用底部按钮*/
.pubBotBtn {
	background: #fff;
    padding: 4rpx 16rpx;
    display: flex;
    align-items: center;
    justify-content: space-between;
	.wrap {
        padding: 0;
		.icon-history {
			margin-left: 16rpx;
		}
	}
}
</style>