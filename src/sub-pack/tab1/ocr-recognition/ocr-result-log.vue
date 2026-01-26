<template>
    <z-paging 
        ref="pagingLog" class="page" :paging-style="{ backgroundColor: '#F7F8FA' }" v-model="dataList" @query="queryList"
        :fixed="true" :auto="false" :auto-show-back-to-top="true" :enable-back-to-top="true" :show-refresher-when-reload="detailInfo?false:true" 
        :auto-scroll-to-top-when-reload="false" :auto-clean-list-when-reload="detailInfo?false:true" :safe-area-inset-bottom="true"
        :hide-empty-view="detailInfo?true:false" :refresher-enabled="detailInfo?false:true" :loading-more-enabled="detailInfo?false:true"
        empty-view-text="暂无分析记录" :loading-more-no-more-text="`已加载完，共${totalCount}条记录`"
    >
        <view slot="top" style="z-index: 999;"><u-navbar  :title="detailInfo?'识别记录详情':'识别记录'" :fixed="false" background="transparent"  color="#000" left-icon="close" left-icon-color="#000"  @leftClick="onClose"  /></view>
		<!-- <ut-components ref="utComponents" /> -->
        <view class="content" v-if="detailInfo">
            <view class="ocrImgBox" v-if="detailInfo.filePath"><view class="ocrImg"><image :src="_self.$onlineFilePath + detailInfo.filePath.replace('/opt/upFiles/', '')" /></view></view>
            <view class="datail"><view v-html="assistantContent(detailInfo.content)"></view></view>
        </view>
        <view class="content" v-else>
			<view class="luBox">
            	<u-skeleton v-if="!firstLoaded&&dataList.length === 0" rows="10" title loading />
      			<project-ocr-result-log-item 
					v-for="(item,idx) in dataList" :key="item.id" :item="{ ...item,index:idx+1 }" 
					:hideLine="dataList.length-1==idx" @toggle="onToggle" @view="onView" 
				/>
            </view>
        </view>
        <view slot="bottom">
            <view class="botHandle pubTopLine" v-if="!detailInfo">
                <view class="wrap">
                    <view class="checkbox">
                        <u-checkbox-group v-model="isAllSelect" :disabled="allDisabled" size="small" @change="checkAllChange"><u-checkbox name="全选" shape="circle" size="small" activeColor="#3B7EFFFF"></u-checkbox></u-checkbox-group>
                        <text class="grey">全选</text>
                    </view>
                    <view class="removeBtn" @click="onRemove()"><u-button size="small" type="error" plain text="删除" /></view>
                </view>
            </view>
        </view>
    </z-paging>
</template>

<script>
import { md, initMd, mdRenderHtml } from '@/providers/utilities/chat';
import { getOcrInfoList, delOcrInfo } from '@/app/api/common'
export default {
	data() {
		return {
            isAllSelect: [], detailInfo: null, 
			queryParams: {pageNO:1,pageSize:10},
            dataList: [], totalCount: 0, firstLoaded: false,
			/**
			 * 使用markdown的引用
			 */
			useMarkdown: null,
		};
	},
    computed: { allDisabled() { return this.dataList.length==0 } },
	mounted() {
		setTimeout(() => {
			this.useMarkdown = initMd(md)
		    this.$refs.pagingLog && this.$refs.pagingLog.refresh();
		}, 250);
	},
	methods: {
		queryList(pageNo, pageSize) {
			this.queryParams.pageNO = pageNo
			this.queryParams.pageSize = pageSize
			const type = pageNo>1 ? 'search': ''
			getOcrInfoList(this.queryParams).then((resp) => {
				this.totalCount = resp&&resp.result?resp.result.total : 0 
				this.$refs.pagingLog.complete(resp&&resp.result?resp.result.records.map((row)=>({...row,checked:false})):false)
			}).catch(()=>{
				this.$refs.pagingLog.complete(false)
			}).finally(()=>{
				setTimeout(()=>{ this.firstLoaded = true; }, 1750)
			});
		},
        checkAllChange(values) {
			if (this.dataList.length === 0) return;
            this.dataList.forEach((sp) => { this.$set(sp, 'checked', values.length>0) });
        },
		assistantContent(content) {
			if (!content) return '';
			return mdRenderHtml(content, this.useMarkdown);
		},
        onToggle(item) {
			const _self = this;
			_self.$nextTick(()=>{
				const cusChecked = !item.checked; _self.$set(item, 'checked', cusChecked); console.log('toggle', cusChecked)
				_self.dataList.forEach((sp) => { _self.$set(sp, 'checked', sp.id==item.id ? cusChecked : sp.checked) });
				const sel = _self.dataList.filter(row=> row.checked); _self.isAllSelect = _self.dataList.length == sel.length?['全选']:[]
				console.log('toggle _self.dataList', _self.dataList.map(row=>row.checked))
			})
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
        onRemove() {
			const _self = this
			if (_self.dataList.length === 0) {
                _self.showTips('没有可以删除的记录', 'error');
                return;
            }
            const values = _self.dataList.filter((row)=> row.checked)
			if (values.length==0) {
                _self.showTips('没有选择记录', 'error');
                return;
            }
			uni.showLoading({ title: '删除中...', mask: true })
			delOcrInfo(values.map((row)=>row.id)).then((res)=>{
				if (res.success) {					
					_self.dataList = _self.dataList.filter((row)=> !row.checked)
					_self.showTips('删除成功', 'success');
					_self.isAllSelect = []
				}
			}).catch(err=>{
				
			}).finally(()=>{
				setTimeout(()=>{ uni.hideLoading() }, 350)
			})
        }
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

.botHandle {
	width: 100%;
	background: #fff;
	.wrap {
		padding: 15rpx 20rpx;
		position: relative;
		height: 100rpx;
		.checkbox {
			position: absolute;
			left: 36rpx; top: 50%;
			transform: translateY(-50%);
			width: 130rpx; display: flex;
			align-items: center;
			justify-content: flex-start;
			.grey{
				font-size: 24rpx;
			}
		}
		.removeBtn {
			position: absolute;
			left: 160rpx; top: 50%;
			transform: translateY(-50%);
			// ::v-deep button {
			// 	background: #fff !important;
			// 	width: 140rpx !important;
			// 	height: 70rpx !important;
			// 	color: #333 !important;
			// 	font-size: 28rpx !important;
			// 	border: 0 !important;
			// 	&::after {
			// 		border: 0 !important;
			// 	}
			// 	&:active {
			// 		opacity: 0.6;
			// 	}
			// }
		}
		.total {
			position: absolute;
			left: 340rpx;
			top: 50%;
			transform: translateY(-50%);
			height: 70rrpx;
			color: #333;
			font-size: 28rpx;
			line-height: 70rpx;
			.money {
				color: #ff6f21;
				font-weight: bold;
				.unit {
					font-size: 22rpx;
				}
			}
		}
		.rBtn {
			position: absolute;
			right: 20rpx;
			top: 50%;
			transform: translateY(-50%);
			u-button {
				::v-deep button {
					width: 180rpx;
					height: 70rpx;
					color: #fff !important;
					font-size: 28rpx !important;
					line-height: 70rpx !important;
					border-color: #fff !important;
					&:active {
						opacity: 0.6;
					}
				}
			}
		}
	}
}
</style>