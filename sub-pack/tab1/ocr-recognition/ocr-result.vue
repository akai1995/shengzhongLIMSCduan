<style lang="less" scoped>
@import './asserts/ocr-result.less';
</style>

<template>
    <z-paging 
        ref="paging" v-show="!!!fileValue" class="page" :paging-style="{ backgroundColor: '#F7F8FA' }" v-model="dataList" @query="queryList"
        :fixed="true" :auto="false" :refresher-enabled="false" :auto-show-back-to-top="true" :auto-scroll-to-top-when-reload="false"
        :loading-more-enabled="false" :show-refresher-when-reload="false" hide-empty-view
    >
        <view slot="top" style="z-index: 999;">
            <u-navbar 
                title="图文识别" :fixed="false" background="transparent" 
                color="#000" left-icon="close" left-icon-color="#000" 
                @leftClick="onClose" 
            />
        </view>
        <view class="content">
            <view class="ocrImgBox">
                <view class="ocrImg">
                    <image :src="info.imgPath" />
                </view>
            </view>
            <view class="datail">
                {{ info.content }}
            </view>
        </view>
        <view slot="bottom" class="pubBotBtn pubTopLine">
            <view class="wrap">
                <view class="btn" @click="onClose()">
                    <u-button size="small" text="撤销" />
                </view>
                <view class="btn" @click="onSave()">
                    <u-button size="small" text="保存" />
                </view>
                <view class="btn" @click="onCopy()">
                    <u-button size="small" type="primary" plain text="复制" />
                </view>
            </view>
        </view>
    </z-paging>
</template>

<script>
export default {
    props: {
        /** 图片资源地址 */
        info: {
            type: Object,
            default: () => {
                return {
                    imgPath: '',
                    content: ''
                }
            }
        },
    },
	data() {
		return {
			dataList: [], firstLoaded: false,
		};
	},
	mounted() {
		// setTimeout(() => {
		//     this.$refs.paging && this.$refs.paging.refresh();
		// }, 250);
	},
	methods: {
		queryList(pageNo, pageSize) {
			this.$refs.paging.endRefresh()
            uni.hideLoading();
		},
        onClose() {
            this.$emit('close');
        },
        onSave() {
            uni.showToast({
                title: '保存成功',
                icon: 'none'
            });
        },
        onCopy() {
            uni.setClipboardData({
                data: this.info.detail,
                success: () => {
                    uni.showToast({
                        title: '复制成功',
                        icon: 'none'
                    });
                },
                fail: (err) => {
                    console.error('复制失败', err);
                }
            });
        }
	},
};
</script>