<template>
    <view class="reserve-item" @click="onView(item.id)">
        <div class="reserve-item-content">
            <view class="reserve-pic">
                <image class="reserve-img" :src="item.deviceImg ? item.deviceImg : `${$staticPath}imgs/devcieCover.png`" />
            </view>
            <view class="reserve-info">
                <view class="reserve-info-head">
                    <view class="reserve-info-head-title">{{ item.deviceName }}</view>
                    <view class="reserve-info-head-status blue" :class="{
                            blue:[1,2].includes(item.deviceReserveStatus),
                            green:[4,5,6].includes(item.deviceReserveStatus),
                            red:[3,7].includes(item.deviceReserveStatus),
                        }"
                    > 
                        {{ item.deviceReserveStatus_dictText }}
                    </view>
                </view>
                <view class="reserve-info-message">
                    <view class="reserve-info-message-top">{{ item.reserveTime }}</view>
                    <view class="reserve-info-message-bottom">用途：{{ item.reservePurpose || "暂无" }}</view>
                </view>
            </view>
        </div>
        <!-- <view class="reserve-reject" v-if="item.deviceReserveStatus == 7">
            <span class="reserve-reject-title">拒绝原因：</span>
            <span class="reserve-reject-text">这个时间段有其他的用途，请换个时间</span>
        </view> -->
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
        onView(id) {
            if (!this.checkUserInfo()){ return }
            this.$ut.jump(`/sub-pack/tab5/reserve/detail?id=${id}`);
        }
    }
}
</script>

<style lang="scss" scoped>
    .reserve-item {
        position: relative;
        width: 100%;
        border-bottom: 1px solid #e6e9f1;
        margin-bottom: 30rpx;
        padding-bottom: 30rpx;
        &:last-child {
            border-bottom: none;
        }

        .reserve-item-content {
            position: relative;
            width: 100%;
            display: flex;
            align-items: stretch;
            .reserve-pic {
                position: relative;
                width: 76px;
                height: 76px;
                .reserve-img {
                    position: relative;
                    width: 100%;
                    height: 100%;
                    display: block;
                }
            }
            .reserve-info {
                position: relative;
                width: calc(100% - 76px);
                display: flex;
                flex-direction: column;
                padding: 5rpx;
                padding-left: 20rpx;
                box-sizing: border-box;
                .reserve-info-head {
                    position: relative;
                    width: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    .reserve-info-head-title {
                        position: relative;
                        width: calc(100% - 44px);
                        overflow: hidden;
                        white-space: nowrap;
                        text-overflow: ellipsis;
                        font-weight: 500;
                        font-size: 16px;
                        color: #000000;
                        line-height: 19px;
                    }
                    .reserve-info-head-status {
                        position: relative;
                        width: 44px;
                        font-weight: 400;
                        font-size: 14px;
                        line-height: 16px;
                    }
                    .blue {
                        color: #0d70f3;
                    }
                    .green {
                        color: #03ab6e;
                    }
                    .red {
                        color: #e72929;
                    }
                }
                .reserve-info-message {
                    position: relative;
                    width: 100%;
                    margin-top: auto;
                    .reserve-info-message-top {
                        position: relative;
                        width: 100%;
                        font-weight: 400;
                        font-size: 14px;
                        color: #4b4b4e;
                        line-height: 16px;
                        margin-bottom: 5rpx;
                    }
                    .reserve-info-message-bottom {
                        position: relative;
                        width: 100%;
                        font-weight: 400;
                        font-size: 14px;
                        color: #9699a1;
                        line-height: 16px;
                        overflow: hidden;
                        white-space: nowrap;
                        text-overflow: ellipsis;
                    }
                }
            }
        }
        .reserve-reject {
            position: relative;
            width: 100%;
            margin-top: 20rpx;
            background: rgba(231, 41, 41, 0.1);
            border-radius: 4px 4px 4px 4px;
            padding: 10px;
            display: flex;
            align-items: center;
            box-sizing: border-box;
            .reserve-reject-title {
                position: relative;
                width: 70px;
                font-family: PingFang SC, PingFang SC;
                font-weight: 400;
                font-size: 14px;
                color: #e72929;
                line-height: 16px;
                text-align: left;
                font-style: normal;
                text-transform: none;
            }
            .reserve-reject-text {
                position: relative;
                width: calc(100% - 70px);
                font-family: PingFang SC, PingFang SC;
                font-weight: 400;
                font-size: 14px;
                color: #4b4b4e;
                line-height: 16px;
                text-align: left;
                font-style: normal;
                text-transform: none;
                margin-right: auto;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
            }
        }
    }
</style>
