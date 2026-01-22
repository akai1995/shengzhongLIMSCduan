<template>
    <z-paging 
        ref="pagingRef" v-show="!!!fileValue" class="page" :paging-style="{ backgroundColor: '#F7F8FA' }" v-model="dataList" @query="queryList"
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
		<ut-components ref="utComponents" />
        <view class="content">
            <view class="ocrImgBox">
                <view class="ocrImg"> <image :src="info.imgPath" /> </view>
            </view>
            <view class="datail">
                <view v-html="assistantContent(info.content)"></view>
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
import { md, initMd, mdRenderHtml } from '@/providers/utilities/chat';
export default {
    props: {
        /** 图片资源地址 */
        info: {
            type: Object,
            default: () => {
                return {
                    title: '',
                    filePath: '',
                    content: ''
                }
            }
        },
    },
	data() {
		return {
			dataList: [], firstLoaded: false,
			/**
			 * 使用markdown的引用
			 */
			useMarkdown: null,
		};
	},
	mounted() {
		setTimeout(() => {
			this.useMarkdown = initMd(md)
		    // this.$refs.pagingRef && this.$refs.pagingRef.refresh();
		}, 250);
	},
	methods: {
		queryList(pageNo, pageSize) {
			this.$refs.pagingRef.endRefresh()
		},
		assistantContent(content) {
			if (!content) return '';
			return mdRenderHtml(content, this.useMarkdown);
		},
        onClose(isAll=false) { this.$emit('close', isAll); },
        onSave() { this.onClose(true) },
        onCopy() { this.$emit('copy') }
	},
};
</script>
<style lang="scss" scoped>
.content{
	padding: 32rpx;
	.ocrImgBox {
        width: 100%;
        margin: 32rpx 0;
        display: flex;
        align-items: center;
        justify-content: flex-end;
		.ocrImg{
			width: 240rpx;
            height: 320rpx;
            overflow: hidden;
            border-radius: 8rpx;
            image {
                width: 100%;
                height: 100%;
            }
		}
	}
    .datail {
        padding: 20rpx;
    }
}
    
/*共用底部按钮*/
.pubBotBtn {
	background: #fff;
    padding: 20rpx;
    display: flex;
    align-items: center;
    justify-content: space-between;
	.wrap {
        padding: 0;
        width: 100%;
	}
}
</style>