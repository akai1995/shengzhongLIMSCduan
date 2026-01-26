<template>
    <z-paging 
        ref="paging" class="page" :paging-style="{ backgroundColor: '#F7F8FA' }" v-model="dataList" @query="queryList"
        :fixed="true" :auto="false" :auto-show-back-to-top="true" :enable-back-to-top="true" :show-refresher-when-reload="false" 
        :auto-scroll-to-top-when-reload="false" :auto-clean-list-when-reload="false" :safe-area-inset-bottom="true"
        hide-empty-view :refresher-enabled="false" :loading-more-enabled="false"
    >
        <!-- <view slot="top"><u-navbar title="文件预览" :fixed="false" bgColor="transparent" color="#000" left-icon="close" left-icon-color="#000" @leftClick="onClose" /></view> -->
		<ut-components ref="utComponents" /><u-skeleton v-if="!firstLoaded&&dataList.length === 0" rows="16" title loading />
        <!-- <ss-preview fileType="2" :fileUrl="fileUrl" :file-list="imageList" /> -->
    </z-paging>
</template>

<script>
// import ssPreview from '@/uni_modules/ss-preview/components/ss-preview/ss-preview.vue'
export default {
    // components: { 'ss-preview': ssPreview },
	data() {
		return {
		    /* 1.预览图片，2.预览文件，3.预览视频 */
            fileType: 2, fileUrl: '', imageList: [], 
            dataList: [], totalCount: 0, firstLoaded: false,
		}
	},
    onLoad(query) { console.log(query); this.fileUrl = query.uri },
	mounted() { setTimeout(() => { this.$refs.paging && this.$refs.paging.refresh(); }, 250) },
	methods: {
		queryList(pageNo, pageSize) {
			this.$refs.paging.endRefresh()
            this.$refs.paging.complete(Array.from({ length: 8 }, (_, index) => { 
                return {
                    index: index+1, imgPath: '', date: '12-08 10:20:30', checked: false,
                    content: '这是分析名称，这是分析名称，这是分析名称，这是分析名称（最多30个字符）',                    
                }
            }))
            this.totalCount = 8
            this.firstLoaded = true
            uni.hideLoading();
		}
	}
};
</script>
<style lang="scss" scoped>
</style>