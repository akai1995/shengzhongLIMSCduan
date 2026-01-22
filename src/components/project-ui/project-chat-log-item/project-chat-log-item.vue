<template>
    <view class="liItem" :class="{ on: item.checked }" @touchmove.stop.prevent>
        <view class="lCheck" @click="onToggle"><text class="widget_check"></text></view>
        <view class="pecific" @click="onView">
            <view class="summary">{{ item.index }}.{{ item.content }}</view>
            <view class="date">{{ item.createTime }}</view>
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
            index: 1, createTime: '12-08 10:20:30', checked: false,
            content: '这是分析名称，这是分析名称，这是分析名称，这是分析名称（最多30个字符）',            
        }
      }
    }
  },
  data() {
    return { }
  },
  methods: {
        onToggle() {
            this.$emit('toggle', this.item);
        },
		onView() {
            this.$emit('view', this.item);
		}
  }
}
</script>

<style lang="scss" scoped>
    .liItem {
        position: relative;
        padding: 24rpx 28rpx 24rpx 92rpx;
        background-color: white;
        // padding: 32rpx;
        margin-bottom: 20rpx;
        border-radius: 20rpx;
        .lCheck {
            position: absolute;
            top: 48rpx; left: 30rpx;
            width: 36rpx; height: 36rpx;
            .widget_check {
                display: inline-block;
                width: 36rpx;
                height: 36rpx;
                @include background-image('imgs/icon-radio1.png');
            }
        }
        &.on {
            .lCheck {
                .widget_check {
                    @include background-image('imgs/icon-radio2.png');
                }
            }
        }
        .pecific {
            .summary {
                color: #222;
                font-size: 28rpx;
                line-height: 44rpx;
                height: 88rpx;
                font-weight: 400;
                display: -webkit-box;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 2; /* 改为需要的行数 */
                overflow: hidden;
                text-overflow: ellipsis;
            }
            .date {
                color: #9699A1;
                font-size: 24rpx;
                line-height: 34rpx;
                font-weight: 400;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
            }
        }
    }
</style>
