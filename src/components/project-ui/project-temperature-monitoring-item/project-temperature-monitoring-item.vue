<template>
        <view class="liItem" :class="[statusClass]" :style="hideMb ? 'margin-bottom: 0;' : ''" @click="onView(item.sn)">
            <view class="item-name">
            {{item.deviceName}}
        </view>
        <view class="item-sn">
            <text>设备SN：</text>{{item.sn}}
        </view>
        <view class="item-temperature">
            <view class="temperature-box">
                <view class="temperature-box-label temperature">
                    {{item.currentTemperature}}℃
                </view>
                <view class="temperature-box-name">
                    温度
                </view>
            </view>
            <view class="temperature-box">
                <view class="temperature-box-label">
                    {{item.temperatureLow}}~{{item.temperatureHigh}}℃
                </view>
                <view class="temperature-box-name">
                    预警范围
                </view>
            </view>
        </view>
    </view>
</template>
<script>
function objToStr(obj) {
  let str = "";
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      str += `${key}=${obj[key]}&`;
    }
  }
  // 去掉最后一个 &
  return str.slice(0, -1);
}
export default {
    props: { 
        hideMb: { type: Boolean, default: false }, 
        item: { 
            type: Object, 
            default: () => { 
                return {
                    id: "1",
                    deviceName: "",
                    sn: "800640220648",
                    currentTemperature: "20.7",
                    temperatureHigh: "35",
                    temperatureLow: "0",
                    tenantIds: null,
                    timeCode: "01",
                    type: "ydg",
                    // '1':高温预警，'2':低温预警，null：正常
                    warning: null,
                } 
            } 
        } 
    }, 
    data() { 
        return {

        }
    },
    computed: {
        statusClass() {
            // 随机输出class，实际使用时根据温度值判断
            const { warning, currentTemperature, temperatureHigh, temperatureLow } = this.item
            const a = Number(currentTemperature)
            const b = Number(temperatureHigh)
            const c = Number(temperatureLow)
            // 检查是否为有效数字
            if (isNaN(a) || isNaN(b) || isNaN(c)) {
                return ''
            }
            if (a < c) {
                return 'blue'
            } else if (a > b){
                return 'red'
            }
            else {
                return ''
            }
            // switch (warning) {
            //     case '1': return 'red'
            //     case '2': return 'blue'
            //     default: return ''
            // }
            // return ['', 'blue', 'red'][Math.floor(Math.random() * 3)]
        }
    },
    methods: { 
        onView(sn) { 
            if (!this.checkUserInfo()){ return } 
            this.$ut.jump(`/sub-pack/tab5/temperature-monitoring/temperature-monitoring-detail?${objToStr(this.item)}`); 
        } 
    }
}
</script>

<style lang="scss" scoped>
    .liItem {
        background-color: white;
        width: 100%;
        padding: 32rpx;
        border-radius: 12rpx;
        position: relative;
        overflow: hidden;
        margin-bottom: 32rpx;
        &:last-child {
            margin-bottom: 0;
            border-bottom: none;
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
            text{
                font-size: bold;
            }
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
                    font-size: bold;
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
