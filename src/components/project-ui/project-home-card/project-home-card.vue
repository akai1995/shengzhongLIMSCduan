<template>
    <view class="cardBox">
        <view class="cardWarp f1" @click="onJump('ocr-recognition/ocr-recognition')">
            <view class="cardInfo">
                <view class="cardTitle">图文识别</view>
                <view class="cardSubTitle">扫图识字，一扫既得</view>
            </view>
            <view class="cardIcon">
                <u-icon :name="`${$staticPath}temp/imgs/img-ocr.png`" size="140rpx" />
            </view>
        </view>
        <view class="cardWarp f2" @click="onJump('chat-history-stream/chat-history-stream')">
            <view class="cardInfo">
                <view class="cardTitle">报告分析</view>
                <view class="cardSubTitle">医疗报告智能分析助手</view>
            </view>
            <view class="cardIcon">
                <u-icon :name="`${$staticPath}temp/imgs/img-report.png`" size="140rpx" />
            </view>
        </view>
    </view>
</template>

<script>
export default {
  props: {
    item: {
      type: Object,
      default: () => {
        return {
        }
      }
    }
  },
  data() {
    return { };
  },
  methods: {
		onJump(name){
			this.$eUni.navTo({
				url: '/sub-pack/tab1/' + name
			})
		}
  }
}
</script>

<style lang="scss" scoped>
    .cardBox{
        display: flex;
        justify-content: flex-start;
        gap: 22rpx;
        .f1 {
		    @include background-image('temp/imgs/img-ocr-bg.png');
            .cardInfo{
                .cardSubTitle{
                    color: #7D6B54;
                }
            }
        }
        .f2 {
		    @include background-image('temp/imgs/img-report-bg.png');
            .cardInfo{
                .cardSubTitle {
                    color: #4B5980;
                }
            }
        }
        .cardWarp {
            width: 332rpx;
            height: 200rpx;
            position: relative;
            padding: 20rpx 140rpx 20rpx 20rpx;
            border-radius: 24rpx;
            .cardInfo{
                .cardTitle {
                    font-weight: bold;
                    color: #222;
                    font-size: 32rpx;
                    line-height: 50rpx;
                }
                .cardSubTitle {
                    font-weight: 400;
                    color: #222;
                    font-size: 24rpx;
                    line-height: 34rpx;
                }
            }
            .cardIcon {
                position: absolute;
                bottom: 0; right: 0;
                width: 140rpx;
                height: 140rpx;
                border-radius: 8rpx;
                overflow: hidden;
                image {
                    width: 100% !important;
                    height: 100% !important;
                }
            }
        }
    }
</style>
