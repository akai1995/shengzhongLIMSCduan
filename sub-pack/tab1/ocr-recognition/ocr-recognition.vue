<template>
	<z-paging 
        ref="zPagingRef" class="page" :paging-style="{backgroundColor: 'white'}" v-model="dataList" @query="queryList"
        :fixed="true" :auto="false" :refresher-enabled="false" :auto-show-back-to-top="true" :auto-scroll-to-top-when-reload="false"
        :loading-more-enabled="false" :show-refresher-when-reload="false" hide-empty-view
    >
		<view class="content">
			<view class="tipBox">
                <view class="tipTitle">上传图片</view>
                <view class="tipTitle">帮您<text class="tipBb">OCR智能识别提取文字</text></view>
                <view class="subTip">您可以上传需要识别的图片，我们将为您智能识别提取文字信息~</view>
                <view class="imgBox">
                    <view class="scanBox">
                        <image src="@/static/temp/ocr-icon.png" />
                    </view>
                    <view class="scanTip">请上传图文清晰的图片</view>
                </view>
			</view>
		</view>
		<view slot="bottom" class="pubBotBtn">            
            <view class="wrap">
                <u-icon name="@/static/temp/icon-history.png" size="45rpx" />
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
</template>

<script>
// 注意：这里需要替换为实际的API调用
function pickExclude(obj, keys) {
	// 某些情况下，type可能会为
    if (!['[object Object]', '[object File]'].includes(Object.prototype.toString.call(obj))) {
        return {}
    }
    return Object.keys(obj).reduce((prev, key) => {
        if (!keys.includes(key)) {
            prev[key] = obj[key]
        }
        return prev
    }, {})
}
export default {
	data() {
		return {
			dataList: [], totalCount: 0, firstLoaded: false
		};
	},
	mounted() {
		setTimeout(() => {
		    this.$refs.zPagingRef && this.$refs.zPagingRef.refresh();
		}, 250);
	},
	methods: {
		checkUserInfo() {
			const id = this.$store.getters.userId
			if (!id) {
				this.$ut.jump("/project-pages/login/login");
				return;
			}
		},
		queryList(pageNo, pageSize) {
			this.$refs.zPagingRef.endRefresh()
            // this.$refs.zPagingRef.complete()
            // this.firstLoaded = true;
            uni.hideLoading();
		},
        chooseFile() {
            const {
                maxCount,
                multiple,
                lists,
                disabled
            } = this;
            if (disabled) return;
        },
        onChoose(sourceType){
            chooseFile(
                Object.assign({
                    accept: 'image',
                    multiple: false,
                    capture: [sourceType],
                    compressed: true,
                    maxDuration: 60,
                    sizeType: uni.$u.props.upload.sizeType,
                    camera: 'back',
                }, {
                    maxCount: maxCount - lists.length,
                })
            )
            .then((res) => {
                console.log('res[0]')
            })
            .catch((error) => {
                this.$emit('error', error);
            });
        }
	},
};
</script>
<style lang="scss" scoped>
    .content{
        padding: 32rpx;
        .tipBox {
			padding: 24rpx;
            background-image: url(/static/temp/ocr-bg.png);
            background-repeat: no-repeat;
            background-position: center center;
            background-size: cover;
            border-radius: 12rpx;
            .tipTitle{
                font-size: 32rpx;
                line-height: 48rpx;
                font-weight: bold;
                color: #000;
                .tipBb{
                    color: #0D70F3;
                }
            }
            .subTip{
                margin-top: 20rpx;
                font-size: 24rpx;
                line-height: 34rpx;
                color: #535873;
            }
            .imgBox{
				background-color: white;
				border-radius: 24rpx;
				padding: 48rpx;
                .scanBox{
						width: 100%;
					image{
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
    padding: 20rpx;
    display: flex;
    align-items: center;
    justify-content: space-between;
	.wrap {
		.btn {
			padding: 15rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			flex: 1;
			background: transparent !important;
			color: #000 !important;
			border-color: #fff !important;

			&::after {
				border-color: #fff !important;
			}

			&:active {
				opacity: 0.6;
			}

			&.u-defaulit-hover {
				background: transparent !important;
			}

			&::before {
				content: '';
				position: absolute;
				right: 0;
				top: 50%;
				transform: translateY(-50%);
				width: 1rpx;
				height: 50rpx;
				background: #ddd;
			}

			&:last-child {
				&::before {
					width: 0;
				}
			}
		}
	}
}
</style>