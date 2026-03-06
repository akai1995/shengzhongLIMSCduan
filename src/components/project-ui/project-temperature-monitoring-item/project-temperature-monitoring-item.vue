<template>
    <view class="temperature-monitoring-item" :class="statusClass" @click="onView(item.id)">
       <view class="item-name">
            这是设备名称（这是正常温度样式）
        </view>
        <view class="item-sn">
            设备SN：800640220648
        </view>
        <view class="item-temperature">
            <view class="temperature-box">
                <view class="temperature-box-label temperature">
                    23.5℃
                </view>
                <view class="temperature-box-name">
                    温度
                </view>
            </view>
            <view class="temperature-box">
                <view class="temperature-box-label">
                    0-35.0℃
                </view>
                <view class="temperature-box-name">
                    预警范围
                </view>
            </view>
        </view>
    </view>
</template>
<script>
export default {
    props: { 
        hideLine: { type: Boolean, default: false }, 
        item: { type: Object, default: () => { return { } } } 
    }, 
    data() { 
        return {

        }
    },
    computed: {
        statusClass() {
            // 随机输出class，实际使用时根据温度值判断
            return ['', 'blue', 'red'][Math.floor(Math.random() * 3)]
        }
    },
    methods: { 
        onView(id) { 
            if (!this.checkUserInfo()){ return } 
            this.$ut.jump(`/sub-pack/tab5/temperature-monitoring/temperature-monitoring-detail?id=${id}`); 
        } 
    }
}
</script>

<style lang="scss" scoped>
    .temperature-monitoring-item {
        background-color: white;
        width: 100%;
        padding: 32rpx;
        border-radius: 12rpx;
        position: relative;
        overflow: hidden;
        &:not(:last-child) {
            margin-bottom: 20rpx;
        }
        &::after {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 12rpx;
            background-color: #fff;
            transform: scaleY(0.5);
            transform-origin: 0 0;
        }
        &.blue{
            &::after {
                background-color: #0D70F3;
            }
            .item-temperature {
                .temperature-box {
                    .temperature {
                        color: #0D70F3;
                    }
                }
            }
        }
        &.red{
            &::after {
                background-color: #E72929;
            }
            .item-temperature {
                .temperature-box {
                    .temperature {
                        color: #E72929;
                    }
                }
            }
        }
        .item-name {
            font-size: 32rpx;
            color: #222222;
            line-height: 50rpx;
            font-size: bold;
            margin-bottom: 8rpx;
        }
        .item-sn {
            font-size: 28rpx;
            color: #4B4B4E;
            line-height: 40rpx;
            margin-bottom: 24rpx;
        }
        .item-temperature {
            display: flex;
            align-items: center;
            justify-content: center;
            background-color: #F0F2F7;
            border-radius: 12rpx;
            .temperature-box {
                width: 50%;
                display: flex;
                flex-direction: column;
                align-items: center;
                padding: 24rpx;
                .temperature-box-label {
                    font-size: 36rpx;
                    color: #222222;
                    line-height: 50rpx;
                }
                .temperature-box-name {
                    font-size: 28rpx;
                    color: #4B4B4E;
                    line-height: 40rpx;
                }
            }
        }
    }
</style>
