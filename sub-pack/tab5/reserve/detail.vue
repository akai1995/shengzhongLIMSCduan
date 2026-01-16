<style lang="scss" scoped>
@import './asserts/detail.scss';
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
                <view class="reserve-detail-status-red-text" v-if="detailData.deviceReserveStatus == 7">{{ rejectDes }}
                </view>
            </view>
        </view>

        <view class="reserve-detail-info">
            <view class="reserve-detail-info-pic">
                <image class="reserve-detail-info-img"
                    :src="detailData.deviceImg ? detailData.deviceImg : $staticPath+'device-appointment/image.png'" />
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
            <u-button @click="handleStart" type="primary" text="开机" />
        </view>
        <view class="submit-button" v-if="detailData.deviceReserveStatus == 5 && detailData.deviceStatus == 1">
            <u-button @click="handleClose" type="primary" text="关机" />
        </view>
        <view class="submit-button" v-if="cancelReserve.button">
            <u-button @click="handleCancelReserveClick" type="primary" text="取消预约" />
        </view>

        <u-modal :show="cancelReserve.visible" title="取消预约" showCancelButton @confirm="handleSubmitReserve"
            @cancel="handleCancelReserve">
            <u--textarea v-model="cancelReserve.description" placeholder="请输入取消原因" :autoHeight="false" />
        </u-modal>
    </view>
</template>

<script>
import { reserveDetail, getRejectDes, openDevice, closeDevice, cancelReserve } from '@/app/api/device/index.js'

export default {
    data() {
        return {
            reserveId: null,
            detailData: null,
            rejectDes: null,
            cancelReserve: { visible: false, description: '', button: false }
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
        checkTime() {
            const startTimeStr = this.detailData.reserveTime.split(' - ')[0];
            const startTime = new Date(startTimeStr.replace(' ', 'T') + ':00');
            const currentTime = new Date();
            const timeDifference = startTime - currentTime;
            if (timeDifference > 2 * 60 * 60 * 1000) {
                return true;
            }
            return false;
        },
        checkCancelReserveStatus() {
            if (this.detailData.deviceReserveStatus != 3 && this.detailData.deviceReserveStatus != 5 && this.detailData.deviceReserveStatus != 6 && this.detailData.deviceReserveStatus != 7) {
                return true
            } else {
                return false
            }
        },
        getReserveDetail() {
            reserveDetail(this.reserveId).then((resp) => {
                if (resp.code == 200) {
                    this.detailData = resp.result
                    if (resp.result.deviceReserveStatus == 7) {
                        this.getRejectDes()
                    }
                    if (this.checkCancelReserveStatus() && this.checkTime()) {
                        this.cancelReserve.button = true
                    }
                }
            });

        },
        getRejectDes() {
            getRejectDes(this.reserveId).then((resp) => {
                if (resp.code == 200) {
                    this.rejectDes = resp.result.comment
                }
            });
        },
        handleGoBack() {
            this.$eUni.navBack()
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
        handleCancelReserveClick() {
            this.cancelReserve.visible = true
            this.cancelReserve.description = ''
        },
        handleSubmitReserve() {
            if (!this.cancelReserve.description) {
                uni.showToast({ title: "请填写取消原因", icon: "none", });
                return
            }
            const pushData = {
                cancelReason: this.cancelReserve.description,
                instrmentReserveId: this.reserveId
            }
            cancelReserve(pushData).then((resp) => {
                if (resp.code == 200) {
                    uni.showToast({ title: "取消预约成功", icon: "none", });
                    this.getReserveDetail()
                    this.cancelReserve.button = false
                    this.cancelReserve.visible = false
                }
            });
        },
        handleCancelReserve() {
            this.cancelReserve.visible = false
        }
    },
};
</script>
