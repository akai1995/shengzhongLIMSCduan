<template>
    <view class="liItem">
        <view class="liItemInfo">
            <view class="cover">
                <image style="width:100%;height: 100%;" :src="item.deviceImg || `${$staticPath}imgs/devcieCover.png`" />
            </view>
            <view class="pecific">
                <view class="deviceName">{{ item.deviceName }}</view>
                <view class="summary">设备编号{{ item.deviceCode || '' }}</view>
                <view class="summary">收费标准{{ item.priceDesc || '' }}</view>
                <view class="summary">{{ item.deviceAddress || "暂无设备地址" }}</view>
            </view>
        </view>
        <view class="botHandle pubBotHandle" :class="{pubBotLine:!hideLine}">
            <view class="btn" @click.stop="onView(item.id, item.deviceId)">
                <u-button type="primary" size="small" text="去预约" />
            </view>
        </view>
    </view>
</template>

<script>
export default {
  props: {
    hideLine  : {
      type: Boolean,
      default: false
    },
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
		onView(id, deviceId) {
            // if (!this.checkUserInfo()){ return }
			this.$ut.jump(`/sub-pack/tab1/device/detail?instrumentId=${id}&deviceId=${deviceId}`);
		}
  }
}
</script>

<style lang="scss" scoped>
    .liItem {
        // padding: 32rpx;
        border-radius: 20rpx;
        margin-bottom: 32rpx;
        .liItemInfo {
            position: relative;
            padding: 0 0 0 244rpx;
            .cover {
                position: absolute;
                top: 0; left: 0;
                width: 220rpx;
                height: 160rpx;
                border-radius: 8rpx;
                overflow: hidden;
                image {
                    border-radius: 8rpx;
                    width: 100% !important;
                    height: 100% !important;
                }
            }
            .pecific {
                .deviceName {
                    color: #222;
                    font-size: 32rpx;
                    line-height: 42rpx;
                    font-weight: 500;
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                }
                .summary {
                    color: #9699A1;
                    font-size: 24rpx;
                    line-height: 42rpx;
                    font-weight: 400;
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                }
            }
        }

        .pubBotHandle {
            margin-top: 0;
        }
    }
</style>
