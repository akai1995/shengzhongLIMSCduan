<style lang="less" scoped>
@import './asserts/detail.less';
</style>

<template>
    <view class="reserve-detail">
        <ut-nav title="预约详情" @onBack="handleGoBack" border></ut-nav>

        <view class="reserve-detail-status">
            <view class="reserve-detail-status-blue"
                v-if="detailData.deviceReserveStatus == 1 || detailData.deviceReserveStatus == 2">
                {{ detailData.deviceReserveStatus_dictText }}
            </view>
            <view class="reserve-detail-status-green"
                v-if="detailData.deviceReserveStatus == 4 || detailData.deviceReserveStatus == 5 || detailData.deviceReserveStatus == 6">
                {{ detailData.deviceReserveStatus_dictText }}
            </view>
            <view class="reserve-detail-status-red"
                v-if="detailData.deviceReserveStatus == 3 || detailData.deviceReserveStatus == 7">
                <view class="reserve-detail-status-red-title">{{ detailData.deviceReserveStatus_dictText }}</view>
                <view class="reserve-detail-status-red-text">{{ rejectDes }}</view>
            </view>
        </view>

        <view class="reserve-detail-info">
            <view class="reserve-detail-info-pic">
                <img class="reserve-detail-info-img"
                    src="https://genepiapi.ypzlfx.com/file/device-appointment/image.png" />
            </view>
            <view class="reserve-detail-info-message">
                <view class="reserve-detail-info-message-title">{{ detailData.deviceName }}</view>
                <view class="reserve-detail-info-message-date">{{ detailData.reserveTime }}</view>
                <view class="reserve-detail-info-message-use">用途：{{ detailData.reservePurpose || "暂无" }}</view>
            </view>
        </view>

        <view class="reserve-detail-user">
            <view class="reserve-detail-user-item">用户名：{{ detailData.reserveName }}</view>
            <view class="reserve-detail-user-item">电话：{{ detailData.reservePhone }}</view>
            <view class="reserve-detail-user-item">提交时间：{{ detailData.updateTime }}</view>
        </view>

        <view class="submit-button"
            v-if="(detailData.deviceReserveStatus == 4 && detailData.deviceStatus == 0) || (detailData.deviceReserveStatus == 5 && detailData.deviceStatus == 0)">
            <u-button @click="handleStart" type="primary" text="开机"></u-button>
        </view>
        <view class="submit-button" v-if="detailData.deviceReserveStatus == 5 && detailData.deviceStatus == 1">
            <u-button @click="handleClose" type="primary" text="关机"></u-button>
        </view>
    </view>
</template>

<script>
import { reserveDetail, getRejectDes, openDevice, closeDevice } from '@/api/device/index.js'

export default {
    data() {
        return {
            reserveId: null,
            detailData: null,
            rejectDes: null
        };
    },
    onLoad(options) {
        this.reserveId = options.id;
        this.getReserveDetail()
    },
    methods: {
        hidePhoneNumber(phoneNumber) {
            return phoneNumber.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
        },
        getReserveDetail() {
            reserveDetail(this.reserveId).then((resp) => {
                if (resp.code == 200) {
                    this.detailData = resp.result
                    if (resp.result.deviceReserveStatus == 3 || resp.result.deviceReserveStatus == 7) {
                        this.getRejectDes()
                    }
                }
            });

        },
        getRejectDes() {
            getRejectDes(this.reserveId).then((resp) => {
                if (resp.code == 200) {
                    this.rejectDes = resp.result
                }
            });
        },
        handleGoBack() {
            uni.navigateBack()
        },
        handleStart() {
            openDevice(this.reserveId).then((resp) => {
                if (resp.code == 200) {
                    uni.showToast({ title: "开机成功", icon: "none", });
                    this.getReserveDetail()
                }
            });
        },
        handleClose() {
            closeDevice(this.reserveId).then((resp) => {
                if (resp.code == 200) {
                    uni.showToast({ title: "关机成功", icon: "none", });
                    this.getReserveDetail()
                }
            });
        },
    },
};
</script>
