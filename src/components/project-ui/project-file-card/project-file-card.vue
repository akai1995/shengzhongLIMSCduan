<template>
    <view class="fileBox" :class="[mode||'large', { border: border }]">
        <view class="fileIcon" @click="onView">
            <u-image :src="imageUrl" webp
                :showLoading="['waiting','uploading'].includes(file.status)"
                :width="mode=='large'?'56rpx':mode=='samll'?'48rpx':'50rpx'"
                :height="mode=='large'?'56rpx':mode=='samll'?'48rpx':'50rpx'"
            />
        </view>
        <view class="fileInfo" @click="onView"><view class="fileName">{{ file.name }}</view><view class="fileSummary">{{ typeName }}</view></view>
        <view class="fileIconClose" v-if="closable" @click="onClosable()"><u-icon class="fileIconClose" name="close" color="red" size="32rpx" /></view>
    </view>
</template>

<script>
/**
 * 获取文件扩展名，可控制大小写
 * @param {string} filename - 文件名
 * @param {boolean} toUpperCase - 是否转换为大写，默认false（小写）
 * @returns {string} 文件扩展名，无扩展名时返回空字符串
 */
function getFileExt(filename, toUpperCase = true) {
  // 1. 判空和类型检查
  if (!filename || typeof filename !== 'string') {
    console.warn('文件名必须是有效的字符串');
    return '';
  }
  
  // 2. 去除首尾空格
  const trimmedName = filename.trim();
  
  // 3. 空字符串检查
  if (trimmedName.length === 0) {
    return '';
  }
  
  // 4. 查找最后一个点号
  const lastDotIndex = trimmedName.lastIndexOf('.');
  
  // 5. 检查点号位置
  if (lastDotIndex === -1 || 
      lastDotIndex === 0 || 
      lastDotIndex === trimmedName.length - 1) {
    return '';
  }
  
  // 6. 提取扩展名
  const extension = trimmedName.slice(lastDotIndex + 1);
  
  // 7. 根据参数控制大小写
  return toUpperCase ? extension.toUpperCase() : extension.toLowerCase();
}

/**
 * 增强版（处理边缘情况）
 * @param {number} bytes - 文件大小
 * @param {number} decimals - 文件名
 */
function formatFileSize(bytes, decimals = 2) {
  // 输入验证
  if (typeof bytes !== 'number' || !isFinite(bytes) || bytes < 0) {
    return '0 B';
  }
  
  if (bytes === 0) return '0 B';
  
  const k = 1024;
  const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  
  // 对于小于1KB的情况特殊处理
  if (bytes < k) {
    return bytes + ' B';
  }
  
  // 计算单位
  const i = Math.min(
    Math.floor(Math.log(bytes) / Math.log(k)),
    units.length - 1
  );
  
  const size = bytes / Math.pow(k, i);
  
  // 判断是否为整数（考虑浮点数精度问题）
  const isInteger = Math.abs(size - Math.round(size)) < 0.00001;
  
  if (isInteger) {
    return Math.round(size) + ' ' + units[i];
  } else {
    // 非整数时保留指定小数位
    return size.toFixed(decimals) + ' ' + units[i];
  }
}
export default {
    props: {
        border: {
            type: Boolean,
            default: false
        },
        mode: {
            /* large default small */
            type: String,
            default: 'large'
        },
        closable: {
            type: Boolean,
            default: false
        },
        file: {
            type: Object,
            default: () => {
                return {
                    name: '', size: 0, type: '',
                    filePath: '', status: 'waiting'
                }
            }
        },
    },
    data() {
        return { };
    },
    computed: {
        typeName() {
            const { name } = this.file
            return getFileExt(name)
        },
        typeName() {
            const { name, status, size } = this.file
            const ext = getFileExt(name)
            let txt = ''
            switch(status) {
                case 'waiting':
                case 'uploading':
                    txt = '上传中...'
                    break;
                case 'analysis':
                    txt = '解析中...'
                    break;
                case 'success':
                case 'uploaded':
                    txt = `${ext} ${formatFileSize(size)}`
                    break;
                case 'fail':
                    txt = '上传失败'
                    break;
                default:
                    txt = '上传中...'
                    break;
            }
            return txt
        },
        imageUrl() {
            const { name, status, filePath } = this.file
            const ext = getFileExt(name, false)
            let icon = `${this.$staticPath}imgs/`
            switch(status) {
                case 'waiting':
                case 'uploading':
                    icon += 'ai-chat-loading.apng'
                    break;
                case 'analysis':
                    icon += 'ai-chat-loading.apng'
                    break;
                case 'success':
                case 'uploaded':
                    switch(ext) {
                        case 'jpg': case 'jpeg': case 'png': case 'webp':
                            /* icon = 'icon-img.png' */
                            console.log('imageUrl', filePath)
                            icon = this.$onlineFilePath + filePath.replace('/opt/upFiles/', '')
                            break;
                        case 'doc': case 'docx':
                            icon += 'icon-doc.png'
                            break;
                        case 'pdf':
                            icon += 'icon-pdf.png'
                            break;
                        case 'xls': case 'xlsx':
                            icon += 'icon-xlsx.png'
                            break;
                        case 'ppt': case 'pptx':
                            icon += 'ai-chat-loaded.apng'
                            break;
                        default:
                            icon += 'ai-chat-loaded.apng'
                            break;
                    }
                    break;
                case 'fail':
                    icon += 'ai-chat-loaded.apng'
                    break;
                default:
                    icon += 'ai-chat-loading.apng'
                    break;
            }

            return icon
        },
    },
    methods: {
        onView(){
            const _self = this
            const { name, filePath, status } = _self.file
            if (!['success','uploaded'].includes(status)) {
              return   
            }
            const ext = getFileExt(name, false)
            switch(ext) {
                case 'jpg': case 'jpeg': case 'png': case 'webp':
                    _self.showPreviewImage(_self.$onlineFilePath + filePath.replace('/opt/upFiles/', ''))
                    break;
                case 'doc': case 'docx':
                case 'pdf':
                case 'xls': case 'xlsx':
                case 'ppt': case 'pptx':
                    _self.$eUni.navTo({
                        url: '/sub-pack/tab1/chat-history-stream/preview',
                        query: {
                            ext, uri: _self.$onlineFilePath + filePath.replace('/opt/upFiles/', '')
                        }
                    })
                    break;
            }

        },
        onClosable() { this.$emit('del') },
    }
}
</script>

<style lang="scss" scoped>
.fileBox{
    width: 332rpx; height: 200rpx;
    position: relative;
    padding: 24rpx 32rpx 24rpx 112rpx;
    border-radius: 20rpx 4rpx 20rpx 20rpx;
    &.border { border: 1rpx solid #E6E9F1; }
    &.default{
        width: 280rpx; height: 110rpx;
        padding: 12rpx 20rpx 12rpx 80rpx;
        border-radius: 20rpx;
        .fileIcon {
            left: 16rpx; 
            width: 48rpx; height: 48rpx;
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
        padding: 12rpx 20rpx 12rpx 70rpx;
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
        left: 28rpx; top: 50%;
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
        }
        .fileSummary {
            color: #9699A1;
            font-weight: 400;
            font-size: 24rpx;
            line-height: 34rpx;
        }
    }
}
</style>
