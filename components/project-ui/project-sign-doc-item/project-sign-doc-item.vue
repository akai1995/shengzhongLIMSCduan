<template>
    <view class="liItem">
        <view class="liItemInfo">
            <view class="pecific">
                <view class="signFileName">{{ item.signFileName }}</view>
                <view class="summary">发起人: {{ item.createBy }}</view>
                <view class="summary">发起时间: {{ item.createTime }}</view>
            </view>
        </view>
        <view class="botHandle pubBotHandle" :class="{pubBotLine:!hideLine}">
            <view class="btn" @click.stop="onSign(item.id)">
                <u-button type="primary" size="small" text="去签署" />
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
    return {
    };
  },
  methods: {
		onSign(id) {
            if (!this.checkUserInfo()){ return }
			this.$ut.jump(`/pages/tabs/tab1/doc-sign?id=${id}&showSign=true`);
		}
  }
}
</script>

<style lang="scss" scoped>			
    .liItem {
        margin-bottom: 20rpx;
        background-color: #fff;
        border-radius: 16rpx;
        box-shadow: 0 4rpx 15rpx rgba(0, 0, 0, 0.08);
        overflow: hidden;
        transition: all 0.3s ease;
        
        &:hover {
            transform: translateY(-2rpx);
            box-shadow: 0 6rpx 20rpx rgba(0, 0, 0, 0.12);
        }

        .liItemInfo {
            position: relative;
            padding: 24rpx;
            box-sizing: border-box;
            
            .pecific {
                position: relative;
                
                .signFileName {
                    color: #222;
                    font-size: 32rpx;
                    line-height: 44rpx;
                    font-weight: 500;
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                }
                
                .summary {
                    color: #9699A1;
                    font-size: 24rpx;
                    line-height: 44rpx;
                    font-weight: 400;
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                }
            }
        }

        .botHandle {
            height: 95rpx;
            display: flex;
            align-items: center;
            justify-content: flex-end;
            margin-top: 10rpx;
            .btn {
                background: transparent !important;
                margin: 0 !important;
                padding: 0 15rpx !important;
                color: #000 !important;
                font-size: 28rpx !important;
                .u-icon {
                    margin-right: 10rpx;
                }
                &::after {
                    border: 0 !important;
                }
                &:active {
                    opacity: 0.8;
                }
            }
        }
        
        &:last-child {
            margin-bottom: 0;
        }
    }
</style>
