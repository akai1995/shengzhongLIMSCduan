<template>
    <view class="fileBox" :class="[mode||'large', { border: border }]">
        <view class="fileIcon" @click="onView">
            <u-loading-icon
                v-if="['waiting','uploading','analysis'].includes(file.status)"
                color="#3c9cff" :size="mode=='large'?'56rpx':mode=='samll'?'48rpx':'50rpx'"
            />
            <u-image 
                v-else :src="imageUrl" webp
                :showLoading="['waiting','uploading','analysis'].includes(file.status)"
                :width="mode=='large'?'56rpx':mode=='samll'?'48rpx':'50rpx'"
                :height="mode=='large'?'56rpx':mode=='samll'?'48rpx':'50rpx'"
            />            
        </view>
        <view class="fileInfo" @click="onView">
            <view class="fileName">{{ file.name }}</view>
            <view class="fileSummary" :style="styleName">{{ summaryName }}</view>
        </view>
        <view class="fileIconClose" v-if="closable" @click="onClosable()">
            <u-icon class="fileIconClose" name="close-circle-fill" color="red" size="32rpx" />
        </view>
    </view>
</template>

<script>
import { getFileExt, formatFileSize } from '@/providers/upload'
export default {
    props: {
        border: { type: Boolean, default: false },
        /* large default small */
        mode: { type: String, default: 'large' },
        closable: { type: Boolean, default: false },
        file: { type: Object, default: () => {
                return {
                    time: '', title: '',filePath: '',content: '',
                    type: '', uiid: '', name: '', size: 0, thumb: '',
                    status: 'waiting'
                }
            }
        }
    },
    data() { return { }; },
    computed: {
        styleName() {
            const { status } = this.file; let name = '';
            switch(status) {
                case 'waiting': case 'uploading': case 'analysis': name = 'color:#3c9cff'; break;
                case 'upload-fail': case 'fail': name = 'color:red'; break;
                case 'success': case 'uploaded': default: name = ''; break;
            }
            this.$forceUpdate()
            return name
        },
        imageUrl() {
            const _self = this; const { name, status, filePath } = _self.file;
            const ext = getFileExt(name, false); let icon = `${_self.$staticPath}imgs/`
            switch(status) {
                case 'waiting': case 'uploading': case 'analysis': icon += 'ai-chat-loading.apng'; break;
                case 'upload-fail': case 'fail': icon += 'ai-chat-loaded.apng'; break;
                case 'success': case 'uploaded': default:
                    switch(ext) {
                        case 'tif': case 'pjp': case 'jfif': case 'ico':
                        case 'tiff': case 'gif': case 'svg': case 'xbm':
                        case 'jxl': case 'jpeg': case 'svgz': case 'jpg':
                        case 'webp': case 'png': case 'bmp': case 'pjpeg':
                        case 'avif':
                            console.log('imageUrl', filePath);
                            if (filePath) {
                                icon = `${_self.$onlineFilePath}${filePath.replace('/opt/upFiles/', '')}`;
                            } else {
                                icon += 'ai-chat-loaded.apng'
                            }
                            break;
                        case 'doc': case 'docx': case 'txt': icon += 'icon-doc.png'; break;
                        case 'pdf': icon += 'icon-pdf.png'; break;
                        case 'csv': case 'xls': case 'xlsx': case 'xlsm': icon += 'icon-xlsx.png'; break;
                        case 'ppt': case 'pptx': icon += 'ai-chat-loaded.apng'; break;
                        default: icon += 'ai-chat-loaded.apng'; break;
                    }
                    break;
            }
            this.$forceUpdate()
            return icon
        },
        summaryName() {
            const { name, status, size } = this.file; const ext = getFileExt(name); let txt = '';
            switch(status) {
                case 'waiting': case 'uploading': txt = '上传中...'; break;
                case 'analysis': txt = '解析中...'; break;
                case 'upload-fail': txt = '上传失败'; break;
                case 'fail': txt = '系统服务异常'; break;
                case 'success': case 'uploaded': default: txt = `${ext} ${formatFileSize(size)}`; break;
            }
            console.log('summaryName', `name：${name}`, `status：${status}`, `txt：${txt}`);
            this.$forceUpdate()
            return txt
        },
    },
    methods: {
        onView() {
            const _self = this; const { name, filePath, status } = _self.file
            if (!['success','uploaded'].includes(status)) {
              return   
            }
            const ext = getFileExt(name, false)
            switch(ext) {
                case 'tif': case 'pjp': case 'jfif': case 'ico':
                case 'tiff': case 'gif': case 'svg': case 'xbm':
                case 'jxl': case 'jpeg': case 'svgz': case 'jpg':
                case 'webp': case 'png': case 'bmp': case 'pjpeg':
                case 'avif':
                    _self.showPreviewImage(`${_self.$onlineFilePath}${filePath.replace('/opt/upFiles/', '')}`)
                    break;
                case 'doc': case 'docx': case 'txt': case 'pdf':
                case 'csv': case 'xls': case 'xlsx': case 'xlsm':
                case 'ppt': case 'pptx':                    
                    uni.showLoading({ title: '正在加载中...', mask: true })
                    uni.downloadFile({
                        url: `${_self.$onlineFilePath}${filePath.replace('/opt/upFiles/', '')}`,
                        success: (res) => { const filePath = res.tempFilePath; uni.openDocument({ filePath: filePath, showMenu: true, success: (res) => { console.log('打开文档成功'); uni.hideLoading() } }); },
                        complete: (r) => { uni.hideLoading() }
                    });
                    /* _self.$eUni.navTo({ url: '/sub-pack/tab1/chat-stream/preview', query: { ext, uri: _self.$onlineFilePath + filePath.replace('/opt/upFiles/', '') } }) */
                    break;
            }

        },
        onClosable() { this.$emit('del') },
    }
}
</script>

