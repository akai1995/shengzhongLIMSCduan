<style lang="less" scoped>
@import './asserts/ocr-result-log.less';
</style>

<template>
    <z-paging 
        ref="zPagingRef" v-show="!!!fileValue" class="page" :paging-style="{ backgroundColor: '#F7F8FA' }" v-model="dataList" @query="queryList"
        :fixed="true" :auto="false" :auto-show-back-to-top="true" :enable-back-to-top="true" :show-refresher-when-reload="detailInfo?false:true" 
        :auto-scroll-to-top-when-reload="false" :auto-clean-list-when-reload="detailInfo?false:true" :safe-area-inset-bottom="true"
        :hide-empty-view="detailInfo?true:false" :refresher-enabled="detailInfo?false:true" :loading-more-enabled="detailInfo?false:true" empty-view-text="暂无数据"
    >
        <view slot="top" style="z-index: 999;">
            <u-navbar 
                :title="detailInfo?'识别记录详情':'识别记录'" :fixed="false" background="transparent" 
                color="#000" left-icon="close" left-icon-color="#000" 
                @leftClick="onClose" 
            />
        </view>
        <view class="content" v-if="detailInfo">
            <view class="ocrImgBox" v-if="detailInfo.imgPath">
                <view class="ocrImg">
                    <image :src="detailInfo.imgPath" />
                </view>
            </view>
            <view class="datail">
                {{ detailInfo.content }}
            </view>
        </view>
        <view class="content" v-else>
			<view class="luBox">
            	<u-skeleton v-if="!firstLoaded&&dataList.length === 0" rows="10" title loading />
      			<project-ocr-result-log-item v-for="item,idx in dataList" :key="item.id" :item="item" :hideLine="dataList.length-1==idx" @toggle="onToggle" @view="onView" />
            </view>
        </view>
        <view slot="bottom">
            <view class="botHandle pubTopLine" v-if="!detailInfo">
                <view class="wrap">
                    <view class="checkbox">
                        <u-checkbox-group v-model="isAllSelect" :disabled="allDisabled" size="small" @change="checkAllChange">
                            <u-checkbox name="全选" shape="circle" size="small" activeColor="#3B7EFFFF"></u-checkbox>
                        </u-checkbox-group>
                    </view>
                    <view class="removeBtn" @click="remove()">
                        <u-button size="small" type="error" plain text="删除" />
                    </view>
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
                    detail: ''
                }
            }
        },
    },
	data() {
		return {
            isAllSelect: [], dataList: [], firstLoaded: false,
            detailInfo: null
		};
	},
    computed: {
        allDisabled() {
            return this.dataList.length==0
        }
    },
	mounted() {
		setTimeout(() => {
		    this.$refs.zPagingRef && this.$refs.zPagingRef.refresh();
		}, 250);
	},
	methods: {
		queryList(pageNo, pageSize) {
			this.$refs.zPagingRef.endRefresh()
            this.$refs.zPagingRef.complete(Array.from({ length: 5 }, (_, index) => { 
                return {
                    index: index+1,
                    imgPath: '',
                    content: '这是分析名称，这是分析名称，这是分析名称，这是分析名称（最多30个字符）',
                    date: '12-08 10:20:30',
                    checked: false
                }
            }))
            this.firstLoaded = true
            uni.hideLoading();
		},
        checkAllChange(values) { 
            console.log(values)
			if (this.dataList.length === 0) return;
			if (values.length>0) {
				this.dataList.forEach((sp) => {
                    this.$set(sp, 'checked', true)
				});
			} else {
				this.dataList.forEach((sp) => {
                    this.$set(sp, 'checked', false)
				});
			}
        },
        onToggle(item) {
            const cusChecked = !item.checked
            this.$set(item, 'checked', cusChecked)
            this.dataList.forEach((sp) => {
                this.$set(sp, 'checked', sp.index==item.index ? cusChecked : sp.checked)
            });
            const sel = this.dataList.filter((row)=> row.checked)
            this.isAllSelect = this.dataList.length == sel.length?['全选']:[]
        },
        onView(item) {
            this.detailInfo = item
        },
        onClose() {
            if (this.detailInfo) {
                this.detailInfo = null
            } else {
                this.$emit('close');
            }
        },
        remove() {
			if (this.dataList.length === 0) {
                uni.showToast({
                    title: '没有可以删除的记录',
                    icon: 'none'
                });
                return;
            }
            const values = this.dataList.filter((row)=> row.checked)
			if (values.length==0) {
                uni.showToast({
                    title: '没有选择记录',
                    icon: 'none'
                });
                return;
            }
            this.dataList = this.dataList.filter((row)=> !row.checked)
            uni.showToast({
                title: '删除成功',
                icon: 'none'
            });
            this.isAllSelect = []
        }
	},
};
</script>