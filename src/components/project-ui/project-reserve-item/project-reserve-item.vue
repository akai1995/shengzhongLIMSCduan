<template>
    <view class="liItem" @click="onView(item.id)">
        <div class="liItemContent">
            <view class="reservePic">
                <image class="reserveImg" :src="item.deviceImg ? item.deviceImg : `${$staticPath}imgs/devcieCover.png`" />
            </view>
            <view class="info">
                <view class="infoHead" :class="{'noStatus':noStatus}">
                    <view class="infoHeadTitle">{{ item.deviceName }}</view>
                    <view class="infoHeadStatus" :class="{
                            blue:[1,2].includes(item.deviceReserveStatus),
                            green:[4,5,6].includes(item.deviceReserveStatus),
                            red:[3,7,8,9].includes(item.deviceReserveStatus),
                        }"
                    >
                        {{ dictText }}
                    </view>
                </view>
                <view class="infoMessage">
                    <view class="infoMessageTop">{{ item.reserveTime }}</view>
                    <view class="infoMessageBottom">用途：{{ item.reservePurpose || "暂无" }}</view>
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
        hideLine: { type: Boolean, default: false },
        noStatus: { type: Boolean, default: false },
        item: { type: Object, default: () => { return { } } }
    },
    data() {
        return { }
    },
    computed: {
        dictText() {
            if (!this.item) return ''
            if (this.item&&!this.item.hasOwnProperty('deviceReserveStatus')) return ''
            const dictText = this.item.deviceReserveStatusName || ''
            if (dictText) return dictText
            const deviceReserveStatus = this.item.deviceReserveStatus
            const statusMap = {
                1: '待审批', 2: '审批中', 3: '已取消',
                4: '待上机', 5: '上机中', 6: '已上机',
                7: '驳回', 8: '爽约', 9: '解除爽约',
            }
            return statusMap[deviceReserveStatus] || ''
        }
    },
    methods: {
        onView(id) {
            if (!this.checkUserInfo()) { return }
            this.$ut.jump(`/sub-pack/tab5/reserve/detail?id=${id}`);
        }
    }
}
</script>
<style lang="scss" scoped>
.liItem {
    position: relative;
    width: 100%;
    border-bottom: 2rpx solid #e6e9f1;
    padding-bottom: 12rpx;
    margin-bottom: 32rpx;
    &:last-child {
        margin-bottom: 0;
        border-bottom: none;
    }

    .liItemContent {
        position: relative;
        width: 100%;
        display: flex;
        align-items: stretch;
        .reservePic {
            position: relative;
            width: 152rpx;
            height: 152rpx;
            border-radius: 8rpx;
            overflow: hidden;
            .reserveImg {
                position: relative;
                width: 100%;
                height: 100%;
                display: block;
            }
        }
        .info {
            position: relative;
            width: calc(100% - 152rpx);
            display: flex;
            flex-direction: column;
            padding: 5rpx;
            padding-left: 20rpx;
            box-sizing: border-box;
            .infoHead {
                position: relative;
                width: 100%; display: flex;
                align-items: center;
                justify-content: space-between;
                &.noStatus {
                    display: block;
                    .infoHeadStatus { display: none; }
                }
                .infoHeadTitle {
                    position: relative;
                    width: calc(100% - 44px);
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                    font-weight: 500;
                    font-size: 32rpx;
                    color: #000000;
                    line-height: 58rpx;
                }
                .infoHeadStatus {
                    position: relative;
                    width: 88rpx;
                    font-weight: 400;
                    font-size: 28rpx;
                    line-height: 32rpx;
                    &.blue { color: #0d70f3; }
                    &.green { color: #03ab6e; }
                    &.red { color: #e72929; }
                }
            }
            .infoMessage {
                position: relative; width: 100%;
                // margin-top: auto;
                .infoMessageTop {
                    position: relative;
                    width: 100%;
                    font-weight: 400;
                    font-size: 28rpx;
                    color: #4b4b4e;
                    line-height: 50rpx;
                }
                .infoMessageBottom {
                    position: relative;
                    width: 100%;
                    color: #9699a1;
                    font-size: 28rpx;
                    font-weight: 400;
                    line-height: 42rpx;
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
        border-radius: 8rpx 8rpx 8rpx 8rpx;
        padding: 20rpx;
        display: flex;
        align-items: center;
        box-sizing: border-box;
        .reserve-reject-title {
            position: relative;
            width: 140rpx;
            font-family: PingFang SC, PingFang SC;
            font-weight: 400;
            font-size: 28rpx;
            color: #e72929;
            line-height: 32rpx;
            text-align: left;
        }
        .reserve-reject-text {
            position: relative;
            width: calc(100% - 70px);
            font-family: PingFang SC, PingFang SC;
            font-weight: 400;
            font-size: 28rpx;
            color: #4b4b4e;
            line-height: 32rpx;
            text-align: left;
            margin-right: auto;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
        }
    }
}
</style>