<style lang="scss" scoped>
.fileBox{
    position: relative;
    width: 332rpx; height: 136rpx;
    padding: 20rpx 28rpx 20rpx 90rpx;
    border-radius: 20rpx 4rpx 20rpx 20rpx;
    &.border { border: 1rpx solid #E6E9F1; }
    &.default{
        width: 280rpx; height: 110rpx;
        padding: 12rpx 24rpx 12rpx 80rpx;
        border-radius: 20rpx;
        .fileIcon {
            left: 16rpx; 
            width: 42rpx; height: 42rpx;
        }
        .fileInfo {
            .fileName {
                font-size: 24rpx;
                line-height: 50rpx;
            }
            .fileSummary {
                font-size: 20rpx;
                line-height: 34rpx;
            }
        }
    }
    &.small {
        width: 250rpx; height: 110rpx;
        padding: 12rpx 24rpx 12rpx 70rpx;
        border-radius: 20rpx;
        .fileIcon {
            left: 12rpx; 
            width: 48rpx; height: 48rpx;
        }
        .fileInfo {
            .fileName {
                font-size: 22rpx;
                line-height: 48rpx;
            }
            .fileSummary {
                font-size: 20rpx;
                line-height: 34rpx;
            }
        }
        .fileIconClose{
            top: 12rpx; right: 12rpx; 
        }
    }
    .fileIcon {
        position: absolute;
        left: 18rpx; top: 50%;
        transform: translateY(-50%);
        width: 56rpx; height: 56rpx;
    }
    .fileIconClose{
        position: absolute;
        top: 16rpx; right: 16rpx; 
        width: 32rpx; height: 32rpx;
    }
    .fileInfo {
        .fileName {
            color: #222;
            font-weight: bold;
            font-size: 32rpx;
            line-height: 50rpx;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
		    text-align: left;
        }
        .fileSummary {
            color: #9699A1;
            font-weight: 400;
            font-size: 24rpx;
            line-height: 34rpx;
		    text-align: left;
        }
    }
}
</style>
