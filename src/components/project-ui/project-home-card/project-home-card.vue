<template>
    <view class="cardBox">
        <view v-if="hasAction('tab1:ocr-recog')" class="cardWarp f1" @click="onJump('tab1/ocr-recog/ocr-recog')">
            <view class="cardInfo">
                <view class="cardTitle">
                    图文识别
                    <u-icon class="iconR" :name="`${$staticPath}imgs/home_card_r_1.png`" size="32rpx" />
                </view>
                <view class="cardSubTitle">扫图识字，一扫既得</view>
            </view>
            <view class="cardIcon">
                <u-icon :name="`${$staticPath}imgs/home_card_1.png`" size="140rpx" />
            </view>
        </view>
        <view v-if="hasAction('tab1:chat')" class="cardWarp f2" @click="onJump('chat/chat-stream/chat-stream')">
            <view class="cardInfo">
                <view class="cardTitle">
                    报告分析
                    <u-icon class="iconR" :name="`${$staticPath}imgs/home_card_r_2.png`" size="32rpx" />
                </view>
                <view class="cardSubTitle">医疗报告智能分析助手</view>
            </view>
            <view class="cardIcon">
                <u-icon :name="`${$staticPath}imgs/home_card_2.png`" size="140rpx" />
            </view>
        </view>
        <view v-if="hasAction('tab1:chat')" class="cardWarp f3" @click="onJump('tab5/reserve/reserve')">
            <view class="cardInfo">
                <view class="cardTitle">
                    设备预约
                    <u-icon class="iconR" :name="`${$staticPath}imgs/home_card_r_3.png`" size="32rpx" />
                </view>
                <view class="cardSubTitle">实验室设备预约</view>
            </view>
            <view class="cardIcon">
                <u-icon :name="`${$staticPath}imgs/home_card_3.png`" size="140rpx" />
            </view>
        </view>
        <view v-if="hasAction('tab1:chat')" class="cardWarp f4" @click="onJump('tab5/sign-doc/sign-doc')">
            <view class="cardInfo">
                <view class="cardTitle">
                    待签署文件
                    <u-icon class="iconR" :name="`${$staticPath}imgs/home_card_r_4.png`" size="32rpx" />
                </view>
                <view class="cardSubTitle">一键签署，高效便捷</view>
            </view>
            <view class="cardIcon">
                <u-icon :name="`${$staticPath}imgs/home_card_4.png`" size="140rpx" />
            </view>
        </view>
        <view v-if="hasAction('tab1:chat')" class="cardWarp f5" @click="onJump('tab5/temperature-monitoring/temperature-monitoring')">
            <view class="cardInfo">
                <view class="cardTitle">
                    温度监控
                    <u-icon class="iconR" :name="`${$staticPath}imgs/home_card_r_5.png`" size="32rpx" />
                </view>
                <view class="cardSubTitle data">
                    <view class="">
                        预警低温：
                        <text>20</text>
                    </view>
                        
                    <view class="">
                        预警高温：
                        <text>20</text>
                    </view>
                </view>
            </view>
            <view class="cardIcon">
                <u-icon :name="`${$staticPath}imgs/home_card_5.png`" size="140rpx" />
            </view>
        </view>
    </view>
</template>

<script>
export default {
    props: { item: { type: Object, default: () => { return { } } } }, data() { return { } },
    methods: {
        onJump(name){
            if (!this.checkUserInfo()) { return; };
            this.$eUni.navTo({ url: `/sub-pack/${name}` })
        }
    }
}
</script>

<style lang="scss" scoped>
.cardBox {
    // display: flex; flex-direction: column; align-items: flex-start; justify-content: flex-start; gap: 22rpx;
    .f1 { @include background-image('imgs/home_card_bg_1.png'); }
    .f2 { @include background-image('imgs/home_card_bg_2.png'); }
    .f3 { @include background-image('imgs/home_card_bg_3.png'); }
    .f4 { @include background-image('imgs/home_card_bg_4.png'); }
    .f5 { @include background-image('imgs/home_card_bg_5.png'); }
    .cardWarp {
        width: auto; height: 180rpx; position: relative;
        padding: 20rpx 140rpx 20rpx 32rpx; border-radius: 24rpx;
        margin-bottom: 20rpx; &:last-child { margin-bottom: 0; }
        .cardInfo {
            .cardTitle {
                display: flex; align-items: center; justify-content: flex-start; font-weight: bold; color: #000; font-size: 32rpx; line-height: 50rpx; line-height: 64rpx; gap: 8rpx;
                // .iconR { margin-left: 8rpx; }
            }
            .cardSubTitle { 
                font-weight: 400; color: #4B4B4E ; font-size: 24rpx; line-height: 56rpx;
                &.data {
                    gap: 20rpx; display: flex; align-items: center; justify-content: flex-start;
                    text { color: #222; font-size: 24rpx; font-weight: bold; margin-left: 8rpx; }
                }
            } 
        }
        .cardIcon { 
            position: absolute; top: 16rpx; right: 24rpx; width: 140rpx; border-radius: 8rpx; overflow: hidden; height: 140rpx;
            image { width: 100% !important; height: 100% !important; }
        }
    }
}
</style>
